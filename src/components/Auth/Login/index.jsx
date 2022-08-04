import {
    Center,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Button,
    Checkbox,
    Link,
    Box,
    Container,
    Text,
    VStack,
    InputGroup,
    InputRightElement,
    useToast,
    FormHelperText,
    Menu,
    MenuList,
    MenuButton,
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { userLogin } from "../../../redux/action/userLogin";
import YupPassword from "yup-password";
import { useState, useEffect } from "react";
import M_forgetPassword from "../../modals/M_forgetPassword";
import { useRouter } from "next/router";
import Image from "next/image";
import Logo from "../../../public/Logo_white_1_loop.gif"
import M_resetPassword from "../../modals/M_forgetPassword"

const Login = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const userSelector = useSelector((state) => state.auth);

    const dispatch = useDispatch()
    const router = useRouter()
    const toast = useToast()
    
    const formik = useFormik({
        initialValues: {
            username : "",
            password : "",
        }, 

        validationSchema: Yup.object().shape({
            username : Yup.string().required("Username or email is required"),
            password : Yup.string().required('password is required')
        }),

        validateOnChange : false, 
        
        onSubmit: (value) => {
            dispatch(userLogin(value, formik.setSubmitting))
        }
    })

    useEffect(() =>{
        if(userSelector?.id){
            router.push("/home")
        }
    }, [userSelector?.id])

    return (
        <>
        <Box
            w={["full", "sm"]}
            p={[9, 10]}
            mx={"auto"}
            border={["none", "1px"]}
            borderColor={["", "gray.300"]}
            borderRadius={10}
            bgColor='white'
            boxShadow='dark-lg'
        >
            <VStack spacing={4} align={"flex-start"} w="full">
                <VStack spacing={1} align={['flex-start', 'center']} w='full' mb='3vh'>
                    <Heading>
                        <Image
                            src={Logo}
                            alt=''
                        />
                    </Heading>
                    <Text>This is the portal to access your account</Text>
                </VStack>

                <FormControl id ='username' isInvalid={formik.errors.account}>
                    <Input 
                        required 
                        rounded={'none'} 
                        variant='filled' 
                        className="inputPlaceholder"
                        onChange={(event) => formik.setFieldValue('username', event.target.value)}
                    />
                    <FormLabel className="labelPlaceholder">&nbsp;E-mail / Username&nbsp;</FormLabel>
                    <FormHelperText textAlign={'left'} ml={3} color='red'>{formik.errors.account}</FormHelperText>
                </FormControl>

                <FormControl id="password" isInvalid={formik.errors.account}>
                    <InputGroup>
                        <Input
                            required
                            type={showPassword ? "text" : "password"}
                            className="inputPlaceholder"
                            variant='filled'
                            onChange={(event) => formik.setFieldValue('password', event.target.value)}
                        />
                        <FormLabel className="labelPlaceholder">&nbsp;Password&nbsp;</FormLabel>
                        
                        <InputRightElement h={"full"}>
                            <Button
                                variant={"ghost"}
                                onClick={() =>
                                    setShowPassword(
                                        (showPassword) => !showPassword
                                    )
                                }
                            >
                                {showPassword ? (
                                    <ViewIcon />
                                ) : (
                                    <ViewOffIcon />
                                )}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <FormHelperText textAlign={'left'} ml={2} color='red'>{formik.errors.account}</FormHelperText>
                </FormControl>
                
                <HStack justifyContent={'space-between'} w='full' p={2}>
                    <Checkbox borderColor='gray.400'>Remember Me?</Checkbox>
                    <M_resetPassword/>
                </HStack>

                <Button 
                    bgColor='#CB6E35'
                    color = "white"
                    _hover={{ 
                        color: '#CB6E35',
                        border: '2px',
                        borderCollapse: "#CB6E35",
                        bgColor: "white"
                    }} 
                    w='full'
                    onClick={
                        formik.handleSubmit
                    }
                    disabled={formik.values.password && formik.values.username ? false : true}
                >
                    Login
                </Button>
            </VStack>
        </Box>
        <Box 
            w='full'
            bgColor='white'
            borderRadius={10}
            boxShadow='dark-lg'
            mt={'5vh'}
        >
            <Stack
                direction={{ base: "column", sm: "row" }}
                justify={'space-evenly'}
                h={[50, 50]}
                align={'center'}
                >
                <h3>You dont have an account?</h3>
                <Link color={"#5DBA7D"} onClick={props.formStatus} fontWeight='bold' style={{textDecoration:'none'}}>
                    Register Now!
                </Link>
            </Stack>
        </Box>
        </>
    );
};

export default Login;
