import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { ScrollChatSingle } from './ScrollChatSingle'
import { Input, Modal, Spin, notification } from 'antd'

import { AiOutlineTags } from 'react-icons/ai'
import { MdClose, MdKeyboardArrowLeft } from 'react-icons/md'
import { UserContext } from '../../../../../Context/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { UserGetAllSingleChat, UserGetChatsSingleById ,UserGetChatsSingleByIdCatche} from '../../../../../feature/chat/pathApi'
import { LoadingOutlined } from '@ant-design/icons';
import { AiOutlineUserAdd } from "react-icons/ai";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Upload, Image, message } from "antd";
import UserApi from "../../../../../api/user";
import AudioRecorderComponent from "./AudioRecorderComponent";
import { MdAttachFile } from "react-icons/md";
import { RcFile } from 'antd/es/upload'
import { CiVideoOn } from 'react-icons/ci'

export const ChaxBoxNoMustFriend:FunctionComponent<any>=({selectedChat,setselectedChats})=> {
  var ListSingleChat=useSelector((state:any)=>state.Chats.chatSingleSlide)
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
 
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
    const [openImage, setOpenImage] = useState(false);
    const [imageUpload, setImageUpload] = useState<any>([]);
    const [loadingvidieo, setLoadingVideo] = useState(false)

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
    useEffect(() => {
  
      const handleUpdateSendThread = (data: any) => {
        if (data.typeMsg === 'recall'&&data.type === 'chat') {
          const index = chatSingleIdnew.threads.findIndex((item: any) => item.stoneId === data.stoneId)
          if (index !== -1) {
            const newThreads = [...chatSingleIdnew.threads]
            newThreads[index].messages
              = { ...newThreads[index].messages, message: 'Tin nhắn đã được thu hồi' }
            console.log('newThreads', newThreads)
            setChatSingleIdNew({ ...chatSingleIdnew, threads: newThreads })
            return
          }
          // setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
          return
            // Tiếp tục xử lý với newThreads
          }
        
        
        else if (data.typeMsg === 'delete') {
          if (
            chatSingleIdnew &&
            typeof chatSingleIdnew === 'object' &&
            chatSingleIdnew !== null
          ) {
            const threadschat = chatSingleIdnew.threads
            const index = threadschat.findIndex(
              (item: any) => item.stoneId === data.stoneId
            )
            if (index !== 0) {
              const newThreadschatItem = {
                ...threadschat[index],
                messages: {
                  ...threadschat[index]?.messages,
                  message: 'Tin nhắn đã bị xóa',
                },
              }
              const newTheardupdate = [
                ...threadschat.slice(0, index),
                newThreadschatItem,
                ...threadschat.slice(index + 1),
              ]
              setChatSingleIdNew({
                ...chatSingleIdnew,
                threads: newTheardupdate,
              })
            }
            // Tiếp tục xử lý với newThreads
          }
        }
        else if (data.typeEmoji === 'add') {
  
        } 
        
        else {
          if (data && chatSingleIdnew) {
            console.log('data sendthread', data)
            
            if(data.chatId===chatSingleIdnew.id){
              const dataNew = { ...data, emojis: [] }
              const newThreads = [...chatSingleIdnew.threads, dataNew]
              setChatSingleIdNew({ ...chatSingleIdnew, threads: newThreads })
              setwordChat('')
              setLoadingsending(false)
  
            }
          }
        }
      }
  
  
  
  
      ////updatedEmojiThread
      const handleupdatedEmojiThread = (data: any) => {
        console.log('data emoji chat');
        console.log(data);
        if (data && data.type === 'chat' && data.typeEmoji === 'add') {
          console.log('data emoji add');
          console.log(data);
          const index = chatSingleIdnew.threads.findIndex((item: any) => item.stoneId === data.stoneId);
          console.log('data emoji index');
          console.log(index);
          if (index !== -1) {
            //cần tạo một đối tượng mới để không thay đổi trực tiếp state
            const newThreads = [...chatSingleIdnew.threads];
            newThreads[index] = {
              ...newThreads[index],
              emojis: [...newThreads[index].emojis, data]
            };
            setChatSingleIdNew({ ...chatSingleIdnew, threads: newThreads });
            return;
          }
        }
      }
      const handDataChatWs = async (response: any) => {
        if(response.message==='Người dùng đã chặn nhận tin nhắn từ người lạ'){
          setwordChat('')
          notification['error']({
            message:'Thông báo',
            description:'Người dùng đã chặn nhận tin nhắn từ người lạ'
          })
        }

      }
      
      
      
  
  
  
      socket?.on('updatedSendThread',handleUpdateSendThread)
  
      socket?.on('updatedEmojiThread',handleupdatedEmojiThread)
      socket?.on('chatWS', handDataChatWs)
      return () => {
        socket?.off('updatedSendThread',handleUpdateSendThread)
        socket?.off('updatedEmojiThread',handleupdatedEmojiThread)
      }
    }, [socket, chatSingleIdnew])
    

    ///khi tao chat 
    useEffect(() => {
      if(socket){
        socket?.on("chatWS",async(payload:any)=>{
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
            const userId=await (UserApi.getUserById(payload.data.chat.receiveId));
            console.log('userId')
            console.log(userId)
              
             if(userId){
              const datachatbyid = await dispatch<any>(UserGetChatsSingleById({ id: payload.data.chat.id}));
              console.log('datachatbyid')
              console.log(datachatbyid)
              
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
         socket?.off('chatWS')
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
          console.log('vao day')

            if(chatSingleIdnew){
              console.log('vao day 1')
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
                  console.log('vao day 2')
                  console.log(socket)
            
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
                      console.log('Threadcreate',Threadcreate)
                      
                      socket.emit('createChat',Threadcreate)
                     }
                    }
                   
                  }
            setwordChat(event.target.value)
            event.target.value = '';
            // setLoadingsending(true)
            setInputValue('')
            socket?.off('sendThread')
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

        return socket?.off("reqAddFriend")
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

      const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
        const formData = new FormData()
        fileList.forEach(file => {
          formData.append('files', file);
          console.log('File', file);
        }); // Chú ý là "files" nếu server dùng AnyFilesInterceptor()
    
        try {
          const response = await UserApi.userUploadImage(formData)
    
          const { data } = response
          if (data) {
            setImageUpload(data)
            setOpenImage(true)
          }
        } catch (error) {
          console.error(error)
        }
      }

      const beforeUploaddoc = async (file: any) => {
        const formData = new FormData()
        formData.append('files', file) // Use "files" if your server uses AnyFilesInterceptor()
    
        try {
          const response = await UserApi.userUploadImage(formData)
          const { data } = response
          if (data) {
            // Handle successful upload here
            const Thread = {
              chatId: selectedChat.id,
              receiveId: selectedChat.user.id,
              fileCreateDto: data,
            }
            if (socket) {
              socket.emit('sendThread', Thread)
            }
          }
        } catch (error) {
          // Handle upload error here
          console.error('Upload failed:', error)
        }
      }
      const beforeUploadvideo = async (file: RcFile, fileList: RcFile[]) => {
        setLoadingVideo(true)
        try {
          const formData = new FormData();
          fileList.forEach(file => {
            formData.append('files', file);
            console.log('File', file);
          });
    
          // Gửi FormData chứa tất cả các tệp đến server để xử lý
          const response = await UserApi.userUploadImage(formData); // Modify API endpoint for video uploads
          const { data } = response;
          console.log('data tra ve sau khi upload');
          console.log(data);
          const Thread = {
            chatId: selectedChat.id,
            userId: user.id,
            senderId: user.id,
            fileCreateDto: data,
          
          }
          if (data) {
            // Xử lý sau khi tải lên thành công
            socket.emit('sendThread', Thread)
            setLoadingVideo(false)
          }
    
    
        } catch (error) {
          console.error(error);
        }
    
        return false; // Trả về false để ngăn chặn Upload component tự động tải lên tệp
      };
      const modalLoadingvideo = () => {

        return (
    
    
    
          <Modal className=' mt-80 flex justify-center w-28 h-20 items-center' title="" open={loadingvidieo}>
            <p className='mt-14'>Đang upload video ....</p>
            <Spin indicator={antIcon} style={{ fontSize: '100px', marginTop: '-70px' }} className=' ml-14' />
          </Modal>
        )
      }
      const removeValueUploade = (value: any) => {
        const newValue = imageUpload.filter((item: any) => item.path !== value.path)
        setImageUpload(newValue)
      }

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
                    beforeUpload={beforeUploadvideo}
                    className="cursor-pointer mt-3"
                    fileList={[]} // fileList không có giá trị, hình ảnh sẽ không được hiển thị trước khi tải lên
                    name="video"
                    accept=".mp4, .avi, .mov" // Accept video formats (modify as needed)
                    multiple // Cho phép người dùng chọn nhiều video
                  >
                    <Button icon={<CiVideoOn size={20} />} className="border-none"></Button>
                  </Upload>


              <Upload
                    beforeUpload={beforeUpload}
                    className="cursor-pointer mt-3"
                    fileList={[]} // fileList không có giá trị, hình ảnh sẽ không được hiển thị trước khi tải lên
                    name="avatar"
                    accept=".jpg, .jpeg, .png"

                    multiple // Cho phép người dùng chọn nhiều hình ảnh
                  >
                    <Button icon={<CameraOutlined />} className="border-none"></Button>
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
                <p className="font-medium mt-4 mb-4">{imageUpload.length} ảnh </p>
                <div className='flex gap-2 '>

                  {imageUpload.map((value: any, index: number) => (
                    <div key={index} className='border relative '>
                      <img src={value.path} alt={`Image ${index}`} className='w-32  h-36 pb-3' />
                      <MdClose className='absolute top-0 z-50 right-0 cursor-pointer' onClick={() => { removeValueUploade(value) }} size={30} color='black' />
                    </div>
                  ))}

                  <div className='h-100 w-32 cursor-pointer border flex items-center justify-center'>
                    <p className='text-7xl'>+</p>
                  </div>
                </div>
              </div>
            )}
    </div>
  </div>
  )
}
