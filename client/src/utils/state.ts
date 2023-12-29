import { atom } from 'recoil'
import { IChannel, IUser } from './types'

export enum Status {
  IS_LOGIN = 'IS_LOGIN',
  IS_LOGOUT = 'IS_LOGOUT',
}

export const onlines: any[] = []

export const userState = atom<IUser[]>({
  key: 'userState',
  default: [],
})

export const channelsState = atom<IChannel[]>({
  key: 'channelsState',
  default: [],
})
