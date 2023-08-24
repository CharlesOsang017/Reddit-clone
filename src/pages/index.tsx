import { communityState } from "@/atoms/communitiesAtom";
import { Post, PostVote } from "@/atoms/postsAtom";
import CreatePostLink from "@/components/community/CreatePostLink";
import PostItem from "@/components/community/posts/PostItem";
import PostLoader from "@/components/community/posts/PostLoader";
import PersonalHome from "@/components/community/posts/comments/PersonalHome";
import Recommendations from "@/components/community/posts/comments/Recommendations";
import PageContent from "@/components/layout/PageContent";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { query, collection, orderBy, getDocs, limit, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [user, loadingUser] = useAuthState(auth)
  const {postStateValue, setPostStateValue, onDeletePost, onVote, onSelectPost} = usePosts()
  // const communityStateValue = useRecoilValue(communityState )
  const {communityStateValue} = useCommunityData()
  const buildUserHomeFeed = async()=>{
    setLoading(true)
    try {
      if(communityStateValue.mySnippets.length){
        //get posts from users' ommunities
        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        )
        const postQuery = query(collection(firestore, 'posts'), where('communityId', 'in', myCommunityIds), limit(10))
        const postDocs =await getDocs(postQuery)
        const posts = postDocs.docs.map((doc)=>({
          id: doc.id,
          ...doc.data(),
        }))
        setPostStateValue((prev)=>({
          ...prev,
          posts: posts as Post[],
        }))
      }else{
        buildNoUserHomeFeed()
      }
    } catch (error: any) {
      console.log(error.message)
    }
   setLoading(false)
  }
  const buildNoUserHomeFeed = async()=>{
    setLoading(true)
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        orderBy('voteStatus', 'desc'), 
        limit(10));
      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map((doc)=>({id: doc.id, ...doc.data()}))
      setPostStateValue((prev)=>({
      ...prev,
      posts: posts as Post[],
      }))
    } catch (error: any) {
      console.log(error.message)
    }
    setLoading(false)
  };

  const getUserPostVotes = async()=>{
   try {
    const postIds = postStateValue.posts.map((post)=>post.id)
    const postVotesQuery = query(collection(firestore, `users/${user?.uid}/postVotes`), where('postId', 'in', postIds))
    const postVoteDocs = await getDocs(postVotesQuery)
    const postVotes = postVoteDocs.docs.map((doc)=>({id: doc.id, ...doc.data()}))
    setPostStateValue((prev)=>({
    ...prev,
    postVotes: postVotes as PostVote[],
    }))
   } catch (error: any) {
    console.log(error.message)
   }
  }

  //useEffect
  useEffect(()=>{
  if(communityStateValue.snippetsFetched) buildUserHomeFeed()
  },[communityStateValue.snippetsFetched])

  useEffect(()=>{
    if (!user && !loadingUser) buildNoUserHomeFeed()
  },[user, loadingUser])

  useEffect(()=>{
    if(user && postStateValue.posts.length) getUserPostVotes()
    //clean up function
    return ()=>{
  setPostStateValue((prev)=>({
    ...prev,
    postVotes: [],
  }))
    }
  },[user, postStateValue.posts])
  return (
    <PageContent>
      <div>
        <CreatePostLink />
        {loading ? (
          <PostLoader />
        ):(
          <Stack>
            {postStateValue.posts.map((post)=>(
            <PostItem 
            key={post.id}
            post={post}
            onSelectPost={onSelectPost}
            onDeletePost={onDeletePost}
            onVote={onVote}
            userVoteValue={
              postStateValue.postVotes.find(
              (item) => item.postId === post.id
              )?.voteValue
            }
            userIsCreator={user?.uid === post.creatorId}
            homePage
            />
            ))}
          </Stack>
        )}
      </div>
      <Stack spacing={5}>
        <Recommendations />
        <PersonalHome />
      </Stack>

    </PageContent>
  )
}
