import { ILogin, IRegister } from "../Type";
import axiosClient from "./axiosClient";

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
    },
    UserSearch:(payload: { name: string })=>{
        const url = `users/search/${payload.name}`;
        // console.log(url)
        return axiosClient.get(url)
    },
    UserCreateChannel:(payload: any)=>{
        const url = `channels`;
        console.log(payload)
        return axiosClient.post(url,payload)
    },
    UserCreateSingleChat:(payload: any)=>{
        const url = `chats`;
        return axiosClient.post(url,payload)
    },
    UserGetAllChannel:()=>{
        const url = `channels`;
        return axiosClient.get(url)
    },
    UserGetAllSingleChat:()=>{
        const url = `chats`;
        return axiosClient.get(url)
    },
    UserGetChannelById:(payload: { id: string })=>{
        console.log(payload)
        const url = `/channels/${payload.id}`;
        return axiosClient.get(url)
    },
    UserGetChatsSingleById(payload: { id: string }) {
        const url = `/chats/${payload.id}`;
        return axiosClient.get(url)
    },
    UserFotGotPassword(payload:any){
        const url='users/forgot-password';
        return axiosClient.post(url,payload)
    },

    UserUpdate: (payload: any) => {
      const url = `users/reset-password`;
      return axiosClient.post(url, payload);
    },
    UserVerifyEmail: (payload: { token: string }) => {
        const url = `users/verify-email?token=${payload.token}`;
        return axiosClient.get(url);
    },
    userLoginGoogle:(tokenId:any)=>{
        const url='/users/google-login';
        return axiosClient.post(url,tokenId)
    },
   
}
export default UserApi
