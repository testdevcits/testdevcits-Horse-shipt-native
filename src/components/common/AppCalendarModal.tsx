import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { X } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING, FONT_SIZE } from '../../constants'; // Adjust paths
import AppText from './AppText';
 
interface AppCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  title?: string;
  initialDate?: string; // YYYY-MM-DD
  minDate?: string;     // YYYY-MM-DD
}

const AppCalendarModal = memo(({
  visible,
  onClose,
  onSelect,
  title = "Select Date",
  initialDate,
  minDate = new Date().toISOString().split('T')[0], // Default to today
}: AppCalendarModalProps) => {

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" // Fade is smoother for overlays
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.calendarCard}>
              
              {/* Header */}
              <View style={styles.modalHeader}>
                <AppText style={styles.modalTitle}>{title}</AppText>
                <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <X size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Calendar Component */}
              <Calendar
                current={initialDate}
                minDate={minDate}
                onDayPress={(day: any) => {
                  if (day?.dateString) {
                    const [year, month, dayNum] = day.dateString.split('-').map(Number);
                    onSelect(new Date(year, month - 1, dayNum, 0, 0, 0, 0));
                  } else {
                    onSelect(new Date(day.timestamp));
                  }
                }}
                theme={{
                  backgroundColor: COLORS.white,
                  calendarBackground: COLORS.white,
                  textSectionTitleColor: COLORS.textSecondary,
                  selectedDayBackgroundColor: COLORS.primary,
                  selectedDayTextColor: COLORS.white,
                  todayTextColor: COLORS.primary,
                  dayTextColor: COLORS.textPrimary,
                  textDisabledColor: COLORS.grey300,
                  dotColor: COLORS.primary,
                  arrowColor: COLORS.primary,
                  monthTextColor: COLORS.textPrimary,
                  indicatorColor: COLORS.primary,
                  textDayFontFamily: FONTS.medium,
                  textMonthFontFamily: FONTS.bold,
                  textDayHeaderFontFamily: FONTS.semiBold,
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  calendarCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    // Professional Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
});

export default AppCalendarModal;