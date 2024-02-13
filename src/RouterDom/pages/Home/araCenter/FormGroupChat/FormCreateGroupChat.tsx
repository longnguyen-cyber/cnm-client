
import React, { FunctionComponent, useEffect, useState } from 'react'

import { Select, message, notification } from 'antd'
import { Space, Spin } from 'antd';
import axios from 'axios'
import { Button, Form, Input, Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineClose } from "react-icons/ai";
import UserListItem from './UserListItem';
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
interface IUserdemo {
    id: string;
    name: string;
    email: string;
    phone:string,
    avatar:string
  
  }
export const  FormCreateGroupChat:FunctionComponent<any>=({isModalOpen,setIsModalOpen})=> {
    const [form] =Form.useForm()  
    const [selectedUsers, setselectedUsers] = useState<IUserdemo[]>([]);
    const bagTag=["bg-blue-400",'bg-red-400','bg-gray-500','bg-orange-400','bg-yellow-500','bg-amber-500','bg-green-500','bg-teal-600','bg-lime-700']
    const [SearchResult, setSearchResult] = useState<IUserdemo[]>([])
    const [loading, setLoading] = useState(false)
    const [LoadingCrate, setLoadingCrate] = useState(false)
    const [search, setSearch] = useState("")

    const [datasearchDemo,setDatasearchDemo]=useState<IUserdemo[]>([])
    //tao du lieu mau
    const userdemoserach:IUserdemo[]=[
   {
       id:"65a4aa4dc2f43ffc23ef4c16",
       name:'Lê Văn Hà',
       phone:'0987654321',
       email:'lon33g@gmail.com',
       avatar:'https://meliawedding.com.vn/wp-content/uploads/2022/03/hinh-anh-nguoi-mau-lam-hinh-nen-dien-thoai-45-576x1024.jpg'
    },
    {
       id:"65a4abaac2f43ffc23ef4c18",
       name:'kuga',
       phone:'0234234',
       email:'lon31g@gmail.com',
       avatar:'https://i.pinimg.com/736x/ab/9b/8e/ab9b8eba794b06640b13805aba65cbd2.jpg'
    },
    {
       id:"65a4ac2ccd6716d6b33286c5",
       name:'hy',
       phone:'0399432231',
       email:'lon33g@gmail.com',
       avatar:'https://vnn-imgs-a1.vgcloud.vn/icdn.dantri.com.vn/2021/05/08/kimoanh-856-1620472406458.jpeg'
    },
    {
       id:"65ae380b966692ca03c0bc3e",
       name:'lqp',
       phone:'0922654321',
       email:'lqp33@gmail.com',
       avatar:'https://i.pinimg.com/736x/ab/9b/8e/ab9b8eba794b06640b13805aba65cbd2.jpg'
    },
   ]

   useEffect(() => {
    if(search){
        setLoading(true)
        let result=userdemoserach.filter((item)=>{return item.name.toLowerCase().includes(search.toLowerCase())})
        setTimeout(()=>{
            setLoading(false)
            setSearchResult(result)
        },500)
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
  
    const handleRemoveUser = (userRemove:IUserdemo) => {
        const userRemoveSelect = [...selectedUsers];
        const index = userRemoveSelect.findIndex((va) => va.id === userRemove.id);
        if (index !== -1) {
          userRemoveSelect.splice(index, 1);
          setselectedUsers(userRemoveSelect);
        }
      };
      
      const handleClickFunction = (users: IUserdemo) => {
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
        label="Add User to Group Chat : "
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
{   selectedUsers?.map((value:IUserdemo,index)=>(
        <p className={`border border-gray-300 flex items-center justify-center gap-2  rounded-xl text-white w-32 text-md ${bagTag[Math.floor(Math.random() * bagTag.length)]}`}>{value.name}
        <span><AiOutlineClose color={"white"} className="cursor-pointer" onClick={()=>handleRemoveUser(value)}/></span>
        </p>
    ))     }
    </div>

          {loading === true ? <div className='flex items-center justify-center '>
      <Space size="middle">
        <Spin size="small" />
      </Space>
    </div> : <>
      {
        search && search.length > 0 ? SearchResult.length > 0 ? SearchResult.slice(0, 4).map((value: IUserdemo, index) => (<div className='flex flex-col gap-5' key={index}>
          {<UserListItem value={value} handleClickFunction={() => handleClickFunction(value)} />}
        </div>)) : "Không có kết quả tìm kiếm" : ""
      }
    </>
    }
             <Form.Item>
        <Button type="primary" className='w-full bg-blue-500 h-10 ' htmlType='submit'>
          {LoadingCrate && <Spin indicator={antIcon} className='text-white mr-3' />}  Submit
        </Button>
      </Form.Item>
     </Form>
  </Modal>
  )
}
