// import React, { useEffect, useState, useRef } from 'react';
// import {
//   Modal,
//   StyleSheet,
//   View,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   TextInput,
// } from 'react-native';
// import {
//   X,
//   FileText,
//   CreditCard,
//   ChevronRight,
//   DollarSign,
//   User,
//   Activity,
//   Check,
//   CheckCircle2,
//   AlertCircle,
// } from 'lucide-react-native';
// import moment from 'moment';
// import SignatureScreen from 'react-native-signature-canvas';
// import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
// import { AppText } from '../../../../components';
// import { useNavigation } from '@react-navigation/native';
// import customerService from '../../../../api/services/customerService';
// import { CardField, useStripe } from '@stripe/stripe-react-native';

// const QuoteDetailModal = ({ visible, quote, onClose, onRefresh }: any) => {
//   const navigation = useNavigation<any>();
//   const { confirmPayment } = useStripe(); // Stripe Hook
//   const [cardDetails, setCardDetails] = useState<any>(null); // To check if card is valid

//   const sigRef = useRef<any>(null);
//   const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
//   const [signature, setSignature] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');
//   const [isAccepted, setIsAccepted] = useState(
//     quote?.status === 'accepted' ? true : false,
//   );

//   useEffect(() => {
//     if (quote) {
//       setIsAccepted(quote?.status === 'accepted');
//     }
//   }, [quote, visible]);

//   if (!quote) return null;

//   const handleProcessFlow = async () => {
//     if (!cardDetails?.complete) {
//       return Alert.alert('Invalid Card', 'Please enter complete card details.');
//     }
//     // 1. Validation
//     if (!isAcceptedTerms)
//       return Alert.alert('Required', 'Please agree to the terms.');
//     if (!signature)
//       return Alert.alert('Required', 'Please provide your signature.');

//     setLoading(true);

//     try {
//       // --- STEP 1: RUN PAY API ---
//       console.log('Step 1: Running Pay API...');
//       const payResponse = await customerService.payQuote(quote?._id);
//       // Expected: { success: true, clientSecret: '...', amount: 500 }

//       if (!payResponse.success || !payResponse.clientSecret) {
//         throw new Error('Failed to initialize payment.');
//       }

//       // --- STEP 2: STRIPE PAYMENT ---
//       console.log('Step 2: Confirming Stripe Payment...');
//       const { error, paymentIntent } = await confirmPayment(
//         payResponse.clientSecret,
//         {
//           paymentMethodType: 'Card',
//         },
//       );

//       if (error) {
//         Alert.alert('Payment Error', error.message);
//         setLoading(false);
//         return;
//       }

//       if (
//         paymentIntent?.status === 'Succeeded' ||
//         paymentIntent?.status === 'RequiresCapture'
//       ) {
//         // --- STEP 3: RUN ACCEPT API ---
//         console.log('Step 3: Payment Success, running Accept API...');
//         const acceptRes = await customerService.acceptQuote(quote?._id, {
//           customerSignature: signature,
//           // paymentIntentId: paymentIntent.id, // Optional: pass intent ID to backend
//         });

//         if (acceptRes) {
//           Alert.alert('Success', 'Payment processed and Quote accepted!');
//           onClose();
//           if (onRefresh) onRefresh();
//         }
//       }
//     } catch (e: any) {
//       Alert.alert('Process Failed', e.message || 'Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelShipment = async () => {
//     if (!cancelReason.trim()) {
//       Alert.alert('Reason Required', 'Please enter a reason for cancellation.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = { cancelReason: cancelReason.trim() };
//       const res = await customerService.cancelQuote(quote._id, payload);

//       if (res.success) {
//         Alert.alert(
//           'Cancelled',
//           'Your shipment has been cancelled successfully.',
//         );
//         setIsCancelModalVisible(false);
//         onClose();
//         if (onRefresh) onRefresh();
//       }
//     } catch (error: any) {
//       Alert.alert(
//         'Error',
//         error?.response?.data?.message || 'Failed to cancel shipment.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openPdf = (url: string, title: string) => {
//     navigation.navigate('PdfViewer', { title, url });
//   };

