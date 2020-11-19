import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { ColorPicker, toHsv, fromHsv } from 'react-native-color-picker';
import { useDispatch } from 'react-redux';

import { Operation } from '../../reducer';

type ColorPickerComponentType = {
    colorPicker: string,
    macAddress: string
};

export const ColorPickerComponent: React.FC<ColorPickerComponentType> = ({ macAddress, colorPicker }) => {
    const dispatch = useDispatch();
    const [ color, setColor ] = useState<string>(colorPicker);

    let LINK = `${macAddress}/get_color`;

    return <ColorPicker
        onColorSelected={color => alert(`Цвет: ${color}`)}
        style={{ width: 300, height: Dimensions.get('window').width > 400 ? 200 : 100 }}
        hideSliders={true}
        color={color}
        onColorChange={(color) => {
            let fromHsvColor = fromHsv(color); 
            setColor(fromHsvColor);                      
            dispatch(Operation.sendData(LINK, {
                currentValue: fromHsvColor
            }));
            console.log('Цвет rgb:', fromHsvColor);
        }}
    />
};