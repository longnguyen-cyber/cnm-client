'use client'

import { store } from '@/redux/store'
import React, { Fragment, useEffect } from 'react'
import { ToastContainer } from 'react-custom-alert'
import 'react-custom-alert/dist/index.css'
import { Provider } from 'react-redux'
import { io } from 'socket.io-client'
const socket = io('http://localhost:8002')

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  window.addEventListener('beforeunload', function (e) {
    var confirmationMessage = 'o/'

    ;(e || window.event).returnValue = confirmationMessage //Gecko + IE
    return confirmationMessage //Webkit, Safari, Chrome
  })

  useEffect(() => {
    // Connect to the socket
    socket.on('connect', () => {
      console.log('socket connected')
    })

    // Set an interval to send a message to the server every 10 seconds
    const intervalId = setInterval(() => {
      socket.emit('message', 'Hello server') // Replace 'message' and 'Hello server' with your actual event name and data
    }, 10000) // 10000 milliseconds = 10 seconds

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  return (
    <Fragment>
      <ToastContainer floatingTime={1000} />
      <Provider store={store}>{children}</Provider>
    </Fragment>
  )
}

export default Wrapper
