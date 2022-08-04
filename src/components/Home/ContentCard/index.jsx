import { Avatar, Icon, Box, Flex, Stack, Text, Link, Center, Image, Input, Button, Tooltip, MenuButton, MenuList, MenuItem, Menu, HStack, VStack, PopoverTrigger, Popover, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, useToast, FormControl, FormHelperText } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { FaRegHeart, FaRegComment, FaRegPaperPlane, FaShareAlt, FaCommentSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import M_deletePost from "../../modals/M_deletePost";
import M_editPost from "../../modals/M_editPost";
import { FcLike } from "react-icons/fc"
import { axiosInstance } from "../../../library/api";
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, TwitterIcon } from "react-share";
import qs from "qs";
import { useFormik } from "formik";
import moment from "moment"
import { RiDislikeLine } from "react-icons/ri"
import { TbShareOff } from "react-icons/tb"
import * as Yup from "yup";

const ContentCard = (props) => {
    const dispatch = useDispatch()
    const { username, location, caption, number_of_likes, image_url, post_id, user_id, liked, avatar_url, postComment, date } = props;
    const userSelector = useSelector((state) => {return state.auth})
    const autoRender = useSelector((state) => { return state.render })
    const [ counter, setCounter ] = useState(5)
    const [ LinkCopy, setLinkCopy ] = useState(false)
    const [ newComment, setNewComment ] = useState(false)
    const [listComment, setListComment] = useState([...postComment].reverse())

    const [ isLike, setIsLike ] = useState(liked)
    const [ totalLike, setTotalLike ] = useState(0)
    const toast = useToast()

    const [ commentStatus, setCommentStatus ] = useState (false)
    console.log(listComment)
    const formik = useFormik({
        initialValues: {
            comment : "",
        },

        validationSchema: Yup.object().shape({
            comment: Yup.string().max(300, "your comment cannot be more than 300 words")
        }),

        validateOnChange: false,

        onSubmit: async () =>{
            const { comment } = formik.values
            try { 
                let body = {
                    comment: comment,
                    user_id: userSelector?.id, 
                    post_id,
                }
                console.log(listComment)
              const res =   await axiosInstance.post("/comment", qs.stringify(body))
                dispatch({
                    type: "AUTO_RENDER",
                    payload: {
                        value: !autoRender.value
                    }
                })

                const newcom = res.data.newcom
                const arr = [...listComment]
                arr.unshift(newcom)
                setListComment([...arr])

            } catch (err){
                console.log(err)
            }
            formik.setSubmitting(false)
            formik.resetForm("comment", "")
        }
    })

    useEffect(()=> {
        setIsLike(liked)
        setTotalLike(number_of_likes)
        setListComment([...postComment].reverse())
    }, [image_url])
    
    const handleLike = async () => {
        try {
            let body = {
                user_id : userSelector?.id,
                post_id,
            }

            await axiosInstance.post(`/like`, qs.stringify(body))

        } catch (err){}
    }
    
    const renderComment = () =>{
        return listComment?.map((val,idx) =>{
            if(idx < counter){
                return (
                    <HStack spacing={1} ml={2} mb={2} alignItems='start'>
                        <VStack>
                            <HStack p={1} mb={-2} justifyContent={'start'}>
                                <Avatar
                                    size="xs"
                                    name={val.User?.username}
                                    src={`http://${val.User?.avatar_url}`}
                                    mr={-1}
                                    />
                                    <Text fontWeight={'bold'}>{val.User?.username}</Text>
                            </HStack>
                                <Box>
                                    <Text fontSize={12}>{moment(val.createdAt).fromNow()}</Text>
                                </Box>
                            </VStack>
                        <Text p={1}>{val.comment}</Text>
                    </HStack>
                )
            }
            
        })
    }

    return (
        <Box 
            borderRadius={5}
            // bgColor={"#e3e3e3"}
            w={['full', '40%']}
            mx={'auto'}
            mb={'3vh'}
            boxShadow={'dark-lg'}
        > 
            <Flex
                alignItems={"center"}
                borderBottom={'1px'}
            
                p={2}
                borderRadius={5}
                justifyContent={'space-between'}         
            >
                <Box display={'flex'}>
                    <Link 
                        href={`/profile/${user_id}`} 
                        style={{textDecoration:'none'}}
                    >
                        <Avatar
                            size="md"
                            name="Segun Adebayo"
                            src={`http://${avatar_url}`}
                            mr={2}
                            _hover={
                                { border: "5px #CB6E35 solid"}
                                
                            }
                        />
                    </Link>

                    <Stack spacing={0}>
                        <Text fontWeight={'bold'} fontSize={18}>{username}</Text>
                        <Text fontWeight={'semibold'} fontSize={14}>{location}</Text>
                    </Stack>
                </Box>
                {userSelector.id == user_id? ( 
                    //ini buat munculin kalau menu ini muncul cuman buat post si user ae
                    <Menu>
                        <MenuButton>
                            <BiDotsVertical size={'24'} color={'#CB6E35'}/>
                        </MenuButton>
                        <MenuList bgColor={'#e3e3e3'} width={1}>
                            <M_editPost post_id = {post_id}/>
                            <M_deletePost
                                post_id = {post_id}
                            />
                        </MenuList>
                    </Menu>
                ) : null}
            </Flex>

            {/* Media Container (post) */}
            <Link href={`/post/${post_id}`}>
                <Center>
                    <Image 
                        src={`http://${image_url}`}
                    />
                </Center>
            </Link>

            <Box p={3} display="flex" alignItems="center" borderBlock={'1px'} borderColor={'black'}>
                {/* like */}
                {userSelector?.is_verified ? 
                    <Icon boxSize={6} as={isLike ? FcLike : FaRegHeart} onClick={() => {
                            handleLike();
                            setIsLike(!isLike);
                            isLike? setTotalLike(totalLike -1 ) : setTotalLike(totalLike +1 );
                        }} 
                        cursor="pointer"
                    /> : <Icon as={RiDislikeLine} boxSize={6} onClick={() => {
                        toast({
                            title: "please verified your account",
                            status: "warning",
                            isClosable: true,
                        })
                    }}
                    cursor="pointer"
                    />
                } 
                {/*comment*/}
                {userSelector?.is_verified ? 
                    <Icon
                        onClick={() => setCommentStatus(!commentStatus)}
                        ml={3}
                        boxSize={6}
                        as={FaRegComment}
                        sx={{
                            _hover: {
                            cursor: "pointer",
                            },
                        }}
                    /> : <Icon as={FaCommentSlash} boxSize={6} ml={3} onClick={() => {
                        toast({
                            title: "please verified your account",
                            status: "warning",
                            isClosable: true,
                        })
                    }}
                    cursor="pointer"
                    />
                }

                {/* shere post */}
                {userSelector?.is_verified ? 
                    <Popover>
                        <PopoverTrigger>
                            <Button variant= "link" color='black.300'>
                                <Icon boxSize={6} as={FaRegPaperPlane} ml={3}/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Share the contents!</PopoverHeader>
                            <PopoverBody>
                            <Flex>
                                <Box>
                                    <Tooltip hasArrow label='Facebook' shouldWrapChildren mt='3'>
                                        <FacebookShareButton url={`http://localhost:3000/post/${post_id}`}>
                                            <FacebookIcon size={40} round={true} />
                                        </FacebookShareButton>
                                    </Tooltip>
                                </Box>
                                    <Tooltip hasArrow label='WhatsApp'  shouldWrapChildren mt='3'>
                                <Box mx='7px'>
                                    <WhatsappShareButton url={`http://localhost:3000/post/${post_id}`}>
                                        <WhatsappIcon size={40} round={true} />
                                    </WhatsappShareButton>
                                </Box>
                                </Tooltip>

                                <Tooltip hasArrow label='Twitter' bg='#1DA1F2' shouldWrapChildren mt='3'>
                                        <Box mx='7px'>
                                            <TwitterShareButton url={`http://localhost:3000/post/${post_id}`}>
                                                <TwitterIcon size={40} round={true} />
                                            </TwitterShareButton>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip hasArrow label='Copy link' shouldWrapChildren mt='3'>
                                        <Box mx='7px'>
                                            <Button
                                            background='#DCD7C9'
                                            rounded='full'
                                            padding={4}
                                            onClick={() => {
                                                navigator.clipboard.writeText(`http://localhost:3000/post/${post_id}`)
                                                setLinkCopy(true)
                                                toast({
                                                title: "Link Copied",
                                                status: "success",
                                                isClosable: true,
                                                })
                                            }}
                                            > <Icon boxSize={4} as={FaShareAlt} /> &nbsp;Copy Link</Button>
                                        </Box>
                                </Tooltip>
                            </Flex>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    :
                    <Icon as={TbShareOff} boxSize={6} ml={3} onClick={() => {
                        toast({
                            title: "please verified your account",
                            status: "warning",
                            isClosable: true,
                        })
                    }}
                    cursor="pointer"
                    />
                }
                
            </Box>

            {/* Like Count */}
            <Box paddingX="3">
                <Text fontWeight="bold">
                    {totalLike} likes 
                    {/* {'|total like : ' + totalLike} {'|number_of_likes : ' + number_of_likes} */}
                </Text>
            </Box>

            {/* Caption */}
            <Box paddingX="3">
                <Text display="inline" fontWeight="bold" marginRight="2">
                    {username}
                </Text>
                <Text display="inline">{caption}</Text>
            </Box>

            {/* Comment Section */}
            <VStack align={'left'} p={3}>
                <Text fontWeight="bold" decoration="underline">
                    {postComment?.length} Comments
                </Text>

                <Box>

                    {renderComment()}
                </Box>

                {/* Comment Input */}
                {commentStatus? (
                    <Box display="flex">
                        <FormControl>
                        <Input
                            marginBottom="2"
                            type="text"
                            placeholder="Insert a new comment"
                            marginRight="4"
                            id="comment"
                            onChange={(event) => {
                                formik.setFieldValue("comment", event.target.value);
                            }}
                            value={formik.values.comment}
                        />
                        <FormHelperText textAlign={'left'} ml={2} mb={2} mt={0} color={'red'}>{formik.errors.comment}</FormHelperText>
                        </FormControl>
                        <Button 
                            colorScheme="blue"
                            onClick={formik.handleSubmit}
                            disabled={formik.values.comment.length > 0 ? false : true }    
                        >
                            Send
                        </Button>
                    </Box>
                ) : null}
                
                {/* Comment */}
                <Box align="center">
                    <Button 
                    bgColor='#CB6E35'
                    color = "white"
                    size="xs"
                    _hover={{ 
                        color: '#CB6E35',
                        border: '2px',
                        borderCollapse: "#CB6E35",
                        bgColor: "white"
                    }} 
                    w={['full', '30%']}
                    onClick={()=> {
                        setCounter(counter + 3)
                    }}
                >
                        see more
                    </Button>
                </Box>
                <Box>
                    <Text fontSize={12}>{moment(date).fromNow()}</Text>
                </Box>
            </VStack>
        </Box>
    );
};

export default ContentCard;
