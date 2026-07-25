import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true, // to send cookies
});

export default instance;
