import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    Icon,
    Spinner,
    Box,
    Link,
  } from '@chakra-ui/react';
  import { axiosInstance } from '../../library/api';
  import { useRouter } from 'next/router'
  import { useEffect, useState } from 'react';
  import { BiError } from "react-icons/bi";
import { CheckCircleIcon } from '@chakra-ui/icons';

  export default function verifyAccount(props) {

    const [ verified, setVerified ] = useState(false)

    const router = useRouter()
    
    useEffect(()=> {
      async function updateVer(){
        const res =  await axiosInstance.patch("/user/verify/" + props.token)
        if(res.data){
          const success = res.data.success
          console.log(success)
          setVerified(success)
        }
      }
      updateVer()

    }, [router.isReady])

    return (
      <>
      {router.isReady? 
        <Box textAlign="center" py={10} px={6}>
          <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
          
          <Heading as="h2" size="xl" mt={6} mb={2}>
            Your account has been successfully verified
          </Heading>
        
          <Text color={'gray.500'}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
            eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
            voluptua.
          </Text>

          <Link href='/home' style={{textDecoration:'none'}}>
            <Button colorScheme={'green'} mt={5}> Go to your homepage </Button>
          </Link>
      </Box> : 
        
        <Spinner></Spinner>} 
      </>
    );
  }