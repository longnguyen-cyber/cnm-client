import React, { FunctionComponent, useState } from 'react'
import { ISearch } from '../../../../../Type'
import { Input, Modal } from 'antd'
import { AiOutlineUserAdd, AiOutlineUsergroupAdd, AiOutlineSearch } from "react-icons/ai";
import { FormCreateGroupChat } from '../FormGroupChat/FormCreateGroupChat';
export const SearchPage: FunctionComponent<any> = ({ SearchHand, setSeachHandle, setSearchValue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clickCloseSeach = (value: boolean) => {
    setSeachHandle(value)
  }

  const handleGetValue = (value: any) => {
    setSeachHandle(true)
    setSearchValue(value)
  }

  return (
    <div className='flex items-center w-full gap-3'>
      <Input
        placeholder="Tìm kiếm "
        className='w-full'
        onChange={(e) => { handleGetValue(e.target.value) }}

        prefix={<AiOutlineSearch className="site-form-item-icon" />}
      />
      {SearchHand ?
        <div className='font-medium text-md cursor-pointer'>
          <p onClick={() => { clickCloseSeach(false) }}>Đóng</p> </div> :
        <div className='flex gap-3'>
          <AiOutlineUserAdd className='cursor-pointer' onClick={() => { setIsModalOpen(true) }} />
          <AiOutlineUsergroupAdd className='cursor-pointer' />
          <FormCreateGroupChat isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>}

    </div>
  )
}
