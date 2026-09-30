import React from 'react';
import { View, TouchableOpacity, Image, Linking } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import imageIndex from '../../../../../assets/images/imageIndex';
import { COLORS, FONTS } from '../../../../../constants';
import styles from '../styles.Livetracking';

interface DriverContactCardProps {
  driverName: string;
  driverPhone?: string;
  driverEmail?: string;
  driverStatus?: string;
  driverAvatarUri?: string | null;
  driverUpdatedAt: string;
}

export const DriverContactCard: React.FC<DriverContactCardProps> = ({
  driverName,
  driverPhone,
  driverEmail,
  driverStatus,
  driverAvatarUri,
  driverUpdatedAt,
}) => {
  return (
    <View style={styles.driverCard}>
      <View style={styles.driverInfo}>
        <Image
          source={
            driverAvatarUri ? { uri: driverAvatarUri } : imageIndex?.AccountIcon
          }
          style={styles.driverAvatar}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <AppText style={styles.driverName} numberOfLines={1}>
              {driverName}
            </AppText>
            {driverStatus && (
              <View
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <AppText
                  style={{
                    fontSize: 10,
                    fontFamily: FONTS.bold,
                    color: COLORS.success,
                    textTransform: 'uppercase',
                  }}
                >
                  {driverStatus}
                </AppText>
              </View>
            )}
          </View>
          <AppText style={styles.lastUpdated} numberOfLines={1}>
            {driverPhone ? `${driverPhone} • ` : ''}
            {driverUpdatedAt}
          </AppText>
        </View>

        {/* Action Row: Direct Call and Mail Buttons */}
        <View style={styles.actionRow}>
          {driverPhone && (
            <TouchableOpacity
              style={styles.iconAction}
              onPress={() => Linking.openURL(`tel:${driverPhone}`)}
              activeOpacity={0.8}
            >
              <AppIcon name="Phone" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}
          {driverEmail && (
            <TouchableOpacity
              style={styles.iconAction}
              onPress={() => Linking.openURL(`mailto:${driverEmail}`)}
              activeOpacity={0.8}
            >
              <AppIcon name="Mail" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
