import { createAsyncThunk } from "@reduxjs/toolkit";
import UserApi from "../../api/user";
import { ILogin, IRegister } from "../../Type";
export const getAllUser = createAsyncThunk("getAllUser", async () => {
  const data = UserApi.getAllUser();

  return data;
});
export const userLogin = createAsyncThunk(
  "UserLogin",
  async (dataUserLogin: ILogin) => {
    const data = UserApi.UserLogin(dataUserLogin);
    return data;
  }
);
export const userRegister = createAsyncThunk(
  "UserRegister",
  async (dataUserRegister: IRegister) => {
    const data = UserApi.UserRegister(dataUserRegister);
    return data;
  }
);
export const userSeach=createAsyncThunk("UserSearch",async (payload: { name: string })=>{
  const dataUser = UserApi.UserSearch(payload);
  return dataUser;
})
export const UserCreateChannel=createAsyncThunk("UserCreateChannel",async (payload: any)=>{
  const dataUser = UserApi.UserCreateChannel(payload);
  return dataUser;
})
export const UserCreateSingleChat=createAsyncThunk("UserCreateSingleChat",async (payload: any)=>{
  const dataUser = UserApi.UserCreateSingleChat(payload);
  return dataUser;
} )

//const {data}=await axios.get(`${process.env.REACT_APP_API_URL}users/verify-email?token=${token}`,config)
export const UserVerifyEmail=createAsyncThunk("UserVerifyEmail",async (payload: { token: string })=>{
  const dataUser = UserApi.UserVerifyEmail(payload);
  return dataUser;
})

export const updateProfile=createAsyncThunk("updateProfile",async (payload: {data: any, token: any})=>{
  const dataUser = UserApi.updateProfileUser(payload);
  return dataUser;
})