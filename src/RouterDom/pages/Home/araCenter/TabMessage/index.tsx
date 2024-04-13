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
   const UserContexts=useContext(UserContext);
  
   const LoadingSingle=useSelector((state:any)=>state.Chats.loadingSingChat)
   const {state}=UserContexts;
   const [user,setUser]=state.user;
   const [token,setToken]=state.token
    const {socket}=state
   const [selectedChat, setselectedChats] = state.selectedChat;
   const [LoadingChatChannel,setLoadingchatChannel]=useState(false)
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
        setLoadingchatChannel(true)
        const data=await UserApi.UserGetAllChannel()
        if(data){
          setListChannelnew(data.data)
          setLoadingchatChannel(false)
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



        ///socket cho chat Channel
        useEffect(() => {
          const handleData = async (data:any) => {
            if (data && data.message === 'Create channel success') {
            
              setLoadingchatChannel(true);
              // Cập nhật state bằng cách sử dụng hàm callback để đảm bảo rằng
              // bạn luôn có giá trị mới nhất của state đó
              setListChannelnew((currentListChannelnew:any) => [...currentListChannelnew, data.data]);
              setLoadingchatChannel(false);
              return socket.off('channelWS');
            }
          };
        
          socket.on('channelWS', handleData);
        
          // Đảm bảo hủy đăng ký sự kiện khi component unmount
          return () => {
            socket.off('channelWS', handleData);
          };
        }, [socket]);

        // useEffect(() => {
        //   const handleData = async (data:any) => {
        //     if (data && data.message === 'Add user to channel success') {
        //       const {channel}=data.data
        //       const {lastedThread}=channel
          
        //       // Cập nhật state bằng cách sử dụng hàm callback để đảm bảo rằng
        //       // bạn luôn có giá trị mới nhất của state đó
        //       setListChannelnew((currentListChannelnew:any) => [...currentListChannelnew, data.data]);
        //       setLoadingchatChannel(false);
        //       return socket.off('channelWS');
        //     }
        //   };
        
        //   socket.on('channelWS', handleData);
        
        //   // Đảm bảo hủy đăng ký sự kiện khi component unmount
        //   return () => {
        //     socket.off('channelWS', handleData);
        //   };
        // },[])
        



  
  
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
            <ShowChatMessage ListChannel={ListChannelnew} Loading={LoadingChatChannel} setselectedChats={setselectedChats} />
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

