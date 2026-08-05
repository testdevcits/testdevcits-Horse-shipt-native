import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  X,
  CreditCard,
  Box,
  DollarSign,
  Info,
  FileText,
  Edit3,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { AppText, Input } from '../../../../components';
import { COLORS, FONTS, SPACING, RADIUS, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';

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
  shipmentCode,
  onSuccess,
}) => {
  const sigRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const handleChooseFile = () => {
    if (isPicking) return;
    setIsPicking(true);
    try {
      launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
        setIsPicking(false);
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.error('ImagePicker Error:', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setContractFile(response.assets[0]);
        }
      });
    } catch (error) {
      console.error('File pick error:', error);
      setIsPicking(false);
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

    if (!totalPrice.trim() || isNaN(Number(totalPrice)) || Number(totalPrice) <= 0) {
      setPriceError('Please enter a valid price');
      isValid = false;
    } else {
      setPriceError('');
    }

    if (!cancellationDays.trim() || isNaN(Number(cancellationDays)) || Number(cancellationDays) < 0) {
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
          type: contractFile.type || 'image/jpeg',
          name: contractFile.fileName || 'shipper_contract.jpg',
        } as any);
      }

      const res = await shipperService.addQuote(formData);

      if (res?.success) {
        Toast.show({
          type: 'success',
          text1: 'Quote Sent',
          text2: res.message || 'Quote sent successfully',
        });
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const errorMsg = res?.message || 'Failed to submit quote.';
        setSubmitError(errorMsg);
        scrollViewRef.current?.scrollToEnd({ animated: true });
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: errorMsg,
        });
      }
    } catch (error: any) {
      console.error('Submit Offer Error:', error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to submit quote.';
      setSubmitError(errorMsg);
      scrollViewRef.current?.scrollToEnd({ animated: true });
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: errorMsg,
      });
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
              <FileText size={20} color="#A06333" />
            </View>

            <View style={styles.headerTextCol}>
              <AppText style={styles.headerTitle}>Submit Shipping Offer</AppText>
              <AppText style={styles.headerSub}>
                Complete the form below and sign to confirm your offer
              </AppText>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Top Payment Info Readonly Bar */}
          <View style={styles.paymentInfoRow}>
            <View style={styles.paymentInfoBox}>
              <View style={styles.paymentIconBox}>
                <CreditCard size={18} color="#A06333" />
              </View>
              <View style={styles.paymentTextCol}>
                <AppText style={styles.paymentLabel}>PAYMENT METHOD</AppText>
                <AppText style={styles.paymentValue}>Credit Card</AppText>
              </View>
            </View>

            <View style={styles.paymentInfoBox}>
              <View style={styles.paymentIconBox}>
                <Box size={18} color="#A06333" />
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
                <DollarSign size={18} color="#A06333" />
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
              />
            </View>

            {/* 2. Cancellation Policy Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <Info size={18} color="#A06333" />
                <AppText style={styles.sectionTitle}>Cancellation Policy</AppText>
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
              />
              <AppText style={styles.captionText}>
                Number of days customer can cancel this shipment
              </AppText>
            </View>

            {/* 3. Additional Notes Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <FileText size={18} color="#A06333" />
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
                <FileText size={18} color="#A06333" />
                <AppText style={styles.sectionTitle}>Shipper Contract</AppText>
              </View>

              <View style={styles.dashedFileContainer}>
                <View style={styles.fileTextCol}>
                  <AppText style={styles.fileNameText} numberOfLines={1}>
                    {contractFile?.fileName || 'No file chosen'}
                  </AppText>
                  <AppText style={styles.fileCaptionText}>
                    Optional PDF or image. Customers can review it before accepting the quote?.
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
                    <AppText style={styles.chooseFileBtnText}>Choose File</AppText>
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
                <Edit3 size={18} color="#A06333" />
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
                >
                  <RotateCcw size={14} color="#2563EB" />
                  <AppText style={styles.clearSigText}>Clear Signature</AppText>
                </TouchableOpacity>

                {signature ? (
                  <View style={styles.capturedRow}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <AppText style={styles.capturedText}>
                      Signature captured
                    </AppText>
                  </View>
                ) : null}
              </View>
              {Boolean(sigError) && (
                <View style={styles.focusedErrorBox}>
                  <AlertCircle size={15} color={COLORS.error} />
                  <AppText style={styles.focusedErrorText}>{sigError}</AppText>
                </View>
              )}
              {Boolean(submitError) && (
                <View style={styles.focusedErrorBox}>
                  <AlertCircle size={15} color={COLORS.error} />
                  <AppText style={styles.focusedErrorText}>{submitError}</AppText>
                </View>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grey100,
    gap: SPACING.sm,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.xs,
    backgroundColor: '#FAF6EE',
    borderWidth: 1,
    borderColor: '#EFE5D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },

  // Readonly Payment Bar
  paymentInfoRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  paymentInfoBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
    padding: SPACING.xs,
    borderRadius: RADIUS.xs,
  },
  paymentIconBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#FAF6EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentTextCol: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  paymentValue: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Scroll Content
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },

  // Sections
  sectionContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Label Row
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  asterisk: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.error,
  },

  // Price Input
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 46,
    backgroundColor: COLORS.white,
  },
  currencyPrefix: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  priceTextInput: {
    flex: 1,
    height: '100%',
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Standard Input
  standardInputContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 46,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  standardTextInput: {
    width: '100%',
    height: '100%',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  captionText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  errorText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginTop: 4,
  },
  focusedErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: RADIUS.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    marginTop: SPACING.xs,
  },
  focusedErrorText: {
    flex: 1,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FEF2F2',
  },

  // Textarea
  textAreaContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  textAreaInput: {
    height: 90,
    textAlignVertical: 'top',
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },

  // Dashed Contract File
  dashedFileContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  fileTextCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  fileNameText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  fileCaptionText: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chooseFileBtn: {
    borderWidth: 1,
    borderColor: '#A06333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.white,
  },
  chooseFileBtnText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: '#A06333',
  },
  removeContractBtn: {
    marginTop: 4,
  },
  removeContractText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },

  // Signature
  sigSub: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  signatureWrapper: {
    height: 180,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  sigFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  clearSigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearSigText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.bold,
    color: '#2563EB',
  },
  capturedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capturedText: {
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: '#10B981',
  },

  // Footer Actions
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#A06333',
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  submitBtn: {
    flex: 1,
    height: 46,
    borderRadius: RADIUS.sm,
    backgroundColor: '#A06333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A06333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default SubmitOfferModal;
