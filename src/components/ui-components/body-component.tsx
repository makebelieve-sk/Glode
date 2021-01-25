import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
//@ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';
//@ts-ignore
import { Message } from 'react-native-paho-mqtt';

import { AddLamp } from '../other-components/add-lamp';
import { LampScreen } from '../../screens/lamp-screen';
import { Spinner } from '../control-components/spinner';
import { ActionCreator } from '../../reducer';
import { DinamicFildsLampType, LampType, StateType } from '../../types';
import client from '../../MQTTConnection';
import { useHttp } from '../../hooks/useHttp.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BodyComponent: React.FC = () => {
    let component: any;

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    const { lamps, lampScreenObject, dinLamps } = useSelector((state: StateType) => ({
        lamps: state.lamps,
        dinLamps: state.dinLamps,
        lampScreenObject: state.lampScreenObject
    }));
    const dispatch = useDispatch();
    const { request, loading } = useHttp();

    const [ online, setOnline ] = useState<{ id: string, alive: boolean }[]>([]);
    const [ user, setUser ] = useState<null | string>(null);

    let onlineArr: { id: string, alive: boolean }[] = [];

    useEffect(() => {
        const GetUser = async () => {
            const user = await AsyncStorage.getItem('user');

            if (user) {
                setUser(user);
            }
        }

        GetUser();
    }, []);

    let characteristic = "toggleLamp";

    // Получение полей динамических значений лампы
    useEffect(() => {        
        client.on('messageReceived', async (message: any) => {
            // console.log('Текущий топик: ', message.destinationName);
            // console.log('Ответ: ', message.payloadString);

            let responseMQTT = JSON.parse(message.payloadString);
            
            let main: string = message.destinationName.split('/')[0];
            let lampId: string = message.destinationName.split('/')[2];
            let characteristic: string = message.destinationName.split('/')[3];

            if (main === 'online') {
                let object = {
                    id: lampId,
                    alive: responseMQTT.alive
                }

                let currentObj: any = onlineArr.find((onl) => {
                    return onl.id === lampId;
                });

                let indexOf = onlineArr.indexOf(currentObj);

                if (currentObj && indexOf >= 0) {
                    onlineArr = [ ...onlineArr.slice(0, indexOf), object, ...onlineArr.slice(indexOf + 1) ];
                } else {
                    onlineArr.push(object);
                }

                setOnline(onlineArr);
            }

            if (main === 'lamp' && !characteristic) {
                let objectDinLamp = {
                    id: lampId,
                    colorPicker: responseMQTT.colorPicker ? responseMQTT.colorPicker : '',
                    currentValue: responseMQTT.currentValue,
                    toggleLamp: responseMQTT.toggleLamp ? responseMQTT.toggleLamp : false,
                    brightness: responseMQTT.brightness ? responseMQTT.brightness : '',
                    warmth: responseMQTT.warmth ? responseMQTT.warmth : '',
                    speed: responseMQTT.speed ? responseMQTT.speed : '',
                    title: responseMQTT.title ? responseMQTT.title : '',
                    isDynamic: responseMQTT.isDynamic,
                }

                await AsyncStorage.setItem(`${lampId}`, JSON.stringify(objectDinLamp));
            }
        });  
    }, [])

    useEffect(() => {      
        const getAllKeys = async () => {
            let keys: string[] = [];

            try {
                keys = await AsyncStorage.getAllKeys();
                
                if (keys && keys.length > 0) {
                    let user: any = keys.find((key) => {
                        return key === 'user';
                    })

                    let index = keys.indexOf(user);

                    if (user && index >= 0) {
                        keys.splice(index, 1);
                    }

                    keys.forEach(async (key: string, index) => {
                        let data: any = await AsyncStorage.getItem(key);
                        dispatch(ActionCreator.addDinLamp(index, JSON.parse(data)));
                    });
                }
            } catch (error: any) {
                let errorText = `Произошла ошибка при подключении ламп: ${error}`;
                dispatch(ActionCreator.getError(errorText));
            }
        };

        getAllKeys();
    }, [AsyncStorage]);

    // Функция нажатия на лампу
    const onPressLump = (item: DinamicFildsLampType) => {
        dispatch(ActionCreator.getLampScreen(item));
    };

    // Функция удаления лампы из БД, из двух массивов ламп redux и удаление слушателя на эту лампу
    const deleteItemHanlder = async (id: string) => {
        await request('http://5.189.86.177:8080/api/lamp/remove', 'POST', {lampId: id});

        lamps.forEach((item, index: number) => {
            if (item.lampId === id) {
                dispatch(ActionCreator.removeLamp(index));
                dispatch(ActionCreator.removeDinLamp(index));
            }
        });

        const user = await AsyncStorage.getItem('user');
        await AsyncStorage.removeItem(`${id}`);

        if (user) {
            let topic = `${user}/${id}`;
            client.unsubscribe(topic);
        }
    };

    // Функция обработки свайпа на лево
    const onSwipeLeft = (id: string) => {
        return Alert.alert( "Удаление элемента", "Вы точно хотите удалить элемент?",
            [
                { text: "Да", onPress: () => deleteItemHanlder(id) },
                { text: "Отмена", onPress: () => {}, style: "cancel" }
            ],
            { cancelable: false }
        )
    };

    console.log(dinLamps)
    component = (
        <ScrollView style={styles.scrollView}>
            <View style={styles.wrapperList}> 
            { dinLamps && dinLamps.length > 0 ?               
                <FlatList
                    style={styles.flatList}
                    data={dinLamps}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => { 
                        console.log(item)                   
                        let isOnline = false;

                        let currentOnline = online.find((obj) => {
                            return obj.id === item.id;
                        });

                        if (currentOnline) {
                            isOnline = currentOnline.alive;
                        }

                        return (
                            <GestureRecognizer 
                                onSwipeLeft={() => onSwipeLeft(item.id)}
                                config={config}
                                style={{flex: 1, width: `100%`}}
                            >
                                <View style={styles.elementWrapper}>
                                    <TouchableOpacity 
                                        onPress={() => onPressLump(item)} 
                                        style={styles.wrapperElementName}
                                    >
                                        { isOnline ? 
                                            <Text style={styles.isOnline}>В сети</Text> : 
                                            <Text style={styles.notOnline}>Не в сети</Text>
                                        }
    
                                        <Text style={styles.elementName}>{ item.title }</Text>
                                    </TouchableOpacity>
    
                                    <View style={styles.wrapperButton}>
                                        <ToggleSwitch
                                            isOn={ item.toggleLamp }
                                            onColor="green"
                                            offColor="#39383d"
                                            label=""
                                            labelStyle={{ color: "black", fontWeight: "900" }}
                                            size="large"
                                            onToggle={(isOn: boolean) => {
                                                let topic = `lamp/${user}/${item.id}/${characteristic}`;

                                                // Отправка сообщения на mqtt сервер
                                                const message = new Message(JSON.stringify(isOn));
                                                message.destinationName = topic;
                                                client.send(message);

                                                item.toggleLamp = isOn;
                                                let currentDinLamp: any | DinamicFildsLampType = dinLamps.find((lamp: DinamicFildsLampType) => {
                                                    return lamp.id === item.id;
                                                });

                                                let indexLamp = dinLamps.indexOf(currentDinLamp);

                                                if (currentDinLamp && indexLamp >= 0) {
                                                    dispatch(ActionCreator.addDinLamp(indexLamp, currentDinLamp));
                                                }
                                            }}
                                            />
                                    </View>                    
                                </View>
                            </GestureRecognizer>
                    )}}
                /> :
                <Text style={styles.emptyText}>Список ламп пуст</Text>
            }

                <AddLamp />
        </View>
        </ScrollView>                     
    );
    
    loading ? component = <Spinner /> :
    lampScreenObject ? component = (
        <View style={styles.wrapperList}>
            <LampScreen lampScreenObject={lampScreenObject} />
        </View>
    ) : component;

    return component;
};

