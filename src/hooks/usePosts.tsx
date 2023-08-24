import { authModalState } from "@/atoms/authModalAtom";
import { communityState } from "@/atoms/communitiesAtom";
import { Post, PostState, PostVote } from "@/atoms/postsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { doc, deleteDoc, writeBatch, collection, query, getDocs, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(PostState)
    const [user] = useAuthState(auth)
    const router = useRouter()
    const currentCommunity = useRecoilValue(communityState).currentCommunity;
    const setAuthModalState = useSetRecoilState(authModalState)
    const onVote = async(event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string)=>{
        event.stopPropagation()
        if(!user?.uid){
            setAuthModalState({open: true, view: 'login'})
            return;
        }
        try {
            const {voteStatus} = post;
            const existingVote = postStateValue.postVotes.find(
                (vote) => vote.postId === post.id
            )
            const batch = writeBatch(firestore)
            const updatePost = {...post};
            const updatedPosts = [...postStateValue.posts]
            let  updatedPostVotes = [...postStateValue.postVotes]
            let voteChange = vote;

            // new vote
            if(!existingVote){
                // create a new postvote document
                const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`))
                
                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote, // 1 or -1
                }

                batch.set(postVoteRef, newVote)

                // add/subtrat 1 to/from the post.voteStatus
                updatePost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote]
            }
            // Existing vote - they have voted on the post before
            else{
                const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`)
            
            // Removing their vote (up => neutrl OR down => neutral)
            if(existingVote.voteValue === vote){
                // add/subtract 1 to/from post.votesTATUS
                updatePost.voteStatus = voteStatus - vote;
                updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id)

                //delete the postVote document
                batch.delete(postVoteRef) 
                voteChange *= -1;
            }
            // flipping their vote ( up => down OR down => up)
            else{
            // add/subtract 2 to/from post.voteStatus
            updatePost.voteStatus = voteStatus * 2 * vote;
            const voteIndex = postStateValue.postVotes.findIndex((vote) => vote.id === existingVote.id)
            updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
        };
        //updating the existing postVotedocument
        batch.update(postVoteRef, {
        voteValue: vote,
        })
        voteChange = 2 * vote;
        }
      }
      //update our post document
      const postRef = doc(firestore, 'posts', post.id!);
      batch.update(postRef, {voteStatus: voteStatus + voteChange})
      await batch.commit()

      // update state with updated values
      const postIndex = postStateValue.posts.findIndex(
      (item) => item.id === post.id
      )
      updatedPosts[postIndex] = updatePost
      setPostStateValue((prev)=> ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }))

      if(postStateValue.selectedPost){
      setPostStateValue((prev)=>({
      ...prev,
      selectedPost: updatePost,
    }))
      }

        } catch (error: any) {
            console.log(error.message)
        }
    }
    const onSelectPost = (post: Post)=>{
        setPostStateValue((prev)=>({
            ...prev,
            selectedPost: post
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }
    const onDeletePost = async(post: Post): Promise<boolean>=>{
        
        try {
            //check if image, delete if exists
        if(post.imageURL){
                const imageRef = ref(storage, `posts/${post.id}/image`);
                await deleteObject(imageRef)
        }

                //update post document from firestore
                const postDocRef = doc(firestore, 'posts', post.id!)
                await deleteDoc(postDocRef)
                //update recoil state
                setPostStateValue(prev =>({
                    ...prev,
                    posts: prev.posts.filter(item => item.id !== post.id)
                }))
        return true;
        }catch (error) {            
            return false;
        }
    }

    const getCommunityPostVotes = async (communityId: string) =>{
        const postVoteQuery = query(
            collection(firestore, 'users', `${user?.uid}/postVotes`),
            where('communityId', '==', communityId)
        );
        const postVoteDocs = await getDocs(postVoteQuery);
        const postVotes = postVoteDocs.docs.map((doc) =>({
            id: doc.id,
            ...doc.data(),
        }))
        setPostStateValue((prev)=>({
            ...prev,
            postVotes: postVotes as PostVote[],
        }))
    }

    
    useEffect(()=>{
    if(!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity?.id)
    }, [user, currentCommunity])

    //clears user post votes
    useEffect(()=>{
        if(!user){
            setPostStateValue((prev)=> ({
                ...prev,
                postVotes: [],
            }))
        }
    },[user])
    return{
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    };
}
 
export default usePosts;