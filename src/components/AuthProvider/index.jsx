import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import jsCookie from "js-cookie";
import auth_types from "../../redux/reducers/types/auth";
import { axiosInstance } from "../../library/api";
import { Box, Center, Spinner } from "@chakra-ui/react";
import Loading from "../../public/Loading.gif"
import Image from "next/image";


function AuthProvider({ children }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async() =>{
      const userToken = jsCookie.get("auth_token");
      if (userToken) {
        const userResponse = await axiosInstance.get("/user/refresh-token", {
          headers: {
            authorization : userToken,
          }
        })
        console.log(userResponse)

        dispatch({
          type: auth_types.AUTH_LOGIN,
          payload: userResponse.data.result.user,
        });
      }
      setIsAuthChecked(true);

    }
    fetchData()
   
  //  setTimeout(()=> { fetchData() } , 1500)
  }, []);

  if (!isAuthChecked) return 
  <Center>
    <Spinner/>
  </Center>

  return (children)
  // return (
  //   isAuthChecked ? children : 
  //   <Center>
  //     <Image src={Loading} alt="" />
  //   </Center>
  // )
};

export default AuthProvider;