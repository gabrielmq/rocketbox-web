import axios from 'axios';

const api = axios.create({
  baseURL: 'https://omnistack-rocketbox.herokuapp.com'
});

export default api;
