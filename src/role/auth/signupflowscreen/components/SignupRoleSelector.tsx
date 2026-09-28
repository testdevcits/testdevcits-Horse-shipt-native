import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText } from '../../../../components';
import AppIcon from '../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../constants';
import styles from '../styles.signupflow';

interface SignupRoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const SignupRoleSelector: React.FC<SignupRoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  const handleSelect = async (role: string) => {
    onRoleChange(role);
    await AsyncStorage.setItem('@user_role', role);
  };

  return (
    <View style={styles.roleSelectionBlock}>
      <AppText style={styles.roleSelectionLabel}>SELECT ROLE</AppText>
      <View style={styles.roleButtonsRow}>
        <TouchableOpacity
          style={[
            styles.roleTabBtn,
            selectedRole === 'customer' && styles.roleTabBtnActive,
          ]}
          onPress={() => handleSelect('customer')}
          activeOpacity={0.75}
        >
          <AppIcon
            name={'User'}
            size={15}
            color={
              selectedRole === 'customer'
                ? COLORS.white
                : COLORS.primary
            }
          />
          <AppText
            style={[
              styles.roleTabBtnText,
              selectedRole === 'customer' && styles.roleTabBtnTextActive,
            ]}
          >
            Customer
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleTabBtn,
            selectedRole === 'shipper' && styles.roleTabBtnActive,
          ]}
          onPress={() => handleSelect('shipper')}
          activeOpacity={0.75}
        >
          <AppIcon
            name={'Building2'}
            size={15}
            color={
              selectedRole === 'shipper'
                ? COLORS.white
                : COLORS.primary
            }
          />
          <AppText
            style={[
              styles.roleTabBtnText,
              selectedRole === 'shipper' && styles.roleTabBtnTextActive,
            ]}
          >
            Shipper
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleTabBtn,
            selectedRole === 'driver' && styles.roleTabBtnActive,
          ]}
          onPress={() => handleSelect('driver')}
          activeOpacity={0.75}
        >
          <AppIcon
            name={'Truck'}
            size={15}
            color={
              selectedRole === 'driver'
                ? COLORS.white
                : COLORS.primary
            }
          />
          <AppText
            style={[
              styles.roleTabBtnText,
              selectedRole === 'driver' && styles.roleTabBtnTextActive,
            ]}
          >
            Driver
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(SignupRoleSelector);
