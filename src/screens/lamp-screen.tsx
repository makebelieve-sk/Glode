import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import { CommonLampComponent } from '../components/helpers/common-lamp-component';
import { ColoredLampComponent } from '../components/helpers/colored-lamp-component';
import { LampType } from '../types';

type LampScreenType = {
    lampScreenObject: LampType
};

export const LampScreen: React.FC<LampScreenType> = ({ lampScreenObject }) => {    
    let resultArray = [];
    
    if (lampType.has(lampScreenObject.type)) {
        resultArray.push(lampType.get(lampScreenObject.type)(lampScreenObject));
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.wrapperLampScreen}>                
                <View style={styles.mainWrapperBlock}>
                    { resultArray }
                </View>
            </View>
        </ScrollView>
    );
};

const commonLamp = (lampScreenObject: any) => {
    return <CommonLampComponent lampScreenObject={lampScreenObject} key={`commonLamp`} />;
};

const coloredLamp = (lampScreenObject: any) => {
    return <ColoredLampComponent lampScreenObject={lampScreenObject} key={`coloredLamp`} />
};

const lampType = new Map<string | any, LampType | any>([[`common`, commonLamp], [`colored`, coloredLamp]]);

const styles = StyleSheet.create({
    wrapperLampScreen: {
        flex: 1,
        width: `100%`,
        alignItems: `center`,
    },
    scrollView: {
        width: `100%`,
        backgroundColor: `#6bc4fe`,
        marginBottom: `10%`
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    mainWrapperBlock: {
        width: `95%`,
        alignItems: `center`
    }
});