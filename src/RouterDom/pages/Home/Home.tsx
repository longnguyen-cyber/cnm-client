import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../../feature/user/pathApi";
import { AreaCenter } from "./araCenter/AreaCenter";
import Sidebar from "../../../Layout/Sidebar";
import TabLeft from "./areaLeft/TabLeft";
import AreaRight from "./areaRight/AreaRight";
import { SearchPage } from "./araCenter/Search/Search";
import SearchUserAddChat from "./araCenter/Search/SearchUserAddSingleChat";

export default function Home() {
  const dispatch = useDispatch();
  const [tabCurrent, setTabCurrent] = useState("measages");
  const [SearchHand,setSeachHandle]=useState(false);
  const [searchValue,setSearchValue]=useState('');

  // lay cai mang userSlide
  const ListUsers = useSelector((state: any) => state.Users.UserSlice);
 


  return (
    <div className="ContentHomeChat">
      {/* này là thanh tabbar màu xanh bên trái giống zalo */}
      <div className="areaLeft bg-blue-500">
        <TabLeft setTabCurrent={setTabCurrent}/>
      </div>

      {/* này là phần hiển thị user */}
      <div className="areaCenter p-5 border-r-2 ">
        {/* phan search */}
        <SearchPage SearchHand={SearchHand} setSeachHandle={setSeachHandle} setSearchValue={setSearchValue}/>
        {SearchHand?<SearchUserAddChat searchValue={searchValue}/>:
        <>
          <AreaCenter listUser={ListUsers} tabCurrent={tabCurrent} />
        </>
        }
      
      </div>

      {/* này là phần hiển thị tin nhắn */}
      <div className="areaRight ">
        <AreaRight/>
      </div>
   
    </div>
  );
}
