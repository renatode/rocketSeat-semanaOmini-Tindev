import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.33.184:3333'
});

export default api;