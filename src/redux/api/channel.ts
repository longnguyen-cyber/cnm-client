import { IChannel } from '../../utils/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const channelApi = createApi({
  reducerPath: 'channelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}api/channels`,
  }),
  endpoints: (builder) => ({
    getAllChannels: builder.query<IChannel[], void>({
      query: () => '/',
    }),
    getChannelById: builder.query<IChannel, string>({
      query: (id) => `/${id}`,
    }),
    createChannel: builder.mutation<IChannel, Partial<IChannel>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
    }),
    updateChannel: builder.mutation<
      IChannel,
      Partial<{ id: string; body: Partial<IChannel> }>
    >({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteChannel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
    addUserToChannel: builder.mutation<IChannel, Partial<any>>({
      query: (body) => ({
        url: `/${body.id}/add-user`,
        method: 'PUT',
        body,
      }),
    }),
  }),
})

export const {
  useGetAllChannelsQuery,
  useGetChannelByIdQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useDeleteChannelMutation,
  useAddUserToChannelMutation,
} = channelApi
