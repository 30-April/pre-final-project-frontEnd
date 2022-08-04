import { Avatar, Box, Button, FormControl, FormHelperText, FormLabel, HStack, Input, InputGroup, InputLeftAddon, InputLeftElement, Select, Stack, Text, Textarea, useToast } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik";
import { userProfile } from "../../redux/action/userProfile";
import { useEffect } from "react";
import { axiosInstance } from "../../library/api";
import { useState } from "react";
import qs from "qs";
import M_avatar from "../modals/M_avatar";
import auth_types from "../../redux/reducers/types/auth";
import { WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import * as Yup from 'yup'

const ProfileSetting = () =>{
    const [ userData, setUserData ] = useState([])
    const { full_name, email, username, id, website, bio, phone_number, gender, avatar_url  } = userData
    const [ dataUsername, setDataUSername ] = useState([])

    const dispatch = useDispatch()
    const toast = useToast()
    const userSelector = useSelector((state) => {return state.auth})
    const autoRender = useSelector((state) =>{return state.render})

    const renderDataUser = () =>{
        axiosInstance.get(`/user/${userSelector?.id}`).then((res) =>{
            const data = res.data.result
            // console.log(data)
            setUserData(data)
        })
    }

    const fetchDataUser = async () =>{
        await axiosInstance.get('/user').then((res) =>{
            const dataUsername = res.data.result.usernames
            setDataUSername(dataUsername)
        })
    }

    useEffect(() =>{
        renderDataUser()
        fetchDataUser()
    }, [autoRender])

        const formik = useFormik({
            initialValues: {
                id : userSelector?.id,
                full_name : userSelector?.full_name,
                username : userSelector?.username,
                website : userSelector?.website,
                bio : userSelector?.bio,
                phone_number : userSelector?.phone_number,
                gender : userSelector?.gender,
                avatar_url : userSelector?.avatar_url
            },

            validationSchema: Yup.object().shape({
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
            }),

            validateOnChange: false,
            onSubmit: async () => {
                const { 
                    full_name,
                    username,
                    website,
                    bio,
                    phone_number,
                    gender,
                    id
                } = formik.values
    
                const body = {
                    full_name,
                    username ,
                    website,
                    bio,
                    phone_number,
                    gender,
                }
                
                try {
                    await axiosInstance.patch(`/user/${id}`, qs.stringify(body)).then((val) =>{
                        dispatch({
                            type: auth_types.AUTH_LOGIN,
                            payload: val.data.user
                          })
                    
                        toast({
                            title: "Your profile has been edited",
                            status: "success",
                            duration: 1000,
                          })
                
                        dispatch({
                            type: "AUTO_RENDER",
                            payload: {
                                value : !autoRender.value
                            }
                        })
                    })

                } catch (err) {
                    console.log(err)
                    toast({
                        title: "Error",
                        status: "error",
                        duration: 1000,
                    })
                }
                formik.setSubmitting(false)
            }
        })

        const reLink = async () =>{ // ini buat ngirim ulang link jwt kalo udah expired
            try {
                let body ={
                    id: userSelector?.id,
                    username: userSelector?.username,
                    email: userSelector?.email,
                    full_name: userSelector?.full_name
                }
    
                await axiosInstance.post("/user/new-link", qs.stringify(body))
                toast({
                    tittle: "new link sending successfully",
                    description: "please check your email",
                    status : "success",
                    duration: 1000,
                })
            } catch (err){
                console.log(err)
            }
        }

    return(
        <Box maxW={'50%'} boxShadow={'dark-lg'}>
            <Box display={'flex'} p={5} alignItems={'center'} bgColor={'#e3e3e3'}>
                <Avatar
                        size="xl"
                        name="Segun Adebayo"
                        src= {`http://${avatar_url}`}
                        mr={10}
                />
                <Box p={5}>
                    <Text mb={1}>{username}</Text>
                    <M_avatar/>
                </Box>

                {!userSelector.is_verified? 
                    <Button ml={2} color="white" fontSize={14} onClick={() => reLink()} bgColor={'orange.500'} _hover={{
                        color: 'orange',
                        bgColor: "white",
                        border : '2px solid orange'
                    }} leftIcon={<WarningTwoIcon boxSize={4}/>}> Send Verification Link 
                        {userSelector.is_verified} {/* // masih menjadi misteri */}
                    </Button>
                : null}

            </Box>
            
            <Box display={'flex'} justifyContent={'space-between'} mb={3} bgColor={'white'} p={3}>
                <FormControl display={'flex'}>
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>Name</FormLabel>
                    <Box maxW={'50%'}>
                        <Input 
                            type={'text'} 
                            maxW={'70%'} 
                            textAlign={'justify'}
                            onChange={(event) => formik.setFieldValue('full_name', event.target.value)}
                            defaultValue={full_name}    
                        />
                        <Text fontSize={14}>Help people discover your account by using the name you're known by: either your full name, nickname, or business name</Text>
                    </Box>
                </FormControl>
            </Box>
            
            <Box display={'flex'} justifyContent={'space-between'} bgColor={'white'} p={3}>
                <FormControl display={'flex'} isInvalid={formik.errors.username}>
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>Username</FormLabel>
                    <Box maxW={'50%'}>
                        <Input 
                            type={'text'} 
                            maxW={'70%'} 
                            textAlign={'justify'}
                            onChange={(event) => formik.setFieldValue('username', event.target.value)}
                            defaultValue={username}
                        />
                        <Text fontSize={14}>Username is uniqe, there will no others that have your username. choose wisely</Text>
                    </Box>
                    <FormHelperText textAlign={'left'} ml={2} mt={0} mb={2} color={'red'}>{formik.errors.username}</FormHelperText>
                </FormControl>
            </Box>
            
            <Box display={'flex'} justifyContent={'space-between'} bgColor={'white'} p={3}>
                <FormControl display={'flex'}>
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>Website</FormLabel>
                    <Box minW={'50%'}>
                        <Input 
                            type={'text'} 
                            maxW={'70%'} 
                            textAlign={'justify'}
                            onChange={(event) => formik.setFieldValue('website', event.target.value)}
                            defaultValue={website}
                        />
                    </Box>
                </FormControl>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} bgColor={'white'} p={3}>
                <FormControl display={'flex'}>
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>Bio</FormLabel>
                    <Box minW={'35%'}>
                        <Textarea 
                            placeholder='Provide your personal information'
                            onChange={(event) => formik.setFieldValue('bio', event.target.value)}
                            defaultValue={bio}
                        />
                    </Box>
                </FormControl>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} bgColor={'white'} p={3}>
                <FormControl display={'flex'} >
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>email</FormLabel>
                    <Box minW={'50%'}>
                        <Input type={'text'} maxW={'70%'} isDisabled bgColor={'grey'} defaultValue={email}/>
                        <Text fontSize={14} color={'red.500'}>* Email is cannot be change</Text>
                    </Box>
                </FormControl>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} bgColor={'white'} p={3}>
                <FormControl display={'flex'}>
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>Phone number</FormLabel>
                    <Box minW={'50%'}>
                    <InputGroup >
                        <InputLeftAddon bgColor={'#e3e3e3'} roundedLeft={'md'} children={'+62'}/>
                        <Input 
                            type={'tel'} 
                            maxW={'55%'}
                            onChange={(event) => formik.setFieldValue('phone_number', event.target.value)}
                            defaultValue={phone_number}
                        />
                    </InputGroup>
                    </Box>
                </FormControl>
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} bgColor={'white'} p={3}>
                <FormControl display={'flex'} alignItems={'center'}>
                    <FormLabel minW={'40%'} textAlign={'right'} mr={5}>Gender</FormLabel>
                    <Box minW={'50%'}>
                        <Select 
                            onChange={(event) => formik.setFieldValue("gender", event.target.value)} 
                            defaultValue={gender}
                            >
                                <option value='Male'>Male</option>
                                <option value='Female'>Female  </option>
                                <option value='Prefer not to say'>prefer not to say</option>
                        </Select>
                    </Box>
                </FormControl>
            </Box>
            <Box align={"center"} margin={'12px 0'}>
                <Button colorScheme={"red"} mr={20} p={"0 20px"}>CANCLE</Button>
                <Button 
                    colorScheme={"green"}
                    p={"0 20px"}
                    onClick={formik.handleSubmit}
                >
                    SUBMIT
                </Button>
            </Box>
        </Box>
    )
}

export default ProfileSetting
