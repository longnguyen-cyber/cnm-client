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
import { IUser } from "../../../Type";
import { useNavigate } from "react-router-dom";
import UserApi from "../../../api/user";
const userTokenString:any=localStorage.getItem('user');

const tokenUser:any=localStorage.getItem('tokenUser');
export default function Home() {
  const UserLogin:IUser=JSON.parse(userTokenString);
  console.log(userTokenString)
  const navigate=useNavigate()
  console.log('day la token user')
  console.log(tokenUser)
  if(tokenUser==null){
    navigate('/login')
  }
  if(UserLogin===null){
    navigate('/login')
  }
  useEffect(()=>{
 
    console.log(UserLogin)
    if(UserLogin===null){
      navigate('/login')
    }
  },[userTokenString])

  useEffect(() => {
    const fetchUserInfor = async () => {
      try {
        const res = await UserApi.getUserById(UserLogin?.id);
        console.log(res.data);
        if(res.data===undefined){
          navigate('/login')
          localStorage.removeItem("user");
           localStorage.removeItem("tokenUser");
        }
      } catch (err) {
       
        navigate('/login')
        localStorage.removeItem("user");
        localStorage.removeItem("tokenUser");
      }
     
      // if(res){
      //   console.log('res',res)
      //   if(res.errors.message){

      //   }
      //   // setuserInfor(res.data)
      // }
    }
    fetchUserInfor()
  }, [])


  const dispatch = useDispatch();
  const [tabCurrent, setTabCurrent] = useState("measages");
  const [SearchHand,setSeachHandle]=useState(false);
  const [searchValue,setSearchValue]=useState('');
  // lay cai mang userSlide
  const ListUsers = useSelector((state: any) => state.Users.UserSlice);
  return (
    // {}
    <div>
 {tokenUser&&<><div className="ContentHomeChat">
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
   
    </div></>}
    </div>
   
    
  );
}
