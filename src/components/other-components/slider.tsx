import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Slider } from "@miblanchard/react-native-slider";
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//@ts-ignore
import { Message } from 'react-native-paho-mqtt';

import client from '../../MQTTConnection';
import { DinamicFildsLampType, StateType } from '../../types';
import { ActionCreator } from '../../reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SliderComponentType = {
    sliderValue: number | number[], 
    setSliderValue: React.Dispatch<React.SetStateAction<number | number[]>>, 
    speed: boolean,
    lampId: string,
    heat: boolean
};

export const SliderComponent: React.FC<SliderComponentType> = ({ sliderValue, setSliderValue, speed, lampId, heat }) => {
    const {dinLamps} = useSelector((state: StateType) => ({
        dinLamps: state.dinLamps
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

    let characteristic = `brightness`;
    speed ? characteristic = `speed` : null;
    heat ? characteristic = 'warmth' : null;

    return (
        <View style={styles.mainWrapper}>
            <Text style={styles.sliderName}>{ speed ? "скорость" : heat ? "теплота" : "яркость" }</Text>
            
            <View style={styles.mainWrapperSliderBlock}>
                { 
                    !speed ? 
                        <Fontisto name="day-sunny" size={40} color="#fff" /> :
                        <MaterialCommunityIcons name="speedometer-slow" size={40} color="#fff" />
                }
            
                <View style={styles.container}>
                    <Slider
                        animateTransitions
                        minimumValue={0}
                        step={10}
                        maximumValue={255}
                        minimumTrackTintColor="#fff"
                        thumbStyle={styles.thumb}
                        trackStyle={styles.track}
                        value={sliderValue}
                        onValueChange={newSliderValue => {
                            setSliderValue(newSliderValue);

                            let topic = `lamp/${user}/${lampId}/${characteristic}`;

                            // Отправка сообщения на mqtt сервер
                            const message = new Message(JSON.stringify(newSliderValue[0]));
                            message.destinationName = topic;
                            client.send(message);

                            let currentLamp: any | DinamicFildsLampType = dinLamps.find((lamp: DinamicFildsLampType) => {
                                return lamp.id === lampId;
                            });

                            speed ? currentLamp.speed = newSliderValue[0] : currentLamp.brightness = newSliderValue[0];

                            let indexLamp = dinLamps.indexOf(currentLamp);

                            if (currentLamp && indexLamp >= 0) {
                                dispatch(ActionCreator.addDinLamp(indexLamp, currentLamp));
                            }
                        }}
                    />
                </View>

                { 
                    !speed ? 
                        <MaterialCommunityIcons name="white-balance-sunny" size={40} color="#fff" /> :
                        <MaterialCommunityIcons name="speedometer" size={40} color="#fff" />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        alignItems: `center`
    },
    sliderName: {
        fontFamily: 'merri-weather-bold',
        fontSize: 20,
        color: `#fff`,
        fontWeight: "bold",
        marginBottom: 5
    },
    thumb: {
        backgroundColor: "#fff",
        borderRadius: 15,
        height: 30,
        width: 30,
    },
    track: {
        backgroundColor: "#fff",
        borderRadius: 5,
        height: 5,
    },
    mainWrapperSliderBlock: {
        flexDirection: `row`,
        justifyContent: `space-around`
    },
    container: {
        flex: 1,
        marginHorizontal: 10,
        alignItems: "stretch",
        justifyContent: "center",
        width: Dimensions.get('window').width > 400 ? 250 : 150,
        paddingLeft: 15,
        marginRight: 30
    }
});