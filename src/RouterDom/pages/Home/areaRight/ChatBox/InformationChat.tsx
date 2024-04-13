import React, { FunctionComponent, useEffect, useState } from 'react'
import { IUser } from '../../../../../Type'
import { CiWarning } from 'react-icons/ci'
import { MdDelete, MdFileDownload } from 'react-icons/md'
import { IoIosLogOut } from 'react-icons/io'
import { RiUserAddFill } from 'react-icons/ri'
import { UserGetChatsSingleById } from '../../../../../feature/chat/pathApi'
import { useDispatch } from 'react-redux'
import { FaFilePdf } from 'react-icons/fa'
import { CiEdit } from "react-icons/ci";
import { LoadingOutlined } from "@ant-design/icons";
import './GroupChat.css'
import { AddUserToGroup } from './AddUserToGroup/AddUserToGroup'
import { Button, Form, Input, Modal, Spin, notification } from 'antd'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const InformationChat: FunctionComponent<any> = ({
  selectedChat,
  user,
  socket
}) => {
  const dispatch = useDispatch()
  const [openModalAddUserToGroup, setModalAddUserToGroup] = useState(false)
  const [loading, setLoading] = useState(false);
  const [editNameGroup, setEditNameGroup] = useState(false)
  const [loadingUpdate, setLoadingUpdate] = useState(false)

  

  console.log(selectedChat)
  const HandleOpenModall = () => {
    setModalAddUserToGroup(true)

  }

  useEffect(() => {
    const handleData = async (data: any) => {
      if (data && data.message === 'Add user to channel success') {
        setModalAddUserToGroup(false)
        setLoading(false)
      }
      else if (data && data.message === 'Update channel success') {
        setLoadingUpdate(false)
        setEditNameGroup(false)
        return () => { socket.off('channelWS') }
      }


    };
    socket.on('channelWS', handleData);



    return () => {
      socket.off('channelWS', handleData);
    };
  }, [socket])





  const HandleUpdate = (value: any) => {
    const channelUpdate = {
      channelUpdate: value,
      channelId: selectedChat.id


    }
    socket.emit('updateChannel', channelUpdate)
    setLoadingUpdate(true)
    return () => { socket.off('updateChannel'); }

  }

  const addFriendInGroupChat = (user: any) => {
    
    if (socket) {
      const sendReqAddFriend = {
        receiveId: user.id
        ,
      }
      console.log(sendReqAddFriend)
      socket.emit('reqAddFriend', sendReqAddFriend)
    }

    notification['success']({
      message: 'Thông báo',
      description: 'Đã gửi lời mời kết bạn'
    })
    return () => { socket.off('reqAddFriend') }
  }



  const deleteUserInGroupChat=(value:any)=>{
    // {
    //   "users":["65bceb94ceda5567efc0b629"],
    //   "channelId":"661608657dbc20ca88ed9713"
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này khỏi nhóm chat?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy bỏ',
      onOk() {
        onDeleteConfirmed(value.id, selectedChat.id);
      }
    });
    // }
    const data={
      users:[value.id],
      channelId:selectedChat.id
    }


  }
  const onDeleteConfirmed = (userId: string, channelId: string) => {
    const data = {
      users: [userId],
      channelId: channelId
    }
    socket.emit('deleteUserInChannel', data)

    return () => { socket.off('deleteUserInChannel') }
  }


  return (
    <div className="col-md-2 h-full overflow-y-auto relative">
      {openModalAddUserToGroup && <AddUserToGroup selectedChat={selectedChat} openModalAddUserToGroup={openModalAddUserToGroup} setModalAddUserToGroup={setModalAddUserToGroup} loading={loading} setLoading={setLoading} />}
      <div className="flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200">
        <p className="font-medium text-xl">Thông tin nhóm </p>
      </div>
      <div className="border border-gray-200 h-44 w-auto ">
        <div className="flex justify-center items-center ">
          {typeof selectedChat === 'object' && selectedChat !== null ? (
            selectedChat.receiveId ? (
              <div className="flex gap-3 items-center px-5">
                <img
                  src={`${selectedChat.user ? selectedChat.user.avatar : ''}`}
                  className="w-16 h-16 mt-8 rounded-full"
                />
                <div></div>
              </div>
            ) : !selectedChat.receiveId && !selectedChat.users ? (
              <div>
                <div className="flex gap-3 items-center px-5">
                  <img
                    src={`${selectedChat ? selectedChat.avatar : ''}`}
                    className="w-16 h-16 mt-8 rounded-full"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap w-24  justify-center mt-8  items-center">
                  {selectedChat.users.length > 0 &&
                    selectedChat.users
                      .slice(0, 3)
                      .map((value: IUser, index: number) => (
                        <img
                          className="w-10 h-10 rounded-full "
                          src={`${value.avatar}`}
                          alt="Avatar 1"
                        />
                      ))}
                  <p className="rounded-full text-gray-500  flex items-center justify-center  bg-gray-300 w-10 h-10">
                    {selectedChat.users.length > 3 - 3}
                  </p>
                </div>
              </>
            )
          ) : (
            ''
          )}
        </div>
        <div>
          {selectedChat.receiveId ? (
            <>
              <p
                style={{ fontSize: '25px', fontWeight: '500px' }}
                className="text-center mt-2 font-semibold"
              >
                {selectedChat.user.name}
              </p>

              <p> Tat ca File đã gửi </p>

              <div className="absolute bottom-1 p-2">
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <CiWarning />
                  Xóa lịch sử nhóm chat{' '}
                </p>
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <MdDelete /> Xóa nhóm
                </p>
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <IoIosLogOut /> Rời nhóm chat
                </p>
              </div>
            </>





            /// rời nhóm chat xóa nhóm chát xóa lịch sử nhóm chat

          ) : !selectedChat.receiveId && !selectedChat.users ? (
            <>
              <p
                style={{ fontSize: '25px', fontWeight: '500px' }}
                className="text-center mt-2 font-semibold"
              >
                {selectedChat.name}
              </p>
              <div className="absolute bottom-1 p-2">
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <CiWarning />
                  Xóa lịch sử nhóm chat{' '}
                </p>
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <MdDelete /> Xóa nhóm
                </p>
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <IoIosLogOut /> Rời nhóm chat
                </p>
              </div>
            </>
            /// thêm thanh viên vào
          ) : (
            <div>
              <p
                style={{ fontSize: '25px', fontWeight: '500px' }}
                className="text-center mt-2  mb-4 font-semibold"
              >
                {selectedChat.name}
              </p>
              <div className=" flex justify-center flex-col items-center h-16 w-auto border border-gray-200 border-l border-gray-200">
                <p className="font-medium flex gap-2 items-center cursor-pointer text-xl">Thành viên {!editNameGroup && <CiEdit size={20} className='cursor-pointer' onClick={() => { setEditNameGroup(true) }} />} </p>

                {editNameGroup && <Form
                  onFinish={HandleUpdate}
                  className='flex items-center gap-2'
                >
                  <Form.Item

                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      className=" bg-blue-500 h-10 w-18"
                      htmlType="submit"
                    >
                      {loadingUpdate && (
                        <Spin indicator={antIcon} className="text-white mr-2" />
                      )}{" "}
                      update
                    </Button>
                    <Button
                      type="primary"
                      className=" bg-red-500 h-10 w-18"
                      onClick={() => { setEditNameGroup(false) }}

                    >

                      Close
                    </Button>


                  </Form.Item>



                </Form>}
              </div>
              <div className="flex justify-center items-center">
                <button className="btn btn-blue bg-gray-200 p-2 flex items-center gap-2 rounded-sm mt-3" onClick={() => { setModalAddUserToGroup(true) }} >
                  {' '}
                  <RiUserAddFill color="gray" /> Thêm thành viên vào nhóm{' '}
                </button>
              </div>
              <h1 className="font-medium mt-3 mb-3 pl-3">
                Danh sách thành viên ({selectedChat.users.length}){' '}
              </h1>
              <div className="p-2">
                <input
                  className="w-full no-outline border border-gray-300 my-3 rounded-md p-1 mr-7"
                  placeholder="tìm kiếm thành viên "
                />
              </div>

              {/* danh sách nhóm  */}
              <div className="h-72 overflow-y-scroll">
                {selectedChat.users.length > 0 &&
                  selectedChat.users.map((value: any, index: number) => {
                    return (
                      <div key={index} className="flex items-center p-1">
                        {value && (
                          <div className="flex justify-between w-full ">
                            <div className="flex gap-3 items-center px-5">
                              <img
                                src={`${value.avatar}`}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <p className="text-xl font-medium ">
                                  {value.name}

                                </p>
                                <p>{value.role === 'ADMIN' && <div>admin</div>}</p>
                              </div>
                            </div>

                            {value.role === 'ADMIN' && user.id === value.id ? <>
                            </> :
                              <div className='flex items-center gap-2'>

                                <button onClick={() => deleteUserInGroupChat(value)} className="btn bg-red-500 px-2 rounded-md cursor-pointer text-white font-bold">
                                  {' '}
                                  Xóa {' '}
                                </button>
                                <button onClick={() => addFriendInGroupChat(value)} className="btn bg-blue-100 px-2 rounded-md cursor-pointer text-blue-600 font-bold">
                                  {' '}
                                  Thêm {' '}
                                </button>


                              </div>

                            }

                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
              <div className="p-2">
                <div className=" flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200">
                  <p className="font-medium text-xl">Tùy chọn </p>
                </div>

                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <CiWarning />
                  Xóa lịch sử nhóm chat{' '}
                </p>
                <p className="text-red-600 flex mt-2 mb-2 gap-2 items-center text-lg cursor-pointer mt-2">
                  <MdDelete /> Xóa nhóm
                </p>
                <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                  <IoIosLogOut /> Rời nhóm chat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
