import React, { FunctionComponent } from 'react';
import { MdAddTask } from 'react-icons/md';

const UserListItemAddToGroup: FunctionComponent<any> = ({ value, handleClickFunction, selectedUsers, selectedChat }) => {
  const isSelected = selectedUsers.map((user:any) => user.user.id).includes(value.user.id)
  const isUserBlocked = selectedChat.blockUser.includes(value.user.id);
  const isUserInGroup = selectedChat.users.some((user:any) => user.id === value.user.id);

  if (isUserBlocked) {
    // User is blocked and cannot be added to the group
    return (
      <div className='flex justify-between opacity-0.5 shadow-sm bg-gray-300 p-1 rounded mb-3 cursor-not-allowed gap-3 items-center w-full border border-gray-200'>
        <div className='flex items-center gap-1'>
         <img src={value.user.avatar} alt="avatar" className='rounded-full w-14 h-14' />
          <div>
            <p className='text-md'>{value.user.name}</p>
            <div className='flex'>
              <b>Email</b> | <p>{value.user.email}</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <MdAddTask color='red' className='rounded-full' size={24} />
          <p style={{ color: 'red' }} className='font-medium'>Đã bị chặn </p>
        </div>
      </div>
    );
  }

  if (isUserInGroup) {
    // User is already in the group
    return (
      <div className='flex justify-between opacity-0.5 shadow-sm bg-blue-300 p-1 rounded mb-3 cursor-not-allowed gap-3 items-center w-full border border-gray-200'>
        <div className='flex items-center gap-1'>
          <img src={value.user.avatar} alt="avatar"  className='rounded-full w-14 h-14'/>
          <div>
            <p className='text-md'>{value.user.name}</p>
            <div className='flex'>
              <b>Email</b> | <p>{value.user.email}</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <MdAddTask color='white' style={{ background: 'rgb(59 246 93 / 50%)' }} className='rounded-full' size={24} />
          <p className='font-medium' style={{ color: 'green' }}>Trong nhóm</p>
        </div>
      </div>
    );
  }

  // User is selectable and not in group
  return (
    <div onClick={() => handleClickFunction(value)} className={`flex justify-between shadow-sm ${isSelected ? 'bg-blue-300' : 'hover:bg-blue-300'} p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200`}>
      <div className='flex items-center gap-1'>
     <img src={value.user.avatar} alt="avatar"  className='rounded-full border w-14 h-14'/>
        <div>
          <p className='text-md'>{value.user.name}</p>
          <div className='flex'>
            <b>Email</b> | <p>{value.user.email}</p>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className='flex items-center gap-2'>
          <MdAddTask color='white' style={{ background: '#4096ff' }} className='rounded-full' size={24} />
          <p style={{ color: '#4096ff' }} className='font-medium'>Đã thêm</p>
        </div>
      )}
    </div>
  );
};

export default UserListItemAddToGroup;
