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
import { useToast } from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../public/Logo_white_1_Loop.gif"
import axios from "axios";
import { axiosInstance } from "../../library/api";
import qs from 'qs'

const ForgetPassword = () => {
    YupPassword(Yup);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const userSelector = useSelector((state) => state.auth);
    const router = useRouter();
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },

        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("password can't be empty")
                .minUppercase(1, "password should have at least 1 Uppercase")
                .minSymbols(1, "password should have at least 1 symbol")
                .min(8, "password should be 8 characters"),
            confirmPassword: Yup.string ()
                .oneOf([Yup.ref('password')], "Password is not match")
        }),
        validateOnChange: false,

        onSubmit: async () => {
            const { password } = formik.values
            const { resetToken } = router.query 
            try {
                let body = { password }
                const a = await axios.patch(`http://localhost:2000/token/${resetToken}`)

                const res = await axios.patch(`http://localhost:2000/user/changePassword/${resetToken}`, qs.stringify(body))

                router.push('/auth')

                // router.push('/auth')
            } catch(err){
                console.log(err)
            }
        },
       
    });

    async function submit() {
        await formik.handleSubmit()

        toast({
           title: "Your Account's password has been changed successfully",
           status: "success",
           duration: 1500,    
        })
    }

    return (
       <Center h='100vh'>
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
            <VStack spacing={3} align={"flex-start"} w="full">
                <VStack spacing={3} align={['flex-start', 'center']} w='full' mb={'1vh'} justify='center'>
                    <Heading>
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={140}
                            height={50}
                        />
                    </Heading>
                    <Text textAlign={'center'}>Make sure yoo'il nevere forget the password again</Text>
                </VStack>

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
                    <FormHelperText textAlign={'left'} ml={2} mb={2} mt={0} color={'red'}>{formik.errors.password}</FormHelperText>
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
                    onClick={submit}
                    disabled={
                        formik.values.password && formik.values.confirmPassword ? false 
                        : true
                    }
                >
                    Reset
                </Button>
            </VStack>
        </Box>
       </Center>

    );
};

export default ForgetPassword;
