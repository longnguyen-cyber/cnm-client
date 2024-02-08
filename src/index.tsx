import React from 'react'
import { ToastContainer } from 'react-custom-alert'
import 'react-custom-alert/dist/index.css'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import Index from './components/Index'
import Login from './components/Login'
import SocketClient from './components/SocketClient'
import ErrorPage from './error-page'
import 'react-custom-alert/dist/index.css'
import './globals.css'
import './index.css'
import { store } from './redux/store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <ErrorPage />,
    children: [],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
])
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <SocketClient>
        <Provider store={store}>
          <ToastContainer floatingTime={1000} />
          <RouterProvider router={router} />
        </Provider>
      </SocketClient>
    </RecoilRoot>
  </React.StrictMode>
)
