// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { COLORS, FONTS, FONT_SIZE, ICON_SIZE, SPACING } from '../../constants';
// import AppText from './AppText';

// export const EmptyState = ({ title, message, icon: Icon }: any) => (
//   <View style={styles.container}>
//     {Icon && (
//       <Icon
//         size={ICON_SIZE.xl || 32}
//         color={COLORS.lightGrey || COLORS.grey300}
//         strokeWidth={1.5}
//       />
//     )}
//     <AppText style={styles.title}>{title}</AppText>
//     {message ? <AppText style={styles.message}>{message}</AppText> : null}
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SPACING.xl,
//   },
//   title: {
//     fontFamily: FONTS.bold,
//     fontSize: FONT_SIZE.md,
//     color: COLORS.textPrimary,
//     marginTop: SPACING.sm,
//     textAlign: 'center',
//   },
//   message: {
//     textAlign: 'center',
//     color: COLORS.textSecondary,
//     fontSize: FONT_SIZE.xs,
//     fontFamily: FONTS.regular,
//     marginTop: SPACING.xs,
//     lineHeight: 16,
//   },
// });

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZE, ICON_SIZE, SPACING } from '../../constants';
import AppText from './AppText';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ElementType | React.ReactNode;
}

export const EmptyState = ({ title, message, icon }: EmptyStateProps) => {
  const renderIcon = () => {
    if (!icon) return null;

    // Full JSX element
    if (React.isValidElement(icon)) {
      return icon;
    }

    // Icon component
    const Icon = icon as React.ElementType;

    return (
      <Icon
        size={ICON_SIZE.xl || 32}
        color={COLORS.lightGrey || COLORS.grey300}
        strokeWidth={1.5}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderIcon()}

      <AppText style={styles.title}>{title}</AppText>

      {message ? <AppText style={styles.message}>{message}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontFamily: FONTS.regular,
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
});
