import axios from "axios";
import jsCoockie from "js-cookie"
import auth_types from "../redux/reducers/types/auth";
import store  from "../redux/store";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:2000"
});

axiosInstance.interceptors.request.use((config) =>{
  async function setting(){
    config.headers.authorization = jsCoockie.get("auth_token")
  }

  setting()

  return config
})

axiosInstance.interceptors.response.use(
  (res) =>{
    return res
  },
  (err) =>{
    if(err.response.status == 419){
        jsCoockie.remove("auth_token")


      store.dispatch({
        type : auth_types.AUTH_LOGOUT
      })
    }

    return err
  }
)