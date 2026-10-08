import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getDefaultApiUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Auto-detect host IP when running on physical device or simulator via Expo
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const hostIp = hostUri.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:8080/api`;
    }
  }

  // Android emulator loopback to host machine
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }

  // Web browser
  if (Platform.OS === 'web') {
    return 'http://localhost:8080/api';
  }

  // Default to detected PC Wi-Fi / Hotspot LAN IP
  return 'http://172.20.10.2:8080/api';
};

export const Config = {
  appName: 'Bharat Sponge',
  tagline: 'Industrial & Hardware Wholesale (Indore, MP)',
  defaultApiUrl: getDefaultApiUrl(),
  ownerName: 'Arbaz khan',
  ownerPhone: '7869385515',
  supportPhone: '+91 7869385515',
  whatsappNumber: '917869385515',
  supportEmail: 'bharatsponge@gmail.com',
  locationCity: 'Indore',
  locationState: 'Madhya Pradesh',
  locationStateCode: 'MP',
  locationHub: 'Sanwer Road Industrial Area, Indore, MP',
  outsideIndoreDeliveryCharge: 250,
  localIndoreDeliveryCharge: 0,
  storageKeys: {
    authToken: '@bharat_sponge_auth_token',
    authUser: '@bharat_sponge_auth_user',
    cart: '@bharat_sponge_cart_v1',
    customApiUrl: '@bharat_sponge_custom_api_url',
  },
};

