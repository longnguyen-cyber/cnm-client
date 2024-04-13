import React, { useContext, useEffect, useState, useRef } from 'react'

import { AiOutlineTags, AiOutlineArrowLeft } from "react-icons/ai";

import { MdKeyboardArrowLeft } from "react-icons/md";
import { LoadingOutlined } from '@ant-design/icons';

import { UserContext } from '../../../../../Context/UserContext';
import { IUser } from '../../../../../Type';
import Banner from '../HomeRightReComent/Banner';
import { GroupChat } from './GroupChat';
import './GroupChat.css'
import { useDispatch, useSelector } from 'react-redux';
import { UserGetChannelById } from '../../../../../feature/chat/pathApi';
import {ChatSingleSend} from './ChatSingleSend';
import { InformationChat } from './InformationChat';
import { ChaxBoxNoMustFriend } from './ChaxBoxNoMustFriend';
import InviteFriend from '../../araCenter/InviteFriend/InviteFriend';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const ChatBox = () => {
  const UserContexts = useContext(UserContext);
  const loadingchanneid = useSelector((state: any) => state.Chats.loadingchanneid)
  const dispatch = useDispatch();
  const { state } = UserContexts;
  const {socket} = state;
  const [selectedChat, setselectedChats] = state.selectedChat;
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [user, setUser] = state.user;


  useEffect(() => {
    if (selectedChat.id) {
      dispatch<any>(UserGetChannelById({ id: selectedChat.id }));
    }
  }, [selectedChat.id, submitSuccess])

  useEffect(() => {
    if(selectedChat.id){
      dispatch<any>(UserGetChannelById({ id: selectedChat.id }));
    }
  }, [submitSuccess])

  const submitChatSuccess = (data: any) => {
    setSubmitSuccess(data);
  }
  
  return (
    <div>
      {typeof selectedChat === 'object' && !Array.isArray(selectedChat) && selectedChat !== null ? 
      
      (
        <>
          <div>
            <div
              className='
                  h-full w-full
                  min-h-screen'
            >
              {typeof selectedChat === 'object' && selectedChat !== null
                &&
                <div className='chatBox'>
                  <div className=''>
                    {
                      selectedChat.receiveId&&selectedChat.isFriend ?
                        <>
                         <ChatSingleSend selectedChat={selectedChat} setselectedChats={setselectedChats}/>
                        </>
                        :
                     !selectedChat.users && !selectedChat.isFriend ?

                       <><ChaxBoxNoMustFriend selectedChat={selectedChat} setselectedChats={setselectedChats}/></>:

                        selectedChat.users ?
                          <>
                            <div>
                              <div className="flex items-center p-1">
                                <p className='presspreveriose' ><MdKeyboardArrowLeft onClick={() => { setselectedChats(null) }} size={30} className='text-gray-600 cursor-pointer -mr-3' /></p>
                                <div className="flex-shrink-0 pl-4">
                                  <div className="flex flex-wrap w-10 justify-center  items-center">
                                    {selectedChat.users.length > 0 && selectedChat.users.slice(0, 3).map((value: IUser, index: number) => <img key={index} className="w-5 h-5 rounded-full " src={`${value.avatar}`} alt="Avatar 1" />)}
                                    <p className='rounded-full text-gray-500  flex items-center justify-center  bg-gray-300 w-5 h-5'>{selectedChat.users.length - 3}</p>
                                  </div>
                                </div>
                                <div className=" ml-4">
                                  <div className="flex items-center">
                                    <h4 className="text-lg font-medium">{selectedChat.name}</h4>
                                  </div>
                                  <AiOutlineTags color='gray' className='mt-1' />
                                </div>
                              </div>

                              <div className='bg-gray-300'>
                                {<>
                                  <GroupChat loading={loadingchanneid}  submitChatSuccess={submitChatSuccess}/>
                                </>}
                              </div>
                            </div>
                          </>
                          : selectedChat==="ketban"?<div>
                            <p><InviteFriend/></p>
                          </div>:
                          <div className='flex flex-col  min-h-screen item-center justify-center'>
                            <Banner />
                          </div>
                    }
                  </div>
                    <InformationChat selectedChat={selectedChat} user={user} socket={socket}/>
                </div>
              }
            </div>
          </div>
        </>
      ) :
         selectedChat==="ketban"?<><InviteFriend/></>:
        <div className='flex flex-col  min-h-screen item-center justify-center'>
          <Banner />
        </div>}
    </div>
  )
}

export default ChatBox

