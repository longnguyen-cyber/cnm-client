import React, { useEffect, useState } from 'react'
import {
  AiOutlineUser,
  AiFillEyeInvisible,
  AiOutlineEye,
  AiOutlineMail,
} from 'react-icons/ai'
import { Form, Input, Button, Spin, notification } from 'antd'
import GoogleLogin from 'react-google-login'
import './index.css'
import ReCAPTCHA from 'react-google-recaptcha'
import { LoadingOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '../../../feature/user/pathApi'
import { ILogin } from '../../../Type'
import { useNavigate } from 'react-router-dom'
import { unwrapResult } from '@reduxjs/toolkit'
import { gapi } from 'gapi-script'
import FormModal2Fa from './Form2fa/FormModal2Fa'
import UserApi from '../../../api/user'
import FacebookLogin from 'react-facebook-login'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
export default function Login() {
  const [responseRecapCha, setResponeRecapCha] = useState(false)
  const dispatch = useDispatch()
  const loading = useSelector((state: any) => state.Users.loading)
  const [open2FaForm, setOpen2FaForm] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)

  // i want to create function to open 2fa form
  const handleCancel = () => {
    setOpen2FaForm(false)
  }

  const navigate = useNavigate()
  ///============================= du lieu in sert hoan thanh se chay vao day ==========================///

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    function start() {
      gapi.auth2.init({
        apiKey: 'AIzaSyCrEa_AenSOrp7qz7X8GyMPZXYZlqkFwdg',
        clientId:
          '39780276999-23ndjnog9cr448vg0jqcmcf4qq62ufnq.apps.googleusercontent.com',
        scope: '',
        plugin_name: 'streamy',
      })
    }
    gapi.load('client:auth2', start)
  })

  const onFineshInSertLogin = async (value: ILogin) => {
    if (responseRecapCha) {
      const errorRecapCha = document.querySelector('.errorRecapCha')
      if (errorRecapCha) {
        errorRecapCha.innerHTML = ''
        if (value) {
          dispatch<any>(userLogin(value))
        }
      }
    } else {
      const errorRecapCha = document.querySelector('.errorRecapCha')
      if (errorRecapCha)
        errorRecapCha.innerHTML = 'Vui lòng xác mình người máy '
    }
  }

  ///=============================check RecapCha==========================///

  function onChangeReCapch(response: any) {
    // response.reset();
    console.log(response)
    if (response) {
      setResponeRecapCha(true)
      const errorRecapCha = document.querySelector('.errorRecapCha')
      if (errorRecapCha !== null) {
        errorRecapCha.innerHTML = ''
        response.reset()
      }
    } else {
      setResponeRecapCha(false)
    }
  }

  ///=============================check RecapCha==========================///

  const responseGoogle = async (response: any) => {
    setLoadingGoogle(true)
    // const {Cc}=response
    // console.log("day la response google",response)
    // console.log(Cc)
    const id_token = response.tokenId
    const userLoginGoogle = await UserApi.userLoginGoogle({ tokenId: id_token })
    if (userLoginGoogle) {
      const { data } = userLoginGoogle
      if (data) {
        console.log(data)
        localStorage.setItem('user', JSON.stringify(data))
        localStorage.setItem('tokenUser', JSON.stringify(data.token))
        setLoadingGoogle(false)
        notification['success']({
          message: 'Thông báo',
          description: 'login success',
        })
        navigate('/home')
      }
    } else {
      console.log('loi')
    }
  }

  async function responseFacebook(response: any) {
    const { accessToken, id } = response
    const data = {
      userId: id,
      accessToken,
    }
  }

  return (
    <>
      <div className="group-login ">
        <div className="title-text text-center font-medium mb-5 "></div>
        <div className="login-google-facebook">
          {/* loginGooglenew2024 */}
          <GoogleLogin
            className="btn-google-login"
            clientId="39780276999-23ndjnog9cr448vg0jqcmcf4qq62ufnq.apps.googleusercontent.com"
            onSuccess={responseGoogle}
            // onFailure={responseGoogleFail}
            buttonText="Login with google"
            cookiePolicy={'single_host_origin'}
          />
        </div>
        {/* <div className="login-google-facebook">
        <FacebookLogin

                                        appId="369529538654989"
                                        autoLoad={true}
                                        cssClass="my-facebook-button-class"
                                        fields="name,email,picture"
                                        // onClick={componentClickedFaceBook}
                                        callback={responseFacebook}
                                        icon="fa-facebook"


                                        />

        </div> */}

        <div className="content_meo">
          <p>Mẹo đăng ký nhanh với Google hoặc facebook</p>
          <div className="hror">
            <hr />
            <p>Hoặc</p>
            <hr />
          </div>
        </div>

        {/* form login  */}

        <Form onFinish={onFineshInSertLogin}>
          <Form.Item
            name="email"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'không được để trống ',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                  ) {
                    return Promise.resolve()
                  }
                  return Promise.reject('Vui lòng nhập đúng định dạng email')
                },
              }),
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập Email"
              prefix={<AiOutlineMail />}
              color={'gray'}
            />
          </Form.Item>

          <Form.Item
            style={{ marginTop: '-20px' }}
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              // {
              //   validator: (_, value) => {
              //     if (!value || value.length < 6) {
              //       return Promise.reject(
              //         new Error("Mật khẩu phải có ít nhất 6 ký tự!")
              //       );
              //     }
              //     if (!/(?=.*[A-Z])/.test(value)) {
              //       return Promise.reject(
              //         new Error("Mật khẩu phải có ít nhất 1 chữ cái viết hoa!")
              //       );
              //     }
              //     if (!/(?=.*\d)/.test(value)) {
              //       return Promise.reject(
              //         new Error("Mật khẩu phải có ít nhất 1 chữ số!")
              //       );
              //     }
              //     if (!/(?=.*[!@#$%^&*])/.test(value)) {
              //       return Promise.reject(
              //         new Error("Mật khẩu phải có ít nhất 1 ký tự đặc biệt!")
              //       );
              //     }
              //     return Promise.resolve();
              //   },
              // },
            ]}
            validateTrigger="onBlur"
          >
            <Input.Password size="large" placeholder="Nhập mật khẩu " />
          </Form.Item>

          {/* new  6LexYaopAAAAAAvH5Jf_8gJxqz2wnRTDBErTzDmx */}
          {/* cu  6Lc6HdYgAAAAAIKgwEaw-mAtM1zOtaDW3YP9TJOt */}
          {/* 6LerqqopAAAAAOIV79lcJ898ElIaGNNQR5kHJJJt */}
          <div className="content-recapCha flex items-center mb-5 justify-center">
            <ReCAPTCHA
              sitekey="6LexYaopAAAAAAvH5Jf_8gJxqz2wnRTDBErTzDmx"
              onChange={onChangeReCapch}
            />
          </div>

          <p
            className="errorRecapCha w-full flex items-center justify-center"
            style={{ color: 'red' }}
          ></p>
          <Form.Item>
            <Button
              type="primary"
              className="w-full bg-blue-500 h-12 "
              htmlType="submit"
            >
              {loading ||
                (loadingGoogle && (
                  <Spin indicator={antIcon} className="text-white mr-3" />
                ))}{' '}
              Login
            </Button>
            {/* <Button type="primary" className='w-full mt-4 mb-2 border-r h-12 border-gray-200' ghost>
            Gửi yêu cầu để đăng nhập
          </Button> */}
            {/* <Button
            type="primary"
            className="w-full mt-4 mb-2 border-r h-12 border-gray-200"
            onClick={() => setOpen2FaForm(true)}
            ghost
          >
            Tạo xác thực 2FA
          </Button> */}
            <Button
              type="primary"
              className="w-full mt-4 mb-2 border-r h-12 border-gray-200"
              // onClick={() => setOpen2FaForm(true)}
              ghost
            >
              <p className="text-center text-gray-500 cursor-pointer">
                <a href="/forgot-password">Quên mật khẩu </a>
              </p>
            </Button>
          </Form.Item>
        </Form>

        {/* form login  */}
      </div>
      {open2FaForm && <FormModal2Fa handleCancel={handleCancel} />}
    </>
  )
}
