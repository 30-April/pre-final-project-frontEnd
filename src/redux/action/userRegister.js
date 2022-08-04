import jsCookie from "js-cookie";
import { axiosInstance } from "../../library/api";
import auth_types from "../reducers/types/auth";
import qs from "qs";

export function userRegister(values, setSubmitting) {
  return async function (dispatch) {
    try {
      let body = {
        username: values.username,
        email: values.email,
        password: values.password,
        full_name: values.full_name,
      };

      const bodyParsed = await qs.stringify(body);

      console.log(bodyParsed);

      const res = await axiosInstance.post("/user/register", bodyParsed);
      console.log(res.data.result)

      const userData = res.data.result.user;
      const token = res.data.result.token;

      jsCookie.set("auth_token", token);
      dispatch({
        type: auth_types.AUTH_LOGIN,
        payload: userData
      })

      setSubmitting(false);

    } catch (err) {
      console.log(err);
      setSubmitting(false);
    }
  };
}