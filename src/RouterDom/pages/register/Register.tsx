import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IRegister } from "../../../Type";
import { Button, Checkbox, Form, Input, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import UserApi from "../../../api/user";
import { useNavigate } from "react-router-dom";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type FieldType = {
  name: string;
  password: string;
  confirmPassword: string;
  // displayName: string;
  // status: string;
  // phone: string;
  email: string;
  // avatar: any;
};

export default function Register() {
  const [loadingmail,setLoadingmail]=useState(false);
  console.log(loadingmail)

  const [fileAvatar, setFileAvatar] = useState<UploadFile | undefined>();
  // change file avatar
 

  //on preview image

  // normFile is a function that you need to define to normalize the value of the Upload component.


  const handleRegister = async (values: IRegister) => {
    // delete values.confirmPassword;
    setLoadingmail(true)
    try {
      const response = await UserApi.UserRegister({
        name: values.name,
        password: values.password,
        email: values.email,
      });
      if (response) {
           notification["success"]({
            message: "Thông báo",
            description: "Vui lòng kiểm tra email để xác nhận đăng ký !",
          });
          setLoadingmail(false)
        }
    } catch (error) {
      console.log(error)
      notification["error"]({
        message: "Thông báo",
        description: "lỗi đăng ký  !",
      });
    }
  };

  return (
    <div className="group-login ">
      <Form
        layout="vertical"
        name="register"
        style={{ height: "100%" }}
        autoComplete="off"
        onFinish={handleRegister}
      >
        <Form.Item<FieldType>
          label="Tên đăng nhập"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input/>
          </Form.Item>



          <Form.Item
           style={{marginTop:"20px"}} 
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "không được để trống ",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject("Vui lòng nhập đúng định dạng email");
              },
            }),
          ]}
        >
          <Input/>
        </Form.Item>

        
              <Form.Item
          style={{marginTop:"-20px"}} 
        label="Mật khẩu"
        name="password"
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
                if (!value || getFieldValue("password") === value) {
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
            {loadingmail && (
              <Spin indicator={antIcon} className="text-white mr-3" />
            )}{" "}
            Đăng ký
          </Button>
      
        </Form.Item>
      </Form>
    </div>
  );
}
