import axios from 'axios';
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../loading';
import { notification } from 'antd';

export default function ActiveEmail() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
     const navigate=useNavigate()
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };
      useEffect(()=>{
        const vertifyEmail=async()=>{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
              };

              const {data}=await axios.get(`${process.env.REACT_APP_API_URL}users/verify-email?token=${token}`,config)
              console.log('Data verify')
              console.log(data)
              if(data){
                if(data.message==="Verify user success"){
                  localStorage.setItem("accessTokenToGen2fa", JSON.stringify(data));
                navigate('/login')
                notification["success"]({
                    message: "Thông báo",
                    description: "Tạo tài khoảng thành công!",
                  });
                }
              }          
            }
         vertifyEmail()
      },[token])

    
      
  return (
    <div><Loading/></div>
  )
}
