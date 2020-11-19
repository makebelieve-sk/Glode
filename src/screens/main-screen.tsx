import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AsyncStorage } from 'react-native';

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
  setIP: (ip: any) => any,
  clearIP: () => any
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
  setIP,
  clearIP
}) => {
  let component;

  useEffect(() => {
    let allLamps: any = [];
    let arrMac: any = [];
    AsyncStorage.removeItem(`lamp`)

    async function fetchData() {
      const retrieveData = async () => {
        try {
          AsyncStorage.getAllKeys((err, keys: any) => {
            AsyncStorage.multiGet(keys, (err, stores: any) => {
              stores.map((result: any, i: any, store: any) => {
                // Для каждой лампы, которая есть в LocalStorage
                let value = store[i][1];
                value = JSON.parse(value);
                let ip = value.macAddress;//здесь находим ip адрес по известному мак-адресу
                arrMac.push(ip);
                allLamps.push(value);
              }); 

              // добавляем в массив всех ip-адресов ip-адрес лампы из LocalStorage
              setIP(arrMac);
              // добавляем в массив всех ламп лампу из LocalStorage
              loadLampsAC(allLamps);
            });
          });
        } catch (error) {
          console.log(`AsyncStorage is empty`);
        };
      };

      retrieveData();
      // Зачем то очищаю весь массив ip-адресов???????????????????????
      clearIP();
    };
    
    fetchData();
  }, []);

  errorMessage ? component = <ErrorComponent errorMessage={errorMessage} /> :
  isLoadingLamps ? component = <Spinner /> : 
  lamps && lamps.length > 0 ? component = (
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
  setIP: (ip: any) => dispatch(ActionCreator.setAllIP(ip)),
  clearIP: () => dispatch(ActionCreator.clearIP())
});

export default connect<mapStatePropsType, mapDispatchPropsType, {}, StateType>(mapStateToProps, mapDispatchToProps)(MainPageScreen);