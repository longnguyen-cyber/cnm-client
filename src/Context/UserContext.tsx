import React from 'react'
import { createContext, useState, useEffect } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import io, { Socket } from 'socket.io-client'
import { IUser } from '../Type';
import { useNavigate } from 'react-router-dom';
const UserContext=createContext<any>(null);
const tokenLocal:any=localStorage.getItem('tokenUser');
console.log(tokenLocal)
const userTokenString:any=localStorage.getItem('user');
const UserContextProvider=({children}: {children: React.ReactNode})=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [user,setUser]=useState<IUser| null>(null);
    const [idUser,setIdUser]=useState<string>("");
    const [socket, setSocket] = useState<Socket>(null!);
    const [token,setToken]=useState<string|null>(null);
    const [selectedChat, setselectedChats] = useState<any>([]);
    useEffect(()=>{
      
      async function connectSocket(){
        const UserLogin:IUser=JSON.parse(userTokenString);
        const idUser= UserLogin?UserLogin.id:null;
        if(UserLogin){
          navigate('/home')
          const newSocket = io("http://localhost:8080/", {
            auth: { idUser },
          })
          setSocket(newSocket);
          setUser(UserLogin)
          if(UserLogin.token){
            setToken(UserLogin.token)
          }
        }
       return ()=>socket.close();
    }
    connectSocket();
      
    },[]);
    const state = {
      user: [user, setUser],
      idUser: [idUser, setIdUser],
      token: [token, setToken],
      socket: socket,
      selectedChat: [selectedChat, setselectedChats]
    };

    return (
      <UserContext.Provider value={{state}}>{children}</UserContext.Provider>
    )
  }
  
  export {UserContext,UserContextProvider}