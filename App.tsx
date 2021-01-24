import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Ionicons } from '@expo/vector-icons';

import MainPageScreen from './src/screens/main-screen';
import globalApi from './src/axios';
import { reducer } from './src/reducer';
import { ErrorComponent } from './src/components/control-components/error-component';

const store = createStore(reducer);

// Функция подключения шрифтов в приложение
async function loadApplication() {
  await Font.loadAsync({
    'skia': require('./assets/fonts/Skia.ttf'),
    'merri-weather-bold': require('./assets/fonts/MerriweatherSans-Bold.ttf'),
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    ...Ionicons.font,
  })
}

export default function App() {
  const [ isReady, setIsReady ] = useState(false);

  if (!isReady) {
    return <AppLoading 
      startAsync={loadApplication}
      onError={(error: Error) => <ErrorComponent errorMessage={`Произошла ошибка при загрузке шрифтов: ${error}`} />}
      onFinish={() => setIsReady(true)}
    />
  }

  return (
    <Provider store={store}>
      <MainPageScreen />
    </Provider>
  );
};