import React, { FunctionComponent } from 'react'
import { IUser } from '../../../../../Type'
import { CiWarning } from 'react-icons/ci'
import { MdDelete } from 'react-icons/md'
import { IoIosLogOut } from 'react-icons/io'
import { RiUserAddFill } from 'react-icons/ri'

export const InformationChat:FunctionComponent<any>=({selectedChat,user})=> {
  return (
  
    <div className='col-md-2 h-full overflow-y-auto relative'>
    <div className='flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200'>
      <p className='font-medium text-xl'>Thông tin nhóm </p>
    </div>
    <div className='border border-gray-200 h-44 w-auto '>
      <div className='flex justify-center items-center '>
        {
          typeof selectedChat === 'object' && selectedChat !== null ?
        
            selectedChat.receiveId ?
              <div className='flex gap-3 items-center px-5'>
                <img src={`${selectedChat.user ? selectedChat.user.avatar : ""}`} className='w-16 h-16 mt-8 rounded-full' />
                <div>
                </div>
              </div> :
                   !selectedChat.receiveId &&      !selectedChat.users ?
      
               <div className='flex gap-3 items-center px-5'>
                           <img src={`${selectedChat ? selectedChat.avatar : ""}`} className='w-16 h-16 mt-8 rounded-full' />
               </div>
                   :
              <>
                <div className="flex flex-wrap w-24  justify-center mt-8  items-center">

                  {selectedChat.users.length > 0 && selectedChat.users.slice(0, 3).map((value: IUser, index: number) => <img className="w-10 h-10 rounded-full " src={`${value.avatar}`} alt="Avatar 1" />)}
                  <p className='rounded-full text-gray-500  flex items-center justify-center  bg-gray-300 w-10 h-10'>{selectedChat.users.length > 3 - 3}</p>
                </div>

              </>
            : ""
        }
      </div>
      <div>
        {selectedChat.receiveId ?
          <>
            <p style={{ fontSize: '25px', fontWeight: "500px" }} className='text-center mt-2 font-semibold'>{selectedChat.user.name}</p>
            <div className='absolute bottom-1 p-2'>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><CiWarning />Xóa lịch sử nhóm chat </p>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><MdDelete /> Xóa nhóm</p>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><IoIosLogOut /> Rời nhóm chat</p>
            </div>
          </> :
          
          !selectedChat.receiveId &&      !selectedChat.users ?
<>
            <p style={{ fontSize: '25px', fontWeight: "500px" }} className='text-center mt-2 font-semibold'>{selectedChat.name}</p>
            <div className='absolute bottom-1 p-2'>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><CiWarning />Xóa lịch sử nhóm chat </p>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><MdDelete /> Xóa nhóm</p>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><IoIosLogOut /> Rời nhóm chat</p>
            </div>
          </> 
      :
          
          <div>
            <p style={{ fontSize: '25px', fontWeight: "500px" }} className='text-center mt-2  mb-4 font-semibold'>{selectedChat.name}</p>
            <div className=' flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200'>
              <p className='font-medium text-xl'>Thành viên  </p>
            </div>
            <div className='flex justify-center items-center'>
              <button className='btn btn-blue bg-gray-200 p-2 flex items-center gap-2 rounded-sm mt-3'>  <RiUserAddFill color='gray' />  Thêm thành viên vào nhóm </button>
            </div>
            <h1 className='font-medium mt-3 mb-3 pl-3'>Danh sách thành viên ({selectedChat.users.length}) </h1>
            <div className='p-2'>
              <input className='w-full no-outline border border-gray-300 my-3 rounded-md p-1 mr-7' placeholder='tìm kiếm thành viên ' />
            </div>
            <div className='h-72 overflow-y-scroll'>
              {selectedChat.users.length > 0 && selectedChat.users.map((value: IUser, index: number) => {
                return <div key={index} className='flex items-center p-1'>
                  {value &&
                    <div className='flex justify-between w-full '>
                      <div className='flex gap-3 items-center px-5'>
                        <img src={`${value.avatar}`} className='w-12 h-12 rounded-full' />
                        <div>
                          <p className='text-xl font-medium '>{value.name}</p>
                        </div>
                      </div>
                      <button className='btn bg-blue-100 px-2 rounded-md cursor-pointer text-blue-600 font-bold' > Kết bạn </button>
                    </div>
                  }
                </div>
              })}
            </div>
            <div className='p-2'>
              <div className=' flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200'>
                <p className='font-medium text-xl'>Tùy chọn  </p>
              </div>

              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><CiWarning />Xóa lịch sử nhóm chat </p>
              <p className='text-red-600 flex mt-2 mb-2 gap-2 items-center text-lg cursor-pointer mt-2'><MdDelete /> Xóa nhóm</p>
              <p className='text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2'><IoIosLogOut /> Rời nhóm chat</p>

            </div>

          </div>

        }

      </div>

    </div>


  </div>
  )
}
