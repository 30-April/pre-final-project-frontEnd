import { Box, HStack, VStack, Center, Avatar, Menu, Link, MenuList, MenuButton, Text, Icon, Flex, Input, Button, Image, position } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useState } from "react"
import { BiDotsVertical } from "react-icons/bi"
import { FaRegComment, FaRegPaperPlane, FaRegHeart } from "react-icons/fa"
import { useSelector } from "react-redux"
import { axiosInstance } from "../../library/api"
import { FcLike } from "react-icons/fc"
import moment from "moment"
import Navbar from "../Home/Navbar"
import qs from "qs"
import ContentCard from "../Home/ContentCard"


const Post = () =>{
    const userSelector = useSelector((state) => {return state.auth})
    const autoRender = useSelector((state) => {return state.render})
    const [ postData, setPostData ] = useState([])

    const router = useRouter()
    const { post_id } = router.query
    
    
    const fetchData = async () =>{
        
        await axiosInstance.get(`/post/detail/${post_id}`).then((res) =>{
            const post = res.data.result
            setPostData(post)
            console.log(post.number_of_likes)
        }).catch((err) =>{})
    }
    
    const check = postData.Likes?.find((val) => {
        return val.user_id == userSelector?.id
    })

    useEffect(() => {
        if(autoRender?.value !== undefined)
        {
            fetchData()
        }
    }, [autoRender?.value])


    return (
        <>
            <Navbar/>
            <Flex spacing={5} m={['', '2vh auto']} w={['full', '80vw']} alignItems={'center'}>
                <ContentCard
                    username = {postData.User?.username}
                    location = {postData?.location}
                    caption = {postData?.caption}
                    image_url = {postData?.image_url}   
                    number_of_likes = {postData?.number_of_likes}
                    user_id = {postData?.user_id}
                    post_id = {postData?.id}
                    user_id_like =  {userSelector?.id}
                    liked = {!check ? false : true}
                    avatar_url = {postData.User?.avatar_url}
                    postComment = {postData?.Comments}
                    date = {postData?.createdAt}    
                />    
            </Flex>
        </>
    )
}

export default Post