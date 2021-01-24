import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions } from 'react-native';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
//@ts-ignore
import { Message } from 'react-native-paho-mqtt';

import client from '../../MQTTConnection';
import { DinamicFildsLampType, StateType } from '../../types';
import { ActionCreator } from '../../reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorPickerComponentType = {
    colorPicker: string,
    lampId: string
};

export const ColorPickerComponent: React.FC<ColorPickerComponentType> = ({ colorPicker, lampId }) => {
    const {dinLamp} = useSelector((state: StateType) => ({
        dinLamp: state.dinLamps,
    }));    
    const dispatch = useDispatch();

    const [ user, setUser ] = useState<null | string>(null);

    useEffect(() => {
        const GetUser = async () => {
            const user = await AsyncStorage.getItem('user');

            if (user) {
                setUser(user);
            }
        }

        GetUser();
    }, []);
    
    const [ color, setColor ] = useState<string>(colorPicker);
    const characteristic = `color-picker`;

    return <ColorPicker
        onColorSelected={color => alert(`Цвет: ${color}`)}
        style={{ width: 300, height: Dimensions.get('window').width > 400 ? 200 : 100 }}
        hideSliders={true}
        color={color}
        onColorChange={(color) => {
            let fromHsvColor = fromHsv(color); 
            setColor(fromHsvColor);

            let topic = `lamp/${user}/${lampId}/${characteristic}`;

            // Отправка сообщения на mqtt сервер
            const message = new Message(JSON.stringify(fromHsvColor));
            message.destinationName = topic;
            client.send(message);

            let currentLamp: any | DinamicFildsLampType = dinLamp.find((lamp: DinamicFildsLampType) => {
                return lamp.id === lampId;
            });

            currentLamp.colorPicker = fromHsvColor;

            let indexLamp = dinLamp.indexOf(currentLamp);

            if (currentLamp && indexLamp >= 0) {
                dispatch(ActionCreator.addDinLamp(indexLamp, currentLamp));
            }
        }}
    />
};