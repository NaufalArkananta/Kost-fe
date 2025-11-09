import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL  , // ganti sesuai base_url API di Postman
headers: {
    "Content-Type": "application/json",
    "MakerID": process.env.NEXT_PUBLIC_MAKER_ID || ""
},
});

export default axiosInstance;
