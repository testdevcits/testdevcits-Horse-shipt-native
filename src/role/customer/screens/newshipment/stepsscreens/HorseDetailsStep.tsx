import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Info } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { AppText, Input, AppSelect } from '../../../../../components';
import useMyHorses from '../../myhorses/usemyhorses';
import { Horse } from '../../../../../types/customer';
import { breedsList, sexes, stallTypes } from '../../addedithorse/constants';

interface HorseDetailsStepProps {
  form: any;
  updateForm: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const HorseDetailsStep: React.FC<HorseDetailsStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
}) => {
  // 1. Initialize the Hook
  const { horses, loading } = useMyHorses();

  // 2. Prepare options for the Select component (Array of strings)
  const horseOptions = useMemo(() => {
    return horses.map((h: Horse) => h.registeredName);
  }, [horses]);

  // 3. Helper to update form fields
  const updateHorseField = (field: string, value: any) => {
    const updatedHorses = [...form.horses];
    updatedHorses[0] = { ...updatedHorses[0], [field]: value };
    updateForm({ horses: updatedHorses });
  };

  // 4. Handle selecting a saved horse (Auto-fill logic)
  const handleHorseSelect = (selectedName: string) => {
    const selectedHorse = horses.find(
      (h: Horse) => h.registeredName === selectedName,
    );

    if (selectedHorse) {
      // Auto-populate the form with the saved horse's data
      const updatedHorses = [...form.horses];
      updatedHorses[0] = {
        ...updatedHorses[0],
        registeredName: selectedHorse.registeredName,
        barnName: selectedHorse.barnName || '',
        breed: selectedHorse.breed || '',
        colour: selectedHorse.colour || '',
        age: selectedHorse.age?.toString() || '',
        sex: selectedHorse.sex || '',
        height: selectedHorse.height || '',
      };
      updateForm({ horses: updatedHorses });
    } else {
      updateHorseField('registeredName', selectedName);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDash} />
          <View style={styles.progressDash} />
          <View style={[styles.progressDash, styles.activeDash]} />
          <View style={styles.progressDash} />
          <View style={styles.progressDash} />
        </View>

        {/* HEADER */}
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={onPrevious}>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>

        {/* INSTRUCTIONAL CARD */}
        <View style={styles.instructionCard}>
          <View style={styles.iconBox}>
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Info size={24} color={COLORS.primary} />
            )}
          </View>
          <View style={styles.instructionTextContent}>
            <AppText style={styles.instructionTitle}>Horse Details</AppText>
            <AppText style={styles.instructionSub}>
              Select a saved horse or enter new details below.
            </AppText>
          </View>
        </View>

        <Input
          label="Number of horses"
          placeholder="1"
          keyboardType="numeric"
          value={form.numberOfHorses?.toString()}
          onChangeText={v => updateForm({ numberOfHorses: v })}
        />

        <AppText style={styles.sectionLabel}>Horse 1</AppText>

        {/* REGISTERED NAME - Now using Hook Data */}
        <AppSelect
          label="Registered Name"
          placeholder={loading ? 'Loading horses...' : 'Select or type name'}
          value={form.horses[0].registeredName}
          options={horseOptions}
          onSelect={handleHorseSelect}
          searchable
        />

        <Input
          label="Barn Name"
          placeholder="e.g. Thunder"
          value={form.horses[0].barnName}
          onChangeText={v => updateHorseField('barnName', v)}
        />

        <AppSelect
          label="Breed"
          placeholder="Select breed"
          value={form.horses[0].breed}
          options={breedsList}
          onSelect={v => updateHorseField('breed', v)}
          searchable
        />

        <Input
          label="Colour"
          placeholder="e.g. Brown"
          value={form.horses[0].colour}
          onChangeText={v => updateHorseField('colour', v)}
        />

        <Input
          label="Age"
          placeholder="e.g. 5"
          keyboardType="numeric"
          value={form.horses[0].age}
          onChangeText={v => updateHorseField('age', v)}
        />

        <AppSelect
          label="Sex"
          placeholder="Select sex"
          value={form.horses[0].sex}
          options={sexes}
          onSelect={v => updateHorseField('sex', v)}
        />

        <Input
          label="Height ( hands )"
          placeholder="e.g. 15.2"
          value={form.horses[0].height}
          onChangeText={v => updateHorseField('height', v)}
        />

        <AppSelect
          label="Request Stall Size"
          placeholder="Select"
          value={form.horses[0].stallType}
          options={stallTypes}
          onSelect={v => updateHorseField('stallType', v)}
        />

        {/* RADIO BUTTONS SECTION */}
        <AppText style={styles.radioLabel}>
          Does your horse have special requirement?
        </AppText>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => updateForm({ hasSpecialRequirement: true })}
          >
            <View
              style={[
                styles.radioOuter,
                form.hasSpecialRequirement && styles.radioOuterActive,
              ]}
            >
              {form.hasSpecialRequirement && <View style={styles.radioInner} />}
            </View>
            <AppText style={styles.radioText}>Yes</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => updateForm({ hasSpecialRequirement: false })}
          >
            <View
              style={[
                styles.radioOuter,
                !form.hasSpecialRequirement && styles.radioOuterActive,
              ]}
            >
              {!form.hasSpecialRequirement && (
                <View style={styles.radioInner} />
              )}
            </View>
            <AppText style={styles.radioText}>No</AppText>
          </TouchableOpacity>
        </View>

        {form.hasSpecialRequirement && (
          <Input
            label="Special Requirement Details"
            placeholder="Please explain (medication, loading issues, etc.)"
            multiline
            numberOfLines={3}
            value={form.specialRequirementDetails}
            onChangeText={v => updateForm({ specialRequirementDetails: v })}
            textAlignVertical="top"
            style={{ height: 100 }}
          />
        )}

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

// ... Styles remain the same as the previous step ...
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
  sectionLabel: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.grey400,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  radioLabel: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  radioGroup: { flexDirection: 'column', gap: 12, marginBottom: SPACING.md },
  radioButton: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.grey300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
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

export default HorseDetailsStep;
