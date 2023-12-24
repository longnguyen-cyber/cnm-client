import { useGetAllUsersQuery } from '@/redux/api/user'
import { useformatTime } from '@/utils/hooks'
import { IThread, IUser } from '@/utils/types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Picker from '@emoji-mart/react'

import {
  FaHandsBubbles,
  FaRegEye,
  FaRegFaceSmile,
  FaRegMessage,
  FaSquareCheck,
} from 'react-icons/fa6'

interface IProps {
  item: IThread
  onShowThread: (show: boolean, id: string) => void
}

const Message = ({ item, onShowThread }: IProps) => {
  const [users, setUsers] = useState<IUser[]>([])
  const { data: userData, isSuccess: userSuccess } = useGetAllUsersQuery()

  useEffect(() => {
    if (userSuccess && userData) {
      const data = userData as any
      setUsers(data.data)
    }
  }, [userSuccess, userData])

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
  return (
    <div key={item.id} className="flex space-x-2 items-center">
      <img
        className="rounded mt-1 h-10 w-10 object-cover"
        // src={users.find((e: IUser) => e.id == item.user.id)?.avatar}
        src={users.find((e: IUser) => e.id == item.user.id)?.avatar! as string}
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
              {users.find((e: IUser) => e.id == item.user.id)?.name}
            </span>
          </div>
          <span className="text-xs text-zinc-400">
            {useformatTime(item.createdAt)}
          </span>
        </div>
        {/* message wrapper */}
        <div className="text-sm text-zinc-400 dark:text-gray-400">
          {/* message */}
          <div className="relative flex justify-start items-center ">
            <div className="relative inline-flex items-center">
              <span className="text-zinc-400 pt-1 pb-1">
                {item.messages?.message}
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
                    // onEmojiSelect={AddEmoji}
                    // data={data}
                  />
                </div>
              )}
            </div>
          </div>
          {/* count replies */}
          {item.replys && item?.replys!.length > 0 && (
            <div className="relative inline-flex items-center justify-center gap-2 text-blue-400 font-normal pt-1">
              <div className="flex items-center justify-center gap-1">
                <div className="flex -space-x-3">
                  {item?.replys!.map((item: any, index: any) => (
                    <Image
                      key={index}
                      className="w-6 h-6 border-2 border-white rounded-full dark:border-gray-800"
                      src={
                        users.find((e: IUser) => e.id == item.userid)?.avatar!
                      }
                      alt="logo"
                      width={25}
                      height={25}
                    />
                  ))}
                  {item?.replys!.length > 2 ? (
                    <a
                      className="flex items-center justify-center w-6 h-6 text-xs font-medium text-zinc-100 bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                      href="#"
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
      </div>
    </div>
  )
}

export default Message
