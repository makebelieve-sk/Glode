import { HsvColor } from "react-native-color-picker/dist/typeHelpers";
import { ThunkAction } from "redux-thunk";

import { reducer, ActionCreator } from './reducer';

type PropertyTypes<T> = T extends {[key: string]: infer U} ? U : never;
type InferActionsType<T extends {[key: string]: (...args: any) => any}> = ReturnType<PropertyTypes<T>>
type ActionCreatorType = InferActionsType<typeof ActionCreator>

type StateType = ReturnType<typeof reducer>;
type ThunkType = ThunkAction<Promise<void>, StateType, any, ActionCreatorType>;

type LampType = {
    toggleLamp: boolean,
    macAddress: string,
    id: string,
    title: string,
    params: string,
    src: string,
    type: string,
    brightness?: {
        min: string,
        max: string,
        step: string,
        currentValue: string
    },
    warmth?: {
        min: string,
        max: string,
        step: string,
        currentValue: string
    },
    speed?: {
        min: string,
        max: string,
        step: string,
        currentValue: string
    },
    list: {
        stateMode: {
            label: string,
            value: string
        }[],
        dinMode: {
            label: string,
            value: string
        }[],
        currentValue: string
    },
    colorPicker?: string
};

export {
    StateType,
    ActionCreatorType,
    ThunkType,
    LampType
};