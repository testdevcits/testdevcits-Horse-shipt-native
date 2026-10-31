import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';
import DeviceInfo from 'react-native-device-info';
import { COLORS } from '../../../constants/colors';
import { AppText } from '../../../components';
import styles from './styles.shipperdrawer';

interface ShipperDrawerFooterProps {
  onLogoutPress: () => void;
}

const ShipperDrawerFooter: React.FC<ShipperDrawerFooterProps> = ({
  onLogoutPress,
}) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onLogoutPress}
        activeOpacity={0.75}
      >
        <View style={styles.logoutIconBg}>
          <LogOut size={17} color={COLORS.error} strokeWidth={2} />
        </View>
        <AppText style={styles.logoutText}>Logout</AppText>
      </TouchableOpacity>

      <AppText style={styles.versionText}>
        HorseShipt v{DeviceInfo?.getVersion() || '1.0.0'}
      </AppText>
    </View>
  );
};

export default memo(ShipperDrawerFooter);
