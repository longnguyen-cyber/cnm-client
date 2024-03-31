import React, { useContext, useEffect, useState } from 'react'
import { SlEnvolopeLetter } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'

import "../InviteFriend/InviteFriend.css"

import { UserContext } from '../../../../../Context/UserContext'
import { Spin, notification } from 'antd'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { LoadingOutlined } from '@ant-design/icons';
import { UserGetAllSingleChat } from '../../../../../feature/chat/pathApi'
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export default function InviteFriend() {
    var ListSingleChat=useSelector((state:any)=>state.Chats.chatSingleSlide)
    console.log(ListSingleChat)
    const dispatch=useDispatch()
    const [LoadingSingle,setLoadingSingle]=useState<any>(false)
    const UserContexts = useContext(UserContext);
    const { state } = UserContexts;
    const [user, setUser] = state.user;
    const { socket } = state
      const [selectedChat, setselectedChats] = state.selectedChat;
      const [checkRender,setScheckRender]=state.checkRender
      console.log(selectedChat)
     const [dataSocket,setDataSocket]=useState<any>(null)
    useEffect(()=>{
        if(socket){
            socket.on("chatWS",(data:any)=>{     
                console.log('chatWS')
                console.log(data)
                console.log(data.message) 
                         
                    if(data.message==="Request friend success"){
                        setDataSocket(data.data.user)
                        setScheckRender(false)
                    }
                    else if(data.message==="Accept friend success"){
                        console.log("Accept friend success")
                        console.log(data.data.chat) 
                        dispatch<any>(UserGetAllSingleChat())
                      ListSingleChat.map((value: any) => {
                            if (value.id === data.data.chat.id) {
                              // Tạo một bản sao của đối tượng và cập nhật thuộc tính
                              setselectedChats({ ...value, isFriend: true ,requestAdd:false});
                              
                           
                            }
                            // Trả về đối tượng không thay đổi nếu không đáp ứng điều kiện
                          });
                        setDataSocket(data.user)
                    }
            })
        }
    },[socket])

    useEffect(()=>{
        dispatch<any>(UserGetAllSingleChat())
    },[dataSocket])

    const AcceptChat=(item:any)=>{
        setLoadingSingle(true)
        if(socket){
          socket.emit('acceptAddFriend',{chatId:item.id,receiveId:item.receiveId})
          console.log(item.id,item.receiveId)
          notification['success']({
            message: 'Thông báo',
            description:
              'đồng ý kết bạn với người này',
          });
        }
    }
    const RevokeRequest=(value:any)=>{}
   
  return (
    <div>
        <div className='p-5 border-b-2'>
        <p
      className={`flex items-end gap-5 cursor-pointer`}
       >
      <SlEnvolopeLetter size={24} color='rgb(8, 28, 54)' />Lời mời kết bạn 
      </p>

       </div>
       <div  className='rqFriend p-5'>

      
       {ListSingleChat && ListSingleChat.map((item:any, index:any) => {
  // Determine if the current user is the sender
  const isSender = user.id=== item.
  receiveId
  ;
  
  if(item.requestAdd === true && item.isFriend === false&&item.user) {
    return (
      <div>
        <div className='flex flex-col shadow-md border gap-3 p-3 border-b-2'>
          <div className='flex items-center gap-4'>
            <img src={item.user&&item.user.avatar?item.user.avatar:""} className='w-12 h-12 rounded-full' />
            <p className='text-xl font-medium'>{item.user.name}</p>
          </div>
          <div>
            <p style={{fontSize: '16px'}} className='border m-0 border-r-2 p-1 rounded-md text-black'>
              Xin chào, tên tôi là {item.user.name}. Tôi muốn kết bạn với bạn.
            </p>
          </div>
          <div className='m-auto'>
            {isSender ? (
              // Show "Revoke" button for the sender
              <button className='w-full text-black bg-gray-200 p-2 rounded-md' onClick={() => RevokeRequest(item)}>
                Thu hồi lời mời
              </button>
            ) : (
              // Show "Accept" and "Decline" buttons for the receiver
              <>
                <button className='bg-gray-200 text-black p-2 rounded-md mr-5' onClick={() => AcceptChat(item)}>
                  Đồng ý
                </button>
                <button className='bg-red-500 text-white p-2 rounded-md'>
                  Từ chối
                </button>
              </>
            )}
          </div>
        </div>    
      </div>
    );
  }
})}

        </div>

        <div>

        </div>
    </div>
  )
}
