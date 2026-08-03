import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, FONT_SIZE } from '../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default styles;
