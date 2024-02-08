/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { useGetAllChannelsQuery } from '../redux/api/channel'
import { useGetAllUsersQuery } from '../redux/api/user'
import { channelsState, directState } from '../utils/state'
import Header from './Header'
import Item from './Item'
import Slidebar from './Slidebar'

const Index = () => {
  const setDirectState = useSetRecoilState(directState)
  const { data: userDB } = useGetAllUsersQuery()
  useEffect(() => {
    if (userDB) {
      setDirectState(userDB)
    }
  }, [userDB])
  const setChannelState = useSetRecoilState(channelsState)
  const { data } = useGetAllChannelsQuery()
  useEffect(() => {
    if (data) {
      setChannelState(data)
    }
  }, [data])

  return (
    <main className="h-screen w-screen bg-black">
      <Header />

      <div className="flex h-[calc(100%-56px)]">
        <Slidebar />

        <div className="flex-1">{<Item />}</div>
      </div>
    </main>
  )
}

export default Index
