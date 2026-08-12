import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from "../../../constants";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.xxl,
        paddingBottom: SPACING.xxxl,
    },
    header: {
        marginTop: SPACING.xxxl,
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZE.heading,
        fontFamily: FONTS.bold,
        color: COLORS.grey900,
    },
    loginRow: {
        flexDirection: 'row',
        marginTop: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.textSecondary,
    },
    loginLink: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.semiBold,
        color: COLORS.primary,
    },
    form: {
        marginTop: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        marginTop: SPACING.sm,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    roleCard: {
        flex: 0.48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.grey200,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white,
        gap: SPACING.sm,
    },
    activeRoleCard: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.goldLightBg,
        borderWidth: 1.5,
    },
    roleText: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.grey500,
    },
    activeRoleText: {
        color: COLORS.primary,
        fontFamily: FONTS.bold,
    },
    signupButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: RADIUS.md,
        marginTop: SPACING.sm,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.xxl,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.grey200,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: COLORS.textLight,
        fontSize: FONT_SIZE.sm,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: COLORS.grey200,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.white,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: SPACING.md,
    },
    googleButtonText: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.grey800,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZE.xs,
        marginTop: -SPACING.sm,
        marginBottom: SPACING.md,
    }
});

export default styles