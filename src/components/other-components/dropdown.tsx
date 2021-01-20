import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';//@ts-ignore
import { ModalSelectList } from 'react-native-modal-select-list';
import { SimpleLineIcons } from '@expo/vector-icons';
//@ts-ignore
import { Message } from 'react-native-paho-mqtt';

import { SliderComponent } from './slider';
import { DinamicFildsLampType, LampType, StateType } from '../../types';
import client from '../../MQTTConnection';
import { ActionCreator } from '../../reducer';

const characteristic = 'effect';

type DropdownType = {
    lampScreenObject: DinamicFildsLampType,
};

export const Dropdown: React.FC<DropdownType> = ({ lampScreenObject }) => {
    const {login, dinLamp, lamps} = useSelector((state: StateType) => ({
        login: state.login,
        dinLamp: state.dinLamps,
        lamps: state.lamps
    }));    
    const dispatch = useDispatch();

    let lamp = lamps.find((lamp: LampType) => {
        return lampScreenObject.id === lamp.lampId;
    });

    let staticModeArr: any = [];
    let dinArr: any = [];
    let effectName: any = {
        label: '',
        value: -1
    };

    if (lamp) {
        lamp.list.staticMode.forEach((obj) => {
            staticModeArr.push({ label: obj.label, value: JSON.stringify(obj.value) });
        });

        lamp.list.dinMode.forEach((obj) => {
            dinArr.push({ label: obj.label, value: JSON.stringify(obj.value) });
        });

        effectName = lamp.list.staticMode.find((obj) => {
            return obj.value == lampScreenObject.currentValue;
        });

        if (!effectName || effectName.label == '') {
            effectName = lamp.list.dinMode.find((obj) => {
                return obj.value == lampScreenObject.currentValue;
            });
        }
    }

    const [ dinValue, setDinValue ] = useState<boolean>(lampScreenObject.isDynamic);
    const [ title, setTitle ] = useState<string>('');

    let speed = lampScreenObject.speed;

    const [ sliderValueSpeed, setSliderValueSpeed ] = useState<number | number[]>(parseInt(speed));

    let modalRef: any;

    const openModal = () => modalRef.show();
    const saveModalRef = (ref: any) => modalRef = ref;

    return (
      <>
        <SafeAreaView style={styles.blockWrapper}>
            { dinValue ?
                <SliderComponent
                    sliderValue={sliderValueSpeed}
                    setSliderValue={setSliderValueSpeed}
                    speed={true}
                    lampId={lampScreenObject.id}
                /> : null
            }
            <View style={styles.textWrapper}>
                <Text style={styles.textCurrentMode}>ТЕКУЩИЙ РЕЖИМ: { title }</Text>
            </View>

            <View style={styles.flexBlockWrapper}>
                <TouchableOpacity style={styles.buttonMode} onPress={() => {
                    setDinValue(false);
                    openModal();
                }}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.textMode}>Стат. режим</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonMode} onPress={() => {
                    setDinValue(true);
                    openModal();
                }}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.textMode}>Дин. режим</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

        { !dinValue ?
            <ModalSelectList
                ref={saveModalRef}
                placeholder={"Поиск..."}
                closeButtonComponent={<SimpleLineIcons name="arrow-left-circle" size={48} color="#fff" />}
                options={staticModeArr}
                onSelectedOption={(stateValue: string) => {
                    let currentObj = staticModeArr.find((obj: { label: string, value: string }) => {
                        return obj.value === stateValue;
                    });

                    let result;

                    if (currentObj) {
                        result = currentObj.label;
                    };

                    setTitle(result);
                    setDinValue(false);
                    console.log('Режим: ', result);

                    let topic = `lamp/${login}/${lampScreenObject.id}/${characteristic}`;

                    // Отправка сообщения на mqtt сервер
                    const message = new Message(stateValue);
                    message.destinationName = topic;
                    client.send(message);
                    
                    let currentLamp: any | DinamicFildsLampType = dinLamp.find((lamp: DinamicFildsLampType) => {
                        return lamp.id === lampScreenObject.id;
                    });
        
                    currentLamp.currentValue = result;
        
                    let indexLamp = dinLamp.indexOf(currentLamp);
        
                    if (currentLamp && indexLamp >= 0) {
                        dispatch(ActionCreator.addDinLamp(indexLamp, currentLamp));
                    }
                }}
                disableTextSearch={false}
                numberOfLines={10}
                headerTintColor={"#6bc4fe"}
            /> :
            <ModalSelectList
                ref={saveModalRef}
                placeholder={"Поиск..."}
                closeButtonComponent={<SimpleLineIcons name="arrow-left-circle" size={48} color="#fff" />}
                options={dinArr}
                onSelectedOption={(dinValue: string) => {
                    let currentObj = dinArr.find((obj: { label: string, value: string }) => {
                        return obj.value === dinValue;
                    });

                    let result;

                    if (currentObj) {
                        result = currentObj.label;
                    };

                    setTitle(result);
                    setDinValue(true);
                    console.log('Режим: ', result)

                    let topic = `lamp/${login}/${lampScreenObject.id}/${characteristic}`;

                    // Отправка сообщения на mqtt сервер
                    const message = new Message(dinValue);
                    message.destinationName = topic;
                    client.send(message);

                    let currentLamp: any | DinamicFildsLampType = dinLamp.find((lamp: DinamicFildsLampType) => {
                        return lamp.id === lampScreenObject.id;
                    });
        
                    currentLamp.currentValue = result;
        
                    let indexLamp = dinLamp.indexOf(currentLamp);
        
                    if (currentLamp && indexLamp >= 0) {
                        dispatch(ActionCreator.addDinLamp(indexLamp, currentLamp));
                    }
                }}
                disableTextSearch={false}
                numberOfLines={10}
                headerTintColor={"#6bc4fe"}
            />
        }
      </>
    );
};

const styles = StyleSheet.create({
    blockWrapper: {
        width: `100%`
    },
    flexBlockWrapper: {
        flexDirection: `row`,
        width: `100%`,
        justifyContent: `space-between`,
        alignItems: `center`,
    },
    buttonMode: {
        width: `49%`,
        backgroundColor: `#fff`,
        borderRadius: 50
    },
    textWrapper: {
        alignItems: `center`,
        justifyContent: `center`
    },
    textCurrentMode: {
        fontSize: 20,
        paddingVertical: 10,
        fontFamily: 'merri-weather-bold',
        color: `#fff`
    },
    textMode: {
        fontSize: 16,
        padding: 10,
        fontFamily: 'merri-weather-bold',
        color: `black`
    }
})