import React, { FunctionComponent, useContext, useEffect, useRef } from 'react'
import { UserContext } from '../../../../../Context/UserContext'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './ConfigUserChatSingle';
import { format } from 'date-fns';
import './GroupChat.css'
import { CiClock1 } from "react-icons/ci";
import { TiTickOutline } from "react-icons/ti";
import ScrollableFeed from "react-scrollable-feed";
export const ScrollChatSingle: FunctionComponent<any> = ({ Channelid ,loadingsending,wordchat}) => {
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
      {Channelid && Channelid.threads ? (
        <div className='content_Scroll' ref={chatContainerRef}>
          {Channelid.threads
            .slice()
            .sort((a:any, b:any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
            .map((m:any, i:any, messagesArray:any) => (
              <div style={{ display: "flex", marginLeft:'20px' }} key={m._id}>
                {(isSameSender(messagesArray, m, i, users.id) ||
                  isLastMessage(messagesArray, i, users.id)) && (
                    
                   <img
                      src={`${m.user.avatar}`}
                      className="w-12 h-12 rounded-full"
                      style={{marginLeft:"-20px",marginTop:'-10px'}}
                   />
                )}
                <span
                  style={{
                    backgroundColor: `${
                      m.user.senderId === users.id ? "white" : "white"
                    }`,
                    marginLeft: isSameSenderMargin(messagesArray, m, i, users.id),
                    marginTop: isSameUser(messagesArray, m, i) ? 5 : 10,
                    borderRadius: "5px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                  className='flex flex-col gap-1'
                >
                  <p>{m.messages.message}</p>
                  <span className="text-sm text-gray-500">
                    {format(new Date(String(m.createdAt)), "HH:mm")}
                  </span>
                </span>
              </div>
            ))}
           
                  {loadingsending && wordchat?(
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
      ):
      (
        <div className='content_Scroll' ref={chatContainerRef}>
                  {loadingsending && wordchat?(
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
              {( <div className='flex flex-col items-end w-full mb-2 py-1'> 
              <p style={{fontSize:'12px'}} className='text-white px-2 bg-gray-400 flex items-center mr-4 gap-1 rounded-lg'> 
              <TiTickOutline color='white'/> Delivered
               </p></div>)}
              </>
              
             }
        </div>
      )
      
      }

              
    </div>
    

    )
}
