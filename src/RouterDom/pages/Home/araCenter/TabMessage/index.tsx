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
import UserApi from '../../../../../api/user';
import { Socket } from 'engine.io-client';

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
    const {socket}=state
   const [selectedChat, setselectedChats] = state.selectedChat;

   const [ListSingleChatnew,setListSingleChatnew]=useState<any>([])
    const [ListChannelnew,setListChannelnew]=useState<any>([])
  

    useEffect(()=>{
    async function  UserGetAllSingleChat(){
      const data=await UserApi.UserGetAllSingleChat()

      if(data){
        setListSingleChatnew(data.data)
      }

      }
      UserGetAllSingleChat()
      
    },[])







    useEffect(()=>{
      async function  UserGetAllChannelChat(){
        const data=await UserApi.UserGetAllChannel()
  
        if(data){
          setListChannelnew(data.data)
        }
  
        }
        UserGetAllChannelChat()
        
      },[])

      useEffect(()=>{
        socket.on("updatedSendThread", async (data: any) => {
       
          setListSingleChatnew((prev:any)=>{
            return prev.map((item:any)=>{
              if(item.id===data.chatId){
                return {...item,lastedThread:data}
              }
              return item
            })
          })
      const datas=await UserApi.UserGetAllChannel()
  
        if(data){
          setListChannelnew(datas.data)
        }
  

        })


      },[socket,ListSingleChatnew])

      useEffect(
        ()=>{
        socket.on("chatWS", async (data: any) => {
          const datas=await UserApi.UserGetAllChannel()
          if(data){
            setListChannelnew(datas.data)
           }
          })
        },[socket,ListSingleChatnew])



  
  
  return (
    <>
    {user?
    <>
      <div className='flex relative Tagmessage '>
        <div className='flex-1 flex-shrink-0 '>
          <Tabs >
            <TabPane tab="Bạn bè" className=' w-full' key="1">
              <ChatSingle ListSingleChat={ListSingleChatnew} Loading={LoadingSingle} setselectedChats={setselectedChats}/>
            </TabPane>
            <TabPane tab="Chat nhóm " key="2">
            <ShowChatMessage ListChannel={ListChannelnew} Loading={LoadingChannels} setselectedChats={setselectedChats} />
            </TabPane>
            <TabPane tab="Người lạ " key="3">
            <ShowChatStranger ListSingleChat={ListSingleChatnew} Loading={LoadingSingle} setselectedChats={setselectedChats} />
            </TabPane>
          </Tabs>
        </div>
  
    
  
      </div></>:""}
     </>
     
  )
}

