import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { ScrollChatSingle } from './ScrollChatSingle'
import { Input, Spin, notification } from 'antd'

import { AiOutlineTags } from 'react-icons/ai'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import { UserContext } from '../../../../../Context/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { UserGetAllSingleChat, UserGetChatsSingleById } from '../../../../../feature/chat/pathApi'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineUserAdd } from "react-icons/ai";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Upload, Image, message } from "antd";
import UserApi from "../../../../../api/user";
import AudioRecorderComponent from "./AudioRecorderComponent";
import { MdAttachFile } from "react-icons/md";
export const ChaxBoxNoMustFriend:FunctionComponent<any>=({selectedChat,setselectedChats})=> {
  var ListSingleChat=useSelector((state:any)=>state.Chats.chatSingleSlide)
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
    const [chatSingleIdnew,setChatSingleIdNew]=useState<any>(null)
    const [chatReject,setChatReject]=state.chatReject
    const [openImage, setOpenImage] = useState(false);
    const [imageUpload, setImageUpload] = useState<any>([]);
    console.log(chatSingleIdnew);
  

    
    useEffect(()=>{
     
     async function getData(){
    
      if(selectedChat){
        const data=await dispatch<any>(UserGetChatsSingleById({ id: selectedChat.id }));
        // console.log("day la data check")
        // console.log(data)
        if(data.error){
          setChatSingleIdNew(null)
        }
        
        if(data&&data.payload&&data.payload.data){
          setChatSingleIdNew(data.payload.data)
        }
      }
    }
     getData()
    },[selectedChat])
    
    useEffect(()=>{
      if(socket){
        socket.on("updatedSendThread",(data:any)=>{
          if (data.typeMsg === "recall") {
            if (
              chatSingleIdnew &&
              typeof chatSingleIdnew === "object" &&
              chatSingleIdnew !== null
            ) {
              const threadschat = chatSingleIdnew.threads;
              const index = threadschat.findIndex(
                (item: any) => item.stoneId === data.stoneId
              );
              if (index !== 0) {
                const newThreadschatItem = {
                  ...threadschat[index],
                  messages: {
                    ...threadschat[index].messages,
                    message: "Tin nhắn đã bị thu hồi",
                  },
                };
                const newTheardupdate = [
                  ...threadschat.slice(0, index),
                  newThreadschatItem,
                  ...threadschat.slice(index + 1),
                ];
                setChatSingleIdNew({
                  ...chatSingleIdnew,
                  threads: newTheardupdate,
                });
              }
              // Tiếp tục xử lý với newThreads
            }
          } else if (data.typeEmoji === "add") {
           
          } else {
            if (data && chatSingleIdnew) {
              const newThreads = [...chatSingleIdnew.threads, data];
              setChatSingleIdNew({ ...chatSingleIdnew, threads: newThreads });
              setwordChat("")
              setLoadingsending(false)
            }
          }
          
        })
      }

    },[socket,chatSingleIdnew])

    ///khi tao chat 
    useEffect(() => {
      if(socket){
        socket.on("chatWS",async(payload:any)=>{
          const {data}=payload
          if(data){
            if(data.id){
              if(!chatSingleIdnew){
                const datachatbyid = await dispatch<any>(UserGetChatsSingleById({ id: data.id}));
                if(datachatbyid){
                     setChatSingleIdNew(datachatbyid.payload.data)
                 }
              setLoadingsending(false)
              setwordChat("")
              }
              
            }
          }
          if(payload.message==="Accept friend success"){    
            const userId=await (UserApi.getUserById(payload.data.chat.
              receiveId
              ));
              
             if(userId){
              const datachatbyid = await dispatch<any>(UserGetChatsSingleById({ id: payload.data.chat.id}));
              if(datachatbyid){
                   setChatSingleIdNew(datachatbyid.payload.data)
               }
              
              setselectedChats({...payload.data.chat, isFriend: true ,requestAdd:false,user:{...userId.data}});
             }
           
        }

         
       

        if(payload&&payload.message==='Unrequest friend success'){
         
          setselectedChats({ ...selectedChat, isFriend: false ,requestAdd:false});

        }
         if(payload&&payload.message==='Đã gửi lời mời kết bạn'){
          notification['error']({
            message:'Thông báo',
            description:'Bạn  Đã gửi lời mời kết bạn với người này rồi '
          })
        }

        if(payload&&payload.message==='Request friend success'){
          setselectedChats({...payload.data.chat,user:{...selectedChat}});
        }
        if(payload&&payload.message==="Reject friend success"){
      
          const userId=await (UserApi.getUserById(payload.data.chat.
            receiveId
            ));

     
            
          
          setselectedChats(userId.data)
        
            }
        })
       return ()=>{
         socket.off('chatWS')
       }
      }
    },[socket])


    useEffect(()=>{
      dispatch<any>(UserGetAllSingleChat())
  },[DataSocket])
   
      useEffect(()=>{
        if(selectedChat.id){
          setLoadingSelectChat(true)
        }
        setTimeout(() => {
          setLoadingSelectChat(false)
        }, 4000);
      },[selectedChat.id]
     );

      const handleKeyPress = async (event: any) => {
        if (event.key === 'Enter') {
            if(chatSingleIdnew){
                if(socket){
                  if(imageUpload)
                    {
                      const sendThread={
                        messages:{
                            message:event.target.value
                          },
                          chatId:chatSingleIdnew.id, 
                          receiveId:chatSingleIdnew.user.id,
                          fileCreateDto: imageUpload,
                        }
                     
                      socket.emit("sendThread", sendThread);
                      setOpenImage(false);
                      setImageUpload(null);

                    }
                    else{
                      const sendThread={
                        messages:{
                            message:event.target.value
                          },
                          chatId:chatSingleIdnew.id, 
                          receiveId:chatSingleIdnew.user.id,
                        }
                        socket.emit('sendThread',sendThread)
                    }
                    
                      }
                }

                if(!chatSingleIdnew){
            
                  if(socket){
                    if(imageUpload){
                      const Threadcreate={
                        messages:{
                          message:event.target.value
                        },
                        receiveId:selectedChat.id,
                        fileCreateDto: imageUpload,
                      }
                      socket.emit('createChat',Threadcreate)
                      setOpenImage(false);
                      setImageUpload(null);
                    }
                    else{
                      const Threadcreate={
                        messages:{
                          message:event.target.value
                        },
                        receiveId:selectedChat.id,
                      }
                      
                      socket.emit('createChat',Threadcreate)
                     }
                    }
                   
                    
                   
                   
                  }
            setwordChat(event.target.value)
            event.target.value = '';
            // setLoadingsending(true)
            setInputValue('')
            socket.off('sendThread')
        }
      };

      const beforeUploaddoc = async (file:any) => {
        const formData = new FormData();
        formData.append("files", file); // Use "files" if your server uses AnyFilesInterceptor()
    
        try {
          const response = await UserApi.userUploadImage(formData);
          const { data } = response;
          if (data) {
            // Handle successful upload here
            const Thread = {
              chatId: selectedChat.id,
              receiveId: selectedChat.user.id,
              fileCreateDto: data,
            };
            if (socket) {
              socket.emit("sendThread", Thread);
            }
          }
        } catch (error) {
          // Handle upload error here
          console.error("Upload failed:", error);
        }
      };

      const sendReqAddFriend=()=>{
    
        if(socket){
          if(chatSingleIdnew){
            
            const sendReqAddFriendHaveChat={
              receiveId:chatSingleIdnew.receiveId
              ,
              chatId:chatSingleIdnew.id
              ,
            }
            notification['success']({
              message:'Thông báo',
              description:'Đã gửi lời mời kết bạn'
            })
            console.log('sendReqAddFriendHaveChat')
            
            socket.emit('reqAddFriendHaveChat',sendReqAddFriendHaveChat)
          }
          else{
            if(!chatSingleIdnew||chatSingleIdnew===null){
              if(socket){
                const sendReqAddFriend={
                  receiveId:selectedChat.id
                  ,
                }
                console.log(sendReqAddFriend)
                 socket.emit('reqAddFriend',sendReqAddFriend)
              }

              notification['success']({
                message:'Thông báo',
                description:'Đã gửi lời mời kết bạn'
              })
            }
          }
        }

        return socket.off("reqAddFriend")
      }

      const cancelFriend=(selectedChat:any)=>{
   
        if(selectedChat&&selectedChat.id){
          if(socket){
            const cancelFriend={
              chatId:selectedChat.id
              ,
            }
         
            socket.emit('unReqAddFriend',cancelFriend)
            notification['success']({
              message:'Thông báo',
              description:'Đã huỷ lời mời kết bạn'
            })
          }
        }

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
                        <img src={selectedChat && selectedChat.user ? selectedChat.user.avatar : (selectedChat && selectedChat.avatar ? selectedChat.avatar : "")} className='w-12 h-12 rounded-full' />
                        <div>
                        <p className='text-xl font-medium '>{selectedChat&&selectedChat.name?selectedChat.name:selectedChat.user.name}</p>
                        <p style={{fontSize:'12px'}} className='bg-gray-400 border m-0 border-r-2 p-1 rounded-md text-white font-medium'> {selectedChat&&selectedChat.isFriend?<>Bạn bè </>:<>Người Lạ  </>} </p>
                        </div>
                    </div>}
                    </div>
               
                </div>
              <div className='flex items-center '>
              <AiOutlineUserAdd size={20}/> <p className='bg-gray-200 border-r-gray-200 cursor-pointer font-medium p-1 rounded-md'> {selectedChat&&selectedChat.
               requestAdd===true&&selectedChat.isFriend===false?<p onClick={()=>cancelFriend(selectedChat)}>Huỷ kết bạn  </p>:<p  onClick={()=>sendReqAddFriend()}>Gửi kết bạn </p>}</p>
              </div> 
            </div>
          </>
        )
      }

      const beforeUpload = async (file: any) => {
        const formData = new FormData();
        formData.append("files", file); // Chú ý là "files" nếu server dùng AnyFilesInterceptor()
    
        try {
          const response = await UserApi.userUploadImage(formData);
    
          const { data } = response;
          if (data) {
            setImageUpload(data);
            setOpenImage(true);
          }
        } catch (error) {
          console.error(error);
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
         <ScrollChatSingle Channelid={chatSingleIdnew} loadingsending={loadingsending} wordchat={wordchat}/>
      {/* {isTyPing?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
      <div className="flex">
              <Input
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Nhập @, tin nhắn mới ???"
                value={inputValue}
                className="rounded-none h-14 w-full relative inputparant  placeholder-gray-500 to-black"
              />

              <div className=" right-0 flex   absolute gap-1">
              <Upload
                beforeUpload={beforeUpload}
                className="cursor-pointer  h-36 "
                fileList={[]}
                name="avatar"
                accept=".jpg, .jpeg, .png"
              
                // listType="listTyp"
              >
                <Button
                  icon={<CameraOutlined />}
                  type="dashed"
                  className="h-16"
                  // loading={loading}
                >
               
                </Button>
              </Upload>

              <Upload
                    beforeUpload={beforeUploaddoc}
                    className="cursor-pointer h-36"
                    fileList={[]}
                    accept=".pdf,.doc,.docx" // Accept PDF, Word (.doc, .docx) files
                    name="files"
                  >
                    <Button icon={<MdAttachFile />} type="dashed" className="h-16">
                     
                    </Button>
                </Upload>


              <AudioRecorderComponent className="" selectedChat={selectedChat}/>

              

              
              </div>
             
            </div>
            </div>
            }
        {imageUpload && openImage && (
          <div className="bg-white w-full">
            <p className="font-medium mt-4 mb-4">1 ảnh </p>
            <img
              src={`${
                imageUpload && imageUpload[0] ? imageUpload[0].path : ""
              }`}
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}
    </div>
  </div>
  )
}
