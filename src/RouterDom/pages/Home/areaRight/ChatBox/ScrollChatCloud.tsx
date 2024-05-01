import { format } from 'date-fns'
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { BiMessageRoundedX } from 'react-icons/bi'
import { CiClock1 } from 'react-icons/ci'
import { FaFilePdf } from 'react-icons/fa'
import { MdDeleteForever, MdDeleteOutline, MdFileDownload, MdSendToMobile } from 'react-icons/md'
import { TiTickOutline } from 'react-icons/ti'
import { UserContext } from '../../../../../Context/UserContext'
import imageLaugh from '../../../../../image/react/laughing.png'
import imageSad from '../../../../../image/react/sad.png'
import imageThumb from '../../../../../image/react/thumbs-up-32.png'
import imageLike from '../../../../../image/react/like.png'
import imageLove from '../../../../../image/react/love.png'
import imageWow from '../../../../../image/react/wow.png'
import imageAngry from '../../../../../image/react/angry-32.png'
import { IoPinSharp } from "react-icons/io5";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from './ConfigUserChatSingle'
import './GroupChat.css'
import { ImageModal } from './ImageModal'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { TbMessageCircleCancel } from 'react-icons/tb'
import { Modal } from 'antd'
import { ShowWord } from './WordAndPdf/ShowWord'
import { ShowPdf } from './WordAndPdf/ShowPdf'

