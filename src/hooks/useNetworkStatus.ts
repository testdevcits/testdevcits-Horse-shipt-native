import { useEffect, useState, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useAppDispatch } from './redux';
import { setNetworkState } from '../redux/slices/networkSlice';

export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();
  const [netInfo, setNetInfo] = useState<NetInfoState | null>(null);

  const refresh = useCallback(async () => {
    const state = await NetInfo.fetch();
    setNetInfo(state);
    dispatch(
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      }),
    );
    return state;
  }, [dispatch]);

  useEffect(() => {
    // Fetch current status on mount
    refresh();

    // Subscribe to connection state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetInfo(state);
      dispatch(
        setNetworkState({
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          type: state.type,
          details: state.details,
        }),
      );
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, refresh]);

  const isConnected = netInfo?.isConnected ?? true;
  const isInternetReachable = netInfo?.isInternetReachable ?? true;
  const isOffline =
    netInfo !== null &&
    (isConnected === false || isInternetReachable === false);

  return {
    netInfo,
    isConnected,
    isInternetReachable,
    isOffline,
    networkType: netInfo?.type || 'unknown',
    refresh,
  };
};

export default useNetworkStatus;
