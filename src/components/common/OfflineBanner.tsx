import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react-native';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { COLORS } from '../../constants';

export const OfflineBanner: React.FC = () => {
  const { isOffline, refresh } = useNetworkStatus();
  const [showRestored, setShowRestored] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevOfflineRef = useRef<boolean>(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    // Detect offline -> online transition
    if (prevOfflineRef.current && !isOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
    prevOfflineRef.current = isOffline;
  }, [isOffline]);

  const visible = isOffline || showRestored;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  if (!visible) {
    return null;
  }

  const isRestored = !isOffline && showRestored;

  return (
    <Animated.View
      style={[
        styles.container,
        isRestored ? styles.restoredContainer : styles.offlineContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}>
      <View style={styles.content}>
        {isRestored ? (
          <>
            <Wifi size={18} color={COLORS.white} style={styles.icon} />
            <Text style={styles.text}>Back online! Internet connection restored.</Text>
          </>
        ) : (
          <>
            <WifiOff size={18} color={COLORS.white} style={styles.icon} />
            <Text style={styles.text}>No Internet Connection. Checking connection...</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
              disabled={isRefreshing}
              activeOpacity={0.8}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <RefreshCw size={14} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  offlineContainer: {
    backgroundColor: COLORS.error || '#EF4444',
  },
  restoredContainer: {
    backgroundColor: COLORS.success || '#22C55E',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  retryButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginLeft: 8,
  },
});

export default OfflineBanner;
