import { Button, Input, Text, MenuItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Textarea, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useFormik } from "formik";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../../library/api";

const M_resetPassword = (props) =>{
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast()
    const autoRender = useSelector((state) => { return state.render })
    const dispatch = useDispatch()


    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: async (value) =>{
            const { email } = formik.values
            try {
                let body = {
                    email
                }

                const bodyParsed = await qs.stringify(body)

                await axios.post(`http://localhost:2000/user/sendResetPassword`, bodyParsed).then(() =>{
                    toast({
                        title: "Your link has been sended successfully",
                        status: "success",
                        duration: 1000,
                    })
                }).then(onClose())

            } catch (err) {
                console.log(err)
            }
        }
    })

    return (
        <>
        <Button onClick={onOpen} variant='link' style={{textDecoration: 'none'}}>
          <Text color={'#5DBA7D'}>Forget Password?</Text>
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Forget Password?</ModalHeader>
                <ModalBody>
                  <Text mb={2}>Please enter your account's email for resetting your password</Text>
                    <Input onChange={async (event) => {
                        await formik.setFieldValue('email', event.target.value)
                    }}/>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                      CANCLE
                    </Button>
                    
                    <Button variant="ghost" colorScheme={'green'} onClick={async () => {
                        await formik.handleSubmit()
                    }}
                    >
                      SEND
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default M_resetPassword