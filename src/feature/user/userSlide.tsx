import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getAllUser,
  userLogin,
  userRegister,
  userSeach,
  UserCreateChannel,
  UserCreateSingleChat,
  UserVerifyEmail,
  updateProfile,
} from "./pathApi";
import { IInitialStateUser, IUser } from "../../Type";
import { message, notification } from "antd";
import { useNavigate } from "react-router-dom";
//khai bao typescript

//kieu du lieu cho initalstate
const initialState: IInitialStateUser = {
  UserSlice: [],
  loading: false,
  tokenUser: null,
  accessTokenToGen2fa: null,
};

//tao slice

const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessTokenToGen2fa: (state, action: PayloadAction<string>) => {
      state.accessTokenToGen2fa = action.payload;
    },
    // ... other reducers ...
  },
  extraReducers: (builder) => {
    //trang thai bat dau ket noi vs server
    builder.addCase(getAllUser.pending, (state, action) => {
      state.loading = true;
    });
    //trang thai khong thanh cong
    builder.addCase(getAllUser.rejected, (state, action) => {
      state.loading = false;
    });

    //trang thai thanh cong
    //action.payload.data la data ma server tra ve
    //
    builder.addCase(getAllUser.fulfilled, (state: any, action) => {
      state.UserSlice = action.payload;
    });

    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      console.log("err");
      notification["error"]({
        message: "Thông báo",
        description: "Tài khoản hoặc mật khẩu không đúng ",
      });
    });

    builder.addCase(userLogin.fulfilled, (state: any, action: any) => {
      state.loading = false;
      console.log("vao dayy");
      if (action.payload.data) {
        notification["success"]({
          message: "Thông báo",
          description: "login success",
        });
        localStorage.setItem("user", JSON.stringify(action.payload.data));
        window.location.href = "/home";
      }
      if (action.payload.data.token) {
        localStorage.setItem(
          "tokenUser",
          JSON.stringify(action.payload.data.token)
        );
      }
    });
    // register
    builder.addCase(userRegister.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userRegister.rejected, (state, action) => {
      state.loading = false;
      notification["error"]({
        message: "Thông báo",
        description: "Tài khoản đã tồn tại",
      });
    });
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.loading = false;
      notification["success"]({
        message: "Thông báo",
        description: "Đăng ký thành công",
      });
    });
    builder.addCase(userSeach.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(userSeach.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(userSeach.fulfilled, (state: any, action) => {
      state.UserSlice = action.payload.data;
      console.log(state.UserSlice);
      state.loading = false;
    });

    builder.addCase(UserCreateChannel.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UserCreateChannel.rejected, (state, action) => {
      state.loading = false;
      notification["error"]({
        message: "Thông báo",
        description: "Tạo nhóm thất bại",
      });
    });

    builder.addCase(UserCreateChannel.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(UserCreateSingleChat.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UserCreateSingleChat.rejected, (state, action) => {
      state.loading = false;
      notification["error"]({
        message: "Thông báo",
        description: "Thêm bạn thất bại ",
      });
    });
    builder.addCase(UserCreateSingleChat.fulfilled, (state, action) => {
      state.loading = false;
      console.log(action.payload);
      notification["success"]({
        message: "Thông báo",
        description: "Thêm bạn thành công ",
      });
    });
    //verify email
    builder.addCase(UserVerifyEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UserVerifyEmail.rejected, (state, action) => {
      state.loading = false;
      notification["error"]({
        message: "Thông báo",
        description: "Xác thực thất bại",
      });
    });
    builder.addCase(UserVerifyEmail.fulfilled, (state, action) => {
      state.loading = false;
      // if(data.message==="Verify user success"){
      // navigate('/login')

      // state.accessTokenToGen2fa = action.payload.data.accessToken;
      notification["success"]({
        message: "Thông báo",
        description: "Xác thực thành công",
      });
    });
    // update profile
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      notification["error"]({
        message: "Thông báo",
        description: "Cập nhật thất bại",
      });
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      notification["success"]({
        message: "Thông báo",
        description: "Cập nhật thành công",
      });
    });
  },
});

const { reducer } = userSlide;
export default reducer;
