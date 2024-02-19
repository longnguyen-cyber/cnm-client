import { Input, Spin } from 'antd'
import React, { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import './GroupChat.css'
export default function GroupChat() {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
    const [inputValue, setInputValue] = useState('');
    const handleChangInputChatFocus=()=>{
       
      }

      const handleChangInputChatBlur=()=>{
       
      }

      const handleChange = (event:any) => {
       
      };
      const handleKeyPress= async(event:any)=>{
       
      }


  return (
    <div className='contentGroupChat flex flex-grow justify-end  flex-col'>
    {<Spin indicator={antIcon} style={{ fontSize: '100px' }} className='justify-center m-auto'/>}
    {/* <ScrollAbleChat messages={messages}/> */}
    {/* {<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
      <Input
                        onKeyPress={handleKeyPress}
                        onChange={handleChange}
                        onFocus={()=>{handleChangInputChatFocus()}}
                        placeholder='Nhập @, tin nhắn mới ???'
                        onBlur={()=>{handleChangInputChatBlur()}}
                        value={inputValue}
                        className='rounded-none h-14 w-full placeholder-gray-500'
                      
                        />

</div>
  )
}
