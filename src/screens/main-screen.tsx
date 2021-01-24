import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { HelloScreen } from './hello-screen';
import { MenuScreen } from './menu-screen';
import { ActionCreator } from '../reducer';
import { ErrorComponent } from '../components/control-components/error-component';
import { Spinner } from '../components/control-components/spinner';
import { StateType } from '../types';
import client from '../MQTTConnection';
import { useHttp } from '../hooks/useHttp.hook';

type mapStatePropsType = {
  errorMessage: null | string,
  isAuth: boolean
};

type MainPageScreenProps = mapStatePropsType;

export const MainPageScreen: React.FC<MainPageScreenProps> = ({errorMessage, isAuth}) => {
  let component;

  const { request, loading } = useHttp();

  const dispatch = useDispatch();

  // Запись пользователя в хранилище, открытие соединения с mqtt сервером и получение ламп из БД
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await AsyncStorage.getItem('user');
        await client.connect();

        if (user) {
          dispatch(ActionCreator.setAuth(user));

          const data = await request('http://5.189.86.177:8080/api/lamp/getall', 'POST', {login: user});

          if (data) {
            dispatch(ActionCreator.getAllLamps(data));
          }

          let topic = `lamp/${user}/#`;
          let topicOnline = `online/${user}/#`;
          
          await client.subscribe(topic);
          await client.subscribe(topicOnline);
        }
      }
      catch (error) {
        let errorText = 'Возникла ошибка при получении ламп и открытии соединения с mqtt сервером, пожалуйста, перезагрузите приложение.';
        dispatch(ActionCreator.getError(errorText));
      }
    }

    checkAuth();  
  }, []);
  
  errorMessage ? component = <ErrorComponent errorMessage={errorMessage} /> :
  loading ? component = <Spinner /> : 
  isAuth ? component = (
    <MenuScreen />
  ) :
  component = <HelloScreen />

  return component;
};

const mapStateToProps = (state: StateType) => ({
  errorMessage: state.errorMessage,
  lampScreenObject: state.lampScreenObject,
  isAuth: state.isAuth
});

export default connect<mapStatePropsType, {}, {}, StateType>(mapStateToProps)(MainPageScreen);