import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Lorem,
    Button,
    useDisclosure,
    Icon,
    useToast,
    Flex,
    Stack,
    Input,
    FormLabel,
    Box,
    FormControl,
    Textarea,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { axiosInstance } from "../../../library/api";
import { useDispatch, useSelector } from "react-redux";
import auth_types from "../../../redux/reducers/types/auth";

const m_avatar = () => {
  const userSelector = useSelector((state) => {return state.auth})
  const autoRender = useSelector((state) => { return state.render })

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ selectedFile, setSelectedFile ] = useState(null)
  const toast = useToast()
  const inputFileRef = useRef()

  const handleFile = (event) =>{
    setSelectedFile(event.target.files[0])
  }

  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      location: "",
      caption: "",
    },
    onSubmit: async () =>{
      const formData = new FormData();

      formData.append('avatar', selectedFile)

      try {
        await axiosInstance.post(`/avatar/${userSelector?.id}`, formData).then((val) => {

          dispatch({
            type: auth_types.AUTH_LOGIN,
            payload: val.data.user
          })
    
          toast({
            title: "Pic has been posted successfully",
            status: "success",
            duration: 1000,
          })

           dispatch({
              type: "AUTO_RENDER",
              payload: {
                value : !autoRender.value
              }
            })
        }).then(onClose())

      } catch (err){
        console.log(err)
        toast({
          title: "Error",
          status: "error",
          duration: 1000,
        })
      }
    }
  })
    
  return (
  <>
    <Button bgColor={"#e3e3e3"} onClick={onOpen}>
      Change your profile picture
    </Button>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />  
        <ModalContent>
          <ModalHeader>Change Avatar</ModalHeader>
        <ModalCloseButton />
          
        <ModalBody>
            <Flex minH={"55vh"} align={"center"} justify={"center"}>
              <Stack spacing={4} w={['full', 'full']}>
                <FormControl display={'flex'} alignItems={'center'}>
                  <FormLabel>Avatar</FormLabel>
                  <Input
                    type={"file"}
                    display='none'
                    onChange={handleFile}
                    accept={"image/png, image/jpg, image/jpeg, image/gif"}
                    ref={inputFileRef}
                  />
                  <Button
                    colorScheme={"blue"}
                    onClick={() => inputFileRef.current.click()}
                  >
                    Upload Image
                  </Button>
                </FormControl>
              </Stack>
            </Flex>
        </ModalBody>
              
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          
          <Button variant="ghost" colorScheme={'green'} onClick={formik.handleSubmit}>
            Upload
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  );
};

export default m_avatar;
