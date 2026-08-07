

// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import horseReducer from '../redux/slices/horseSlice';
import notificationReducer from '../redux/slices/notificationSlice';
import networkReducer from '../redux/slices/networkSlice';
import customerShipmentReducer from '../redux/slices/customerShipmentSlice';
import wishlistReducer from '../redux/slices/wishlistSlice';

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

// ADD THESE TWO LINES:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
