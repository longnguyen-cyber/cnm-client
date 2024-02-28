import { Input, Spin } from 'antd'
import React, { useContext, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import './GroupChat.css'
import { UserContext } from '../../../../../Context/UserContext';
export default function GroupChat() {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
    const UserContexts = useContext(UserContext);
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const [token, setToken] = state.token
  const { socket } = state
  const [selectedChat,setselectedChats]=state.selectedChat;
  console.log(selectedChat)
    const [inputValue, setInputValue] = useState('');
    const handleChangInputChatFocus=()=>{
       
      }

      const handleChangInputChatBlur=()=>{
       
      }

      const handleChange = (event:any) => {
       
      };
      const handleKeyPress = (event:any) => {
        if (event.key === 'Enter') {
          const Thread={
            messages:event.target.value,
            userId:user.id,
            // receiveId:'65a4ac2ccd6716d6b33286c5',
            channelId:selectedChat.id,
            // chatId:'65b0ccddaf9c3c58daa98515',
            
          }
       

          if(socket){
             socket.emit('sendThread',Thread)
          }
         
          event.target.value = '';
      }
    }


  return (
    <div className='contentGroupChat flex flex-grow justify-end  flex-col'>
    {<Spin indicator={antIcon} style={{ fontSize: '100px' }} className='justify-center m-auto'/>}
    {/* <ScrollAbleChat messages={messages}/> */}
    {/* {<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
                <Input
              onKeyPress={handleKeyPress}
              // onChange={handleChange}
              // onFocus={() => { handleChangInputChatFocus() }}
              placeholder='Nhập @, tin nhắn mới ???'
              // onBlur={() => { handleChangInputChatBlur() }}
              // value={inputValue}
              className='rounded-none h-14 w-full  placeholder-gray-500 to-black'
            />

</div>
  )
}
