'use client'

import { store } from '@/redux/store'
import { useStorage } from '@/utils/hooks'
import { onlines } from '@/utils/state'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-custom-alert'
import 'react-custom-alert/dist/index.css'
import { Provider } from 'react-redux'
import { io, Socket } from 'socket.io-client'

// export const socket = io(`${process.env.BASE_URL}`)
export const WebSocketContext = React.createContext<Socket | null>(null)
export const WebSocketProvider = WebSocketContext.Provider

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const session = useStorage()
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const user = session.getItem('user', 'local')
    if (user) {
      const userId = JSON.parse(user).id
      const newSocket = io(`${process.env.BASE_URL}`, {
        auth: { userId },
      })
      setSocket(newSocket)
    } else {
      const newSocket = io(`${process.env.BASE_URL}`, {
        auth: { userId: 'guest' },
      })
      setSocket(newSocket)
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('online', (data) => {
        console.log('connected', data)
        onlines.splice(0, onlines.length, ...data)
      })
      socket.on('online', (data) => {
        onlines.splice(0, onlines.length, ...data)
      })
    }
  }, [socket])

  return (
    <WebSocketProvider value={socket}>
      <ToastContainer floatingTime={1000} />
      <Provider store={store}>{children}</Provider>
    </WebSocketProvider>
  )
}

export default Wrapper
