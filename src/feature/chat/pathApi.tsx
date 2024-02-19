import { createAsyncThunk } from "@reduxjs/toolkit";
import UserApi from "../../api/user";
export const UserGetAllChannel=createAsyncThunk("UserGetAllChannel",async ()=>{
    const dataUser = UserApi.UserGetAllChannel();
    return dataUser;
  })
  export const UserGetAllSingleChat=createAsyncThunk("UserGetAllSingleChat",async ()=>{
    const dataUser = UserApi.UserGetAllSingleChat();
    return dataUser;
  })