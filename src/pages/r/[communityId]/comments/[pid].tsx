import { Post } from "@/atoms/postsAtom";
import About from "@/components/community/About";
import PostItem from "@/components/community/posts/PostItem";
import Comments from "@/components/community/posts/comments/Comments";
import PageContent from "@/components/layout/PageContent";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostPage = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const {communityStateValue} = useCommunityData()
    const {postStateValue, setPostStateValue, onDeletePost, onVote} = usePosts()

    const fetchPost = async(postId: string)=>{
      try {
        const postDocRef = doc(firestore, 'posts', postId)
        const postDoc = await getDoc(postDocRef)
        setPostStateValue((prev)=>({
            ...prev,
            selectedPost: {id: postDoc.id, ...postDoc.data()} as Post
        }))
      } catch (error: any) {
        console.log(error.message)
      }

    }
    useEffect(()=>{
        const {pid} = router.query;

        if(pid && !postStateValue.selectedPost){
            fetchPost(pid as string)
        }
    },[router.query, postStateValue.selectedPost])
    return ( 
        <PageContent>
            <div>
                {postStateValue.selectedPost &&(
                    <PostItem 
                    post={postStateValue.selectedPost}
                    onVote={onVote}
                    onDeletePost={onDeletePost}
                    userVoteValue={
                        postStateValue.postVotes.find((item)=>item.postId === postStateValue.selectedPost?.id)?.voteValue
                    }
                    userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
                    />
                )}
                <Comments
                user={user as User}
                selectedPost={postStateValue.selectedPost}
                communityId={postStateValue.selectedPost?.communityId as string}
                 />
            </div>
            <div>
                {communityStateValue.currentCommunity && (
                    <About  communityData={communityStateValue.currentCommunity}/>
                )}
            </div>
        </PageContent>
     );
}
 
export default PostPage;