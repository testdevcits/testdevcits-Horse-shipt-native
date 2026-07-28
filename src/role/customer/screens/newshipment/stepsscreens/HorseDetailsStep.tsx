import React, { useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Info, PlusCircle } from 'lucide-react-native';
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
  errors:any
}

const HorseDetailsStep: React.FC<HorseDetailsStepProps> = ({
  form,
  updateForm,
  onNext,
  onPrevious,
  errors
}) => {
  const { horses: savedHorses, loading } = useMyHorses();

  // 1. SYNC HORSES ARRAY BASED ON NUMBER
  const handleNumberOfHorsesChange = (val: string) => {
    const num = parseInt(val) || 0;
    if (num > 10) return; // Safety limit

    let updatedHorses = [...form.horses];

    if (num > updatedHorses.length) {
      // Add new empty horse objects
      const diff = num - updatedHorses.length;
      for (let i = 0; i < diff; i++) {
        updatedHorses.push({
          registeredName: '',
          barnName: '',
          breed: '',
          colour: '',
          age: '',
          sex: '',
          height: '',
          stallType: '',
        });
      }
    } else {
      // Remove last horses if number decreased
      updatedHorses = updatedHorses.slice(0, num);
    }

    updateForm({ numberOfHorses: num, horses: updatedHorses });
  };

  // 2. UPDATING SPECIFIC HORSE FIELDS
  const updateHorseField = (index: number, field: string, value: any) => {
    const updatedHorses = [...form.horses];
    updatedHorses[index] = { ...updatedHorses[index], [field]: value };
    updateForm({ horses: updatedHorses });
  };

  // 3. AUTO-FILL LOGIC FOR SAVED HORSES
  const horseOptions = useMemo(() => {
    return savedHorses.map((h: Horse) => h.registeredName);
  }, [savedHorses]);

  const handleHorseSelect = (index: number, selectedName: string) => {
    const selectedHorse = savedHorses.find(
      (h: Horse) => h.registeredName === selectedName,
    );

    if (selectedHorse) {
      const updatedHorses = [...form.horses];
      updatedHorses[index] = {
        registeredName: selectedHorse.registeredName,
        barnName: selectedHorse.barnName || '',
        breed: selectedHorse.breed || '',
        colour: selectedHorse.colour || '',
        age: selectedHorse.age?.toString() || '',
        sex: selectedHorse.sex || '',
        height: selectedHorse.height || '',
        stallType: selectedHorse.requestedStallSize || '',
      };
      updateForm({ horses: updatedHorses });
    } else {
      updateHorseField(index, 'registeredName', selectedName);
    }
  };

  // 4. VALIDATION LOGIC
  const isFormValid = useMemo(() => {
    if (!form.numberOfHorses || form.numberOfHorses < 1) return false;

    // Check if every horse in the array has required fields
    return form.horses.every(
      (h: any) =>
        h.registeredName?.trim() !== '' &&
        h.breed !== '' &&
        h.sex !== '' &&
        h.stallType !== '',
    );
  }, [form.horses, form.numberOfHorses]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleRow}>
          <AppText style={styles.mainTitle}>New Shipment</AppText>
          <TouchableOpacity onPress={onPrevious}>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </TouchableOpacity>
        </View>

        {/* CONDITION: IF CUSTOMER HAS NO SAVED HORSES */}
        {!loading && savedHorses.length === 0 && (
          <View style={styles.noHorsesAlert}>
            <PlusCircle size={20} color={COLORS.primary} />
            <AppText style={styles.noHorsesText}>
              You don't have any saved horses. Enter details manually below.
            </AppText>
          </View>
        )}

        <Input
          label="Total Number of Horses"
          placeholder="e.g. 3"
          keyboardType="numeric"
          value={form.numberOfHorses?.toString()}
          onChangeText={handleNumberOfHorsesChange}
        />

        {/* 5. DYNAMICALLY MAP HORSES */}
        {form.horses.map((horse: any, index: number) => (
          <View key={index} style={styles.horseSection}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <AppText style={styles.sectionLabel}>HORSE {index + 1}</AppText>
              <View style={styles.line} />
            </View>

            <AppSelect
              label="Registered Name"
              placeholder={
                loading ? 'Loading...' : 'Select saved horse or type'
              }
              value={horse.registeredName}
              options={horseOptions}
              onSelect={val => handleHorseSelect(index, val)}
              searchable
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Barn Name"
                  placeholder="e.g. Thunder"
                  value={horse.barnName}
                  onChangeText={v => updateHorseField(index, 'barnName', v)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <AppSelect
                  label="Sex"
                  placeholder="Select"
                  value={horse.sex}
                  options={sexes}
                  onSelect={v => updateHorseField(index, 'sex', v)}
                />
              </View>
            </View>

            <AppSelect
              label="Breed"
              placeholder="Select breed"
              value={horse.breed}
              options={breedsList}
              onSelect={v => updateHorseField(index, 'breed', v)}
              searchable
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Age"
                  placeholder="Age"
                  keyboardType="numeric"
                  value={horse.age}
                  onChangeText={v => updateHorseField(index, 'age', v)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Input
                  label="Colour"
                  placeholder="e.g. Bay"
                  value={horse.colour}
                  onChangeText={v => updateHorseField(index, 'colour', v)}
                />
              </View>
            </View>

            <AppSelect
              label="Request Stall Size"
              placeholder="Select Stall"
              value={horse.stallType}
              options={stallTypes}
              onSelect={v => updateHorseField(index, 'stallType', v)}
            />
          </View>
        ))}

        {/* SPECIAL REQUIREMENTS (Global for the shipment) */}
        {form.horses.length > 0 && (
          <>
            <AppText style={styles.radioLabel}>
              Does this shipment have special requirements?
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
                  {form.hasSpecialRequirement && (
                    <View style={styles.radioInner} />
                  )}
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
                label="Details"
                placeholder="Describe medication, behavior, etc."
                multiline
                value={form.specialRequirementDetails}
                onChangeText={v => updateForm({ specialRequirementDetails: v })}
                style={{ height: 80 }}
              />
            )}
          </>
        )}

        {/* FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.prevButton} onPress={onPrevious}>
            <AppText style={styles.prevButtonText}>Previous</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, !isFormValid && styles.disabledButton]}
            onPress={() =>
              isFormValid
                ? onNext()
                : Alert.alert(
                    'Missing Info',
                    'Please complete all horse details.',
                  )
            }
          >
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
  noHorsesAlert: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldLightBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 10,
  },
  noHorsesText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  horseSection: {
    marginBottom: SPACING.xl,
    backgroundColor: '#FBFAf8', // Light tint to distinguish horses
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  line: { flex: 1, height: 1, backgroundColor: COLORS.grey300 },
  sectionLabel: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey500,
    marginHorizontal: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  radioLabel: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.grey700,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  radioGroup: { flexDirection: 'row', gap: 30, marginBottom: SPACING.md },
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
  disabledButton: { backgroundColor: COLORS.grey300 },
  nextButtonText: { fontFamily: FONTS.bold, color: COLORS.white },
});

export default HorseDetailsStep;
