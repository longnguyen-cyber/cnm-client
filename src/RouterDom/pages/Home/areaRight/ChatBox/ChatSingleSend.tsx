import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Input, Modal, Spin, notification } from 'antd'
import { AiOutlineTags } from 'react-icons/ai'
import { MdClose, MdKeyboardArrowLeft } from 'react-icons/md'
import { UserContext } from '../../../../../Context/UserContext'
import { useDispatch, useSelector } from 'react-redux'
import { UserGetChatsSingleById } from '../../../../../feature/chat/pathApi'
import { LoadingOutlined } from '@ant-design/icons'
import { ScrollChatSingle } from './ScrollChatSingle'
import { FaCloudUploadAlt, FaFileImage, FaRegEdit } from 'react-icons/fa'
import { PickerOverlay } from 'filestack-react'
import './GroupChat.css'
import ImgCrop from 'antd-img-crop'
import { CameraOutlined } from '@ant-design/icons'
import { Button, Upload, Image, message } from 'antd'
import UserApi from '../../../../../api/user'
import AudioRecorderComponent from './AudioRecorderComponent'
import { MdAttachFile } from 'react-icons/md'
import { CiVideoOn } from 'react-icons/ci'
import { RcFile } from 'antd/es/upload'
import { AiOutlineMessage } from "react-icons/ai";

