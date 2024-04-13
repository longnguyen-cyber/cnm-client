
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import { FormInstance, Select, message, notification } from 'antd'
import { Space, Spin } from 'antd';

import axios from 'axios'
import { Button, Form, Input, Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineClose } from "react-icons/ai";

import { useDispatch, useSelector } from 'react-redux';

import { UserContext } from '../../../../../../Context/UserContext';
import { unwrapResult } from '@reduxjs/toolkit';
import { UserGetAllChannel } from '../../../../../../feature/chat/pathApi';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../../../../../Type';
import { userSeach } from '../../../../../../feature/user/pathApi';
import UserListItem from '../../../araCenter/FormGroupChat/UserListItem';
import UserListItemAddToGroup from './UserListItemAddToGroup';
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const AddUserToGroup:FunctionComponent<any>=({selectedChat,openModalAddUserToGroup,setModalAddUserToGroup,loading, setLoading})=> {
  
  const [form] = Form.useForm()
  const dispatch = useDispatch();
  const formRef = useRef<any>();

  const [search, setSearch] = useState("")
  const ListUsersSeach = useSelector((state: any) => state.Users.UserSlice);
  const [selectedUsers, setselectedUsers] = useState<IUser[]>([]);
  const contextUser = useContext(UserContext)
  const { state } = contextUser;
  const [user, setUser] = state.user;
  const {socket}=state
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
  };

  const bagTag = [
    'bg-blue-400',
    'bg-red-400',
    'bg-gray-500',
    'bg-orange-400',
    'bg-yellow-500',
    'bg-amber-500',
    'bg-green-500',
    'bg-teal-600',
    'bg-lime-700',
    'bg-indigo-400',
    'bg-purple-400',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-rose-400',
    'bg-fuchsia-500',
    'bg-violet-600',
  ];


  useEffect(() => {
    if (search) {
       dispatch<any>(userSeach({ name: search }));
    }
  }, [search])


  const AddToGroup=(value:any)=>{
    setLoading(true)
    const channel = {
      users: selectedUsers.map((item: any) => ({
        id: item.user.id,
        role: 'MEMBER'
    })),
    channelId: selectedChat.id,

    };
   
   
    socket.emit('addUserToChannel',channel)
    return () => {socket.off('addUserToChannel');}
  }
  const handleRemoveUser = (userRemove: IUser) => {
    const userRemoveSelect = [...selectedUsers];
    const index = userRemoveSelect.findIndex((va:any) => va.id === userRemove.id);
    if (index !== -1) {
      userRemoveSelect.splice(index, 1);
      setselectedUsers(userRemoveSelect);
    }
  };
  const handleClickFunction = (users: any) => {
    
    if (selectedUsers) {
      const check = selectedUsers.every((usercheck:any) => usercheck.user.id != users.user.id)
      if (check) {
        setselectedUsers([...selectedUsers, users])
      
      }
      else
        notification['error']({
          message: 'User exist  ',
          description: 'chọn bạn bè khác ',
        })
    }
  }
  
    return (
    
    <Modal
    open={openModalAddUserToGroup}
    footer={null}
    onCancel={() => setModalAddUserToGroup(false)}
    title="Thêm thành viên vào nhóm"
    >

<Form
        ref={formRef || null}
        form={form}
        onFinish={AddToGroup}
      >
      




        <Form.Item
          name="SearchUser"
          label="Thêm thành viên  : "
          hasFeedback
          {...formItemLayout}
          rules={[]}
        >
          <Input
            placeholder='Search User'
            className='border border-gray-400'
            onChange={(value) => { setSearch(value.target.value) }}
          />
        </Form.Item>
        <div className='mb-3 flex flex-wrap gap-3 items-center'>
            {selectedUsers?.map((value: any, index) => (
              <div key={index} className={`flex items-center justify-between gap-2 p-2 rounded-xl text-white bg-gradient-to-r ${bagTag[Math.floor(Math.random() * bagTag.length)]}`}>
                {/* Hình ảnh người dùng */}
                <img src={value.user.avatar} alt="User" className="w-6 h-6 rounded-full object-cover" />
                
                {/* Tên người dùng */}
                <p className='text-sm md:text-md flex-grow'>{value.user.name}</p>
                
                {/* Nút xóa */}
                <span onClick={() => handleRemoveUser(value)} className="ml-2 cursor-pointer rounded-full bg-white bg-opacity-20 p-1 hover:bg-opacity-40">
                  <AiOutlineClose color="white" />
                </span>
              </div>
            ))}
          </div>

          {
            search && search.length > 0 ? ListUsersSeach&& ListUsersSeach.length > 0 ? ListUsersSeach.slice(0, 5).map((value: IUser, index: number) => (<div className='flex flex-col gap-5' key={index}>
              {ListUsersSeach&&ListUsersSeach.length>0&&<UserListItemAddToGroup value={value} index={index} handleClickFunction={() => handleClickFunction(value)} selectedUsers={selectedUsers} selectedChat={selectedChat}/>}
            </div>)) : "Không có kết quả tìm kiếm" : ""
          }
        <Form.Item>
          <Button type="primary" className='w-full bg-blue-500 h-10 ' htmlType='submit'>
            {loading && <Spin indicator={antIcon} className='text-white mr-3' />}  Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
