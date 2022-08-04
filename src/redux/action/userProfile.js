import { axiosInstance } from "../../library/api";
import qs from "qs"

export function userProfile(values, setSubmitting){
    return async function(dispatch){
        try {
            let body = {
                full_name: values.full_name,
                username: values.username,
                website: values.website,
                bio: values.bio,
                phone_number: values.phone_number,
                gender: values.gender
            }

            const bodyParsed = await qs.stringify(body)

            const res = await axiosInstance.patch(`/user/${values.id}`, bodyParsed)
            console.log(res)

            setSubmitting(false)
            
        } catch (err){
            console.log(err);
            setSubmitting(false);
        }
    }
}