import { Avatar, Box, Button, Center, Flex, Stack, Text, Tabs, Tab , TabPanels, TabPanel, TabList, Grid, GridItem, Icon, Link, LinkBox, useToast , Image} from "@chakra-ui/react"
import { FiSettings } from "react-icons/fi"
import { RiUserFollowLine } from "react-icons/ri"
import { BsGrid3X3Gap, BsHeart, BsGrid } from "react-icons/bs"
import { BiCoinStack, BiLike } from "react-icons/bi"
import { useSelector } from "react-redux"
import { axiosInstance } from "../../library/api"
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/router"

const ProfiePage = () => {
    const [ allPost, setAllPost ] = useState([])
    const [ likedPost, setLikedPost ] = useState([])
    
    //ini buat gua nge get user_id dari router
    const router = useRouter() 
    const { user_id } = router.query
    
    const toast = useToast()
    const userSelector = useSelector((state) => {return state.auth})
    const autoRender = useSelector((state) => {return state.render})
    const totalUserPost = allPost.length

    const [ user, setUser ] = useState({})

    const fetchDataUser = () => {
        axiosInstance.get(`/user/${user_id}`).then((res) =>{
            const user = res.data.result
            console.log(user)
            setUser(user)
        })
    }
     
    const fetchAllPost = () => {
        axiosInstance.get(`/post/${user_id}`).then((res) =>{
            const post = res.data.result
            console.log(post)
            
            setAllPost(post)
        }).catch((err) => {})
    }

    const fetchPostLiked = () => {
        axiosInstance.get(`/like/${user_id}`).then((res) =>{
            const liked = res.data.result
            console.log(liked)

            setLikedPost(liked)
        }).catch((err) => {})
    }

    const renderUserLiked = () => {
        return likedPost?.map((val) =>{
            if(val.Post?.id == val.post_id){
                return (
                    <GridItem w={300} h={300}>
                        <Image 
                            src={'http://' + val.Post?.image_url}
                            width={300}
                            height={300}
                        />
                    </GridItem>
                )
            }
        })
    }

    const renderUserPost = () => {
        return allPost?.map((val) =>{
            if(val.user_id == user_id){
                return (
                    <GridItem w={300} h={300}>
                        <Image 
                            src={'http://' + val.image_url}
                            width={300}
                            height={300}
                        />
                    </GridItem>
                )
            }
        })
    }

    
    useEffect(() => {
        fetchAllPost()
        fetchPostLiked()
        fetchDataUser()
    }, [autoRender?.value])

    useEffect(() =>{
        fetchAllPost()
        fetchPostLiked()
        fetchDataUser()
    }, [user_id])
     
    return (
        <Box minW={'50%'}>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Avatar
                    boxSize={40}
                    name={user?.username}
                    src={`http://${user?.avatar_url}`}
                    mr={10}
                />

                <Box maxW={'50%'}>
                    <Box display={'flex'} alignItems={'center'} p={3}>
                        <Text mr={5} fontWeight={'bold'} fontSize={20}>{user?.username}</Text>
                        
                        <Button size={'xs'} mr={5} fontSize={14} colorScheme={'green'} onClick={() => {toast({
                            status: "success",
                            title: `Followed ${user?.username}`, 
                            position: 'top',
                            duration: 1000, 
                        })}}>
                            <Icon as={RiUserFollowLine} boxSize={4} mr={2}/> Follow
                        </Button>
                        
                        {user?.id == userSelector?.id ? (
                            <Link href={`/profile/setting/${userSelector?.id}`}>
                                <Button size={'xs'} mr={5} fontSize={14} colorScheme={'green'}>
                                    <Icon as={FiSettings} boxSize={4} mr={2}/> Setting
                                </Button>
                            </Link>
                        ) : null}
                        
                    </Box>
                        
                    <Box display={'flex'} alignItems={'center'} p={3}>
                        <Text mr={10} fontWeight={'bold'}>{totalUserPost} Posts</Text>
                        <Text mr={10} fontWeight={'bold'}>10 Following</Text>
                        <Text mr={10} fontWeight={'bold'}>10K Follower</Text>
                    </Box>
                    <Box p={3}>
                        <Text>{user?.bio}</Text>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Tabs variant='enclosed' align={'center'}>
                    <TabList>
                        <Tab>
                            <Icon as={BsGrid} boxSize={4} mr={2}/>Posts
                        </Tab>
                        {user_id == userSelector?.id ? (
                            <Tab>
                                <Icon as={BsHeart} boxSize={4} mr={2}/>Liked
                            </Tab>
                        ) : null}
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Center>
                                <Grid templateColumns='repeat(3, 1fr)' gap={3} p={5}>
                                    {renderUserPost()}
                                </Grid>
                            </Center>
                        </TabPanel>
                        
                        <TabPanel>
                            <Center>
                                <Grid templateColumns='repeat(3, 1fr)' gap={3} p={5}>
                                    {renderUserLiked()}
                                </Grid>
                            </Center>
                        </TabPanel>                        
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    )
}

export default ProfiePage