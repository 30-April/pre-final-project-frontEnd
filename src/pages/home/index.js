import { Button, Center } from "@chakra-ui/react"
import jsCookie from "js-cookie";
import { useDispatch } from "react-redux";
import Home from "../../components/Home";
import auth_types from "../../redux/reducers/types/auth";

const home = () =>{
    return (
        <>
            <Home/>
        </>
    )   
}

export default home