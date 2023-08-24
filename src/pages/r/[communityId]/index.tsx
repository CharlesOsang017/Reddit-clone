import { Community, communityState } from '@/atoms/communitiesAtom';
import About from '@/components/community/About';
import CreatePostLink from '@/components/community/CreatePostLink';
import Header from '@/components/community/Header';
import CommunityNotFound from '@/components/community/NotFound';
import Posts from '@/components/community/posts/Posts';
import PageContent from '@/components/layout/PageContent';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import {FunctionComponent, useEffect} from 'react';
import { useSetRecoilState } from 'recoil';
import safeJsonStringify from 'safe-json-stringify';
// import {Community} from '../'

interface CommunityPageProps {
    communityData: Community ;
}
 
const CommunityPage: FunctionComponent<CommunityPageProps> = ({communityData}) => {
    const setCommunityStateValue = useSetRecoilState(communityState)
    
    useEffect(()=>{
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }))
    },[communityData])

    if (!communityData){
            return (
                <CommunityNotFound />
            )
        }
    return ( 
        <>
        <Header  communityData={communityData}/>
        <PageContent>
            <>
            <CreatePostLink />
            <Posts communityData={communityData} />
            </>
            <>
            <About communityData={communityData}/>
            </>
        </PageContent>
        </>
     ); 
}
 
export async function getServerSideProps(context: GetServerSidePropsContext){
    //get community data and pass it to client
    try{
        const communityDocRef = doc(
            firestore, 'communities', context.query.communityId as string
        )
        const communityDoc = await getDoc(communityDocRef)

        return {
            props: {
                communityData: communityDoc.exists() ? JSON.parse(
                    safeJsonStringify({id: communityDoc.id, ...communityDoc.data()})
                    )
                : '',
            }
        }
    }catch(error){
        console.log('getServerSideProps', error)
    }
}
export default CommunityPage;