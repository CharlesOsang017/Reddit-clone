import { authModalState } from "@/atoms/authModalAtom";
import { Community, CommunitySnippet, communityState } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDocs, writeBatch, increment, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

 
const useCommunityData = () => {
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)
    const [user] = useAuthState(auth)
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const onJoinOrLeaveCommunity = (
        communityData: Community,
        isJoined: boolean
    ) =>{
        // is user signed in
        // if not => open auth modal
        if(!user){
            setAuthModalState({open : true, view: 'login'})
            return;
        }

        if(isJoined){
            leaveCommunity(communityData.id)
            return;
        }
        joinCommunity(communityData);
    }
    const joinCommunity = async (communityData: Community) =>{
        try {
            const batch = writeBatch(firestore);
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId,
            }
            batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet)
            batch.update(doc(firestore, 'communities', communityData.id),{
                numberOfMembers: increment(1)
            })
            await batch.commit()
            //update recoil state -
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet]
            }))
        } catch (error: any) {
            console.log('joinCommunity error', error)
            setError(error.message)
        }
        setLoading(false)
    }
    const leaveCommunity = async(communityId: string) =>{
        // batch write
        try {
            const batch = writeBatch(firestore);
            // deleting the community snippet from user
            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId))
            // updating the numberOfMembers
            batch.update(doc(firestore, 'communities', communityId), {
                numberOfMembers: increment(-1)
            })
            await batch.commit()
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets: prev.mySnippets.filter((item)=>item.communityId !== communityId)
            }))
        } catch (error: any) {
            console.log('joinCommunity error', error)
            setError(error.message)
        }
        setLoading(false)
    }
    const getMySnippets = async ()=>{
        setLoading(true)
        try {
            //get users snippets
            const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`))
            const snippets = snippetDocs.docs.map((doc) => ({...doc.data()}))
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                snippetsFetched: true,
            }))
            // console.log('snippets', snippets)
        } catch (error) {
            console.log('snippets error', error)
        }
        setLoading(false)
    }
    const getCommunityData = async(communityId: string)=>{ 
        try {
            const communityDocRef = doc(firestore, 'communities', communityId)
            const communityDoc = await getDoc(communityDocRef)

            setCommunityStateValue((prev)=>({
                ...prev,
                currentCommunity: {
                    id: communityDoc.id,
                    ...communityDoc.data(),
                } as Community,
            }))
        } catch (error: any) {
            console.log(error.message)
        }
    }
    

    useEffect(()=>{
    const { communityId} = router.query;
    if(communityId && !communityStateValue.currentCommunity){
    getCommunityData(communityId as string)
    }
    },[router.query, communityStateValue.currentCommunity])
    useEffect(()=>{
        if(!user) {
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets: [],
                snippetsFetched: false
            }))
            return;
        }
        getMySnippets();
    },[user])
    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    };
}
 
export default useCommunityData;