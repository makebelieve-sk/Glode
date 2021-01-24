import {useCallback, useState} from 'react';
// import {message} from "antd";

export const useHttp = () => {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    // Функция настройки запросов на сервер
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);

        try {
            if (body) {
                body = JSON.stringify(body);
                headers["Content-Type"] = "application/json";
            }

            const response = await fetch(url, {method, body, headers});
        
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }

            setLoading(false);

            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            console.log(e.message)
            // message.error(e.message);
            throw e;
        }
    }, []);

    const clearError = () => setError(null);

    return { request, loading, error, clearError };
};