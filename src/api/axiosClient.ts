

// import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // 1. Configuration
// const BASE_URL = 'https://horse-shipt.vercel.app'; // Update to your real URL

// const axiosClient: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// });

// // 2. Request Interceptor: Auth & Logging
// axiosClient.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     // Attach Token
//     const token = await AsyncStorage.getItem('userToken');
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // --- DEBUG LOGGING ---
//     const fullUrl = `${config.baseURL}${config.url}`;
//     console.log('╔════════ AXIOS REQUEST ════════╗');
//     console.log(`║ 🚀 METHOD: ${config.method?.toUpperCase()}`);
//     console.log(`║ 🔗 URL:    ${fullUrl}`);

//     if (config.data) {
//       if (config.data instanceof FormData) {
//         // Special log for Images/Files (FormData)
//         console.log('║ 📦 PAYLOAD: [FormData Body]');
//         // In React Native, we can inspect FormData parts like this:
//         console.log('║ ✨ PARTS:', (config.data as any)._parts);
//       } else {
//         // Standard JSON log
//         console.log(`║ 📦 PAYLOAD: ${JSON.stringify(config.data, null, 2)}`);
//       }
//     } else {
//       console.log('║ 📦 PAYLOAD: No Body');
//     }
//     console.log('╚═══════════════════════════════╝');

//     return config;
//   },
//   (error) => {
//     console.error('❌ Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // 3. Response Interceptor: Global Success & Error Handling
// axiosClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     // Log success
//     console.log(`✅ [${response.status}] Response from: ${response.config.url}`);

//     // Return only the data portion to your services
//     return response.data;
//   },
//   async (error: AxiosError) => {
//     const status = error.response?.status;
//     const url = error.config?.url;

//     console.log(`❌ [${status || 'NETWORK_ERROR'}] Error from: ${url}`);

//     // Handle Unauthorized (401)
//     if (status === 401) {
//       console.warn('Unauthorized! Cleaning up session...');
//       await AsyncStorage.removeItem('userToken');
//       // Optional: Add logic to navigate to Login screen or trigger a logout event
//     }

//     // Handle Network Timeout/Connection issues
//     if (!error.response) {
//       return Promise.reject({
//         message: 'Network error. Please check your internet connection.',
//         status: 503,
//       });
//     }

//     // Parse and return a clean error object
//     return Promise.reject(parseApiError(error));
//   }
// );

// /**
//  * Utility: Parse API Errors into user-friendly messages
//  */
// const parseApiError = (error: AxiosError<any>) => {
//   const data = error.response?.data;

//   // Custom logic based on how your backend sends errors
//   const message = 
//     data?.message || 
//     data?.error || 
//     data?.msg || 
//     'Something went wrong. Please try again.';

//   return {
//     status: error.response?.status,
//     message: message,
//     errors: data?.errors || null, // For validation errors (e.g. email already exists)
//     raw: data,
//   };
// };

// export default axiosClient;



import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../app/store';
import { logoutUser } from '../redux/slices/authSlice';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

const BASE_URL = 'https://horse-shipt.vercel.app';

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