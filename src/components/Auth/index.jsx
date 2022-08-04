import { Box, Center, Flex, HStack, Stack, Link, Container, Text, Heading, } from "@chakra-ui/react"
import Image from 'next/image';
import { useState } from "react"
import Login from "./Login"
import Register from "./Register"
import LoginPic from "../../public/Login_picture.gif"


const userAuth = () =>{
    const [formChange, setFormChange] = useState("false")
    const change = () =>{
        setFormChange(!formChange)
    }
    
    return (
        <Flex h={'100vh'} align={"center"} justify={'center'}>
            <Container display={'flex'} maxW={"80vw"} justifyContent={'space-evenly'} h={['90%']} alignItems={'center'}>
                <Box>
                    <Image 
                        src = {LoginPic}
                        alt= "Image Login"
                        width={500}
                        height={500}
                    />
                </Box>

                <Box id="LoginForm" maxW={'50%'} align={'center'}>
                    {formChange? (
                        <Login formStatus={() => setFormChange(!formChange)}/>
                    )
                    : (
                        <Register formStatus={() => setFormChange(!formChange)}/>
                    )}
                </Box>
            </Container>
        </Flex>
    )
}

export default userAuth