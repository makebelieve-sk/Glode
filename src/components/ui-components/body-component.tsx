import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
//@ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';

import { AddLamp } from '../other-components/add-lamp';
import { LampScreen } from '../../screens/lamp-screen';
import { Spinner } from '../control-components/spinner';
import { Operation, ActionCreator } from '../../reducer';
import { LampType } from '../../types';

type BodyComponentType = {
    toggle: boolean | null, 
    setToggle: React.Dispatch<React.SetStateAction<boolean | null>>,
    data: LampType[] | any,
    lampScreenObject: any,
    ip: string[],
    online: boolean,
    spinner: JSX.Element | null,
    setSecondScreen: React.Dispatch<React.SetStateAction<string | null>>,
    getLampScreen: (item: LampType) => any,
    setToggleState: React.Dispatch<React.SetStateAction<boolean | null>>,
    setIpAddress: React.Dispatch<React.SetStateAction<string | null>>
};

const LINK = `192.168.1.1`;

export const BodyComponent: React.FC<BodyComponentType> = ({
    toggle, 
    setToggle,
    data, 
    lampScreenObject, 
    ip, 
    online, 
    spinner, 
    setSecondScreen, 
    setToggleState,
    getLampScreen,
    setIpAddress
}) => {
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    const dispatch = useDispatch();

    const [ dataObjects, setDataObjects ] = useState<LampType[] | any>(data);

    const pressHandler = (item: LampType) => {
        setSecondScreen(item.title);
        setToggleState(item.toggleLamp);
        setIpAddress(item.macAddress);
    };

    // Происходит проверка состояния лампы, в сети она или нет
    if (ip && ip.length > 0) {
        setInterval(() => {
            ip.map((ipLamp) => {
                ipLamp = `${ipLamp}/check_alive`;
                dispatch(Operation.getLamp(ipLamp));
            });
        }, 5000);
    };

    const deleteItemHanlder = (id: string) => {
        dataObjects.map((item: any, index: number) => {
            if (parseInt(item.id) === parseInt(id)) {
                data.splice(index, 1);
                setDataObjects(data);
                dispatch(ActionCreator.removeLamp(dataObjects));
                // Необходимо обновление экрана при удалении лампы
                // Для этого отправляю запрос хоть куда (на ip роутера)
                dispatch(Operation.reloadPage(LINK));
            } else {
                Alert.alert(`Возникла ошибка при удалении лампы, пожалуйста, перезагрузите приложение`);
            }
        });
    };

    const onSwipeLeft = (id: string) => {
        return Alert.alert(
            "Удаление элемента",
            "Вы точно хотите удалить элемент?",
            [
                { 
                    text: "Да", 
                    onPress: () => deleteItemHanlder(id) 
                },
                {
                    text: "Отмена",
                    onPress: () => {},
                    style: "cancel"
                }
            ],
            { cancelable: false }
        )
    };

    let component: any;

    if (dataObjects && dataObjects.length > 0) {
        component = (
            <ScrollView style={styles.scrollView}>
                <View style={styles.wrapperList}>                
                    <FlatList
                        style={styles.flatList}
                        data={dataObjects}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            let TOGGLELAMPLINK = `${item.macAddress}/toggle_lamp`;

                            return (
                            <GestureRecognizer 
                                onSwipeLeft={() => onSwipeLeft(item.id)}
                                config={config}
                                style={{
                                    flex: 1,
                                    width: `100%`
                                }}
                            >
                                <View style={styles.elementWrapper}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            dispatch(ActionCreator.setSpinner(spinner));
                                            pressHandler(item);
                                            getLampScreen(item);
                                        }} 
                                        style={styles.wrapperElementName}
                                    >
                                        { online ? 
                                            <Text style={styles.isOnline}>В сети</Text> : 
                                            <Text style={styles.notOnline}>Не в сети</Text>
                                        }
    
                                        <Text style={styles.elementName}>{ item.title }</Text>
                                    </TouchableOpacity>
    
                                    <View style={styles.wrapperButton}>
                                        <ToggleSwitch
                                            isOn={ toggle === null ? item.toggleLamp : toggle }
                                            onColor="green"
                                            offColor="#39383d"
                                            label=""
                                            labelStyle={{ color: "black", fontWeight: "900" }}
                                            size="large"
                                            onToggle={(isOn: boolean) => {
                                                dispatch(Operation.toggleLamp(TOGGLELAMPLINK, isOn))
                                                setToggle(isOn);
                                            }}
                                            />
                                    </View>                    
                                </View>
                            </GestureRecognizer>
                        )}}
                    />
    
                    <AddLamp />
                </View>
            </ScrollView>                     
        );
    } else {
        component = null;
    }

    spinner ? component = <Spinner /> :
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
    }
});