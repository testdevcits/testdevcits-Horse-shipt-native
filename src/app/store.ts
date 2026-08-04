

// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import horseReducer from '../redux/slices/horseSlice';
import notificationReducer from '../redux/slices/notificationSlice';
import networkReducer from '../redux/slices/networkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    horse: horseReducer,
    notification: notificationReducer,
    network: networkReducer,
  },
});

// ADD THESE TWO LINES:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
