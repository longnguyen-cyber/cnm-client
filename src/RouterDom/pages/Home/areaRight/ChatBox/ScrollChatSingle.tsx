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
import { MdDeleteForever, MdFileDownload } from 'react-icons/md'
import { TiTickOutline } from 'react-icons/ti'
import { UserContext } from '../../../../../Context/UserContext'
import imgAngry from '../../../../../image/angry-32.png'
import imgLaughing from '../../../../../image/laughing.png'
import imgLike from '../../../../../image/like.png'
import imgSad from '../../../../../image/sad.png'
import imgThumbs from '../../../../../image/thumbs-up-32.png'
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from './ConfigUserChatSingle'
import './GroupChat.css'
import { ImageModal } from './ImageModal'
export const ScrollChatSingle: FunctionComponent<any> = ({
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

  const openModal = (imageSrc: any) => {
    setCurrentImage(imageSrc)
    setIsModalOpen(true)
  }
  const deletMessage = async (item: any) => {
    const dataDelete = {
      stoneId: userClick.stoneId,
      receiveId: userClick.receiveId,
      type: 'chat',
    }
    if (socket) {
      // console.log('bat dau recall')
      socket.emit('deleteThread', dataDelete)
    }
  }
  const recallMessage = async (item: any) => {
    const dataRecall = {
      stoneId: userClick.stoneId,
      receiveId: userClick.receiveId,
      type: 'chat',
    }
    if (socket) {
      // console.log('bat dau recall')
      // socket.emit('recallSendThread', dataRecall)
    }
  }

  const setEmoJi = (value: any) => {
    setQuantity(quantitys + 1)
    const dataEmoji = {
      stoneId: userClick.stoneId,
      receiveId: Channelid.receiveId,
      typeEmoji: 'add',
      emoji: value,
    }
    console.log('dataEmoji', dataEmoji)
    if (socket) {
      socket.emit('emoji', dataEmoji)
    }
  }

  const MessageOptionsForm = (item: any) => {
    const fadeInAnimation = `@keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }`

    return (
      <>
        <style>{fadeInAnimation}</style>
        <div
          style={{
            zIndex: '100',
            position: 'fixed',
            top: '50%',
            left: '50%',
            width: '300px',
            height: `${
              userClick.senderId === users.id || userClick.user.id === users.id
                ? '200px'
                : '100px'
            }`,
            backgroundColor: '#fff',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            animation: 'fadeIn 0.5s ease-out', // Áp dụng hiệu ứng animation fade-in
          }}
        >
          <div
            style={{
              alignSelf: 'flex-end',
              cursor: 'pointer',
              padding: '5px',
            }}
            onClick={() => setShowOptions(false)}
          >
            &#10005;
          </div>

          <div className="flex items-end gap-1">
            {/* Thêm các emoji ở đây */}
            <p className="text-2xl">
              <img
                src={`${imgLike}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setEmoJi('like')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imgAngry}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setEmoJi('angry')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imgLaughing}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setEmoJi('laugh')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imgSad}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setEmoJi('sad')}
              />
            </p>
            <p className="text-2xl">
              <img
                src={`${imgThumbs}`}
                style={{ transition: 'width 0.3s, height 0.3s' }}
                className="hoverEffect"
                onClick={() => setEmoJi('love')}
              />
            </p>
          </div>

          {userClick.user.id === users.id && (
            <button
              className="flex items-center gap-2 text-red-500 "
              onClick={() => {
                recallMessage(item)
              }}
            >
              <BiMessageRoundedX />
              Thu hồi tin nhắn
            </button>
          )}
          {userClick.user.id === users.id && (
            <button
              className="flex items-center gap-2 text-red-500 "
              onClick={() => {
                deletMessage(item)
              }}
            >
              {' '}
              <MdDeleteForever /> xóa tin nhắn
            </button>
          )}
          {userClick.user.id !== users.id && (
            <button
              className="flex items-center gap-2 text-red-500 "
              onClick={() => {
                deletMessage(item)
              }}
            >
              {' '}
              <MdDeleteForever /> xóa tin nhắn phía bạn{' '}
            </button>
          )}
        </div>
      </>
    )
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [Channelid, wordchat])
  return (
    <div>
      {Channelid && Channelid.threads ? (
        <div
          className="content_Scroll"
          style={{
            width: '100%',
            maxHeight: `${
              imageUpload && imageUpload.length > 0 ? '70vh' : '85vh'
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
                {(isSameSender(messagesArray, m, i, users.id) ||
                  isLastMessage(messagesArray, i, users.id)) && (
                  <img
                    src={`${
                      m.user.avatar
                        ? m.user.avatar
                        : 'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4='
                    }`}
                    className="w-12 h-12 rounded-full"
                    style={{ marginLeft: '-20px', marginTop: '-10px' }}
                  />
                )}
                <ImageModal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  src={currentImage}
                />

                {showOptions && m.id === userClick.id && (
                  <MessageOptionsForm onClose={() => MessageOptionsForm(m)} />
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.user.senderId === users.id ? 'white' : 'white'
                    }`,
                    marginLeft: isSameSenderMargin(
                      messagesArray,
                      m,
                      i,
                      users.id
                    ),
                    marginTop: isSameUser(messagesArray, m, i) ? 5 : 10,
                    borderRadius: '5px',
                    padding: '0px 10px',
                    maxWidth: '75%',
                    minWidth: '100px',
                  }}
                  className="flex relative flex-col gap-1 mb-3 mt-3 cursor-pointer"
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
                              <div key={value.filename}>
                                <FaFilePdf
                                  size={30}
                                  style={{
                                    marginRight: '5px',
                                    color: 'red',
                                    width: '50px',
                                  }}
                                />{' '}
                                {/* PDF icon */}
                                {/* <embed
                                  src={value.path}
                                  type="application/pdf"
                                  style={{ width: '100%', height: '20px' }}
                                /> */}
                                <a>Download PDF</a>
                              </div>
                            )
                          } else if (
                            extension === 'docx' ||
                            extension === 'doc'
                          ) {
                            return (
                              <div key={value.filename}>
                                {/* <iframe
                                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                    value.path
                                  )}`}
                                  style={{ width: '100%', height: '300px' }}
                                  title="Word Document Viewer"
                                /> */}
                                <a>Download Word</a>
                              </div>
                            )
                          } else {
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
                              <div key={value.filename}>
                                <FaFilePdf style={{ marginRight: '5px' }} />{' '}
                                {/* PDF icon */}
                                {/* <embed
                                  src={value.path}
                                  type="application/pdf"
                                  style={{ width: '100%', height: '20px' }}
                                /> */}
                                <a>
                                  <MdFileDownload />
                                  Download PDF
                                </a>
                              </div>
                            )
                          } else if (
                            extension === 'docx' ||
                            extension === 'doc'
                          ) {
                            return (
                              <div key={value.filename}>
                                {/* <iframe
                                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                    value.path
                                  )}`}
                                  style={{ width: '100%', height: '300px' }}
                                  title="Word Document Viewer"
                                /> */}
                                <a>
                                  <MdFileDownload />
                                  Download Word
                                </a>
                              </div>
                            )
                          } else {
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
                  {/* <p>{m.messages ? m.stoneId : ""}</p> */}

                  <p>{m.messages ? m.messages.message : ''}</p>
                  <span className="text-sm text-gray-500 mb-4">
                    {m.createdAt ? (
                      <>{format(new Date(String(m.createdAt)), 'HH:mm')}</>
                    ) : (
                      <>{format(new Date(String(m.timeThread)), 'HH:mm')}</>
                    )}
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
                    <div className="bg-white flex gap-2 rounded-md p-1 border">
                      {m.emojis &&
                        m.emojis.length > 0 &&
                        m.emojis.map((value: any) => {
                          return (
                            <div className="flex  items-center gap-2">
                              {value.emoji === 'laugh' && (
                                <img
                                  src={
                                    value.emoji === 'laugh' ? imgLaughing : ''
                                  }
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'like' && (
                                <img
                                  src={value.emoji === 'like' ? imgLike : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'angry' && (
                                <img
                                  src={value.emoji === 'angry' ? imgAngry : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'sad' && (
                                <img
                                  src={value.emoji === 'sad' ? imgSad : ''}
                                  style={{ width: '20px', height: '20px' }}
                                />
                              )}
                              {value.emoji === 'love' && (
                                <img
                                  src={value.emoji === 'love' ? imgThumbs : ''}
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
