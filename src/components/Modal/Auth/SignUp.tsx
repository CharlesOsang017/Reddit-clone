import { authModalState } from "@/atoms/authModalAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { confirmPasswordReset } from "firebase/auth/cordova";
import { FunctionComponent, useEffect, useState } from "react";
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { useSetRecoilState } from "recoil";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { addDoc, collection } from "firebase/firestore";
import { User } from "firebase/auth";


const SignUp: FunctionComponent = () => {
    const [err, setErr] = useState('')
    const [createUserWithEmailAndPassword, userCred, loading, error] = useCreateUserWithEmailAndPassword(auth)
    const setAuthModalState = useSetRecoilState(authModalState)
    const [signUpForm, setSignUpForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    //firebase logic
    const onSubmit = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if(err) setErr('');
        if(signUpForm.password !== signUpForm.confirmPassword){
            setErr('Password do not match!')
            return;
        }//password match
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        //update form state
        setSignUpForm((prev) =>({
            ...prev,
            [event.target.name]: event.target.value,
        }))

    }
    const createUserDoc = async(user: User)=>{
        await addDoc(collection(firestore, 'users'), JSON.parse(JSON.stringify(user)));
    }
    useEffect(()=>{
        if(userCred){
            console.log('userCred', userCred.user)
            createUserDoc(userCred.user);
        }
    },[userCred])
    return ( 
        <form onSubmit={onSubmit}>
            <Input
            required
            name='email'
            placeholder='email'
            type='email'
            mb={2}
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:'gray.500'}}
            _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
            }}
            _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
            }}
            bg='gray.50'
            />
            <Input
            required
            name='password'
            placeholder='Password'
            type='password'
            mb={2}
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:'gray.500'}}
            _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
            }}
            _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
            }}
            bg='gray.50'
            />
            <Input
            required
            name='confirmPassword'
            placeholder='Confirm Password'
            type='password'
            mb={2}
            onChange={onChange}
            fontSize='10pt'
            _placeholder={{color:'gray.500'}}
            _hover={{
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
            }}
            _focus={{
                outline: 'none',
                bg: 'white',
                border: '1px solid',
                borderColor: 'blue.500',
            }}
            bg='gray.50'
            />
            {(err || error ) && (
                <Text textAlign='center' color='red' fontSize='10pt'>
                    {err || FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
                </Text>
            )}
            <Button width='100%' height='36px' mt={2} mb={2} type='submit' isLoading={loading}>Sign Up</Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr='1'>Already a redditor?</Text>
                <Text color='blue.500' fontWeight={700} cursor='pointer'
                onClick={() =>setAuthModalState((prev)=>({
                    ...prev,
                    view: 'login',
                }))}
                >LOG IN</Text>
            </Flex>
        </form>
     );
}
 
export default SignUp;