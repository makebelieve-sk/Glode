import React from 'react';
import { StyleSheet, View, StatusBar, Platform, Text, ImageBackground, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
 {/* <AntDesign.Button name="pluscircleo">Текст</AntDesign.Button> */}

import { AddLamp } from '../components/other-components/add-lamp';
import { OpenUrlButton } from '../components/other-components/open-url-button';
import { Spinner } from '../components/control-components/spinner';

type HelloScreenType = {
    spinner: JSX.Element | null
};

export const HelloScreen: React.FC<HelloScreenType> = ({ spinner }) => {
    let component;

    spinner ? component = <Spinner /> :
    component = (          
        <View style={styles.screenHelloWrapper}>
                {/* <View style={styles.screenHelloHeader}> */}
                    <Image style={styles.image} source={require("../../assets/name-header.png")} />
                {/* </View> */}

                <View style={styles.screenHelloSubHeader}>
                    <Text style={styles.subHeader}>СТИЛЬНЫЕ ИНТЕРЬЕРНЫЕ РЕШЕНИЯ</Text>               
                </View>

                <View style={styles.screenHelloBody}>
                    <ImageBackground source={require('../../assets/bg-hello-screen.jpg')} style={styles.imageBackground}>
                        <View style={styles.wrapperButton}>
                            <AddLamp />
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.screenHelloFooter}>
                    <View style={styles.wrapperUrlButton}>
                        <OpenUrlButton>ПЕРЕЙТИ НА САЙТ ПРОИЗВОДИТЕЛЯ</OpenUrlButton>
                    </View>
                </View>            
        </View>
    );

    return component;
};

const styles = StyleSheet.create({
    screenHelloWrapper: {
      flex: 1,
      backgroundColor: '#6bc4fe',
      paddingTop: Platform.OS === `android` ? StatusBar.currentHeight : 0,
      alignItems: `center`,
      width: `100%`
    },
    image: {
        height: `15%`,
        width: `100%`,
        resizeMode: "contain",
        justifyContent: "center"
    },
    screenHelloHeader: {
        width: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        backgroundColor: `#4da8e7`,
        marginTop: `5%`,
    },
    header: {        
        fontFamily: 'skia',
        fontSize: 80,
        color: `#fff`,
    },
    screenHelloSubHeader: {
        width: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    subHeader: {
        fontSize: 18,
        fontFamily: 'merri-weather-bold',
        color: `#fff`,
        paddingVertical: 5
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    wrapperButton: {
        position: "absolute",
        bottom: 0, left: 0,
        width: `60%`,
        height: `10%`,
        backgroundColor: `#fff`,
        justifyContent: `center`,
        alignItems: `center`
    },
    screenHelloBody: {
        height: `65%`,
        width: `100%`,
    },
    screenHelloText: {
        fontSize: 28
    },
    screenHelloFooter: {
        justifyContent: `center`,
        width: `100%`,
        flex: 1,
    },
    wrapperUrlButton: {
        width: `100%`,
        backgroundColor: `#4da8e7`,
        justifyContent: `center`,
        alignItems: `center`,
    }
});