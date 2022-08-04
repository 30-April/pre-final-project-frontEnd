import { Flex, Box } from "@chakra-ui/react"
import Navbar from "../../components/Home/Navbar"
import ProfiePage from "../../components/Profile"


const userProfile = () =>{
    return (
        <>
            <Navbar/>
            <Flex flexWrap={'wrap'} justifyContent={'center'} >
                <ProfiePage/>
            </Flex>
        </>
    )
}

export default userProfile  