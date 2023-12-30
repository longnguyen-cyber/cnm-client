/* eslint-disable react-hooks/exhaustive-deps */
import { useStorage } from '../utils/hooks'
import { onlines, userLogin } from '../utils/state'
import React, { useEffect, useState } from 'react'
import 'react-custom-alert/dist/index.css'
import { useSetRecoilState } from 'recoil'
import { Socket, io } from 'socket.io-client'

// export const socket = io(`${process.env.REACT_APP_BASE_URL}`)
export const WebSocketContext = React.createContext<Socket | null>(null)
export const WebSocketProvider = WebSocketContext.Provider

const SocketClient = ({ children }: { children: React.ReactNode }) => {
  const session = useStorage()
  const [socket, setSocket] = useState<Socket | null>(null)
  const setUserLogin = useSetRecoilState(userLogin)

  useEffect(() => {
    const user = session.getItem('user', 'local')
    if (user) {
      setUserLogin(JSON.parse(user))
      const userId = JSON.parse(user).id
      const newSocket = io(`${process.env.REACT_APP_BASE_URL}`, {
        auth: { userId },
      })
      setSocket(newSocket)
    } else {
      const newSocket = io(`${process.env.REACT_APP_BASE_URL}`, {
        auth: { userId: 'guest' },
      })
      setSocket(newSocket)
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('online', (data) => {
        onlines.splice(0, onlines.length, ...data)
      })
      socket.on('online', (data) => {
        onlines.splice(0, onlines.length, ...data)
      })
    }
  }, [socket])

  return <WebSocketProvider value={socket}>{children}</WebSocketProvider>
}

export default SocketClient
