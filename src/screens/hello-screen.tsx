import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform, Text } from 'react-native';
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

            try {
                const data = await request('http://5.189.86.177:8080/api/auth/' + auth, 'POST', { login, pass });
                
                if (data.login) {
                    // Функция записи пользователя в хранилища телефона и redux`а
                    const setUser = async (login: string) => {
                        try {
                            await AsyncStorage.setItem('user', login);
                            dispatch(ActionCreator.setAuth(login));
                        } catch (error) {
                            let errorText = `Ошибка при сохранении пользователя: ${error}`;
                            dispatch(ActionCreator.getError(errorText));
                        }
                    };
    
                    setUser(data.login);
                    dispatch(ActionCreator.setAuth(login));
                }
            } catch(e) {
                let errorText = 'Возникла ошибка при установке связи с сервером авторизации, пожалуйста, перезагрузите приложение.';
                dispatch(ActionCreator.getError(errorText));
            }
            
        }
    };

    loading ? component = <Spinner /> :
    component = (
        <Container style={styles.container}>
            <Grid style={styles.wrapperGrid}>
                <Row size={20} style={styles.rowTitle}><Text style={styles.title}>GLODE</Text></Row>
                <Row size={15} style={styles.rowSubTitle}><Text style={styles.subTitle}>СТИЛЬНЫЕ ИНТЕРЬЕРНЫЕ РЕШЕНИЯ</Text></Row>
                <Row size={55} style={styles.rowContent}>
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

                        <Button block primary onPress={() => authHandler('login')} style={styles.buttonLogin}>
                            <Text>Войти</Text>
                        </Button>
                        <Button block light onPress={() => authHandler('reg')}>
                            <Text>Регистрация</Text>
                        </Button>
                    </Content>
                </Row>
                <Row size={10} style={styles.rowFooter}>
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
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    wrapperGrid: {
        alignItems: "center", 
        justifyContent: "center"
    },
    rowTitle: {
        alignItems: "flex-end"
    },
    rowSubTitle: {
        justifyContent: "center"
    },
    rowContent: {
        width: '80%'
    },
    rowFooter: {
        alignItems: "center"
    },
    title: {
        fontSize: 28,
        fontFamily: 'merri-weather-bold',
        color: 'black'
    },
    subTitle: {
        fontSize: 16,
        fontFamily: 'merri-weather-bold',
        color: 'black'
    },
    buttonLogin: {
        marginTop: '10%', 
        marginBottom: '5%'
    },
    wrapperUrlButton: {
        width: `100%`,
        backgroundColor: '#4da8e7',
        justifyContent: 'center',
        alignItems: 'center',
    }
});