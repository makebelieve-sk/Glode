import { ThunkAction } from "redux-thunk";

import { reducer, ActionCreator } from './reducer';

type PropertyTypes<T> = T extends {[key: string]: infer U} ? U : never;
type InferActionsType<T extends {[key: string]: (...args: any) => any}> = ReturnType<PropertyTypes<T>>
type ActionCreatorType = InferActionsType<typeof ActionCreator>

type StateType = ReturnType<typeof reducer>;
type ThunkType = ThunkAction<Promise<void>, StateType, any, ActionCreatorType>;

// Объект лампы
type LampType = {
    // стат лист
    lampId: string, // id лампы
    title: string, // имя лампы
    lampType: string, // тип лампы 
    list: {
        label: string, // Название режима
        value: string | number, // Идентификатор
        dinType: boolean // является ли режим динамическим, если да, то мне нужно по этому флагу показывать ползунок скорости
    }[]
};

// дин поля
type DinamicFildsLampType = {
    colorPicker: string // цвет
    currentValue?: number // текущее значение режима, строчка value
    toggleLamp: boolean, // состояние лампы (вкл/выкл)
    brightness: string, // яркость
    warmth: string, // теплота
    speed: string, // скорость
    id: string // id лампы
    title?: string // название  лампы
    isDynamic: boolean // какой режим (дин или нет)
}

export {
    StateType,
    ActionCreatorType,
    ThunkType,
    LampType,
    DinamicFildsLampType
};