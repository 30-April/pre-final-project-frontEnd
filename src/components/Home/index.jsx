import { Container, Box, Stack, HStack, Flex, VStack, Center, Button } from "@chakra-ui/react";
import Navbar from "./Navbar";
import ContentCard from "./ContentCard";
import { useState } from "react";
import { axiosInstance } from "../../library/api";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Router from "next/router";
import Image from "next/image";
import Loading from "../../public/Loading.gif"
import InfiniteScroll from 'react-infinite-scroller';


const Home = () => {
    const [ isLoading, setIsLoading ] = useState(true)
    const userSelector = useSelector((state) => {return state.auth})
    const autoRender = useSelector((state) => {return state.render})
    const [ loadPage, setLoadPage ] = useState(1)
    const [ contentList, setContentList ] = useState([])


    const fetchData = async () =>{
        await axiosInstance.get("/post").then((res) =>{
            const data = res.data.result
            console.log(data)
            setContentList(data)
            
        }).catch((err) =>{})
    }

    const paging = async () =>{
        await axiosInstance.get(`/post/data?page=${loadPage}&limit=${5}`).then((res) =>{
            console.log(res.data)
            const newData = res.data.result
            setLoadPage(loadPage + 1)

            if(newData.length != 0){
                setLoadPage(loadPage + 1)
                setContentList([...contentList, ...newData])
                // alert(loadPage)

            }
        })
    }

    const renderContentCard = () =>{
        return contentList.map((val, index) =>{
            let like = false
            const check = val.Likes?.find((a) =>{
                return a?.user_id == userSelector?.id
            })
            !check ? like = false : like = true;

            return (
                <ContentCard key={index}
                    username = {val.User?.username}
                    location = {val?.location}
                    caption = {val?.caption}
                    image_url = {val?.image_url}
                    number_of_likes = {val?.number_of_likes}
                    user_id = {val.user_id}
                    post_id = {val?.id}
                    user_id_like =  {userSelector?.id}
                    liked = {!check ? false : true}
                    avatar_url = {val.User?.avatar_url}
                    postComment = {val?.Comments}
                    date = {val?.createdAt}
                />
            )
        })
    }

    useEffect(() => {
        if(autoRender?.value !== undefined)
        {
            setLoadPage(loadPage)
            fetchData()
            console.log(contentList)
        }
    }, [autoRender?.value])
    
    useEffect(() =>{
        if(!userSelector.id){
            Router.push('/auth')
        } else {
            setIsLoading(false)
        }
    }, [userSelector?.id])

    return (
        <>
        {isLoading ? 
            <Center minHeight={'100vh'} bgColor='white'>
                <Image src={Loading} alt=""/>
            </Center> 
            : 
            <>
                <Navbar/>
                    <InfiniteScroll
                        pageStart={1}
                        loadMore={paging}
                        hasMore={true || false}
                    >
                        <VStack spacing={5} m={['', '2vh auto']} w={['full', '80vw']} align={'center'}> 
                            {renderContentCard()}
                        </VStack>
                    </InfiniteScroll>
                    {/* <Button onClick={() => {paging()}}>AUTO RENDER</Button> */}
            </>
        }
        </>
    );
};

export default Home;