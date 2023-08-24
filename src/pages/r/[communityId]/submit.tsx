import { communityState } from "@/atoms/communitiesAtom";
import About from "@/components/community/About";
import NewPostForm from "@/components/community/posts/NewPostForm";
import PageContent from "@/components/layout/PageContent";
import { auth } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
// import PageContent from "@/components/layout/PageContent";
import { Text, Box } from "@chakra-ui/react";

import { FunctionComponent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";


const SubmitPostPage: FunctionComponent= () => {
    const [user] = useAuthState(auth)
    // const communityStateValue = useRecoilValue(communityState)
    // console.log('COMMUNITY', communityStateValue)
    const {communityStateValue} = useCommunityData()
    return ( 
        <PageContent> 
            <div>
            <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                <Text>Create a post</Text>
            </Box>
            {user && <NewPostForm   user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL}/>}
            </div>    
            <div>
             {communityStateValue.currentCommunity && (
                <About communityData={communityStateValue.currentCommunity} />
             )}
            </div>       
        </PageContent>
    );
}

export default SubmitPostPage;