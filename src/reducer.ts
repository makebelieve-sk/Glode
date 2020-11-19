import { AsyncStorage } from 'react-native';

import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import { LampType, ActionCreatorType, ThunkType } from "./types";

type initialStateLampType = {
    lamps: LampType[],
    isLoadingLamps: boolean,
    errorMessage: null | string,
    lampScreenObject: null | any,
    ip: string[],
    online: boolean,
    spinner: any
};

const initialStateLamp: initialStateLampType = {
    lamps: [],
    isLoadingLamps: true,
    errorMessage: null,
    lampScreenObject: null,
    ip: [],
    online: false,
    spinner: null
};

const reducer = (state = initialStateLamp, action: ActionCreatorType) => {
    switch(action.type) {
        case `LOAD_LAMPS`:
            return Object.assign({}, state, {
                lamps: action.payload ? action.payload : [],
                isLoadingLamps: !action.payload
            });
        case `PUSH_LAMP`:
            return Object.assign({}, state, {
                lamps: [...state.lamps, action.payload]
            });
        case `REMOVE_LAMP`:
            return Object.assign({}, state, {
                lamps: action.payload
            });
        case `GET_ERROR`:
            return Object.assign({}, state, {
                errorMessage: action.payload ? action.payload : null
            });
        case `GET_LAMP_SCREEN`:
            return Object.assign({}, state, {
                lampScreenObject: action.payload ? action.payload : null
            });
        case `CLEAR_LAMP_SCREEN`:
            return Object.assign({}, state, {
                lampScreenObject: null
            });
        case `SET_IP`:
            return Object.assign({}, state, {
                ip: [...state.ip, action.payload]
            });
        case `CLEAR_IP`:
            return Object.assign({}, state, {
                ip: []
            });
        case `SET_ALL_IP`:
            return Object.assign({}, state, {
                ip: action.payload
            });
        case `SET_ONLINE`:
            return Object.assign({}, state, {
                online: action.payload ? action.payload : false
            });
        case `SET_SPINNER`:
            return Object.assign({}, state, {
                spinner: action.payload ? action.payload : null
            });
        case `CLEAR_SPINNER`:
            return Object.assign({}, state, {
                spinner: null
            });
        default:
            return state;
    };
};

