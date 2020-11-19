import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import MainPageScreen from './src/screens/main-screen';
import api from './src/axios';
import { reducer } from './src/reducer';
import { ErrorComponent } from './src/components/control-components/error-component';

const store = createStore(reducer, applyMiddleware(thunk.withExtraArgument(api)));

async function loadApplication() {
  await Font.loadAsync({
    'skia': require('./assets/fonts/Skia.ttf'),
    'merri-weather-bold': require('./assets/fonts/MerriweatherSans-Bold.ttf')
  })
}

export default function App() {
  const [ isReady, setIsReady ] = useState(false);

  if (!isReady) {
    return <AppLoading 
      startAsync={loadApplication}
      onError={(err) => console.log(`Ошибка`, err)}
      onFinish={() => setIsReady(true)}
    />
  }

  return (
    <Provider store={store}>
      <MainPageScreen />
    </Provider>
  );
};