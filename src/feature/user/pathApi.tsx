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
