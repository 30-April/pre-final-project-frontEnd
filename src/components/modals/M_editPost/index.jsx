import { Button, Text, MenuItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Textarea, useToast } from "@chakra-ui/react"
import { useFormik } from "formik";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../../library/api";

const m_editPost = (props) =>{
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { originalCaption, post_id } = props
    const toast = useToast()
    const autoRender = useSelector((state) => { return state.render })
    const dispatch = useDispatch()


    const formik = useFormik({
        initialValues: {
            caption: '',
        },
        onSubmit: async (value) =>{
            const { caption } = formik.values
            try {
                let body = {
                    caption
                }

                const bodyParsed = await qs.stringify(body)

                await axiosInstance.patch(`/post/${post_id}`, bodyParsed).then(() =>{
                    toast({
                        title: "Your post has been edited successfully",
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

            } catch (err) {
                console.log(err)
            }
        }
    })

    return (
        <>
        <MenuItem onClick={onOpen}>
            Edit
        </MenuItem>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>You can only edit your caption!</ModalHeader>
                <ModalBody>
                    <Textarea onChange={async (event) => {
                        await formik.setFieldValue('caption', event.target.value)
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
                        SAVE
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
        </>
    )
}

export default m_editPost