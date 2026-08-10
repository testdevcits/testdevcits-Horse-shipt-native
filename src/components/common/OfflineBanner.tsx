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
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE, ICON_SIZE } from '../../constants';
import AppText from './AppText';

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
            <AppText style={styles.text}>Back online! Internet connection restored.</AppText>
          </>
        ) : (
          <>
            <WifiOff size={18} color={COLORS.white} style={styles.icon} />
            <AppText style={styles.text}>No Internet Connection. Checking connection...</AppText>
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
    paddingVertical: SPACING.sm2,
    paddingHorizontal: SPACING.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  offlineContainer: {
    backgroundColor: COLORS.error,
  },
  restoredContainer: {
    backgroundColor: COLORS.success,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: SPACING.sm,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semiBold,
    flex: 1,
  },
  retryButton: {
    padding: SPACING.xs2,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginLeft: SPACING.sm,
  },
});

export default OfflineBanner;