//   const SummaryBox = ({ label, value }: { label: string; value: any }) => (
//     <View style={styles.summaryItem}>
//       <AppText style={styles.summaryLabel}>{label}</AppText>
//       <AppText style={styles.summaryValue}>{value || 'N/A'}</AppText>
//     </View>
//   );

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.overlay}>
//         <View style={styles.content}>
//           {/* HEADER SECTION */}
//           <View style={styles.header}>
//             <View>
//               <AppText style={styles.reviewLabel}>QUOTE REVIEW</AppText>
//               <AppText style={styles.title}>Accept Quote</AppText>
//             </View>
//             <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
//               <X size={24} color={COLORS.textPrimary} />
//             </TouchableOpacity>
//           </View>

//           {/* CANCELLATION BANNER */}
//           <View style={styles.cancelBanner}>
//             <AppText style={styles.cancelText}>
//               You can cancel until{' '}
//               <AppText style={{ fontFamily: FONTS.bold }}>
//                 {moment(quote?.cancellationLastDate).format('MMM DD, hh:mm A')}
//               </AppText>
//             </AppText>
//           </View>

//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             style={styles.scroll}
//           >
//             {/* STATS ROW */}
//             <View style={styles.statsRow}>
//               <View style={styles.statBox}>
//                 <AppText style={styles.statLabel}>TOTAL PRICE</AppText>
//                 <AppText style={styles.statPrice}>${quote?.totalPrice}</AppText>
//               </View>
//               <View style={styles.statBox}>
//                 <AppText style={styles.statLabel}>STATUS</AppText>
//                 <AppText style={styles.statValue}>{quote?.status}</AppText>
//               </View>
//             </View>

//             {/* QUOTE SUMMARY */}
//             <View style={styles.cardContainer}>
//               <AppText style={styles.cardTitle}>Quote Summary</AppText>
//               <View style={styles.summaryGrid}>
//                 <SummaryBox label="SHIPPER" value={quote?.shipper?.name} />
//                 <SummaryBox label="METHOD" value={quote?.paymentMethod} />
//                 <SummaryBox label="DUE" value={quote?.paymentDue} />
//                 <SummaryBox label="STATUS" value={quote?.paymentStatus} />
//               </View>
//             </View>

//             {/* DOCUMENTS */}
//             <View style={styles.cardContainer}>
//               <AppText style={styles.cardTitle}>Documents</AppText>
//               <TouchableOpacity
//                 style={styles.docItem}
//                 onPress={() => openPdf(quote?.contract.url, 'Contract')}
//               >
//                 <AppText style={styles.docName}>
//                   Generated Quote Contract
//                 </AppText>
//                 <AppText style={styles.docAction}>View</AppText>
//               </TouchableOpacity>
//             </View>

//             {/* ACCEPTANCE FORM */}
//             {quote?.status === 'accepted' && (
//               <View
//                 style={[
//                   styles.cardContainer,
//                   {
//                     borderColor: COLORS.goldPrimary,
//                     backgroundColor: '#FFFCF5',
//                   },
//                 ]}
//               >
//                 <AppText style={styles.cardTitle}>Acceptance & Payment</AppText>

//                 <TouchableOpacity
//                   style={styles.termsRow}
//                   onPress={() => setIsAcceptedTerms(!isAcceptedTerms)}
//                 >
//                   <View
//                     style={[
//                       styles.checkbox,
//                       isAcceptedTerms && styles.checkboxActive,
//                     ]}
//                   >
//                     {isAcceptedTerms && (
//                       <Check size={14} color={COLORS.white} />
//                     )}
//                   </View>
//                   <AppText style={styles.termsLabel}>
//                     I agree to the terms and pricing.
//                   </AppText>
//                 </TouchableOpacity>

