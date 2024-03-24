import React, { useContext, useEffect, useState } from 'react'
import { SlEnvolopeLetter } from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux'
import "../InviteFriend/InviteFriend.css"
import { UserContext } from '../../../../../Context/UserContext'
import { Spin, notification } from 'antd'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { UserGetAllSingleChat } from '../../../../../feature/chat/pathApi'
export default function InviteFriend() {
    const ListSingleChat=useSelector((state:any)=>state.Chats.chatSingleSlide)
    const dispatch=useDispatch()
    const [LoadingSingle,setLoadingSingle]=useState<any>(false)
  
    const UserContexts = useContext(UserContext);
    const { state } = UserContexts;
    const [user, setUser] = state.user;
    const { socket } = state
      const [selectedChat, setselectedChats] = state.selectedChat;
      const [checkRender,setScheckRender]=state.checkRender
     const [dataSocket,setDataSocket]=useState<any>(null)
   

   
    useEffect(()=>{
        if(socket){
            socket.emit("chatWS",(data:any)=>{
                console.log(data,"data")
              
                console.log("day la data socket")
                setLoadingSingle(false)
                setDataSocket(data)
                setScheckRender(data)
            })
        }
    },[])

    useEffect(()=>{
        dispatch<any>(UserGetAllSingleChat())
    },[checkRender,dataSocket])

    const AcceptChat=(item:any)=>{
        setLoadingSingle(true)
        if(socket){
          socket.emit('acceptAddFriend',{chatId:item.id,receiveId:item.receiveId})
          console.log(item.id,item.receiveId)
          notification['success']({
            message: 'Thông báo',
            description:
              'Bạn đã đồng ý kết bạn với người này',
          });
        }
    }
   
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

      
       {ListSingleChat&&ListSingleChat.map((item:any,index:any)=>{
        if(item.requestAdd===true&&item.isFriend===false){
            return(
                <div>
                <div className='flex flex-col shadow-md border gap-3  p-3 border-b-2'>
                    <div className='flex items-center gap-4'>
                    <img src={item.user.avatar} className='w-12 h-12 rounded-full' />
                    <p className='text-xl font-medium'>{item.user.name}</p>
                    </div>
                   
                    <div>
                       
                        <p style={{fontSize:'16px'}} className=' border m-0 border-r-2 p-1 rounded-md text-black '>
                            Xinh chào minh tên là {item.user.name} tôi muốn kết bạn với bạn
                        </p>
                    </div>
                    <div className='m-auto'>
                        <button className='bg-gray-200  text-black p-2 rounded-md mr-5' onClick={()=>AcceptChat(item)}>
                        {item.senderId===user.id?<div className='flex'> <p className='bg-gray-200 border-r-gray-200 cursor-pointer font-medium p-1 rounded-md'>{LoadingSingle&&<Spin style={{color:"gray"}}/>}  Đồng ý</p></div>:<button className='w-full  text-black'> Thu hồi lời mời </button>}
                         </button>
                        {item.senderId===user.id&&<button className='bg-red-500 text-white p-2 rounded-md'>Từ chối</button>}
                    </div>

                  
                </div>    
            </div>

            )
          
        }
       })}
        </div>

        <div>

        </div>
    </div>
  )
}
