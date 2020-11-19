import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';

type ErrorComponentType = {
    errorMessage: string
};

export const ErrorComponent: React.FC<ErrorComponentType> = ({ errorMessage }) => {    
    return (
        <View style={styles.errorComponent}>
            <View style={styles.wrapperError}>
                <ImageBackground source={require('../../../assets/death-star.png')} style={styles.imageBackground} />
                <Text style={styles.errorText}>{ errorMessage }</Text>
            </View>            
        </View>
    );
};

const styles = StyleSheet.create({
    errorComponent: {
        flex: 1,
        alignItems: `center`,
        justifyContent: `center`,
        backgroundColor: `#6bc4fe`
    },
    wrapperError: {
        height: `60%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    errorText: {
        fontFamily: `merri-weather-bold`,
        fontSize: 18,
        color: `#fff`
    }
})