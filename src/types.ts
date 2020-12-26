import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import { ThunkAction } from "redux-thunk";

import { reducer, ActionCreator } from './reducer';

type PropertyTypes<T> = T extends {[key: string]: infer U} ? U : never;
type InferActionsType<T extends {[key: string]: (...args: any) => any}> = ReturnType<PropertyTypes<T>>
type ActionCreatorType = InferActionsType<typeof ActionCreator>

type StateType = ReturnType<typeof reducer>;
type ThunkType = ThunkAction<Promise<void>, StateType, any, ActionCreatorType>;

// Объект лампы
type LampType = {
    toggleLamp: boolean, // состояние лампы (вкл/выкл)
    macAddress: string, // динамический адрес лампы
    title: string, // имя лампы
    type: string, // тип лампы 
    brightness?: string, // яркость
    warmth?: string, // теплота
    speed?: string, // скорость
    list: {// для удобства предлагаю сделать объект с двумя полями - массивами
        stateMode: {
            label: string,
            value: string | number
        }[], // массив объектов, в каждом объекте два поля, это строка - название, и значение - айди 
        dinMode: {
            label: string,
            value: string | number
        }[],// массив объектов, в каждом объекте два поля, это строка - название, и значение - айди 
        currentValue: string // текущее значение режима
    },
    colorPicker?: string // цвет
};

export {
    StateType,
    ActionCreatorType,
    ThunkType,
    LampType
};