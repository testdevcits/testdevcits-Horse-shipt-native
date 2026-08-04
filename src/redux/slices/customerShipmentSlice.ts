// src/redux/slices/customerShipmentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import customerService from '../../api/services/customerService';
import { Shipment } from '../../types/customer';

interface CustomerShipmentState {
  shipments: Shipment[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CustomerShipmentState = {
  shipments: [],
  loading: false,
  refreshing: false,
  error: null,
  lastFetched: null,
};

/**
 * Async Thunk to fetch customer shipments from the API.
 * Accepts optional parameter `isRefresh` to distinguish full page loading vs pull-to-refresh.
 */
export const fetchCustomerShipments = createAsyncThunk(
  'customerShipments/fetchCustomerShipments',
  async (isRefresh: boolean | undefined, { rejectWithValue }) => {
    try {
      const response = await customerService.getMyShipments();
      if (response?.success) {
        return response.shipments ?? [];
      }
      return rejectWithValue('Failed to fetch shipments');
    } catch (error: any) {
      return rejectWithValue(
        error?.message || 'Error fetching customer shipments',
      );
    }
  },
);

export const deleteCustomerShipment = createAsyncThunk(
  'customerShipments/deleteCustomerShipment',
  async (shipmentId: string, { dispatch, rejectWithValue }) => {
    try {
      const response: any = await customerService.deleteShipment(shipmentId);
      if (response?.success !== false) {
        dispatch(removeShipmentFromState(shipmentId));
        return shipmentId;
      }
      return rejectWithValue(response?.message || 'Failed to delete shipment');
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete shipment',
      );
    }
  },
);

const customerShipmentSlice = createSlice({
  name: 'customerShipments',
  initialState,
  reducers: {
    updateLocalShipmentStatus: (
      state,
      action: PayloadAction<{ shipmentId: string; status: string; isInProgress?: boolean; isCompleted?: boolean }>,
    ) => {
      const target = state.shipments.find(
        item => item._id === action.payload.shipmentId,
      );
      if (target) {
        target.status = action.payload.status;
        if (action.payload.isInProgress !== undefined) {
          target.isInProgress = action.payload.isInProgress;
        }
        if (action.payload.isCompleted !== undefined) {
          target.isCompleted = action.payload.isCompleted;
        }
      }
    },
    removeShipmentFromState: (state, action: PayloadAction<string>) => {
      state.shipments = state.shipments.filter(
        item => item._id !== action.payload,
      );
    },
    clearCustomerShipmentState: state => {
      state.shipments = [];
      state.loading = false;
      state.refreshing = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCustomerShipments.pending, (state, action) => {
        const isRefresh = action.meta.arg;
        if (isRefresh) {
          state.refreshing = true;
        } else if (state.shipments.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCustomerShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.shipments = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCustomerShipments.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateLocalShipmentStatus,
  removeShipmentFromState,
  clearCustomerShipmentState,
} = customerShipmentSlice.actions;

export default customerShipmentSlice.reducer;
