import { StyleSheet } from "react-native";
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 40 },

    /* STEP HEADER CARD */
    headerCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.divider,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    headerBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    stepChip: {
        backgroundColor: COLORS.goldLightBg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.goldBorder,
    },
    stepChipText: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        color: COLORS.goldDarkText,
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.greenLightBg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
        gap: 4,
    },
    statusBadgeText: {
        fontSize: 11,
        fontFamily: FONTS.semiBold,
        color: COLORS.greenSuccess,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    headerIconBox: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.goldLightBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    headerTextGroup: { flex: 1 },
    headerTitle: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
        lineHeight: 18,
    },

    /* SECTION CARDS */
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.divider,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    cardError: {
        borderColor: COLORS.error,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.goldLightBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
        letterSpacing: 0.6,
    },
    requiredStar: {
        fontSize: 11,
        fontFamily: FONTS.medium,
        color: COLORS.error,
    },
    infoTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.goldLightBg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: RADIUS.sm,
    },
    infoTagText: {
        fontSize: 11,
        fontFamily: FONTS.medium,
        color: COLORS.primary,
    },
    sectionSubtitle: {
        fontSize: 13,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    helperText: {
        fontSize: 12,
        fontFamily: FONTS.regular,
        color: COLORS.textLight,
        marginTop: SPACING.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: SPACING.xs,
    },
    errorText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        color: COLORS.error,
    },

    /* DUAL DATES CONTAINER */
    datesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    dateColumn: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 12,
        fontFamily: FONTS.semiBold,
        color: COLORS.grey700,
        marginBottom: 6,
    },
    dateCard: {
        backgroundColor: COLORS.grey50,
        borderWidth: 1,
        borderColor: COLORS.grey200,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        minHeight: 74,
        justifyContent: 'space-between',
    },
    dateCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.goldLightBg,
    },
    dateCardError: {
        borderColor: COLORS.error,
    },
    dateCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    dateLabelBadge: {
        fontSize: 10,
        fontFamily: FONTS.bold,
        color: COLORS.grey500,
        letterSpacing: 0.5,
    },
    dateValueText: {
        fontSize: 13,
        fontFamily: FONTS.semiBold,
        color: COLORS.textPrimary,
    },
    dateValuePlaceholder: {
        color: COLORS.grey400,
        fontFamily: FONTS.regular,
    },
    dateConnector: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 18,
        width: 20,
    },
    connectorLine: {
        height: 1,
        backgroundColor: COLORS.grey200,
        width: '100%',
    },
    connectorIconBox: {
        paddingVertical: 2,
    },

    /* PRO TIP CARD */
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.goldLightBg,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.goldBorder,
        marginBottom: SPACING.xl,
    },
    tipIconBox: {
        marginRight: SPACING.md,
        marginTop: 2,
    },
    tipTextContent: { flex: 1 },
    tipTitle: {
        fontSize: 13,
        fontFamily: FONTS.bold,
        color: COLORS.goldDarkText,
        marginBottom: 2,
    },
    tipSub: {
        fontSize: 12,
        fontFamily: FONTS.regular,
        color: COLORS.goldDarkText,
        lineHeight: 17,
    },

    /* FOOTER */
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginTop: SPACING.sm,
    },
    secondaryBtn: {
        flex: 1,
        height: 52,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.grey300,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryBtnText: {
        fontSize: 12,
        fontFamily: FONTS.semiBold,
        color: COLORS.grey700,
    },
    primaryBtn: {
        flex: 1.5,
        height: 52,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    primaryBtnText: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
});

export default styles