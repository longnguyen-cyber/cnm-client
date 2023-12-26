'use client'

import { useEffect, useState } from 'react'
import { useStorage } from '@/utils/hooks'
import Channel from '@/components/Channel'
import Header from '@/components/Header'
import Slidebar from '@/components/Slidebar'
import { IChannel, IUser } from '@/utils/types'
const Homepage = () => {
  const [itemChannel, setItemChannel] = useState<IChannel>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (session.getItem('channel', 'local')) {
      setItemChannel(JSON.parse(session.getItem('channel', 'local')))
      setLoading(false)
    }
  }, [])
  const [user, setUser] = useState<IUser>()
  const session = useStorage()
  // useEffect(() => {
  //   if (session.getItem('user', 'local')) {
  //     setUser(JSON.parse(session.getItem('user', 'local')))
  //   }
  // }, [])

  // if (!user) {
  //   return <Default />
  // }

  return (
    <main className="h-screen w-screen bg-black">
      <Header />
      {/* <div onClick={handleDownload}>
        <img
          src={'http://localhost/api/uploads/1691722998980-325068794.png'}
          alt=""
        />
      </div> */}
      <div className="flex h-[calc(100%-56px)]">
        <Slidebar setChannel={setItemChannel} />

        <div className="flex-1">
          {itemChannel && <Channel channel={itemChannel!} />}
        </div>
      </div>
    </main>
  )
}

export default Homepage
// const [socket, setSocket] = useState<Socket>()
// const [messages, setMessages] = useState<string[]>([])

// const send = (value: any) => {
//   socket?.emit('message', { message: value, timestamp: 'kuga' })
// }

// useEffect(() => {
//   const newSocket = io('http://localhost:8003')
//   setSocket(newSocket)
// }, [setSocket])

// const messageList = (message: string) => {
//   setMessages([...messages, message])
// }

// useEffect(() => {
//   socket?.on('message', messageList)

//   return () => {
//     socket?.off('message', messageList)
//   }
// }, [messageList])
