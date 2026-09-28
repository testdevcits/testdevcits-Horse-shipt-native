import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { AppText } from '../../../../../../../components';
import AppIcon from '../../../../../../../components/app_icon/AppIcon';
import { COLORS, SPACING } from '../../../../../../../constants';
import styles from '../styles.SubmitOffer';

interface DigitalSignatureSectionProps {
  sigRef: React.RefObject<any>;
  sigError: string;
  submitError: string;
  signature: string | null;
  onSetSignature: (sig: string | null) => void;
  onSetSigError: (err: string) => void;
  onSetSubmitError: (err: string) => void;
  onSetScrollEnabled: (enabled: boolean) => void;
  onClearSignature: () => void;
  navigation: any;
}

const DigitalSignatureSection: React.FC<DigitalSignatureSectionProps> = ({
  sigRef,
  sigError,
  submitError,
  signature,
  onSetSignature,
  onSetSigError,
  onSetSubmitError,
  onSetScrollEnabled,
  onClearSignature,
  navigation,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionTitleRow}>
        <AppIcon name="Edit3" size={18} color={COLORS.brandBrown} />
        <AppText style={styles.sectionTitle}>Digital Signature </AppText>
        <AppText style={styles.asterisk}>*</AppText>
      </View>
      <AppText style={styles.sigSub}>
        Sign below to confirm your shipping offer
      </AppText>

      <View
        style={[
          styles.signatureWrapper,
          Boolean(sigError || submitError) && styles.inputError,
        ]}
      >
        <SignatureScreen
          ref={sigRef}
          onOK={data => {
            onSetSignature(data);
            if (sigError) onSetSigError('');
            if (submitError) onSetSubmitError('');
          }}
          onEmpty={() => onSetSignature(null)}
          onBegin={() => onSetScrollEnabled(false)}
          onEnd={() => {
            onSetScrollEnabled(true);
            sigRef.current?.readSignature();
          }}
          descriptionText=""
          clearText="Clear"
          confirmText="Save"
          webStyle={`.m-signature-pad--footer { display: none; margin: 0px; } body,html { width: 100%; height: 100%; }`}
          autoClear={false}
          imageType="image/png"
        />
      </View>

      <View style={styles.sigFooterRow}>
        <TouchableOpacity
          style={styles.clearSigBtn}
          onPress={onClearSignature}
          activeOpacity={0.7}
        >
          <AppIcon name="RotateCcw" size={14} color={COLORS.bluePrimary} />
          <AppText style={styles.clearSigText}>Clear Signature</AppText>
        </TouchableOpacity>

        {signature ? (
          <View style={styles.capturedRow}>
            <AppIcon
              name="CheckCircle2"
              size={14}
              color={COLORS.greenActive}
            />
            <AppText style={styles.capturedText}>Signature captured</AppText>
          </View>
        ) : null}
      </View>

      {Boolean(sigError) && (
        <View style={styles.focusedErrorBox}>
          <AppIcon name="AlertCircle" size={15} color={COLORS.error} />
          <AppText style={styles.focusedErrorText}>{sigError}</AppText>
        </View>
      )}
      {Boolean(submitError) && (
        <View style={styles.focusedErrorBox}>
          <AppIcon name="AlertCircle" size={15} color={COLORS.error} />
          <AppText style={styles.focusedErrorText}>{submitError}</AppText>
        </View>
      )}
      {submitError === 'subscription is required' && (
        <TouchableOpacity
          style={[styles.submitBtn, { marginVertical: SPACING.md }]}
          onPress={() => (navigation as any).navigate('Profile')}
        >
          <AppText style={styles.submitBtnText}>
            Go to Subscription Page
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(DigitalSignatureSection);
