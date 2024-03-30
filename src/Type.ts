import { LazyExoticComponent } from "react";

export interface IRouteConfig {
    path: string;
    main: LazyExoticComponent<React.ComponentType<any>>;
  }

  export interface IUser{
    id: string;
    name: string;
    password: string;
    displayName: string;
    status: string;
    phone: string;
    email: string;
    isOwner: boolean;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    channel: string[];
    isOnline: boolean;
    token:string
  }

  export interface ILogin{
    email: string;
    password: string;
  }

  export interface IInitialStateUser{
  
    UserSlice:IUser[],
    loading:boolean
    tokenUser:String|null
    accessTokenToGen2fa:String|null
    
  }

  export interface IRegister {
    name: string;
    password: string;
    email: string;
    // confirmPassword: string;
  }

  export interface ISearch{
    setSeachHandle:Function,
    SearchHand:boolean,
    setSearchValue:Function
  }