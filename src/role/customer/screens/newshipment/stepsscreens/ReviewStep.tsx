import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  MapPin,
  Calendar as CalendarIcon,
  Edit3,
  ChevronDown,
  ChevronUp,
  FileText,
  FileCheck,
  CheckCircle2,
  Paperclip,
  Upload,
  ShieldCheck,
  Bookmark,
  Info,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText } from '../../../../../components';
import { NewShipmentForm, NewShipmentHorse } from '../interfaces';
import styles from './ReviewStepstyles';

interface ReviewStepProps {
  form: NewShipmentForm;
  onPublish: () => void;
  onSaveDraft: () => void;
  onEditSection: (stepIndex: number) => void;
  loading?: boolean;
  draftLoading?: boolean;
  publishLoading?: boolean;
  isEdit?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  onPublish,
  onSaveDraft,
  onEditSection,
  loading = false,
  draftLoading = false,
  publishLoading = false,
  isEdit = false,
}) => {
  const navigation = useNavigation();
  const [isHorseExpanded, setIsHorseExpanded] = useState(true);
  const [isDocsExpanded, setIsDocsExpanded] = useState(true);

  const formatDateDisplay = (dateVal: any) => {
    if (!dateVal) return 'Not set';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'Not set';
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDocName = (doc: any, fallback: string) => {
    if (!doc) return null;
    if (typeof doc === 'string') return doc.split('/').pop() || fallback;
    if (doc.name) return doc.name;
    if (doc.uri) return doc.uri.split('/').pop() || fallback;
    if (doc.url) return doc.url.split('/').pop() || fallback;
    return fallback;
  };

  const getDocUri = (doc: any) => {
    if (!doc) return null;
    if (typeof doc === 'string') return doc;
    return doc.uri || doc.url || null;
  };

  // Calculate total documents uploaded across all horses
  let uploadedDocCount = 0;
  let totalDocCount = (form.horses?.length || 1) * 2; // Coggins + HealthCert per horse

  form.horses?.forEach((h: NewShipmentHorse) => {
    if (h.coggins) uploadedDocCount++;
    if (h.healthCert) uploadedDocCount++;
  });

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <AppText style={styles.infoLabel}>{label}</AppText>
      <AppText style={styles.infoValue}>{value || 'N/A'}</AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP HEADER CARD */}
        <View style={styles.headerCard}>
          <View style={styles.headerBadgeRow}>
            <View style={styles.stepChip}>
              <AppText style={styles.stepChipText}>STEP 5 OF 5</AppText>
            </View>
            <View style={styles.statusBadge}>
              <CheckCircle2 size={13} color={COLORS.greenSuccess} />
              <AppText style={styles.statusBadgeText}>
                {isEdit ? 'Ready to Update' : 'Ready to Publish'}
              </AppText>
            </View>
          </View>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBox}>
              <ShieldCheck size={22} color={COLORS.primary} />
            </View>
            <View style={styles.headerTextGroup}>
              <AppText style={styles.headerTitle}>
                {isEdit ? 'Review & Update Metadata' : 'Review & Confirm'}
              </AppText>
              <AppText style={styles.headerSubtitle}>
                {isEdit
                  ? 'Verify your updated details and documents before saving.'
                  : 'Review your route, horse details, and attached documents before publishing.'}
              </AppText>
            </View>
          </View>
        </View>

        {/* HORSES SUMMARY BANNER */}
        <View style={styles.summaryBanner}>
          <View style={styles.bannerLeft}>
            <AppText style={styles.bannerTitle}>Shipment Overview</AppText>
            <AppText style={styles.bannerSub}>
              {form?.numberOfHorses || form.horses?.length || 1} Horse(s) • {uploadedDocCount} of {totalDocCount} Papers Attached
            </AppText>
          </View>
          <View style={styles.bannerBadge}>
            <AppText style={styles.bannerBadgeText}>
              {uploadedDocCount === totalDocCount ? 'Complete' : 'Pending Docs'}
            </AppText>
          </View>
        </View>

        {/* SECTION 1: PICKUP & DELIVERY ROUTE CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <MapPin size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>ROUTE & SCHEDULE</AppText>
            </View>
            <TouchableOpacity
              style={styles.miniEditBtn}
              onPress={() => onEditSection(0)}
              activeOpacity={0.8}
            >
              <Edit3 size={13} color={COLORS.primary} />
              <AppText style={styles.miniEditText}>Edit Route</AppText>
            </TouchableOpacity>
          </View>

          {/* VISUAL ROUTE TIMELINE */}
          <View style={styles.routeTimeline}>
            {/* PICKUP NODE */}
            <View style={styles.routeNode}>
              <View style={styles.pickupDotContainer}>
                <View style={styles.pickupDot} />
              </View>
              <View style={styles.routeTextContent}>
                <AppText style={styles.routeNodeLabel}>PICKUP LOCATION</AppText>
                <AppText style={styles.routeAddressText}>
                  {form?.pickupLocation || 'Pickup location not specified'}
                </AppText>
                <View style={styles.routeDateBadge}>
                  <CalendarIcon size={13} color={COLORS.primary} />
                  <AppText style={styles.routeDateText}>
                    {formatDateDisplay(form?.pickupStartDate)} — {formatDateDisplay(form?.pickupEndDate)}
                  </AppText>
                </View>
              </View>
            </View>

            {/* CONNECTING LINE */}
            <View style={styles.routeLineContainer}>
              <View style={styles.routeLine} />
            </View>

            {/* DELIVERY NODE */}
            <View style={styles.routeNode}>
              <View style={styles.deliveryDotContainer}>
                <View style={styles.deliveryDot} />
              </View>
              <View style={styles.routeTextContent}>
                <AppText style={styles.routeNodeLabel}>DELIVERY DESTINATION</AppText>
                <AppText style={styles.routeAddressText}>
                  {form?.deliveryLocation || 'Delivery location not specified'}
                </AppText>
                <View style={styles.routeDateBadge}>
                  <CalendarIcon size={13} color={COLORS.primary} />
                  <AppText style={styles.routeDateText}>
                    {formatDateDisplay(form?.deliveryStartDate)} — {formatDateDisplay(form?.deliveryEndDate)}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* SECTION 2: HORSE DETAILS ACCORDION CARD */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderToggle}
            onPress={() => setIsHorseExpanded(!isHorseExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <ShieldCheck size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>HORSE DETAILS</AppText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                style={styles.miniEditBtn}
                onPress={() => onEditSection(2)}
                activeOpacity={0.8}
              >
                <Edit3 size={13} color={COLORS.primary} />
                <AppText style={styles.miniEditText}>Edit</AppText>
              </TouchableOpacity>
              {isHorseExpanded ? (
                <ChevronUp size={18} color={COLORS.grey600} />
              ) : (
                <ChevronDown size={18} color={COLORS.grey600} />
              )}
            </View>
          </TouchableOpacity>

          {isHorseExpanded && (
            <View style={styles.accordionContent}>
              {form.horses.map((horse: NewShipmentHorse, index: number) => {
                const photoUri = getDocUri(horse?.photo);
                return (
                  <View
                    key={index}
                    style={[
                      styles.horseSectionBox,
                      index < form.horses.length - 1 && styles.horseBoxBorder,
                    ]}
                  >
                    <View style={styles.horseHeaderRow}>
                      <View style={styles.horseTag}>
                        <AppText style={styles.horseTagText}>HORSE {index + 1}</AppText>
                      </View>
                      <AppText style={styles.horseNameTitle}>
                        {horse?.registeredName || 'Unnamed Horse'}
                      </AppText>
                    </View>

                    <View style={styles.infoGrid}>
                      <InfoRow label="Registered Name:" value={horse?.registeredName} />
                      {!!horse?.barnName && <InfoRow label="Barn Name:" value={horse?.barnName} />}
                      <InfoRow label="Breed:" value={horse?.breed} />
                      <InfoRow label="Sex:" value={horse?.sex} />
                      {!!horse?.age && <InfoRow label="Age:" value={`${horse?.age} yrs`} />}
                      {!!horse?.colour && <InfoRow label="Colour:" value={horse?.colour} />}
                      <InfoRow label="Stall Size:" value={horse?.requestedStallSize || 'Box'} />
                    </View>

                    {/* HORSE PHOTO PREVIEW */}
                    <View style={styles.photoContainer}>
                      <AppText style={styles.subFieldLabel}>Horse Photo</AppText>
                      {photoUri ? (
                        <View style={styles.photoPreviewCard}>
                          <Image
                            source={{ uri: photoUri }}
                            style={styles.horseImagePreview}
                            resizeMode="contain"
                          />
                          <View style={styles.photoOverlayBadge}>
                            <CheckCircle2 size={12} color={COLORS.white} />
                            <AppText style={styles.photoOverlayText}>Photo Attached</AppText>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.noPhotoBox}>
                          <ImageIcon size={20} color={COLORS.grey400} />
                          <AppText style={styles.noPhotoText}>No photo attached</AppText>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* SECTION 3: UPLOADED DOCUMENTS & MEDIA CARD */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardHeaderToggle}
            onPress={() => setIsDocsExpanded(!isDocsExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeaderLeft}>
              <View style={styles.iconCircle}>
                <Paperclip size={16} color={COLORS.primary} />
              </View>
              <AppText style={styles.cardTitle}>ATTACHED DOCUMENTS</AppText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                style={styles.miniEditBtn}
                onPress={() => onEditSection(3)}
                activeOpacity={0.8}
              >
                <Upload size={13} color={COLORS.primary} />
                <AppText style={styles.miniEditText}>Upload / Edit</AppText>
              </TouchableOpacity>
              {isDocsExpanded ? (
                <ChevronUp size={18} color={COLORS.grey600} />
              ) : (
                <ChevronDown size={18} color={COLORS.grey600} />
              )}
            </View>
          </TouchableOpacity>

          {isDocsExpanded && (
            <View style={styles.accordionContent}>
              <AppText style={styles.docsSectionSub}>
                Verify health documents and paperwork attached for transit.
              </AppText>

              {form.horses.map((horse: NewShipmentHorse, index: number) => {
                const cogginsName = getDocName(horse?.coggins, 'Coggins_Test.pdf');
                const healthCertName = getDocName(horse?.healthCert, 'Health_Certificate.pdf');

                return (
                  <View key={index} style={styles.horseDocsCard}>
                    <View style={styles.horseDocHeader}>
                      <AppText style={styles.horseDocHeaderText}>
                        {horse?.registeredName || `Horse ${index + 1}`} Documents
                      </AppText>
                    </View>

                    {/* COGGINS TEST ROW */}
                    <View style={styles.docRow}>
                      <View style={[styles.docIconBox, horse?.coggins ? styles.docIconBoxSuccess : styles.docIconBoxMuted]}>
                        {horse?.coggins ? (
                          <FileCheck size={18} color={COLORS.greenSuccess} />
                        ) : (
                          <FileText size={18} color={COLORS.grey400} />
                        )}
                      </View>

                      <View style={styles.docTextGroup}>
                        <AppText style={styles.docTitleText}>Coggins Test</AppText>
                        <AppText style={styles.docFileName} numberOfLines={1}>
                          {cogginsName || 'Not uploaded yet'}
                        </AppText>
                      </View>

                      {horse?.coggins ? (
                        <View style={styles.uploadedBadge}>
                          <CheckCircle2 size={12} color={COLORS.greenSuccess} />
                          <AppText style={styles.uploadedBadgeText}>Attached</AppText>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.uploadQuickBtn}
                          onPress={() => onEditSection(3)}
                        >
                          <AppText style={styles.uploadQuickText}>+ Upload</AppText>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* HEALTH CERTIFICATE ROW */}
                    <View style={styles.docRow}>
                      <View style={[styles.docIconBox, horse?.healthCert ? styles.docIconBoxSuccess : styles.docIconBoxMuted]}>
                        {horse?.healthCert ? (
                          <FileCheck size={18} color={COLORS.greenSuccess} />
                        ) : (
                          <FileText size={18} color={COLORS.grey400} />
                        )}
                      </View>

                      <View style={styles.docTextGroup}>
                        <AppText style={styles.docTitleText}>Health Certificate</AppText>
                        <AppText style={styles.docFileName} numberOfLines={1}>
                          {healthCertName || 'Not uploaded yet'}
                        </AppText>
                      </View>

                      {horse?.healthCert ? (
                        <View style={styles.uploadedBadge}>
                          <CheckCircle2 size={12} color={COLORS.greenSuccess} />
                          <AppText style={styles.uploadedBadgeText}>Attached</AppText>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.uploadQuickBtn}
                          onPress={() => onEditSection(3)}
                        >
                          <AppText style={styles.uploadQuickText}>+ Upload</AppText>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* OTHER DOCUMENTS ROW */}
                    <View style={styles.docRow}>
                      <View style={[styles.docIconBox, horse?.otherDocuments ? styles.docIconBoxSuccess : styles.docIconBoxMuted]}>
                        {horse?.otherDocuments ? (
                          <FileCheck size={18} color={COLORS.greenSuccess} />
                        ) : (
                          <FileText size={18} color={COLORS.grey400} />
                        )}
                      </View>

                      <View style={styles.docTextGroup}>
                        <AppText style={styles.docTitleText}>Other Documents</AppText>
                        <AppText style={styles.docFileName} numberOfLines={1}>
                          {getDocName(horse?.otherDocuments, 'Other_Document.pdf') || 'Not uploaded yet'}
                        </AppText>
                      </View>

                      {horse?.otherDocuments ? (
                        <View style={styles.uploadedBadge}>
                          <CheckCircle2 size={12} color={COLORS.greenSuccess} />
                          <AppText style={styles.uploadedBadgeText}>Attached</AppText>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.uploadQuickBtn}
                          onPress={() => onEditSection(3)}
                        >
                          <AppText style={styles.uploadQuickText}>+ Upload</AppText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* SECTION 4: NOTES & SPECIAL REQUIREMENTS CARD */}
        {(Boolean(form.additionalInfo) || Boolean(form.hasSpecialRequirement) || Boolean(form.recipientEmail)) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.iconCircle}>
                  <Info size={16} color={COLORS.primary} />
                </View>
                <AppText style={styles.cardTitle}>NOTES & SPECIAL INSTRUCTIONS</AppText>
              </View>
            </View>

            {form.hasSpecialRequirement && (
              <View style={styles.notesBlock}>
                <AppText style={styles.notesLabel}>Special Requirements:</AppText>
                <AppText style={styles.notesValue}>
                  {form.specialRequirementDetails || 'None details provided.'}
                </AppText>
              </View>
            )}

            {Boolean(form.additionalInfo) && (
              <View style={styles.notesBlock}>
                <AppText style={styles.notesLabel}>General Shipment Notes:</AppText>
                <AppText style={styles.notesValue}>{form.additionalInfo}</AppText>
              </View>
            )}

            {Boolean(form.recipientEmail) && (
              <View style={styles.notesBlock}>
                <AppText style={styles.notesLabel}>Share Tracking Recipient Email:</AppText>
                <AppText style={styles.notesValue}>{form.recipientEmail}</AppText>
              </View>
            )}
          </View>
        )}

        {/* FOOTER ACTION BUTTONS */}
        <View style={styles.footer}>
          {!isEdit && (
            <TouchableOpacity
              disabled={loading}
              style={styles.draftBtn}
              onPress={onSaveDraft}
              activeOpacity={0.85}
            >
              {draftLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <>
                  <Bookmark size={18} color={COLORS.grey700} style={{ marginRight: 6 }} />
                  <AppText style={styles.draftBtnText}>Save Draft</AppText>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            disabled={loading}
            style={[styles.publishBtn, isEdit && { flex: 1 }]}
            onPress={onPublish}
            activeOpacity={0.85}
          >
            {publishLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <AppText style={styles.publishBtnText}>
                  {isEdit ? 'Update Shipment Metadata' : 'Save & Publish'}
                </AppText>
                <ArrowRight size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReviewStep;
