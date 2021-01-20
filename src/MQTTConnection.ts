//@ts-ignore
import { Client } from 'react-native-paho-mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const client = new Client({ uri: 'ws://5.189.86.177:8000/ws', clientId: 'clientId', storage: AsyncStorage });

client.on('connectionLost', (responseObject: any) => {
    if (responseObject.errorCode !== 0) {
        console.log('Ответ при потере соединения: ', responseObject.errorMessage);
    }
});

export default client;