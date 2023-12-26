'use client'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import Image from 'next/image'
import { memo, useEffect, useRef, useState } from 'react'
import {
  AiOutlineBars,
  AiOutlineCode,
  AiOutlineLink,
  AiOutlineOrderedList,
  AiOutlineUnderline,
} from 'react-icons/ai'
import { BiMicrophone, BiVideo } from 'react-icons/bi'
import {
  FaAngleDown,
  FaAt,
  FaB,
  FaCode,
  FaFaceSmileBeam,
  FaHandsBubbles,
  FaItalic,
  FaPaperPlane,
  FaRegEye,
  FaRegFaceSmile,
  FaRegMessage,
  FaSquareCheck,
  FaXmark,
} from 'react-icons/fa6'
import { RiAddLine } from 'react-icons/ri'
let arrUser = [
  {
    id: 1,
    name: 'Kuga',
    image: '/images.png',
  },
  {
    id: 2,
    name: 'Phòng Em',
    image: '/avata.png',
  },
]

let arrMessage = [
  {
    id: 1,
    userid: 1,
    content: 'Hello',
    times: '10:00 AM',
    comment: [
      {
        id: 1,
        userid: 2,
        times: '10:01 AM',
        comment: 'xin chào Kuga',
      },
      {
        id: 2,
        userid: 1,
        times: '10:02 AM',
        comment: 'xin chào Phòng Em',
      },
      {
        id: 3,
        userid: 2,
        times: '10:03 AM',
        comment: 'Bạn có khỏe không?',
      },
    ],
  },
  {
    id: 2,
    userid: 2,
    content: 'How are you?',
    times: '10:30 AM',
    comment: [
      {
        id: 1,
        userid: 1,
        times: '10:31 AM',
        comment: "I'm fine",
      },
    ],
  },
]

