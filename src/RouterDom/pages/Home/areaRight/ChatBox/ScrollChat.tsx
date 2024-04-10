import React, { FunctionComponent, useContext, useEffect, useRef } from 'react'
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
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
interface PdfViewerProps {
  pdfUrl: string; // Định nghĩa kiểu dữ liệu của prop pdfUrl là string
}

moment.locale('vi');
export const ScrollChat: FunctionComponent<any> = ({ Channelid ,loadingsending,wordchat,imageUpload}) => {
    const ContexChat = useContext(UserContext);
    const { state } = ContexChat;
    const [users, setUser] = state.user
    const chatContainerRef = useRef<any>(null);
    const fadeInClass = "fade-in";
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [Channelid,wordchat]);
    return (
      <div>
      {Channelid && (
        <div className='content_Scroll' ref={chatContainerRef}  style={{
          width: '100%',
          maxHeight: `${
            imageUpload&&imageUpload.length>0  ? '60vh' : '85vh'
          }`,
          overflowY: 'scroll',
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
                  className='flex flex-col gap-1'
                >

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
                          } else {
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
                          } else {
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
                  
                  :<h3 className='text-center flex flex-col gap-1 bg-red'>
                  {m.messages&&m.messages.type==='system'&&<p className='bg-gray-400 px-7 py-1 font-medium rounded-md m-auto text-white text-center'>
                     
                     
                     {m.messages===null?"": moment(m.createdAt).fromNow()} 

                     
                   </p>}
                    
                 
                 <p  className=' px-7 py-1 font-medium rounded-md m-auto text-black font-medium text-center'>
                     {m.messages&&m.messages!==null?m.messages.message:""}
                 </p>
                    </h3>}
                   


                  <span className="text-sm text-gray-500">
                    {m.messages&&m.messages.type!=='system'&&format(new Date(String(m.createdAt)), "HH:mm")}
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
