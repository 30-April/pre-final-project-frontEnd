import { Box, Flex } from "@chakra-ui/react"
import Navbar from "../../../components/Home/Navbar"
import ProfileSetting from "../../../components/ProfileSetting"



const userProfileSetting = () =>{
    return(
        <>
        <Navbar/>
        <Flex flexWrap={'wrap'} justifyContent={'center'} mt={10} mb={10}>
            <ProfileSetting/>
        </Flex>
        </>
    )
}

export default userProfileSetting