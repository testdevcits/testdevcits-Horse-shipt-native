import React, { memo, useEffect, useState } from 'react'; // 1. Import memo & useEffect
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BellIcon, ChevronLeft, Menu } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, FONT_SIZE } from '../../constants';
import AppText from './AppText';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchNotificationsThunk } from '../../redux/slices/notificationSlice';
import imageIndex from '../../assets/images/imageIndex';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

// 2. Wrap the component in memo
const AppHeader = memo(
  ({ title, showBack, onBack, rightElement }: HeaderProps) => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { unreadCount } = useAppSelector(state => state.notification);
    const [imageError, setImageError] = useState(false)

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
              <ChevronLeft color={COLORS.textPrimary} size={24} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              style={styles.iconBtn}
            >
              <Menu color={COLORS.textPrimary} size={24} />
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
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <View style={styles.bellContainer}>
                  <BellIcon color={COLORS.textPrimary} size={20} />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <AppText style={styles.badgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </AppText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.profileBtn}
              >
                {
                  imageError ?
                    <Image
                      source={
                        imageIndex.AccountIcon
                      }
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: COLORS.grey200,
                      }}

                    /> :
                    <Image
                      source={
                        avatarUri
                          ? { uri: avatarUri }
                          : imageIndex.AccountIcon
                      }
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: COLORS.grey200,
                      }}
                      onError={() => setImageError(true)}
                    />}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  leftContainer: {
    flex: 0.15,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 0.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  iconBtn: {
    padding: 6,
  },
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    lineHeight: 12,
  },
  profileBtn: {
    marginLeft: SPACING.xs,
    padding: 4,
  },
});

export default AppHeader;
