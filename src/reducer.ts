import AsyncStorage from '@react-native-async-storage/async-storage';

import { LampType, ActionCreatorType, ThunkType, DinamicFildsLampType } from "./types";

type initialStateLampType = {
    lamps: LampType[],
    dinLamps: DinamicFildsLampType[],
    isLoading: boolean,
    errorMessage: null | string,
    lampScreenObject: null | any,
    isAuth: boolean,
    login: null | string,
    authInvalidMessage: null | string
};

const initialStateLamp: initialStateLampType = {
    lamps: [],
    dinLamps: [],
    isLoading: false,
    errorMessage: null,
    lampScreenObject: null,
    isAuth: false,
    login: null,
    authInvalidMessage: null,
};

const reducer = (state = initialStateLamp, action: ActionCreatorType) => {
    switch(action.type) {
        case 'GET_ALL_LAMPS':
            return Object.assign({}, state, {
                lamps: [ ...action.payload ],
                isLoading: false
            });
        case 'ADD_LAMP':
            return Object.assign({}, state, {
                lamps: [ ...state.lamps, action.payload ],
                isLoading: false
            });
        case 'ADD_DIN_LAMP':
            let newIndex = action.index;
            return Object.assign({}, state, {
                dinLamps: [ ...state.dinLamps.slice(0, newIndex), action.payload, ...state.dinLamps.slice(newIndex + 1) ],
                isLoading: false
            });
        case 'EDIT_LAMP':
            return Object.assign({}, state, {
                lamps: [ ...state.lamps.slice(0, action.index), action.payload, ...state.lamps.slice(action.index + 1) ],
                isLoading: false
            });
        case `REMOVE_LAMP`:
            let index = action.payload;
            return Object.assign({}, state, {
                lamps: [ ...state.lamps.slice(0, index), ...state.lamps.slice(index + 1) ],
                isLoading: false
            });
        case `GET_ERROR`:
            return Object.assign({}, state, {
                errorMessage: action.payload ? action.payload : null,
                isLoading: false
            });
        case `GET_LAMP_SCREEN`:
            return Object.assign({}, state, {
                lampScreenObject: action.payload ? action.payload : null,
                isLoading: false
            });
        case `CLEAR_LAMP_SCREEN`:
            return Object.assign({}, state, {
                lampScreenObject: null,
                isLoading: false
            });
        case `SET_ONLINE`:
            return Object.assign({}, state, {
                online: action.payload ? action.payload : false
            });
        case `SET_AUTH`:
            return Object.assign({}, state, {
                authInvalidMessage: null,
                isAuth: true,
                login: action.payload,
                isLoading: false,
            });
        case `SET_INVALID_AUTH`:
            return Object.assign({}, state, {
                authInvalidMessage: action.payload ? action.payload : null,
                isAuth: false,
                isLoading: false
            });
        case `SET_LOADING`:
            return Object.assign({}, state, {
                isLoading: true
            });
        default:
            return state;
    };
};

const Operation = {
    addNewLamp: (object: { name?: string | undefined, password?: string | undefined } | null): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.getMac.post('/', object)
            .then(async (response: any) => {
                const data = response.data;

                if (response.status >= 200 && response.status <= 300) {
                    console.log('data', data);
                    const getUser = async () => {
                        const user = await AsyncStorage.getItem('user');

                        if (user) {
                            dispatch(Operation.getAllLamps(user));
                        }
                    }
                    
                    getUser();
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при подключении новой лампы: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    removeLamp: (object: { lampId: string }): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.lamp.post('/remove', object)
        .then((response: any) => {
            const data = response.data;

            if (response.status >= 200 && response.status <= 300) {
                console.log(data.message);
            }
        })
        .catch((error: Error) => {
            let errorText = `Произошла ошибка при удалении лампы: ${error}`;
            dispatch(ActionCreator.getError(errorText));
        })
    },
    getAllLamps: (login: string | null): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.lamp.post(`/getall`, { login })
            .then((response: any) => {
                const data = response.data;

                if (response.status >= 200 && response.status <= 300) {
                    dispatch(ActionCreator.getAllLamps(data));
                }
            })
            .catch((error: Error) => {
                let errorText = `Произошла ошибка при загрузке всех ламп: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            })
    },
    // Авторизация пользователя
    authorization: (auth: string, object: { login: string, pass: String }): ThunkType => (dispatch, getState, globalApi) => {
        return globalApi.auth.post(`/${auth}`, object)
            .then((response: any) => {
                const data = response.data;
                
                if (response.status >= 200 && response.status <= 300 && data.login) {
                    // Функция записи пользователя в хранилище телефона
                    const setUser = async (login: string) => {
                        try {
                            await AsyncStorage.setItem('user', login);
                        } catch (error) {
                            let errorText = `Ошибка при сохранении пользователя: ${error}`;
                            dispatch(ActionCreator.getError(errorText));
                        }
                    };

                    setUser(data.login);
                    dispatch(ActionCreator.setAuth(object.login));
                }

                // if (!response.ok) {
                //     console.log('data.message', data.message)
                //     dispatch(ActionCreator.setInvalidAuth(data.message));
                // }
            })
            .catch((error: Error) => {
                console.log(error.message)
                let errorText = `Произошла ошибка при авторизации: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            });
    }
};

const ActionCreator = {
    // Добавление массива с лампами
    getAllLamps:(lamps: object[]) => {
        return {
            type: 'GET_ALL_LAMPS',
            payload: lamps
        } as const
    },
    // Добавление новой лампы
    addLamp: (object: LampType) => {
        return {
            type: 'ADD_LAMP',
            payload: object
        } as const
    },
    // Добавление динамических полей лампы
    addDinLamp: (index: number, object: DinamicFildsLampType) => {
        return {
            type: 'ADD_DIN_LAMP',
            payload: object,
            index: index
        } as const
    },
    editLamp:(index: number, object: LampType) => {
        return {
            type: 'EDIT_LAMP',
            index: index,
            payload: object
        } as const
    },
    // Удаление выбранной лампы из массива ламп
    removeLamp: (index: number) => {
        return {
            type: `REMOVE_LAMP`,
            payload: index
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
    getLampScreen: (object: DinamicFildsLampType) => {
        return {
            type: `GET_LAMP_SCREEN`,
            payload: object
        } as const
    },
    // Возврат с экрана лампы
    clearLampScreen: () => ({
        type: `CLEAR_LAMP_SCREEN`
    } as const),
    // Установка лампы "В сети/ Не в сети"
    setOnline: (isOnline: boolean) => {
        return {
            type: `SET_ONLINE`,
            payload: isOnline
        } as const
    },
    // Установка сообщения при проблеме авторизации
    setInvalidAuth: (message: string) => {
        return {
            type: 'SET_INVALID_AUTH',
            payload: message
        } as const
    },
    // Установка авторизации пользователя
    setAuth: (user: string) => ({
        type: 'SET_AUTH',
        payload: user
    } as const),
    // Установка спиннера загрузки
    setLoading: () => ({
        type: 'SET_LOADING',
    } as const)
};

export {
    Operation,
    ActionCreator,
    reducer
};