// src/redux/slices/wishlistSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import customerService from '../../api/services/customerService';

interface WishlistState {
  wishlist: any[];
  wishlistIds: string[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  wishlistIds: [],
  loading: false,
  refreshing: false,
  error: null,
};

export const fetchWishlistThunk = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (isRefresh: boolean | undefined, { rejectWithValue }) => {
    try {
      const response: any = await customerService.getWishlist();
      if (response?.success !== false) {
        const data = Array.isArray(response?.data) ? response.data : [];
        const ids =
          Array.isArray(response?.shipperIds) && response.shipperIds.length > 0
            ? response.shipperIds
            : data.map((item: any) => item.id || item._id);
        return { data, ids };
      }
      return rejectWithValue(response?.message || 'Failed to fetch wishlist');
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch wishlist',
      );
    }
  },
);

export const toggleWishlistThunk = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (
    { shipperId, shipperItem }: { shipperId: string; shipperItem?: any },
    { dispatch, getState, rejectWithValue },
  ) => {
    // 1. Dispatch optimistic update in slice
    dispatch(optimisticToggleWishlist({ shipperId, shipperItem }));

    try {
      const response: any = await customerService.toggleWishlistShipper(shipperId);
      if (response?.success !== false) {
        const isFav = response?.isFavorite !== undefined ? response.isFavorite : undefined;
        // Toast.show({
        //   type: 'success',
        //   text2:
        //     response?.message ||
        //     (isFav === false
        //       ? 'Shipper removed from favorites.'
        //       : 'Shipper saved to your favorites.'),
        // });
        return { shipperId, isFavorite: isFav };
      } else {
        // Revert on error
        dispatch(optimisticToggleWishlist({ shipperId, shipperItem }));
        // Toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2: response?.message || 'Failed to update wishlist',
        // });
        return rejectWithValue(response?.message || 'Failed to update wishlist');
      }
    } catch (error: any) {
      // Revert on exception
      dispatch(optimisticToggleWishlist({ shipperId, shipperItem }));
      const msg = error?.response?.data?.message || error?.message || 'Failed to update wishlist';
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: msg,
      // });
      return rejectWithValue(msg);
    }
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    optimisticToggleWishlist: (
      state,
      action: PayloadAction<{ shipperId: string; shipperItem?: any }>,
    ) => {
      const { shipperId, shipperItem } = action.payload;
      const index = state.wishlistIds.indexOf(shipperId);

      if (index > -1) {
        // Currently in wishlist -> Remove it
        state.wishlistIds.splice(index, 1);
        state.wishlist = state.wishlist.filter(
          item => (item.id || item._id) !== shipperId,
        );
      } else {
        // Not in wishlist -> Add it
        state.wishlistIds.push(shipperId);
        if (shipperItem) {
          const itemToAdd = {
            ...shipperItem,
            isFavorite: true,
            isWishlisted: true,
          };
          state.wishlist.unshift(itemToAdd);
        }
      }
    },
    clearWishlistState: state => {
      state.wishlist = [];
      state.wishlistIds = [];
      state.loading = false;
      state.refreshing = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWishlistThunk.pending, (state, action) => {
        const isRefresh = action.meta.arg;
        if (isRefresh) {
          state.refreshing = true;
        } else if (state.wishlist.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.wishlist = action.payload.data;
        state.wishlistIds = action.payload.ids;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { optimisticToggleWishlist, clearWishlistState } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
