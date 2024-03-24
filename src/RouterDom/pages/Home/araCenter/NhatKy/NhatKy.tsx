import React, { useContext, useState } from 'react'
import { CiUser } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import '../NhatKy/Nhatky.css'
import { UserContext } from '../../../../../Context/UserContext';


export default function NhatKy() {
    const [activeIndex, setActiveIndex] = useState(0);
    const UserContexts = useContext(UserContext);
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const { socket } = state
    const [selectedChat, setselectedChats] = state.selectedChat;
    const handleItemClick = (index:any) => {
        setActiveIndex(index);

        // Cập nhật state khi phần tử được click
      };
      const handleItemClick3=(index:any)=>{
        setActiveIndex(index);
        setselectedChats('ketban')
      }
    
  return (
    <div className='mt-4 flex flex-col gap-8'>
    <p
      className={`flex items-end gap-5 cursor-pointer ${activeIndex === 0 ? 'active' : ''}`}
      onClick={() => handleItemClick(0)}
    >
      <CiUser size={24} color='rgb(8, 28, 54)' />Danh sách nhóm 
    </p>
    <p
      className={`flex items-end gap-5 cursor-pointer ${activeIndex === 1 ? 'active' : ''}`}
      onClick={() => handleItemClick(1)}
    >
      <FaUserFriends size={24} color='rgb(8, 28, 54)' />Danh sách bạn bè
    </p>
    <p
      className={`flex items-end gap-5 cursor-pointer ${activeIndex === 2 ? 'active' : ''}`}
      onClick={() => handleItemClick3(2)}
    >
      <SlEnvolopeLetter size={24} color='rgb(8, 28, 54)' />Lời mời kết bạn
    </p>
  </div>

  )
}
