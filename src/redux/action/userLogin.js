import jsCookie from "js-cookie";
import { axiosInstance } from "../../library/api";
import auth_types from "../reducers/types/auth";
import qs from "qs";

export function userLogin(values, setSubmitting) {
  return async function (dispatch) {
    try {
      let body = {
        username: values.username,
        email: values.username,
        password: values.password,
      };

      const bodyParsed = await qs.stringify(body);

      console.log(bodyParsed);
    
      const res = await axiosInstance.post("/user/login", bodyParsed);
      console.log(res.data);
      

      const userData = res.data.result.user;
      const token = res.data.result.token;
      console.log(token);


      if (!res.data.result) {
        throw new Error("User not found");
      }

      jsCookie.set("auth_token", token);
      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: userData
      })

      setSubmitting(false);

    } catch (err) {
      console.log(err);
      alert('username/password/email is not found')
      
      setSubmitting(false);
    }
  };
}