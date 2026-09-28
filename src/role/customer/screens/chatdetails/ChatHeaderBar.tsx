import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import React, { memo } from 'react';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  ICON_SIZE,
  SPACING,
} from '../../../../constants';
import { AppText } from '../../../../components';
import AppIcon from '../../../../components/app_icon/AppIcon';

interface charheaderInterface {
  navigation: any;
  setShowLocationModal: any;
  partnerName: String;
  avatar: any;
  shipment: any;
}

const ChatHeaderBar = ({
  navigation,
  setShowLocationModal,
  partnerName,
  avatar,
  shipment,
}: charheaderInterface) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AppIcon
          name={'ChevronLeft'}
          color={COLORS.textPrimary}
          size={ICON_SIZE.md}
        />
      </TouchableOpacity>
      <Image source={avatar} style={styles.headerAvatar} />
      <TouchableOpacity
        style={styles.headerInfo}
        onPress={() => setShowLocationModal(true)}
        activeOpacity={0.7}
      >
        <AppText style={styles.headerTitle}>{partnerName}</AppText>
        <AppText style={styles.headerSubtitle}>
          Shipment ID {shipment?.shipmentCode || 'Not Available'}
        </AppText>
      </TouchableOpacity>
      {/* <TouchableOpacity
          style={{ paddingHorizontal: 6 }}
          onPress={() => setShowLocationModal(true)}
          activeOpacity={0.7}
        >
          <MapPin color={COLORS.primary} size={ICON_SIZE.sm} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowLocationModal(true)}>
          <MoreVertical color={COLORS.textPrimary} size={ICON_SIZE.sm} />
        </TouchableOpacity> */}
    </View>
  );
};

export default memo(ChatHeaderBar);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    ...Platform.select({ ios: { paddingTop: 50 } }),
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: SPACING.xs,
  },
  headerInfo: { flex: 1, marginLeft: SPACING.sm },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
});
