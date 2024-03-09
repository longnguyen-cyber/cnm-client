import { Input, Spin } from 'antd'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import './GroupChat.css'
import { UserContext } from '../../../../../Context/UserContext';
import {ScrollChat} from './ScrollChat';
export const  GroupChat:FunctionComponent<any>=({loading,Channelid,submitChatSuccess})=> {
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  const UserContexts = useContext(UserContext);
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const { socket } = state
  const [token, setToken] = state.token
  const [selectedChat,setselectedChats]=state.selectedChat;
  const [loadingsending,setLoadingsending]=useState(false);
  const [inputValue, setInputValue] = useState('');
  const [wordchat,setwordChat]=useState('')
  const [loadingSelectChat,setLoadingSelectChat]=useState(false)

    useEffect(() => {
      if(socket){
        socket.on("updatedSendThread",(data:any)=>{
          submitChatSuccess(data);
          console.log(data)
          setTimeout(()=>{
            setLoadingsending(false)
            setwordChat('')
          },2000)
        })
       return ()=>{
         socket.off('updatedSendThread')
       }
      }
    },[]) 
    useEffect(()=>{
      if(selectedChat.id){
        setLoadingSelectChat(true)
      }
      setTimeout(() => {
        setLoadingSelectChat(false)
      }, 2800);
    },[selectedChat.id])

   
      const handleKeyPress = (event:any) => {
        if (event.key === 'Enter') {
          const Thread={
            messages:{
              message:event.target.value
            },
            userId:user.id,
            channelId:selectedChat.id,      
            // token:token
          }
          if(socket){
             socket.emit('sendThread',Thread)
          }
          setwordChat(event.target.value)
          event.target.value = '';
          setLoadingsending(true)
          setInputValue('')
      }
    }
  return (
    <>
   
      <div>
      {
       <div className='contentGroupChat flex flex-grow justify-end  flex-col'>
        {loadingSelectChat?<Spin indicator={antIcon} style={{ fontSize: '100px' }} className='justify-center m-auto'/>:<>
        <ScrollChat Channelid={Channelid} loadingsending={loadingsending} wordchat={wordchat}/>
      {/* {<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
                  <Input
                onChange={(e) => {setInputValue(e.target.value)}}
                onKeyPress={handleKeyPress}
                placeholder='Nhập @, tin nhắn mới ???'
                value={inputValue}
                className='rounded-none h-14 w-full  placeholder-gray-500 to-black'
              />
        </>}
  
  </div>}
  </div>
   
    </>
   
  )
}
