import axios from 'axios';

// Запрос на добавление лампы
const getMac = axios.create({
    baseURL: `http://192.168.4.1:80`,
    timeout: 5000
});

// Запрос на получение всех ламп
const lamp = axios.create({
    baseURL: `http://5.189.86.177:8080/api/lamp`,
    timeout: 5000
});

// Вход / Регистрация пользователя
const auth = axios.create({
    baseURL: `http://5.189.86.177:8080/api/auth`,
    timeout: 5000
})

// Api
const globalApi = { getMac, lamp, auth };

export default globalApi;