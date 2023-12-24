import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { authApi } from './api/auth'
import { channelApi } from './api/channel'
import { chatApi } from './api/chat'
import { threadApi } from './api/thread'
import { userApi } from './api/user'

export function makeStore() {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [channelApi.reducerPath]: channelApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [threadApi.reducerPath]: threadApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        userApi.middleware,
        chatApi.middleware,
        channelApi.middleware,
        threadApi.middleware
      ),
  })
}

export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
