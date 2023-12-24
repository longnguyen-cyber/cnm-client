'use client'

import { store } from '@/redux/store'
import React, { Fragment } from 'react'
import { ToastContainer } from 'react-custom-alert'
import 'react-custom-alert/dist/index.css'
import { Provider } from 'react-redux'
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fragment>
      <ToastContainer floatingTime={1000} />
      <Provider store={store}>{children}</Provider>
    </Fragment>
  )
}

export default Wrapper
