import React, { useState, useRef, useEffect, memo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import SignatureScreen from 'react-native-signature-canvas';
import { pick, types } from '@react-native-documents/picker';
import { AppText, Input } from '../../../../../../components';
import { COLORS, SPACING } from '../../../../../../constants';
import shipperService from '../../../../../../api/services/shipperService';
import { useNavigation } from '@react-navigation/native';
import AppIcon from '../../../../../../components/app_icon/AppIcon';
import {
  showErrorToast,
  showSuccessToast,
} from '../../../../../../utils/toast';
import Toast from 'react-native-toast-message';
import styles from './styles.SubmitOffer';

interface SubmitOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
  shipmentId: string;
  shipmentCode?: string;
  onSuccess?: () => void;
}

const SubmitOfferModal: React.FC<SubmitOfferModalProps> = ({
  isVisible,
  onClose,
  shipmentId,
  shipmentCode: _shipmentCode,
  onSuccess,
}) => {
  const sigRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  const [totalPrice, setTotalPrice] = useState('');
  const [cancellationDays, setCancellationDays] = useState('');
  const [notes, setNotes] = useState('');
  const [contractFile, setContractFile] = useState<any>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Errors
  const [priceError, setPriceError] = useState('');
  const [daysError, setDaysError] = useState('');
  const [sigError, setSigError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTotalPrice('');
      setCancellationDays('');
      setNotes('');
      setContractFile(null);
      setSignature(null);
      setPriceError('');
      setDaysError('');
      setSigError('');
      setSubmitError('');
      setIsLoading(false);
      setIsPicking(false);
      setScrollEnabled(true);
    }
  }, [isVisible]);

  const handleChooseFile = async () => {
    if (isPicking) return;
    setIsPicking(true);
    try {
      const [result] = await pick({
        type: [types.pdf, types.images],
      });
      setIsPicking(false);
      if (result) {
        setContractFile({
          uri: result.uri,
          type: result.type || 'application/pdf',
          name: result.name || 'contract.pdf',
          fileName: result.name || 'contract.pdf',
        });
      }
    } catch (error) {
      setIsPicking(false);
      console.log('File pick error:', error);
    }
  };

  const handleClearSignature = () => {
    sigRef.current?.clearSignature();
    setSignature(null);
    setSigError('');
    setSubmitError('');
  };

  const handleSubmit = async () => {
    let isValid = true;
    setSubmitError('');

    if (
      !totalPrice.trim() ||
      isNaN(Number(totalPrice)) ||
      Number(totalPrice) <= 0
    ) {
      setPriceError('Please enter a valid price');
      isValid = false;
    } else {
      setPriceError('');
    }

    if (
      !cancellationDays.trim() ||
      isNaN(Number(cancellationDays)) ||
      Number(cancellationDays) < 0
    ) {
      setDaysError('Please enter valid cancellation days');
      isValid = false;
    } else {
      setDaysError('');
    }

    if (!signature) {
      setSigError('Please provide your digital signature before submitting.');
      isValid = false;
    } else {
      setSigError('');
    }

    if (!isValid) {
      if (!signature) {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      } else {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData?.append('shipment', shipmentId);
      formData?.append('totalPrice', totalPrice.trim());
      formData?.append('paymentMethod', 'card');
      formData?.append('paymentDue', 'delivery');
      formData?.append('cancellationWindowDays', cancellationDays.trim());
      formData?.append('notes', notes.trim());
      formData?.append('shipperSignature', signature);

      if (contractFile) {
        formData?.append('contractFile', {
          uri: contractFile.uri,
          type: contractFile.type || 'application/pdf',
          name:
            contractFile.name ||
            contractFile.fileName ||
            'shipper_contract.pdf',
        } as any);
      }

      const res = await shipperService.addQuote(formData);

      if (res?.success) {
        showSuccessToast(
          'Quote Sent',
          res.message || 'Quote sent successfully',
        );
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const errorMsg = res?.message || 'Failed to submit quote.';
        setSubmitError(errorMsg);
        scrollViewRef.current?.scrollToEnd({ animated: true });

        showErrorToast('Submission Failed', errorMsg);
      }
    } catch (error: any) {
      console.error('Submit Offer Error:', error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to submit quote.';
      setSubmitError(errorMsg);
      scrollViewRef.current?.scrollToEnd({ animated: true });
      showErrorToast('Submission Failed', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerIconBox}>
              <AppIcon name="FileText" size={20} color={COLORS.brandBrown} />
            </View>

            <View style={styles.headerTextCol}>
              <AppText style={styles.headerTitle}>
                Submit Shipping Offer
              </AppText>
              <AppText style={styles.headerSub}>
                Complete the form below and sign to confirm your offer
              </AppText>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <AppIcon name="X" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Top Payment Info Readonly Bar */}
          <View style={styles.paymentInfoRow}>
            <View style={styles.paymentInfoBox}>
              <View style={styles.paymentIconBox}>
                <AppIcon
                  name="CreditCard"
                  size={18}
                  color={COLORS.brandBrown}
                />
              </View>
              <View style={styles.paymentTextCol}>
                <AppText style={styles.paymentLabel}>PAYMENT METHOD</AppText>
                <AppText style={styles.paymentValue}>Credit Card</AppText>
              </View>
            </View>

            <View style={styles.paymentInfoBox}>
              <View style={styles.paymentIconBox}>
                <AppIcon name="Box" size={18} color={COLORS.brandBrown} />
              </View>
              <View style={styles.paymentTextCol}>
                <AppText style={styles.paymentLabel}>PAYMENT DUE</AppText>
                <AppText style={styles.paymentValue}>On Delivery</AppText>
              </View>
            </View>
          </View>

          {/* Form Content */}
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={scrollEnabled}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Pricing Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <AppIcon
                  name="DollarSign"
                  size={18}
                  color={COLORS.brandBrown}
                />
                <AppText style={styles.sectionTitle}>Pricing</AppText>
              </View>

              <Input
                label="Total Price *"
                keyboardType="numeric"
                value={totalPrice}
                onChangeText={text => {
                  setTotalPrice(text);
                  if (priceError) setPriceError('');
                }}
                error={priceError}
                leftIcon={<AppText style={styles.currencyPrefix}>$</AppText>}
                maxLength={9}
              />
            </View>

            {/* 2. Cancellation Policy Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <AppIcon name="Info" size={18} color={COLORS.brandBrown} />
                <AppText style={styles.sectionTitle}>
                  Cancellation Policy
                </AppText>
              </View>

              <Input
                label="Cancellation Window (Days) *"
                keyboardType="numeric"
                value={cancellationDays}
                onChangeText={text => {
                  setCancellationDays(text);
                  if (daysError) setDaysError('');
                }}
                error={daysError}
                maxLength={2}
              />
              <AppText style={styles.captionText}>
                Number of days customer can cancel this shipment
              </AppText>
            </View>

            {/* 3. Additional Notes Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <AppIcon name="FileText" size={18} color={COLORS.brandBrown} />
                <AppText style={styles.sectionTitle}>Additional Notes</AppText>
              </View>

              <Input
                placeholder="Type any additional details for the customer..."
                multiline
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* 4. Shipper Contract Section (Optional File Upload) */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <AppIcon name="FileText" size={18} color={COLORS.brandBrown} />
                <AppText style={styles.sectionTitle}>Shipper Contract</AppText>
              </View>

              <View style={styles.dashedFileContainer}>
                <View style={styles.fileTextCol}>
                  <AppText style={styles.fileNameText} numberOfLines={1}>
                    {contractFile?.fileName || 'No file chosen'}
                  </AppText>
                  <AppText style={styles.fileCaptionText}>
                    Optional PDF or image. Customers can review it before
                    accepting the quote?.
                  </AppText>
                </View>

                <TouchableOpacity
                  style={[styles.chooseFileBtn, isPicking && { opacity: 0.7 }]}
                  onPress={handleChooseFile}
                  activeOpacity={0.8}
                  disabled={isPicking}
                >
                  {isPicking ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <AppText style={styles.chooseFileBtnText}>
                      Choose File
                    </AppText>
                  )}
                </TouchableOpacity>
              </View>

              {contractFile && (
                <TouchableOpacity
                  style={styles.removeContractBtn}
                  onPress={() => setContractFile(null)}
                >
                  <AppText style={styles.removeContractText}>
                    Remove contract
                  </AppText>
                </TouchableOpacity>
              )}
            </View>

            {/* 5. Digital Signature Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <AppIcon name="Edit3" size={18} color={COLORS.brandBrown} />
                <AppText style={styles.sectionTitle}>
                  Digital Signature{' '}
                </AppText>
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
                    setSignature(data);
                    if (sigError) setSigError('');
                    if (submitError) setSubmitError('');
                  }}
                  onEmpty={() => setSignature(null)}
                  onBegin={() => setScrollEnabled(false)}
                  onEnd={() => {
                    setScrollEnabled(true);
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
                  onPress={handleClearSignature}
                  activeOpacity={0.7}
                >
                  <AppIcon
                    name="RotateCcw"
                    size={14}
                    color={COLORS.bluePrimary}
                  />
                  <AppText style={styles.clearSigText}>Clear Signature</AppText>
                </TouchableOpacity>

                {signature ? (
                  <View style={styles.capturedRow}>
                    <AppIcon
                      name="CheckCircle2"
                      size={14}
                      color={COLORS.greenActive}
                    />
                    <AppText style={styles.capturedText}>
                      Signature captured
                    </AppText>
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
                  <AppText style={styles.focusedErrorText}>
                    {submitError}
                  </AppText>
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

            {/* 6. Action Buttons Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <AppText style={styles.cancelBtnText}>Cancel</AppText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <AppText style={styles.submitBtnText}>Submit Offer</AppText>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Toast />
    </Modal>
  );
};

export default memo(SubmitOfferModal);
