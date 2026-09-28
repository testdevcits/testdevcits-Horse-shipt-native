import React, { memo } from 'react';
import { View, Image } from 'react-native';
import { AppText } from '../../../../components';
import AppButton from '../../../../components/common/Button/AppButton';
import imageIndex from '../../../../assets/images/imageIndex';
import styles from '../styles.signupflow';

interface SignupSuccessStepProps {
  renderStepper: (step: number) => React.ReactNode;
  onNavigateLogin: () => void;
}

const SignupSuccessStep: React.FC<SignupSuccessStepProps> = ({
  renderStepper,
  onNavigateLogin,
}) => {
  return (
    <View style={styles.formContainer}>
      <AppText style={styles.title}>Complete 3/3</AppText>
      {renderStepper(3)}

      <View style={styles.successIconWrapper}>
        <Image
          source={imageIndex?.HorseIcon}
          style={styles.successIcon}
          resizeMode="contain"
        />
      </View>
      <AppText style={styles.successTitle}>
        Your account{'\n'}was successfully created!
      </AppText>
      <AppText style={styles.successSub}>
        One tap to book your next horse shipment.
      </AppText>
      <AppButton
        title="Login"
        onPress={onNavigateLogin}
        buttonStyle={styles.actionBtn}
      />
    </View>
  );
};

export default memo(SignupSuccessStep);
