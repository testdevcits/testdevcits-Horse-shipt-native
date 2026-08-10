import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING } from '../../../../../constants';


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 60 },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    mainTitle: {
        fontSize: FONT_SIZE.title,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    cancelText: { color: COLORS.primary, fontFamily: FONTS.medium },

    instructionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    iconBox: {
        width: 45,
        height: 45,
        backgroundColor: COLORS.goldLightBg,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    instructionTextContent: { flex: 1 },
    instructionTitle: {
        fontSize: FONT_SIZE.xl,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    instructionSub: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },

    horseCard: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.divider,
        elevation: 2,
    },
    horseHeader: {
        backgroundColor: COLORS.grey100,
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    horseHeaderText: {
        fontFamily: FONTS.bold,
        color: COLORS.grey700,
        fontSize: FONT_SIZE.md,
        letterSpacing: 0.5,
    },
    cardPadding: { padding: SPACING.md },

    sectionLabel: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.bold,
        color: COLORS.grey800,
        marginBottom: SPACING.xs,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
    },
    requiredStar: {
        fontSize: FONT_SIZE.sm,

        fontFamily: FONTS.medium,
        color: COLORS.error,
    },

    uploadBox: {
        height: 220,
        borderWidth: 1.5,
        borderColor: COLORS.grey300,
        borderStyle: 'dashed',
        borderRadius: RADIUS.md,
        backgroundColor: '#FBFCFE',
        overflow: 'hidden',
    },
    uploadBoxActive: { borderStyle: 'solid', borderColor: COLORS.primary },
    uploadBoxError: { borderStyle: 'solid', borderColor: COLORS.error },
    uploadPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadBtnText: {
        marginTop: 8,
        fontFamily: FONTS.medium,
        color: COLORS.primary,
        fontSize: FONT_SIZE.md,
    },
    helperText: {
        fontSize: FONT_SIZE.sm,
        fontFamily: FONTS.regular,
        color: COLORS.grey500,
        marginTop: SPACING.xs,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: SPACING.xs,
    },
    errorText: {
        fontSize: FONT_SIZE.sm,
        fontFamily: FONTS.medium,
        color: COLORS.error,
    },
    imagePreviewContainer: { flex: 1, width: '100%' },
    uploadedImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    closeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 6,
        borderRadius: 20,
    },

    docCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.divider,
        marginBottom: SPACING.sm,
        backgroundColor: COLORS.white,
    },
    docInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    docIconBox: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.grey100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    docIconBoxSuccess: { backgroundColor: COLORS.greenLightBg },
    docLabel: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.semiBold,
        color: COLORS.textPrimary,
    },
    fileName: {
        fontSize: FONT_SIZE.sm,

        fontFamily: FONTS.regular,
        color: COLORS.greenActive,
        marginTop: 2,
    },
    fileStatus: {
        fontSize: FONT_SIZE.sm,

        fontFamily: FONTS.regular,
        color: COLORS.grey400,
        marginTop: 2,
    },
    miniUploadBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
    },
    miniUploadText: {
        fontSize: FONT_SIZE.sm,
        fontFamily: FONTS.bold, color: COLORS.white
    },
    removeBtn: { padding: 8 },

    notesSection: { marginTop: SPACING.md },
    textArea: {
        // height: 100,
        paddingTop: SPACING.md,
        backgroundColor: COLORS.white,
    },

    shareTrackingCard: {
        backgroundColor: COLORS.goldLightBg,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        borderRadius: RADIUS.sm,
        padding: SPACING.md,
        marginTop: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.goldBorder,
    },
    shareTrackingTitle: {
        fontSize: FONT_SIZE.lg,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    shareTrackingSubtext: {
        fontSize: FONT_SIZE.sm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 6,
        lineHeight: 16,
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
    nextButtonText: { fontFamily: FONTS.bold, color: COLORS.white },
});

export default styles