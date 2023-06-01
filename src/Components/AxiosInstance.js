import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://mcg-sl7h.onrender.com/",
  timeout: 5000,
});

export default AxiosInstance;
