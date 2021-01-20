import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SliderComponent } from '../other-components/slider';
import { SliderColorPickerComponent } from '../other-components/slider-color-picker-component';
import { Dropdown } from '../other-components/dropdown';
import { DinamicFildsLampType } from '../../types';

type CommonLampComponentType = {
    lampScreenObject: DinamicFildsLampType,
};

export const CommonLampComponent: React.FC<CommonLampComponentType> = ({ lampScreenObject }) => {
    const brightness = lampScreenObject.brightness;
    const [ sliderValueBrightness, setSliderValueBrightness ] = useState<number | number[]>(parseInt(brightness));

    return (
        <View style={styles.wrapperBlock}>
            <View style={styles.wrapperSlider}>
                <SliderComponent 
                    sliderValue={sliderValueBrightness}
                    setSliderValue={setSliderValueBrightness}
                    speed={false}
                    lampId={lampScreenObject.id}
                />
            </View>

            <View style={styles.wrapperSlider}>
                <SliderColorPickerComponent lampScreenObject={lampScreenObject} />
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
    wrapperSlider: {
        width: `100%`,
        alignItems: `center`,
        marginVertical: 10,
    },
    dropdown: {
        width: `100%`,
        marginVertical: 10
    }
});