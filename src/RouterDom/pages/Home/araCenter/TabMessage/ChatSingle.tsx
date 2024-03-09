import { Spin } from 'antd'
import React, { FunctionComponent } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const ChatSingle:FunctionComponent<any>=({ListSingleChat,Loading,setselectedChats})=> {
 console.log(ListSingleChat)
  return (
    <div className='flex flex-col-reverse gap-3'>
    {
       !Loading?ListSingleChat?.map((itemChat: any, index: number) => (
            <div key={index} className="flex items-center pl-1 cursor-pointer" onClick={()=>{setselectedChats(itemChat)}}>
            <div className="flex-shrink-0">
              <div className="flex flex-wrap w-14 justify-center items-center">
                  <img key={index} className="w-14 h-14 rounded-full" src={`${itemChat?itemChat.user.avatar:""}`} alt="Avatar 1" />
              </div>
            </div>
            <div className="flex-grow ml-4">
              <div className="flex items-center">
                <h4 className="text-lg font-medium">{itemChat.user.name}</h4>
              </div>
              <div className="text-gray-500">
                {itemChat.latesMessage ?
                  (itemChat.latesMessage.content && itemChat.latesMessage.content.length > 30 ?
                    itemChat.latesMessage.content.substring(0, 51) + "..." :
                    itemChat.latesMessage.content)
                  :
                  <div className='flex justify-between  w-full inline-flex'>
                    <p className='flex-1' style={{ fontWeight: '450' }}>
                      {!itemChat.latesMessage ? <span> [Thiệp] Gửi lời chào đế... </span> : ""}
                    </p>
                    <p className='ml-auto mr-2 font-bold text rounded-full text-white bg-red-600 flex items-center justify-center w-4 h-4' style={{ fontSize: "12px" }}>N</p>
                  </div>
                }
              </div>
            </div>
          </div>
        ))
        :<Spin indicator={antIcon}  /> 

    }
    </div>

   
  )
}
