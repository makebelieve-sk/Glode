import axios from 'axios';

const api = axios.create({
    baseURL: `http://25.47.16.149:3000`,
    timeout: 5000
});

// Создание объекта запроса для получения мак-адреса лампы (добавление лампы)
const getMac = axios.create({
    // baseURL: `http://192.168.4.1:80`,
    baseURL: `http://25.75.30.114:3000`,
    timeout: 5000
});

// Запрос на получение объекта лампы
const lumpIp = axios.create({
    baseURL: `http://25.75.30.114:3000`,
    timeout: 5000
})

// Глобальный возвращаемый объект
const globalApi = {
    api: api,
    getMac: getMac,
    lumpIp: lumpIp
};

export default globalApi;