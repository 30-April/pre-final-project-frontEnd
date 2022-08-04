import qs from "qs";
import { axiosInstance } from "../../library/api";
import post_types from "../reducers/types/post";


const postDelete = (values, setSubmitting) => {
    return async function (dispatch) {
        try {
            let body = {
                id : values.id,
                user_id: values.user_id
            }

            const bodyParsed = await qs.stringify(body)
    
            const res = await axiosInstance.delete("post/:id", bodyParsed)
            const postData = res.data.result.post

            dispatch({
                type: post_types.POST_DELETE,
                payload: postData
            })

            setSubmitting(false);
        } catch (err) {
            console.log(err);
            setSubmitting(false);
        }
    }
}

export default postDelete