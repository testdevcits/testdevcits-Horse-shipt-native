import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LogOut } from 'lucide-react-native';
import DeviceInfo from 'react-native-device-info';
import { COLORS } from '../../../constants/colors';
import { AppText } from '../../../components';
import styles from './styles.customerdrawer';

interface CustomerDrawerFooterProps {
  onLogoutPress: () => void;
}

const CustomerDrawerFooter: React.FC<CustomerDrawerFooterProps> = ({
  onLogoutPress,
}) => {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={onLogoutPress}
        activeOpacity={0.7}
      >
        <View style={styles.logoutIconBg}>
          <LogOut size={17} color={COLORS.error} strokeWidth={2} />
        </View>
        <AppText style={styles.logoutText}>Log Out</AppText>
      </TouchableOpacity>

      <AppText style={styles.versionText}>
        HorseShipt v{DeviceInfo?.getVersion() || 'Not Available'}
      </AppText>
    </View>
  );
};

export default memo(CustomerDrawerFooter);
