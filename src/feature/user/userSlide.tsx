import { createSlice } from "@reduxjs/toolkit";
import { getAllUser, userLogin, userRegister ,userSeach} from "./pathApi";
import { IInitialStateUser, IUser } from "../../Type";
import { message, notification } from "antd";
//khai bao typescript

//kieu du lieu cho initalstate
const initialState: IInitialStateUser = {
  UserSlice: [],
  loading: false,
  tokenUser: null,
};

//tao slice

const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

      console.log(state.UserSlice);
    });

    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      console.log("vao day ne")
      notification["error"]({
        message: "Thông báo",
        description: "Tài khoản hoặc mật khẩu không đúng ",
      });
    });

    builder.addCase(userLogin.fulfilled, (state: any, action: any) => {
      state.loading = false;
      if(action.payload.data){
        notification["success"]({
          message: "Thông báo",
          description: "login success",
        });
       
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      }
      if(action.payload.data.token){
       
        localStorage.setItem('tokenUser', JSON.stringify(action.payload.data.token));
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

  })
  builder.addCase(userSeach.rejected, (state, action) => {
    state.loading = false;
  })

  builder.addCase(userSeach.fulfilled, (state:any, action) => {
    state.UserSlice = action.payload
    console.log(state.UserSlice)
    state.loading = false;
  })
  },
});

const { reducer } = userSlide
export default reducer


