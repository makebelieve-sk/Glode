import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const Spinner = () => {
    return (
        <View style={styles.wrapperSpinner}>
            <Image 
                style={{width: 300, height: 200, backgroundColor: `#6bc4fe`}} 
                source={require("../../../assets/spinner.gif")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapperSpinner: {
        flex: 1,
        alignItems: `center`,
        justifyContent: `center`
    }
})