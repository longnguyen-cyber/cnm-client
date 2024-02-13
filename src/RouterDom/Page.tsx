import { lazy } from "react";
import {IRouteConfig} from '../Type'
const LoginPage=lazy(()=>{
    return new Promise((resolve:any)=>{
      setTimeout(()=>resolve(import('./pages/GroupLoginRegister/Index')),500)
    })
  })

  const Register=lazy(()=>{
    return new Promise((resolve:any)=>{
      setTimeout(()=>resolve(import('./pages/register/Register')),500)
    })
  })

  const Home=lazy(()=>{
    return new Promise((resolve:any)=>{
      setTimeout(()=>resolve(import('./pages/Home/Home')),500)
    })
  })

// const LoginPage=lazy(()=>import("./pages/login/Login"))
const AllPage: any = [
    {
      path: '/login',
      main: <LoginPage/>,
    },
    {
      path: '/',
      main: <LoginPage/>,
    },
    {
        path: '/Register',
        main: <Register/>,
      },

      {
        path: '/home',
        main: <Home/>,
      },
  
  ];
export default AllPage