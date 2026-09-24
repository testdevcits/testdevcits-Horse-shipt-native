import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import horseReducer from './slices/horseSlice';
import notificationReducer from './slices/notificationSlice';
import networkReducer from './slices/networkSlice';
import customerShipmentReducer from './slices/customerShipmentSlice';
import wishlistReducer from './slices/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  horse: horseReducer,
  notification: notificationReducer,
  network: networkReducer,
  customerShipments: customerShipmentReducer,
  wishlist: wishlistReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

