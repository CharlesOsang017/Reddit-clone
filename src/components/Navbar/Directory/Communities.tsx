import { communityState } from "@/atoms/communitiesAtom";
import CreateCommunity from "@/components/Modal/Community/CreateCommunity";
import { MenuItem, Flex, Icon, Text, Box } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import MenuListItem from "./MenuListItem";
import { FaReddit } from "react-icons/fa";

interface CommunitiesProps {
    
}

const Communities: FunctionComponent<CommunitiesProps> = () => {
    const [open, setOpen] = useState(false)
    const mySnippets = useRecoilValue(communityState).mySnippets;
    return ( 
        <>
        <CreateCommunity open={open} handleClose={()=> setOpen(false)}/>
        <Box mt={3} mb={4}>
            <Text pl={3} mb={1} fontSize='7pt' fontWeight={500} color='gray.500'>
                MODERATING
            </Text>            
        {mySnippets.filter(snippet => snippet.isModerator).map((snippet)=>(
            <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`/r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor='brand.100'
            imageURL={snippet.imageURL}
            />
        ))}
        </Box>
        <Box mt={3} mb={4}>
            <Text pl={3} mb={1} fontSize='7pt' fontWeight={500} color='gray.500'>
                MY COMMUNITIES
            </Text>            
        <MenuItem
        width='100%'
        fontSize='10pt'
        _hover={{bg: 'gray.100'}}
        onClick={() => setOpen(true)}
        >
        <Flex align='center'>
            <Icon fontSize={20} mr={2} as={GrAdd}/> Create Community
        </Flex>
        </MenuItem>
        {mySnippets.map((snippet)=>(
            <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`/r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor='blue.500'
            imageURL={snippet.imageURL}
            />
        ))}
        </Box>
        </>
     );
}
 
export default Communities;