import { lazy } from "react";
import { IRouteConfig } from '../Type'
import ForgotPassword from "./pages/login/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/login/ForgotPassword/ResetPassword";

const LoginPage = lazy(() => {
  return new Promise((resolve: any) => {
    setTimeout(() => resolve(import('./pages/GroupLoginRegister/Index')), 100)
  })
})

const ActiveEmail = lazy(() => {
  return new Promise((resolve: any) => {
    setTimeout(() => resolve(import('./pages/register/ActiveEmail')), 100)
  })
})

const Register = lazy(() => {
  return new Promise((resolve: any) => {
    setTimeout(() => resolve(import('./pages/register/Register')), 100)
  })
})

const Home = lazy(() => {
  return new Promise((resolve: any) => {
    setTimeout(() => resolve(import('./pages/Home/Home')), 100)
  })
})

// const LoginPage=lazy(()=>import("./pages/login/Login"))
const AllPage: any = [
  {
    path: '/login',
    main: <LoginPage />,
  },
  {
    path: '/',
    main: <LoginPage />,
  },
  {
    path: '/Register',
    main: <Register />,
  },

  {
    path: '/home',
    main: <Home />,
  },
  {
    path:'auth/verify-email',
    main:<ActiveEmail/>
  },
  {
    path:'/forgot-password',
    main:<ForgotPassword/>
  },
  {
    path:'auth/reset-password',
    main:<ResetPassword/>
  }

];
export default AllPage