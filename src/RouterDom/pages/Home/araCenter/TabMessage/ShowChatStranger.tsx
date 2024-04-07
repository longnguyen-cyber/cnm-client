import { Spin } from 'antd';
import React, { FunctionComponent } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export const ShowChatStranger:FunctionComponent<any>=({ListSingleChat,Loading,setselectedChats})=> {
 
  return (
    <div className='flex flex-col-reverse gap-3'>
    {
       !Loading?ListSingleChat?.map((itemChat: any, index: number) => (
        !itemChat.isFriend &&
            <div key={index} className="flex items-center pl-1 cursor-pointer" onClick={()=>{setselectedChats(itemChat)}}>
            <div className="flex-shrink-0">
              <div className="flex flex-wrap w-14 justify-center items-center">
                  <img key={index} className="w-14 h-14 rounded-full" src={`${itemChat&&itemChat.user.avatar?itemChat.user.avatar:""}`} alt="Avatar 1" />
              </div>
            </div>
            <div className="flex-grow ml-4">
              <div className="flex items-center  justify-between">
                <h4 className="text-lg font-medium">{itemChat.user.name}</h4>
                {format(new Date(String(itemChat.timeThread)), "HH:mm")}
              </div>
              <div className="text-gray-500">
                 
              {itemChat.lastedThread ?
              <div className='flex justify-between'>
                 {itemChat.lastedThread.messages?

                    itemChat.lastedThread.messages.message.length > 30 ?
                    itemChat.lastedThread.messages.message.substring(0, 51) + "..." :
                    itemChat.lastedThread.messages.message:"Có file được gửi "}
                <div></div>

                
              </div>
                
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
  );
};

export default ShowChatStranger;
