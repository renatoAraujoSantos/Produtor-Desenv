import { Platform } from 'react-native';
import ENV from 'react-native-config';

// Endereço para o servidor de distribuição em execução na máquina local
export const LOCAL_URL = 'http://192.168.15.22:8080';
  //Platform.OS === 'android' ? 'http://10.0.2.2:4242' : 'http://localhost:4242';

export const API_URL = ENV.API_URL ? ENV.API_URL : LOCAL_URL;
