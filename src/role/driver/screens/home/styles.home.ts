// src/screens/home/styles.home.ts
import { StyleSheet } from 'react-native';
import {
  COLORS,
  FONT_SIZE,
  FONTS,
  RADIUS,
  SPACING,
} from '../../../../constants';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.giant,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loaderText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.goldBorder,
    borderRadius: RADIUS.sm,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginTop: SPACING.sm2,
    marginBottom: SPACING.xl,
  },
  emptyContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.sm2,
    marginBottom: SPACING.xl,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm2,
    
  },
  
});

export default styles;
