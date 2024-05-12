import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../../../../../Type";
import { CiWarning } from "react-icons/ci";
import { MdDelete, MdFileDownload } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { RiUserAddFill } from "react-icons/ri";
import { UserGetChatsSingleById } from "../../../../../feature/chat/pathApi";
import { useDispatch } from "react-redux";
import { FaFilePdf } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { LoadingOutlined } from "@ant-design/icons";
import "./GroupChat.css";
import { AddUserToGroup } from "./AddUserToGroup/AddUserToGroup";
import {
  Button,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Popover,
  Space,
  Spin,
  message,
  notification,
} from "antd";
import { TbDotsVertical } from "react-icons/tb";
import { UserLeaveGroup } from "./AddUserToGroup/UserLeaveGroup";
import { UserContext } from "../../../../../Context/UserContext";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const InformationChat: FunctionComponent<any> = ({
  selectedChat,
  user,
  socket,
  setselectedChats
}) => {
  console.log('day la selected chat')
  console.log(selectedChat)
  const dispatch = useDispatch();
  const [openModalAddUserToGroup, setModalAddUserToGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editNameGroup, setEditNameGroup] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [valuedelete, setValueDelete] = useState<any>();
  const [openModalRole, setopenModalRole] = useState(false);
  const [valueUserRole, setValueRoleUser] = useState<any>();
  const [loadingRoleUser, setLoadingRoleUser] = useState(false);
  const [openLeaveGroup, setOpenLeaveGroup] = useState(false);
  const [openModalToPassRole, setOpenModalToPassRole] =
    useState<boolean>(false);
  const [userHavePassRoleAdmin, setUserHavePassRoleAdmin] = useState<any>();
  const [loadingLeaveGroup,setLoadingLeaveGroup]=useState(false)
  const [loadingDeleteGroup,setLoadingDeleteGroup]=useState(false)
  const [loadingDisableChat,setLoadingDisableChat]=useState(false)

  const [loadingLeaveGroupForMembers, setLoadingLeaveGroupForMembers] =
    useState(false);
  // ----------- user current
  console.log('user information ')
  console.log(selectedChat);
  const HandleOpenModall = () => {
    setModalAddUserToGroup(true);
  };

  useEffect(() => {
    const handleData = async (data: any) => {
      if (data && data.message === "Add user to channel success") {
        setModalAddUserToGroup(false);
        setLoading(false);
      } else if (data && data.message === "Update channel success") {
        console.log('data test')
        console.log(data)
        setLoadingUpdate(false);
        setEditNameGroup(false);
        setLoadingDisableChat(false)
        // setselectedChats({...selectedChat,disableThread:data?.data?.channel?.disableThread     })

        return () => {
          socket?.off("channelWS");
        };
      } else if (data && data.message === "Remove user from channel success") {
        setLoadingDelete(false);
        return () => {
          socket?.off("removeUserFromChannel");
        };
      }
      if (data && data?.message === "Update role user in channel success") {
        setLoadingRoleUser(false);
        return () => {
          socket?.off("updateRoleUserInChannel");
        };
      }
      if(data&&data.message==='Leave channel success'){
        setLoadingLeaveGroup(false)
        setLoadingLeaveGroupForMembers(false)
        setOpenModalToPassRole(false)
      }
      if(data&&data.message==='Delete channel success'){

        setLoadingDeleteGroup(false)
      }
      if(data&&data.message==='Update channel success'){
        setLoadingDisableChat(false)
      }


    };
    socket?.on("channelWS", handleData);
    return () => {
      socket?.off("channelWS", handleData);
    };
  }, [socket]);

  const HandleUpdate = (value: any) => {
    const channelUpdate = {
      channelUpdate: value,
      channelId: selectedChat?.id,
    };
    socket?.emit("updateChannel", channelUpdate);
    setLoadingUpdate(true);
    return () => {
      socket?.off("updateChannel");
    };
  };

  const addFriendInGroupChat = (user: any) => {
    if (socket) {
      const sendReqAddFriend = {
        receiveId: user.id,
      };
      console.log(sendReqAddFriend);
      socket.emit("reqAddFriend", sendReqAddFriend);
    }

    notification["success"]({
      message: "Thông báo",
      description: "Đã gửi lời mời kết bạn",
    });
    return () => {
      socket?.off("reqAddFriend");
    };
  };

  const deleteUserInGroupChat = (value: any) => {
    setValueDelete(value);

    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa người dùng này khỏi nhóm chat?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        onDeleteConfirmed(value.id, selectedChat?.id);
      },
    });
    // }
  };

  const onDeleteConfirmed = (userId: string, channelId: string) => {
    setLoadingDelete(true);
    const data = {
      userId: userId,
      channelId: channelId,
    };
    socket.emit("removeUserFromChannel", data);

    return () => {
      socket?.off("removeUserFromChannel");
    };
  };

  // ----------------LEAVE GROUP CHAT ONLY FOR MEMBER----------------------------

  const handlePassAdmin = (user: any) => {
    setUserHavePassRoleAdmin(user);
    notification["success"]({
      message: "Thông báo",
      description: `Bạn đã chọn ${user.name} làm trưởng nhóm chat`,
    });
    // return;
  };

  const handleLeaveGroupChat = (selectedChat1: any) => {
    console.log(user?.id);
    const userCurrentId = selectedChat1?.users?.find(
      (value: any) => value?.id === user?.id
    );
    console.log("userCurrentId------>", userCurrentId);
    if (userCurrentId.role === "ADMIN" && !userHavePassRoleAdmin) {
      setOpenModalToPassRole(true);
    } else {
      Modal.confirm({
        title: "Bạn có chắc chắn muốn rời khỏi nhóm chat?",
        content: "Hành động này không thể hoàn tác.",
        okText: "Rời nhóm",
        okType: "danger",
        cancelText: "Hủy bỏ",
        onOk() {
          onLeaveGroupConfirmed(selectedChat?.id);
        },
      });
    }
  };
  const onLeaveGroupConfirmed = (channelId: string) => {
    // setLoadingDelete(true);
    setLoadingLeaveGroupForMembers(true)
    const data = {
      channelId: channelId,
    };
    socket?.emit("leaveChannel", data);

    return () => {
      socket?.off("leaveChannel");
     
    };
  };

  // ----------------LEAVE GROUP CHAT ONLY FOR MEMBER----------------------------

  //------------------LEAVE CHAT FOR ADMIN-------------------------------------
  const handleLeaveChatForAdmin = (selectedChat1: any) => {
    setLoadingLeaveGroup(true)
    if (userHavePassRoleAdmin) {
      const data = {
        transferOwner: userHavePassRoleAdmin.id,
        channelId: selectedChat1.id,
      };
      socket?.emit("leaveChannel", data);
   
      return () => {
        socket?.off("leaveChannel");
        setUserHavePassRoleAdmin(null);
        notification["success"]({
          message: "Thông báo",
          description: "Đã rời nhóm chat thành công",
        });
      };
    } else {
      notification["error"]({
        message: "Thông báo",
        description: "Vui lòng chọn trưởng nhóm mới",
      });
    }
  };
  //------------------LEAVE CHAT FOR ADMIN-------------------------------------

  // ----------------DELETE GROUP CHAT-------------------------------------
  const handleDeleteGroupChat = (selectedChat1: any) => {
    
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa nhóm chat?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy bỏ",
      onOk() {
        onDeleteGroupConfirmed(selectedChat1.id);
      },
    });
  };
  const onDeleteGroupConfirmed = (channelId: string) => {
    setLoadingDelete(true);
    setLoadingDeleteGroup(true)
    const data = {
      channelId: channelId,
    };
    socket?.emit("deleteChannel", data);

    return () => {
      socket?.off("deleteChannel");
      notification["success"]({
        message: "Thông báo",
        description: "Đã xóa nhóm chat thành công",
      });
    };
  };
  // ----------------DELETE GROUP CHAT-------------------------------------

  const BlockUser = () => {
    notification["success"]({
      message: "Thông báo",
      description: "Chức năng đang phát triển",
    });
  }

  const PopoverContent = ({ someValue }: { someValue: any }) => {
    return (
      <div className=" gap-1">
        {loadingRoleUser && <Spin />}
        {valueUserRole.role === "CO-ADMIN" ?
       
         (
          <p
            className="cursor-pointer"
            onClick={() => {
              HandleRoleCoAdmin("MEMBER");
            }}
          >
            Hủy quyền phó nhóm
          </p>
        ) : (
          <p
            className="cursor-pointer"
            onClick={() => {
              HandleRoleCoAdmin("CO-ADMIN");
            }}
          >
            cấp quyền phó nhóm
          </p>
        )}
       <p onClick={BlockUser} className="cursor-pointer">Chặn <span className="font-medium text-red-500">{valueUserRole?.name}</span> chat </p>
      </div>
    );
  };

   const UpdateChannels=(value:any)=>{
    setLoadingDisableChat(true)
    const data=
    {
      channelUpdate:{
          disableThread:value
      },
      channelId:selectedChat.id
  }

  console.log(data)
    socket.emit('updateChannel',data)
    return () => {
      socket?.off("updateChannel");
    };

   }

  const HandleRoleCoAdmin = (value: any) => {
    setLoadingRoleUser(true);

    const data = {
      user: {
        id: valueUserRole.id,
        role: value,
      },
      channelId: selectedChat?.id,
    };
    socket.emit("updateRoleUserInChannel", data);
    return () => {
      socket?.off("updateRoleUserInChannel");
    };
  };

  return (
    <>
      <div className="col-md-2 h-full overflow-y-auto relative">
        {openLeaveGroup && (
          <div>
            <UserLeaveGroup
              openLeaveGroup={openLeaveGroup}
              setOpenLeaveGroup={setOpenLeaveGroup}
              selectedChat={selectedChat}
              user={user}
            />
          </div>
        )}
        {openModalAddUserToGroup && (
          <AddUserToGroup
            selectedChat={selectedChat}
            openModalAddUserToGroup={openModalAddUserToGroup}
            setModalAddUserToGroup={setModalAddUserToGroup}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        <div className="flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200">
          <p className="font-medium text-xl">Thông tin nhóm </p>
        </div>
        <div className="border border-gray-200 h-44 w-auto ">
          <div className="flex justify-center items-center ">
            {typeof selectedChat === "object" && selectedChat !== null ? (
              selectedChat?.receiveId ? (
                <div className="flex gap-3 items-center px-5">
                  <img
                    src={`${selectedChat?.user ? selectedChat?.user.avatar : ""}`}
                    className="w-16 h-16 mt-8 rounded-full"
                  />
                  <div></div>
                </div>
              ) : !selectedChat?.receiveId && !selectedChat?.users ? (
                <div>
                  <div className="flex gap-3 items-center px-5">
                    <img
                      src={`${selectedChat ? selectedChat?.avatar : ""}`}
                      className="w-16 h-16 mt-8 rounded-full"
                    />
                  </div>
                </div>
              ) :
              
            
              (
                <>
                  <div className="flex flex-wrap w-24  justify-center mt-8  items-center">
                    {selectedChat?.users.length > 0 &&
                      selectedChat?.users
                        .slice(0, 3)
                        .map((value: IUser, index: number) => (
                          <img
                            className="w-10 h-10 rounded-full "
                            src={`${value.avatar}`}
                            alt="Avatar 1"
                          />
                        ))}
                    <p className="rounded-full text-gray-500  flex items-center justify-center  bg-gray-300 w-10 h-10">
                      {selectedChat?.users.length+1 > 3 - 3}
                    </p>
                  </div>
                </>
              )
            ) : 
            
            (
              ""
            )}
          </div>
          <div>
            {selectedChat?.receiveId ? (
              <>
                <p
                  style={{ fontSize: "25px", fontWeight: "500px" }}
                  className="text-center mt-2 font-semibold"
                >
                  {selectedChat?.user.name}
                </p>

                <p> Tat ca File đã gửi </p>

                <div className="absolute bottom-1 p-2">
                  <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                    <CiWarning />
                    Xóa lịch sử nhóm chat{" "}
                  </p>
                  <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                    <MdDelete /> Xóa nhóm
                  </p>
                  <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                    <IoIosLogOut /> Rời nhóm chat
                  </p>
                </div>
              </>
            ) : /// rời nhóm chat xóa nhóm chát xóa lịch sử nhóm chat

            !selectedChat?.receiveId && !selectedChat?.users ? (
              <>
                <p
                  style={{ fontSize: "25px", fontWeight: "500px" }}
                  className="text-center mt-2 font-semibold"
                >
                  {selectedChat?.name}
                </p>
                <div className="absolute bottom-1 p-2">
                  <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                    <CiWarning />
                    Xóa lịch sử nhóm chat{" "}
                  </p>
                  <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                    <MdDelete /> Xóa nhóm
                  </p>
                  <p className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2">
                    <IoIosLogOut /> Rời nhóm chat
                  </p>
                </div>
              </>
            ) : (
              /// thêm thanh viên vào
              <div>
                <p
                  style={{ fontSize: "25px", fontWeight: "500px" }}
                  className="text-center mt-2  mb-4 font-semibold"
                >
                  <div className="flex justify-center gap-2 items-center">
                  {selectedChat?.name}
                  {selectedChat?.users.some((users:any) =>
                    (users.role === "ADMIN" || users.role === "CO-ADMIN") && users.id === user.id) && (
                        <div>
                          {!editNameGroup && (
                            <CiEdit
                              size={20}
                              className="cursor-pointer"
                              onClick={() => setEditNameGroup(true)}
                            />
                          )}
                        </div>
                      )}
                  </div>
                 
                       {editNameGroup && (
                    <Form
                      onFinish={HandleUpdate}
                      className="flex items-center gap-2"
                    >
                      <Form.Item
                        name="name"
                        rules={[
                          { required: true, message: "Vui lòng nhập tên!" },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          className=" bg-blue-500 h-10 w-18"
                          htmlType="submit"
                        >
                          {loadingUpdate && (
                            <Spin
                              indicator={antIcon}
                              className="text-white mr-2"
                            />
                          )}{" "}
                          update
                        </Button>
                        <Button
                          type="primary"
                          className=" bg-red-500 h-10 w-18"
                          onClick={() => {
                            setEditNameGroup(false);
                          }}
                        >
                          Close
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </p>
                <div className=" flex justify-center flex-col items-center h-16 w-auto border border-gray-200 border-l border-gray-200">
                  <p className="font-medium flex gap-2 items-center cursor-pointer text-xl">
                    Thành viên{" "}

                   
                  </p>

               
                </div>
                <div className="flex justify-center items-center">
                  <button
                    className="btn btn-blue bg-gray-200 p-2 flex items-center gap-2 rounded-sm mt-3"
                    onClick={() => {
                      setModalAddUserToGroup(true);
                    }}
                  >
                    {" "}
                    <RiUserAddFill color="gray" /> Thêm thành viên vào nhóm{" "}
                  </button>
                </div>
                <h1 className="font-medium mt-3 mb-3 pl-3">
                  Danh sách thành viên ({selectedChat?.users?.length}){" "}
                </h1>
                <div className="p-2">
                  <input
                    className="w-full no-outline border border-gray-300 my-3 rounded-md p-1 mr-7"
                    placeholder="tìm kiếm thành viên "
                  />
                </div>

                {/* danh sách nhóm  */}
                <div className="h-72 overflow-y-scroll">
                {selectedChat?.users.some((users:any) =>
                    (users.role === "ADMIN" || users.role === "CO-ADMIN") && users.id === user.id) ? (
                        <div>
                         {selectedChat?.users?.length > 0 &&
                        selectedChat?.users?.map((value: any, index: number) => {
                      return (
                        <div key={index} className="flex items-center p-1">
                          {value && (
                            <div className="flex justify-between w-full ">
                              <div className="flex gap-3 items-center px-5">
                                <img
                                  src={`${value.avatar}`}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div>
                                  <p className="text-xl font-medium ">
                                    {value.name}
                                  </p>
                                  <p>
                                    {
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "gray",
                                        }}
                                      >
                                        {value.role === "ADMIN" ? (
                                          <p>Trưởng nhóm</p>
                                        ) : value.role === "CO-ADMIN" ? (
                                          <p>Phó nhóm</p>
                                        ) : (
                                          <p>Thành viên </p>
                                        )}
                                      </div>
                                    }
                                  </p>
                                </div>
                              </div>



                              {value.role === "ADMIN" ||
                              (value.role === "CO-ADMIN" &&
                                user.id === value.id) ? (
                                <></>
                              ) : (
                                <div className="flex items-center gap-2">
                               
                                   
                                  <button
                                    onClick={() => deleteUserInGroupChat(value)}
                                    className="btn bg-red-500 p-2 rounded-md cursor-pointer text-white font-bold"
                                  >
                                    {" "}
                                   
                                    <div>
                                    {loadingDelete &&
                                      value?.id === valuedelete?.id && (
                                        <Spin />
                                      )}{" "}
                                    <p>Xóa </p>
                                  </div>
                                   
                                  </button>

                                  <button
                                    onClick={() => addFriendInGroupChat(value)}
                                    className="btn bg-blue-100 p-2 rounded-md cursor-pointer text-blue-600 font-bold"
                                  >
                                    {" "}
                                    Thêm{" "}
                                  </button>


                                  <Popover
                                    content={
                                      <PopoverContent someValue={value} />
                                    }
                                    title="Cấp quyền "
                                    trigger="click"
                                  >
                                    <TbDotsVertical
                                      onClick={() => {
                                        setValueRoleUser(value);
                                      }}
                                      size={30}
                                      className="cursor-pointer"
                                    />
                                  </Popover>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                        </div>
                      ):<>
                      <div>
                         {selectedChat?.users?.length > 0 &&
                        selectedChat?.users?.map((value: any, index: number) => {
                      return (
                        <div key={index} className="flex items-center p-1">
                          {value && (
                            <div className="flex justify-between w-full ">
                              <div className="flex gap-3 items-center px-5">
                                <img
                                  src={`${value.avatar}`}
                                  className="w-12 h-12 rounded-full"
                                />
                                <div>
                                  <p className="text-xl font-medium ">
                                    {value.name}
                                  </p>
                                  <p>
                                    {
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "gray",
                                        }}
                                      >
                                        {value.role === "ADMIN" ? (
                                          <p>Trưởng nhóm</p>
                                        ) : value.role === "CO-ADMIN" ? (
                                          <p>Phó nhóm</p>
                                        ) : (
                                          <p>Thành viên </p>
                                        )}
                                      </div>
                                    }
                                  </p>
                                </div>
                              </div>
                              {value.role === "ADMIN" ||
                              (value.role === "CO-ADMIN" &&
                                user.id === value.id) ? (
                                <></>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => addFriendInGroupChat(value)}
                                    className="btn bg-blue-100 p-2 rounded-md cursor-pointer text-blue-600 font-bold"
                                  >
                                    {" "}
                                    Thêm{" "}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                        </div>
                      
                      
                      </>}

                  
                </div>
                <div className="p-2">
                  <div className=" flex justify-center items-center h-16 w-auto border border-gray-200 border-l border-gray-200">
                    <p className="font-medium text-xl">Tùy chọn </p>
                    
                  </div>
                  {selectedChat?.users.some((users:any) =>
                    (users.role === "ADMIN" || users.role === "CO-ADMIN") && users.id === user.id) && (
                      <div className="">
                        <div className="flex gap-2 items-center">
                        <RiUserAddFill/>   Cấm thành viên chat
                        </div>
                        <div>{selectedChat?.disableThread===false? <Button  onClick={()=>UpdateChannels(true)}>{loadingDisableChat&&<Spin/>}Bật Không cho thành viên chat </Button>:<Button  onClick={()=>UpdateChannels(false)}> {loadingDisableChat&&<Spin/>} Cho tất cả chat </Button>}</div>
                      </div>

                    )}
                 
                  <p className="text-red-600 flex mt-2 mb-2 gap-2 items-center text-lg cursor-pointer mt-2"
                    onClick={()=>handleDeleteGroupChat(selectedChat)}
                  >
                     {selectedChat?.users.some((users:any) =>
                    (users.role === "ADMIN" || users.role === "CO-ADMIN") && users.id === user.id) && (
                        <div className="flex items-center gap-1">
                    {loadingDeleteGroup&&<Spin/>}    <MdDelete /> Xóa nhóm
                        </div>
                      )}
                    
                  </p>
                  <p
                    className="text-red-600 flex gap-2 items-center text-lg cursor-pointer mt-2"
                    // onClick={() => {
                    //   setOpenLeaveGroup(true);
                    // }}
                    onClick={() => handleLeaveGroupChat(selectedChat)}
                  >
                    <IoIosLogOut />{loadingLeaveGroupForMembers&&<Spin/>} Rời nhóm chat
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        style={{ overflow: "auto" }}
        title="Chọn người dùng để cấp quyền trưởng nhóm"
        visible={openModalToPassRole}
        onOk={() => setOpenModalToPassRole(false)}
        onCancel={() => setOpenModalToPassRole(false)}
        footer={
          <div className="flex justify-center items-center gap-3">
            <button
              onClick={() => {
                handleLeaveChatForAdmin(selectedChat);
              }}
              className="btn bg-red-500 p-2 rounded-md cursor-pointer text-white font-bold"
            >
            {loadingLeaveGroup&&<Spin/>}  Rời nhóm
            </button>
            <button
              onClick={() => {
                setOpenModalToPassRole(false);
              }}
              className="btn bg-blue-500 p-2 rounded-md cursor-pointer text-white font-bold"
            >
              Hủy bỏ
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-2">
        {/* get all user but not include user.role = 'ADMIN' */}
        

          { selectedChat?.users?.map((value: any, index: number) => {
            if (value.role !== "ADMIN") {
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 cursor-pointer justify-between"
                >
                  <img
                    src={`${value.avatar}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <p>{value.name}</p>
                  {userHavePassRoleAdmin &&
                  userHavePassRoleAdmin.id === value.id ? (
                    <button
                      onClick={() => {
                        handlePassAdmin(value);
                      }}
                      className="btn bg-blue-500 py-2 rounded-md cursor-pointer text-white font-bold"
                    >
                      Trưởng nhóm mới
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handlePassAdmin(value);
                      }}
                      className="btn bg-green-500 py-2 rounded-md cursor-pointer text-white font-bold"
                    >
                      Chọn làm trưởng nhóm
                    </button>
                  )}
                </div>
              );
            }
          
          })}
        </div>
      </Modal>
    </>
  );
};

export default InformationChat;
