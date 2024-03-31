import { Input, Spin } from 'antd'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import './GroupChat.css'
import { UserContext } from '../../../../../Context/UserContext';
import {ScrollChat} from './ScrollChat';
import { useDispatch, useSelector } from 'react-redux';
import { UserGetChannelById } from '../../../../../feature/chat/pathApi';
import UserApi from '../../../../../api/user';
export const  GroupChat:FunctionComponent<any>=({})=> {
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  const Channelid = useSelector((state: any) => state.Chats.channelId)
  const dispatch = useDispatch();
  const UserContexts = useContext(UserContext);
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const { socket } = state
  const [selectedChat,setselectedChats]=state.selectedChat;
  const [loadingsending,setLoadingsending]=useState(false);
  const [inputValue, setInputValue] = useState('');
  const [DataSocket,setDataSocket]=useState<any>(null)
  const [wordchat,setwordChat]=useState('')
  const [loadingSelectChat,setLoadingSelectChat]=useState(false)
  const [channelIdNew, setChatSingleIdNew] = useState<{ threads: any[] }>({ threads: [] });
  const [typing,setTyping]=useState(false)


  useEffect(() => {
     async function  GetChannelById(){
      if (selectedChat.id) {
        const dataChannels = await UserApi.UserGetChannelById({ id: selectedChat.id });
        if (dataChannels) {
          setChatSingleIdNew(dataChannels.data)
        }
      }
    }
    GetChannelById();
  }, [selectedChat.id]);

  useEffect(()=>{
    if(socket){
      socket.on('sendObjectArrayForThread',(data:any)=>{
        if(data){
          console.log(data)
          const newThreads = [...channelIdNew.threads, data];
            setChatSingleIdNew({ ...channelIdNew, threads: newThreads });
        }
      })
    }
  },[socket,channelIdNew])
    useEffect(() => {
      if(socket){
        socket.on("updatedSendThread",(data:any)=>{
          if(data){
         
            // setDataSocket(data)
          }
        
          // setTimeout(()=>{
          //   setLoadingsending(false)
          //   setwordChat('')
          // },2000)
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
      }, 5500);
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
         
          const dataPush={
            channelId:selectedChat.id,
            senderId:user.id,
            messages:{
              message:event.target.value
            },
            user
          }
          if(socket){
            socket.emit('sendObjectArrayForThread',dataPush)
          }
          if(socket){
             socket.emit('sendThread',Thread)
          }
          // setwordChat(event.target.value)
          event.target.value = '';
          setLoadingsending(true)
          setInputValue('')
      }
    }
  
    const handleChangledata=(e:any)=>{
      setInputValue(e.target.value)
      if(socket){
        socket.emit('typing',(e.target.value))
        console.log('vao day')
      }

      
       
    }

  return (
    <>
   
      <div>
      {
       <div className='contentGroupChat flex flex-grow justify-end  flex-col'>
        {loadingSelectChat?<Spin indicator={antIcon} style={{ fontSize: '100px' }} className='justify-center m-auto'/>:<>
        <ScrollChat Channelid={channelIdNew} loadingsending={loadingsending} wordchat={wordchat}/>
      {/* {<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
                  <Input
                onChange={(e) => {handleChangledata(e)}}
                onKeyPress={handleKeyPress}
                onBlur={()=>{}}
               
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
