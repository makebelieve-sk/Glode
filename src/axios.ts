import axios from 'axios';

const api = axios.create({
    baseURL: `http://25.47.16.149:3000`,
    timeout: 5000
});

export default api;