import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API;

export default axios.create({
  baseURL: API_URL,
});

export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
