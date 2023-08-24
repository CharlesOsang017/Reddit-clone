import { Flex, Spinner } from "@chakra-ui/react";
import { FunctionComponent } from "react";

const PostLoader: FunctionComponent = () => {
  return (
    <Flex justify='center' align='center'>
    <Spinner
      thickness='4px'
      speed='0.65s'
      emptyColor='gray.200'
      color='blue.500'
      size='xl'
    />
    </Flex>
 
  );
};

export default PostLoader;
