import { atom } from 'recoil'
import { IChannel, IUser } from './types'

export enum Status {
  IS_LOGIN = 'IS_LOGIN',
  IS_LOGOUT = 'IS_LOGOUT',
}

export const onlines: any[] = []

export const directState = atom<IUser[]>({
  key: 'directState',
  default: [],
})

export const channelsState = atom<IChannel[]>({
  key: 'channelsState',
  default: [],
})

export const userLogin = atom<IUser|null>({
  key: 'userLogin',
  default: null
})
