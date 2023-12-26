'use client'
import { Dropdown } from 'flowbite-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import {
  FaAngleDown,
  FaAngleRight,
  FaAt,
  FaCaretDown,
  FaCaretRight,
  FaChevronDown,
  FaCircle,
  FaEllipsisVertical,
  FaHeadphones,
  FaPaperPlane,
  FaPenToSquare,
  FaRegFile,
  FaRegMessage,
} from 'react-icons/fa6'

import { AppDispatch } from '@/redux/store'
import { useDispatch } from 'react-redux'

import { useGetAllChannelsQuery } from '@/redux/api/channel'
import { AiOutlineLock } from 'react-icons/ai'

import { useStorage } from '@/utils/hooks'
import { IChannel } from '@/utils/types'
import Modal from './modal/ModalCreateChannel'

let arrItemSidebar = [
  {
    id: 1,
    icon: <FaRegMessage />,
    title: 'Threads',
  },
  {
    id: 2,
    icon: <FaAt />,
    title: 'Mentions & reactions',
  },
  {
    id: 3,
    icon: <FaPaperPlane />,
    title: 'Dafts & sent',
  },
  {
    id: 4,
    icon: <FaRegFile />,
    title: 'Files',
  },
  {
    id: 5,
    icon: <FaEllipsisVertical />,
    title: 'More',
  },
]

interface IProps {
  setChannel: (channel: IChannel) => void
}

