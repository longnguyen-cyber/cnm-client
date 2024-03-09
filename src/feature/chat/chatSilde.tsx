import { createSlice } from "@reduxjs/toolkit";
import { UserGetAllChannel,UserGetChannelById,UserGetChatsSingleById, UserGetAllSingleChat } from "./pathApi";


const initialState :any={
    chatSingleSlide:[],
    channelsSlide:[],
    loading:false,
    loadingSingChat:false,
    loadingChannelChat:false,
    channelId:null,
    loadingchanneid:false,
    loadingchatSingleId:false,
    chatSingleId:null


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
    builder.addCase(UserGetChannelById.pending, (state, action) => {
      state.loadingchanneid = true;
      
    })
    builder.addCase(UserGetChannelById.rejected, (state, action) => {
      state.loadingchanneid = false;
    })
    builder.addCase(UserGetChannelById.fulfilled, (state: any, action) => {
      state.channelId = action.payload.data
      state.loadingchanneid = false;
   
    })

    builder.addCase(UserGetChatsSingleById.pending, (state, action) => {
      state.loadingchatSingleId = true;

    })
    builder.addCase(UserGetChatsSingleById.rejected, (state, action) => {
      state.loadingchatSingleId = false;
    })
    builder.addCase(UserGetChatsSingleById.fulfilled, (state: any, action) => {
      state.chatSingleId = action.payload.data
      state.loadingchatSingleId = false;
    })



    }
})

const  {reducer}=ChatSlide
export default reducer