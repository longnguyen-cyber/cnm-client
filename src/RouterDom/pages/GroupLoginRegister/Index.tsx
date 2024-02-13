import React from "react";
import { Tabs } from "antd";
import Login from "../login/Login";
import Register from "../register/Register";
import backgroundzalo from "../../../image/bgLoginZalo.png";
import "./index.css";

export default function Index() {
  const { TabPane } = Tabs;
  return (
    <div className="contextForm flex items-center justify-center relative w-full min-h-screen">
      <img
        src={backgroundzalo}
        className="w-full h-full absolute z-1 left-0 right-0 top-0"
      />
      <div className="tabsAll ">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Đăng nhập" key="1">
            <Login />
          </TabPane>
          <TabPane tab="Đăng ký tài khoản" key="2">
            <Register />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
