import { Checkbox, Tabs, message } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

import React, { useState, useContext, useEffect, FunctionComponent, useCallback } from 'react'
import { AiOutlineDown, AiFillTag, AiOutlineUserAdd } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { UserContext } from '../../../../../Context/UserContext';

import { useDispatch, useSelector } from 'react-redux';
import './TabMessage.css'
import { UserGetAllChannel, UserGetAllSingleChat } from '../../../../../feature/chat/pathApi';
import { ChatSingle } from './ChatSingle';
import ShowChatMessage from './ChatChannelMessage';
import ShowChatStranger from './ShowChatStranger';
import UserApi from '../../../../../api/user';
import { Socket } from 'engine.io-client';

export default function Tabmessage() {
  const UserContexts = useContext(UserContext);
  const LoadingSingle = useSelector((state: any) => state.Chats.loadingSingChat)
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const [token, setToken] = state.token
  const { socket } = state
  const [selectedChat, setselectedChats] = state.selectedChat;
  const [LoadingChatChannel, setLoadingchatChannel] = useState(false)
  const [ListSingleChatnew, setListSingleChatnew] = useState<any>([])
  const [ListChannelnew, setListChannelnew] = useState<any>([])
  const [CloudUser, setCloudUser] = useState<any>(null)
 
 console.log('data cloud')
  console.log(CloudUser)
  // https://help.zalo.me/wp-content/uploads/2023/08/z4650065944256_2971e71cc06a5cfcb0aef41782e5f30e.jpg


  //CloudUser
  useEffect(() => {
    async function UserGetCloud() {
      const data = await UserApi.getMyCloud()
      if (data) {
        setCloudUser(data.data)
      }
    }
    UserGetCloud()
  }, [])

  useEffect(() => {
    async function UserGetAllSingleChat() {
      const data = await UserApi.UserGetAllSingleChat()
      if (data) {
        setListSingleChatnew(data.data)
      }
    }
    UserGetAllSingleChat()
  }, [])

  

  useEffect(() => {
    async function UserGetAllChannelChat() {
      setLoadingchatChannel(true)
      const data = await UserApi.UserGetAllChannel()
      if (data) {
        setListChannelnew(data.data)
        setLoadingchatChannel(false)
      }
    }
    UserGetAllChannelChat()
  }, [])



  ///-----------------------------------------for chatsigle
  useEffect(() => {
    const handDataChatWs = async (response: any) => {
      console.log('resonpose')
      console.log(response)
     
   
      if (response.message === "Request friend success") {
        

      }
      else if (response.message === "Accept friend success") {
        console.log('accept friend success')

          const data = await UserApi.UserGetAllSingleChat()
          if (data) {
            setListSingleChatnew(data.data)
          }
      }
      else if (response.message === "Unrequest friend success") {
       
      }

    }
    socket?.on('chatWS', handDataChatWs)
    return () => {socket.off('chatWS', handDataChatWs)}

     
  }, [socket])
  ///----------------------for chatsigle
  
  useEffect(() => {
    socket?.on("updatedSendThread", async (data: any) => {

      console.log('data updatedSendThread in dex')
      console.log(data)
      if(data?.chatId){
        setListSingleChatnew((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === data.chatId) {
              return { ...item, lastedThread: data }
            }
            return item
          })
        })
      }
      if(data.type==='cloud'){
        setCloudUser({...CloudUser,threads:[...CloudUser.threads,data]})
        console.log('dadta clodu')
        console.log(data)
      
          
      }
      if(data.channelId){
        console.log('data.channelId')
        console.log(data.channelId)
        setListChannelnew((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === data.channelId) {
              return { ...item, lastedThread: {messages:data.messages} }
            }
            return item
          })
        })
      }
    
      
    })
    return () => {socket.off('updatedSendThread')}
  }, [socket, ListSingleChatnew])

  useEffect(
    () => {
      socket?.on("chatWS", async (data: any) => {
        const datas = await UserApi.UserGetAllChannel()
        if (data) {
          setListChannelnew(datas.data)
        }
      })
    }, [socket, ListSingleChatnew])



  ///socket cho chat Channel
  useEffect(() => {
    const handleData = (data: any) => {
      console.log('data channelWS')
      console.log(data)
      if (data && data.message === 'Create channel success') {
     
          data?.data.users.map((item: any) => {
            if(item.id===user.id){
              setListChannelnew((currentListChannelnew: any) => [...currentListChannelnew, data.data]);
            }
          })

          // Cập nhật state bằng cách sử dụng hàm callback để đảm bảo rằng
          // bạn luôn có giá trị mới nhất của state đó
        
          setLoadingchatChannel(false);

      
     
        return socket.off('channelWS');
      }
      // else {
      //   notification["error"]({
      //     message: "Thông báo",
      //     description: "Tạo nhóm Thất bại ",
      //   });
      // }
      if (data && data.message === 'Update channel success') {
        const { channel } = data.data
        setListChannelnew((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === channel.id) {
              return { ...item, lastedThread: channel.lastedThread, name: channel.name }
            }
            return item
          })
        })
        return
      }
      if (data && data.message === 'Remove user from channel success') {
        const { channel } = data.data
  
        setListChannelnew((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === channel.id) {
              return { ...item, lastedThread: channel.lastedThread, name: channel.name }
            }
            return item
          })
        })
        return
      }

      if (data && data.message === 'Update role user in channel success') {
        const { channel } = data.data
        setListChannelnew((prev: any) => {
          return prev.map((item: any) => {
            if (item.id === channel.id) {
              return { ...item, lastedThread: channel.lastedThread, name: channel.name }
            }
            return item
          })
        })
        return

      }
      if (data && data.message === 'Leave channel success') {
        const { channel } = data.data;
        setListChannelnew((prev: any) => {
          if(data.data.userLeave===user.id){
            return prev.filter((item: any) => item.id !== channel.id);
          }
        });
      }

      if (data && data.message === 'Delete channel success') {
        const { channel } = data.data;
        setListChannelnew((prev: any) => {
          return prev.filter((item: any) => item.id !== channel.id);
        });
      }
    }

    socket.on('channelWS', handleData);

    // Đảm bảo hủy đăng ký sự kiện khi component unmount
    return () => {
      socket.off('channelWS', handleData);
    };
  }, [socket]);


  ///cloud
  









  return (
    <>
      {user ?
        <>
          <div className='flex relative Tagmessage '>
            <div className='flex-1 flex-shrink-0 '>
              <Tabs >
                <TabPane tab="Bạn bè" className=' w-full' key="1">
                  <ChatSingle ListSingleChat={ListSingleChatnew} Loading={LoadingSingle} setselectedChats={setselectedChats} CloudUser={CloudUser}/>
                </TabPane>
                <TabPane tab="Chat nhóm " key="2">
                  <ShowChatMessage ListChannel={ListChannelnew} Loading={LoadingChatChannel} setselectedChats={setselectedChats} />
                </TabPane>
                <TabPane tab="Người lạ " key="3">
                  <ShowChatStranger ListSingleChat={ListSingleChatnew} Loading={LoadingSingle} setselectedChats={setselectedChats} />
                </TabPane>
              </Tabs>
            </div>



          </div></> : ""}
    </>

  )
}

