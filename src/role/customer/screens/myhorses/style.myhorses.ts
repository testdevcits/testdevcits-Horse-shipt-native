import { StyleSheet } from "react-native";
import { COLORS, SPACING, FONTS, FONT_SIZE, RADIUS } from "../../../../constants";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    listContent: { padding: SPACING.md, paddingBottom: 100 },
    headerWrap: { marginBottom: SPACING.sm },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
        marginBottom: SPACING.sm,
        lineHeight: 16,
    },
    addBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.xs + 2,
        paddingHorizontal: SPACING.lg,
        alignSelf: 'flex-start',
        borderRadius: RADIUS.sm,
        marginBottom: SPACING.sm,
    },
    addBtnText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.sm,
    },
});
export default styles