import React, { FunctionComponent } from 'react';
import { Avatar } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';

export const UserListItem: FunctionComponent<any> = ({ value, index,handleClickFunction }) => {
  return (
    <div onClick={() => handleClickFunction(value)} key={index} className='flex shadow-sm hover:bg-blue-300 p-1 rounded mb-3 cursor-pointer gap-3 items-center w-full border border-gray-200'>
      <Avatar src={<img src={`${value.avatar}`} alt="avatar" />} />
      <div>
        <p className='text-md'>{value.name}</p>
        <div className='flex'>
          <b>Email</b> | <p>{value.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
