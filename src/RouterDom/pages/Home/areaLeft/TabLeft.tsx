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
import { Button, Modal } from "antd";
import { Navigate, useNavigate } from "react-router";
import "./TabLeft.css";
import UserApi from "../../../../api/user";
import { IRegister } from "../../../../Type";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../../../feature/user/pathApi";
import Upload from "antd/es/upload/Upload";
import { set } from "date-fns";
const TabLeft: FunctionComponent<{
  setTabCurrent: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setTabCurrent }) => {
  const [open, setOpen] = useState(false);
  const [openModalImage, setOpenModalImage] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const storedUser = localStorage.getItem("user");
  const userInfor = storedUser ? JSON.parse(storedUser) : null;
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);

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
  return (
    <>
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
            <div className="pl-6">
              <FaRegEdit
                className=" right-0 h-[30px] w-[30px] bottom-0 
                 text-white bg-gray-300 rounded-full p-2 cursor-pointer "
                // size={36}
              />
            </div>
          </div>
          {/* info */}
          <div style={{ borderTop: "4px solid #ccc" }}>
            <h3 className="text-lg font-bold mb-2">Thông tin người dùng</h3>
            <p>Số điện thoại: {userInfor?.phone}</p>
            <p>Email: {userInfor?.email}</p>
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
        <Upload
          name="avatar"
          action="/your-upload-url"
          listType="picture"
          onChange={handleUpload}
          // You may customize additional props as per your requirements
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        {/* Display uploaded image preview */}
        {imageUrl && (
          <div style={{ width: "200px", height: "200px" }}>
            <h2>Preview:</h2>
            <img
              src={imageUrl}
              alt="Uploaded Avatar"
              style={{ minWidth: "200px", minHeight: "200px" }}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default TabLeft;
