import { Community } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "@/hooks/useCommunityData";


interface HeaderProps {
    communityData: Community;
}
 
const Header: FunctionComponent<HeaderProps> = ({communityData}) => {
    const {communityStateValue, onJoinOrLeaveCommuinty, loading} = useCommunityData()
    const isJoined = !!communityStateValue.mySnippets.find((item) => item.communityId == communityData.id)
    return ( 
        <Flex direction='column' width='100%' height='146px'>
            <Box height='50%' bg='blue.400' />
            <Flex justify='center' bg='white' flexGrow={1}>
                <Flex width='95%' maxWidth='860px'>
                    {communityStateValue.currentCommunity?.imageURL ? (
                    <Image 
                        position="relative"
                        top={-3}
                        color='blue.500'
                        boxSize='66px'
                        border='4px solid white'
                        borderRadius='full'
                        src={communityStateValue.currentCommunity.imageURL} 
                       alt="vtar"/>
                    ): (
                        <Icon 
                        as={FaReddit}
                        fontSize={64}
                        position="relative"
                        top={-3}
                        color='blue.500'
                        border='4px solid white'
                        borderRadius='full'
                        />
                    )}
                    <Flex padding='10px 16px'>
                        <Flex direction="column" mr={6}>
                            <Text fontSize='16pt' fontWeight={800}>
                                {communityData.id}
                            </Text>
                            <Flex fontWeight={600} fontSize='10pt' color='gray.400'>
                                r/{communityData.id}
                            </Flex>
                        </Flex>
                        <Button
                        variant={isJoined ? 'outline' : 'solid'}
                        height='30px'
                        pr={6}
                        pl={6}
                        isLoading={loading}
                        onClick={() => onJoinOrLeaveCommuinty(communityData, isJoined)}
                        >
                            {isJoined ? 'Joined' : 'Join'}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
     );
}
 
export default Header;