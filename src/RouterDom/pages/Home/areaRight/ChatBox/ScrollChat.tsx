import React, { FunctionComponent, useContext, useEffect, useRef, useState } from 'react'
import moment from 'moment';
import "moment/locale/vi";
import { UserContext } from '../../../../../Context/UserContext'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ConfigUserChatBox';
import { format } from 'date-fns';
import './GroupChat.css'
import { CiClock1 } from "react-icons/ci";
import { TiTickOutline } from "react-icons/ti";
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import ScrollableFeed from "react-scrollable-feed";
import { FaFilePdf } from 'react-icons/fa';
import { MdFileDownload } from 'react-icons/md';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { ShowPdf } from './WordAndPdf/ShowPdf';
import { ShowWord } from './WordAndPdf/ShowWord';
import { Button, Modal } from 'antd';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import imageLaugh from '../../../../../image/react/laughing.png'
import imageSad from '../../../../../image/react/sad.png'
import imageThumb from '../../../../../image/react/thumbs-up-32.png'
import imageLike from '../../../../../image/react/like.png'
import imageLove from '../../../../../image/react/love.png'
import imageWow from '../../../../../image/react/wow.png'
import imageAngry from '../../../../../image/react/angry-32.png'

import { MdDeleteOutline } from "react-icons/md";
import { TbMessageCircleCancel } from "react-icons/tb";
import { MdSendToMobile } from "react-icons/md"
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface PdfViewerProps {
  pdfUrl: string; // Định nghĩa kiểu dữ liệu của prop pdfUrl là string
}
moment.locale('vi');
export const ScrollChat: FunctionComponent<any> = ({ Channelid ,loadingsending,wordchat,imageUpload}) => {
    const ContexChat = useContext(UserContext);
    const { state } = ContexChat;
    const [users, setUser] = state.user
    const {socket}=state
    const chatContainerRef = useRef<any>(null);
    const fadeInClass = "fade-in";
    const [openModalUserChat, setOpenModalUserChat] = useState(false)
    const [selectedUserReaction, setSelectedUserReaction] = useState<any>(null)
    const [emoJi, setEmoJi] = useState('')

    const setSendEmoj = (value: any) => {
      const dataEmoji = {
        stoneId: selectedUserReaction.stoneId,
        typeEmoji: 'add',
        emoji: value,
        quantity:1
      }
      console.log('emoji bat dau',dataEmoji)
   
      if (socket) {
        socket.emit('emoji', dataEmoji)


      }
      return () => {socket.off('emoji')}
    }

    const RecallSendThread=()=>{
      console.log('bat du gui',selectedUserReaction)
  
        const data={
          stoneId: selectedUserReaction.stoneId,
          type: 'channel'
        }
        socket.emit('recallSendThread',data)
        return ()=>{socket.off('recallSendThread')}
     
    }


    const modalToUnfriend = () => {
      console.log('modal',selectedUserReaction)
      return (
       
      
       
      <Modal className=' mt-80 flex justify-center items-center' title="" open={openModalUserChat} onOk={()=>{setOpenModalUserChat(false)}} onCancel={()=>{setOpenModalUserChat(false)}}>
        <div className="flex items-end justify-center mt-10 items-center w-52 gap-2">
            {/* Thêm các emoji ở đây */}
            <p className="text-2xl">
              <img
                src={`${imageLike}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setSendEmoj('like')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imageAngry}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setSendEmoj('angry')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imageLaugh}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setSendEmoj('laugh')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imageSad}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setSendEmoj('sad')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imageThumb}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setSendEmoj('love')}
              />
            </p>

    
          </div>

          {selectedUserReaction&&selectedUserReaction.senderId===users?.id&&
          <div className='flex items-center justify-center mt-2 gap-2'>
            
               <MdDeleteOutline size={25} className='cursor-pointer text-red-500'/>
              <TbMessageCircleCancel size={25}  className='cursor-pointer text-red-500' onClick={()=>{RecallSendThread()}}/>
              <MdSendToMobile size={25} className='cursor-pointer text-red-500'/>
          
          </div>
    }

      </Modal>
      )
    }


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [Channelid,wordchat]);
    return (
      <div>
         {!selectedUserReaction?.isRecall&&modalToUnfriend()}
      {Channelid && (
        <div className='content_Scroll' ref={chatContainerRef}  style={{
          width: '100%',
          maxHeight: `${
            imageUpload&&imageUpload.length>0  ? '60vh' : '85vh'
          }`,
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}>
          {Channelid.threads
            .slice()
            .sort((a:any, b:any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
            .map((m:any, i:any, messagesArray:any) => (
              <div style={{ display: "flex", marginLeft:'20px', paddingLeft:"10px",paddingRight:'10px' }} key={m._id}>
                {(isSameSender(messagesArray, m, i, users.id) ||
                  isLastMessage(messagesArray, i, users.id)) && (
                    <>
                  {m.messages&& m.messages.type!=="system"&& <img
                      src={`${m.user&&
                        m.user.avatar
                          ? m.user.avatar
                          : 'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4='
                      }`}
                      className="w-12 h-12 rounded-full"
                      style={{ marginLeft: '-20px', marginTop: '-10px' }}
                    />}
                    </>
                   
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.messages&&  m.messages.type==="system"?"": m.senderId === users.id ? "white" : "white"
                     
                    }`,
                    marginLeft: isSameSenderMargin(messagesArray, m, i, users.id),
                    marginTop: isSameUser(messagesArray, m, i) ? 5 : 10,
                    borderRadius: "5px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    minWidth:`${m.senderId===null?"100%":"auto"}`
                  }}
                  className='flex flex-col gap-3 dothovergroup cursor-pointer'
                 
                >
              {/* https://workchatprod.s3.ap-southeast-1.amazonaws.com/0318.mp4 */}

                    {m.files
                    ? m.files.map((value: any) => {
                        if (value.filename === 'blob') {
                          return (
                            <audio
                              key={value.filename}
                              controls
                              src={value.path}
                              style={{ width: '300px', height: '50px' }}
                            />
                          )
                        } else {
                          const extension = value.filename
                            .split('.')
                            .pop()
                            .toLowerCase()
                          if (extension === 'pdf') {
                            return (
                              <div className=''>
                             {<ShowPdf file={value}/>}
                              </div>
                            )
                          } else if (
                            extension === 'docx' ||
                            extension === 'doc'
                          ) {
                            return (
                              <div key={value.filename}>
                               {<ShowWord file={value}/>}
                              </div>
                            )
                          }
                          else if(extension==='mp4'||extension==="mov"){
                            return (
                              <div>
                                
                                  <video
                                      key={value.filename}
                                      controls
                                      src={value.path} // Đã loại bỏ dấu ` trước và sau value.path
                                      style={{ width: '300px', height: '250px' }}
                                  />
                              </div>
                             
                            )

                          }
                           else {
                            return (
                              <img
                                // onClick={() => openModal(value.path)}
                                key={value.filename}
                                src={value.path}
                                style={{ width: '300px', height: '250px' }}
                              />
                            )
                          }
                        }
                      })
                    : m.fileCreateDto
                    ? m.fileCreateDto.map((value: any) => {
                        if (value.filename === 'blob') {
                          return (
                            <audio
                              key={value.filename}
                              controls
                              src={value.path}
                              style={{ width: '300px', height: '50px' }}
                            />
                          )
                        } else {
                          const extension = value.filename
                            .split('.')
                            .pop()
                            .toLowerCase()
                          if (extension === 'pdf') {
                            return (
                              <div className=''>
                              {<ShowPdf file={value}/>}
                               </div>
                            )
                          } else if (
                            extension === 'docx' ||
                            extension === 'doc'
                          ) {
                            return (
                              <div key={value.filename}>
                                  {<ShowWord file={value}/>}
                              </div>
                            )
                          } else if(extension==='mp4'||extension==="mov"){
                            return (
                              <video
                              key={value.filename}
                              controls
                              src={value.path} // Đã loại bỏ dấu ` trước và sau value.path
                              style={{ width: '300px', height: '250px' }}
                            />
                           
                            )

                          }else {
                            return (
                              <img
                                // onClick={() => openModal(value.path)}
                                key={value.filename}
                                src={value.path}
                                style={{ width: '300px', height: '250px' }}
                              />
                            )
                          }
                        }
                      })
                    : ''}
                  {m.messages&&m.messages.type!=='system'?
                  
                  <p>{m.messages&&m.messages.message}</p>
                  
                  :
                  <div className=' flex items-center justify-center  '>
                    
                  <div className={`text-center flex flex-col gap-1 w-full bg-red ${m&&messagesArray&& m.
                      id===messagesArray[messagesArray.length-1].
                      id?'pl-10 ml-4':''}`}>
                  {m.messages&&m.messages.type==='system'&&<p className={`bg-gray-400 m-auto px-7 py-1 font-medium rounded-md  text-white text-center `}>
                     {m.messages===null?"": moment(m.createdAt).fromNow()} 


                     
                   </p>}
                    
                 
                 <p  className=' px-7 py-1 font-medium rounded-md text-center text-black relative font-medium text-center'>
                     {m.messages&&m.messages!==null?m.messages.message:""}
                   
                 </p>
                    </div>
                  </div>
                 }
                   


                  <span className="text-sm text-gray-500">
                    {m.messages&&m.messages.type!=='system'&&<div>
                       {m?.createdAt&&format(new Date(String(m.createdAt)), "HH:mm")}
                    </div>}
                    <div className={`${m.messages.type!=='system'&&'dothover'}`} onClick={() => {setOpenModalUserChat(true); setSelectedUserReaction(m)}}>
                       {m.messages.type!=='system'&&<HiOutlineDotsHorizontal size={30} className=' ' />}
                    </div>
                    <div
                    className="absolute "
                    style={{
                      position: 'absolute',
                      right: '0px',
                      bottom: '-10px',
                      marginRight: '5px',
                    }}
                  >
                    <div className=" flex gap-2  p-1 ">
                      {m.emojis &&
                        m.emojis.length > 0 &&
                        m.emojis.map((value: any) => {
                          return (
                            <div className="flex  items-center gap-2">
                              {value.emoji === 'laugh' && (
                                <img
                                  src={
                                    value.emoji === 'laugh' ? imageLaugh : ''
                                  }
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'like' && (
                                <img
                                  src={value.emoji === 'like' ? imageLike : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'angry' && (
                                <img
                                  src={value.emoji === 'angry' ? imageAngry : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'sad' && (
                                <img
                                  src={value.emoji === 'sad' ? imageSad : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'love' && (
                                <img
                                  src={value.emoji === 'love' ? imageThumb : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                   
                  </span>
                  
                </span>
              </div>
            ))}
                  {loadingsending && wordchat ?(
                <div className={`flex flex-col items-end w-full ${fadeInClass}`} ref={chatContainerRef}>
                  <p className="bg-white mt-1 rounded mr-4 p-2 mb-1">
                    {wordchat}
                    <span className="text-sm text-gray-500">
                      {/* {format(new Date(String(m.timeThread)), "HH:mm")} */}
                    </span>
                  </p>
                  <p style={{fontSize:'12px'}} className='text-white px-2 mb-2 mt-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg'> 
                    <CiClock1 color='white'/> Đang gửi
                  </p>
                </div>
              ):
              <>
              {Channelid&&Channelid.threads.length > 0 && ( <div className='flex flex-col items-end w-full mb-2 py-1'> 
              <p style={{fontSize:'12px'}} className='text-white px-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg'> 
              <TiTickOutline color='white'/> Delivered
               </p></div>)}
              </>
              
             }
        </div>
      )}

              
    </div>
    

    )
}
