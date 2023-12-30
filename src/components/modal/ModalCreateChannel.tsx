import { useCreateChannelMutation } from '../../redux/api/channel'
import React, { useState } from 'react'
import Loading from '../Loading'
import { toast } from 'react-toastify'
import { IChannel, IUser } from '../../utils/types'
import { useStorage } from '../../utils/hooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { channelsState } from '../../utils/state'

interface Props {
  setOpenModalCreateChannel: (value: boolean) => void
}

const ModalCreateChannel = ({ setOpenModalCreateChannel }: Props) => {
  const [flagCreate, setFlagCreate] = useState(false)
  const [lengthChannel, setLengthChannel] = useState(80)
  const [nameChannel, setNameChannel] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const session = useStorage()

  //api
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [createChannel] = useCreateChannelMutation()
  const setChannel = useSetRecoilState(channelsState)
  const channels = useRecoilValue(channelsState)

  const handleSubmit = () => {
    setLoadingCreate(true)
    const user = JSON.parse(session.getItem('user', 'local')) as IUser
    const data: IChannel = {
      name: nameChannel,
      isPublic: isPublic,
      userCreated: user,
    }
    createChannel(data).then((res: any) => {
      if (res.data) {
        setLoadingCreate(false)
        setOpenModalCreateChannel(false)
        toast.success('Create channel success')
        setChannel([...channels, res.data.data])
      } else {
        setLoadingCreate(false)
        toast.error('Create channel fail')
      }
    })
  }

  return (
    <div className="fixed inset-0 mx-auto p-3 w-2/5 z-50">
      <div className="absolute bg-[#22252A] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-full shadow-xl p-6 border-0 text-white">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold">Create a channel</h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
            onClick={() => setOpenModalCreateChannel(false)}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="">
          {flagCreate ? (
            <>
              <span className="text-[#b9b9b9]"># {nameChannel}</span>
              <br />
              <br />
              <span>Visibility</span>

              <div className="flex items-center mb-4">
                <input
                  id="default-radio-1"
                  type="radio"
                  value=""
                  defaultChecked={true}
                  checked={isPublic}
                  onClick={() => setIsPublic(true)}
                  name="default-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                />
                <label
                  htmlFor="default-radio-1"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Public - anyone in {nameChannel}
                </label>
              </div>
              <div className="flex items-start">
                <input
                  id="default-radio-2"
                  type="radio"
                  value=""
                  name="default-radio"
                  onClick={() => setIsPublic(false)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                />
                <label
                  htmlFor="default-radio-2"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex flex-col -mt-1"
                >
                  <span>Private - Only specific people</span>
                  <span className="text-[#b9b9b9] text-sm">
                    Can only be viewed or joined by invitation
                  </span>
                </label>
              </div>
              <br />
              <div className="flex justify-between">
                <span className="text-[#b9b9b9]">Step 2 of 2</span>
                <div className="space-x-2 text-white flex">
                  <button
                    className={`${
                      loadingCreate && ' opacity-10 '
                    }  " border border-[#91939e]  p-2 px-5 rounded font-semibold "`}
                    onClick={() => setFlagCreate(false)}
                    disabled={loadingCreate}
                  >
                    Back
                  </button>
                  <button
                    className=" bg-[#017A5B] p-2 px-5 rounded font-semibold flex justify-center items-center"
                    onClick={handleSubmit}
                    disabled={loadingCreate}
                  >
                    {loadingCreate ? <Loading /> : 'Create'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-5">
              <div>
                <label
                  htmlFor="base-input"
                  className="block mb-3 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <div className="relative">
                  <span className="absolute left-4 text-[#b9b9b9] top-1/2 -translate-y-1/2">
                    #
                  </span>
                  <input
                    type="text"
                    id="base-input"
                    className=" border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-[#22252A] pl-8"
                    placeholder="e.g. plan-budget"
                    value={nameChannel}
                    maxLength={80}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault()
                        setNameChannel(
                          (prevNameChannel) => prevNameChannel + '-'
                        )
                      }
                    }}
                    onChange={(e) => {
                      setLengthChannel(80 - e.target.value.length)
                      setNameChannel(e.target.value)
                    }}
                  />
                  <span className="absolute right-4 text-[#b9b9b9] top-1/2 -translate-y-1/2">
                    {lengthChannel}
                  </span>
                </div>
              </div>
              <span className="text-[#b9b9b9] text-sm">
                Channels are where conversations happen around a topic. Use a
                name that is easy to find and understand.
              </span>
              <br />
              <br />
              <div className="flex justify-between">
                <span></span>
                <div>
                  {/* <span></span> loading check exist channel */}
                  <button
                    className={` ${
                      nameChannel.length > 0
                        ? ' bg-green-500 text-white '
                        : ' bg-[#36373B] text-[#b9b9b9] '
                    } "  p-2 px-5 rounded font-semibold " `}
                    onClick={() => setFlagCreate(true)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalCreateChannel
