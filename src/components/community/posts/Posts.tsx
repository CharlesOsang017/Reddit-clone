import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { FunctionComponent, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import { Stack } from "@chakra-ui/react";
import PostLoader from "./PostLoader";

interface PostsProps {
    communityData: Community;
}
 
const Posts: FunctionComponent<PostsProps> = ({communityData}) => {
    const [loading, setLoading] = useState(false)
    const [user] = useAuthState(auth)
    const {postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost} = usePosts();

    const getPosts = async() =>{
        try {
            setLoading(true)
            //get posts for this community
            const postsQuery = query(
                collection(firestore, 'posts'),
                where('communityId', "==", communityData.id),
                orderBy('createdAt', 'desc')
            );
            const postDocs = await getDocs(postsQuery)

            // store in post state
            const posts = postDocs.docs.map((doc) => ({id: doc.id, ...doc.data()}))
            setPostStateValue((prev: any) => ({
                ...prev,
                posts: posts as Post[],
            }));
            // console.log('posts', posts)
        } catch (error: any) {
            console.log(error.message)
        }
        setLoading(false)
    }
    useEffect(()=>{
        getPosts()
    },[communityData])
    return ( 
        <>
        {loading ? (
            <PostLoader />
        ) : (
            <Stack>
            {postStateValue.posts.map((item: any) => (
                <PostItem 
                key={item.id}
                post={item}
                userIsCreator={user?.uid === item.creatorId}
                userVoteValue={
                    postStateValue.postVotes.find((vote) => vote.postId === item.id)
                    ?.voteValue
                }
                onVote={onVote}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                />
            ))}
            </Stack>
        )}
        </>
     );
}
 
export default Posts;