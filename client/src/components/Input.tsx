/* eslint-disable react-hooks/exhaustive-deps */
import data from '@emoji-mart/data'

import Picker from '@emoji-mart/react'
import { useEffect, useRef, useState } from 'react'

import { FaAt, FaPaperPlane } from 'react-icons/fa6'

import {
  AiOutlineBars,
  AiOutlineCode,
  AiOutlineLink,
  AiOutlineOrderedList,
  AiOutlineUnderline,
} from 'react-icons/ai'
import { BiMicrophone, BiVideo } from 'react-icons/bi'
import {
  FaB,
  FaCode,
  FaFaceSmileBeam,
  FaItalic,
  FaRegFaceSmile,
} from 'react-icons/fa6'
import { RiAddLine } from 'react-icons/ri'
import { useAddFileMutation } from '../redux/api/thread'
import { useStorage } from '../utils/hooks'
import { IChannel } from '../utils/types'

interface Props {
  isThread: boolean
  send: (value: string) => void
  channel: IChannel
}

const Input = ({ isThread, send, channel }: Props) => {
  const [showEmoji, setShowEmoji] = useState(false)

  const AddEmoji = (e: any) => {
    const sym = e.unified.split('-')
    const codesArray: any = []
    sym.forEach((el: any) => codesArray.push('0x' + el))
    const emoji = String.fromCodePoint(...codesArray)
    setValue(value + emoji)
    setShowEmoji(false)
  }

  let emojiRef = useRef<any>()
  useEffect(() => {
    let handle = (e: any) => {
      if (!emojiRef.current.contains(e.target)) {
        setShowEmoji(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
    }
  })

  const [value, setValue] = useState<string>('')
  const [file, setFile] = useState<File>()
  const [addFile] = useAddFileMutation()
  const session = useStorage()
  useEffect(() => {
    if (session.getItem('user', 'local')) {
      const user = JSON.parse(session.getItem('user', 'local'))
      const formData = new FormData()
      formData.append('file', file!)
      formData.append('senderId', user.id.toString())
      formData.append('channelId', channel?.id!.toString())

      if (file) {
        addFile(formData).then((res) => {})
      }
    }
  }, [file])

  return (
    <div
      className={`absolute bottom-0 flex items-center p-4 text-zinc-400`}
      style={{
        width: '-webkit-fill-available',
      }}
    >
      <div className="flex flex-col items-start justify-around w-full rounded-md ring-1 ring-zinc-600 bg-zinc-900">
        <div className="w-full flex flex-row items-center justify-start p-1 gap-2">
          <div className="class_hover_iconInputChat">
            <FaB />
          </div>
          <div className="class_hover_iconInputChat">
            <FaItalic />
          </div>
          <div className="class_hover_iconInputChat">
            <AiOutlineUnderline />
          </div>
          <label
            htmlFor="file"
            className="class_hover_iconInputChat cursor-pointer"
          >
            <AiOutlineLink />
            <input
              type="file"
              id="file"
              hidden
              onChange={(e) => {
                setFile(e.target.files![0])
              }}
            />
          </label>
          <div className="class_hover_iconInputChat">
            <AiOutlineOrderedList />
          </div>
          <div className="class_hover_iconInputChat">
            <AiOutlineBars />
          </div>
          <div className="class_hover_iconInputChat">
            <FaCode />
          </div>
          <div className="class_hover_iconInputChat">
            <AiOutlineCode />
          </div>
        </div>
        {/* text are */}
        <div className="w-full flex items-center justify-between p-2">
          <input
            className="border-0 p-3 w-full bg-zinc-900 border-none placeholder:text-zinc-400 focus:border-0 focus:border-none focus:outline-0"
            style={{
              border: 'none',
            }}
            placeholder={`Message ${channel?.name}`}
            value={value}
            onChange={(e: any) => {
              setValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (value === '') return
                send(value)
                setValue('')
              }
            }}
          />
        </div>
        {/* button bottom */}
        <div className="w-full flex items-center justify-between p-1 gap-2">
          <div className="flex items-center gap-2 ">
            <div className="class_hover_iconInputChat">
              <div className="rounded-full bg-zinc-700 p-[1px]">
                <RiAddLine />
              </div>
            </div>
            <div
              className="class_hover_iconInputChat relative flex items-center justify-center"
              onMouseEnter={() => {
                setShowEmoji(true)
              }}
              onMouseLeave={() => {
                setShowEmoji(false)
              }}
            >
              {!showEmoji && <FaRegFaceSmile />}
              {showEmoji && (
                <FaFaceSmileBeam className="text-yellow-300 rotate-45" />
              )}
              <div
                ref={emojiRef}
                className=" inline-flex items-center justify-center"
              >
                {showEmoji && (
                  <div className="absolute bottom-0 m-4 p-4">
                    <Picker
                      theme="dark"
                      emojiSize={20}
                      emojiButtonSize={28}
                      onEmojiSelect={AddEmoji}
                      data={data}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="class_hover_iconInputChat">
              <FaAt />
            </div>
            <div className="border-r-2 h-4"></div>
            <div className="class_hover_iconInputChat">
              <BiVideo />
            </div>
            <div className="class_hover_iconInputChat">
              <BiMicrophone />
            </div>
          </div>
          {/* button send */}
          <div className="flex items-center">
            <button
              onClick={() => {
                if (value === '') return
                send(value)
                setValue('')
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Input
