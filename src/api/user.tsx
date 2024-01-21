import { ILogin, IRegister } from "../Type";
import axiosClient from "./axiosClient"

const UserApi={
    getAllUser:()=>{
        const url='/users'
        return axiosClient.get(url);
    }
    ,
    UserLogin:(data:ILogin)=>{
        const url='/users/login'
        return axiosClient.post(url,data)
    }
    ,
    UserRegister:(data:IRegister)=>{
        const url='/users/register'
        return axiosClient.post(url,data)
    }
}
export default UserApi