import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { SliderComponent } from '../other-components/slider';
import { ColorPickerComponent } from '../other-components/color-picker';
import { Dropdown } from '../other-components/dropdown';
import { LampType } from '../../types';

type ColoredLampComponentType = {
    lampScreenObject: LampType | any
};

export const ColoredLampComponent: React.FC<ColoredLampComponentType> = ({ lampScreenObject }) => {
    const brightness = lampScreenObject.brightness;
    const [ sliderValueBrightness, setSliderValueBrightness ] = useState<number | number[]>(parseInt(brightness.currentValue));

    return (
        <View style={styles.wrapperBlock}>
            <Text style={styles.sliderName}>цвет</Text>
            
            <View style={styles.wrapperColorPicker}>
                <ColorPickerComponent macAddress={lampScreenObject.macAddress} colorPicker={lampScreenObject.colorPicker} />
            </View>
            
            <View style={styles.wrapperSlider}>
                <SliderComponent 
                    slider={brightness}
                    sliderValue={sliderValueBrightness}
                    setSliderValue={setSliderValueBrightness}
                    macAddress={lampScreenObject.macAddress}
                    speed={false}
                />
            </View>

            <View style={styles.dropdown}>
                <Dropdown lampScreenObject={lampScreenObject} />  
            </View>                    
        </View>
    );
};

const styles = StyleSheet.create({
    wrapperBlock: {
        width: `100%`,
        alignItems: `center`
    },
    sliderName: {
        fontFamily: 'merri-weather-bold',
        fontSize: 20,
        color: `#fff`,
        fontWeight: "bold"
    },
    wrapperSlider: {
        width: `100%`,
        alignItems: `center`,
        marginVertical: 10,
    },
    wrapperColorPicker: {
        width: `100%`,
        alignItems: `center`,
        marginVertical: 10
    },
    dropdown: {
        width: `100%`,
        marginVertical: 10
    }
});