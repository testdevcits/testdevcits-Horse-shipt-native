



import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../app/store';
import { logoutUser } from '../redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { BASE_URL } from '../config/constants';

const axiosClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 1. Request Interceptor
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check network connectivity before making request
    const netState = await NetInfo.fetch();
    if (netState.isConnected === false || netState.isInternetReachable === false) {
      Toast.show({
        type: 'error',
        text1: 'No Internet Connection',
        text2: 'Please check your network connection and try again.',
      });
      return Promise.reject({
        message: 'No internet connection. Please check your network.',
        isOffline: true,
      });
    }

    // Auth Token Logic
    const state = store.getState();
    const token = state.auth.token || (await AsyncStorage.getItem('@user_token'));

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // --- LOGGING REQUEST ---
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(' ');
    console.log('🚀 ╔═══════════ AXIOS REQUEST ═══════════╗');
    console.log(`   ║ 🔗 URL:    ${fullUrl}`);
    console.log(`   ║ 📡 METHOD: ${config.method?.toUpperCase()}`);

    if (config.data) {
      if (
        config.data instanceof FormData ||
        (config.data && typeof config.data === 'object' && (config.data as any)._parts)
      ) {
        console.log('   ║ 📦 PAYLOAD: [FormData Body]');
        console.log('   ║ ✨ PARTS:', (config.data as any)._parts);
      } else {
        try {
          console.log('   ║ 📦 PAYLOAD:', JSON.stringify(config.data, null, 2));
        } catch (e) {
          console.log('   ║ 📦 PAYLOAD: [FormData / Unserializable Body]');
        }
      }
    } else {
      console.log('   ║ 📦 PAYLOAD: No Body');
    }
    console.log('   ╚══════════════════════════════════════╝');

    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // --- LOGGING SUCCESS ---
    console.log(' ');
    console.log(`✅ ╔═══════════ AXIOS RESPONSE [${response.status}] ═══════════╗`);
    console.log(`   ║ 🔗 URL:  ${response.config.url}`);
    console.log('   ║ 📄 DATA:', JSON.stringify(response.data, null, 2));
    console.log('   ╚════════════════════════════════════════════╝');

    return response.data;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const errorBody: any = error.response?.data;

    // --- LOGGING ERROR ---
    console.log(' ');
    console.log(`❌ ╔═══════════ AXIOS ERROR [${status || 'NETWORK'}] ═══════════╗`);
    console.log(`   ║ 🔗 URL:     ${url}`);
    console.log(`   ║ 📝 MESSAGE: ${error.message}`);
    console.log('   ║ 📄 BODY:   ', JSON.stringify(errorBody, null, 2));
    const errorMessage: string = String(
      errorBody?.errors?.[0] ||
      errorBody?.message ||
      errorBody?.error ||
      error.message ||
      'An error occurred',
    );

    Toast.show({
      type: 'error',
      text1: "Error",
      text2: errorMessage,
    });
    console.log('   ╚══════════════════════════════════════════════╝');

    // Handle 401 Unauthorized (Session Expired vs Invalid Credentials)
    if (status === 401) {
      const state = store.getState();
      if (state.auth.token) {
        console.warn('⚠️ Session Expired: Dispatching global logout...');
        store.dispatch(logoutUser());
        return Promise.reject({ message: 'Session expired. Please login again.', status: 401 });
      }
    }

    // Parse and reject with a clean error object
    return Promise.reject(parseApiError(error));
  }
);

/**
 * Utility: Parse API Errors into user-friendly messages
 */
const parseApiError = (error: AxiosError<any>) => {
  const data = error.response?.data;

  // Custom logic to find error message in different backend formats
  const message =
    data?.errors?.[0] ||
    data?.message ||
    data?.error ||
    data?.msg ||
    error.message ||
    'Something went wrong. Please try again.';

  return {
    status: error.response?.status || 500,
    message: message,
    raw: data,
  };
};

export default axiosClient;