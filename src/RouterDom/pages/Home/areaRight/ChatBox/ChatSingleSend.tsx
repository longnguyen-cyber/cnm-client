import React, { FunctionComponent, useState } from 'react'
import { ScrollChat } from './ScrollChat'
import { Input, Spin } from 'antd'
import { AiOutlineTags } from 'react-icons/ai'
import { MdKeyboardArrowLeft } from 'react-icons/md'

export const ChatSingleSend:FunctionComponent<any>=({selectedChat})=> {
    const [inputValue, setInputValue] = useState('');
    const getSelectUserIsChoose = (selectedChat: any) => {

        return (
     
          <>
            <div className='flex items-center p-1'>
              <p className='presspreveriose' ><MdKeyboardArrowLeft size={30} className='text-gray-600 cursor-pointer -mr-3' /></p>
    
              {selectedChat &&selectedChat.user&&
                <div className='flex gap-3 bacgroundxe  items-center px-5'>
                  <img src={`${selectedChat.user.avatar}`} className='w-12 h-12 rounded-full' />
                  <div>
                    <p className='text-xl font-medium '>{selectedChat.user.name}</p>
                    <AiOutlineTags color='gray' className='mt-1' />
                  </div>
    
                </div>}
            </div>
          </>
        )
      }

      const handleChange = (event: any) => {
        
      };
      const handleKeyPress = async (event: any) => {
      };
      const submitChatSuccess = (data: any) => {
    
       
    
      }
  return (
    <div className="flex flex-col h-screen bg-gray-300  relative">
    <div className='flex items-center h-16 w-full bg-white shadow-md'>
      {getSelectUserIsChoose(selectedChat)}
    </div>
    <div className='flex flex-col justify-end  flex-grow'>
     {/* {loading ? <Spin indicator={antIcon}
        style={{ fontSize: '100px' }}
        className='text-black text-4xl m-auto justify-center self-center  ' /> : */} 
        <ScrollChat />
      {/* {isTyPing?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
      <Input
        onKeyPress={handleKeyPress}
        onChange={handleChange}

        placeholder='Nhập @, tin nhắn mới ???'

        value={inputValue}
        className='rounded-none h-14 w-full placeholder-gray-500'

      />
    </div>
  </div>
  )
}
