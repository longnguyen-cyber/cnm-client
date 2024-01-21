import React, { FunctionComponent } from 'react'
import { IUser } from '../../../../Type'
import { AiOutlineTags } from 'react-icons/ai'

export const  AreaCenter:FunctionComponent<{listUser:IUser[]}>=({listUser}) =>{
    console.log(listUser)
  return (
    <div className='p-5'>
        {listUser&&listUser.map((value:IUser,index:number)=>{
            return <div key={index} className='flex items-center p-1'>        
              {value && <div className='flex gap-3 items-center px-5'>
                  <img src={`${value.avatar}`} className='w-12 h-12 rounded-full' />
                  <div>
                      <p className='text-xl font-medium '>{value.name}</p>
                      <AiOutlineTags color='gray' className='mt-1' />
                  </div>

              </div>}
          </div>
        })}
    </div>
  )
}
