import axios from "axios"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import Navbar from "../../components/Home/Navbar"
import { Box, HStack, VStack, Center, Avatar, Menu, Link, MenuList, MenuButton, Text, Icon, Flex, Input, Button, Image, position } from "@chakra-ui/react"
import ContentCard from "../../components/Home/ContentCard"
import Metatag from "../../components/Metatag"


const postDetail = ({ postData }) =>{
    const router = useRouter()
    const userSelector = useSelector((state) => {return state.auth})

    const check = postData.Likes?.find((val) => {
        return val.user_id == userSelector?.id
    })

    const url = "http://localhost:3000" + router.pathname
    return (
        <Metatag 
            title={`post's ${postData.User?.username} from Social-media` }
            description={postData?.caption}
            image={`http://${postData?.image_url}`}
            url={url}
            type={'website'}
        >
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
        </Metatag>
    )
}

export default postDetail

export async function getServerSideProps(context){
    const { post_id } = context.params
    const res = await axios.get(`http://localhost:2000/post/detail/${post_id}`)
    // console.log(res)
    return {
        props : {
            postData : res.data.result
        }
    }
}