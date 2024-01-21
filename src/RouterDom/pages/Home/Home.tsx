import React, { useEffect } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../../feature/user/pathApi";
import { AreaCenter } from "./araCenter/AreaCenter";
import Sidebar from "../../../Layout/Sidebar";
export default function Home() {
  const dispatch = useDispatch();

  // lay cai mang userSlide
  const ListUsers = useSelector((state: any) => state.Users.UserSlice);
  useEffect(() => {
    dispatch<any>(getAllUser());
  }, []);

  {
    /* <Sidebar /> */
  }

  return (
    <div className="ContentHomeChat">
      {/* này là thanh tabbar màu xanh bên trái giống zalo */}
      <div className="areaLeft bg-blue-500">1</div>

      {/* này là phần hiển thị user */}
      <div className="areaCenter">
        <AreaCenter listUser={ListUsers} />
      </div>

      {/* này là phần hiển thị tin nhắn */}
      <div className="areaRight bg-gray-400">3</div>
    </div>
  );
}
