import { v4 as uuidv4 } from 'uuid'
import { Dropdown } from 'flowbite-react'
import Image from 'next/image'
import { memo, useEffect, useRef, useState } from 'react'
import { FaPencil, FaPlus } from 'react-icons/fa6'
import { IoPersonAdd } from 'react-icons/io5'
import io, { Socket } from 'socket.io-client'
import Input from './Input'
import Message from './Message'
import Thread from './Thread'
import { AiOutlineLock } from 'react-icons/ai'
import { useStorage, useformatDate } from '@/utils/hooks'
import { IThread, IChannel, IUser } from '@/utils/types'
import { useGetThreadByChannelIdQuery } from '@/redux/api/thread'
import Loading from './Loading'
import ModalAddUserToChannel from './modal/ModalAddUserToChannel'

const socket = io('http://localhost:8002')

interface IProps {
  channel: IChannel
}
function Channel({ channel }: IProps) {
  const session = useStorage()
  console.log(channel?.id)

  const [threadOfChannel, setThreadOfChannel] = useState<IThread[]>([])
  const { data: threadData, isSuccess: threadSuccess } =
    useGetThreadByChannelIdQuery(channel?.id!)

  useEffect(() => {
    if (threadData && threadSuccess) {
      const data = threadData as any
      setThreadOfChannel(data.data)
    }
  }, [threadData, threadSuccess])

  const [showThread, setShowThread] = useState({
    status: false,
    idMessageReplies: '',
  })

  const [openModalAddUserToChannel, setOpenModalAddUserToChannel] =
    useState(false)

  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const AddEmoji = (e: any) => {
    const sym = e.unified.split('-')
    const codesArray: any = []
    sym.forEach((el: any) => codesArray.push('0x' + el))
    const emoji = String.fromCodePoint(...codesArray)
    setText(text + emoji) // set text
    setShowEmoji(false) // hide emoji
  }
  let emojiRef = useRef<any>()
  useEffect(() => {
    let handle = (e: any) => {}
    document.addEventListener('mousedown', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
    }
  })
  const class_hover_iconInputChat =
    'cursor-pointer p-1 text-[1rem] rounded hover:bg-zinc-600'
  const [rowArea, setRowArea] = useState(1)
  const [heightArea, setHeightArea] = useState({
    body: 'h-75pt w-full relative overflow-hidden',
    input: 'h-25pt relative',
  })
  function handleTextArea(e: any) {
    let lengthTextArea = e.target.value.length
    if (lengthTextArea > 750) {
      setRowArea(8)
      setHeightArea({
        body: 'h-3/6 w-full relative overflow-hidden',
        input: 'h-3/6 relative',
      })
    } else if (lengthTextArea > 500) {
      setRowArea(4)
      setHeightArea({
        body: 'h-4/6 w-full relative overflow-hidden',
        input: 'h-2/6 relative',
      })
    } else if (lengthTextArea > 250) {
      setRowArea(2)
      setHeightArea({
        body: 'h-4/6 w-full relative overflow-hidden',
        input: 'h-2/6 relative',
      })
    } else if (lengthTextArea == 0) {
      setRowArea(1)
      setHeightArea({
        body: 'h-75pt w-full relative overflow-hidden',
        input: 'h-25pt relative',
      })
    }
  }
  function handleShowThread(status: boolean, idMessageReplies: string) {
    setShowThread({
      ...showThread,
      status: status,
      idMessageReplies: idMessageReplies,
    })
  }
  const [focusInput, setFocusInput] = useState({
    option: '',
  })
  function handleFocusInput(op: string) {
    if (op === focusInput.option) {
      return {
        cls_focus: 'flex items-center rounded p-1 bg-green-400 text-zinc-200',
        cls_hover:
          'cursor-pointer ease-linear duration-200 p-1 hover:bg-zinc-500 rounded',
      }
    } else {
      return {
        cls_focus: 'flex items-center rounded p-1 bg-zinc-800 text-zinc-400',
        cls_hover: 'cursor-pointer ease-linear duration-200 p-1',
      }
    }
  }

  //socket
  //socket

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
      console.log(data)
      setThreadOfChannel([...threadOfChannel, data])
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [send])

  //scroll message

  // if (!channel) return <Loading />

  return (
    <div className="flex flex-row">
      {/* content */}
      <div className="flex flex-col w-full h-[90vh]">
        {/* header thread */}
        <div className="h-12 flex items-center p-4 border-b-2 border-zinc-700">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold">
              <Dropdown
                inline
                label={
                  channel?.isPublic ? (
                    <># {channel?.name}</>
                  ) : (
                    <>
                      <AiOutlineLock /> {channel?.name}
                    </>
                  )
                }
              >
                <Dropdown.Item className="text-black">
                  View profile
                </Dropdown.Item>
                <Dropdown.Item className="text-black">
                  Start a conversation
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div className="flex items-center text-zinc-200 gap-2 ease-linear duration-150 p-1 rounded cursor-pointer">
              <div className="relative inline-flex items-center">
                {/* {channel.users &&
                  channel.users.map((user: IUser, index: number) => {
                    const countDisplay = 3
                    if (index < countDisplay) {
                      return (
                        <Image
                          key={user.id} // Add a unique key to each image element
                          className="rounded bg-white h-8 w-8 object-cover "
                          style={{
                            zIndex: -index,
                            position: 'relative', // Add relative positioning for stacking
                            left: `-${index * 4}px`, // Adjust the top position for stacking
                          }}
                          src={user.avatar! as string}
                          alt="logo"
                          width={30}
                          height={30}
                        />
                      )
                    } else {
                      return (
                        <span className="text-[#ccc]">
                          {channel?.users!.length - countDisplay}
                        </span>
                      )
                    }
                  })} */}
              </div>
            </div>
          </div>
        </div>
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
        <div className="w-full relative h-[66%] desktop:h-[86%]  overflow-auto">
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
              created this channel on August 3rd. This is the very beginning of
              the{' '}
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
              {threadOfChannel.map((item: IThread) => (
                <Message
                  key={item.id!}
                  item={item}
                  onShowThread={handleShowThread}
                />
              ))}
              <div ref={messageEndRef} />
            </div>
          </div>
        </div>
        <Input isThread={false} send={send} channel={channel} />
      </div>
      {/* thread */}
      {showThread.status && (
        <Thread
          onShowThread={handleShowThread}
          idMessageReplies={showThread.idMessageReplies}
        />
      )}
      {openModalAddUserToChannel && (
        <ModalAddUserToChannel
          channel={channel}
          setOpenModalAddUserToChannel={setOpenModalAddUserToChannel}
        />
      )}
    </div>
  )
}

export default Channel
