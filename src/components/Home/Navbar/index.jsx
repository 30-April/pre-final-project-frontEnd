import { AddIcon, BellIcon, ChatIcon, ChevronDownIcon, EditIcon, HamburgerIcon, SettingsIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    HStack,
    Icon,
    Input,
    Link,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Text,
    useToast,
    Center,
    IconButton,
} from "@chakra-ui/react";
import { BsHeartFill } from "react-icons/bs";
import M_addPost from "../../modals/M_addPost";
import { CgProfile, CgLogOut, CgHome } from "react-icons/cg"
import { FaHome } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux";
import jsCoockie from "js-cookie"
import Image from "next/image";
import Logo from "../../../public/Logo_1_Loop.gif"
import { useRouter } from "next/router";
import auth_types  from "../../../redux/reducers/types/auth"
import { axiosInstance } from "../../../library/api";
import qs from "qs"
import Loading from "../../../public/Loading.gif"
import { useEffect, useState } from "react";


const Navbar = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const userSelector = useSelector((state) => {
        return state.auth
    })

    const autoRender = useSelector((state) =>{ return state.post })

    const toast = useToast()    

    const [ isLoading, setIsLoading ] = useState(true)
    
    const handleLogout = () =>{
        jsCoockie.remove("auth_token")
        
        dispatch({
            type: auth_types.AUTH_LOGOUT
        })
        setIsLoading(true)
        router.push("/auth")
    }

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

    useEffect(() => {
        setIsLoading(false)
        
    }, [autoRender])

    return (
        <Box top={0} position={'sticky'} zIndex={2}>
            <Flex bgColor={'#e3e3e3'} px={3} align={'center'} alignItems={'center'}>
                <HStack flex={4} align={"center"}>
                    <Link href="/home" > 
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={120}
                            height={50}
                        />
                    </Link>
                    <Text>Welcome Back, {userSelector.username}</Text>
                </HStack>

                <Box
                    flex={8}
                    alignItems={"center"}
                    display={"flex"}
                    justifyContent={"center"}
                >
                    <FormControl maxW={"75%"}>
                        <Input
                            type={"text"}
                            placeholder={"Search...."}
                            bgColor={"white"}
                        />
                    </FormControl>
                </Box>

                <Box
                    flex={4}
                    alignItems={"center"}
                    display={"flex"}
                    justifyContent={"space-evenly"}
                >
                    <Button bgColor={"#e3e3e3"} _activeLink={"/home"} disabled={userSelector?.is_verified ? false : true}>
                        <Link href={userSelector?.is_verified ? "/home" : null}>
                            <Icon boxSize={6} as={FaHome} />
                        </Link>
                    </Button>
                    {/* Add new post */}
                    {userSelector?.is_verified ? <M_addPost/>  : <IconButton icon={<AddIcon/>} disabled="true"/>}
                    
                    {userSelector?.is_verified ? 
                        <Button bgColor={"#e3e3e3"}>
                            <Icon boxSize={6} as={BsHeartFill} />
                        </Button>
                        :
                        <Button bgColor={"#e3e3e3"} disabled>
                            <Icon boxSize={6} as={BsHeartFill} />
                        </Button>
                    }

                    {userSelector?.is_verified ? 
                        <Button bgColor={"#e3e3e3"}>
                            <Icon boxSize={6} as={BellIcon} />
                        </Button>
                        :
                        <Button bgColor={"#e3e3e3"} disabled>
                            <Icon boxSize={6} as={BellIcon} />
                        </Button>
                    }

                    {userSelector?.is_verified ? 
                        <Button bgColor={"#e3e3e3"}>
                            <Icon boxSize={6} as={ChatIcon} />
                        </Button>
                        :
                        <Button bgColor={"#e3e3e3"} disabled>
                            <Icon boxSize={6} as={ChatIcon} />
                        </Button>
                    }

                    <Menu>
                        <MenuButton bgColor={'#e3e3e3'}>
                            <Avatar
                                size="md"
                                name={userSelector?.username}
                                src={`http://${userSelector?.avatar_url}`}
                            />
                        </MenuButton>
                        <MenuList>
                            <Link href={`/profile/${userSelector?.id}`}> 
                                <MenuItem icon={<CgProfile/>}>Profile</MenuItem>
                            </Link>
                            <Link href={`/profile/setting/${userSelector?.id}`}>                            
                                <MenuItem icon={<EditIcon/>}>Edit Profile</MenuItem>
                            </Link>
                            <MenuDivider/>  
                            <MenuItem icon={<CgLogOut/>} onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Flex>
            
            {isLoading ?
                <Center>
                    <Image src={Loading} alt="" />
                </Center> 
                :  
                <>
                {!userSelector.is_verified? 
                    <Box align={'center'} p={2} color={'white'} bgColor={'orange.300'}>

                        <WarningTwoIcon boxSize={4} color='orange.500'/> Your Accont is not verified, please check your email
                        <Button ml={2} color="orange.500" fontSize={14} onClick={() => reLink()}> 
                            Send Verification Link 
                            {userSelector.is_verified} {/* // masih menjadi misteri */}
                        </Button>
                    </Box> 
                : null}
                </>
            }
        </Box>
    );
};

export default Navbar;
