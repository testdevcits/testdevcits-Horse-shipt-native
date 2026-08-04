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

interface ReviewStepProps {
  form: NewShipmentForm;
  onPublish: () => void;
  onSaveDraft: () => void;
  onEditSection: (stepIndex: number) => void;
  loading?: boolean;
  draftLoading?: boolean;
  publishLoading?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  onPublish,
  onSaveDraft,
  onEditSection,
  loading = false,
  draftLoading = false,
  publishLoading = false,
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
              <AppText style={styles.statusBadgeText}>Ready to Publish</AppText>
            </View>
          </View>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconBox}>
              <ShieldCheck size={22} color={COLORS.primary} />
            </View>
            <View style={styles.headerTextGroup}>
              <AppText style={styles.headerTitle}>Review & Confirm</AppText>
              <AppText style={styles.headerSubtitle}>
                Review your route, horse details, and attached documents before publishing.
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
                const photoUri = getDocUri(horse.photo);
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
                        {horse.registeredName || 'Unnamed Horse'}
                      </AppText>
                    </View>

                    <View style={styles.infoGrid}>
                      <InfoRow label="Registered Name:" value={horse.registeredName} />
                      {!!horse.barnName && <InfoRow label="Barn Name:" value={horse.barnName} />}
                      <InfoRow label="Breed:" value={horse.breed} />
                      <InfoRow label="Sex:" value={horse.sex} />
                      {!!horse.age && <InfoRow label="Age:" value={`${horse.age} yrs`} />}
                      {!!horse.colour && <InfoRow label="Colour:" value={horse.colour} />}
                      <InfoRow label="Stall Size:" value={horse.requestedStallSize || 'Box'} />
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

        {/* SECTION 3: UPLOADED DOCUMENTS & MEDIA CARD (NEW) */}
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
                const cogginsName = getDocName(horse.coggins, 'Coggins_Test.pdf');
                const healthCertName = getDocName(horse.healthCert, 'Health_Certificate.pdf');

                return (
                  <View key={index} style={styles.horseDocsCard}>
                    <View style={styles.horseDocHeader}>
                      <AppText style={styles.horseDocHeaderText}>
                        {horse.registeredName || `Horse ${index + 1}`} Documents
                      </AppText>
                    </View>

                    {/* COGGINS TEST ROW */}
                    <View style={styles.docRow}>
                      <View style={[styles.docIconBox, horse.coggins ? styles.docIconBoxSuccess : styles.docIconBoxMuted]}>
                        {horse.coggins ? (
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

                      {horse.coggins ? (
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
                      <View style={[styles.docIconBox, horse.healthCert ? styles.docIconBoxSuccess : styles.docIconBoxMuted]}>
                        {horse.healthCert ? (
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

                      {horse.healthCert ? (
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
                      <View style={[styles.docIconBox, horse.otherDocuments ? styles.docIconBoxSuccess : styles.docIconBoxMuted]}>
                        {horse.otherDocuments ? (
                          <FileCheck size={18} color={COLORS.greenSuccess} />
                        ) : (
                          <FileText size={18} color={COLORS.grey400} />
                        )}
                      </View>

                      <View style={styles.docTextGroup}>
                        <AppText style={styles.docTitleText}>Other Documents</AppText>
                        <AppText style={styles.docFileName} numberOfLines={1}>
                          {getDocName(horse.otherDocuments, 'Other_Document.pdf') || 'Not uploaded yet'}
                        </AppText>
                      </View>

                      {horse.otherDocuments ? (
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

          <TouchableOpacity
            disabled={loading}
            style={styles.publishBtn}
            onPress={onPublish}
            activeOpacity={0.85}
          >
            {publishLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <AppText style={styles.publishBtnText}>Save & Publish</AppText>
                <ArrowRight size={18} color={COLORS.white} style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },

  /* STEP HEADER CARD */
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  stepChip: {
    backgroundColor: COLORS.goldLightBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  stepChipText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.greenSuccess,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTextGroup: { flex: 1 },
  headerTitle: {
    fontSize: 19,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },

  /* SUMMARY BANNER */
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    marginBottom: SPACING.lg,
  },
  bannerLeft: { flex: 1 },
  bannerTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.goldDarkText,
  },
  bannerSub: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bannerBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  /* CARDS GENERAL */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardHeaderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: 0.6,
  },
  miniEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldLightBg,
  },
  miniEditText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.primary,
  },

  /* ROUTE TIMELINE */
  routeTimeline: {
    marginTop: SPACING.xs,
  },
  routeNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pickupDotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.goldLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  pickupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  deliveryDotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.greenLightBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginTop: 2,
  },
  deliveryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.greenActive,
  },
  routeLineContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
  },
  routeLine: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.grey200,
  },
  routeTextContent: {
    flex: 1,
    paddingBottom: SPACING.sm,
  },
  routeNodeLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.grey500,
    letterSpacing: 0.5,
  },
  routeAddressText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  routeDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  routeDateText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },

  /* ACCORDION & HORSE CONTENT */
  accordionContent: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  horseSectionBox: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
  },
  horseBoxBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  horseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  horseTag: {
    backgroundColor: COLORS.grey100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  horseTagText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.grey700,
  },
  horseNameTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  /* INFO GRID */
  infoGrid: {
    gap: 4,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  subFieldLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
    marginBottom: 6,
    marginTop: 4,
  },

  /* PHOTO PREVIEW */
  photoContainer: {
    marginTop: SPACING.xs,
  },
  photoPreviewCard: {
    height: 220,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.grey100,
  },
  horseImagePreview: {
    width: '100%',
    height: '100%',
  },
  photoOverlayBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  photoOverlayText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  noPhotoBox: {
    height: 60,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  noPhotoText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.grey500,
  },

  /* DOCUMENTS SECTION */
  docsSectionSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  horseDocsCard: {
    backgroundColor: COLORS.grey50,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.grey200,
    marginBottom: SPACING.md,
  },
  horseDocHeader: {
    marginBottom: SPACING.sm,
  },
  horseDocHeaderText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  docIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIconBoxSuccess: {
    backgroundColor: COLORS.greenLightBg,
  },
  docIconBoxMuted: {
    backgroundColor: COLORS.grey100,
  },
  docTextGroup: {
    flex: 1,
  },
  docTitleText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  docFileName: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  uploadedBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.greenSuccess,
  },
  uploadQuickBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },
  uploadQuickText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  /* NOTES SECTION */
  notesBlock: {
    marginBottom: SPACING.sm,
  },
  notesLabel: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.grey700,
    marginBottom: 2,
  },
  notesValue: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  /* FOOTER */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  draftBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBtnText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
  },
  publishBtn: {
    flex: 1.5,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  publishBtnText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
});

export default ReviewStep;