const styles = StyleSheet.create({
    scrollView: {
        width: `100%`,
        backgroundColor: `#6bc4fe`
    },
    wrapperList: {
      width: `100%`,
      alignItems: `center`,
      backgroundColor: `#6bc4fe`,
      paddingTop: 15,
      paddingBottom: 15
    },
    flatList: {
        width: `90%`,
    },
    elementWrapper: {
        width: `100%`,
        flexDirection: `row`,
        justifyContent: `space-between`,
        marginBottom: 10
    },
    wrapperElementName: {
        alignItems: `center`,
        width: `70%`,
        backgroundColor: `#fff`,
        borderRadius: 50
    },
    elementName: {
        fontSize: 20,
        padding: 10,
        paddingBottom: 20,
        paddingTop: 20,
        fontFamily: 'merri-weather-bold',
        fontWeight: `bold`,
    },
    isOnline: {
        position: `absolute`,
        top: 6, right: `8%`,
        fontSize: 16,
        color: `green`
    },
    notOnline: {
        position: `absolute`,
        top: 6, right: `8%`,
        fontSize: 16,
        color: `red`
    },
    wrapperButton: {
        flexDirection: `row`,
        width: `20%`,
        alignItems: `center`,
        justifyContent: `space-between`
    },
    emptyText: {
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'merri-weather-bold',
        fontWeight: `bold`,
        fontSize: 20,
        padding: 10,
    }
});