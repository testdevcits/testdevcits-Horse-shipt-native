import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import customerService from '../../api/services/customerService';
import shipperService from '../../api/services/shipperService';
import { NotificationActivity } from '../../types/notification';

interface NotificationState {
  notifications: NotificationActivity[];
  unreadCount: number;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchNotificationsThunk = createAsyncThunk(
  'notification/fetchNotifications',
  async (arg: { isRefresh?: boolean } | void, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const isShipper = state?.auth?.user?.role === 'shipper';

      let res: any;
      if (isShipper) {
        res = await shipperService.getNotificationActivity();
      } else {
        res = await customerService.getNotifications();
      }

      if (res?.success || res?.data) {
        const rawData = res.data || [];
        const notifications: NotificationActivity[] = rawData.map((n: any) => ({
          ...n,
          read:
            typeof n.read === 'boolean'
              ? n.read
              : typeof n.isRead === 'boolean'
              ? n.isRead
              : !!n.readAt,
        }));
        const unreadCount =
          typeof res.unreadCount === 'number'
            ? res.unreadCount
            : notifications.filter(n => !n.read).length;
        return { notifications, unreadCount };
      }
      return rejectWithValue('Failed to fetch notifications');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error fetching notifications');
    }
  }
);

export const markNotificationsReadThunk = createAsyncThunk(
  'notification/markAsRead',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await customerService.markAsRead(ids);
      return ids;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to mark as read');
    }
  }
);

export const deleteNotificationsThunk = createAsyncThunk(
  'notification/deleteNotifications',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await customerService.deleteNotifications(ids);
      return ids;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete notifications');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchNotificationsThunk
    builder
      .addCase(fetchNotificationsThunk.pending, (state, action) => {
        const isRefresh = action.meta.arg?.isRefresh;
        // Only set full loading indicator if we don't have notifications yet and it's not a pull-to-refresh
        if (state.notifications.length === 0 && !isRefresh) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // markNotificationsReadThunk
    builder
      .addCase(markNotificationsReadThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(markNotificationsReadThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const ids = action.payload;
        state.notifications = state.notifications.map(n =>
          ids.includes(n._id) ? { ...n, read: true } : n
        );
        state.unreadCount = Math.max(0, state.notifications.filter(n => !n.read).length);
      })
      .addCase(markNotificationsReadThunk.rejected, (state) => {
        state.actionLoading = false;
      });

    // deleteNotificationsThunk
    builder
      .addCase(deleteNotificationsThunk.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteNotificationsThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        const ids = action.payload;
        state.notifications = state.notifications.filter(n => !ids.includes(n._id));
        state.unreadCount = Math.max(0, state.notifications.filter(n => !n.read).length);
      })
      .addCase(deleteNotificationsThunk.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export const { setUnreadCount, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
