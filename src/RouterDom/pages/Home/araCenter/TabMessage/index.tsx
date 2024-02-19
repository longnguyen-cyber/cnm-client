import { Checkbox, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

import React, { useState, useContext, useEffect, FunctionComponent, useCallback } from 'react'
import { AiOutlineDown, AiFillTag, AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { UserContext } from '../../../../../Context/UserContext';
import ShowChatMessage from './ChatChannelMessage';
import { useDispatch, useSelector } from 'react-redux';
import './TabMessage.css'
import { UserGetAllChannel, UserGetAllSingleChat } from '../../../../../feature/chat/pathApi';
import {ChatSingle} from './ChatSingle';
export default function Tabmessage() {
  const [stateType, setType] = useState(false)
   const UserContexts=useContext(UserContext);
   const ListChannel=useSelector((state:any)=>state.Chats.channelsSlide)
   const ListSingleChat=useSelector((state:any)=>state.Chats.chatSingleSlide)
   const LoadingSingle=useSelector((state:any)=>state.Chats.loadingSingChat)
   const LoadingChannels=useSelector((state:any)=>state.Chats.loadingChannelChat)
   const {state}=UserContexts;
   const [user,setUser]=state.user;
   const [token,setToken]=state.token
   const [selectedChat, setselectedChats] = state.selectedChat;

   const dispatch=useDispatch()
   const dispatchUserGetAllChannel = useCallback(() => {
    dispatch<any>(UserGetAllChannel());
  }, [dispatch]);
  
  useEffect(() => {
    dispatchUserGetAllChannel();
  },[dispatchUserGetAllChannel]);



  const dispatchUserGetAllSingleChat = useCallback(() => {
    dispatch<any>(UserGetAllSingleChat());
  },[dispatch])

  useEffect(()=>{
    dispatchUserGetAllSingleChat()
  },[dispatchUserGetAllSingleChat])

  return (
    <>
    {user?
    <>
      <div className='flex relative Tagmessage '>
        <div className='flex-1 flex-shrink-0 '>
          <Tabs >
            <TabPane tab="Chat đơn" className=' w-full' key="1">
              <ChatSingle ListSingleChat={ListSingleChat} Loading={LoadingSingle} setselectedChats={setselectedChats}/>
            </TabPane>
            <TabPane tab="Chat nhóm " key="2">
            <ShowChatMessage ListChannel={ListChannel} Loading={LoadingChannels} setselectedChats={setselectedChats} />
            </TabPane>
          </Tabs>
        </div>
  
        <div className='flex ml-auto right-0 mt-3 absolute items-center gap-4 mb-4'>
          <div className='flex items-center gap-3 relative cursor-pointer'>
            <p className={`text-sm  flex  items-center gap-3 cursor-pointer ${stateType ? "rounded-full transition-all text-blue-600 font-medium px-2 bg-blue-100" : ""}`}
             onClick={() => { setType(stateType == false ? true : false) }}>Phân loại<span><AiOutlineDown size={14} /></span></p>
            {stateType && (
              <div>
                <div className='absolute top-8 w-56 p-2 flex gap-4 flex-col bg-white shadow-md  left-0  border bg-black  rounded z-10'>
                  <p className='text-sm font-medium'>Theo thẻ phân loại </p>
                  <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-4'>
                      <Checkbox />
                      <div className='flex gap-3 items-center'>
                        <AiFillTag color='red' /><span className='text-sm'>Học tập </span>
                      </div>
                      <div>
                      </div>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Checkbox />
                      <div className='flex gap-3 items-center'>
                        <AiOutlineUserAdd /><span className='text-sm'>Tin nhắn từ người lạ </span>
                      </div>
                      <div>
                      </div>
                    </div>
                  </div>
                  <p className='p-2 border-t-2  text-center'>Quản lý phân loại thẻ</p>
                </div>
  
              </div>
            )}
  
          </div>
          <div className=''>
            <BsThreeDots />
          </div>
  
        </div>
  
      </div></>:""}
     </>
     
  )
}