function Thread({ onShowThread, idMessageReplies: idMessageReplies }: any) {
  const [showToolsMessage, setShowToolMessage] = useState({
    index: -1,
    options: '',
  })
  function HoverShowToolMessage(index: any, option: string) {
    if (
      showToolsMessage.index === index &&
      showToolsMessage.options === option
    ) {
      return (
        'flex items-center gap-1 absolute -bottom-4 p-1 right-0 ring-1 ring-slate-400 rounded' +
        ' ' +
        option
      )
    } else {
      return (
        'flex items-center gap-1 absolute -bottom-4 p-1 right-0 ring-1 ring-slate-400 rounded hidden' +
        ' ' +
        option
      )
    }
  }
  // -------------------------------------------------------
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
  const class_hover_iconInputChat = 'cursor-pointer rounded hover:bg-zinc-600'
  // -------------------------------------------------------
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
  const [activeItemSlideBar, setActiveItemSlideBar] = useState('proj-datn')
  const [showCamera, setShowCamera] = useState(false)
  // -------------------------------------------------------
  return (
    <div className="w-3/6 h-full flex flex-col border-l-2 border-zinc-700">
      {/* header */}
      <div className="h-12 border-zinc-700w-full flex items-center justify-between p-2 border-b-2 border-zinc-700 text-zinc-100">
        <div className="flex flex-row items-center gap-2">
          <span className="text-lg">Thread</span>
          <span className="text-sm">#proj-datn</span>
        </div>
        <div className="p-2 rounded hover:bg-zinc-800 ease-linear duration-150 cursor-pointer">
          <FaXmark />
        </div>
      </div>
      {/* content */}
      <div className="w-full h-full flex">
        <div className="relative h-full w-full flex flex-col items-center overflow-auto">
          <div className="h-full p-2 flex flex-col items-start absolute w-full">
            {/* message wrapper */}
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* count replies */}
            <div className="w-full flex items-center">
              <span className="w-20 text-sm text-blue-600">9 replies</span>
              <div className="w-full col-span-2 h-[2px] bg-zinc-700">.</div>
            </div>
            {/* user replies */}
            <div className="flex flex-col w-full">
              {arrMessage[idMessageReplies - 1].comment.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 mb-2 w-full"
                >
                  <Image
                    className="rounded mt-1"
                    src={
                      arrUser.find((e) => e.id == item.userid)?.image as string
                    }
                    alt="logo"
                    width={40}
                    height={40}
                  />
                  <div className="font-medium text-white w-full">
                    <div className="relative inline-flex items-center">
                      <div className="relative inline-flex mr-1">
                        <span className="">
                          {
                            arrUser.find((e) => e.id == item.userid)
                              ?.name as string
                          }
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {item.times}
                      </span>
                    </div>
                    {/* message wrapper */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {/* message */}
                      <div
                        key={item.id}
                        onMouseEnter={() => {
                          HoverShowToolMessage(index, 'thread')
                          setShowToolMessage({
                            index: index as number,
                            options: 'thread',
                          })
                        }}
                        onMouseLeave={() => {
                          HoverShowToolMessage(-1, '')
                          setShowToolMessage({
                            index: -1,
                            options: '',
                          })
                        }}
                        className="relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200"
                      >
                        <div className="relative inline-flex items-center">
                          <span className="text-slate-400 pt-1 pb-1">
                            {item.comment}
                          </span>
                        </div>
                        {/* relation */}
                        <div className={HoverShowToolMessage(index, 'thread')}>
                          <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-b p-1 flex gap-1 justify-center items-center text-green-400">
                            <FaSquareCheck />
                          </div>
                          <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-b p-1 flex gap-1 justify-center items-center text-yellow-50">
                            <FaRegEye />
                          </div>
                          <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-b p-1 flex gap-1 justify-center items-center text-yellow-200">
                            {' '}
                            <FaHandsBubbles />
                          </div>
                          <div className="cursor-pointer hover:bg-zinc-800 active:bg-slate-400 rounded-b p-1 flex gap-1 justify-center items-center text-xs text-yellow-50">
                            <FaRegFaceSmile />
                            <span>React</span>
                          </div>
                          <div className="cursor-pointer hover:bg-zinc-800 rounded-b active:bg-slate-400 p-1 flex gap-1 justify-center items-center text-xs text-yellow-50">
                            <FaRegMessage />
                            <span>Reply</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* input */}
            <div className="relative w-full flex items-center text-zinc-400">
              <div className="w-full h-full flex flex-col items-start justify-around rounded-md ring-1 ring-zinc-600 bg-zinc-900">
                {/* top */}
                <div className="w-full flex flex-row items-center justify-start p-1 gap-3">
                  <div className="">
                    <FaB />
                  </div>
                  <div className="">
                    <FaItalic />
                  </div>
                  <div className="">
                    <AiOutlineUnderline />
                  </div>
                  <div className="">
                    <AiOutlineLink />
                  </div>
                  <div className="">
                    <AiOutlineOrderedList />
                  </div>
                  <div className="">
                    <AiOutlineBars />
                  </div>
                  <div className="">
                    <FaCode />
                  </div>
                  <div className="">
                    <AiOutlineCode />
                  </div>
                </div>
                {/* text are */}
                <div className="w-full flex items-center justify-between p-1">
                  <textarea
                    className="p-0 w-full bg-zinc-900 border-none placeholder:text-zinc-400 focus:ring-0"
                    rows={1}
                    placeholder="Message #proj-datn"
                  ></textarea>
                </div>
                {/* bottom */}
                <div className="w-full flex items-center justify-between p-1">
                  <div className="flex items-center gap-3">
                    <div className="">
                      <div className="rounded-full bg-zinc-700 p-[1px]">
                        <RiAddLine />
                      </div>
                    </div>
                    {!showEmoji && (
                      <div
                        className=""
                        onClick={() => setShowEmoji(!showEmoji)}
                      >
                        <FaRegFaceSmile />
                      </div>
                    )}
                    {showEmoji && (
                      <div
                        className=""
                        onClick={() => setShowEmoji(!showEmoji)}
                      >
                        <FaFaceSmileBeam className="text-yellow-300 rotate-45" />
                      </div>
                    )}
                    <div className="">
                      <FaAt />
                    </div>
                    <div className="border-r-2 h-4"></div>
                    <div onClick={() => setShowCamera(true)} className="">
                      <BiVideo />
                    </div>
                    <div className="">
                      <BiMicrophone />
                    </div>
                    <div
                      ref={emojiRef}
                      className="relative inline-flex items-center justify-center"
                    >
                      {showEmoji && (
                        <div className="absolute bottom-5 m-4 p-4">
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
                  {/* button send */}
                  <div className="flex items-center">
                    <div className={handleFocusInput('message').cls_hover}>
                      <FaPaperPlane className="" />
                    </div>
                    <div className="h-4 border-r-[1px] border-zinc-700 mr-1 ml-1"></div>
                    <div className={handleFocusInput('message').cls_hover}>
                      <FaAngleDown className="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-2">
              {/* image */}
              <Image
                className="rounded mt-1"
                src={
                  arrUser.find(
                    (e) => e.id == arrMessage[idMessageReplies - 1].userid
                  )?.image as string
                }
                alt="logo"
                width={40}
                height={40}
              />
              {/* message */}
              <div className="font-medium w-full">
                <div className="relative inline-flex items-center">
                  <div className="relative inline-flex text-zinc-200">
                    <span className="">Kuga</span>
                  </div>
                  <span className="text-xs text-zinc-400">12:00h</span>
                </div>
                {/* content */}
                <div className="w-full text-sm text-zinc-400 dark:text-gray-400">
                  {/* message */}
                  <div className="w-full relative flex justify-start items-center cursor-pointer hover:bg-zinc-800 ease-out duration-200">
                    <div className="relative inline-flex items-center">
                      <span className="text-zinc-400 pt-1 pb-1">hello ae</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Thread
