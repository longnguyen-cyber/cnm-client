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
  const handleDownload = () => {
    const url = `http://localhost/api/uploads/1691722998980-325068794.png`
    const fileName = url.split('/').pop()
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = () => {
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(xhr.response)
      a.download = fileName!
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
    xhr.open('GET', url)
    xhr.send()
  }
  return (
    <main className="h-screen w-screen bg-black">
      <Header />
      {/* <div onClick={handleDownload}>
        <img
          src={'http://localhost/api/uploads/1691722998980-325068794.png'}
          alt=""
        />
      </div> */}
      <div className="flex">
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
