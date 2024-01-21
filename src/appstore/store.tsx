
import { configureStore } from "@reduxjs/toolkit";
import userSlide from '../feature/user/userSlide'
const rootReducer={
    Users:userSlide

}

const store=configureStore({
    reducer:rootReducer
})

export default store