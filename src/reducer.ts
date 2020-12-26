import AsyncStorage from '@react-native-async-storage/async-storage';
import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import FileViewer from 'react-native-file-viewer';
// import arp from '@network-utils/arp-lookup';

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

// Функция получения ip-адреса лампы (статического адреса лампы)
const getIp = async (macAddress: string, dispatch: any) => {
    // try {
    //     if (arp.isMAC(macAddress)) {
    //         return await arp.toIP(macAddress);
    //     }
    // } catch (error) {
    //     let errorText = `Произошла ошибка при определении динамического адреса лампы: ${error}`;
    //     dispatch(ActionCreator.getError(errorText));
    // }
    return `192.168.2.47`;
}

const Operation = {
    // Добавление ip-адреса новой лампы
    // Ответ - только один мак-адрес лампы (динамический адрес лампы)
    // Задача - добавление в массив ip-адресов вычисленный ip-адрес лампы
    addNewLamp: (object: { 
        name?: string | undefined, 
        password?: string | undefined 
    } | null): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.getMac.post('/get-mac', object)
            .then(async (response: any) => {
                const data = response.data;

                if (response.status >= 200 && response.status <= 300) {
                    // Нахожу ip-адрес лампы (стаический адрес лампы)
                    let ipAddress = getIp(data.macAddress, dispatch);

                    const path = '/proc/net/arp';
                    FileViewer.open(path)
                    .then((response: any) => {
                        console.log(response);
                    })
                    .catch((error: Error) => {
                        let errorText = `Произошла ошибка при нахождении ip адреса устройства: ${error}`;
                        dispatch(ActionCreator.getError(errorText));
                    })

                    if (getState().ip && getState().ip.length > 0) {
                        let el = getState().ip.find(async (ip: any) => {
                            return ip === await ipAddress;
                        })

                        if (el) {
                            alert('Такая лампа уже подключена!');
                            dispatch(ActionCreator.clearSpinner());
                            return null;
                        } else {
                            dispatch(ActionCreator.setIP(await ipAddress));
                        }
                    } else if (getState().ip && getState().ip.length === 0) {
                        // Пушу найденный ip-адрес лампы в массив ip-адресов
                        dispatch(ActionCreator.setIP(await ipAddress));
                    }

                    if (getState().ip && getState().ip.length > 0) {
                        getState().ip.forEach((ip: string) => {
                            dispatch(Operation.loadLamp(ip));
                        })
                    }
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при подключении новой лампы: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // Запрос на ip-адрес новой лампы
    // Ответ - новый объект лампы
    // Задача - {
    //     Добавление нового объекта лампы в массив ламп,
    //     Остановка спиннера загрузки, 
    //     Запись нового объекта лампы в хранилище телефона
    // }
    loadLamp: (ip: string): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.lumpIp.post(`/${ip}`)
            .then((response: any) => {
                const data = response.data;

                if (response.status >= 200 && response.status <= 300) {
                    let currentState = getState();

                    if (currentState.ip && currentState.ip.length > 0) {
                        data.macAddress = currentState.ip[currentState.ip.length - 1];
                    }

                    data.id = data.macAddress;

                    // Добавление новой лампы в массив ламп
                    dispatch(ActionCreator.pushLamp(data));

                    // Добавление новой лампы в AsyncStorage
                    AsyncStorage.setItem(data.id, JSON.stringify(data));

                    // Остановка спиннера
                    dispatch(ActionCreator.clearSpinner());

                    // Происходит запись новой лампы в хранилище телефона
                    const appLapms = async (data: any) => {
                        try {
                            AsyncStorage.getAllKeys((err, keys: any) => {
                                AsyncStorage.multiGet(keys, (err, stores: any) => {
                                  stores.map((result: any, i: any, store: any) => {
                                    // Для каждой лампы, которая есть в AsyncStorage мы проверяем совпадает ли новая лампа, 
                                    // если совпадает, то не добавляем ее в AsyncStorage
                                    let value = store[i][1];
                                    value = JSON.parse(value);

                                    let valueString = JSON.stringify(value);
                                    let dataString = JSON.stringify(data);

                                    if (valueString !== dataString) {
                                        AsyncStorage.setItem(data.id, JSON.stringify(data));
                                    } else {
                                        return null;
                                    }
                                  });
                                });
                              });
                        } catch (error) {
                            let errorText = `Ошибка при загрузке данных из хранилища: ${error}`;
                            dispatch(ActionCreator.getError(errorText));
                        }
                    };

                    appLapms(data);
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при загрузке лампы: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // Запрос на проверку лампы ("В сети" / "Не в сети")
    // Если запрос дошел до лампы, то выставляес статус "В сети"
    // При ошибке выставляем статус "Не в сети"
    checkAlive: (ipLamp: string): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.lumpIp.get(`/${ipLamp}`)
            .then((response: any) => {
                const data = response.data;

                if (response.status >= 200 && response.status <= 300) {
                    dispatch(ActionCreator.setOnline(true));
                }
            })
            .catch(() => {
                dispatch(ActionCreator.setOnline(false))
            })
    },
    // Запрос на включение/выключение лампы
    // На данный момент ответ не интересен, так как состояине лампы одно на все компоненты, и изменяется везде
    // Ответ - значения 0 или 1, при 0 - лампа на данный момент выключилась, при 1 - лампа на данный момент включилась
    toggleLamp: (link: string, isOn: boolean): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.lumpIp.get(`/${link}`, isOn)
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
    // Запрос для обновления экрана при удалении лампы (можно отправлять хоть куда)
    reloadPage: (link: string): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.getMac.get(`/${link}`)
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
    // отправка данных с приложения
    // отправляется на аip адрес, который был получен из метода arp.toIp()
    sendData: (link: string, object: { currentValue?: number | string | HsvColor }): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.lumpIp.post(`/192.168.2.47/${link}`, object)
            .then((response: any) => {
                if (response.status >= 200 && response.status <= 300) {
                    console.log(`Данные отправились`);
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при отправке данных: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    }
};

const ActionCreator = {
    // Добавление ламп из AsyncStorage или всего массива ламп в общий массив ламп
    loadLampsAC: (data: LampType[]) => {
        return {
            type: `LOAD_LAMPS`,
            payload: data
        } as const   
    },
    // Устанавливаем новый массив ip-адресов ламп, которые есть на данный момент в AsyncStorage
    setAllIP: (data: string[] | any) => {
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
    setIP: (ip: string | null | undefined) => {
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