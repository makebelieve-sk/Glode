import React, { useState, useEffect } from 'react';//@ts-ignore
import { SliderSaturationPicker } from 'react-native-slider-color-picker';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import tinycolor from 'tinycolor2';
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HsvColor } from 'react-native-color-picker/dist/typeHelpers';
import { useDispatch, useSelector } from 'react-redux';
//@ts-ignore
import { Message } from 'react-native-paho-mqtt';

import { DinamicFildsLampType, StateType } from '../../types';
import client from '../../MQTTConnection';
import { ActionCreator } from '../../reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SliderColorPickerComponentType = {
    lampScreenObject: DinamicFildsLampType,
};
 
export const SliderColorPickerComponent: React.FC<SliderColorPickerComponentType> = ({ lampScreenObject }) => {
    const {dinLamp} = useSelector((state: StateType) => ({
        dinLamp: state.dinLamps
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
    
    let characteristic = `heat`;

    const [ oldColor, setOldColor ] = useState("#FF7700");

    let newRef;

    const saveNewRef = (ref: any) => newRef = ref;
 
    const changeColor = (colorHsvOrRgb: HsvColor, resType: string) => {
        if (resType === 'end') {
            let newValue = tinycolor(colorHsvOrRgb).toHexString();
            setOldColor(newValue);

            let topic = `lamp/${user}/${lampScreenObject.id}/${characteristic}`;

            // Отправка сообщения на mqtt сервер
            const message = new Message(JSON.stringify(newValue));
            message.destinationName = topic;
            client.send(message);

            let currentLamp: any | DinamicFildsLampType = dinLamp.find((lamp: DinamicFildsLampType) => {
                return lamp.id === lampScreenObject.id;
            });

            currentLamp.warmth = newValue;

            let indexLamp = dinLamp.indexOf(currentLamp);

            if (currentLamp && indexLamp >= 0) {
                dispatch(ActionCreator.addDinLamp(indexLamp, currentLamp));
            }
        }
    }

    return (
        <View style={styles.mainWrapper}>
            <Text style={styles.sliderName}>теплота</Text>

            <View style={styles.mainWrapperSliderBlock}>
            <Fontisto name="day-sunny" size={40} color="#fff" />

                <View style={styles.container}>
                    <SliderSaturationPicker
                        ref={saveNewRef}
                        oldColor={oldColor}
                        trackStyle={[{ height: 5, width: Dimensions.get('window').width > 400 ? 250 : 150}]}
                        thumbStyle={{
                            backgroundColor: `${oldColor}`,
                            borderRadius: 15,
                            height: 30,
                            width: 30,
                        }}
                        useNativeDriver={true}
                        onColorChange={changeColor}
                        style={{borderRadius: 5, height: 5, backgroundColor: tinycolor({h: tinycolor(oldColor).toHsv().h, s: 1, v: 1}).toHexString()}}
                    />
                </View>

                <MaterialCommunityIcons name="white-balance-sunny" size={40} color={`${oldColor}`} />
            </View>
        </View>
    );
};
 
const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        alignItems: `center`
    },
    mainWrapperSliderBlock: {
        flexDirection: `row`,
        justifyContent: `space-around`
    },
    container: {
        flex: 1,
        marginVertical: 15,
        marginHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        marginRight: 30
    },
    sliderName: {
        fontFamily: 'merri-weather-bold',
        fontSize: 20,
        color: `#fff`,
        fontWeight: "bold",
        marginBottom: 5
    }
});