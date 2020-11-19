import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';

import { Header } from '../components/ui-components/header';
import { BodyComponent } from '../components/ui-components/body-component';
import { Footer } from '../components/ui-components/footer';
import { LampType } from '../types';

type MenuScreenType = {
    // stateLamp: boolean,
    lamps: LampType[],
    lampScreenObject: any,
    ip: string[],
    online: boolean,
    spinner: JSX.Element | null,
    getLampScreen: (item: LampType) => any,
    clearLampScreen: () => any
};

export const MenuScreen: React.FC<MenuScreenType> = ({
    lamps, 
    lampScreenObject, 
    ip, 
    online, 
    spinner, 
    getLampScreen, 
    clearLampScreen
}) => {
    const [ secondScreen, setSecondScreen ] = useState<string | null>(null);
    const [ toggleState, setToggleState ] = useState<boolean | null>(null);
    const [ ipAddress, setIpAddress ] = useState<string | null>(null);

    const [ toggle, setToggle ] = useState<null | boolean>(null);

    return (
        <SafeAreaView style={styles.container}>
                <Header 
                    toggle={toggle}
                    setToggle={setToggle}
                    secondScreen={secondScreen} 
                    toggleState={toggleState}
                    ipAddress={ipAddress}
                    setSecondScreen={setSecondScreen}
                    setToggleState={setToggleState}
                    setIpAddress={setIpAddress}
                    clearLampScreen={clearLampScreen}
                />
        
                <View style={styles.body}>
                    <BodyComponent
                        toggle={toggle}
                        setToggle={setToggle}
                        data={lamps}
                        setSecondScreen={setSecondScreen}
                        setToggleState={setToggleState}
                        setIpAddress={setIpAddress}
                        getLampScreen={getLampScreen}
                        lampScreenObject={lampScreenObject}
                        ip={ip}
                        online={online}
                        spinner={spinner}
                    />
                </View>
        
                <Footer />            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#6bc4fe',
      paddingTop: Platform.OS === `android` ? StatusBar.currentHeight : 0,
    },
    wrapperMenuScreen: {

    },
    body: {
      height: `60%`,
      backgroundColor: `#6bc4fe`
    },
    footer: {
        marginBottom: 20
    }
});