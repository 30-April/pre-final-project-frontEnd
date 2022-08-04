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
    FormHelperText,
    InputGroup,
    InputRightElement,
    VStack,
    Text,
    FormErrorMessage
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useFormik } from "formik";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../../redux/action/userRegister";
import { useToast } from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../../public/Logo_white_1_Loop.gif"
import axios from "axios";
import { axiosInstance } from "../../../library/api";

const Register = (props) => {
    YupPassword(Yup);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const userSelector = useSelector((state) => state.auth);
    const router = useRouter();
    const toast = useToast();
    
    const [ dataUsername, setDataUSername ] = useState([])
    const [ dataEmail, setDataEmail ] = useState([])
    const [ password, setPassword ] = useState()
    const [ error, setError ] = useState(0)

    let passwordValidation = ""

    if(!/^[a-zA-Z0-9]+$/.test(password) || !/\d/.test(password) || !/\[A-Z]/.test(password)){
        passwordValidation = "Your password is too week"
    }

    const fetchDataUser = async () =>{
        await axiosInstance.get('/user').then((res) =>{
            const dataUsername = res.data.result.usernames
            const dataEmail = res.data.result.emails
            setDataUSername(dataUsername)
            setDataEmail(dataEmail)
        })
    }

    const formik = useFormik({
        initialValues: {
            full_name: "",
            username: "",
            password: "",
            email: "",
            confirmPassword: "",
        },

        validationSchema: Yup.object().shape({
            email: Yup.string()
            .min(8, 'Must be at least 8 characters')
            .required('Email is required')
            .email("must have an '@'")
            .test('Unique Email', 'Email already in use',
                function () {
                    return new Promise((resolve) => {
                        let check = dataEmail.find((val) => {
                            return val == formik.values.email
                        })

                        if(check) {
                            formik.setFieldError("email", "email already in use");
                            resolve(false)
                        } else {
                            formik.setFieldError("email", "");
                            resolve(true)
                        }
                    })
            }),
            full_name: Yup.string().required("isi nama anda"),
            
            username: Yup.string()
            .required("isi username anda")
            .test('Unique username', 'Username already in use',
            function () {
                return new Promise((resolve) => {
                    let check = dataUsername.find((val) => {
                        return val == formik.values.username
                    })

                    if(check) {
                        formik.setFieldError("email", "Username already in use");
                        resolve(false)
                    } else {
                        formik.setFieldError("email", "");
                        resolve(true)
                    }
                })
        }),
            password: Yup.string()
                .required(", password can't be empty")
                .minUppercase(1, ", should have at least 1 Uppercase")
                .minSymbols(1, ", password should have at least 1 symbol")
                .min(8, ", password should be 8 characters")
                .minNumbers(1, ", password should have at least 1 Number"),
                
            confirmPassword: Yup.string ()
                .oneOf([Yup.ref('password')], "Password is not match")
        }),
        validateOnChange: false,
        onSubmit: (value) => {
            dispatch(userRegister(value, formik.setSubmitting));
            toast({
                title: "Your Account registered successfully", 
                description: "Please check your registered email",
                status: "success",
                isClosable: true    
            })
        }
    });


    useEffect(() => {
        //did-Update
        if (userSelector?.id) {
            router.push("/home");
        }
    }, [userSelector?.id]);

    useEffect(() => {
        fetchDataUser();
    },[])


    return (
       <>
       <Box
            w={["full", "sm"]}
            py={[3, 5]}
            px={[5, 10]}
            mx={"auto"}
            border={["none", "1px"]}
            borderColor={["", "gray.300"]}
            borderRadius={10}
            bgColor='white'
            boxShadow='dark-lg'
        >
            <VStack spacing={2} align={"flex-start"} w="full">
                <VStack spacing={1} align={['flex-start', 'center']} w='full' mb={'1vh'}>
                    <Heading>
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={140}
                            height={50}
                        />
                    </Heading>
                    <Text >Sign up to see stories over the world.</Text>
                </VStack>

                <FormControl isRequired isInvalid={formik.errors.email} >
                    <Input
                        required
                        rounded={'none'}
                        variant='filled'
                        className="inputPlaceholder"
                        onChange={(event) => formik.setFieldValue('email', event.target.value)}
                        />
                    <FormLabel className="labelPlaceholder" >&nbsp;E-mail&nbsp;</FormLabel>
                    <FormHelperText textAlign={'left'} ml={2} mb={2} mt={0} color={'red'}>{formik.errors.email}</FormHelperText>
                </FormControl>

                <FormControl isRequired isInvalid={formik.errors.full_name}>
                    <Input
                        required
                        rounded={'none'}
                        variant='filled'
                        className="inputPlaceholder"
                        onChange={(event) => formik.setFieldValue('full_name', event.target.value)}
                    />
                    <FormLabel className="labelPlaceholder">&nbsp;Full name&nbsp;</FormLabel>
                    <FormHelperText textAlign={'left'} ml={2} mb={2} mt={0} color={'red'}>{formik.errors.full_name}</FormHelperText>
                </FormControl>

                <FormControl isRequired isInvalid={formik.errors.username}>
                    <Input
                        required
                        rounded={'none'}
                        variant='filled'
                        className="inputPlaceholder"
                        onChange={(event) => formik.setFieldValue('username', event.target.value)}
                    />
                    <FormLabel className="labelPlaceholder">&nbsp;Username&nbsp;</FormLabel>
                        
                </FormControl>

                <FormControl isRequired isInvalid={formik.errors.password}>
                    <InputGroup>
                        <Input
                            required
                            isRequired
                            type={showPassword ? "text" : "password"}
                            variant='filled'
                            className="inputPlaceholder"
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
                    <FormHelperText textAlign={'left'} ml={2} mb={2} mt={0} color={'red'}>
                        {password && formik.errors.password ? passwordValidation : null} {formik.errors.password}
                    </FormHelperText>
                </FormControl>

                <FormControl isRequired isInvalid={formik.errors.confirmPassword}>
                    <InputGroup>
                        <Input
                            required
                            isRequired
                            type={showPassword ? "text" : "password"}
                            variant='filled'
                            className="inputPlaceholder"
                            onChange={(event) => formik.setFieldValue('confirmPassword', event.target.value)}
                        />
                        <FormLabel className="labelPlaceholder">&nbsp;Password Confirmation&nbsp;</FormLabel>

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
                    <FormHelperText textAlign={'left'} ml={2} mb={2} mt={0} color={'red'}>{formik.errors.confirmPassword}</FormHelperText>
                </FormControl>

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
                    onClick={() => {
                        setPassword(formik.values.password);
                        formik.handleSubmit();
                    }}
                    disabled={
                        formik.values.password 
                        && formik.values.username 
                        && formik.values.email 
                        && formik.values.full_name
                        && formik.values.confirmPassword ? false 
                        : true
                    }
                >
                    Sign Up
                </Button>
            </VStack>
        </Box>

        <Box
            w='full'
            bgColor='white'
            borderRadius={10}
            boxShadow='dark-lg'
            mt={'3vh'}
        >
            <Stack
                direction={{ base: "column", sm: "row" }}
                justify={'space-evenly'}
                h={[50, 50]}
                align={'center'}
                >
                <h3>Have an account?</h3>
                <Link color={"#5DBA7D"} onClick={props.formStatus} fontWeight='bold' style={{textDecoration:'none'}}>
                    Login Now!
                </Link>
            </Stack>
        </Box>
       </>
    );
};

export default Register;
