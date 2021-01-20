import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { HelloScreen } from './hello-screen';
import { MenuScreen } from './menu-screen';
import { ActionCreator, Operation } from '../reducer';
import { ErrorComponent } from '../components/control-components/error-component';
import { Spinner } from '../components/control-components/spinner';
import { StateType } from '../types';
import client from '../MQTTConnection';

type mapStatePropsType = {
  isLoading: boolean,
  errorMessage: null | string,
  isAuth: boolean
};

type MainPageScreenProps = mapStatePropsType;

export const MainPageScreen: React.FC<MainPageScreenProps> = ({isLoading, errorMessage, isAuth}) => {
  let component;

  const dispatch = useDispatch();

  // Запись пользователя в хранилище, открытие соединения с mqtt сервером и получение ламп из БД
  useEffect(() => {
    async function checkAuth() {
      try {
        // dispatch(ActionCreator.setLoading());

        const user = await AsyncStorage.getItem('user');
        await client.connect();

        if (user) {
          dispatch(ActionCreator.setAuth(user));
          dispatch(Operation.getAllLamps(user));

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
  isLoading ? component = <Spinner /> : 
  isAuth ? component = (
    <MenuScreen />
  ) :
  component = <HelloScreen isLoading={isLoading} />

  return component;
};

const mapStateToProps = (state: StateType) => ({
  isLoading: state.isLoading,
  errorMessage: state.errorMessage,
  lampScreenObject: state.lampScreenObject,
  isAuth: state.isAuth
});

export default connect<mapStatePropsType, {}, {}, StateType>(mapStateToProps)(MainPageScreen);