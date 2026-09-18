// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import horseReducer from './slices/horseSlice';
import notificationReducer from './slices/notificationSlice';
import networkReducer from './slices/networkSlice';
import customerShipmentReducer from './slices/customerShipmentSlice';
import wishlistReducer from './slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    horse: horseReducer,
    notification: notificationReducer,
    network: networkReducer,
    customerShipments: customerShipmentReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
