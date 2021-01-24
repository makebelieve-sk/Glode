import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import { ActionCreator } from '../../reducer';
import { OpenUrlButton } from '../other-components/open-url-button';

export const Footer: React.FC = () => {
    const dispatch = useDispatch();

    const handlePress = async () => {
        try {
            dispatch(ActionCreator.logOut());

            await AsyncStorage.removeItem('user');
        } catch(e) {
            let errorText = 'Возникла ошибка при выходе из системы, пожалуйста, перезагрузите приложение.';
            dispatch(ActionCreator.getError(errorText));
        }

    };

    return (
        <View style={styles.footer}>
            <View style={styles.wrapperFooterText}>
                <OpenUrlButton>Перейти на сайт производителя</OpenUrlButton>
                <TouchableOpacity onPress={handlePress}>
                    <Text style={styles.logOut}>Выйти</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    footer: {
        height: `10%`,
        position: `absolute`, bottom: 0,
        width: `100%`,
        backgroundColor: `#6bc4fe`,
        justifyContent: `center`,
        alignItems: `center`
    },
    wrapperFooterText: {
        backgroundColor: `#4da8e7`,
        width: `100%`,
        justifyContent: `center`,
        alignItems: `center`
    },
    logOut: {
        color: `#fff`,
        fontFamily: `merri-weather-bold`,
        fontSize: 16,
        paddingVertical: 10
    }
});