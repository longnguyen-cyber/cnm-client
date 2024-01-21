import React, { useState } from 'react'
import { AiOutlineUser, AiFillEyeInvisible, AiOutlineEye, AiOutlineMail } from "react-icons/ai";
import { Form, Input, Button, Spin } from 'antd'
import GoogleLogin from 'react-google-login';
import './index.css'
import ReCAPTCHA from "react-google-recaptcha";
import { LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../../feature/user/pathApi';
import { ILogin } from '../../../Type';
import { useNavigate } from 'react-router-dom';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function Login() {

  const [responseRecapCha, setResponeRecapCha] = useState(false);
  const dispatch=useDispatch();
  const loading=useSelector((state:any)=>state.Users.loading)
  const navigate=useNavigate()
  console.log(responseRecapCha)
  

  ///============================= du lieu in sert hoan thanh se chay vao day ==========================///
  const onFineshInSertLogin = (value: ILogin) => {
    if(responseRecapCha){   
      const errorRecapCha = document.querySelector(".errorRecapCha");
      if(errorRecapCha){
        errorRecapCha.innerHTML = "";
        if(value){
        const userLoginResult=  dispatch<any>(userLogin(value));
        if(userLoginResult){
          navigate('/home')

        }
        }
      }
  
    }
    else{
          const errorRecapCha = document.querySelector(".errorRecapCha");
          if(errorRecapCha)
          errorRecapCha.innerHTML="Vui lòng xác mình người máy ";
       
      
      
    }
    console.log(value)
  }

  ///=============================check RecapCha==========================///

  function onChangeReCapch(response: any) {
    if (response) {
      setResponeRecapCha(true)
      const errorRecapCha = document.querySelector(".errorRecapCha");

      if (errorRecapCha !== null) {
        errorRecapCha.innerHTML = "";
      }
    }
    else { setResponeRecapCha(false) }
  }



  ///=============================check RecapCha==========================///


  return (
    <div className='group-login '>
      <div className='title-text text-center font-medium mb-5 '>
      </div>
      <div className='login-google-facebook'>
        {/* loginGooglenew2024 */}
        <GoogleLogin
          className="btn-google-login"
          clientId='39780276999-23ndjnog9cr448vg0jqcmcf4qq62ufnq.apps.googleusercontent.com'
          // onSuccess={responseGoogle}
          // onFailure={responseGoogleFail}
          buttonText="Login with google"
          cookiePolicy={'single_host_origin'} />
      </div>

      <div className='content_meo'>
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
          rules={[{
            required: true, message: 'không được để trống '
          }
            ,
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject('Vui lòng nhập đúng định dạng email');
            },
          })
          ]}
        >
          <Input size='large' placeholder='Nhập Email' prefix={<AiOutlineMail />} color={"gray"} />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[{
            required: true, message: 'không được để trống '
          }]}
        >
          <Input.Password
            size='large'
            placeholder='Nhập password'
            iconRender={(visible) => (visible ? <AiFillEyeInvisible /> : <AiOutlineEye />)}
          />
        </Form.Item>

        <div className='content-recapCha flex items-center mb-5 justify-center'>
          <ReCAPTCHA
            sitekey="6Lc6HdYgAAAAAIKgwEaw-mAtM1zOtaDW3YP9TJOt"
            onChange={onChangeReCapch}
          />
         
        </div>
     
          <p className='errorRecapCha w-full flex items-center justify-center' style={{ color: 'red' }}></p>
        <Form.Item>
          <Button type="primary" className='w-full bg-blue-500 h-12 ' htmlType='submit'>
            {loading&&<Spin indicator={antIcon} className='text-white mr-3' />}   Login
          </Button>
          <Button type="primary" className='w-full mt-4 mb-2 border-r h-12 border-gray-200' ghost>
            Gửi yêu cầu để đăng nhập
          </Button>
          <p className='text-center text-gray-500'>Quên mật khẩu </p>
        </Form.Item>
      </Form>

       {/* form login  */}
    </div>
  )
}
