import React, { FunctionComponent, useEffect, useState } from 'react'
import { FaToolbox } from "react-icons/fa";
import {
  AiOutlineMessage,
  AiFillContacts,
  AiOutlineCheckSquare,
  AiOutlineCloud,
  AiOutlineSetting,
} from "react-icons/ai";
import { Navigate, useNavigate } from 'react-router';
import './TabLeft.css'
const TabLeft: FunctionComponent<{ setTabCurrent: React.Dispatch<React.SetStateAction<string>> }> = ({ setTabCurrent }) => {


  const storedUser = localStorage.getItem('user');
  const userInfor = storedUser ? JSON.parse(storedUser) : null;

  const [openlogOut, setOpenLogOut] = useState(false)
  const navigate = useNavigate();
  const removeToken = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("tokenUser")
    navigate('/Login')
  }
  const setTabCurrentChangeFunction = (value: any) => {
    setTabCurrent(value);

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
  return (
    <div className="  h-full relative " style={{ background: "#0091ff" }}>
      <div className="flex flex-col justify-center nav_menuall  items-center">
        <div className="flex flex-col items-center  gap-5">
          <div className="p-2 pt-5 relative w-full ">
            <img
              className=" rounded-full h-16 w-16 border border-white"
              src={`${userInfor ? userInfor.avatar : ""}`}
            />
          </div>
          <div className="cursor-pointer items_icon active" onClick={() => { setTabCurrentChangeFunction("measages") }}>
            <AiOutlineMessage size={36} color="white" />
          </div>
          <div className="cursor-pointer items_icon" onClick={() => { setTabCurrentChangeFunction("contact") }}>
            <AiFillContacts size={36} color="white" />
          </div>
          <div className="cursor-pointer items_icon" onClick={() => { setTabCurrentChangeFunction("check") }}>
            <AiOutlineCheckSquare
              size={36}
              color="white"
              className="cursor-pointer items_icon"
            />
          </div>

        </div>
        <div className="flex flex-col items-center absolute left-0 right-0 bottom-5 gap-5 ">
          <div className="cursor-pointer items_icon" onClick={() => { setTabCurrentChangeFunction("cloud") }}>
            <AiOutlineCloud
              size={36}
              color="white"
              className="cursor-pointer items_icon"
            />
          </div>
          <div className="cursor-pointer items_icon" onClick={() => { setTabCurrentChangeFunction("tool") }}>
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
              onClick={() => { setOpenLogOut(openlogOut === false ? true : false) }}
            />
            {openlogOut && (
              <div className="absolute ml-24  -mt-28 z-40 border border-gray-300 rounded py-4 shadow-md p-3 px-5 flex flex-col gap-3 bg-white w-36 ">
                <p className="text-red-500 hover:bg-gray-200 w-full px-2" onClick={() => { removeToken() }}>Đăng xuất</p>
                <p className="text-gray-500  hover:bg-gray-200 w-full px-2">Thoát </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabLeft