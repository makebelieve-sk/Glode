import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
//@ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';

import { AddLamp } from '../other-components/add-lamp';
import { LampScreen } from '../../screens/lamp-screen';
import { Spinner } from '../control-components/spinner';
import { ActionCreator, Operation } from '../../reducer';
import { DinamicFildsLampType, LampType, StateType } from '../../types';
import client from '../../MQTTConnection';

type BodyComponentType = {
    toggle: boolean | null, 
    setToggle: React.Dispatch<React.SetStateAction<boolean | null>>,
    setToggleState: React.Dispatch<React.SetStateAction<boolean | null>>,
};

export const BodyComponent: React.FC<BodyComponentType> = ({
    toggle, 
    setToggle,
    setToggleState,
}) => {
    let component: any;

    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    const { lamps, isLoading, lampScreenObject, login, dinLamps } = useSelector((state: StateType) => ({
        lamps: state.lamps,
        dinLamps: state.dinLamps,
        isLoading: state.isLoading,
        lampScreenObject: state.lampScreenObject,
        login: state.login
    }));
    const dispatch = useDispatch();

    const [ online, setOnline ] = useState<{ id: string, alive: boolean }[]>([]);

    let onlineArr: { id: string, alive: boolean }[] = [];

    // Получение полей динамических значений лампы
    useEffect(() => {
        let i = 0;
        client.on('messageReceived', (message: any) => {
            console.log('Текущий топик: ', message.destinationName);
            console.log('Ответ: ', message.payloadString);

            if (JSON.stringify(message.payloadString)[0] === '#') {
                return null;
            }

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

            if (main === 'lamp' && responseMQTT.constructor === Object && !characteristic) {
                console.log('currentValue', responseMQTT.currentValue)
                let objectDinLamp = {
                    id: lampId,
                    colorPicker: responseMQTT.colorPicker ? responseMQTT.colorPicker : '',
                    currentValue: responseMQTT.currentValue,
                    toggleLamp: responseMQTT.toggleLamp ? responseMQTT.toggleLamp : '',
                    brightness: responseMQTT.brightness ? responseMQTT.brightness : '',
                    warmth: responseMQTT.warmth ? responseMQTT.warmth : '',
                    speed: responseMQTT.speed ? responseMQTT.speed : '',
                    title: responseMQTT.title ? responseMQTT.title : '',
                    isDynamic: responseMQTT.isDynamic,
                }

                dispatch(ActionCreator.addDinLamp(i, objectDinLamp));
                i++;
            }
            // сделать стейт вкл/выкл
            // сделать управление цветным слайдером
            // сделать вывод текущего режима
            // перейти на React-native без expo
            // найти css-фреймворк
        });
    }, [])

    // Функция нажатия на лампу
    const onPressLump = (item: DinamicFildsLampType) => {
        setToggleState(item.toggleLamp);
        // dispatch(ActionCreator.setLoading());
        dispatch(ActionCreator.getLampScreen(item));
    };

    // Функция удаления лампы и удаление слушателя на эту лампу
    const deleteItemHanlder = (id: string) => {
        dispatch(Operation.removeLamp({ lampId: id }));

        lamps.forEach((item, index: number) => {
            if (item.lampId === id) {
                dispatch(ActionCreator.removeLamp(index));
            }
        });

        let topic = `${login}/${id}`;

        client.unsubscribe(topic);
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

    component = (
        <ScrollView style={styles.scrollView}>
            <View style={styles.wrapperList}> 
            { dinLamps && dinLamps.length > 0 ?               
                <FlatList
                    style={styles.flatList}
                    data={dinLamps}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        let toggleLamp = item.toggleLamp ? true : false;
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
                                            isOn={ toggle === null ? toggleLamp : toggle }
                                            onColor="green"
                                            offColor="#39383d"
                                            label=""
                                            labelStyle={{ color: "black", fontWeight: "900" }}
                                            size="large"
                                            onToggle={(isOn: boolean) => {
                                                setToggle(isOn);
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
    
    isLoading ? component = <Spinner /> :
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