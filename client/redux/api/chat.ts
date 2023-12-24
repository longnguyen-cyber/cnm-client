import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.BASE_URL}chats` }),
  endpoints: (builder) => ({
    getAllChats: builder.query({
      query: () => '/',
    }),
  }),
})

export const { useGetAllChatsQuery } = chatApi
