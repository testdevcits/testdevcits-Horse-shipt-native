import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, FONT_SIZE } from '../../constants';
import AppText from './AppText';
 
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const AppHeader = ({ title, showBack, onBack, rightElement }: HeaderProps) => (
  <View style={styles.header}>
    <View style={styles.left}>
      {showBack && (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ChevronLeft color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
      )}
    </View>
    <AppText style={styles.title}>{title}</AppText>
    <View style={styles.right}>{rightElement}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  left: { width: 40 },
  right: { width: 40, alignItems: 'flex-end' },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  backBtn: { padding: 5, marginLeft: -5 },
});

export default AppHeader;