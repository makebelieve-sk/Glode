import React, { Fragment, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';//@ts-ignore
import { ModalSelectList } from 'react-native-modal-select-list';
import { useDispatch } from 'react-redux';
import { SimpleLineIcons } from '@expo/vector-icons'; 

import { SliderComponent } from './slider';
import { Operation } from '../../reducer';
import { LampType } from '../../types';

type DropdownType = {
    lampScreenObject: LampType | any
};
   
export const Dropdown: React.FC<DropdownType> = ({ lampScreenObject }) => {
    const dispatch = useDispatch();
    const [ stateValue, setStateValue ] = useState<null | string>(null);
    const [ dinValue, setDinValue ] = useState<null | string>(null);
    const [ stateMode, setStateMode ] = useState<boolean>(true);

    let list = lampScreenObject.list;
    let speed = lampScreenObject.speed;
    let LINK = `${lampScreenObject.macAddress}/get_mode`;

    const [ sliderValueSpeed, setSliderValueSpeed ] = useState<number | number[]>(parseInt(speed.currentValue));

    let modalRef: any;

    const openModal = () => modalRef.show();
    const saveModalRef = (ref: any) => modalRef = ref;

    return (
      <Fragment>
        <SafeAreaView style={styles.blockWrapper}>
            { dinValue ? 
                <SliderComponent
                    slider={speed}
                    sliderValue={sliderValueSpeed}
                    setSliderValue={setSliderValueSpeed}
                    macAddress={lampScreenObject.macAddress}
                    speed={true}
                /> : null
            }
            <View style={styles.textWrapper}>
                <Text style={styles.textCurrentMode}>ТЕКУЩИЙ РЕЖИМ: { stateValue ? stateValue : dinValue ? dinValue : list.currentValue }</Text>
            </View>

            <View style={styles.flexBlockWrapper}>
                <TouchableOpacity style={styles.buttonMode} onPress={() => {
                    setStateMode(true);
                    openModal();
                }}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.textMode}>Статический режим</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonMode} onPress={() => {
                    setStateMode(false);
                    openModal();
                }}>
                    <View style={styles.textWrapper}>
                        <Text style={styles.textMode}>Динамический режим</Text>
                    </View>                    
                </TouchableOpacity>
            </View>           
        </SafeAreaView>

        { stateMode ? 
            <ModalSelectList
                ref={saveModalRef}
                placeholder={"Поиск..."}
                closeButtonComponent={<SimpleLineIcons name="arrow-left-circle" size={48} color="#fff" />}
                options={list.stateMode}
                onSelectedOption={(stateValue: string) => {
                    setStateValue(stateValue);
                    setDinValue(null);
                    dispatch(Operation.sendData(LINK, {
                        currentValue: stateValue
                    }))
                    console.log('Режим: ', stateValue)
                }}
                disableTextSearch={false}
                numberOfLines={10}
                headerTintColor={"#6bc4fe"}
            /> : 
            <ModalSelectList
                ref={saveModalRef}
                placeholder={"Поиск..."}
                closeButtonComponent={<SimpleLineIcons name="arrow-left-circle" size={48} color="#fff" />}
                options={list.dinMode}
                onSelectedOption={(dinValue: string) => {
                    setDinValue(dinValue);
                    setStateValue(null);
                    dispatch(Operation.sendData(LINK, {
                        currentValue: dinValue
                    }))
                    console.log('Режим: ', dinValue)
                }}
                disableTextSearch={false}
                numberOfLines={10}
                headerTintColor={"#6bc4fe"}
            /> 
        }        
      </Fragment>
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