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
    const {dinLamp, lamps, user} = useSelector((state: StateType) => ({
        dinLamp: state.dinLamps,
        lamps: state.lamps,
        user: state.user
    }));
    const dispatch = useDispatch();

    // Установка текущего названия режима, типа режима и списка режимов
    let lamp: LampType | any = lamps.find((lamp: LampType) => {
        return lampScreenObject.id === lamp.lampId;
    });

    let effectList: any = [];
    let isDinEffect: boolean = false;
    let currentEffectLabel: string = '';

    if (lamp) {
        lamp.list.forEach((effect: { label: string; value: number | undefined; dinType: boolean; }) => {
            effectList.push({label: effect.label, value: JSON.stringify(effect.value)});

            if (lampScreenObject.currentValue === effect.value) {
                isDinEffect = effect.dinType;
                currentEffectLabel = effect.label;
            }
        })
    }

    const [ dinValue, setDinValue ] = useState<boolean>(isDinEffect);
    const [ title, setTitle ] = useState<string>(currentEffectLabel);

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
                    heat={false}
                /> : null
            }
            <View style={styles.textWrapper}>
                <Text style={styles.textCurrentMode}>ТЕКУЩИЙ РЕЖИМ: { title }</Text>
            </View>

            <View style={styles.flexBlockWrapper}>
                <TouchableOpacity style={styles.buttonMode} onPress={openModal}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.textMode}>Эффекты лампы</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

        <ModalSelectList
            ref={saveModalRef}
            placeholder={"Поиск..."}
            closeButtonComponent={<SimpleLineIcons name="arrow-left-circle" size={48} color="#fff" />}
            options={effectList}
            onSelectedOption={(stateValue: string) => {
                // Нахождение названия текущего режима по его значению из массива режимов
                let result;

                let currentObj = effectList.find((obj: { label: string, value: string }) => {
                    return obj.value === stateValue;
                });

                if (currentObj) {
                    result = currentObj.label;
                };

                // Отправка сообщения на mqtt сервер
                let topic = `lamp/${user}/${lampScreenObject.id}/${characteristic}`;

                const message = new Message(stateValue);
                message.destinationName = topic;
                client.send(message);
                
                // Изменение выбранного режима в текущей лампе
                let currentLamp: any | DinamicFildsLampType = dinLamp.find((lamp: DinamicFildsLampType) => {
                    return lamp.id === lampScreenObject.id;
                });
    
                currentLamp.currentValue = result;
    
                let indexLamp = dinLamp.indexOf(currentLamp);
    
                if (currentLamp && indexLamp >= 0) {
                    dispatch(ActionCreator.addDinLamp(indexLamp, currentLamp));
                }

                // проверка на тип выбранного значения
                let newLamp = lamp.list.find((effect: any) => {
                    return effect.value === Number(stateValue) && effect.dinType;
                });

                if (newLamp) {
                    setDinValue(true);
                } else {
                    setDinValue(false);
                }

                // Установка названия выбранного режима
                setTitle(result);
            }}
            disableTextSearch={false}
            numberOfLines={10}
            headerTintColor={"#6bc4fe"}
        />
      </>
    );
};

const styles = StyleSheet.create({
    blockWrapper: {
        width: `100%`
    },
    flexBlockWrapper: {
        width: `100%`,
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