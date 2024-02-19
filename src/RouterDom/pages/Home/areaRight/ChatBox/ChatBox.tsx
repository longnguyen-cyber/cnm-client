import React, { useContext, useEffect, useState, useRef } from 'react'
import { notification, message } from 'antd'
import { AiOutlineTags, AiOutlineArrowLeft } from "react-icons/ai";
import { Form, Input } from 'antd';

import { MdKeyboardArrowLeft } from "react-icons/md";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import axios from 'axios';
import { UserContext } from '../../../../../Context/UserContext';
import { IUser } from '../../../../../Type';
import Banner from '../HomeRightReComent/Banner';
import GroupChat from './GroupChat';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const ChatBox = () => {
  const UserContexts = useContext(UserContext);
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const [token, setToken] = state.token
  const { socket } = state
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [selectedChat, setselectedChats] = state.selectedChat;
  useEffect(() => {

  }, [])

  const handleChangInputChatFocus = () => {

  }
  const handleChangInputChatBlur = () => {
    if (socket) {

    }
  }
  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };
  const handleKeyPress = async (event: any) => {
  };
  const getSelectUserIsChoose = (selectedChat: any) => {
    console.log(selectedChat)
   
    return (
      <>
        <div className='flex items-center p-1'>
          <p className='presspreveriose' onClick={() => { setselectedChats(null)}} ><MdKeyboardArrowLeft size={30} className='text-gray-600 cursor-pointer -mr-3' /></p>
      
            {selectedChat && <div className='flex gap-3 items-center px-5'>
                <img src={`${selectedChat.avatar}`} className='w-12 h-12 rounded-full' />
                <div>
                    <p className='text-xl font-medium '>{selectedChat.name}</p>
                    <AiOutlineTags color='gray' className='mt-1' />
                </div>

            </div>}
        </div>
        </>
    )
}
  return (
    <div
      className='
            h-full w-full
            min-h-screen'
    >
      {selectedChat?  selectedChat.receiveId ?
        <>
         <div className="flex flex-col h-screen bg-gray-400  relative">
              <div className='flex items-center h-16 w-full bg-white shadow-md'>
                {getSelectUserIsChoose(selectedChat.userReceive)}
                </div>
                <div className='flex flex-col justify-end  flex-grow'>
                  {loading ? <Spin indicator={antIcon}
                    style={{ fontSize: '100px' }}
                    className='text-black text-4xl m-auto justify-center self-center  ' /> :
                    //  <ScrollAbleChat messages={messages}/>
                    "day la noi dung chat"
                  }
  
  
                  {/* {isTyPing?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
                  <Input
                    onKeyPress={handleKeyPress}
                    onChange={handleChange}
                    onFocus={() => { handleChangInputChatFocus() }}
                    placeholder='Nhập @, tin nhắn mới ???'
                    onBlur={() => { handleChangInputChatBlur() }}
                    value={inputValue}
                    className='rounded-none h-14 w-full placeholder-gray-500'
  
                  />
                </div>
              </div>
        </>
      :selectedChat.users?
        <>
         <div>
                  <div className="flex items-center p-1">
                    <p className='presspreveriose' ><MdKeyboardArrowLeft onClick={() => {setselectedChats(null) }} size={30} className='text-gray-600 cursor-pointer -mr-3' /></p>
                    <div className="flex-shrink-0 pl-4">
                      <div className="flex flex-wrap w-10 justify-center  items-center">
                        {selectedChat.users.length > 0 && selectedChat.users.slice(0, 3).map((value: IUser, index: number) => <img className="w-5 h-5 rounded-full " src={`${value.avatar}`} alt="Avatar 1" />)}
                        <p className='rounded-full text-gray-500  flex items-center justify-center  bg-gray-300 w-5 h-5'>{selectedChat.users.length - 3}</p>
                      </div>
                    </div>
                    <div className=" ml-4">
                      <div className="flex items-center">
                        <h4 className="text-lg font-medium">{selectedChat.name}</h4>
                      </div>
                      <AiOutlineTags color='gray' className='mt-1' />
                    </div>
                  </div>
                  <div className='bg-gray-300'>
                    <GroupChat  />
                  </div>
                </div>
        </>
      :
      <div className='flex flex-col  min-h-screen item-center justify-center'>
      <Banner />
    </div>
    :
    <div className='flex flex-col  min-h-screen item-center justify-center'>
      <Banner />
    </div>
    
   
      }
  </div>
  )
}
export default ChatBox
