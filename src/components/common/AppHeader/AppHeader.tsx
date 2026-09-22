import React, { memo, useEffect, useState } from 'react'; // 1. Import memo & useEffect
import { View, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, ICON_SIZE, RADIUS, SIZES } from '../../../constants';
import AppText from '../AppText';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchNotificationsThunk } from '../../../redux/slices/notificationSlice';
import imageIndex from '../../../assets/images/imageIndex';
import AppIcon from '../../app_icon/AppIcon';
import styles from './AppHeader.styles';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showProfileImage?: boolean;
  showNotificationIcon?: boolean;
}

// 2. Wrap the component in memo
const AppHeader = memo(
  ({
    title,
    showBack,
    onBack,
    rightElement,
    showProfileImage = true,
    showNotificationIcon = true,
  }: HeaderProps) => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { unreadCount } = useAppSelector(state => state.notification);
    const [imageError, setImageError] = useState(false);

    const userId = (user as any)?._id || user?.id;

    useEffect(() => {
      if (userId) {
        dispatch(fetchNotificationsThunk({ isRefresh: true }));
      }
    }, [userId, dispatch]);

    const getAvatarUri = (profileImg: any): string | null => {
      if (!profileImg) return null;
      if (
        typeof profileImg === 'string' &&
        profileImg.trim() !== '' &&
        profileImg !== '/default-avatar.png' &&
        profileImg !== '/images/default_profile.png'
      ) {
        return profileImg;
      }
      if (
        typeof profileImg === 'object' &&
        profileImg.url &&
        profileImg.url !== '/default-avatar.png' &&
        profileImg.url !== '/images/default_profile.png'
      ) {
        return profileImg.url;
      }
      return null;
    };

    const avatarUri = getAvatarUri(user?.profileImage);

    return (
      <View style={styles.header}>
        {/* LEFT SECTION */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack ? onBack : () => navigation.goBack()}
              style={styles.iconBtn}
            >
              <AppIcon
                name="ChevronLeft"
                color={COLORS.textPrimary}
                size={ICON_SIZE.md}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={styles.iconBtn}
            >
              <AppIcon
                name="Menu"
                color={COLORS.textPrimary}
                size={ICON_SIZE.md}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* CENTER SECTION (TITLE) */}
        <View style={styles.titleContainer}>
          <AppText numberOfLines={1} style={styles.title}>
            {title}
          </AppText>
        </View>

        {/* RIGHT SECTION */}
        <View style={styles.rightContainer}>
          {rightElement ? (
            rightElement
          ) : (
            <>
              {showNotificationIcon && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Notifications')}
                  style={styles.iconBtn}
                  activeOpacity={0.7}
                >
                  <View style={styles.bellContainer}>
                    <AppIcon
                      name="BellIcon"
                      color={COLORS.textPrimary}
                      size={SPACING.xl}
                    />
                    {unreadCount > 0 && (
                      <View style={styles.badge}>
                        <AppText style={styles.badgeText}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </AppText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              {showProfileImage && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={styles.profileBtn}
                >
                  {imageError ? (
                    <Image
                      source={imageIndex.AccountIcon}
                      style={{
                        width: SIZES.avatarSm,
                        height: SIZES.avatarSm,
                        borderRadius: RADIUS.lg,
                        // backgroundColor: COLORS.grey200,
                      }}
                    />
                  ) : (
                    <Image
                      source={
                        avatarUri ? { uri: avatarUri } : imageIndex.AccountIcon
                      }
                      style={{
                        width: SIZES.avatarSm,
                        height: SIZES.avatarSm,
                        borderRadius: RADIUS.lg,
                        backgroundColor: COLORS.grey200,
                      }}
                      onError={() => setImageError(true)}
                    />
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    );
  },
);

export default AppHeader;
