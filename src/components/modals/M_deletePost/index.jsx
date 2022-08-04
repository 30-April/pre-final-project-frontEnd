import { Button, Text, MenuItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../../../library/api";
import { useRouter } from "next/router";


const m_deletePost = (props) =>{
    const toast = useToast()
    const { post_id } = props
    const { isOpen, onOpen, onClose } = useDisclosure();
    const autoRender = useSelector((state) => { return state.render })
    const router = useRouter()
    
    const dispatch = useDispatch()
    return (
        <>
        <MenuItem onClick={onOpen}>
            Delete
        </MenuItem>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Confirmation</ModalHeader>
                
                <ModalBody>
                    <Text>Do you really want to delete this post?</Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onClose}>
                        CANCLE
                    </Button>
                    
                    <Button variant="ghost" colorScheme={'green'} onClick={async () => {
                        await axiosInstance.delete(`/post/${post_id}`).then(() => {
                            toast({
                                title: "your post has been deleted successfully",
                                status: "success",
                                duration: 1000,
                            })

                            dispatch({
                                type: "AUTO_RENDER",
                                payload: {
                                  value : !autoRender.value
                                }
                            })
                            
                        }).then(() =>
                            {
                                onClose()
                                router.push('/home')
                            }
                        )
                    }}>
                        DELETE
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
        </>
    )
}

export default m_deletePost