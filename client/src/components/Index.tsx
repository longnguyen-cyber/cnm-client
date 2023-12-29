import { Outlet } from 'react-router-dom'
import Slidebar from './Slidebar'
import Header from './Header'
import { useState, useEffect } from 'react'
import { useStorage } from '../utils/hooks'
import { IChannel, IUser } from '../utils/types'
import Channel from './Item'

const Index = () => {
  const [itemChannel, setItemChannel] = useState<IChannel>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (session.getItem('channel', 'local')) {
      setItemChannel(JSON.parse(session.getItem('channel', 'local')))
      setLoading(false)
    }
  }, [])

  const session = useStorage()
  return (
    <main className="h-screen w-screen bg-black">
      <Header />

      <div className="flex h-[calc(100%-56px)]">
        <Slidebar setChannel={setItemChannel} />

        <div className="flex-1">
          {itemChannel && <Channel channel={itemChannel!} />}
        </div>
      </div>
    </main>
  )
}

export default Index
