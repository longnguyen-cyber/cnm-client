import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUserLogin } from '@/utils/types'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BASE_URL}auth`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<any, IUserLogin>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
