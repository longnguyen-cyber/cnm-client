
//hàm này có nhiệm vụ kiểm tra tin nhan có cùng một người gửi hay không ,và tin nhắn đó phải khác vs người dùng hiện tại 
//đầu tiên kiểm tra tin nhắn phía sau có khác người dùng hay không tại vì là chat đơn chỉ có 2 người dùng thôi 

import { IUser } from "../../../../../Type";

//nếu tin nhắn phía sau khác người 
// export const isSamMessageUser=(messages:any,m:any,i:number,user:IUser)=>{
//     return (
//                i<messages.length-1&&
//                (messages[i+1].senderId!=m.senderId||messages[i+1].senderId===undefined)&&messages[i].senderId!==user.id
//     )
// }
// export const isLastMessage = (messages:any, i:number, userId:String) => {
//   return (
//     i === messages.length - 1 &&
//     messages[messages.length - 1].senderId !== userId &&
//     messages[messages.length - 1].senderId
//   );
// };
// export const isMessagesUserMargin=(messages:any,m:any,i:number,user:IUser)=>{
//   console.log(messages[i+1].senderId)

//       if(i<messages.length-1&&messages[i+1].senderId===m.senderId&&messages[i+1].senderId!==user.id){
//         return 'ml-16'
        
//       }
//       else if(i<messages.length-1&&messages[i+1].senderId!=m.senderId&&messages[i].senderId!==user.id||(i===messages.length-1&&messages[i].senderId!==user.id)){
//         return 'ml-2'
//       }
//       else{
//         return 'ml-auto pr-5'
//       }

// }
export const isSameSenderMargin = (messages:any, m:any, i:any, userId:string) => {
  // console.log(i === messages.length - 1);

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
