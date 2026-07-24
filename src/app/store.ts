// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../redux/slices/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
// });

// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import horseReducer from '../redux/slices/horseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    horse: horseReducer,
  },
});

// ADD THESE TWO LINES:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
