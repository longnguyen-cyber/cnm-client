import React, { FunctionComponent, useEffect, useState } from "react";
import { FaFileImage, FaRegEdit, FaToolbox, FaUserEdit } from "react-icons/fa";
import { UploadOutlined } from "@ant-design/icons";
import {
  AiOutlineMessage,
  AiFillContacts,
  AiOutlineCheckSquare,
  AiOutlineCloud,
  AiOutlineSetting,
} from "react-icons/ai";
import { LoadingOutlined } from "@ant-design/icons";
import { Button,Form,Input, Modal, Spin, notification } from "antd";
import { Navigate, useNavigate } from "react-router";
import "./TabLeft.css";
import UserApi from "../../../../api/user";
import { IRegister, IUser } from "../../../../Type";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../../../feature/user/pathApi";
import Upload from "antd/es/upload/Upload";
import { set } from "date-fns";
import axios from 'axios';
import { RcFile } from "antd/es/upload";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const userTokenString:any=localStorage.getItem('user');

const TabLeft: FunctionComponent<{
  setTabCurrent: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setTabCurrent }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [openModalImage, setOpenModalImage] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const storedUser = localStorage.getItem("user");
  const userInfors = storedUser ? JSON.parse(storedUser) : null;
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingBlockgest, setLoadingBlockgest] = useState(false);
  const [loadingNotify, setLoadingNotify] = useState(false);
  const [userInfor,setuserInfor]=useState<any>(null)
  const [ModalUpdatePassword,SetModalUpdatePassword]=useState<any>(false)
  const UserLogin:IUser=JSON.parse(userTokenString);
  const [form] = Form.useForm();
  const [imageUpload,setImageUpload]=useState<any>(null)

  const [LoadingUploadImage,setLoadingUpLoadImage]=useState<any>(false)
  useEffect(() => {
    const fetchUserInfor = async () => {
      const res = await UserApi.getUserById(userInfors.id);
      if(res){
        console.log('res',res.data)
        setuserInfor(res.data)
      }
    }
    fetchUserInfor()
  }, [])

  const showModal = () => {
    setOpen(true);
  };
  const showModalImage = () => {
    setOpenModalImage(true);
  };
  const handleUpload = (info: any) => {
    setImageUrl(info.file[0]);
  };

  const handleUpdateImage = () => {
    userInfor["avatar"] = imageUrl;
    const data = {
      data: userInfor,
      token: userInfor?.token,
    };
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    // updateUserProfile
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const handelCancelImage = () => {
    setOpenModalImage(false);
  };

  const [openlogOut, setOpenLogOut] = useState(false);
  const navigate = useNavigate();
  const removeToken = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("tokenUser");
    navigate("/Login");
  };
  const setTabCurrentChangeFunction = (value: any) => {
    setTabCurrent(value);
  };

  const handleOpenBlockGest = async () => {
    setLoadingBlockgest(true);
    const data = {
      blockGuest: false,
    };
    const res = await UserApi.updateSetting(data);
    console.log('res data update setting1',res)
    console.log('res data update setting2',res.data)
    if(res){
      setLoadingBlockgest(false);
      if(res.data){
        setuserInfor({...userInfor,setting:res.data})
      }
      notification.success({message:' Đã bật không  nhận tin nhắn từ người lạ '})
    }
  }

  const handleCloseBlockGest = async () => {
    setLoadingBlockgest(true);
    const data = {
      blockGuest: true,
    };
    const res = await UserApi.updateSetting(data);
    if(res){
      if(res.data){
        setuserInfor({...userInfor,setting:res.data})
      }
      setLoadingBlockgest(false);

      notification.success({message:' Đã bật  nhận tin nhắn từ người lạ '})
    }
  }
  const handelOpenNotify = async () => {
    setLoadingNotify(true);
    const data = {
      notify: false,
    };
    const res = await UserApi.updateSetting(data);
    if(res){
      if(res.data){
        setuserInfor({...userInfor,setting:res.data})
      }
      setLoadingNotify(false);
      notification.success({message:' Đã bật  không  thông báo khi có tin nhắn '})
    }
  }
  const handelCloseNotify = async () => {
    setLoadingNotify(true);
    const data = {
      notify: true,
    };
    const res = await UserApi.updateSetting(data);
    if(res){
      if(res.data){
        setuserInfor({...userInfor,setting:res.data})
      }
      setLoadingNotify(false);
      notification.success({message:' Đã bật  nhận thông báo khi có tin nhắn '})
    }
  }

  useEffect(() => {
    const listIcon = document.querySelectorAll(".nav_menuall .items_icon");
    listIcon.forEach((element, index) => {
      if (element) {
        element.addEventListener("click", function () {
          listIcon.forEach((element) => {
            element.classList.remove("active");
          });
          element.classList.add("active");
        });
      }
    });
  }, []);
  const onFineshResetPassword = async (value: any) => {
    console.log(value)
    const dataupdate={
      oldPassword:value.oldPassword,
      password:value.password
    
    }
    setLoading(true)
    try{
      const config = {
        headers: {
          Authorization: `Bearer ${UserLogin.token}`,
          'Content-Type': 'application/json'
        },
      };

      const {data}=await axios.put(`${process.env.REACT_APP_API_URL}users/update`,
      dataupdate,
      config
      )
      console.log(data)
      if(data){
        SetModalUpdatePassword(false)
        form.resetFields();
        notification["success"]({
            message: "Thông báo",
            description: "Cập nhật mật khẩu thành công !",
          });
       
      }         

    }
    catch(err){
      console.log('err',err)
      notification["error"]({
        message: "Thông báo",
        description: "Cập nhật mật khẩu thất bại !",
      });
    }
    
    }

    const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files', file);
        console.log('File', file);
      }); // Chú ý là "files" nếu server dùng AnyFilesInterceptor()
      setLoadingUpLoadImage(false)
      try {
        const response = await UserApi.userUploadImage(formData)
        console.log('response', response)
  
        const { data } = response
        console.log('data', data)
        if (data) {
          setImageUpload(data)

          const dataupdate={
            avatar:data[0].path,
             
          }
          const config = {
            headers: {
              Authorization: `Bearer ${UserLogin.token}`,
              'Content-Type': 'application/json'
            },
          };

          const dataResponeUpdate=await axios.put(`${process.env.REACT_APP_API_URL}users/update`,
          dataupdate,
          config
          )
          console.log(dataResponeUpdate)

          if(dataResponeUpdate){
            console.log('dataResponeUpdate',dataResponeUpdate)
            notification["success"]({
              message: "Thông báo",
              description: "Cập nhật ảnh đại diện thành công !",
            });

            setLoadingUpLoadImage(true)
            window.location.reload();
          }
    
        

          // setOpenImage(true)
        }
      } catch (error) {
        console.error(error)
      }
    }
  return (
    <>
    {  <>
      <div className="  h-full relative " style={{ background: "#0091ff" }}>
        <div className="flex flex-col justify-center nav_menuall  items-center">
          <div className="flex flex-col items-center  gap-5">
            <div className="p-2 pt-5 relative w-full ">
              <img
                onClick={showModal}
                className=" rounded-full h-16 w-16 border border-white"
                src={`${
                  userInfor
                    ? userInfor?.avatar
                    : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                }`}
              />
            </div>
            <div
              className="cursor-pointer items_icon active"
              onClick={() => {
                setTabCurrentChangeFunction("measages");
              }}
            >
              <AiOutlineMessage size={36} color="white" />
            </div>
            <div
              className="cursor-pointer items_icon"
              onClick={() => {
                setTabCurrentChangeFunction("contact");
              }}
            >
              <AiFillContacts size={36} color="white" />
            </div>
            <div
              className="cursor-pointer items_icon"
              onClick={() => {
                setTabCurrentChangeFunction("check");
              }}
            >
              <AiOutlineCheckSquare
                size={36}
                color="white"
                className="cursor-pointer items_icon"
              />
            </div>
          </div>
          <div className="flex flex-col items-center absolute left-0 right-0 bottom-5 gap-5 ">
            <div
              className="cursor-pointer items_icon"
              onClick={() => {
                setTabCurrentChangeFunction("cloud");
              }}
            >
              <AiOutlineCloud
                size={36}
                color="white"
                className="cursor-pointer items_icon"
              />
            </div>
            <div
              className="cursor-pointer items_icon"
              onClick={() => {
                setTabCurrentChangeFunction("tool");
              }}
            >
              <FaToolbox
                size={36}
                className="cursor-pointer items_icon"
                color="white"
              />
            </div>
            <div className="cursor-pointer relative items_icon">
              <AiOutlineSetting
                className="cursor-pointer items_icon"
                size={36}
                color="white"
                onClick={() => {
                  setOpenLogOut(openlogOut === false ? true : false);
                }}
              />
              {openlogOut && (
                <div className="absolute ml-24  -mt-28 z-40 border border-gray-300 rounded py-4 shadow-md p-3 px-5 flex flex-col gap-3 bg-white w-36 ">
                  <p
                    className="text-red-500 hover:bg-gray-200 w-full px-2"
                    onClick={() => {
                      removeToken();
                    }}
                  >
                    Đăng xuất
                  </p>
                  <p className="text-gray-500  hover:bg-gray-200 w-full px-2">
                    Thoát{" "}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        width={400}
        title="Hồ sơ"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <OkBtn/> */}
            <Button className="bg-blue-500">Cập nhật</Button>
            <Button onClick={handleCancel} className="">
              Hủy
            </Button>
          </>
        )}
      >
        <div className="flex flex-col">
          {/* Image cover  */}
          <div className="">
            <img src="https://cover-talk.zadn.vn/7/a/a/9/3/a72ea6dfb69157c6b987a0ccc1306acb.jpg" />
          </div>
          {/* avatar */}
          <div className="flex items-center mt-5 relative top-[-40px]">
            <div className="h-[100px]">
              <img
                src={
                  userInfor
                    ? userInfor?.avatar
                    : "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                }
                className="rounded-full h-[100px] w-[100px] border border-white "
              />
              {/* FaRegEdit */}
              <FaFileImage
                onClick={showModalImage}
                className=" right-0 h-[30px] w-[30px] bottom-0
                 text-white bg-blue-500 rounded-full p-2 cursor-pointer relative left-[55%] top-[-30px]"
                // size={36}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-lg font-bold pl-4">{userInfor?.name}</p>
            </div>
            <div className="pl-6 flex gap-2 cursor-pointer" onClick={()=>{SetModalUpdatePassword(true)}} >
              <FaRegEdit
                className=" right-0 h-[30px] w-[30px] bottom-0 
                 text-white bg-gray-300 rounded-full p-2 cursor-pointer "
                // size={36}
              />cập nhật mật khẩu 
            </div>
          </div>
          {/* info */}
          <div style={{ borderTop: "4px solid #ccc" }}>
            <h3 className="text-lg font-bold mb-2">Thông tin người dùng</h3>
            <p>Số điện thoại: {userInfor?.phone}</p>
            <p>Email: {userInfor?.email}</p>
            <p>Không chấp nhận tin nhắn từ người lạ</p>
            <div className="">{loadingBlockgest&&<Spin/>}{userInfor&&userInfor?.setting.blockGuest===true?<Button   onClick={handleOpenBlockGest}>Tắt  </Button>:<Button onClick={handleCloseBlockGest}>Bật  </Button>}</div>
            <p>Không nhận thông báo khi có tin nhắn </p>
            <div className="">{loadingNotify&&<Spin/>}{userInfor?.setting.notify===true?<Button   onClick={handelOpenNotify}>Tắt </Button>:<Button onClick={handelCloseNotify}>Bật</Button>}</div>
          
          </div>
        </div>
      </Modal>
      <Modal
        width={400}
        title="Hồ sơ"
        open={openModalImage}
        onOk={handleUpdateImage}
        confirmLoading={confirmLoading}
        onCancel={handelCancelImage}
      >
         {imageUpload&&imageUpload.length>0 && (
          <div >
            <h2>Preview:</h2>
            <img
              src={imageUpload[0].path}
              alt="Uploaded Avatar"
              className="w-20 h-20 rounded-full mt-2 mb-2 m-auto"
             
            />
          </div>
        )}
         <Upload
                    beforeUpload={beforeUpload}
                    className="cursor-pointer mt-3"
                    fileList={[]} // fileList không có giá trị, hình ảnh sẽ không được hiển thị trước khi tải lên
                    name="avatar"
                    accept=".jpg, .jpeg, .png"

                    multiple // Cho phép người dùng chọn nhiều hình ảnh
                  >
                  <div className="w-full m-auto">
                   <Button className="ml-28 flex justify-center items-center m-auto"  >{LoadingUploadImage&&<div> <Spin/><p>Đang upload ảnh  </p></div>} {!LoadingUploadImage&&<p>Chọn File Upload</p> }  </Button>
                  </div>
       
        </Upload>
        {/* Display uploaded image preview */}
       
      </Modal>

      <Modal
        width={400}

        open={ModalUpdatePassword}
        onOk={()=>{SetModalUpdatePassword(false)}}
        confirmLoading={confirmLoading}
        onCancel={()=>{SetModalUpdatePassword(false)}}
      >
        <Form  form={form} onFinish={onFineshResetPassword}
                 layout="vertical"
                >

                 <Form.Item
                        style={{ marginTop: "-20px" }}
                        label="Mật khẩu Cũ  "
                        name="oldPassword"
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
                        style={{ marginTop: "-20px" }}
                        label="Mật khẩu mới "
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
                            {loading && (
                                <Spin indicator={antIcon} className="text-white mr-3" />
                            )}{" "}
                            Đặt lại mật khẩu 
                        </Button>

                    </Form.Item>

                </Form>
       
      </Modal>
    </>}
    </>
   
  );
};

export default TabLeft;
