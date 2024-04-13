import React, { FunctionComponent } from 'react';
import { Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { IUser } from '../../../../../../Type';
import { MdAddTask } from "react-icons/md";
export const UserListItemAddToGroup: FunctionComponent<any> = ({ value, index,handleClickFunction,selectedUsers,selectedChat }) => {
 
  const isSelected = selectedUsers.map((user:any) => user.user.id).includes(value.user.id)
  // const isInGroup=value.user.id===value.userCreatedBy?.id;
  const userInGroup=selectedChat.users.map((user:any)=>user.id).includes(value.user.id)


  return (
    <>{userInGroup?

      <div style={{pointerEvents:"none", opacity: "0.5"}}  className='flex justify-between pointer-events: none; shadow-sm hover:bg-blue-300 p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200'>
     <div  className='flex items-center gap-1'>
    <Avatar src={<img src={`${value.user.avatar}`} alt="avatar" />} />
    <div>
      <p className='text-md'>{value.user.name}</p>
      <div className='flex'>
        <b>Email</b> | <p>{value.user.email}</p>
      </div>
    </div>
    </div>
    <div className='flex items-center gap-2 '>
      
      <MdAddTask color='white' style={{background:'rgb(59 246 93 / 50%)'}} className='rounded-full' size={24}/>  trong nhóm 
    </div>
  </div>
    

    :
    <>
    {isSelected?<>
      <div onClick={() => handleClickFunction(value)} style={{pointerEvents:"none", opacity: "0.5"}}  className='flex justify-between pointer-events: none; shadow-sm hover:bg-blue-300 p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200'>
     <div  className='flex items-center gap-1'>
    <Avatar src={<img src={`${value.user.avatar}`} alt="avatar" />} />
    <div>
      <p className='text-md'>{value.user.name}</p>
      <div className='flex'>
        <b>Email</b> | <p>{value.user.email}</p>
      </div>
    </div>
    </div>
    <div className='flex items-center gap-2 '>
      
      <MdAddTask color='white' style={{background:'#4096ff'}} className='rounded-full' size={24}/>  
     
      <p  style={{color:'#4096ff'}} className='font-medium'>Đã thêm </p>
    </div>
  </div>
    
    </>:
    
    <div onClick={() => handleClickFunction(value)} key={index} className='flex shadow-sm hover:bg-blue-300 p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200'>
    <Avatar src={<img src={`${value.user.avatar}`} alt="avatar" />} />
    <div>
      <p className='text-md'>{value.user.name}</p>
      <div className='flex'>
        <b>Email</b> | <p>{value.user.email}</p>
      </div>
    </div>
  </div>
    }
    
    
    </>
    
   
   
  }
     
    </>
   
  );
};

export default UserListItemAddToGroup;
