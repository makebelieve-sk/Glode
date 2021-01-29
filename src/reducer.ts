import { LampType, ActionCreatorType, DinamicFildsLampType } from "./types";

type initialStateLampType = {
    lamps: LampType[],
    dinLamps: DinamicFildsLampType[],
    errorMessage: null | string,
    lampScreenObject: null | any,
    isAuth: boolean,
    authInvalidMessage: null | string
};

const initialStateLamp: initialStateLampType = {
    lamps: [],
    dinLamps: [],
    errorMessage: null,
    lampScreenObject: null,
    isAuth: false,
    authInvalidMessage: null,
};

const reducer = (state = initialStateLamp, action: ActionCreatorType) => {
    switch(action.type) {
        case 'GET_ALL_LAMPS':
            return Object.assign({}, state, {
                lamps: action.payload
            });
        case 'ADD_LAMP':
            return Object.assign({}, state, {
                lamps: [ ...state.lamps, action.payload ]
            });
        case 'ADD_DIN_LAMP':
            let newIndex = action.index;
            return Object.assign({}, state, {
                dinLamps: [ ...state.dinLamps.slice(0, newIndex), action.payload, ...state.dinLamps.slice(newIndex + 1) ]
            });
        case 'PUSH_DIN_LAMP':
            return Object.assign({}, state, {
                dinLamps: [ ...state.dinLamps, action.payload ]
            });
        case `REMOVE_LAMP`:
            let index = action.payload;
            return Object.assign({}, state, {
                lamps: [ ...state.lamps.slice(0, index), ...state.lamps.slice(index + 1) ]
            });
        case `REMOVE_DIN_LAMP`:
            let indexDin = action.payload;
            return Object.assign({}, state, {
                dinLamps: [ ...state.lamps.slice(0, indexDin), ...state.lamps.slice(indexDin + 1) ]
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
        case `SET_ONLINE`:
            return Object.assign({}, state, {
                online: action.payload ? action.payload : false
            });
        case `SET_AUTH`:
            return Object.assign({}, state, {
                authInvalidMessage: null,
                isAuth: true
            });
        case `LOG_OUT`:
            return Object.assign({}, state, {
                authInvalidMessage: null,
                isAuth: false
            });
        case `SET_INVALID_AUTH`:
            return Object.assign({}, state, {
                authInvalidMessage: action.payload ? action.payload : null,
                isAuth: false
            });
        default:
            return state;
    };
};

// const Operation = {
//     // addNewLamp: (object: { name?: string | undefined, password?: string | undefined } | null): ThunkType => (dispatch, getState, globalApi) => {
//     //     return globalApi.getMac.post('/', object)
//     //         .then(async (response: any) => {
//     //             const data = response.data;

//     //             if (response.status >= 200 && response.status <= 300) {
//     //                 console.log('data', data);
//     //                 const getUser = async () => {
//     //                     const user = await AsyncStorage.getItem('user');

//     //                     if (user) {
//     //                         dispatch(Operation.getAllLamps(user));
//     //                     }
//     //                 }
                    
//     //                 getUser();
//     //             }
//     //         })
//     //         .catch((error: Error) => {
//     //             let errorText = `Произошла ошибка при подключении новой лампы: ${error}`;
//     //             dispatch(ActionCreator.getError(errorText));
//     //         })
//     // },
//     // removeLamp: (object: { lampId: string }): ThunkType => (dispatch, getState, globalApi) => {
//     //     return globalApi.lamp.post('/remove', object)
//     //     .then((response: any) => {
//     //         const data = response.data;

//     //         if (response.status >= 200 && response.status <= 300) {
//     //             console.log(data.message);
//     //         }
//     //     })
//     //     .catch((error: Error) => {
//     //         let errorText = `Произошла ошибка при удалении лампы: ${error}`;
//     //         dispatch(ActionCreator.getError(errorText));
//     //     })
//     // },
//     // getAllLamps: (login: string | null): ThunkType => (dispatch, getState, globalApi) => {
//     //     return globalApi.lamp.post(`/getall`, { login })
//     //         .then((response: any) => {
//     //             const data = response.data;

//     //             if (response.status >= 200 && response.status <= 300) {
//     //                 dispatch(ActionCreator.getAllLamps(data));
//     //             }
//     //         })
//     //         .catch((error: Error) => {
//     //             let errorText = `Произошла ошибка при загрузке всех ламп: ${error}`;
//     //             dispatch(ActionCreator.getError(errorText));
//     //         })
//     // },
//     // Авторизация пользователя
//     // authorization: (auth: string, object: { login: string, pass: String }): ThunkType => (dispatch, getState, globalApi) => {
//     //     return globalApi.auth.post(`/${auth}`, object)
//     //         .then((response: any) => {
//     //             const data = response.data;
                
//     //             if (response.status >= 200 && response.status <= 300 && data.login) {
//     //                 // Функция записи пользователя в хранилище телефона
//     //                 const setUser = async (login: string) => {
//     //                     try {
//     //                         await AsyncStorage.setItem('user', login);
//     //                     } catch (error) {
//     //                         let errorText = `Ошибка при сохранении пользователя: ${error}`;
//     //                         dispatch(ActionCreator.getError(errorText));
//     //                     }
//     //                 };

//     //                 setUser(data.login);
//     //                 dispatch(ActionCreator.setAuth(object.login));
//     //             }

//     //             // if (!response.ok) {
//     //             //     console.log('data.message', data.message)
//     //             //     dispatch(ActionCreator.setInvalidAuth(data.message));
//     //             // }
//     //         })
//     //         .catch((error: Error) => {
//     //             console.log(error.message)
//     //             let errorText = `Произошла ошибка при авторизации: ${error}`;
//     //             dispatch(ActionCreator.getError(errorText));
//     //         });
//     // }
// };

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
    // Добавление динамических полей лампы в массив
    addDinLamp: (index: number, object: DinamicFildsLampType) => {
        return {
            type: 'ADD_DIN_LAMP',
            payload: object,
            index: index
        } as const
    },
    // Добавление динамических полей лампы в конец массива
    pushDinLamp:(object: DinamicFildsLampType) => {
        return {
            type: 'PUSH_DIN_LAMP',
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
    // Удаление выбранной лампы из массива ламп
    removeDinLamp: (index: number) => {
        return {
            type: `REMOVE_DIN_LAMP`,
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
    // Установка авторизации пользователя
    logOut: () => ({
        type: 'LOG_OUT'
    } as const)
};

export {
    ActionCreator,
    reducer
};