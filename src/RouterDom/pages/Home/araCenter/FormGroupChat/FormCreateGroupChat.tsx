
import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'

import { FormInstance, Select, message, notification } from 'antd'
import { Space, Spin } from 'antd';
import { UserCreateChannel, userSeach } from '../../../../../feature/user/pathApi';
import axios from 'axios'
import { Button, Form, Input, Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineClose } from "react-icons/ai";
import UserListItem from './UserListItem';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from '../../../../../Type';
import { UserContext } from '../../../../../Context/UserContext';
import { unwrapResult } from '@reduxjs/toolkit';
import { UserGetAllChannel } from '../../../../../feature/chat/pathApi';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const FormCreateGroupChat: FunctionComponent<any> = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch();
  const formRef = useRef<any>();
  const Loading = useSelector((state: any) => state.Users.loading)
  const ListUsersSeach = useSelector((state: any) => state.Users.UserSlice);
  const [selectedUsers, setselectedUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("")
  const contextUser = useContext(UserContext)
  const { state } = contextUser;
  const [user, setUser] = state.user;
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()
  const [submitSuccess, setSubmitSuccess] = useState(false);
  useEffect(() => {
    if (submitSuccess) {
      // Gọi các hành động bạn muốn thực hiện khi submit thành công
      dispatch<any>(UserGetAllChannel());
      // Có thể thực hiện các hành động khác tại đây
      setSubmitSuccess(false); // Đặt lại trạng thái submit thành công để tránh lặp lại
    }
  }, [submitSuccess, dispatch]);
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
      const result = dispatch<any>(userSeach({ name: search }));
    }
  }, [search])

  const CreateGroup = async (value: any) => {
    setLoading(true)
    if (value) {
      const channel = {
        name: value.name,
        status: value.isPublic === 'true' ? true : false,
        userCreated: user ? user.id : '',
        members: selectedUsers.map((item: IUser) => item.id),
      };
  
      // Optimistically update the UI
      setTimeout(() => {
        notification["success"]({
          message: "Thông báo",
          description: "Tạo nhóm thành công",
        });
        formRef.current?.resetFields();
        setLoading(false);
        setSubmitSuccess(true); 
      }, 2000);
      try {
        // Dispatch the action
        dispatch<any>(UserCreateChannel(channel)); 
        dispatch<any>(UserGetAllChannel());
       
      
        // Handle success if needed
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  const handleRemoveUser = (userRemove: IUser) => {
    const userRemoveSelect = [...selectedUsers];
    const index = userRemoveSelect.findIndex((va) => va.id === userRemove.id);
    if (index !== -1) {
      userRemoveSelect.splice(index, 1);
      setselectedUsers(userRemoveSelect);
    }
  };

  const handleClickFunction = (users: IUser) => {
    if (selectedUsers) {
      const check = selectedUsers.every(usercheck => usercheck.id != users.id)
      if (check) {
        setselectedUsers([...selectedUsers, users])
        if (selectedUsers.length < 1) {
          form.setFields([
            {
              name: 'SearchUser',
              errors: ['Nhóm phải có ít nhất 2 người.'],
            },
          ]);
        } else {
          form.setFields([
            {
              name: 'SearchUser',
              errors: [],
            },
          ]);
        }
      }
      else
        notification['error']({
          message: 'User exist  ',
          description: 'chọn bạn bè khác ',
        })
    }
  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 24 },
  };


  return (
    <Modal title="Create Group Chat" onCancel={handleCancel} footer={null} open={isModalOpen}  >
      <Form
        ref={formRef || null}
        form={form}
        onFinish={CreateGroup}
      >
        <Form.Item
          name="name"
          {...formItemLayout}
          label="Tên nhóm chat : "

          hasFeedback
          rules={[{ required: true, message: "không được để trông" }]}
          labelAlign='left'
        >
          <Input
            placeholder='Chat Group Name'
            className='border border-gray-400'
          />
        </Form.Item>


        <Form.Item
          name="isPublic"
          label="Trạng thái Group : "
          {...formItemLayout}
          initialValue={'true'}
        >
          <Select
            showSearch
            placeholder="Tỉnh/Thành phố"
            defaultValue={'true'}
          >
            <Option value={'true'}>
              {'Public'}
            </Option>
            <Option value={'false'}>
              {'Private'}
            </Option>
          </Select>
        </Form.Item>


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
          {selectedUsers?.map((value: IUser, index) => (
            <p key={index} className={`border border-gray-300 flex items-center justify-center gap-2  rounded-xl text-white w-32 text-md ${bagTag[Math.floor(Math.random() * bagTag.length)]}`}>{value.name}
              <span><AiOutlineClose color={"white"} className="cursor-pointer" onClick={() => handleRemoveUser(value)} /></span>
            </p>
          ))}
        </div>
          {
            search && search.length > 0 ? ListUsersSeach.length > 0 ? ListUsersSeach.slice(0, 5).map((value: IUser, index: number) => (<div className='flex flex-col gap-5' key={index}>
              {<UserListItem value={value} index={index} handleClickFunction={() => handleClickFunction(value)} />}
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
