import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}api/chats`,
  }),
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => '/',
    }),
  }),
})

export const { useGetAllChatsQuery } = chatApi
