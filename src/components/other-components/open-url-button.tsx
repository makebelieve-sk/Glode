import React, { ReactNode, useCallback } from 'react';
import { StyleSheet, Linking, Alert, TouchableOpacity, Text } from 'react-native';

const URL = 'https://www.google.ru/';

type OpenUrlButtonType = {
    children: JSX.Element | ReactNode
};

export const OpenUrlButton: React.FC<OpenUrlButtonType> = ({ children }) => {
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(URL);

        if (supported) {
            await Linking.openURL(URL);
        } else {
            Alert.alert(`Произошла ошибка при открытии страницы ${URL}`);
        }
    }, [URL]);

    return (
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.buttonTitle}>{ children }</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonTitle: {
        color: `#fff`,
        fontFamily: `merri-weather-bold`,
        fontSize: 16,
        paddingVertical: 10
    }
})