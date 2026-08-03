import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
  details: Record<string, any> | null;
}

const initialState: NetworkState = {
  isConnected: true, // assume connected by default until NetInfo initializes
  isInternetReachable: true,
  type: null,
  details: null,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkState: (
      state,
      action: PayloadAction<{
        isConnected: boolean | null;
        isInternetReachable: boolean | null;
        type: string | null;
        details?: Record<string, any> | null;
      }>,
    ) => {
      state.isConnected = action.payload.isConnected;
      state.isInternetReachable = action.payload.isInternetReachable;
      state.type = action.payload.type;
      if (action.payload.details !== undefined) {
        state.details = action.payload.details;
      }
    },
  },
});

export const { setNetworkState } = networkSlice.actions;
export default networkSlice.reducer;
