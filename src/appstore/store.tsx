
import { configureStore } from "@reduxjs/toolkit";
import userSlide from '../feature/user/userSlide'
import chatSlide from '../feature/chat/chatSilde'
const rootReducer={
    Users:userSlide,
    Chats:chatSlide
}

const store=configureStore({
    reducer:rootReducer
})

export default store