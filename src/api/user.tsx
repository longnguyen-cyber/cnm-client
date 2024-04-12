import { ILogin, IRegister } from "../Type";
import axiosClient from "./axiosClient";

const UserApi = {
  getUserById: (id: string) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  getAllUser: () => {
    const url = "/users";
    return axiosClient.get(url);
  },
  UserLogin: (data: ILogin) => {
    const url = "/users/login";
    return axiosClient.post(url, data);
  },
  UserRegister: (data: IRegister) => {
    const url = "/users/register";
    return axiosClient.post(url, data);
  },
  UserSearch: (payload: { name: string }) => {
    const url = `users/search/${payload.name}`;
    return axiosClient.get(url);
  },
  UserCreateChannel: (payload: any) => {
    const url = `channels`;
    return axiosClient.post(url, payload);
  },
  UserCreateSingleChat: (payload: any) => {
    const url = `chats`;
    return axiosClient.post(url, payload);
  },
  UserGetAllChannel: () => {
    const url = `channels`;
    return axiosClient.get(url);
  },
  UserGetAllSingleChat: () => {
    const url = `chats`;
    return axiosClient.get(url);
  },

  UserGetAllSingleChatwhitelistFriendAccept: () => {
    const url = `friend/whitelistFriendAccept`;
    return axiosClient.get(url);
  },

  UserGetAllSingleChatfriendwaitlistFriendAccept: () => {
    const url = `chats/friend/waitlistFriendAccept`;
    return axiosClient.get(url);
  },

  getFriendChatWaittingAccept: (receiveId: string) => {
    const url = `chats/${receiveId}/friendChatWaittingAccept`;
    return axiosClient.get(url);
  },

  UserGetChannelById: (payload: { id: string }) => {
    const url = `/channels/${payload.id}`;
    return axiosClient.get(url);
  },
  UserGetChatsSingleById(payload: { id: string }) {
    const url = `/chats/${payload.id}`;
    return axiosClient.get(url);
  },
  UserFotGotPassword(payload: any) {
    const url = "users/forgot-password";
    return axiosClient.post(url, payload);
  },

  UserUpdate: (payload: any) => {
    const url = `users/reset-password`;
    return axiosClient.post(url, payload);
  },
  UserVerifyEmail: (payload: { token: string }) => {
    const url = `users/verify-email?token=${payload.token}`;
    return axiosClient.get(url);
  },
  userLoginGoogle: (tokenId: any) => {
    const url = "/users/google-login";
    return axiosClient.post(url, tokenId);
  },
  updateUserProfile: (payload: any) => {
    const url = `users/update`;
    return axiosClient.post(url, payload);
  },

  userUploadImage: (formData: any) => {
    const url = `/upload`;
    return axiosClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateProfileUser: (payload: any) => {
    const url = `users/update`;
    return axiosClient.put(url, payload);
  },
};
export default UserApi;
