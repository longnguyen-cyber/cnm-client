import { Checkbox, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

import React, { useState, useContext, useEffect, FunctionComponent, useCallback } from 'react'
import { AiOutlineDown, AiFillTag, AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { UserContext } from '../../../../../Context/UserContext';

import { useDispatch, useSelector } from 'react-redux';
import './TabMessage.css'
import { UserGetAllChannel, UserGetAllSingleChat } from '../../../../../feature/chat/pathApi';
import {ChatSingle} from './ChatSingle';
import ShowChatMessage from './ChatChannelMessage';
import ShowChatStranger from './ShowChatStranger';

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
            <TabPane tab="Bạn bè" className=' w-full' key="1">
              <ChatSingle ListSingleChat={ListSingleChat} Loading={LoadingSingle} setselectedChats={setselectedChats}/>
            </TabPane>
            <TabPane tab="Chat nhóm " key="2">
            <ShowChatMessage ListChannel={ListChannel} Loading={LoadingChannels} setselectedChats={setselectedChats} />
            </TabPane>
            <TabPane tab="Người lạ " key="3">
            <ShowChatStranger ListSingleChat={ListSingleChat} Loading={LoadingSingle} setselectedChats={setselectedChats} />
            </TabPane>
          </Tabs>
        </div>
  
    
  
      </div></>:""}
     </>
     
  )
}

