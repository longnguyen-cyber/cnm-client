import { Button, Input, Modal, Spin, Upload, notification } from 'antd'
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
import { CiVideoOn } from "react-icons/ci";
import imageTyping from '../../../../../image/typing.gif'
import { AiOutlineMessage } from 'react-icons/ai';
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
  const [channelIdNew, setChatSingleIdNew] = useState<{ id: any, threads: any[], users: any[], name: any, emojis: any[] }>({ id: '', threads: [], users: [], name: String, emojis: [] });
  const [openImage, setOpenImage] = useState(false)
  const [imageUpload, setImageUpload] = useState<any>([])
  const [loadingvidieo, setLoadingVideo] = useState(false)

  const [ListSingleChatnew, setListSingleChatnew] = useState<any>([])
  const [typingcheck,setTypingCheck]=useState<any>(false)
  const [dataPin, setDataPin] = useState<any>([])
  const [showAllMessages, setShowAllMessages] = useState(false);

  console.log('channelIdNew')
  console.log(channelIdNew)

  useEffect(()=>{
    const pinnedThreadsData = channelIdNew?.threads.filter((item:any) => item.pin === true);
   console.log(pinnedThreadsData)
    setDataPin(pinnedThreadsData)



  },[channelIdNew?.threads])


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


  useEffect(() => {
    async function UserGetAllSingleChat() {
      const data = await UserApi.UserGetAllSingleChat()

      if (data) {
        setListSingleChatnew(data.data)
      }

    }
    UserGetAllSingleChat()
  }, [])


  //data tra ve khi sendmessage

  useEffect(() => {

    const handleData = async (data: any) => {

      if (data.typeMsg === 'recall' && data.type === 'channel') {

        console.log('data recall ')
        console.log(data)
        const index = channelIdNew.threads.findIndex((item: any) => item.stoneId === data.stoneId)
        if (index !== -1) {
          const newThreads = [...channelIdNew.threads]
          newThreads[index].messages
            = { ...newThreads[index].messages, message: 'Tin nhắn đã được thu hồi' }
          console.log('newThreads', newThreads)
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
          return
        }
        // setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
        return
      }
      else if(data.typeMsg === 'update'&&data.type === 'channel' ) {
        console.log('data update')
        console.log(data)
        const index = channelIdNew.threads.findIndex((item: any) => item.stoneId === data.stoneId)

        const datapinnew=dataPin
        setDataPin([...datapinnew,channelIdNew.threads[index]])
     
        // const index = chatSingleIdnew.threads.findIndex((item: any) => item.stoneId === data.stoneId)
        

      }
      else if (data) {
        console.log('dau la data sendthread trong group chat')
        console.log(data)
        if (channelIdNew.id === data.channelId) {
          const dataNew = { ...data, emojis: [] }
          const newThreads = [...channelIdNew.threads, dataNew]
          setChatSingleIdNew({
            ...channelIdNew,
            threads: newThreads,
            // Mặc định là mảng rỗng, hoặc có thể là một mảng các giá trị cụ thể
          });
          setwordChat('')
          setLoadingsending(false)
        }
      }
    }

    //---------------------emoji---------------------------

    const handleDataEmoji = async (data: any) => {

      //emojis

      if (data && data.type === 'channel' && data.typeEmoji === 'add') {
        console.log('data emoji add')
        console.log(data)
        const index = channelIdNew.threads.findIndex((item: any) => item.stoneId === data.stoneId)
        if (index !== -1) {
          const newThreads = [...channelIdNew.threads]
          newThreads[index].emojis = [...newThreads[index].emojis, data]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
          return
        }
      }
    }

    //------------------ channelWS-------------------------

    const HandleChannelData = (data: any) => {
      console.log('data channelWS')
      console.log(data)
      if (data && data.message === 'Add user to channel success') { // Kiểm tra xem thông báo đã được hiển thị hay chưa
        // setShowSuccessNotification(true); // Đánh dấu rằng thông báo đã được hiển thị

        const { channel } = data.data
        if (channel.id === channelIdNew.id) {
          const { lastedThread } = channel
          const newThreads = [...channelIdNew.threads, lastedThread]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads, users: channel.users })
          setselectedChats({ ...selectedChat, users: channel.users })


          notification["success"]({
            message: "Thông báo",
            description: "Thêm thành viên thành công",
          });

        }


      }
      // else {
      //   notification["error"]({
      //     message: "Thông báo",
      //     description: "Tạo nhóm Thất bại ",
      //   });
      // }
      if (data && data.message === 'Update channel success') {
        console.log('data update')
        console.log(data)
        const { channel } = data.data
        if (channel.id === channelIdNew.id) {
          const { lastedThread } = channel
          const newThreads = [...channelIdNew.threads, lastedThread]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads, name: channel.name })
          setselectedChats({ ...selectedChat, name: channel.name })

          notification["success"]({
            message: "success",
            description: "Có người vừa cập nhật nhóm chát  ",
          });
        }

        return
      }
      if (data && data.message === 'Remove user from channel success') {
        const { channel } = data.data
        if (channel.id === channelIdNew.id) {
          const { lastedThread } = channel
          console.log('data remove user from channel')
          console.log(data)
          console.log(lastedThread)

          const newThreads = [...channelIdNew.threads, lastedThread]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads, users: channel.users })
          setselectedChats({ ...selectedChat, users: channel.users })

        }
        return () => { socket?.off('removeUserFromChannel') }
      }

      if (data && data.message === 'Update role user in channel success') {
        console.log('data update role user in channel success')
        console.log(data)
        const { channel } = data.data
        if (channel.id === channelIdNew.id) {
          console.log('channel update')
          console.log(channel)
          const { lastedThread } = channel
          const newThreads = [...channelIdNew.threads, lastedThread]
          setChatSingleIdNew({ ...channelIdNew, threads: newThreads, users: channel.users })
          setselectedChats({ ...selectedChat, users: channel.users })
          notification["success"]({
            message: "success",
            description: "update role user trong nhóm   thành công ",
          });
        }
      }
      if (data && data.message === 'Leave channel success') {
        console.log('data update role user in channel success')
        console.log(data)
        const { channel } = data.data
        console.log('day la user')
        console.log(user.id)

        if (channel.id === channelIdNew.id) {
          if (data.data.userLeave === user.id) {
            console.log('day la user')
            console.log(user.id)
            setChatSingleIdNew({ id: '', threads: [], users: [], name: String, emojis: [] });
            setselectedChats(null)

            // window.location.reload();
          }
          else {
            const { lastedThread } = channel
            const newThreads = [...channelIdNew.threads, lastedThread]
            setChatSingleIdNew({ ...channelIdNew, threads: newThreads, users: channel.users })
            setselectedChats({ ...selectedChat, users: channel.users })
            notification["success"]({
              message: "success",
              description: "Leave channel success",
            });
          }
        }
        console.log('channel update')
        console.log(channel)

      }
      if (data && data.message === 'Delete channel success') {
        console.log('data delete role user in channel success')
        console.log(data)
        const { channel } = data.data
        if (channel.id === channelIdNew.id) {
          console.log('channel update')
          console.log(channel)
          setChatSingleIdNew({ id: '', threads: [], users: [], name: String, emojis: [] });
          setselectedChats(null)
          notification["success"]({
            message: "success",
            description: "Nhóm đã bị giải tán ",
          });
        }
      }


    }
    ///-----------------chatWS-------------------------
    const HandleChatData = (data: any) => {
      if (data.message === "Request friend success") {
        console.log('data chatWS ben group chat')
        console.log(data)
        // setScheckRender(false)
      }
    }

    socket?.on('updatedSendThread', handleData)
    socket?.on('updatedEmojiThread', handleDataEmoji)
    socket?.on('channelWS', HandleChannelData)
    socket?.on('chatWS', HandleChatData)

    return () => {
      socket?.off('updatedSendThread', handleData)
      socket?.off('updatedEmojiThread', handleDataEmoji)
      socket?.off('channelWS', HandleChannelData)
    }
  }, [socket, channelIdNew])




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
          senderId: user.id,
          fileCreateDto: data,
          messages: null,
          members: selectedChat.users.map((value: any) => value.id)


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

  ////upload video

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
        channelId: selectedChat.id,
        userId: user.id,
        senderId: user.id,
        fileCreateDto: data,
        members: selectedChat.users.map((value: any) => value.id)
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

  //remove value upload
  const removeValueUploade = (value: any) => {
    const newValue = imageUpload.filter((item: any) => item.path !== value.path)
    setImageUpload(newValue)
  }

  /// send message to server

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      if (imageUpload.length > 0) {
        const Thread = {
          messages: {
            message: inputValue,

          },
          // userId: user.id,
          // senderId: user.id,
          fileCreateDto: imageUpload,
          channelId: selectedChat.id,
          members: selectedChat.users.map((value: any) => value.id)
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
      else {
        console.log('Thread')
        console.log('Thread')
        const Thread = {
          messages: {
            message: event.target.value
          },
          // userId: user.id,
          channelId: selectedChat.id,
          // senderId: user.id,
          members: selectedChat.users.map((value: any) => value.id)
        }

        console.log('Thread')
        console.log(Thread)


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

  ///su ly typing 
  const handleChangInputChatFocus=()=>{
    if(socket){
        socket.emit('typing',
        {members: selectedChat.users.map((value: any) =>{
          if(value.id!==user.id)
        {
          return value.id
        }}),
          Channelid:selectedChat.id})
    }
  }

  const handleChangInputChatBlur=()=>{
    if(socket){
        if(socket){
            socket.emit('typing',{members:[],Channelid:selectedChat.id})
        }
    }
  }

  useEffect(()=>{
    socket.on('typing',(data:any)=>{
      console.log('data typing')
      console.log(data)
      if(data.members.length>0){
        if(selectedChat.id===data.Channelid){
          console.log('data user',user)
          data.members?.map((value:any)=>{
            if(value===user.id){
              setTypingCheck(true)
            }
          })
         
        
         
        }
        else {
          // Nếu không phải kênh hiện tại, đặt lại trạng thái đang gõ
          setTypingCheck(false);
        }

      
      }
      else{
        setTypingCheck(false)
      }
      return ()=>socket.off('typing')
    }
     
  )
  },[])
  
  const toggleShowAllMessages = () => {
    setShowAllMessages(!showAllMessages);
  };

  const modalToUnfriend = () => {

    return (
      <Modal className=' mt-80 flex justify-center w-28 h-20 items-center' title="" open={loadingvidieo}>
        <p className='mt-14'>Đang upload video ....</p>
        <Spin indicator={antIcon} style={{ fontSize: '100px', marginTop: '-70px' }} className=' ml-14' />
      </Modal>
    )
  }

  return (
    <>
      {modalToUnfriend()}
      
      <div className='relative '>
      <p className='w-full border absolute top-0 left-0 right-0 bg-white p-2 border-collapse'>
      <>
        Danh sách ghim ({dataPin && dataPin.length}){' '}
        <span onClick={toggleShowAllMessages} className="cursor-pointer">
          {showAllMessages ? 'Ẩn tin nhắn' : 'Hiện tất cả tin nhắn'}
        </span>
      </>
      {showAllMessages ? (
        dataPin?.map((item:any, index:any) => (
          <div key={index} className="text-black p-2 items-center flex gap-2">
            <AiOutlineMessage size={32} className='text-blue-400' />
            <div className='text-gray-500'>
              <p className='font-medium'>Tin nhắn</p>
              <p>{item?.user?.name}: {item.messages.message}</p>
            </div>
          </div>
        ))
      ) : (
        // Chỉ hiển thị tin nhắn cuối cùng
        dataPin&&dataPin.length > 0 && (
          <div className="text-black p-2 items-center flex gap-2">
            <AiOutlineMessage size={32} className='text-blue-400' />
            <div className='text-gray-500'>
              <p className='font-medium'>Tin nhắn</p>
              <p>{dataPin[dataPin.length - 1]?.user?.name}: {dataPin[dataPin.length - 1].messages.message}</p>
            </div>
          </div>
        )
      )}
    </p>
        {
          <div className='contentGroupChat flex flex-grow justify-end  flex-col'>
           
           
            {loadingSelectChat ? <Spin indicator={antIcon} style={{ fontSize: '100px' }} className='justify-center m-auto' /> : <>
            
             
              <ScrollChat Channelid={channelIdNew} loadingsending={loadingsending} wordchat={wordchat} imageUpload={imageUpload} />
              {/* {<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
              <div className='relative h-14'>

               {typingcheck?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""} 
                <Input

                  onKeyPress={handleKeyPress}
                  onFocus={()=>{handleChangInputChatFocus()}}
                 
                  onBlur={()=>{handleChangInputChatBlur()}}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                  }}

                  placeholder='Nhập @, tin nhắn mới ???'
                  value={inputValue}
                  className='rounded-none absolute h-14 w-full  placeholder-gray-500 to-black'
                />


                <div className="right-0 flex absolute gap-1">
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
          </div>}
      </div>

    </>

  )
}
