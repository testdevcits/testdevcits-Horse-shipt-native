import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { ImagePlus, FileText, Package } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText, Input } from '../../../../../components';

interface ShipmentInfoStepProps {
  form: any;
  updateForm: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ShipmentInfoStep: React.FC<ShipmentInfoStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
}) => {
  const horseName = form.horses[0]?.registeredName || 'Horse Name';

  // Stubs for upload logic
  const handlePhotoUpload = () => console.log('Pick Photo');
  const handleDocumentUpload = (type: string) => console.log('Pick Doc:', type);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. PROGRESS - Fourth dash active */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDash} />
          <View style={styles.progressDash} />
          <View style={styles.progressDash} />
          <View style={[styles.progressDash, styles.activeDash]} />
          <View style={styles.progressDash} />
        </View>

        {/* 2. HEADER */}
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>

        {/* 3. INSTRUCTIONAL CARD */}
        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            <Package size={24} color={COLORS.primary} />
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>
              Shipment Information
            </AppText>
            <AppText style={styles.instructionSub}>
              Upload photos, documents, and any additional details for your
              shipment.
            </AppText>
          </View>
        </View>

        {/* 4. HORSE BANNER */}
        <View style={styles.horseBanner}>
          <AppText style={styles.horseBannerText}>
            Horse 1 - {horseName}
          </AppText>
        </View>

        {/* 5. PHOTO UPLOAD SECTION */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>
            Upload a photo of the horse
          </AppText>
          <AppText style={styles.sectionSub}>
            A picture enhances your listing, making it more appealing and
            increasing likelihood of attracting carriers.
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.uploadBox}
          onPress={handlePhotoUpload}
          activeOpacity={0.7}
        >
          {form.horses[0]?.photo ? (
            <Image
              source={{ uri: form.horses[0].photo }}
              style={styles.uploadedImage}
            />
          ) : (
            <ImagePlus size={32} color={COLORS.grey400} />
          )}
        </TouchableOpacity>

        {/* 6. DOCUMENTS SECTION */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Documents</AppText>
          <AppText style={styles.sectionSub}>
            Provide the required paperwork to facilitate a smooth and safe
            delivery process.
          </AppText>
        </View>

        <View style={styles.docRow}>
          <AppText style={styles.docLabel}>Coggins</AppText>
          <TouchableOpacity
            style={styles.miniUploadBtn}
            onPress={() => handleDocumentUpload('coggins')}
          >
            <AppText style={styles.miniUploadText}>Upload</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.docRow}>
          <AppText style={styles.docLabel}>Health certificate</AppText>
          <TouchableOpacity
            style={styles.miniUploadBtn}
            onPress={() => handleDocumentUpload('health')}
          >
            <AppText style={styles.miniUploadText}>Upload</AppText>
          </TouchableOpacity>
        </View>

        {/* 7. GENERAL INFORMATION */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>General Information</AppText>
          <AppText style={styles.sectionSub}>
            Describe any specific preferences or restrictions you may have for
            the shipment.
          </AppText>
        </View>

        <Input
          placeholder="Type here"
          multiline
          numberOfLines={5}
          value={form.generalNotes}
          onChangeText={v => updateForm({ generalNotes: v })}
          style={styles.textArea}
          textAlignVertical="top"
        />

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <AppText style={styles.prevButtonText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <AppText style={styles.nextButtonText}>Next</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollView: { flex: 1 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 100 },

  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.xl,
    marginTop: 10,
  },
  progressDash: {
    flex: 1,
    height: 3,
    backgroundColor: COLORS.grey300,
    borderRadius: 2,
  },
  activeDash: { backgroundColor: COLORS.primary },

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
    marginTop: 2,
  },

  horseBanner: {
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.lg,
  },
  horseBannerText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  sectionHeader: { marginBottom: SPACING.md, marginTop: SPACING.sm },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.grey500,
    marginTop: 4,
    lineHeight: 17,
  },

  // Upload Area
  uploadBox: {
    height: 120,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderStyle: 'dashed', // Replicates the visual in image
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
    marginBottom: SPACING.xl,
  },
  uploadedImage: { width: '100%', height: '100%', borderRadius: RADIUS.md },

  // Document Rows
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  docLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  miniUploadBtn: {
    backgroundColor: COLORS.grey100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  miniUploadText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
  },

  textArea: {
    height: 120,
    paddingTop: SPACING.md,
  },

  footer: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  prevButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grey50,
  },
  prevButtonText: { fontFamily: FONTS.bold, color: COLORS.grey600 },
  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: { fontFamily: FONTS.bold, color: COLORS.white },
});

export default ShipmentInfoStep;
