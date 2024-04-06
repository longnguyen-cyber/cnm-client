
//hàm này có nhiệm vụ kiểm tra tin nhan có cùng một người gửi hay không ,và tin nhắn đó phải khác vs người dùng hiện tại 
//đầu tiên kiểm tra tin nhắn phía sau có khác người dùng hay không tại vì là chat đơn chỉ có 2 người dùng thôi 

import { IUser } from "../../../../../Type";

export const isSameSenderMargin = (messages:any, m:any, i:any, userId:string) => {
  

  // console.log(i === messages.length - 1);

  if (
    messages[messages.length - 1].typeMsg !=='recall'&& i < messages.length - 1 &&
    messages[i + 1].user.id === m.user.id&&
    messages[i].user.id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].user.id !== m.user.id&&
      messages[i].user.id !== userId) ||
    (i === messages.length - 1 && messages[i].user.id !== userId)
  )
    return 6;
  else return "auto";
};

export const isSameSender = (messages:any, m:any, i:any, userId:any) => {

  return (
    messages[messages.length - 1].typeMsg !=='recall' &&  i < messages.length - 1 &&
    (messages[i + 1].user.id !== m.user.id||
      messages[i + 1].user.id=== undefined) &&
    messages[i].user.id !== userId
  );
};

export const isLastMessage = (messages:any, i:any, userId:any) => {

  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].user.id !== userId &&
    messages[messages.length - 1].user.id
  );
};

export const isSameUser = (messages:any, m:any, i:any) => {

  return i > 0 && messages[i - 1].user.id=== m.user.id;
};
