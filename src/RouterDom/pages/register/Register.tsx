import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUser, userRegister } from "../../../feature/user/pathApi";
import { IRegister, IUser } from "../../../Type";
import { Button, Checkbox, Form, Input, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import UserApi from "../../../api/user";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

type FieldType = {
  name: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  status: string;
  phone: string;
  email: string;
  avatar: any;
};

export default function Register() {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.Users.loading);

  const [fileAvatar, setFileAvatar] = useState<UploadFile | undefined>();
  // change file avatar
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileAvatar(newFileList[0]);
  };

  //on preview image
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  // normFile is a function that you need to define to normalize the value of the Upload component.
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleRegister = async (values: IRegister) => {
    try {
      // const response = await UserApi.UserRegister(values);
      // Handle the response here
      console.log('aaaaaaa', fileAvatar)

      const formData = {
        ...values,
        avatar: fileAvatar?.thumbUrl,
      };
      // console.log('values', formData)
      dispatch<any>(userRegister({ ...values, avatar: fileAvatar}));
    } catch (error) {
      // Handle the error here
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
          label="Username"
          name="name"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Display Name"
          name="displayName"
          rules={[
            { required: true, message: "Please input your name will display!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
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

        {/* <Form.Item<FieldType>
          label="Display Name"
          name="displayName"
          rules={[
            { required: true, message: "Please input your name will display!" },
          ]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item label="Status">
          <Select value={"active"}>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item<FieldType>
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <ImgCrop rotationSlider>
            <Upload
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={() => false}
            >
              {!fileAvatar && "+ Upload"}
            </Upload>
          </ImgCrop>
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
            Register
          </Button>
          {/* <Button type="primary" className='w-full mt-4 mb-2 border-r h-12 border-gray-200' ghost>
            Gửi yêu cầu để đăng nhập
          </Button> */}
          {/* <p className="text-center text-gray-500">Quên mật khẩu </p> */}
        </Form.Item>
      </Form>
    </div>
  );
}
