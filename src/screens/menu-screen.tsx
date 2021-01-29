import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Col, Container, Grid } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';

import { Header } from '../components/ui-components/header';
import { BodyComponent } from '../components/ui-components/body-component';
import { Footer } from '../components/ui-components/footer';
import { useHttp } from '../hooks/useHttp.hook';
import { StateType } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActionCreator } from '../reducer';

export const MenuScreen: React.FC = () => {
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };

    const { lamps, lampScreenObject, dinLamps } = useSelector((state: StateType) => ({
        lamps: state.lamps,
        dinLamps: state.dinLamps,
        lampScreenObject: state.lampScreenObject
    }));
    const dispatch = useDispatch();
    const { request } = useHttp();

    const [ user, setUser ] = useState<null | string>(null);

    useEffect(() => {
        const GetUser = async () => {
            const user = await AsyncStorage.getItem('user');

            if (user) {
                setUser(user);

                const data = await request('http://5.189.86.177:8080/api/lamp/getall', 'POST', {login: user});

                if (data) {
                    dispatch(ActionCreator.getAllLamps(data));
                }
            }
        }

        GetUser();
    }, []);

    // Функция обработки свайпа на лево
    const onSwipeDown = async () => {
        const data = await request('http://5.189.86.177:8080/api/lamp/getall', 'POST', {login: user});
        alert('Обновление')
        if (data) {
            dispatch(ActionCreator.getAllLamps(data));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Container>
                {/* <Grid>
                    <Col style={{ backgroundColor: '#635DB7', height: 200 }}></Col>
                    <Col style={{ backgroundColor: '#00CE9F', height: 200 }}></Col>
                </Grid> */}
                <Header />
        
                <View style={styles.body}>
                    <GestureRecognizer 
                        onSwipeDown={onSwipeDown}
                        config={config}
                        style={{flex: 1, width: `100%`}}
                    >
                        <BodyComponent />
                    </GestureRecognizer> 
                </View>
        
                <Footer />
            </Container>          
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