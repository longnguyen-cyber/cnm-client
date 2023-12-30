import { IUser } from '../../utils/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}api/users`,
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUser[], void>({
      query: () => '/',
    }),
    getUserById: builder.query<IUser, string>({
      query: (id) => `?id=${id}`,
    }),
  }),
})

export const { useGetAllUsersQuery, useGetUserByIdQuery } = userApi
