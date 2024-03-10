import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Input, Spin } from 'antd'
import { AiOutlineTags } from 'react-icons/ai'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { UserContext } from '../../../../../Context/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { UserGetChatsSingleById } from '../../../../../feature/chat/pathApi'
import { LoadingOutlined } from '@ant-design/icons';
import { ScrollChatSingle } from './ScrollChatSingle'
// import { ScrollChatSingle } from './ScrollChatSingle'
export const ChatSingleSend:FunctionComponent<any>=({selectedChat})=> {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
    const chatSingleId = useSelector((state: any) => state.Chats.chatSingleId)
    const dispatch = useDispatch();
    if(chatSingleId){
      console.log(chatSingleId)
    }
   
 
    const [inputValue, setInputValue] = useState('');
    
    const contextUser = useContext(UserContext)
    const { state } = contextUser
    const [user, setUser] = state.user
    const {socket}=state
    const [wordchat,setwordChat]=useState('')
    const [loadingSelectChat,setLoadingSelectChat]=useState(false)
    const [loadingsending,setLoadingsending]=useState(false);
    const [DataSocket,setDataSocket]=useState<any>(null)

    useEffect(()=>{
      if(selectedChat.id){
        dispatch<any>(UserGetChatsSingleById({ id: selectedChat.id }));
      }
   
    },[selectedChat.id,DataSocket])

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
     
      useEffect(() => {
        if(socket){
          socket.on("updatedSendThread",(data:any)=>{
            setDataSocket(data)
            setTimeout(()=>{
              setLoadingsending(false)
              setwordChat('')
            },3500)
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
        }, 3000);
      },[selectedChat.id]
     );

      const handleKeyPress = async (event: any) => {
        if (event.key === 'Enter') {
          console.log(123)
            const Thread={
              messages:{
                message:event.target.value
              },
              chatId:selectedChat.id, 
              receiveId:user.id,
            }

            console.log(Thread)
            // console.log(Thread)
            if(socket){
               socket.emit('sendThread',Thread)
            }
         
            setwordChat(event.target.value)
            event.target.value = '';
            setLoadingsending(true)
            setInputValue('')
            socket.off('sendThread')
        }
      };

      
  return (
  
    <div className="flex flex-col h-screen bg-gray-300  relative">
    <div className='flex items-center h-16 w-full bg-white shadow-md'>
      {getSelectUserIsChoose(selectedChat)}
    </div>
    <div className='flex flex-col justify-end  flex-grow'>
   {loadingSelectChat ?<Spin indicator={antIcon}
        style={{ fontSize: '100px' }}
        className='text-black text-4xl m-auto justify-center self-center  ' /> :<div>
         <ScrollChatSingle Channelid={chatSingleId} loadingsending={loadingsending} wordchat={wordchat}/>
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
