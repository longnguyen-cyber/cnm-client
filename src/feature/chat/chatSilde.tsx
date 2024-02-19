import { createSlice } from "@reduxjs/toolkit";
import { UserGetAllChannel, UserGetAllSingleChat } from "./pathApi";


const initialState :any={
    chatSingleSlide:[],
    channelsSlide:[],
    loading:false,
    loadingSingChat:false,
    loadingChannelChat:false

}

const ChatSlide=createSlice({
    name:'chat',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
    builder.addCase(UserGetAllChannel.pending, (state, action) => {
      state.loadingChannelChat = true;
    })
    builder.addCase(UserGetAllChannel.rejected, (state, action) => {
      state.loadingChannelChat = false;
    })
    builder.addCase(UserGetAllChannel.fulfilled, (state: any, action) => {
      state.channelsSlide = action.payload.data
      state.loadingChannelChat = false;
    })
    builder.addCase(UserGetAllSingleChat.pending, (state, action) => {
      state.loadingSingChat = true;
    }
    )
    builder.addCase(UserGetAllSingleChat.rejected, (state, action) => {
      state.loadingSingChat = false;
    })
    builder.addCase(UserGetAllSingleChat.fulfilled, (state: any, action) => {
      state.chatSingleSlide = action.payload.data
      state.loadingSingChat = false;
    })
    }
})

const  {reducer}=ChatSlide
export default reducer