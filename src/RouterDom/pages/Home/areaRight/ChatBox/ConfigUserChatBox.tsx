
//hàm này có nhiệm vụ kiểm tra tin nhan có cùng một người gửi hay không ,và tin nhắn đó phải khác vs người dùng hiện tại 
//đầu tiên kiểm tra tin nhắn phía sau có khác người dùng hay không tại vì là chat đơn chỉ có 2 người dùng thôi 

import { IUser } from "../../../../../Type";

export const isSameSenderMargin = (messages:any, m:any, i:any, userId:string) => {

  if (
    i < messages.length - 1 &&
    messages[i + 1].senderId === m.senderId&&
    messages[i].senderId !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].senderId !== m.senderId&&
      messages[i].senderId !== userId) ||
    (i === messages.length - 1 && messages[i].senderId !== userId)
  )
    return 6;
  else return "auto";
};

export const isSameSender = (messages:any, m:any, i:any, userId:any) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].senderId !== m.senderId||
      messages[i + 1].senderId=== undefined) &&
    messages[i].senderId !== userId
  );
};

export const isLastMessage = (messages:any, i:any, userId:any) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].senderId !== userId &&
    messages[messages.length - 1].senderId
  );
};

export const isSameUser = (messages:any, m:any, i:any) => {
  return i > 0 && messages[i - 1].senderId=== m.senderId;
};
