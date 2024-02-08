/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useContext, useEffect, useState } from 'react'
import { useStorage, useformatTime } from '../utils/hooks'
import { IFile, IReact, IThread, IUser } from '../utils/types'
import { TbMessage2Off } from 'react-icons/tb'
import {
  FaHandsBubbles,
  FaRegEye,
  FaRegFaceSmile,
  FaRegMessage,
  FaSquareCheck,
} from 'react-icons/fa6'
import { useRecoilValue } from 'recoil'
import { directState } from '../utils/state'
import DisplayFile from './DisplayFile'
import { WebSocketContext } from './SocketClient'

interface IProps {
  item: IThread
  onShowThread: (show: boolean, id: string) => void
}

const Message = ({ item, onShowThread }: IProps) => {
  const socket = useContext(WebSocketContext)

  const users = useRecoilValue<IUser[]>(directState)

  const [showToolsMessage, setShowToolMessage] = useState<{
    index: number | string
    options: string
  }>({
    index: '' || -1,
    options: '',
  })
  const [showEmoji, setShowEmoji] = useState(false)

  function handleHoverShowToolMessage(index: any, option: string) {
    if (
      showToolsMessage.index === index &&
      showToolsMessage.options === option
    ) {
      return (
        'flex gap-2 mr-2 absolute bottom-5 right-0 ring-1 ring-slate-400 p-2 rounded-md' +
        ' ' +
        option
      )
    } else {
      return (
        'flex gap-2 mr-2 absolute bottom-5 right-0 ring-1 ring-slate-400 p-2 rounded-md hidden' +
        ' ' +
        option
      )
    }
  }

  // const [emojiText, setEmojiText] = useState('')
  const [isReactOneTime, setIsReactOneTime] = useState(false)
  const [user, setUser] = useState<IUser>()
  const session = useStorage()
  const [hashEmoji, setHashEmoji] = useState<{ [key: string]: number }>({})
  useEffect(() => {
    if (item.reactions && item.reactions.length > 0) {
      const hash: any = {}
      item.reactions.map((react: IReact) => {
        hash[react.react] = react.quantity
      })
      setHashEmoji(hash)
    }

    if (session.getItem('user', 'local')) {
      setUser(JSON.parse(session.getItem('user', 'local')))
    }
  }, [])

  const AddEmoji = (e: any) => {
    const sym = e.unified.split('-')
    const codesArray: any = []
    sym.forEach((el: any) => codesArray.push('0x' + el))
    const emoji = String.fromCodePoint(...codesArray)
    setIsReactOneTime(!isReactOneTime)
    let quantity = 0
    if (isReactOneTime) {
      setHashEmoji((prevHashEmoji) => ({
        ...prevHashEmoji,
        [emoji]: prevHashEmoji[emoji] - 1,
      }))
      quantity = hashEmoji[emoji] - 1
    } else {
      setHashEmoji((prevHashEmoji) => ({
        ...prevHashEmoji,
        [emoji]: prevHashEmoji[emoji] ? prevHashEmoji[emoji] + 1 : 1,
      }))
      quantity = hashEmoji[emoji] ? hashEmoji[emoji] + 1 : 1
    }
    setIsReactOneTime(true)
    setShowEmoji(false)

    const newMsg = {
      react: emoji,
      quantity: quantity,
      threadId: item.id,
      senderId: user?.id,
    }
    socket?.emit('addReact', newMsg)
  }

  //when hashEmoji change will send emoji to server
  useEffect(() => {
    // socket?.emit('message', { message: value, timestamp: 'kuga' })
  }, [hashEmoji])

  return (
    <div key={item.id} className="flex space-x-2 items-start">
      <img
        className="rounded mt-1 h-10 w-10 object-cover"
        src={users?.find((e: IUser) => e.id === item.user.id)?.avatar}
        alt="logo"
      />
      <div
        className="font-medium w-full cursor-pointer hover:bg-zinc-800 ease-out duration-200 py-1"
        key={item.id}
        onMouseEnter={() => {
          handleHoverShowToolMessage(item.id, 'message')
          setShowToolMessage({
            index: item.id!,
            options: 'message',
          })
        }}
        onMouseLeave={() => {
          handleHoverShowToolMessage(-1, '')
          setShowEmoji(false)
          setShowToolMessage({
            index: -1,
            options: '',
          })
        }}
      >
        <div className="relative inline-flex items-center">
          <div className="relative inline-flex mr-1 text-zinc-200">
            <span className="">
              {users?.find((e: IUser) => e.id === item.user.id)?.name}
            </span>
          </div>
          <span className="text-xs text-zinc-400">
            {useformatTime(item.createdAt)}
          </span>
        </div>
        {/* message wrapper */}
        {item.isRecall && (
          <div className="text-sm text-zinc-400 dark:text-gray-400 rounded bg-slate-300 w-fit p-1 italic">
            The message is recalled
          </div>
        )}
        {!item.isRecall && (
          <>
            <div className="text-sm text-zinc-400 dark:text-gray-400">
              {/* message */}
              <div className="relative flex justify-start items-center ">
                <div className="relative inline-flex items-center">
                  <span className="text-zinc-400 pt-1 pb-1">
                    {item.messages?.message}
                    {item.files &&
                      item.files.map((file: IFile, index: any) => {
                        return <DisplayFile key={index} file={file} />
                      })}
                  </span>
                </div>
                <div className={handleHoverShowToolMessage(item.id, 'message')}>
                  <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-t-md p-1 flex gap-1 justify-center items-center text-green-400">
                    <FaSquareCheck />
                  </div>
                  <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-t-md p-1 flex gap-1 justify-center items-center text-yellow-50">
                    <FaRegEye />
                  </div>
                  <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-t-md p-1 flex gap-1 justify-center items-center text-yellow-200">
                    {' '}
                    <FaHandsBubbles />
                  </div>
                  <div
                    className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-t-md p-1 flex gap-1 justify-center items-center text-xs text-yellow-50"
                    onClick={() => {
                      setShowEmoji(!showEmoji)
                    }}
                  >
                    <FaRegFaceSmile />
                  </div>
                  <div
                    // onClick={() => {
                    //   onShowThread(true, item.id!)
                    // }}
                    className="cursor-pointer hover:bg-zinc-800 rounded-t-md active:bg-slate-400 p-1 flex gap-1 justify-center items-center text-xs text-yellow-50"
                  >
                    <FaRegMessage />
                    <span>Reply</span>
                  </div>
                  {showEmoji && (
                    <div className="absolute top-10 right-0 z-50 ">
                      <Picker
                        theme="dark"
                        emojiSize={20}
                        emojiButtonSize={28}
                        onEmojiSelect={AddEmoji}
                        data={data}
                      />
                    </div>
                  )}
                  <div
                    className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-t-md p-1 flex gap-1 justify-center items-center text-xs text-yellow-50"
                    onClick={() => {
                      socket?.emit('deleteThread', {
                        threadId: item.id,
                        senderId: user?.id,
                      })
                      socket?.on('deleteThread', (data: any) => {
                        if (data.thread.success) {
                          //set isRecall = true
                          item.isRecall = true
                        }
                      })
                    }}
                  >
                    <TbMessage2Off />
                  </div>
                </div>
              </div>
              {/* count replies */}
              {item.replys && item?.replys!.length > 0 && (
                <div className="relative inline-flex items-center justify-center gap-2 text-blue-400 font-normal pt-1">
                  <div className="flex items-center justify-center gap-1">
                    <div className="flex -space-x-3">
                      {item?.replys!.map((item: any, index: any) => (
                        <img
                          key={index}
                          className="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800"
                          src={
                            users?.find((e: IUser) => e.id === item.userid)
                              ?.avatar!
                          }
                          alt="logo"
                          width={25}
                          height={25}
                        />
                      ))}
                      {item?.replys!.length > 2 ? (
                        <a
                          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-zinc-100 bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                          href="/"
                        >
                          {item?.replys!.length - 2 > 0
                            ? `+${item?.replys!.length - 2}`
                            : ''}
                        </a>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <span className="cursor-pointer text-blue-400">
                    {item?.replys!.length} replies
                  </span>
                </div>
              )}
            </div>

            {hashEmoji &&
              Object.keys(hashEmoji).length > 0 &&
              Object.keys(hashEmoji).map((key: any, index: any) => {
                return (
                  <span
                    key={index}
                    className=" bottom-0 bg-blue-500 px-2 w-fit rounded-lg mr-1 py-[2px]"
                    onClick={() => {
                      setIsReactOneTime(!isReactOneTime)
                      let quantity = 0
                      if (isReactOneTime) {
                        setHashEmoji((prevHashEmoji) => ({
                          ...prevHashEmoji,
                          [key]: prevHashEmoji[key] - 1,
                        }))
                        quantity = hashEmoji[key] - 1
                      } else {
                        setHashEmoji((prevHashEmoji) => ({
                          ...prevHashEmoji,
                          [key]: prevHashEmoji[key] + 1,
                        }))
                        quantity = hashEmoji[key] + 1
                      }
                      const newMsg = {
                        react: key,
                        quantity: quantity,
                        threadId: item.id,
                        senderId: user?.id,
                      }
                      socket?.emit('addReact', newMsg)
                    }}
                  >
                    {key} {hashEmoji[key]}
                  </span>
                )
              })}
          </>
        )}
      </div>
    </div>
  )
}

export default Message
