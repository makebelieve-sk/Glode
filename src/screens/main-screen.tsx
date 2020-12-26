import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloScreen } from './hello-screen';
import { MenuScreen } from './menu-screen';
import { ActionCreator } from '../reducer';
import { ErrorComponent } from '../components/control-components/error-component';
import { Spinner } from '../components/control-components/spinner';
import { StateType, LampType } from '../types';

type mapStatePropsType = {
  lamps: LampType[],
  isLoadingLamps: boolean,
  errorMessage: null | string,
  lampScreenObject: any,
  ip: string[],
  online: boolean,
  spinner: JSX.Element | null
};

type mapDispatchPropsType = {
  getLampScreen: (item: LampType) => any,
  clearLampScreen: () => any,
  loadLampsAC: (data: any[]) => any,
  setIP: (ip: any) => any
};

type MainPageScreenProps = mapStatePropsType & mapDispatchPropsType;

export const MainPageScreen: React.FC<MainPageScreenProps> = ({
  lamps, 
  isLoadingLamps, 
  spinner, 
  errorMessage, 
  lampScreenObject, 
  ip, 
  online, 
  getLampScreen, 
  clearLampScreen, 
  loadLampsAC,
  setIP
}) => {
  let component;

  // Проверяем наличие объектов ламп в хранилище телефона
  // Если лампы есть, то пушим существующие лампы в массив ламп, и показываем экран с лампами (MenuScreen)
  // Если ламп нет, то ничего не возвращаем
  useEffect(() => {
    let allLamps: any = [];
    let arrIp: any = [];

    async function fetchData() {
      const retrieveData = async () => {
        try {
          AsyncStorage.getAllKeys((err, keys: any) => {
            AsyncStorage.multiGet(keys, (err, stores: any) => {
              stores.map((result: any, i: any, store: any) => {
                // Для каждой лампы, которая есть в AsyncStorage
                let value = store[i][1];
                value = JSON.parse(value);

                arrIp.push(value.macAddress);
                allLamps.push(value);
              }); 

              // добавляем в массив всех ip-адресов ip-адрес лампы из LocalStorage
              setIP(arrIp);
              // добавляем в массив всех ламп лампу из LocalStorage
              loadLampsAC(allLamps);
            });
          });
        } catch (error) {
          console.log(`AsyncStorage is empty`);
        };
      };

      retrieveData();
    };
    
    fetchData();
  }, []);

  // Если есть ошибка, показываем компонент с ошибкой
  // Если в данный момент идет загрузка, то показываем компонент спиннера загрузки
  // Если в данный момент массив статических адресов лампы не пустой, то показываем экран ламп (MenuScreen)
  // Если в данный момент массив статических адресов ламп пустой, то показывыаем начальный экран
  errorMessage ? component = <ErrorComponent errorMessage={errorMessage} /> :
  isLoadingLamps ? component = <Spinner /> : 
  ip && ip.length > 0 ? component = (
    <MenuScreen
        lamps={lamps} 
        lampScreenObject={lampScreenObject}
        getLampScreen={getLampScreen}
        clearLampScreen={clearLampScreen}
        ip={ip}
        online={online}
        spinner={spinner}
      />
  ) :
  component = <HelloScreen spinner={spinner} />

  return component;
};

const mapStateToProps = (state: StateType) => ({
  lamps: state.lamps,
  isLoadingLamps: state.isLoadingLamps,
  spinner: state.spinner,
  errorMessage: state.errorMessage,
  lampScreenObject: state.lampScreenObject,
  ip: state.ip,
  online: state.online
});

const mapDispatchToProps = (dispatch: any) => ({
  getLampScreen: (item: LampType) => dispatch(ActionCreator.getLampScreen(item)),
  clearLampScreen: () => dispatch(ActionCreator.clearLampScreen()),
  loadLampsAC: (data: any[]) => dispatch(ActionCreator.loadLampsAC(data)),
  setIP: (ip: any) => dispatch(ActionCreator.setAllIP(ip))
});

export default connect<mapStatePropsType, mapDispatchPropsType, {}, StateType>(mapStateToProps, mapDispatchToProps)(MainPageScreen);