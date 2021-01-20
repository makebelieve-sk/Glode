import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { CommonLampComponent } from '../components/helpers/common-lamp-component';
import { ColoredLampComponent } from '../components/helpers/colored-lamp-component';
import { DinamicFildsLampType, LampType, StateType } from '../types';

type LampScreenType = {
    lampScreenObject: DinamicFildsLampType
};

export const LampScreen: React.FC<LampScreenType> = ({ lampScreenObject }) => {
    const lamps = useSelector((state: StateType) => state.lamps);    
    let resultArray = [];

    let lamp = lamps.find((lamp: LampType) => {
        return lamp.lampId === lampScreenObject.id;
    })

    if (lamp) {
        if (lampType.has(lamp.lampType)) {
            resultArray.push(lampType.get(lamp.lampType)(lampScreenObject));
        };
    }

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

const commonLamp = (lampScreenObject: DinamicFildsLampType) => {
    return <CommonLampComponent lampScreenObject={lampScreenObject} key={`mono-${lampScreenObject.id}`}/>;
};

const coloredLamp = (lampScreenObject: DinamicFildsLampType) => {
    return <ColoredLampComponent lampScreenObject={lampScreenObject} key={`color-${lampScreenObject.id}`}/>
};

const lampType = new Map<string, DinamicFildsLampType | any>([[`mono`, commonLamp], [`color`, coloredLamp]]);

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