const Operation = {
    // Проверка на вкл/выкл лампы
    toggleLamp: (link: string, isOn: boolean): ThunkType => (dispatch, getState, api) => {
        return api.post(`/${link}`, isOn)
            .then((response: any) => {
                if (response.status >= 200 && response.status <= 300) {
                    console.log(`Лампа изменила состояние с ${!isOn} на ${isOn}`);
                }
            })
            .catch((error: Error) => {
                let errorText = `Ошибка при изменении состояния лампы: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // изменить все get на set
    // отправка данных с приложения
    sendData: (link: string, object: { currentValue?: number | string | HsvColor }): ThunkType => (dispatch, getState, api) => {
        return api.post(`/${link}`, object)
            .then((response: any) => {
                if (response.status >= 200 && response.status <= 300) {
                    console.log(`Данные отправились`);
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при отправке данных: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // Добавление нового объекта лампы
    addNewLamp: (link: string, object: { 
        name?: string | undefined, 
        password?: string | undefined 
    } | null): ThunkType => (dispatch, getState, api) => {
        return api.post(`/${link}`, object)
            .then((response: any) => {
                const data = response.data;

                if (response.status >= 200 && response.status <= 300) {
                    let macAddress = data.macAddress;
                    let ip = data.macAddress//!!!!!!!!!!!!!!!!вычислить ip и отправлять 2 запроса(гет и пост) уже не на маску, а на ip адрес
                    // Записываю ip-адрес новой лампы в массив ip-адресов
                    dispatch(ActionCreator.setIP(ip));
                    // коммент ниже (следующий оперэйшен)
                    dispatch(Operation.loadLamp(ip));
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при подключении новой лампы: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // Запрос на ip-адрес новой лампы
    loadLamp: (ip: string): ThunkType => (dispatch, getState, api) => {
        return api.post(`/${ip}`)
            .then((response: any) => {
                const data = response.data;

                // Остановка спиннера
                dispatch(ActionCreator.clearSpinner());
                // Добавление новой лампы в массив ламп
                dispatch(ActionCreator.pushLamp(data));

                // Происходит запись новой лампы в LocalStorage
                const appLapms = async (data: any) => {
                    try {
                        await AsyncStorage.setItem(`lamp`, JSON.stringify(data));
                    } catch (error) {
                        let errorText = `Ошибка при загрузке данных из хранилища: ${error}`;
                        dispatch(ActionCreator.getError(errorText));
                    }
                };

                appLapms(data);
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при загрузке лампы: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // Проверка лампы на "в сети" / "не в сети"
    getLamp: (ipLamp: string): ThunkType => (dispatch, getState, api) => {
        return api.get(`/${ipLamp}`)
            .then((response: any) => {
                const data = response.data;

                if (data) {
                    dispatch(ActionCreator.setOnline(true));
                }
            })
            .catch(() => {
                dispatch(ActionCreator.setOnline(false))
            })
    },
    // Запрос для обновления экрана при удалении лампы (можно отправлять хоть куда)
    reloadPage: (link: string): ThunkType => (dispatch, getState, api) => {
        return api.post(`/${link}`)
            .then((response: any) => {
                if (response.status >= 200 && response.status <= 300) {
                    // Добавляю существующие лампы, так как необходимо обновление экрана
                    dispatch(ActionCreator.loadLampsAC(initialStateLamp.lamps));
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при обновлении приложения: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
};

const ActionCreator = {
    // Добавление ламп из LocalStorage или всего массива ламп в общий массив ламп
    loadLampsAC: (data: LampType[]) => {
        return {
            type: `LOAD_LAMPS`,
            payload: data
        } as const   
    },
    // Устанавливаем новый массив ip-адресов ламп, которые есть на данный момент в LocalStorage
    setAllIP: (data: any) => {
        return {
            type: `SET_ALL_IP`,
            payload: data
        }
    },
    // Добавление новой лампы в массив ламп
    pushLamp: (object: LampType) => {
        return {
            type: `PUSH_LAMP`,
            payload: object
        } as const
    },
    // Удаление выбранной лампы из массива ламп
    removeLamp: (array: any[]) => {
        return {
            type: `REMOVE_LAMP`,
            payload: array
        } as const
    },
    // Установка ошибки
    getError: (error: string) => {
        return {
            type: `GET_ERROR`,
            payload: error
        } as const
    },
    // Смена на экран лампы
    getLampScreen: (object: LampType) => {
        return {
            type: `GET_LAMP_SCREEN`,
            payload: object
        } as const
    },
    // Возврат с экрана лампы
    clearLampScreen: () => ({
        type: `CLEAR_LAMP_SCREEN`
    } as const),
    // Установка ip-адреса новой лампы в массив ip-адресов
    setIP: (ip: string) => {
        return {
            type: `SET_IP`,
            payload: ip
        } as const
    },
    // Очищаю весь массив ip-адресов
    clearIP: () => ({
        type: `CLEAR_IP`
    } as const),
    // Установка лампы "В сети/ Не в сети"
    setOnline: (isOnline: boolean) => {
        return {
            type: `SET_ONLINE`,
            payload: isOnline
        } as const
    },
    // Показ спиннера загрузки
    setSpinner: (spinner: JSX.Element | null) => {
        return {
            type: `SET_SPINNER`,
            payload: spinner
        } as const
    },
    // Очистка спиннера загрузки
    clearSpinner: () => ({
        type: `CLEAR_SPINNER`
    } as const)
};

export {
    Operation,
    ActionCreator,
    reducer
};