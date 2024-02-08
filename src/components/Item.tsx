/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineLock } from 'react-icons/ai'
import { FaPencil, FaPlus } from 'react-icons/fa6'
import { IoPersonAdd } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'
import { useChannel, useStorage, useformatDate } from '../utils/hooks'
import { IChannel, IThread } from '../utils/types'
import HeaderItem from './HeaderItem'
import Input from './Input'
import Loading from './Loading'
import Message from './Message'
import { WebSocketContext } from './SocketClient'
// import Thread from './Thread'
import ModalAddUserToChannel from './modal/ModalAddUserToChannel'
import ModalCreateChannel from './modal/ModalCreateChannel'

function Item() {
  const location = useLocation()
  const idSearch = new URLSearchParams(location.search).get('id') ?? ''
  const channelQuery = useChannel(idSearch)
  const [channel, setChannel] = useState<IChannel>()
  // const direct = useDirect(idSearch)
  const socket = useContext(WebSocketContext)
  const session = useStorage()

  const [threadOfChannel, setThreadOfChannel] = useState<IThread[]>([])

  useEffect(() => {
    const getThread = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}api/threads?channelId=${idSearch}`
      )
      const data = await res.json()
      setThreadOfChannel(data.data)
    }
    if (channel) {
      getThread()
    }

    setChannel(channelQuery)
  }, [channel, idSearch])

  const [showThread, setShowThread] = useState({
    status: false,
    idMessageReplies: '',
  })

  const [openModalAddUserToChannel, setOpenModalAddUserToChannel] =
    useState(false)
  const [openModalCreateChannel, setOpenModalCreateChannel] = useState(false)

  useEffect(() => {
    let handle = (e: any) => {}
    document.addEventListener('mousedown', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
    }
  })

  function handleShowThread(status: boolean, idMessageReplies: string) {
    setShowThread({
      ...showThread,
      status: status,
      idMessageReplies: idMessageReplies,
    })
  }

  const send = (value: any) => {
    if (session.getItem('user', 'local')) {
      const user = JSON.parse(session.getItem('user', 'local'))
      const newMsg: IThread = {
        messages: {
          message: value,
        },
        user,
        channelId: channel?.id!,
        createdAt: useformatDate(new Date().toUTCString()),
      }

      socket?.emit('sendThread', newMsg)
    }
  }
  const messageEndRef = useRef<any>(null)

  useEffect(() => {
    socket?.on('sendThread', (data: any) => {
      setThreadOfChannel([...threadOfChannel, data])
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [send])

  if (!channel) return <Loading />

  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col w-full h-[calc(100%-162px)]">
        {/* header thread */}
        <HeaderItem />
        {/* bookmark */}
        <div className="h-10 flex items-center text-zinc-400 font-medium text-sm border-b-2 border-zinc-700">
          <div className="flex items-center p-4">
            <div className="flex gap-1 items-center cursor-pointer">
              <FaPlus />
              <span className="text-sm">Add bookmark</span>
            </div>
          </div>
        </div>
        {/* content */}
        <div className="w-full relative h-full overflow-auto">
          {channel ? (
            <div className="p-4 flex flex-col items-start w-full">
              <h1 className="text-2xl text-white flex items-center">
                {channel?.isPublic ? (
                  <># {channel?.name}</>
                ) : (
                  <>
                    <AiOutlineLock /> {channel?.name}
                  </>
                )}
              </h1>
              <h5 className="text-white pb-1 flex items-center ">
                <span className="text-blue-500 bg-[#3e4041] rounded mr-1">
                  {/* @{channel.userCreated.name!}{' '} */}
                </span>{' '}
                created this channel on August 3rd. This is the very beginning
                of the{' '}
                {channel?.isPublic ? (
                  <># {channel?.name}</>
                ) : (
                  <>
                    <AiOutlineLock /> {channel?.name}
                  </>
                )}{' '}
                channel.
              </h5>
              <div className="flex items-center gap-4 text-white text-base">
                <div className="flex items-center gap-1 ring-1 border-zinc-700 rounded-md pl-1 pr-1 cursor-pointer">
                  <FaPencil className="text-sm" />
                  <span>Add description</span>
                </div>
                <div
                  className="flex items-center gap-1 ring-1 border-zinc-700 rounded-md pl-1 pr-1 cursor-pointer"
                  onClick={() => setOpenModalAddUserToChannel(true)}
                >
                  <IoPersonAdd className="text-sm" />
                  <span>Add people</span>
                </div>
              </div>
              <div className="h-1 w-full border-b-2 border-zinc-700 mt-2 mb-2"></div>
              <div className="w-full">
                {threadOfChannel.length > 0 &&
                  threadOfChannel.map((item: IThread) => (
                    <Message
                      key={item.id!}
                      item={item}
                      onShowThread={handleShowThread}
                    />
                  ))}
                <div ref={messageEndRef} />
              </div>
            </div>
          ) : (
            <>direct chat</>
          )}
        </div>
      </div>
      <Input isThread={false} send={send} channel={channel!} />
      {/* thread */}
      {/* {showThread.status && (
        <Thread
          onShowThread={handleShowThread}
          idMessageReplies={showThread.idMessageReplies}
        />
      )} */}
      {openModalAddUserToChannel && (
        <ModalAddUserToChannel
          channel={channel!}
          setChannel={setChannel}
          setOpenModalAddUserToChannel={setOpenModalAddUserToChannel}
          setOpenModalCreateChannel={setOpenModalCreateChannel}
        />
      )}

      {openModalCreateChannel && (
        <ModalCreateChannel
          setOpenModalCreateChannel={setOpenModalCreateChannel}
        />
      )}
    </div>
  )
}

export default Item
