import React, { useContext, useEffect, useState, useRef } from 'react'
import { notification, message } from 'antd'
import { AiOutlineTags, AiOutlineArrowLeft } from "react-icons/ai";
import { Form, Input } from 'antd';

import { MdKeyboardArrowLeft } from "react-icons/md";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import axios from 'axios';
import { UserContext } from '../../../../../Context/UserContext';
import { IUser } from '../../../../../Type';
import Banner from '../HomeRightReComent/Banner';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const ChatBox = () => {
  const UserContexts=useContext(UserContext);
  const {state}=UserContexts;
  const [user,setUser]=state.user;
  const [token,setToken]=state.token
  const {socket}=state
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const demoGroupChat={
    id: "1",
    chatName: "Group Chat",
    isGroupChat: true,
    select:false,
    users: [
      {
        id: "1",
        name: "User 1",
      },]
  }
  
  useEffect(()=>{
    setSelectedChat(demoGroupChat)
  },[])
  



  const handleChangInputChatFocus = () => {

  }

  const handleChangInputChatBlur = () => {
    if (socket) {

    }
  }

  const handleChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = async (event: any) => {
    
    
  };
  
 
  return (
    <div
      className='
            h-full w-full
            min-h-screen'
    >

 <div>
 {
 selectedChat? selectedChat.select ?
    <div className="flex flex-col h-screen bg-gray-400  relative">
      <div className='flex items-center h-16 w-full bg-white shadow-md'>
        <h1>Hien thi thôn tin User hoặc 1 group chat </h1>
        {/* {getSelectUserIsChoose(users, selectedChat)} */}
      </div>
      <div className='flex flex-col justify-end  flex-grow'>
        {loading ? <Spin indicator={antIcon}
          style={{ fontSize: '100px' }}
          className='text-black text-4xl m-auto justify-center self-center  ' /> :
          //  <ScrollAbleChat messages={messages}/>
          "day la noi dung chat"
        }


        {/* {isTyPing?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
        <Input
          onKeyPress={handleKeyPress}
          onChange={handleChange}
          onFocus={() => { handleChangInputChatFocus() }}
          placeholder='Nhập @, tin nhắn mới ???'
          onBlur={() => { handleChangInputChatBlur() }}
          value={inputValue}
          className='rounded-none h-14 w-full placeholder-gray-500'

        />
      </div>
    </div> :
    // selectedChat.isGroupChat ?
    //   <div>
    //     <div className="flex items-center p-1">
    //       <p className='presspreveriose' ><MdKeyboardArrowLeft onClick={() => {  }} size={30} className='text-gray-600 cursor-pointer -mr-3' /></p>
    //       <div className="flex-shrink-0 pl-4">


    //         <div className="flex flex-wrap w-10 justify-center  items-center">
    //           {/* {selectedChat.users.length > 0 && selectedChat.users.slice(0, 3).map((value: User, index: number) => <img className="w-5 h-5 rounded-full " src={`${value.pic}`} alt="Avatar 1" />)} */}
    //           <p className='rounded-full text-gray-500  flex items-center justify-center  bg-gray-300 w-5 h-5'>{selectedChat.users.length - 3}</p>
    //         </div>
    //       </div>
    //       <div className=" ml-4">
    //         <div className="flex items-center">
    //           <h4 className="text-lg font-medium">{selectedChat.chatName}</h4>
    //         </div>
    //         <AiOutlineTags color='gray' className='mt-1' />
    //       </div>
    //     </div>
    //     <div className='bg-gray-300'>
    //       {/* <GroupChat  /> */}
    //     </div>
    //   </div>
      
   <>
   <div className='flex flex-col  min-h-screen item-center justify-center'>
                  <Banner/>
                      </div>
   </>
   :""
}
</div>
    </div>
    

  )
}

export default ChatBox
