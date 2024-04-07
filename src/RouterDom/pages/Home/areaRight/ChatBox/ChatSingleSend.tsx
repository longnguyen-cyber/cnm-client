import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { Input, Spin } from "antd";
import { AiOutlineTags } from "react-icons/ai";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { UserContext } from "../../../../../Context/UserContext";
import { useDispatch, useSelector } from "react-redux";
import { UserGetChatsSingleById } from "../../../../../feature/chat/pathApi";
import { LoadingOutlined } from "@ant-design/icons";
import { ScrollChatSingle } from "./ScrollChatSingle";
import { FaCloudUploadAlt } from "react-icons/fa";
import { PickerOverlay } from "filestack-react";
import "./GroupChat.css";
import ImgCrop from "antd-img-crop";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Upload, Image, message } from "antd";
import UserApi from "../../../../../api/user";
import AudioRecorderComponent from "./AudioRecorderComponent";
import { MdAttachFile } from "react-icons/md";

// import { ScrollChatSingle } from './ScrollChatSingle'
export const ChatSingleSend: FunctionComponent<any> = ({ selectedChat }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;
  const chatSingleId = useSelector((state: any) => state.Chats.chatSingleId);
  const dispatch = useDispatch();
  const [isPicker, setIsPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const contextUser = useContext(UserContext);
  const { state } = contextUser;
  const [user, setUser] = state.user;
  const { socket } = state;
  const [wordchat, setwordChat] = useState("");
  const [loadingSelectChat, setLoadingSelectChat] = useState(false);
  const [loadingsending, setLoadingsending] = useState(false);
  const [DataSocket, setDataSocket] = useState<any>(null);
  const [chatSingleIdnew, setChatSingleIdNew] = useState<any>(null);
  const [openImage, setOpenImage] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>([]);

  const [audioData, setAudioData] = useState(null);

  const handleAudioStop = (data : any) => {
    setAudioData(data);
    console.log("Audio data:", data);
  };

  const handleSendAudio = (audioBlob : any) => {
    // Handle sending audio data
    console.log("Sending audio:", audioBlob);
  };

  console.log('day la mang chat signel ')


  console.log(chatSingleIdnew);

  useEffect(() => {
    async function getData() {
      if (selectedChat) {
        const data = await dispatch<any>(
          UserGetChatsSingleById({ id: selectedChat.id })
        );
        // console.log("day la data check")
        if (data.error) {
          setChatSingleIdNew(null);
        }

        if (data && data.payload && data.payload.data) {
          setChatSingleIdNew(data.payload.data);
        }
      }
    }
    getData();
  }, [selectedChat]);

  useEffect(() => {
    if (socket) {
      socket.on("updatedSendThread", (data: any) => {
        console.log("emoji data tra ve");
        console.log(data);

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
            if (index !== -1) {
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
       
            const dataemoj={...data,emojis:[]}
            const newThreads = [...chatSingleIdnew.threads, dataemoj];
            setChatSingleIdNew({ ...chatSingleIdnew, threads: newThreads });
            localStorage.setItem("chatSingleId", JSON.stringify({newThreads}));
            setwordChat("")
            setLoadingsending(false)
          }
        }
      });
    }
  }, [socket, chatSingleIdnew]);

  useEffect(() => {
    if (socket) {
       // Lưu giữ giá trị ban đầu của chatSingleIdnew
      socket.on('updatedEmojiThread', (data: any) => {
        const chatSingleIdLocal=localStorage.getItem('chatSingleId')
        const initialChatSingleIdnew = chatSingleIdLocal ? JSON.parse(chatSingleIdLocal) : null;
     

         if (data.typeEmoji === 'add') {
          if(initialChatSingleIdnew.newThreads){
            const threadschat = initialChatSingleIdnew.newThreads;
            const index = threadschat.findIndex((item:any)=>item.stoneId===data.stoneId)
            if(index!==0){

              const emoji=[...threadschat[index].emojis,data]
           
              const newThreadschatItem = {...threadschat[index],emojis:emoji}
          
              const newThreads = [...threadschat.slice(0,index),newThreadschatItem,...threadschat.slice(index+1)]
           
              setChatSingleIdNew({...chatSingleIdnew,threads:newThreads})
              
            
            }
        }}
        
       
      });
    }
  }, [socket, chatSingleIdnew]);

     
  

 
 
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
        fileCreateDto:data,
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


  const getSelectUserIsChoose = (selectedChat: any) => {
    return (
      <>
        <div className="flex items-center p-1">
          <p className="presspreveriose">
            <MdKeyboardArrowLeft
              size={30}
              className="text-gray-600 cursor-pointer -mr-3"
            />
          </p>

          {selectedChat && selectedChat.user && (
            <div className="flex gap-3 bacgroundxe  items-center px-5">
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
      </>
    );
  };

  useEffect(() => {
    if (selectedChat.id) {
      setLoadingSelectChat(true);
    }
    setTimeout(() => {
      setLoadingSelectChat(false);
    }, 3000);
  }, [selectedChat.id]);



  const handleKeyPress = async (event: any) => {
    if (event.key === "Enter") {
      if (imageUpload) {
        console.log("imageUpload", imageUpload);
        const Thread = {
          messages: {
            message: event.target.value,
          },
          chatId: selectedChat.id,
          receiveId: selectedChat.user.id,
          fileCreateDto: imageUpload,
        };
        if (socket) {
          socket.emit("sendThread", Thread);
        }
        setOpenImage(false);
        setImageUpload(null);
        setLoadingsending(true);
        setInputValue("");
   
      } else {
        console.log("noimageupload", imageUpload);
        const Thread = {
          messages: {
            message: event.target.value,
          },
          chatId: selectedChat.id,
          receiveId: selectedChat.user.id,
        };

        console.log(Thread);
        // console.log(Thread)
        if (socket) {
          socket.emit("sendThread", Thread);
        }

     
      }

      setwordChat(event.target.value);
      event.target.value = "";
      setLoadingsending(true);
      setInputValue("");
    }
  };



  return (
    <div className="flex flex-col h-screen bg-gray-300  relative">
      <div className="flex items-center h-16 w-full bg-white shadow-md">
        {getSelectUserIsChoose(selectedChat)}
      </div>
      <div className="flex flex-col justify-end  flex-grow">
        {loadingSelectChat ? (
          <Spin
            indicator={antIcon}
            style={{ fontSize: "100px" }}
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
            <div>
             
            </div>
          </div>
        )}
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
  );
};
