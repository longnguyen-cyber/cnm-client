import { IThread } from '../../utils/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const threadApi = createApi({
  reducerPath: 'threadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}api/threads`,
  }),
  tagTypes: ['Thread'],
  endpoints: (builder) => ({
    getThreadByChannelId: builder.query<IThread[], string>({
      query: (id) => `?channelId=${id}`,
      providesTags(data: any) {
        const result = data.result as IThread[]

        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Thread' as const, id })),
            {
              type: 'Thread' as const,
              id: 'LIST',
            },
          ]
          return final
        }

        return [{ type: 'Thread', id: 'LIST' }]
      },
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
