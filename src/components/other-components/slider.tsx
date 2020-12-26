import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { Slider } from "@miblanchard/react-native-slider";

import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Operation } from '../../reducer';

type SliderComponentType = {
    slider: any, 
    sliderValue: number | number[], 
    setSliderValue: React.Dispatch<React.SetStateAction<number | number[]>>, 
    speed: boolean,
    macAddress: string
};

export const SliderComponent: React.FC<SliderComponentType> = ({ slider, macAddress, sliderValue, setSliderValue, speed }) => {
    let LINK = `set_brightness`;
    speed ? LINK = `set_speed` : null;

    const dispatch = useDispatch();

    return (
        <View style={styles.mainWrapper}>
            <Text style={styles.sliderName}>{ speed ? "скорость" : "яркость" }</Text>
            
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
                        step={1}
                        maximumValue={10}
                        minimumTrackTintColor="#fff"
                        thumbStyle={styles.thumb}
                        trackStyle={styles.track}
                        value={sliderValue}
                        onValueChange={sliderValue => {
                            setSliderValue(sliderValue);
                            dispatch(Operation.sendData(LINK, {
                                currentValue: sliderValue[0]
                            }));
                            console.log('Обычный', sliderValue[0])
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