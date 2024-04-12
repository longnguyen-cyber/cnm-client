import axios from "axios";
import queryString from "query-string";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
  },

  paramsSerializer: (params) => queryString.stringify(params),
});


axiosClient.interceptors.request.use(
  (config) => {
    const getLocalToken =JSON.parse(localStorage.getItem("tokenUser") as string);
 
    if (getLocalToken) {
      config.headers.Authorization = `Bearer ${(getLocalToken)}`;
   
    }
    return config;
  },
  function error() {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);
export default axiosClient;
