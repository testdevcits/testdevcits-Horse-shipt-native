import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  MapPin,
  Calendar as CalendarIcon,
  Star,
  Edit3,
  ChevronDown,
  ChevronUp,
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
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  form,
  onPublish,
  onSaveDraft,
  onEditSection,
}) => {
  const navigation = useNavigation();
  const [isHorseExpanded, setIsHorseExpanded] = useState(true);

  const formatDate = (date: any) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Not set';
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <AppText style={styles.infoLabel}>{label}: </AppText>
      <AppText style={styles.infoValue}>{value || 'N/A'}</AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>

        {/* INSTRUCTIONAL CARD */}
        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            <Star size={24} color={COLORS.primary} fill={COLORS.primary} />
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>
              Review your shipment details
            </AppText>
            <AppText style={styles.instructionSub}>
              Review your shipment details before confirming your booking.
            </AppText>
          </View>
        </View>

        {/* TOTAL HORSES BANNER */}
        <View style={styles.banner}>
          <AppText style={styles.bannerText}>
            Total horses : {form?.numberOfHorses || 1}
          </AppText>
        </View>

        {/* PICKUP & DELIVERY CARD */}
        <View style={styles.summaryCard}>
          {/* Pickup Section */}
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Pickup</AppText>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={18} color={COLORS.primary} />
            <AppText style={styles.detailText}>
              {form?.pickupLocation || 'Address Name here'}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <CalendarIcon size={18} color={COLORS.primary} />
            <AppText style={styles.detailText}>
              On {formatDate(form?.pickupStartDate)}
            </AppText>
          </View>

          {/* Delivery Section */}
          <View style={[styles.sectionHeader, { marginTop: SPACING.md }]}>
            <AppText style={styles.sectionTitle}>Delivery</AppText>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={18} color={COLORS.primary} />
            <AppText style={styles.detailText}>
              {form?.deliveryLocation || 'Address Name here'}
            </AppText>
          </View>
          <View style={styles.detailRow}>
            <CalendarIcon size={18} color={COLORS.primary} />
            <AppText style={styles.detailText}>
              before {formatDate(form?.deliveryEndDate)}
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEditSection(0)}
          >
            <Edit3 size={16} color={COLORS.white} />
            <AppText style={styles.editBtnText}>Edit Pickup & Delivery</AppText>
          </TouchableOpacity>
        </View>

        {/* HORSE DETAILS ACCORDION */}
        <TouchableOpacity
          style={styles.accordionHeader}
          onPress={() => setIsHorseExpanded(!isHorseExpanded)}
          activeOpacity={0.9}
        >
          <AppText style={styles.accordionTitle}>Horse Details</AppText>
          {isHorseExpanded ? (
            <ChevronUp size={20} color={COLORS.textPrimary} />
          ) : (
            <ChevronDown size={20} color={COLORS.textPrimary} />
          )}
        </TouchableOpacity>

        {isHorseExpanded && (
          <View style={styles.horseDetailsContainer}>
            {form.horses.map((horse: NewShipmentHorse, index: number) => (
              <View
                key={index}
                style={{
                  marginBottom: 20,
                  borderBottomWidth: index !== form.horses.length - 1 ? 1 : 0,
                  borderBottomColor: COLORS.divider,
                  paddingBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <AppText style={styles.horseSubHeader}>
                    HORSE {index + 1}
                  </AppText>
                  <TouchableOpacity onPress={() => onEditSection(2)}>
                    <AppText
                      style={{
                        fontSize: 12,
                        fontFamily: FONTS.medium,
                        color: COLORS.primary,
                      }}
                    >
                      Edit
                    </AppText>
                  </TouchableOpacity>
                </View>

                <InfoRow
                  label="Registered Name"
                  value={horse.registeredName}
                />
                {!!horse.barnName && (
                  <InfoRow label="Barn Name" value={horse.barnName} />
                )}
                <InfoRow label="Breed" value={horse.breed} />
                <InfoRow label="Sex" value={horse.sex} />
                {!!horse.age && (
                  <InfoRow label="Age" value={`${horse.age} years`} />
                )}
                {!!horse.colour && (
                  <InfoRow label="Colour" value={horse.colour} />
                )}
                <InfoRow
                  label="Stall Size"
                  value={horse.requestedStallSize || 'Box'}
                />

                {horse.photo?.uri && (
                  <Image
                    source={{ uri: horse.photo.uri }}
                    style={styles.horseImagePreview}
                    resizeMode="cover"
                  />
                )}
              </View>
            ))}

            {form.hasSpecialRequirement && (
              <View style={styles.notesContainer}>
                <AppText style={styles.infoLabel}>
                  Special Requirements:{' '}
                </AppText>
                <AppText style={styles.notesText}>
                  {form.specialRequirementDetails || 'None details provided.'}
                </AppText>
              </View>
            )}

            <View style={styles.notesContainer}>
              <AppText style={styles.infoLabel}>
                General Shipment Notes:{' '}
              </AppText>
              <AppText style={styles.notesText}>
                {form.additionalInfo || 'None provided.'}
              </AppText>
            </View>
          </View>
        )}

        {/* FOOTER BUTTONS */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.draftBtn} onPress={onSaveDraft}>
            <AppText style={styles.draftBtnText}>Save as draft</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishBtn} onPress={onPublish}>
            <AppText style={styles.publishBtnText}>Save & Publish</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 60 },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  cancelText: { color: COLORS.primary, fontFamily: FONTS.medium },

  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.goldLightBg,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  instructionTextContent: { flex: 1 },
  instructionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  instructionSub: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  banner: {
    backgroundColor: COLORS.goldLightBg,
    padding: 12,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  bannerText: { fontFamily: FONTS.semiBold, color: COLORS.textPrimary },

  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.lg,
  },
  sectionHeader: { marginBottom: 8 },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  detailText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  editBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    marginTop: 12,
    gap: 8,
  },
  editBtnText: {
    color: COLORS.white,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },

  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.goldLightBg,
    padding: 12,
    borderRadius: RADIUS.sm,
  },
  accordionTitle: { fontFamily: FONTS.bold, color: COLORS.textPrimary },
  horseDetailsContainer: { paddingVertical: SPACING.md },
  horseSubHeader: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.grey500,
    marginBottom: 12,
    letterSpacing: 1,
  },

  infoRow: { flexDirection: 'row', marginBottom: 8 },
  infoLabel: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  infoValue: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  notesContainer: { marginTop: 4, marginBottom: 16 },
  notesText: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  horseImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: RADIUS.md,
    marginTop: 10,
  },

  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xxl,
    paddingBottom: 20,
  },
  draftBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBtnText: { fontFamily: FONTS.bold, color: COLORS.grey600 },
  publishBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishBtnText: { fontFamily: FONTS.bold, color: COLORS.white },
});

export default ReviewStep;
