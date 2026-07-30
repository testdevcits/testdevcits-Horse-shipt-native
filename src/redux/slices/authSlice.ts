// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import authService from '../../api/services/authService';

// // // The AsyncThunk handles the async logic
// // export const loginUser = createAsyncThunk(
// //   'auth/login',
// //   async (userData, thunkAPI) => {
// //     try {
// //       return await authService.login(userData);
// //     } catch (error) {
// //       return thunkAPI.rejectWithValue(error);
// //     }
// //   }
// // );

// // const authSlice = createSlice({
// //   name: 'auth',
// //   initialState: {
// //     user: null,
// //     token: null,
// //     isLoading: false,
// //     error: null,
// //   },
// //   reducers: {
// //     logout: (state) => {
// //       state.user = null;
// //       state.token = null;
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(loginUser.pending, (state) => {
// //         state.isLoading = true;
// //         state.error = null;
// //       })
// //       .addCase(loginUser.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.user = action.payload.user;
// //         state.token = action.payload.token;
// //       })
// //       .addCase(loginUser.rejected, (state, action) => {
// //         state.isLoading = false;
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export const { logout } = authSlice.actions;
// // export default authSlice.reducer;

// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import authService from '../../api/services/authService';
// import { AuthState, AppUser, UserRole } from '../../types/auth';

// // Storage Keys
// const STORAGE_KEYS = {
//   TOKEN: '@user_token',
//   USER: '@user_data',
// };

// /**
//  * Thunk to handle Login
//  * Logic: Calls API -> Transforms Data -> Saves to AsyncStorage -> Returns to Redux
//  */
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({ credentials, role }: { credentials: any; role: UserRole }, thunkAPI) => {
//     try {
//       const response = await authService.login(credentials, role);

//       // Persist to local storage for Splash screen retrieval
//       await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
//       await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

//       return response; // { user, token }
//     } catch (error: any) {
//       const message = error.response?.data?.message || 'Login Failed';
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// /**
//  * Thunk to handle App Initialization (Rehydration)
//  * Logic: Check storage on Splash screen -> Load into Redux
//  */
// export const rehydrateAuth = createAsyncThunk(
//   'auth/rehydrate',
//   async (_, thunkAPI) => {
//     try {
//       const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
//       const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);

//       if (token && userData) {
//         return {
//           token,
//           user: JSON.parse(userData) as AppUser
//         };
//       }
//       return thunkAPI.rejectWithValue('No session found');
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Persistence error');
//     }
//   }
// );

// /**
//  * Thunk to handle Logout
//  */
// export const logoutUser = createAsyncThunk('auth/logout', async () => {
//   await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
//   return true;
// });

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: true, // Start true to allow Splash screen to check storage
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     // Manually clear errors (useful when switching between Login/Signup)
//     clearAuthError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // --- Login ---
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       });

//     // --- Rehydrate (App Start) ---
//     builder
//       .addCase(rehydrateAuth.fulfilled, (state, action) => {
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isLoading = false;
//       })
//       .addCase(rehydrateAuth.rejected, (state) => {
//         state.user = null;
//         state.token = null;
//         state.isLoading = false;
//       });

//     // --- Logout ---
//     builder.addCase(logoutUser.fulfilled, (state) => {
//       state.user = null;
//       state.token = null;
//       state.error = null;
//       state.isLoading = false;
//     });
//   },
// });

// export const { clearAuthError } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../api/services/authService';
import { AuthState, AppUser, UserRole } from '../../types/auth';

// Storage Keys
const STORAGE_KEYS = {
  TOKEN: '@user_token',
  USER: '@user_data',
  ROLE: '@user_role',
};

/**
 * Thunk to handle Login
 */
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({ credentials, role }: { credentials: any; role: UserRole }, thunkAPI) => {
//     try {
//       const response = await authService.login(credentials, role);

//       // Persist to local storage
//       await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
//       await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

//       return response; // { user, token }
//     } catch (error: any) {
//       const message = error.response?.data?.message || 'Login Failed';
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { credentials, role }: { credentials: any; role: UserRole },
    thunkAPI,
  ) => {
    try {
      const response = await authService.login(credentials, role);

      // Save token, user data, and selected/returned role
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(response.user),
      );
      const userRole = response.user?.role || role;
      if (userRole) {
        await AsyncStorage.setItem(STORAGE_KEYS.ROLE, userRole);
      }

      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login Failed',
      );
    }
  },
);

/**
 * Thunk to handle App Initialization (Rehydration)
 */
// export const rehydrateAuth = createAsyncThunk(
//   'auth/rehydrate',
//   async (_, thunkAPI) => {
//     try {
//       const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
//       const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);

//       if (token && userData) {
//         return {
//           token,
//           user: JSON.parse(userData) as AppUser
//         };
//       }
//       return thunkAPI.rejectWithValue('No session found');
//     } catch (error) {
//       return thunkAPI.rejectWithValue('Persistence error');
//     }
//   }
// );

export const rehydrateAuth = createAsyncThunk('auth/rehydrate', async () => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  if (token && userData) {
    return { token, user: JSON.parse(userData) as AppUser };
  }
  throw new Error('No session');
});

/**
 * Thunk to handle Logout
 */
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.USER,
    STORAGE_KEYS.ROLE,
  ]);
  return true;
});

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Synchronous reducer to manually set user data
     * Used for OTP verification or social logins
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: AppUser; token: string }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoading = false;
      state.error = null;

      // Note: In a professional app, you should also trigger
      // AsyncStorage saving here if not handled in the component.
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // --- Login ---
    builder
      .addCase(loginUser.pending, state => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // --- Rehydrate ---
    builder
      .addCase(rehydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
      })
      .addCase(rehydrateAuth.rejected, state => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      });

    // --- Logout ---
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;
    });
  },
});

export const { clearAuthError, setCredentials } = authSlice.actions; // Exported here
export default authSlice.reducer;
