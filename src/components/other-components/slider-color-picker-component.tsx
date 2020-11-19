import React, { useState } from 'react';//@ts-ignore
import { SliderSaturationPicker } from 'react-native-slider-color-picker';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import tinycolor from 'tinycolor2';
import { useDispatch } from 'react-redux';

import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Operation } from '../../reducer';
import { HsvColor } from 'react-native-color-picker/dist/typeHelpers';
import { LampType } from '../../types';

type SliderColorPickerComponentType = {
    lampScreenObject: LampType
};
 
export const SliderColorPickerComponent: React.FC<SliderColorPickerComponentType> = ({ lampScreenObject }) => {
    const [ oldColor, setOldColor ] = useState("#FF7700");
    const dispatch = useDispatch();

    let newRef;
    let LINK = `${lampScreenObject.macAddress}/get_warmth`;

    const saveNewRef = (ref: any) => newRef = ref;
 
    const changeColor = (colorHsvOrRgb: HsvColor, resType: string) => {
        if (resType === 'end') {
            setOldColor(tinycolor(colorHsvOrRgb).toHexString());
            dispatch(Operation.sendData(LINK, {
                currentValue: oldColor
            }));
            console.log(oldColor)
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