import { Stack, Input, Textarea, Flex, Button } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface TextInputsProps {
    textInputs: {
        title: string;
        body: string;
    }
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleCreatePost: () => void;
    loading: boolean;
}
 
const TextInputs: FunctionComponent<TextInputsProps> = ({textInputs, loading, onChange, handleCreatePost}) => {
    return ( 
        <Stack spacing={3} width='100%'>
            <Input 
            name='title'
            onChange={onChange}
            value={textInputs.title}
            fontSize='10pt'
            borderRadius={4}
            placeholder="Title"
            _placeholder={{color: 'gray.500'}}
            _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: 'black',
            }}
            />
            <Textarea 
              name='body'
              onChange={onChange}
              value={textInputs.body}
              fontSize='10pt'
              borderRadius={4}
              height='100px'
              placeholder="Text (optional)"
              _placeholder={{color: 'gray.500'}}
              _focus={{
                  outline: 'none',
                  bg: 'white',
                  border: '1px solid',
                  borderColor: 'black',
              }}
            />
            <Flex justify='flex-end'>
                <Button
                height='34px'
                isLoading={loading}
                padding='0px 30px'
                disabled={!textInputs.title}
                onClick={handleCreatePost}
                >Post</Button>
            </Flex>
        </Stack>
     );
}
 
export default TextInputs;