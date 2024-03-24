import React, { FunctionComponent, useState } from 'react'
import { IUser } from '../../../../Type'
import { AiOutlineTags } from 'react-icons/ai'
import Tabmessage from './TabMessage'
import './AreaCenter.css'
import NhatKy from './NhatKy/NhatKy'
export const  AreaCenter:FunctionComponent<any>=({listUser,tabCurrent}) =>{
  return (
    <>
    {tabCurrent && tabCurrent === "measages" ? 
      <div className=" flex-1 message flex-shrink-0 ground-menu" >
        <Tabmessage/>
      </div>:<div>
        <NhatKy/>

      </div>
      
    }
    </>

  )
}
