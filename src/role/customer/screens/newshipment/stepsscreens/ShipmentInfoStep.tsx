import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  ImagePlus,
  FileText,
  Package,
  X,
  Trash2,
  FileCheck,
} from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText, Input } from '../../../../../components';
import { NewShipmentForm, NewShipmentHorse } from '../interfaces';

interface ShipmentInfoStepProps {
  form: NewShipmentForm;
  updateForm: (updates: Partial<NewShipmentForm>) => void;
  onNext: () => void;
  onPrevious: () => void;
  pickDocument: (index: number, type: 'coggins' | 'healthCert') => void;
  pickImage: (index: number) => void;
  removeFile: (
    index: number,
    type: 'photo' | 'coggins' | 'healthCert',
  ) => void;
}

const ShipmentInfoStep: React.FC<ShipmentInfoStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
  pickDocument,
  pickImage,
  removeFile,
}) => {
  const renderDocumentRow = (
    horseIndex: number,
    type: 'coggins' | 'healthCert',
    label: string,
  ) => {
    const file = form.horses[horseIndex]?.[type];

    return (
      <View style={styles.docCard}>
        <View style={styles.docInfo}>
          <View style={[styles.docIconBox, file && styles.docIconBoxSuccess]}>
            {file ? (
              <FileCheck size={20} color={COLORS.greenActive} />
            ) : (
              <FileText size={20} color={COLORS.grey400} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={styles.docLabel}>{label}</AppText>
            {file ? (
              <AppText style={styles.fileName} numberOfLines={1}>
                {file.name}
              </AppText>
            ) : (
              <AppText style={styles.fileStatus}>No file selected</AppText>
            )}
          </View>
        </View>

        {file ? (
          <TouchableOpacity
            onPress={() => removeFile(horseIndex, type)}
            style={styles.removeBtn}
          >
            <Trash2 size={18} color={COLORS.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.miniUploadBtn}
            onPress={() => pickDocument(horseIndex, type)}
          >
            <AppText style={styles.miniUploadText}>Upload</AppText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={onPrevious}>
            <AppText style={styles.cancelText}>Back</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            <Package size={24} color={COLORS.primary} />
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>Documentation</AppText>
            <AppText style={styles.instructionSub}>
              Upload photos and health papers for each horse in this shipment.
            </AppText>
          </View>
        </View>

        {/* HORSES DOCUMENTATION */}
        {form.horses.map((horse: NewShipmentHorse, index: number) => (
          <View key={index} style={styles.horseCard}>
            <View style={styles.horseHeader}>
              <AppText style={styles.horseHeaderText}>
                HORSE {index + 1}: {horse.registeredName || 'Unnamed Horse'}
              </AppText>
            </View>

            <View style={styles.cardPadding}>
              {/* PHOTO UPLOAD */}
              <AppText style={styles.sectionLabel}>Horse Photo</AppText>
              <TouchableOpacity
                style={[
                  styles.uploadBox,
                  horse?.photo && styles.uploadBoxActive,
                ]}
                onPress={() => pickImage(index)}
              >
                {horse?.photo ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: horse?.photo?.uri }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.closeImageBtn}
                      onPress={() => removeFile(index, 'photo')}
                    >
                      <X size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <ImagePlus size={32} color={COLORS.primary} />
                    <AppText style={styles.uploadBtnText}>Add Photo</AppText>
                  </View>
                )}
              </TouchableOpacity>

              {/* DOCUMENTS */}
              <AppText style={[styles.sectionLabel, { marginTop: SPACING.md }]}>
                Required Documents
              </AppText>
              {renderDocumentRow(index, 'coggins', 'Coggins Test')}
              {renderDocumentRow(index, 'healthCert', 'Health Certificate')}
            </View>
          </View>
        ))}

        {/* GENERAL NOTES */}
        <View style={styles.notesSection}>
          <AppText style={styles.sectionLabel}>
            Additional Shipment Notes
          </AppText>
          <Input
            placeholder="Example: My horse needs hay every 4 hours..."
            multiline
            numberOfLines={4}
            value={form.additionalInfo}
            onChangeText={v => updateForm({ additionalInfo: v })}
            style={styles.textArea}
            textAlignVertical="top"
          />
        </View>

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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
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
    width: 45,
    height: 45,
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

  horseCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
    elevation: 2,
  },
  horseHeader: {
    backgroundColor: COLORS.grey100,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  horseHeaderText: {
    fontFamily: FONTS.bold,
    color: COLORS.grey700,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  cardPadding: { padding: SPACING.md },

  sectionLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    marginBottom: SPACING.sm,
  },

  uploadBox: {
    height: 160,
    borderWidth: 1.5,
    borderColor: COLORS.grey300,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    backgroundColor: '#FBFCFE',
    overflow: 'hidden',
  },
  uploadBoxActive: { borderStyle: 'solid', borderColor: COLORS.primary },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtnText: {
    marginTop: 8,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    fontSize: 14,
  },
  imagePreviewContainer: { flex: 1, width: '100%' },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  closeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },

  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  docInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docIconBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.grey100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  docIconBoxSuccess: { backgroundColor: COLORS.greenLightBg },
  docLabel: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  fileName: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.greenActive,
    marginTop: 2,
  },
  fileStatus: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.grey400,
    marginTop: 2,
  },
  miniUploadBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
  },
  miniUploadText: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.white },
  removeBtn: { padding: 8 },

  notesSection: { marginTop: SPACING.md },
  textArea: {
    height: 100,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.white,
  },

  footer: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
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
