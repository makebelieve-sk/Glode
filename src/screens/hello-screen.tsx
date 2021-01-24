import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform, Text, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { Container, Button, Content, Form, Item, Input, Icon } from 'native-base';
import { Row, Grid } from "react-native-easy-grid";

import { OpenUrlButton } from '../components/other-components/open-url-button';
import { Spinner } from '../components/control-components/spinner';
import { ActionCreator } from '../reducer';
import { useHttp } from '../hooks/useHttp.hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const HelloScreen: React.FC = () => {
    let component;
    
    const { request, loading } = useHttp();
    const dispatch = useDispatch();

    const [ login, setLogin ] = useState<string>('');
    const [ pass, setPass ] = useState<string>('');

    const [ success, setSuccess ] = useState<boolean>(false);
    const [ errorLogin, setErrorLogin ] = useState<boolean>(false);
    const [ errorPassword, setErrorPassword ] = useState<boolean>(false);

    // Отправка логина и пароля пользователя на сервер
    const authHandler = async (auth: string) => {
        setErrorLogin(false);
        setErrorPassword(false);

        if (login === '' && pass === '') {
            setErrorLogin(true);
            setErrorPassword(true);
            return null;
        } else if (login === '') {
            setErrorLogin(true);
            return null;
        } else if (pass === '') {
            setErrorPassword(true);
            return null;
        } else {
            setSuccess(true);

            const data = await request('http://5.189.86.177:8080/api/auth/' + auth, 'POST', { login, pass });

            if (data.login) {
                // Функция записи пользователя в хранилище телефона
                const setUser = async (login: string) => {
                    try {
                        await AsyncStorage.setItem('user', login);
                    } catch (error) {
                        let errorText = `Ошибка при сохранении пользователя: ${error}`;
                        dispatch(ActionCreator.getError(errorText));
                    }
                };

                setUser(data.login);
                dispatch(ActionCreator.setAuth(login));
            }
        }
    };

    loading ? component = <Spinner /> :
    component = (
        <Container style={{paddingTop: Platform.OS === `android` ? StatusBar.currentHeight : 0,}}>
            <Grid style={{alignItems: "center", justifyContent: "center"}}>
                <Row size={20} style={{alignItems: "flex-end"}}><Text style={styles.title}>GLODE</Text></Row>
                <Row size={15} style={{justifyContent: "center"}}><Text style={styles.subTitle}>СТИЛЬНЫЕ ИНТЕРЬЕРНЫЕ РЕШЕНИЯ</Text></Row>
                <Row size={55} style={{width: '80%'}}>
                    <Content>
                        <Form>
                            <Item floatingLabel success={success} error={errorLogin} last>
                                <Input
                                    onChangeText={text => setLogin(text)}
                                    value={login}
                                    placeholder="Введите логин"
                                />
                                { errorLogin ? <Icon name='close-circle' /> : null }
                            </Item>
                            <Item floatingLabel last success={success} error={errorPassword}>
                                <Input
                                    onChangeText={text => setPass(text)}
                                    value={pass}
                                    placeholder="Введите пароль" 
                                />
                                { errorPassword ? <Icon name='close-circle' /> : null }
                            </Item>
                        </Form>

                        <Button block primary onPress={() => authHandler('login')} style={{marginTop: '10%', marginBottom: '5%'}}>
                            <Text>Войти</Text>
                        </Button>
                        <Button block light onPress={() => authHandler('reg')}>
                            <Text>Регистрация</Text>
                        </Button>
                    </Content>
                </Row>
                <Row size={10} style={{alignItems: "center"}}>
                    <View style={styles.wrapperUrlButton}>
                        <OpenUrlButton>ПЕРЕЙТИ НА САЙТ ПРОИЗВОДИТЕЛЯ</OpenUrlButton>
                    </View>
                </Row>
            </Grid>
      </Container>
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
        height: `100%`,
        width: `100%`,
        resizeMode: "contain",
        borderWidth: 1
    },
    screenHelloSubHeader: {
        width: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    title: {
        fontSize: 28,
        fontFamily: 'merri-weather-bold',
        color: `black`
    },
    subTitle: {
        fontSize: 16,
        fontFamily: 'merri-weather-bold',
        color: `black`
    },
    screenHelloBody: {
        height: `65%`,
        width: `100%`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputsField: {
        width: '90%',
        alignItems: 'center',
    },
    inputs: {
        height: 40, 
        borderBottomColor: 'gray', 
        borderBottomWidth: 1, 
        width: '80%'
    },
    buttonsField: {
        marginTop: '10%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        alignItems: 'center',
    },
    buttonWrapper: {
        width: '40%', 
        alignItems: "center", 
        backgroundColor: "#DDDDDD", 
        padding: 8
    },
    buttonsText: {
        fontSize: 18,
    },
    invalidBlock: {
        // borderColor: `red`,
        // borderWidth: 1,
        alignItems: `center`
    },
    textInvalid: {
        color: `red`,
        fontSize: 16
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