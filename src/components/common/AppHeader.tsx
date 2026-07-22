import React, { memo } from 'react'; // 1. Import memo
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BellIcon, ChevronLeft, Menu } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, FONT_SIZE } from '../../constants';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../hooks/redux';
import imageIndex from '../../assets/images/imageIndex';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

// 2. Wrap the component in memo
const AppHeader = memo(({ title, showBack, onBack, rightElement }: HeaderProps) => {
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);

  // Helper to handle profile image size
  const profileImageSize = user?.profileImage ? 34 : 24;

  return (
    <View style={styles.header}>
      {/* LEFT SECTION */}
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack ? onBack : () => navigation.goBack()}
            style={styles.iconBtn}
          >
            <ChevronLeft color={COLORS.textPrimary} size={26} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
            <Menu color={COLORS.textPrimary} size={26} />
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
              onPress={() => navigation.navigate("Notifications")}
              style={styles.iconBtn}
            >
              <BellIcon color={COLORS.textPrimary} size={22} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={styles.profileBtn}
            >
              <Image
                source={
                  user?.profileImage
                    ? { uri: user.profileImage }
                    : imageIndex.AccountIcon
                }
                style={{
                  width: profileImageSize,
                  height: profileImageSize,
                  borderRadius: profileImageSize / 2,
                  backgroundColor: COLORS.grey200
                }}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
});

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
  profileBtn: {
    marginLeft: SPACING.xs,
    padding: 4,
  },
});

export default AppHeader;