const Slidebar = ({ setChannel }: IProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const [showMenuChannel, setShowMenuChannel] = useState(false)
  const [showDirectMessage, setShowDirectMessage] = useState(false)
  const [showAbsoluteWorkSpace, setShowAbsoluteWorkSpace] = useState(false)
  const [showMenuWorkspace, setShowMenuWorkspace] = useState(false)
  let workspaceRef = useRef<any>()

  const session = useStorage()
  //toggle menu channel
  useEffect(() => {
    const showMenuChannel = session.getItem('showMenuChannel', 'local')
    if (showMenuChannel) {
      setShowMenuChannel(JSON.parse(showMenuChannel))
    }
  }, [])
  const handleToggleMenuChannel = () => {
    setShowMenuChannel(!showMenuChannel)
    session.setItem(
      'showMenuChannel',
      JSON.stringify(!showMenuChannel),
      'local'
    )
  }

  //toggle menu direct
  useEffect(() => {
    const showDirectMessage = session.getItem('showDirectMessage', 'local')
    if (showDirectMessage) {
      setShowDirectMessage(JSON.parse(showDirectMessage))
    }
  }, [])
  const handleToggleMenuDirect = () => {
    setShowDirectMessage(!showDirectMessage)
    session.setItem(
      'showDirectMessage',
      JSON.stringify(!showDirectMessage),
      'local'
    )
  }

  useEffect(() => {
    let handle = (e: any) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target)) {
        setShowMenuWorkspace(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => {
      document.removeEventListener('mousedown', handle)
    }
  })
  const { data, isFetching, isSuccess } = useGetAllChannelsQuery()
  const [channels, setChannels] = useState<IChannel[]>([])
  useEffect(() => {
    if (isSuccess && data) {
      setChannels(data)
    }
  }, [isSuccess, data])

  const [openModalCreateChannel, setOpenModalCreateChannel] = useState(false)
  return (
    <div className="h-full w-[15rem] relative flex flex-col border-r-2 border-zinc-700 text-zinc-400 font-normal">
      <div className="h-12 border-b-2 border-zinc-700">
        <div className="flex items-center justify-between p-2">
          <div
            ref={workspaceRef}
            onClick={() => setShowMenuWorkspace(!showMenuWorkspace)}
            className="cursor-pointer flex items-center justify-center gap-1 p-1 rounded-md hover:bg-zinc-800"
          >
            <h1>datn</h1>
            <FaAngleDown />
          </div>
          <div className="bg-white p-2 rounded-full">
            <FaPenToSquare className="text-black" />
          </div>
          {/* absolute workspace */}
          {showMenuWorkspace && (
            <div className="z-50 w-60 absolute flex flex-col items-start top-9 -right-4 rounded-md ring-1 ring-zinc-600 bg-zinc-800 shadow-md text-slate-300">
              <div className="grid grid-cols-3 grid-rows-1 items-center p-2 ">
                <Image
                  className="rounded"
                  src="https://a.slack-edge.com/80588/marketing/img/media-kit/img-logos.png"
                  width={45}
                  height={40}
                  alt="add"
                />
                <div className="col-span-2 flex flex-col">
                  <h1>datn</h1>
                  <span>datn-co.slack.com</span>
                </div>
              </div>
              <div className="flex w-full  border-t-2 border-zinc-600">
                <ul className="w-full ">
                  <li className="w-full p-2 hover:bg-sky-600 hover:text-white cursor-pointer">
                    <span>Invite people to datn</span>
                  </li>
                  <li className="w-full p-2 hover:bg-sky-600 hover:text-white cursor-pointer">
                    <span>Create a channel</span>
                  </li>
                </ul>
              </div>
              <div className="flex w-full border-t-2 border-zinc-600">
                <ul className="w-full">
                  <li className="w-full p-2 hover:bg-sky-600 hover:text-white cursor-pointer">
                    <span>Sign out of datn</span>
                  </li>
                </ul>
              </div>
              <div
                onMouseLeave={() => setShowAbsoluteWorkSpace(false)}
                onMouseOver={() => setShowAbsoluteWorkSpace(true)}
                className="flex w-full border-t-2 border-zinc-600"
              >
                <div className="w-full p-2 flex items-center justify-between hover:bg-sky-600 hover:text-white cursor-pointer">
                  <span>Add workspaces</span>
                  <FaAngleRight />
                </div>
                {/* absolute */}
                {showAbsoluteWorkSpace && (
                  <div className="absolute -right-[13.5rem] ring-1 ring-zinc-600 cursor-pointer rounded-md flex items-center shadow-md bg-zinc-800">
                    <ul className="flex flex-col gap-2 mt-2">
                      <li className="w-full p-1 hover:bg-sky-600 hover:text-white cursor-pointer">
                        Sign in to another workspace
                      </li>
                      <li className="w-full p-1 hover:bg-sky-600 hover:text-white cursor-pointer">
                        Create a new workspace
                      </li>
                      <li className="w-full p-1 hover:bg-sky-600 hover:text-white cursor-pointer">
                        Find workspaces
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-50 border-b-2 border-zinc-700">
        <ul className="cursor-pointer text-zinc-400 font-normal list-inside dark:text-gray-400">
          {arrItemSidebar.map((item, index) => (
            <li
              key={item.id}
              className="relative flex items-center gap-2 hover:bg-zinc-800 ease-out duration-100 rounded-lg p-1 m-2"
            >
              {item.icon}
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="h-96 relative">
        <ul className="h-full overflow-auto text-zinc-400 font-normal list-inside dark:text-gray-400">
          <li className="flex items-center gap-1 rounded-lg p-1">
            <div className="p-1 hover:bg-zinc-800 ease-out duration-300 rounded">
              <span
                className="cursor-pointer"
                onClick={handleToggleMenuChannel}
              >
                {showMenuChannel ? <FaCaretDown /> : <FaCaretRight />}
              </span>
            </div>
            <div className="font-normal flex items-center gap-1 cursor-pointer hover:bg-zinc-800 ease-out duration-100 rounded">
              <Dropdown
                inline
                label="Channels"
                className="bg-[#22252A] rounded-lg w-64 border-black font-medium text-white overflow-hidden p-0"
              >
                <Dropdown.Item
                  className="border-b border-white py-2 px-6 hover:bg-blue-300 hover:text-black"
                  onClick={() => setOpenModalCreateChannel(true)}
                >
                  Create
                </Dropdown.Item>

                <Dropdown.Item className="hover:bg-blue-300 py-2 px-6 hover:text-black">
                  Manage
                </Dropdown.Item>
              </Dropdown>
            </div>
          </li>
          {showMenuChannel && (
            <ul className="flex flex-col gap-2">
              {channels.map((item: IChannel, index: number) => (
                <li
                  key={index}
                  className="cursor-pointer  gap-2 flex items-center hover:bg-zinc-800 ease-out duration-100 rounded-lg p-1 mr-2 ml-2"
                  onClick={() => {
                    setChannel(item)
                  }}
                >
                  <span className="font-bold text-xl italic ml-1">
                    {item.isPublic ? (
                      <span># {'     '}</span>
                    ) : (
                      <AiOutlineLock />
                    )}
                  </span>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
          <li className="flex items-center gap-1 rounded-lg p-1">
            <div className="p-1 hover:bg-zinc-800 ease-out duration-300 rounded">
              <span className="cursor-pointer" onClick={handleToggleMenuDirect}>
                {showDirectMessage ? <FaCaretDown /> : <FaCaretRight />}
              </span>
            </div>
            {/* Direct messages */}
            <div className="font-normal flex items-center gap-14 cursor-pointer">
              <div className="">
                <Dropdown inline label="Direct messages">
                  <Dropdown.Item>Create</Dropdown.Item>
                  <Dropdown.Item>Manage</Dropdown.Item>
                </Dropdown>
              </div>
            </div>
          </li>
          {/* {showDirectMessage && (
            <ul className="">
              {arrUser.map((item: IUser, index: number) => (
                <li
                  key={index}
                  className="cursor-pointer flex items-center gap-2 hover:bg-zinc-800 ease-out duration-100 rounded-lg m-2 p-1"
                >
                  <Image
                    className="rounded bg-white"
                    src={item.avatar}
                    alt="logo"
                    width={20}
                    height={20}
                  />
                  {item.id === idUserLogin ? (
                    <span>
                      {item.name}{' '}
                      <span className="font-semibold text-zinc-500">you</span>
                    </span>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </li>
              ))}
              <li className="flex items-center gap-2 hover:bg-zinc-800 ease-out duration-100 rounded-lg m-2 p-1">
                <FaRegSquarePlus />
                Add coworkers
              </li>
            </ul>
          )} */}
        </ul>
      </div>
      <div className="absolute bottom-0 w-full border-t-2 border-zinc-700 pb-2 flex items-center justify-between rounded-t-xl p-2 bg-black">
        <div className="flex items-center justify-center text-white font-normal gap-1">
          <span>datn</span>
          <FaChevronDown />
        </div>
        <div className="flex items-center gap-2 text-slate-700 rounded-xl border-2 p-1 cursor-pointer">
          <FaCircle />
          <FaHeadphones />
        </div>
      </div>
      {openModalCreateChannel && (
        <Modal
          setOpenModalCreateChannel={setOpenModalCreateChannel}
          channels={channels}
          setChannels={setChannels}
        />
      )}
    </div>
  )
}

export default Slidebar
