
import React, { FunctionComponent, useEffect, useState } from 'react'

import { Select, message, notification } from 'antd'
import { Space, Spin } from 'antd';
import { userSeach } from '../../../../../feature/user/pathApi';
import axios from 'axios'
import { Button, Form, Input, Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineClose } from "react-icons/ai";
import UserListItem from './UserListItem';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from '../../../../../Type';
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const  FormCreateGroupChat:FunctionComponent<any>=({isModalOpen,setIsModalOpen})=> {
    const [form] =Form.useForm()  
    const dispatch = useDispatch();
    const Loading=useSelector((state:any)=>state.Users.loading)
    const ListUsersSeach = useSelector((state: any) => state.Users.UserSlice);
    const [selectedUsers, setselectedUsers] = useState<IUser[]>([]);
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
    
    const [SearchResult, setSearchResult] = useState<IUser[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
   useEffect(() => {
    if(search){
        setLoading(true)
       const result=dispatch<any>(userSeach({name: search}));
    
        setSearchResult(result)
       
    }

  }, [search])
    useEffect(() => {
        // Kiểm tra điều kiện khi mảng selectedUsers thay đổi
        if (selectedUsers.length < 2) {
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
      }, []);

      const CreateGroup= async(value:any)=>{
      }
  
    const handleRemoveUser = (userRemove:IUser) => {
        const userRemoveSelect = [...selectedUsers];
        const index = userRemoveSelect.findIndex((va) => va.id === userRemove.id);
        if (index !== -1) {
          userRemoveSelect.splice(index, 1);
          setselectedUsers(userRemoveSelect);
        }
      };
      
      const handleClickFunction = (users: IUser) => {
        if (selectedUsers) {
          const check=selectedUsers.every(usercheck=>usercheck.id!=users.id)
          if(check){
            setselectedUsers([...selectedUsers,users])
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
      const onChangeStatus = (value: string) => {

      }
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 24 },
      };

      
  return (
    <Modal title="Create Group Chat" onCancel={handleCancel} footer={null} open={isModalOpen}  >
    <Form
    form={form}
    onFinish={CreateGroup}
    
    >
      <Form.Item
        name="name"
        {...formItemLayout}
        label="Tên nhóm chat : "

        hasFeedback
        rules={[{required:true,message:"không được để trông"}]}
       labelAlign='left'
      >
        <Input
          placeholder='Chat Group Name'
          className='border border-gray-400'
        />
      </Form.Item>

      <Form.Item
                          
                          name="Trạng thái"
                          label="Trạng thái Group Chat : "
                          {...formItemLayout}
                          hasFeedback
                          rules={[
                              {
                                  required: true,
                                  message:
                                      "Vui lòng chọn  Trạng thái  !",
                              },
                          ]}>
                           <Select
                                  showSearch
                                  placeholder="Tỉnh/Thành phố"
                                  onChange={onChangeStatus}
                              >
                                      <Option value={'Public'} >
                                          {'Public'}
                                      </Option>
                                      <Option value={'Private'} >
                                          {'Private'}
                                      </Option>
                              </Select>
                          </Form.Item>
      <Form.Item
        name="SearchUser"
        label="Thêm thành viên  : "
        hasFeedback
        {...formItemLayout}
        rules={[  ]}
      >
        <Input
          placeholder='Search User'
          className='border border-gray-400'
          onChange={(value) => { setSearch(value.target.value)}}
        />
      </Form.Item>
<div className='mb-3 flex flex-wrap gap-3 items-center'>
   {selectedUsers?.map((value:IUser,index)=>(
        <p className={`border border-gray-300 flex items-center justify-center gap-2  rounded-xl text-white w-32 text-md ${bagTag[Math.floor(Math.random() * bagTag.length)]}`}>{value.name}
        <span><AiOutlineClose color={"white"} className="cursor-pointer" onClick={()=>handleRemoveUser(value)}/></span>
        </p>
    ))     }
    </div>

          {Loading === true ? <div className='flex items-center justify-center '>
      <Space size="middle">
        <Spin size="small" />
      </Space>
    </div> : <>
      {
        search && search.length > 0 ? ListUsersSeach.length > 0 ? ListUsersSeach.slice(0, 5).map((value: IUser, index:number) => (<div className='flex flex-col gap-5' key={index}>
          {<UserListItem value={value} handleClickFunction={() => handleClickFunction(value)} />}
        </div>)) : "Không có kết quả tìm kiếm" : ""
      }
    </>
    }
             <Form.Item>
        <Button type="primary" className='w-full bg-blue-500 h-10 ' htmlType='submit'>
          {Loading && <Spin indicator={antIcon} className='text-white mr-3' />}  Submit
        </Button>
      </Form.Item>
     </Form>
  </Modal>
  )
}