// import { ScrollChatSingle } from './ScrollChatSingle'
export const ChatSingleSend: FunctionComponent<any> = ({ selectedChat }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />
  const chatSingleId = useSelector((state: any) => state.Chats.chatSingleId)
  const dispatch = useDispatch()
  const [isPicker, setIsPicker] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const contextUser = useContext(UserContext)
  const { state } = contextUser
  const [user, setUser] = state.user
  const { socket } = state
  const [wordchat, setwordChat] = useState('')
  const [loadingSelectChat, setLoadingSelectChat] = useState(false)
  const [loadingsending, setLoadingsending] = useState(false)
  const [DataSocket, setDataSocket] = useState<any>(null)
  const [chatSingleIdnew, setChatSingleIdNew] = useState<any>(null)
  const [openImage, setOpenImage] = useState(false)
  const [imageUpload, setImageUpload] = useState<any>([])
  const [loadingUnfriend, setLoadingUnfriend] = useState<any>(false)
  const [audioData, setAudioData] = useState(null)
  const [openModalUserChat, setOpenModalUserChat] = useState(false)
  const [loadingvidieo, setLoadingVideo] = useState(false)
  const [dataPin, setDataPin] = useState<any>([])
  const [showAllMessages, setShowAllMessages] = useState(false);

  const toggleShowAllMessages = () => {
    setShowAllMessages(!showAllMessages);
  };

  useEffect(()=>{
    const pinnedThreadsData = chatSingleIdnew?.threads.filter((item:any) => item.pin === true);
   console.log(pinnedThreadsData)
    setDataPin(pinnedThreadsData)



  },[chatSingleIdnew?.threads])

  const handleAudioStop = (data: any) => {
    setAudioData(data)

    console.log('Audio data:', data)
  }

  const handleSendAudio = (audioBlob: any) => {
    // Handle sending audio data
    console.log('Sending audio:', audioBlob)
  }

  console.log(chatSingleIdnew)

  useEffect(() => {
    async function getData() {
      if (selectedChat) {
        const data = await dispatch<any>(
          UserGetChatsSingleById({ id: selectedChat.id })
        )
        // console.log("day la data check")
        if (data.error) {
          setChatSingleIdNew(null)
        }

        if (data && data.payload && data.payload.data) {
          setChatSingleIdNew(data.payload.data)
        }
      }
    }
    getData()
  }, [selectedChat])

  useEffect(() => {
  
    const handleUpdateSendThread = (data: any) => {
      if (data.typeMsg === 'recall'&&data.type === 'chat') {
        console.log('data recall')
        console.log(data)
        const index = chatSingleIdnew.threads.findIndex((item: any) => item.stoneId === data.stoneId)
        if (index !== -1) {
          const newThreads = [...chatSingleIdnew.threads]
          newThreads[index]
            = { ...newThreads[index], messages:{...newThreads[index].messages,message:'Tin nhắn đã bị thu hồi'} }
          console.log('newThreads', newThreads)
          setChatSingleIdNew({ ...chatSingleIdnew, threads: newThreads })
          return
        }
        // setChatSingleIdNew({ ...channelIdNew, threads: newThreads })
        return
          // Tiếp tục xử lý với newThreads
        }

        else if(data.typeMsg === 'update'&&data.type === 'chat' ) {
          console.log('data update')
          console.log(data)
          const index = chatSingleIdnew.threads.findIndex((item: any) => item.stoneId === data.stoneId)

          const datapinnew=dataPin
          setDataPin([...datapinnew,chatSingleIdnew.threads[index]])
       
          // const index = chatSingleIdnew.threads.findIndex((item: any) => item.stoneId === data.stoneId)
          

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
    socket?.on('updatedSendThread',handleUpdateSendThread)

    socket?.on('updatedEmojiThread',handleupdatedEmojiThread)
    return () => {
      socket?.off('updatedSendThread',handleUpdateSendThread)
      socket?.off('updatedEmojiThread',handleupdatedEmojiThread)
    }
  }, [socket, chatSingleIdnew])




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
  const unFriend = async (selectedChat: any) => {
    setLoadingUnfriend(true)
    if (socket) {
      socket.emit('unfriend', {
        chatId: selectedChat.id,
      })
      notification['success']({
        message: 'Thông báo',
        description: `Đã huy kết bạn với ${selectedChat.user.name} thành công`,
      })
    }
    setLoadingUnfriend(false)
    setOpenModalUserChat(false)
    window.location.reload()
  }

  const modalToUnfriend = (selectedChat: any) => {
    return (
      <Modal
        width={400}
        title="Hồ sơ"
        open={openModalUserChat}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        // onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <OkBtn/> */}
            <Button
              className="bg-red-500"
              onClick={() => unFriend(selectedChat)}
            >
              Hủy kết bạn
            </Button>
            <Button
              className="bg-blue-500"
              onClick={() => setOpenModalUserChat(false)}
            >
              Thoát
            </Button>
          </>
        )}
      >
        <div className="flex flex-col">
          {/* Image cover  */}
          <div className="">
            <img src="https://cover-talk.zadn.vn/7/a/a/9/3/a72ea6dfb69157c6b987a0ccc1306acb.jpg" />
          </div>
          {/* avatar */}
          <div className="flex items-center mt-5 relative top-[-40px]">
            <div className="h-[100px]">
              <img
                src={
                  selectedChat
                    ? selectedChat.user?.avatar
                    : 'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg'
                }
                className="rounded-full h-[100px] w-[100px] border border-white "
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold pl-4">
                {selectedChat.user?.name}
              </p>
            </div>
          </div>
          {/* info */}
          <div style={{ borderTop: '4px solid #ccc' }}>
            <h3 className="text-lg font-bold mb-2">Thông tin người dùng</h3>
            <p>Số điện thoại: {selectedChat.user?.phone}</p>
            <p>Email: {selectedChat?.user.email}</p>
          </div>
        </div>
      </Modal>
    )
  }

  const getSelectUserIsChoose = (selectedChat: any) => {
    return (
      <>
        <div
          className="flex items-center p-1"
          onClick={() => setOpenModalUserChat(true)}
        >
          <p className="presspreveriose">
            <MdKeyboardArrowLeft
              size={30}
              className="text-gray-600 cursor-pointer -mr-3"
            />
          </p>

          {selectedChat && selectedChat.user && (
            <div className="flex gap-3 bacgroundxe items-center px-5 cursor-pointer">
              <img
                src={`${selectedChat.user.avatar}`}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-xl font-medium ">{selectedChat.user.name}</p>
                <div className="flex">
                  <AiOutlineTags color="gray" className="mt-1" />
                  <p>Bạn bè</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {modalToUnfriend(selectedChat)}
      </>
    )
  }

  useEffect(() => {
    if (selectedChat.id) {
      setLoadingSelectChat(true)
    }
    setTimeout(() => {
      setLoadingSelectChat(false)
    }, 3000)
  }, [selectedChat.id])

  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      if (imageUpload) {
        const Thread = {
          messages: {
            message: event.target.value,
          },
          chatId: selectedChat.id,
          receiveId: selectedChat.user.id,
          fileCreateDto: imageUpload,
        }
        if (socket) {
          socket.emit('sendThread', Thread)
        }
        setOpenImage(false)
        setImageUpload(null)
        setLoadingsending(true)
        setInputValue('')
        socket?.off('sendThread')
      } else {
        const Thread = {
          messages: {
            message: event.target.value,
          },
          chatId: selectedChat.id,
          receiveId: selectedChat.user.id,
        }

        console.log('data send thread', Thread)
        if (socket) {
          socket.emit('sendThread', Thread)
        }

        socket?.off('sendThread')
      }

      setwordChat(event.target.value)
      event.target.value = ''
      setLoadingsending(true)
      setInputValue('')
    }
  }

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
            {modalLoadingvideo()}
      <div className="flex items-center h-16 w-full bg-white shadow-md">
        {getSelectUserIsChoose(selectedChat)}
       
      </div>
      <p className='w-full border  absolute top-14 z-50 left-0 right-0 bg-white p-2 border-collapse'>
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
  
      <div className="flex flex-col justify-end  flex-grow">
        {loadingSelectChat ? (
          <Spin
            indicator={antIcon}
            style={{ fontSize: '100px' }}
            className="text-black text-4xl m-auto justify-center self-center  "
          />
        ) : (
          <div>
            <ScrollChatSingle
              Channelid={chatSingleIdnew}
              loadingsending={loadingsending}
              wordchat={wordchat}
              imageUpload={imageUpload}
            />
            {/* {isTyPing?<img src={`${imageTyping}` } className='w-6 h-6 rounded-3xl'/>:""}  */}
            <div className="flex">
              <Input
                onChange={(e) => {
                  setInputValue(e.target.value)
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
                  <Button
                    icon={<MdAttachFile />}
                    type="dashed"
                    className="h-16"
                  ></Button>
                </Upload>

                <AudioRecorderComponent
                  className=""
                  selectedChat={selectedChat}
                />

              </div>
            </div>

          </div>
        )}
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
