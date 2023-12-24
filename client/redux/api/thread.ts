import { IThread } from '@/utils/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const threadApi = createApi({
  reducerPath: 'threadApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.BASE_URL}threads` }),
  endpoints: (builder) => ({
    getThreadByChannelId: builder.query<IThread[], string>({
      query: (id) => `?channelId=${id}`,
    }),
    getThreadByChatId: builder.query<IThread[], string>({
      query: (id) => `?chatId=${id}`,
    }),

    addFile: builder.mutation<IThread, any>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetThreadByChannelIdQuery,
  useGetThreadByChatIdQuery,
  useAddFileMutation,
} = threadApi
