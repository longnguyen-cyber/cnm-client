import { ChangeEvent, FormEvent, MouseEventHandler } from 'react'

export type StorageType = 'session' | 'local'
export type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string
  setItem: (key: string, value: string, type?: StorageType) => boolean
  removeItem: (key: string, type?: StorageType) => void
}

export type Handler = MouseEventHandler<HTMLHeadingElement>

export type FormSubmit = FormEvent<HTMLFormElement>
export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLSelectElement
>
export interface IAlert {
  loading?: boolean
  success?: string | string[]
  errors?: string | string[]
}

export interface IUserLogin {
  email: string
  password: string
}
export interface IUserRegister extends IUserLogin {
  lastName: string
  firstName: string
  cf_password: string
}

export interface IUser extends IUserLogin {
  firstName: string
  lastName: string
  avatar: string
  phone: string
  status: boolean
  id: string
  role: string
  enabled?: boolean
  displayName: string
  isOnline?: boolean
}

export interface IMessage {
  id?: string
  message: string
  threadId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IFile {
  id?: string
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
  threadId?: string
  thread?: IThread
}

export interface IReact {
  id?: string
  react: string
  quantity: number
  userId?: string
  user?: IUser
  threadId?: string
  thread?: IThread
}

export interface IUser {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
}
export interface IChannel {
  id?: string
  name: string
  isPublic: boolean
  // userId?: string[]
  userCreated: IUser
  users?: IUser[]
  thread?: IThread[]
}

export interface IThread {
  id?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
  isEdited?: boolean
  isRecall?: boolean
  channel?: IChannel
  channelId?: string
  chatId?: string
  messages: IMessage
  files?: IFile[]
  reactions?: IReact[]
  user: IUser
  replys?: IThread[]
}

export interface IChat {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string
  thread: IThread[]
  receiveId: string
  senderId: string
  user: IUser
}

export interface IRequestCreateChat {
  receiveId: string
  senderId: string
}
