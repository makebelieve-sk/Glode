import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar, Platform, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { OpenUrlButton } from '../components/other-components/open-url-button';
import { Spinner } from '../components/control-components/spinner';
import { ActionCreator, Operation } from '../reducer';
import { StateType } from '../types';

type HelloScreenType = {
    isLoading: boolean
};

export const HelloScreen: React.FC<HelloScreenType> = ({ isLoading }) => {
    let component;
    const dispatch = useDispatch();

    const [ login, setLogin ] = useState<string>('');
    const [ pass, setPass ] = useState<string>('');
    const [ textInvalid, setTextInvalid ] = useState<string | null>(null);

    const refLogin = useRef<any>();

    const { authInvalidMessage } = useSelector((state: StateType) => ({
        authInvalidMessage: state.authInvalidMessage
    }));

    // Создание элемента валидации
    let errorMessage: JSX.Element | null = (
        <View style={styles.invalidBlock}>
            <Text style={styles.textInvalid}>{ authInvalidMessage ? authInvalidMessage : textInvalid }</Text>
        </View>
    );

    textInvalid || authInvalidMessage ? component : component = null;

    // Установка фокуса на инпут логина
    useEffect(() => {
        refLogin.current.focus();
    }, []);

    // Отправка логина и пароля пользователя на сервер
    const authHandler = (auth: string) => {
        if (login === '' && pass === '') {
            setTextInvalid(` Введите логин и пароль`);
            return null;
        } else if (login === '') {
            setTextInvalid(`Введите логин`);
            return null;
        } else if (pass === '') {
            setTextInvalid(`Введите пароль`);
            return null;
        } else {
            // dispatch(ActionCreator.setLoading());
            dispatch(Operation.authorization(auth, { login, pass }));
        }
    };

    isLoading ? component = <Spinner /> :
    component = (          
        <View style={styles.screenHelloWrapper}>
                <Image style={styles.image} source={require("../../assets/name-header.png")} />

                <View style={styles.screenHelloSubHeader}>
                    <Text style={styles.subHeader}>СТИЛЬНЫЕ ИНТЕРЬЕРНЫЕ РЕШЕНИЯ</Text>               
                </View>

                <View style={styles.screenHelloBody}>
                    <View style={styles.inputsField}>
                        <TextInput 
                            style={styles.inputs}
                            onChangeText={text => setLogin(text)}
                            value={login}
                            placeholder="Введите логин"
                            ref={refLogin}
                        />
                        <TextInput 
                            style={styles.inputs}
                            onChangeText={text => setPass(text)}
                            value={pass}
                            placeholder="Введите пароль"
                        />
                    </View>

                    <View style={styles.buttonsField}>
                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            onPress={() => authHandler('login')}
                        >
                            <Text style={styles.buttonsText}>
                                Войти
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonWrapper}
                            onPress={() => authHandler('reg')}
                        >
                            <Text style={styles.buttonsText}>
                                Регистрация
                            </Text>
                        </TouchableOpacity>
                    </View>

                    { errorMessage }
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