export const ScrollChatCloud: FunctionComponent<any> = ({
  Channelid,
  loadingsending,
  wordchat,
  imageUpload,
}) => {
  const ContexChat = useContext(UserContext)
  const { state } = ContexChat
  const [users, setUser] = state.user
  const { socket } = state
  const chatContainerRef = useRef<any>(null)
  const fadeInClass = 'fade-in'
  const [showOptions, setShowOptions] = useState(false)
  const [userClick, setUserClick] = useState<any>(null)
  const [quantitys, setQuantity] = useState<any>(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [openModalUserChat, setOpenModalUserChat] = useState(false)
  const [selectedUserReaction, setSelectedUserReaction] = useState<any>(null)



  const handlePinMessage=()=>{
   
    
  }

  const openModal = (imageSrc: any) => {
    setCurrentImage(imageSrc)
    setIsModalOpen(true)
  }


 







  const modalToReactionMessage = () => {
    console.log('modal', selectedUserReaction)
    return (
      <Modal className=' mt-80 flex justify-center items-center' title="" open={openModalUserChat} onOk={() => { setOpenModalUserChat(false) }} onCancel={() => { setOpenModalUserChat(false) }}>
       
        

        <div className='flex items-center justify-center mt-2 gap-2'>
           <IoPinSharp  size={25} className='cursor-pointer text-red-500'  onClick={handlePinMessage}/>
        </div>

        {selectedUserReaction && selectedUserReaction.user.id === users?.id &&
          <div className='flex items-center justify-center mt-2 gap-2'>

            <MdDeleteOutline size={25} className='cursor-pointer text-red-500' />
            {/* <TbMessageCircleCancel size={25} className='cursor-pointer text-red-500' onClick={() => { RecallSendThread() }} /> */}
            <MdSendToMobile size={25} className='cursor-pointer text-red-500' />
            
          </div>
        }

      </Modal>
    )
  }



  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [Channelid, wordchat])
  return (
  
    <div>
        {selectedUserReaction&&modalToReactionMessage()}
      {Channelid && Channelid.threads ? (
        <div
          className="content_Scroll"
          style={{
            width: '100%',
            maxHeight: `${imageUpload && imageUpload.length > 0 ? '70vh' : '85vh'
              }`,
            overflowY: 'scroll',
          }}
          ref={chatContainerRef}
        >
          {Channelid.threads
            .slice()
            .sort(
              (a: any, b: any) =>
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime()
            )
            .map((m: any, i: any, messagesArray: any) => (
              <div style={{ display: 'flex', marginLeft: '20px' }} key={m._id}>
               
                <ImageModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  src={currentImage}
                />

               
                <span
                  style={{
                    backgroundColor: `${'white'
                      }`,
                    marginLeft: 'auto',
                    marginTop: 10,
                    borderRadius: '5px',
                    padding: '0px 10px',
                    maxWidth: '75%',
                    minWidth: '100px',
                  }}
                  className="flex dothovergroup relative flex-col gap-1 mb-3 mt-3 cursor-pointer"
                  onClick={() => {
                    setShowOptions(!showOptions)
                    setUserClick(m)
                  }}
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
                        }
                        else if(extension==='mp4'||extension==="mov"||extension==='mp3'){
                          return (
                            <div >
                             
                                <video controls style={{ width: '300px',height:'150px' }}>
                                {/* Đường dẫn đến tập tin video */}
                                <source src={value.path} />
                                {/* Nếu trình duyệt không hỗ trợ định dạng video này */}
                               
                            </video>
                            </div>
                         
                          )

                        }
                        
                        else {
                          return (
                            <img
                              onClick={() => openModal(value.path)}
                              key={value.filename}
                              src={value.path}
                              style={{ width: '400px', height: '400px' }}
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
                          }

                          else if(extension==='mp4'||extension==="mov"||extension==='mp3'){
                            return (
                              <div >
                               
                                  <video controls style={{ width: '300px',height:'150px' }}>
                                  {/* Đường dẫn đến tập tin video */}
                                  <source src={value.path} />
                                  {/* Nếu trình duyệt không hỗ trợ định dạng video này */}
                                 
                              </video>
                              </div>
                           
                            )

                          }
                          
                          
                          else {
                            return (
                              <img
                                onClick={() => openModal(value.path)}
                                key={value.filename}
                                src={value.path}
                                style={{ width: '400px', height: '400px' }}
                              />
                            )
                          }
                        }
                      })
                      : ''}
                  <p>{m.messages ? m.messages.message : ''}</p>

                  <div className={`${m.user === null ? "" : "dothover"}`} onClick={() => { setOpenModalUserChat(true); setSelectedUserReaction(m) }}>
                    {m.user !== null && <HiOutlineDotsHorizontal size={30} className=' ' />}
                  </div>
                  <span className="text-sm text-gray-500 mb-4">
                    {/* {m.createdAt ? (
                      <>{format(new Date(String(m.createdAt)), 'HH:mm')}</>
                    ) : (
                      <>{format(new Date(String(m.timeThread
                      )), 'HH:mm')}</>
                    )} */}
                  </span>
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
              </div>
            ))}

          {wordchat ? (
            <div
              className={`flex flex-col items-end w-full ${fadeInClass}`}
              ref={chatContainerRef}
            >
              <p className="bg-white mt-1 rounded mr-4 p-2 mb-3">
                {wordchat}
                <span className="text-sm text-gray-500">
                  {/* {format(new Date(String(m.timeThread)), "HH:mm")} */}
                </span>
              </p>
              <p
                style={{ fontSize: '12px' }}
                className="text-white px-2 mb-2 mt-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg"
              >
                <CiClock1 color="white" /> Đang gửi
              </p>
            </div>
          ) : (
            <>
              {Channelid && Channelid.threads.length > 0 && (
                <div className="flex flex-col items-end w-full mb-2 py-1">
                  <p
                    style={{ fontSize: '12px' }}
                    className="text-white px-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg"
                  >
                    <TiTickOutline color="white" /> Delivered
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="content_Scroll" ref={chatContainerRef}>
          {wordchat ? (
            <div
              className={`flex flex-col items-end w-full ${fadeInClass}`}
              ref={chatContainerRef}
            >
              <p className="bg-white mt-1 rounded mr-4 p-2 mb-3">
                {wordchat}
                <span className="text-sm text-gray-500">
                  {/* {format(new Date(String(m.timeThread)), "HH:mm")} */}
                </span>
              </p>
              {/* <p style={{fontSize:'12px'}} className='text-white px-2 mb-2 mt-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg'>
                    <CiClock1 color='white'/> Đang gửi
                  </p> */}
            </div>
          ) : (
            <>
              {
                <div className="flex flex-col items-end w-full mb-2 py-1">
                  <p
                    style={{ fontSize: '12px' }}
                    className="text-white px-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg"
                  >
                    <TiTickOutline color="white" /> Delivered
                  </p>
                </div>
              }
            </>
          )}
        </div>
      )}
    </div>
  )
}
