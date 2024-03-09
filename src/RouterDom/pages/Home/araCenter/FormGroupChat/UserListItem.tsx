import React, { FunctionComponent } from 'react';
import { Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { IUser } from '../../../../../Type';
import { MdAddTask } from "react-icons/md";
export const UserListItem: FunctionComponent<any> = ({ value, index,handleClickFunction,selectedUsers }) => {
 
  const isSelected = selectedUsers.map((user:IUser) => user.id).includes(value.id)
  return (
    <>{isSelected?

      <div className='flex justify-between shadow-sm hover:bg-blue-300 p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200'>
     <div onClick={() => handleClickFunction(value)} key={index} className='flex items-center gap-1'>
    <Avatar src={<img src={`${value.avatar}`} alt="avatar" />} />
    <div>
      <p className='text-md'>{value.name}</p>
      <div className='flex'>
        <b>Email</b> | <p>{value.email}</p>
      </div>
    </div>
    </div>
    <div className='flex items-center gap-2 '>
      
      <MdAddTask color='white' style={{background:'#4096ff'}} className='rounded-full' size={24}/>  
     
      <p  style={{color:'#4096ff'}} className='font-medium'>Đã thêm </p>
    </div>


  </div>
    

    :
    <div onClick={() => handleClickFunction(value)} key={index} className='flex shadow-sm hover:bg-blue-300 p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200'>
    <Avatar src={<img src={`${value.avatar}`} alt="avatar" />} />
    <div>
      <p className='text-md'>{value.name}</p>
      <div className='flex'>
        <b>Email</b> | <p>{value.email}</p>
      </div>
    </div>
  </div>
   
  }
     
    </>
   
  );
};

export default UserListItem;
