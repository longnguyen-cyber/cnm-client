import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { ScrollChatSingle } from './ScrollChatSingle'
import { Input, Spin, notification } from 'antd'

import { AiOutlineTags } from 'react-icons/ai'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { UserContext } from '../../../../../Context/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { UserGetChatsSingleById } from '../../../../../feature/chat/pathApi'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineUserAdd } from "react-icons/ai";
export const ChaxBoxNoMustFriend:FunctionComponent<any>=({selectedChat,setselectedChats})=> {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
    const chatSingleId = useSelector((state: any) => state.Chats.chatSingleId)
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState('');
    const contextUser = useContext(UserContext)
    const { state } = contextUser
    const [user, setUser] = state.user
    const {socket}=state
    const [wordchat,setwordChat]=useState('')
    const [loadingSelectChat,setLoadingSelectChat]=useState(false)
    const [loadingsending,setLoadingsending]=useState(false);
    const [DataSocket,setDataSocket]=useState<any>(null)
    const [checkRender,setScheckRender]=state.checkRender
    const [chatSingleIdnew,setChatSingleIdNew]=useState<any>(null)
    useEffect(()=>{
     async function getData(){
      if(selectedChat){
        const data=await dispatch<any>(UserGetChatsSingleById({ id: selectedChat.id }));
        if(data&&data.payload&&data.payload.data){
          setChatSingleIdNew(data.payload.data)
        }
      }
    }
     getData()
    },[selectedChat,DataSocket,checkRender])
   
      useEffect(() => {
        if(socket){
          socket.on("updatedSendThread",(data:any)=>{
            setDataSocket(data)
            setTimeout(()=>{
              setLoadingsending(false)
              setwordChat('')
            },3000)
          })
         return ()=>{
           socket.off('updatedSendThread')
         }
        }
      },[]) 

      useEffect(() => {
        if(!chatSingleIdnew){
          if(socket){
            socket.on("chatWS",(data:any)=>{
              if(data){
                setScheckRender(data)
                setDataSocket(data)
              }
           
              setTimeout(()=>{
                setLoadingsending(false)
                setwordChat('')
              },3000)
            })
           return ()=>{
             socket.off('chatWS')
           }
          }
        }
        else{
          if(socket){
            socket.on("chatWS",(data:any)=>{
              console.log(data)
              if(data.message==='Đã gửi lời mời kết bạn'){
                notification['error']({
                  message: 'Thông báo',
                  description:
                    'Đã gửi lời mời kết bạn trước đó rồi ',
                });
              }
              else{
                setDataSocket(data)
                setScheckRender(data)
              }
          
              
            })
           return ()=>{
             socket.off('chatWS')
           }
          }

        }
        
      },[socket]) 


      useEffect(()=>{
        if(selectedChat.id){
          setLoadingSelectChat(true)
        }
        setTimeout(() => {
          setLoadingSelectChat(false)
        }, 3000);
      },[selectedChat.id]
     );

      const handleKeyPress = async (event: any) => {
        if (event.key === 'Enter') {
            if(chatSingleIdnew){
                if(socket){
                  
                      const sendThread={
                        messages:{
                            message:event.target.value
                          },
                          chatId:selectedChat.id, 
                          receiveId:selectedChat.user.id,
                        }
                         socket.emit('sendThread',sendThread)
                      }
                }

                if(!chatSingleIdnew){
                console.log(chatSingleIdnew)
                  if(socket){
                    const Threadcreate={
                      messages:{
                        message:event.target.value
                      },
                      receiveId:selectedChat.id,
                    }
                      socket.emit('createChat',Threadcreate)
                   }
                  }
            setwordChat(event.target.value)
            event.target.value = '';
            setLoadingsending(true)
            setInputValue('')
            socket.off('sendThread')
        }
      };

      const sendReqAddFriend=()=>{
        if(socket){
          if(chatSingleIdnew){
            const sendReqAddFriendHaveChat={
              receiveId:selectedChat.receiveId
              ,
              chatId:selectedChat.id
              ,
            }
            socket.emit('reqAddFriendHaveChat',sendReqAddFriendHaveChat)
          }
          else{
            if(!chatSingleIdnew){
              if(socket){
                const sendReqAddFriend={
                  receiveId:selectedChat.receiveId
                  ,
                }
                socket.emit('reqAddFriend',sendReqAddFriend)
              }

            }
           
          }
      
          notification["success"]({
            message: "Thông báo",
            description: "đã gửi yêu cầu kết bạn success",
          });
          
        }

        return socket.off("reqAddFriend")
      }

      const getSelectUserIsChoose = (selectedChat: any) => {
       
        return (
          <>
            <div className='flex justify-between w-full items-center p-1'>
                <div>
                    <div className='flex items-center'>
                    <p className='presspreveriose' ><MdKeyboardArrowLeft size={30} className='text-gray-600 cursor-pointer -mr-3' /></p>
                    {selectedChat&&
                    <div className='flex gap-3 bacgroundxe  items-center px-5'>
                        <img src={`${selectedChat.avatar?selectedChat.avatar:selectedChat.user.avatar}`} className='w-12 h-12 rounded-full' />
                        <div>
                        <p className='text-xl font-medium '>{selectedChat.name?selectedChat.name:selectedChat.user.name}</p>
                        <p style={{fontSize:'12px'}} className='bg-gray-400 border m-0 border-r-2 p-1 rounded-md text-white font-medium'>NGƯỜI LẠ </p>
                        </div>
                    </div>}
                    </div>
               
                </div>
              <div className='flex items-center '>
              <AiOutlineUserAdd size={20}/> <p className='bg-gray-200 border-r-gray-200 cursor-pointer font-medium p-1 rounded-md' onClick={()=>sendReqAddFriend()}>Gửi kết bạn</p>
              </div> 
            </div>
          </>
        )
      }

  return (
    <div className="flex flex-col h-screen bg-gray-300  relative">
    <div className='flex items-center h-16 w-full bg-white shadow-md'>
      {getSelectUserIsChoose(selectedChat)}
    </div>
    <div className='flex flex-col justify-end  flex-grow'>
   {loadingSelectChat ?<Spin indicator={antIcon}
        style={{ fontSize: '100px' }}
        className='text-black text-4xl m-auto justify-center self-center  ' /> :<div>
         <ScrollChatSingle Channelid={chatSingleIdnew} loadingsending={loadingsending} wordchat={wordchat}/>
      {/* {isTyPing?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
          <Input
                onChange={(e) => {setInputValue(e.target.value)}}
                onKeyPress={handleKeyPress}
                placeholder='Nhập @, tin nhắn mới ???'
                value={inputValue}
                className='rounded-none h-14 w-full  placeholder-gray-500 to-black'
              />
            </div>}
       
    </div>
  </div>
  )
}
