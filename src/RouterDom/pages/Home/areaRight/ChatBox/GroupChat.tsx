import { Button, Input, Spin, Upload } from 'antd'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import './GroupChat.css'
import { UserContext } from '../../../../../Context/UserContext';
import { ScrollChat } from './ScrollChat';
import { useDispatch, useSelector } from 'react-redux';
import { UserGetChannelById } from '../../../../../feature/chat/pathApi';
import UserApi from '../../../../../api/user';
import { CameraOutlined } from '@ant-design/icons'
import { MdAttachFile } from 'react-icons/md';
import AudioRecorderComponent from './AudioRecorderComponent';
import { RcFile } from 'antd/es/upload';
import { MdClose } from "react-icons/md";
import AudioRecorderComponentChatBox from './AudioRecorderComponentChatBox';
export const GroupChat: FunctionComponent<any> = ({ }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  const Channelid = useSelector((state: any) => state.Chats.channelId)
  const dispatch = useDispatch();
  const UserContexts = useContext(UserContext);
  const { state } = UserContexts;
  const [user, setUser] = state.user;
  const { socket } = state
  const [selectedChat, setselectedChats] = state.selectedChat;
  const [loadingsending, setLoadingsending] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [wordchat, setwordChat] = useState('')
  const [loadingSelectChat, setLoadingSelectChat] = useState(false)
  const [channelIdNew, setChatSingleIdNew] = useState<{ threads: any[] }>({ threads: [] });
  
  const [openImage, setOpenImage] = useState(false)
  const [imageUpload, setImageUpload] = useState<any>([])
  console.log(channelIdNew)

/// get thong tin doan chat
  useEffect(() => {
    async function GetChannelById() {
      setLoadingSelectChat(true)
      if (selectedChat.id) {
        const dataChannels = await UserApi.UserGetChannelById({ id: selectedChat.id });

        if (dataChannels) {
          setChatSingleIdNew(dataChannels.data)
          setLoadingSelectChat(false)
        }
      }
    }
    GetChannelById();
  }, [selectedChat.id]);


//data tra ve khi sendmessage

  useEffect(() => {

    const handleData=async(data:any)=>{
      console.log('data socker recall')
      console.log(data)
          if(data.typeMsg==='recall'&&data.type==='channel'){
           
            console.log('data stondeid')
            const index = channelIdNew.threads.findIndex((item:any)=>item.stoneId===data.stoneId)
            if(index!==-1){
              
              
              const newThreads = [...channelIdNew.threads]
              newThreads[index].messages
              ={...newThreads[index].messages,message:'Tin nhắn đã được thu hồi'}
              console.log('newThreads' ,newThreads)
              setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
              return
            }
            // setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
            return
          }
          else if (data) {
           
          const newThreads = [...channelIdNew.threads, data]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
          setwordChat('')
          setLoadingsending(false)
        }
    }

    //emoji

    const handleDataEmoji=async(data:any)=>{
      console.log('data emoji')
      console.log(data)
      //emojis

      if(data&&data.type==='channel'&&data.typeEmoji==='add'){
        console.log('data emoji add')
        console.log(data)
        const index = channelIdNew.threads.findIndex((item:any)=>item.stoneId===data.stoneId)
        if(index!==-1){
          const newThreads = [...channelIdNew.threads]
          newThreads[index].emojis=[...newThreads[index].emojis,data]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
         
          return
        }

      }
      

    }





      socket.on('updatedSendThread',handleData)
      socket.on('updatedEmojiThread',handleDataEmoji)

      return () => {
        socket.off('updatedSendThread',handleData)
        socket.off('updatedEmojiThread',handleDataEmoji)
      }
  }, [socket,channelIdNew])




  ///------------upload file  to image and get doc url--------------
  const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    try {
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file);
        console.log('File', file);
      });

      // Gửi FormData chứa tất cả các tệp đến server để xử lý
      const response = await UserApi.userUploadImage(formData);
      const { data } = response;
      console.log('data tra ve sau khi upload');
      console.log(data);
      if (data) {
        // Xử lý sau khi tải lên thành công
        setImageUpload(data)
        setOpenImage(true)
      }
    } catch (error) {
      console.error(error);
    }

    return false; // Trả về false để ngăn chặn Upload component tự động tải lên tệp
  };


  

  ///------------upload file  to server and get doc url--------------

  const beforeUploaddoc = async (file: any) => {
    const formData = new FormData()
    formData.append('files', file) // Use "files" if your server uses AnyFilesInterceptor()

    try {
      const response = await UserApi.userUploadImage(formData)
      
      const { data } = response
      console.log(data)
      if (data) {
        // Handle successful upload here
        const Thread = {
            userId: user.id,
            channelId: selectedChat.id,
            senderId:user.id,
            fileCreateDto: data,
            messages:null

            
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

  //remove value upload
  const removeValueUploade=(value:any)=>{
    const newValue=imageUpload.filter((item:any)=>item.path!==value.path)
    setImageUpload(newValue)
  }

    /// send message to server

    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if(imageUpload){
          const Thread = {
            messages: {
              message: inputValue,
             
            },
            userId: user.id,
            senderId:user.id,
            fileCreateDto:imageUpload,

            channelId: selectedChat.id,
            // token:token
          }
          if (socket) {
            socket.emit('sendThread', Thread)
          }
          setOpenImage(false)
          setImageUpload([])
          setInputValue('')
          return
        }
        else{
          const Thread = {
            messages: {
              message: event.target.value
            },
            userId: user.id,
            channelId: selectedChat.id,
            senderId:user.id,
          }
  
          if (socket) {
            socket.emit('sendThread', Thread)
          }
          // setwordChat(event.target.value)
          event.target.value = '';
          setLoadingsending(true)
          setInputValue('')
  
        }
        
      }
    }

  return (
    <>

      <div>
        {
          <div className='contentGroupChat flex flex-grow justify-end  flex-col'>
            {loadingSelectChat ? <Spin indicator={antIcon} style={{ fontSize: '100px' }} className='justify-center m-auto' /> : <>
              <ScrollChat Channelid={channelIdNew} loadingsending={loadingsending} wordchat={wordchat}   imageUpload={imageUpload}/>
              {/* {<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
              <div className='relative h-14'>
              
                <Input

                  onKeyPress={handleKeyPress}
                  onBlur={() => { }}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }}

                  placeholder='Nhập @, tin nhắn mới ???'
                  value={inputValue}
                  className='rounded-none absolute h-14 w-full  placeholder-gray-500 to-black'
                />


                <div className="right-0 flex absolute gap-1">
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
                    className="cursor-pointer h-14"
                    fileList={[]}
                    accept=".pdf,.doc,.docx" // Accept PDF, Word (.doc, .docx) files
                    name="files"
                  >
                    <Button
                      icon={<MdAttachFile />}
                      type="dashed"
                      className="h-14 border-none"
                    ></Button>
                  </Upload>

                  <AudioRecorderComponentChatBox
                    className=""
                    selectedChat={selectedChat}
                  />
                </div>
              </div>
            </>}
        
            {imageUpload&&openImage&&(
              <div className="bg-white w-full">
                <p className="font-medium mt-4 mb-4">{imageUpload.length} ảnh </p>
               <div className='flex gap-2 '>
                  
               {imageUpload.map((value: any, index: number) => (
                      <div key={index} className='border relative '>
                        <img src={value.path} alt={`Image ${index}`} className='w-32  h-36 pb-3'/>
                        <MdClose  className='absolute top-0 z-50 right-0 cursor-pointer' onClick={()=>{removeValueUploade(value)}} size={30} color='black'/>
                      </div>
                    ))}

                    <div className='h-100 w-32 cursor-pointer border flex items-center justify-center'>
                      <p className='text-7xl'>+</p>
                    </div>
                </div>
              </div>
            )}
          </div>}
      </div>

    </>

  )
}
