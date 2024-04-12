import { Spin } from 'antd';
import React, { FunctionComponent } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const ShowChatMessage: FunctionComponent<any> = ({ ListChannel, Loading ,setselectedChats}) => {
 
  return (
    <div className='flex flex-col gap-5 w-full' style={{ width: '100%' }}>
      {
    !Loading&&ListChannel?ListChannel?.map((item: any, index: number) => (
        <div key={index} className="flex items-center pl-1 cursor-pointer"  onClick={()=>{ setselectedChats(item);}} >
          <div className="flex-shrink-0">
            <div className="flex flex-wrap w-10 justify-center items-center">
              {item && item.users.slice(0, 3).map((value: any, index: number) => (
                <img key={index} className="w-5 h-5 rounded-full" src={`${value?value.avatar:""}`} alt="Avatar 1" />
              ))}
              <p className='rounded-full text-gray-500 flex items-center justify-center bg-gray-300 w-5 h-5'>{item.users.length - 3}</p>
            </div>
          </div>
          <div className="flex-grow ml-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">{item.name}</h4>
              {format(new Date(String(item.timeThread)), "HH:mm")}
            </div>
            <div className="text-gray-500">
             
             
              {item.lastedThread ?
              <div className='flex justify-between'>
            {item.lastedThread.messages?

                  item.lastedThread.messages.message.length > 30 ?
                  item.lastedThread.messages.message.substring(0, 51) + "..." :
                  item.lastedThread.messages.message:"Có file được gửi "}
                <div></div>

                
              </div>
                
                :
                <div className='flex justify-between  w-full inline-flex'>
                  <p className='flex-1' style={{ fontWeight: '450' }}>
                    {!item.latesMessage ? <span> [Thiệp] Gửi lời chào đế... </span> : ""}
                  </p>
                  <p className='ml-auto mr-2 font-bold text rounded-full text-white bg-red-600 flex items-center justify-center w-4 h-4' style={{ fontSize: "12px" }}>N</p>
                </div>
              }
            </div>
          </div>
        </div>
      ))
      : <Spin indicator={antIcon} />
      }
    </div>
  );
};

export default ShowChatMessage;
