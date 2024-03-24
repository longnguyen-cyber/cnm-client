import React, { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'

import axios from 'axios';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { message, notification } from 'antd'
import ChatLoading from './SeachLoadingUser';
import { useDispatch, useSelector } from 'react-redux';
import { UserCreateSingleChat, userSeach } from '../../../../../feature/user/pathApi';
import { IUser } from '../../../../../Type';
import { UserContext } from '../../../../../Context/UserContext';
import { UserGetAllSingleChat, UserGetChatsSingleById } from '../../../../../feature/chat/pathApi';
import { listeners } from 'process';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const SearchUserAddChat: FunctionComponent<any> = ({ searchValue }) => {
    const contextUser = useContext(UserContext)
    const { state } = contextUser;
    const [user, setUser] = state.user;
    const {socket}=state;
    const chatSingleId = useSelector((state: any) => state.Chats.chatSingleId)
    const dispatch=useDispatch()
    const ListUsers = useSelector((state: any) => state.Users.UserSlice);
    const Loading = useSelector((state: any) => state.Users.loading)
    const [DataSocket,setDataSocket]=useState<any>(null)
    const [selectedChat, setselectedChats] = state.selectedChat;
    const ListSingleChat=useSelector((state:any)=>state.Chats.chatSingleSlide)
      useEffect(()=>{
        dispatch<any>(UserGetAllSingleChat());
      },[])
  

    useEffect(()=>{
         dispatch<any>(UserGetAllSingleChat())
    },[DataSocket])


    useEffect(() => {
        if (searchValue) {
            if (ListUsers) {
                dispatch<any>(userSeach({ name: searchValue }));
            }
        }
        else {

            dispatch<any>(userSeach({ name: "" }));
        }
    }, [searchValue])
    const getUserForChat = (value: any) => {

        if (value) {
            ListSingleChat.forEach((item: any) => {
                if (value.id===item.user.id&&item.isFriend===false) {
             
                   
                    // Nếu tìm thấy phần tử có receiveId khớp với value.id
                    setselectedChats(item);
                    dispatch<any>(UserGetChatsSingleById({ id: item.id }));
                    return
                   
                } 

                if (value.id===item.user.id&&item.isFriend===true) {
           
                   
                    // Nếu tìm thấy phần tử có receiveId khớp với value.id
                    setselectedChats(item);
                    dispatch<any>(UserGetChatsSingleById({ id: item.id }));
                    return
                   
                } 
                if(value.id!==item.user.id){
                   
                    setselectedChats(value);

                    dispatch<any>(UserGetChatsSingleById({ id: "" }));
                return
                }
               
            });
        }
        if(ListSingleChat.length===0){
            setselectedChats(value);
        }
    };
    

    return (
        <div className='bg-white h-full w-full'>
            <p className='font-medium text-sm mt-2 mb-2'>Tìm gần đây </p>
            {Loading ? <ChatLoading /> :
                <div className='flex flex-col gap-5'>
                    { typeof ListUsers==='undefined' || ListUsers.length === 0 ? <p className='text-center text-sm'>Không tìm thấy kết quả nào</p> :
                        <>
                            {ListUsers.map((value: any, index: number) => (<>
                                <div key={index} onClick={()=>{getUserForChat(value)}} className='flex gap-3 items-center hover:bg-gray-100 p-1 cursor-pointer'>
                                    <img src={`${value ? value.avatar : ""}`} className='w-12 h-12 rounded-full' />
                                    <div className='flex flex-col flex-1 '>
                                        <p>{value.name}</p>
                                        <p className='text-sm'>email: <span className='text-blue-400'>{value.email}</span></p>
                                    </div>
                                    {/* <p className=' rounded-full text-sm  px-2 cursor-pointer border border-blue-300 text-blue-400 py-1 hover:bg-blue-50' onClick={() => AddUserChat(value)}>  Add friend Chat </p> */}

                                </div>

                            </>))}
                            {Loading && <Spin indicator={antIcon} className='text-white mr-3' />}
                        </>
                    }
                </div>

            }

        </div>
    )
}

export default SearchUserAddChat