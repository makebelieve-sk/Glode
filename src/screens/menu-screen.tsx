import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';

import { Header } from '../components/ui-components/header';
import { BodyComponent } from '../components/ui-components/body-component';
import { Footer } from '../components/ui-components/footer';

export const MenuScreen: React.FC = () => {
    const [ toggle, setToggle ] = useState<null | boolean>(null);
    const [ toggleState, setToggleState ] = useState<boolean | null>(null);

    return (
        <SafeAreaView style={styles.container}>
                <Header 
                    toggle={toggle}
                    setToggle={setToggle}
                    toggleState={toggleState}
                    setToggleState={setToggleState}
                />
        
                <View style={styles.body}>
                    <BodyComponent
                        toggle={toggle}
                        setToggle={setToggle}
                        setToggleState={setToggleState}
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