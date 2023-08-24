import { Flex, Button } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";


const CommunityNotFound: FunctionComponent= () => {
    return ( 
        <Flex
        direction='column'
        justifyContent='center'
        alignItems='center'
        minHeight='60vh'
        >
            Sorry, that community does not exist or has been banned
            <Link href='/'>
                <Button mt={4}>Go Home</Button>
            </Link>
        </Flex>
     );
}
 
export default CommunityNotFound;