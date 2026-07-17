import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from "../../../../constants";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: SPACING.xxxl,
    },
    // Horizontal scroll area padding
    tabScrollContent: {
        paddingHorizontal: SPACING.lg, // Keeps starting chips aligned perfectly with your cards
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
        gap: SPACING.sm, // Gap between pill-shaped chips
    },
    // Pill-shaped chip container
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.round, // Perfect rounded pill shape
        borderWidth: 1,
        borderColor: COLORS.goldBorder,
        gap: SPACING.xs, // Space between chip label and count badge
    },
    chipActive: {
        backgroundColor: COLORS.goldPrimary,
        borderColor: COLORS.goldPrimary,
    },
    chipText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZE.sm,
        color: COLORS.goldDarkText,
    },
    chipTextActive: {
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
    },
    // Inner numerical count badge inside the chip
    badge: {
        backgroundColor: COLORS.goldLightBg,
        borderRadius: RADIUS.round,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 1,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeActive: {
        backgroundColor: COLORS.white,
    },
    badgeText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.xs,
        color: COLORS.goldPrimary,
    },
    badgeTextActive: {
        color: COLORS.goldPrimary,
    },
    cardSpacing: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.md,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.xxxl,
        gap: SPACING.sm,
    },
    emptyText: {
        fontFamily: FONTS.medium,
        fontSize: FONT_SIZE.md,
        color: COLORS.textSecondary,
    },
});

export default styles