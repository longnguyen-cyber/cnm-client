import { useState } from 'react'
import { IChannel, IUser } from '../../utils/types'
import Loading from '../Loading'

import { MdDone } from 'react-icons/md'

import { toast } from 'react-custom-alert'
import { AiOutlineLock } from 'react-icons/ai'
import { useRecoilValue } from 'recoil'
import { useAddUserToChannelMutation } from '../../redux/api/channel'
import { directState, userLogin } from '../../utils/state'

interface Props {
  channel: IChannel
  setChannel: (value: IChannel) => void
  setOpenModalAddUserToChannel: (value: boolean) => void
  setOpenModalCreateChannel: (value: boolean) => void
}

const ModalAddUserToChannel = ({
  channel,
  setChannel,
  setOpenModalAddUserToChannel,
  setOpenModalCreateChannel,
}: Props) => {
  const [filterUsers, setFilterUsers] = useState<IUser[]>([])
  const [userAdded, setUserAdded] = useState<IUser[]>([])
  const [userName, setUserName] = useState('')

  //flag
  const [flagCreate, setFlagCreate] = useState(false)
  const [existing, setExisting] = useState(true)
  const users = useRecoilValue(directState)
  const user = useRecoilValue(userLogin)

  //api
  const [loadingCreate, setLoadingCreate] = useState(false)
  const handleSubmit = () => {
    setLoadingCreate(true)
    // const data: IChannel = {
    //   name: nameChannel,
    //   isPublic: isPublic,
    //   userCreated: user!
    // }
    // createChannel(data).then((res: any) => {
    //   if (res.data) {
    //     setLoadingCreate(false)
    //     setOpenModalCreateChannel(false)
    //     toast.success('Create channel success')
    //     setChannels([...channels, data])
    //   } else {
    //     setLoadingCreate(false)
    //     toast.error('Create channel fail')
    //   }
    // })
  }

  const [addUserToChannel] = useAddUserToChannelMutation()
  const [loadingAddUser, setLoadingAddUser] = useState(false)
  const handleAddUserToChannel = () => {
    setLoadingAddUser(true)
    if (userAdded.length > 0) {
      setLoadingAddUser(true)
      const data = {
        id: channel.id!,
        users: userAdded.map((u) => u.id),
      }
      addUserToChannel(data).then((res: any) => {
        if (res.data) {
          setLoadingAddUser(false)
          setOpenModalAddUserToChannel(false)
          toast.success('Add user to channel success')
          //!cant change quantity users display in header item when added user to channel
          setChannel(res.data)
        } else {
          setLoadingAddUser(false)
          // toast.error('Add user to channel fail')
        }
      })
    }
  }

  // if (!user) return null
  return (
    <div className="fixed inset-0 mx-auto p-2 w-1/3 z-50">
      <div className="absolute bg-[#22252A] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-full shadow-xl p-6 border-0 text-white">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold leading-4">
            {flagCreate ? (
              <span>
                <span className="block">Add people to</span>
                <span className="text-sm text-[#ccc] flex items-center ">
                  {channel?.isPublic ? (
                    <># {channel?.name}</>
                  ) : (
                    <>
                      <AiOutlineLock /> {channel?.name}
                    </>
                  )}
                </span>
              </span>
            ) : (
              'Anyone you add will be able to see all of the channel’s contents'
            )}
          </h3>

          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
            onClick={() => setOpenModalAddUserToChannel(false)}
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
        {!flagCreate && (
          <span>
            New members will be able to see all of proj-bloody’s history,
            including any files that have been shared in the channel
          </span>
        )}
        <div className="">
          {flagCreate ? (
            <div className="mt-5 relative">
              <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-wrap gap-1 gap-x-4 p-1">
                {userAdded.map((u: IUser) => (
                  <div
                    className="bg-[#192A32] flex h-10 items-center rounded-md"
                    key={u.id}
                  >
                    <img
                      src={u.avatar}
                      width={400}
                      height={400}
                      alt=""
                      className="w-6 h-6 rounded-lg object-cover mr-2"
                    />
                    <strong>{u.name}</strong>
                    <strong
                      className="mx-2 text-gray-400 hover:cursor-pointer"
                      onClick={() => {
                        setUserAdded(userAdded.filter((f) => f.id !== u.id))
                      }}
                    >
                      X
                    </strong>
                  </div>
                ))}
                <input
                  type="text"
                  id="base-input"
                  className=" border-none text-white text-sm  focus:ring-blue-500 focus:border-blue-500 block flex-1 h-10 bg-[#22252A] outline-none"
                  placeholder="Enter a name or email"
                  value={userName}
                  autoFocus={true}
                  autoComplete="off"
                  onBlur={() => {
                    if (userName === '') {
                      setFilterUsers([])
                    }
                  }}
                  onChange={(e) => {
                    setUserName(e.target.value)
                    if (e.target.value.length === 0) setFilterUsers([])
                    const findUser = users
                      ?.filter((user) => {
                        return (
                          user.name
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                          user.email
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase())
                        )
                      })
                      .filter((u) => u.id !== user?.id)
                      .filter(
                        (u) => !channel.users!.find((f) => f.id === u.id)
                      ) as IUser[]

                    setFilterUsers(findUser)
                  }}
                />
              </div>
              <br />
              <div className="flex justify-between">
                <span></span>
                <div>
                  {/* <span></span> loading check exist channel */}
                  <button
                    className={` ${
                      userAdded.length > 0
                        ? ' bg-green-500 text-white '
                        : ' bg-[#36373B] text-[#b9b9b9] '
                    } "  p-2 px-5 rounded font-semibold " `}
                    disabled={userAdded.length < 0}
                    onClick={handleAddUserToChannel}
                  >
                    {loadingAddUser ? <Loading /> : 'Add'}
                  </button>
                </div>
              </div>
              {filterUsers.length > 0 && (
                <div className="absolute z-20 bg-[#22252A] rounded w-full mx-auto  h-fit top-1/2 shadow-xl border border-[#99999977]">
                  {
                    <ul className="w-full h-fit overflow-auto">
                      {filterUsers.map((user) => (
                        <li
                          key={user.id}
                          className={` ${
                            userAdded.find((f) => f.id === user.id) &&
                            ' text-blue-500 '
                          } " flex items-center justify-between p-2 hover:bg-[#36373B] cursor-pointer "`}
                          onClick={() => {
                            if (userAdded.find((f) => f.id === user.id)) {
                              setFilterUsers([])
                              return
                            }
                            setUserAdded([...userAdded, user])
                            setUserName('')
                            setFilterUsers([])
                          }}
                        >
                          <div className="flex items-center w-full">
                            <img
                              className="w-6 h-6 rounded-full"
                              src={user.avatar}
                              alt=""
                            />
                            <div className="flex items-center space-x-2">
                              <span
                                className={`${
                                  user?.isOnline
                                    ? 'bg-green-500'
                                    : 'bg-slate-400'
                                } h-2 w-2 rounded-full`}
                              ></span>
                              <span className="ml-2">{user.name}</span>
                            </div>

                            <span className="float-right">
                              {userAdded.find((f) => f.id === user.id) && (
                                <MdDone />
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  }
                </div>
              )}
            </div>
          ) : (
            <>
              <br />
              {user && user.id === channel.userCreated.id && (
                <>
                  <div className="flex items-start">
                    <input
                      id="default-radio-1"
                      type="radio"
                      value=""
                      name="default-radio"
                      defaultChecked={true}
                      checked={existing}
                      // onClick={() => setExisting(true)}
                      onChange={() => {
                        setExisting(true)
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                    />
                    <label
                      htmlFor="default-radio-1"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex flex-col -mt-1"
                    >
                      <span>
                        Add to <strong>{channel?.name!}</strong>
                      </span>
                      <span className="text-[#b9b9b9] text-sm">
                        Add new members to the existing channel
                      </span>
                    </label>
                  </div>
                  <br />
                  <div className="flex items-start mb-4">
                    <input
                      id="default-radio-2"
                      type="radio"
                      value=""
                      name="default-radio"
                      onChange={() => {
                        setExisting(false)
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 "
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex flex-col -mt-1"
                    >
                      <span>Create a new channel</span>
                      <span className="text-[#b9b9b9] text-sm">
                        Workchat will archive the existing channel and
                        automatically invite all of its members to a new
                        channel.
                      </span>
                    </label>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-[#b9b9b9]"></span>
                <div className="space-x-2 text-white flex">
                  <button
                    className=" border border-[#91939e]  p-2 px-5 rounded font-semibold "
                    onClick={() => setOpenModalAddUserToChannel(false)}
                  >
                    Cannel
                  </button>
                  <button
                    className=" bg-[#017A5B] p-2 px-5 rounded font-semibold flex justify-center items-center"
                    onClick={() => {
                      if (existing) setFlagCreate(true)
                      else {
                        setOpenModalCreateChannel(true)
                        setOpenModalAddUserToChannel(false)
                      }
                    }}
                  >
                    {user && user.id === channel.userCreated.id
                      ? 'Continue'
                      : 'Add to channel'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalAddUserToChannel
