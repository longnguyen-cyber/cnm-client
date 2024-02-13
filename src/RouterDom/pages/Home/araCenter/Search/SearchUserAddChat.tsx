import React, { FunctionComponent, useEffect, useState } from 'react'

import axios from 'axios';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {message,notification} from 'antd'
import ChatLoading from './SeachLoadingUser';
import { useDispatch, useSelector } from 'react-redux';
import { userSeach } from '../../../../../feature/user/pathApi';
import { IUser } from '../../../../../Type';
interface IUserdemo {
    id: string;
    name: string;
    email: string;
    phone:string,
    avatar:string
  
  }
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const SearchUserAddChat: FunctionComponent<any> = ({searchValue }) => {

    // alert(searchValue) const [Loading,setLoading]=useState(false)
     // lay cai mang userSlide
     const ListUsers = useSelector((state: any) => state.Users.UserSlice);
     
     const Loading=useSelector((state:any)=>state.Users.loading)
     
     
     //tao du lieu mau
     
   
    const AddUserChat=(value:any)=>{
        notification.success({message:'Thêm bạn thành công'})
    }
 
     const dispatch = useDispatch();
     useEffect(()=>{
        if(searchValue){
            if(ListUsers){
                dispatch<any>(userSeach({name: searchValue }));
            }
        }
        else{
            
            dispatch<any>(userSeach({name: "" }));
            console.log(ListUsers)
        }
     },[searchValue])

    return (
        <div className='bg-white h-full w-full'>
            <p className='font-medium text-sm mt-2 mb-2'>Tìm gần đây </p>
            {Loading ? <ChatLoading /> :
             <div className='flex flex-col gap-5'>
                {ListUsers.length===0 ? <p className='text-center text-sm'>Không tìm thấy kết quả nào</p>:
                 <>
                    {ListUsers.map((value: any, index:number) => (<>
                                                <div key={index} className='flex gap-3 items-center hover:bg-gray-100 p-1 cursor-pointer'>
                                                    <img src={`${value ? value.avatar : ""}`} className='w-12 h-12 rounded-full' />
                                                    <div className='flex flex-col flex-1 '>
                                                        <p>{value.name}</p>
                                                        <p className='text-sm'>email: <span className='text-blue-400'>{value.email}</span></p>
                                                    </div>
                                                    <p className=' rounded-full text-sm  px-2 cursor-pointer border border-blue-300 text-blue-400 py-1 hover:bg-blue-50' onClick={()=>AddUserChat(value)}>  Add friend Chat </p>
                                                
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