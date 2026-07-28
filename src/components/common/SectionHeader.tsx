import React, { memo } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { COLORS, FONT_SIZE, FONTS, SPACING } from '../../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import AppText from './AppText';


// 1. Define Props for reusability (The "Conditions")
interface SectionHeaderProps {
    title: string;               // e.g. "My Favorite Shippers"
    onPress?: () => void;        // Action when "View All" is clicked
    rightText?: string;          // Allow changing "View All" text
    showAction?: boolean;        // Condition to show/hide the right side
    containerStyle?: ViewStyle;  // Optional style overrides
}

const SectionHeader = ({
    title,
    onPress,
    rightText = 'View All',
    showAction = true,
    containerStyle,
}: SectionHeaderProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {/* Left Title */}
            <AppText style={styles.titleText}>{title}</AppText>

            {/* Right Action - Rendered based on condition */}
            {showAction && onPress && (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPress}
                    style={styles.actionButton}
                >
                    <AppText style={styles.actionText}>{rightText}</AppText>

                    {/* Simple Chevron Arrow */}
                     
                    <ChevronRight size={ FONT_SIZE.lg} style={styles?.chevron}/>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background, // F8FAFC from your file
    },
    titleText: {
        fontFamily: FONTS.semiBold,
        fontSize: FONT_SIZE.xl, // 20px based on your dimensions
        color: COLORS.grey900,   // Dark text #111827
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontFamily: FONTS.regular,
        fontSize: FONT_SIZE.sm,
        color: COLORS.primary,   // Your Gold color #B69556
    },
    chevron: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZE.heading,
        color: COLORS.primary,
        marginLeft: SPACING.xs,
     },
});

export default memo(SectionHeader);