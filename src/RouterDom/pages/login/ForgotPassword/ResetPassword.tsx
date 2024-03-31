import { Button, Form, Input, Spin, notification } from 'antd'
import React, { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai';
import "../ForgotPassword/Fotgot.css"
import UserApi from '../../../../api/user'
import imagebgzal from "../../../../image/bgLoginZalo.png"
import { LoadingOutlined } from "@ant-design/icons";
import { unwrapResult } from '@reduxjs/toolkit';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
export default function ResetPassword() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
     const navigate=useNavigate()
    const [loading, setLoading] = useState(false)
    const onFineshResetPassword = async (value: any) => {
        setLoading(true)
        const config = {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          };

          const {data}=await axios.post(`${process.env.REACT_APP_API_URL}users/reset-password?token=${token}`,
          value,
          config
          )
          if(data){
            navigate('/login')
            notification["success"]({
                message: "Thông báo",
                description: "Cập nhật mật khẩu thành công !",
              });
           
          }          
        }

        try {
          
            

        }
        catch (err) {
            if (err) {
                console.log(err)
                notification["error"]({
                    message: "Lỗi",
                    description: "Lỗi khi gửi mail!"
                });
            }
        }
   
    return (

        <div className='ground-login'>
            <img src={imagebgzal} alt="image" className='absolute left-0 right-0 top-0 w-full min-h-full object-cover z-1' />
            <div className='wrapper-login-register'>
                <div className='group_view_FormRest'>
                    <img className='flex items-center justify-center m-auto w-64 h-64' src={"data:image/jpeg;base64,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"} />
                    <p className='text-center font-medium text-2xl mb-10'>Nhập mật khẩu mới  để cập nhập lại mật khẩu  </p>
                </div>
                <Form onFinish={onFineshResetPassword}
                 layout="vertical"
                >
                    <Form.Item
                        style={{ marginTop: "-20px" }}
                        label="Mật khẩu mới "
                        name="newPassword"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            {
                                validator: (_, value) => {
                                    if (!value || value.length < 6) {
                                        return Promise.reject(
                                            new Error("Mật khẩu phải có ít nhất 6 ký tự!")
                                        );
                                    }
                                    if (!/(?=.*[A-Z])/.test(value)) {
                                        return Promise.reject(
                                            new Error("Mật khẩu phải có ít nhất 1 chữ cái viết hoa!")
                                        );
                                    }
                                    if (!/(?=.*\d)/.test(value)) {
                                        return Promise.reject(
                                            new Error("Mật khẩu phải có ít nhất 1 chữ số!")
                                        );
                                    }
                                    if (!/(?=.*[!@#$%^&*])/.test(value)) {
                                        return Promise.reject(
                                            new Error("Mật khẩu phải có ít nhất 1 ký tự đặc biệt!")
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận lại mật khẩu!",
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(
                                        "The two passwords that you entered do not match!"
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            className="w-full bg-blue-500 h-12 "
                            htmlType="submit"
                        >
                            {loading && (
                                <Spin indicator={antIcon} className="text-white mr-3" />
                            )}{" "}
                            Đăng ký
                        </Button>

                    </Form.Item>

                </Form>
            </div>

        </div>
    )





}