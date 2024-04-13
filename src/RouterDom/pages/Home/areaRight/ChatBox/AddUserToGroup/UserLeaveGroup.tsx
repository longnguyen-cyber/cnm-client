import { Button, Form, Modal, Radio } from 'antd'
import React, { FunctionComponent } from 'react'
import { AiOutlineClose } from 'react-icons/ai'


export const UserLeaveGroup:FunctionComponent<any>=({openLeaveGroup,setOpenLeaveGroup, selectedChat,user})=> {
   
    const findeOjectUser=selectedChat.users.find((item:any)=>item.id===user.id)
    const handleSubmit = (values:any) => {
        console.log('Selected User:', values.user);
        setOpenLeaveGroup(false);
      };
    
  
    return (
    <div>
        {findeOjectUser&&findeOjectUser.role!=='ADMIN'?<>
        </>:
         <Modal open={openLeaveGroup} title="Rời nhóm chat " onCancel={()=>{setOpenLeaveGroup(false)}} onOk={()=>{setOpenLeaveGroup(false)}}>
        <Form onFinish={handleSubmit}>
        <Form.Item name="user" rules={[{ required: true, message: 'Please select a user!' }]}>
          <Radio.Group>
            {selectedChat?.users.map((userrad:any,index:any) => (
                <div>
                    {userrad.role!=='ADMIN'&&
                    <div className='flex items-center w-full justify-between mt-3'>
                                   
                       <Radio   defaultChecked={index === 0} key={userrad.id} value={userrad.id}>
                        <div className='flex items-center gap-3'>
                        <img src={`${userrad.avatar}`} className='w-14 h-14 rounded-full'/>
                       <p className='text-black'>   {userrad.name}</p>
                        </div>
                      </Radio>
                    </div>
                    }
                </div>
           
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <button type="submit" className="ant-btn text-white bg-blue-500 w-full p-2 rounded-md  ant-btn-primary">
            Quyển quyền nhóm trưởng 
          </button>
        </Form.Item>
      </Form>
       </Modal>
        }

       
    </div>
  )
}