//                 <View style={styles.signatureTitleRow}>
//                   <AppText style={styles.signatureTitle}>
//                     Your Signature *
//                   </AppText>
//                   {signature && (
//                     <AppText style={{ color: COLORS.success, fontSize: 10 }}>
//                       Captured
//                     </AppText>
//                   )}
//                 </View>

//                 <View style={{ flexDirection: 'row' }}>
//                   <CreditCard size={16} color={COLORS.textSecondary} />
//                   <AppText style={{ color: COLORS.textPrimary }}>
//                     Card Details
//                   </AppText>
//                 </View>

//                 {/* STRIPE CARD INPUT FIELD */}
//                 <CardField
//                   postalCodeEnabled={true} // Set to false if your backend doesn't require it
//                   placeholder={{
//                     number: '0000 0000 0000 0000',
//                   }}
//                   cardStyle={{
//                     backgroundColor: '#FFFFFF',
//                     textColor: COLORS.textPrimary,
//                     placeholderColor: COLORS.textLight,
//                     borderRadius: RADIUS.sm,
//                   }}
//                   style={styles.stripeCardField}
//                   onCardChange={details => {
//                     setCardDetails(details); // Tracks if the user finished typing the card
//                   }}
//                 />

//                 <View style={styles.signatureWrap}>
//                   <SignatureScreen
//                     ref={sigRef}
//                     onEnd={() => sigRef.current.readSignature()}
//                     onOK={img => setSignature(img)}
//                     webStyle={`.m-signature-pad--footer {display: none; margin: 0;}`}
//                   />
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => {
//                     sigRef.current.clearSignature();
//                     setSignature(null);
//                   }}
//                 >
//                   <AppText style={styles.clearText}>Clear Signature</AppText>
//                 </TouchableOpacity>
//               </View>
//             )}

//             <View style={{ height: 100 }} />
//           </ScrollView>

//           {/* FOOTER ACTIONS */}
//           {/* <View style={styles.footer}>
//             <TouchableOpacity
//               style={styles.btnReject}
//               onPress={onClose}
//               disabled={loading}
//             >
//               <AppText style={styles.btnRejectText}>Cancel</AppText>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.btnAccept,
//                 (!isAcceptedTerms || !signature) && styles.btnDisabled,
//               ]}
//               onPress={handleProcessFlow}
//               disabled={loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color={COLORS.white} />
//               ) : (
//                 <AppText style={styles.btnAcceptText}>Pay & Accept</AppText>
//               )}
//             </TouchableOpacity>
//           </View> */}

//           {/* ACTION SECTION */}
//           <View style={styles.footerActionContainer}>
//             {/* CASE 1: QUOTE IS ALREADY ACCEPTED */}
//             {quote?.status === 'accepted' && !quote?.isCancelled && (
//               <View style={styles.acceptedContainer}>
//                 <View style={styles.successMessageCard}>
//                   <CheckCircle2 size={24} color={COLORS.greenPrimary} />
//                   <View>
//                     <AppText style={styles.successTitle}>
//                       Quote Accepted
//                     </AppText>
//                     <AppText style={styles.successSub}>
//                       Your shipment is booked and secured.
//                     </AppText>
//                   </View>
//                 </View>

//                 {/* CANCEL BUTTON: Visible if within cancellation window */}
//                 <TouchableOpacity
//                   style={styles.cancelBookingBtn}
//                   onPress={() => setIsCancelModalVisible(true)}
//                 >
//                   <AlertCircle size={18} color={COLORS.error} />
//                   <AppText style={styles.cancelBookingText}>
//                     Cancel Shipment
//                   </AppText>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* CASE 2: QUOTE IS PENDING (Normal Accept Flow) */}
//             {quote?.status === 'pending' && !quote?.isCancelled && (
//               <>
//                 <View style={styles.termsRow}>
//                   <TouchableOpacity
//                     style={[
//                       styles.checkbox,
//                       isAccepted && styles.checkboxActive,
//                     ]}
//                     onPress={() => setIsAccepted(!isAccepted)}
//                   >
//                     {isAccepted && (
//                       <Check size={14} color={COLORS.white} strokeWidth={3} />
//                     )}
//                   </TouchableOpacity>
//                   <AppText style={styles.termsText}>
//                     By accepting the offer, I acknowledge that I have read and
//                     agree to the terms of services.
//                   </AppText>
//                 </View>

//                 <TouchableOpacity
//                   style={[styles.acceptBtn, !isAccepted && styles.disabledBtn]}
//                   disabled={!isAccepted || loading}
//                   onPress={handleProcessFlow}
//                 >
//                   <AppText style={styles.acceptBtnText}>
//                     {loading ? 'Processing...' : 'Pay & Accept Quote'}
//                   </AppText>
//                 </TouchableOpacity>
//               </>
//             )}

//             {/* CASE 3: QUOTE IS REJECTED OR CANCELLED */}
//             {(quote?.status === 'rejected' || quote?.isCancelled) && (
//               <View style={styles.inactiveState}>
//                 <AppText style={styles.inactiveText}>
//                   This quote is no longer active.
//                 </AppText>
//               </View>
//             )}
//           </View>
//         </View>
//       </View>

//       {/* --- CUSTOM ALERT WITH INPUT MODAL --- */}
//       <Modal
//         visible={isCancelModalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setIsCancelModalVisible(false)}
//       >
//         <View style={styles.promptOverlay}>
//           <View style={styles.promptContent}>
//             <AppText style={styles.promptTitle}>Cancel Shipment</AppText>
//             <AppText style={styles.promptSub}>
//               Please provide a reason for cancelling this booking.
//             </AppText>

//             <TextInput
//               style={styles.reasonInput}
//               placeholder="Enter reason here..."
//               placeholderTextColor={COLORS.textLight}
//               multiline
//               numberOfLines={3}
//               value={cancelReason}
//               onChangeText={setCancelReason}
//             />

//             <View style={styles.promptFooter}>
//               <TouchableOpacity
//                 style={styles.promptBtnSecondary}
//                 onPress={() => {
//                   setIsCancelModalVisible(false);
//                   setCancelReason('');
//                 }}
//               >
//                 <AppText style={styles.promptBtnTextSecondary}>Discard</AppText>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.promptBtnPrimary}
//                 onPress={handleCancelShipment}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color={COLORS.white} size="small" />
//                 ) : (
//                   <AppText style={styles.promptBtnTextPrimary}>
//                     Cancel Shipment
//                   </AppText>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </Modal>
//   );
// };

import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  X,
  CreditCard,
  Check,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react-native';
import moment from 'moment';
import SignatureScreen from 'react-native-signature-canvas';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText } from '../../../../components';
import { useNavigation } from '@react-navigation/native';
import customerService from '../../../../api/services/customerService';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const QuoteDetailModal = ({ visible, quote, onClose, onRefresh }: any) => {
  const navigation = useNavigation<any>();
  const { confirmPayment } = useStripe();

  // States
  const sigRef = useRef<any>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true); // To fix Signature vs ScrollView conflict
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Reset states when modal opens
  useEffect(() => {
    if (visible) {
      setIsAcceptedTerms(false);
      setSignature(null);
      setCancelReason('');
      setCardDetails(null);
    }
  }, [visible]);

  if (!quote) return null;

  // Derived Conditions
  const isPending = quote.status === 'pending';
  const isAccepted = quote.status === 'accepted';
  const isCancelled = quote.isCancelled || quote.status === 'cancelled';
  const isRejected = quote.status === 'rejected';

  const handleProcessFlow = async () => {
    if (!cardDetails?.complete)
      return Alert.alert('Error', 'Please enter valid card details.');
    if (!isAcceptedTerms)
      return Alert.alert('Error', 'Please agree to the terms.');
    if (!signature)
      return Alert.alert('Error', 'Please provide your signature.');

    setLoading(true);
    try {
      // 1. Get Secret from Pay API
      const payResponse = await customerService.payQuote(quote._id);
      if (!payResponse.success || !payResponse.clientSecret)
        throw new Error('Payment initialization failed.');

      // 2. Stripe Payment
      const { error, paymentIntent } = await confirmPayment(
        payResponse.clientSecret,
        { paymentMethodType: 'Card' },
      );
      if (error) {
        Alert.alert('Payment Error', error.message);
        setLoading(false);
        return;
      }

      // 3. Final Accept API
      if (
        paymentIntent?.status === 'Succeeded' ||
        paymentIntent?.status === 'RequiresCapture'
      ) {
        const acceptRes = await customerService.acceptQuote(quote._id, {
          customerSignature: signature,
        });
        if (acceptRes) {
          Alert.alert('Success', 'Payment successful and quote accepted!');
          onClose();
          navigation.goBack()
          if (onRefresh) onRefresh();
        }
      }
    } catch (e: any) {
      Alert.alert('Process Failed', e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelShipment = async () => {
    if (!cancelReason.trim())
      return Alert.alert('Error', 'Reason is required.');
    setLoading(true);
    try {
      const res = await customerService.cancelQuote(quote._id, {
        reason: cancelReason.trim(),
      });
      if (res.success) {
        Alert.alert('Success', 'Shipment cancelled.');
        setIsCancelModalVisible(false);
        onClose();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel.');
    } finally {
      setLoading(false);
    }
  };

  const SummaryBox = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.summaryItem}>
      <AppText style={styles.summaryLabel}>{label}</AppText>
      <AppText style={styles.summaryValue}>{value || 'N/A'}</AppText>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <AppText style={styles.reviewLabel}>QUOTE REVIEW</AppText>
              <AppText style={styles.title}>Quote Details</AppText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            scrollEnabled={scrollEnabled} // Dynamic scroll lock
          >
            {/* CANCELLATION BANNER */}
            {!isCancelled && !isRejected && (
              <View style={styles.cancelBanner}>
                <AppText style={styles.cancelText}>
                  Cancel window:{' '}
                  <AppText style={{ fontFamily: FONTS.bold }}>
                    {moment(quote.cancellationLastDate).format(
                      'MMM DD, hh:mm A',
                    )}
                  </AppText>
                </AppText>
              </View>
            )}

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <AppText style={styles.statLabel}>TOTAL PRICE</AppText>
                <AppText style={styles.statPrice}>${quote.totalPrice}</AppText>
              </View>
              <View style={styles.statBox}>
                <AppText style={styles.statLabel}>STATUS</AppText>
                <AppText
                  style={[
                    styles.statValue,
                    { color: isAccepted ? COLORS.success : COLORS.goldPrimary },
                  ]}
                >
                  {quote.status}
                </AppText>
              </View>
            </View>

            {/* QUOTE SUMMARY */}
            <View style={styles.cardContainer}>
              <AppText style={styles.cardTitle}>Summary</AppText>
              <View style={styles.summaryGrid}>
                <SummaryBox label="SHIPPER" value={quote.shipper?.name} />
                <SummaryBox label="METHOD" value={quote.paymentMethod} />
                <SummaryBox label="DUE" value={quote.paymentDue} />
                <SummaryBox label="PAYMENT" value={quote.paymentStatus} />
              </View>
            </View>

            {/* FORM: ONLY SHOWN IF PENDING */}
            {isPending && (
              <View style={[styles.cardContainer, styles.highlightCard]}>
                <AppText style={styles.cardTitle}>Acceptance & Payment</AppText>

                {/* 1. STRIPE */}
                <View style={styles.inputLabelRow}>
                  <CreditCard size={16} color={COLORS.textSecondary} />
                  <AppText style={styles.inputLabel}>Card Details</AppText>
                </View>
                <CardField
                  postalCodeEnabled={true}
                  style={styles.stripeCardField}
                  cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: COLORS.textPrimary,
                  }}
                  onCardChange={setCardDetails}
                />

                {/* 2. SIGNATURE */}
                <View style={styles.signatureHeader}>
                  <AppText style={styles.inputLabel}>Your Signature *</AppText>
                  {signature && (
                    <AppText style={styles.capturedText}>Captured</AppText>
                  )}
                </View>
                <View style={styles.signatureWrap}>
                  <SignatureScreen
                    ref={sigRef}
                    onBegin={() => setScrollEnabled(false)}
                    onEnd={() => {
                      setScrollEnabled(true);
                      sigRef.current.readSignature();
                    }}
                    onOK={setSignature}
                    webStyle={`.m-signature-pad--footer {display: none;}`}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    sigRef.current.clearSignature();
                    setSignature(null);
                  }}
                >
                  <AppText style={styles.clearText}>Clear Signature</AppText>
                </TouchableOpacity>

                {/* 3. TERMS */}
                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => setIsAcceptedTerms(!isAcceptedTerms)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isAcceptedTerms && styles.checkboxActive,
                    ]}
                  >
                    {isAcceptedTerms && (
                      <Check size={14} color={COLORS.white} />
                    )}
                  </View>
                  <AppText style={styles.termsLabel}>
                    I agree to the terms and conditions.
                  </AppText>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.cardContainer}>
              <AppText style={styles.cardTitle}>Notes</AppText>
              <AppText style={styles.notesText}>{quote.notes}</AppText>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* DYNAMIC FOOTER ACTIONS */}
          <View style={styles.footerActionContainer}>
            {isAccepted && !quote.isCancelled && (
              <View style={styles.acceptedContainer}>
                <View style={styles.successMessageCard}>
                  <CheckCircle2 size={24} color={COLORS.greenPrimary} />
                  <View>
                    <AppText style={styles.successTitle}>
                      Quote Accepted
                    </AppText>
                    <AppText style={styles.successSub}>
                      Shipment is secured.
                    </AppText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.cancelBookingBtn}
                  onPress={() => setIsCancelModalVisible(true)}
                >
                  <AlertCircle size={18} color={COLORS.error} />
                  <AppText style={styles.cancelBookingText}>
                    Cancel Shipment
                  </AppText>
                </TouchableOpacity>
              </View>
            )}

            {isPending && (
              <TouchableOpacity
                style={[
                  styles.acceptBtn,
                  (!isAcceptedTerms || !signature || loading) &&
                    styles.disabledBtn,
                ]}
                disabled={!isAcceptedTerms || !signature || loading}
                onPress={handleProcessFlow}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <AppText style={styles.acceptBtnText}>
                    Pay & Accept Quote
                  </AppText>
                )}
              </TouchableOpacity>
            )}

            {(isRejected || isCancelled) && (
              <View style={styles.inactiveState}>
                <AppText style={styles.inactiveText}>
                  This quote is no longer active.
                </AppText>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* CANCEL MODAL */}
      <Modal visible={isCancelModalVisible} transparent animationType="fade">
        <View style={styles.promptOverlay}>
          <View style={styles.promptContent}>
            <AppText style={styles.promptTitle}>Cancel Shipment</AppText>
            <TextInput
              style={styles.reasonInput}
              placeholder="Reason for cancellation..."
              multiline
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            <View style={styles.promptFooter}>
              <TouchableOpacity
                style={styles.promptBtnSecondary}
                onPress={() => setIsCancelModalVisible(false)}
              >
                <AppText>Discard</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.promptBtnPrimary}
                onPress={handleCancelShipment}
              >
                <AppText style={{ color: '#fff' }}>Confirm</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 15,
  },
  content: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    height: '95%',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewLabel: {
    fontSize: 10,
    color: COLORS.goldPrimary,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  title: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  closeIcon: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 5,
    borderRadius: 4,
  },

  cancelBanner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#FFEEBA',
  },
  cancelText: { color: '#856404', fontSize: 12 },

  scroll: { flex: 1, padding: 15 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  statPrice: { fontSize: 18, fontFamily: FONTS.bold, color: '#856404' },
  statValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textTransform: 'capitalize',
  },

  cardContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summaryItem: {
    width: '48%',
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.goldPrimary,
    borderRadius: 6,
  },
  docName: { fontSize: 13, color: '#856404' },
  docAction: { fontSize: 12, color: '#856404', fontFamily: FONTS.bold },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.goldPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: COLORS.goldPrimary },
  termsLabel: { fontSize: 13, color: COLORS.textPrimary },

  signatureTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
  },
  signatureTitle: { fontSize: 13, fontFamily: FONTS.bold },
  signatureWrap: {
    height: 150,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  clearText: {
    color: COLORS.goldPrimary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: '#E9ECEF',
  },
  btnReject: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRejectText: { color: COLORS.textSecondary, fontFamily: FONTS.bold },
  btnAccept: {
    flex: 1.5,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#A3894F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAcceptText: { color: COLORS.white, fontFamily: FONTS.bold },
  btnDisabled: { backgroundColor: '#CCC' },
  stripeCardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  cardInfoBox: {
    padding: 10, // CardField handles its own internal padding
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 4,
    marginTop: 15,
  },
  footerActionContainer: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },

  // Accepted State
  acceptedContainer: {
    gap: 15,
  },
  successMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    padding: 16,
    borderRadius: RADIUS.md,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
  },
  successTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.greenPrimary,
  },
  successSub: {
    fontSize: 12,
    color: COLORS.greenPrimary,
    opacity: 0.8,
  },

  // Cancel Button Style
  cancelBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: 8,
  },
  cancelBookingText: {
    color: COLORS.error,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },

  // Inactive state
  inactiveState: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.md,
  },
  inactiveText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
  // The legal disclaimer text next to the checkbox
  termsText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    fontFamily: FONTS.medium,
  },

  // The primary action button (Accept Offer)
  acceptBtn: {
    backgroundColor: COLORS.goldPrimary,
    height: 54,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    // Add subtle shadow for premium feel
    shadowColor: COLORS.goldPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  // State applied when checkbox is not clicked or API is loading
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: COLORS.buttonDisabled || '#CBD5E1',
    shadowOpacity: 0, // Remove shadow when disabled
    elevation: 0,
  },

  // Text inside the accept button
  acceptBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },

  // Prompt Modal Styles (Alert with Input look-alike)
  promptOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  promptContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 20,
    elevation: 10,
  },
  promptTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  promptSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 10,
  },
  reasonInput: {
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    marginVertical: 15,
  },
  promptFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  promptBtnSecondary: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.grey100,
  },
  promptBtnTextSecondary: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
  },
  promptBtnPrimary: {
    flex: 2,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.error,
  },
  promptBtnTextPrimary: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  //new added
  // Highlights the critical payment/signature section
  highlightCard: {
    borderColor: COLORS.goldPrimary,
    backgroundColor: COLORS.goldLightBg || '#FFFCF5', // Soft gold tint
    borderWidth: 1.5,
  },

  // Row container for Icon + Label (e.g., Card Details)
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  // Standard label for input sections
  inputLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  // Header row for the signature section
  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 8,
  },

  // Small success indicator when signature is captured
  capturedText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.success, // Green color
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Styling for multiline notes with improved readability
  notesText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 22, // Extra spacing for long paragraphs
  },
});

export default QuoteDetailModal;
