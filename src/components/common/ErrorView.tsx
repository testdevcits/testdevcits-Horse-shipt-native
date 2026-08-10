import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING, ICON_SIZE } from '../../constants';

const ErrorView = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <View style={styles.centerContainer}>
        <AlertCircle size={ICON_SIZE.giant} color={COLORS.error} />
        <AppText style={styles.errorTitle}>Oops! Something went wrong</AppText>
        <AppText style={styles.errorMessage}>{message}</AppText>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <RefreshCcw size={ICON_SIZE.xs} color={COLORS.white} style={{ marginRight: SPACING.sm }} />
            <AppText style={styles.retryText}>Try Again</AppText>
        </TouchableOpacity>
    </View>
);

export default memo(ErrorView)

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.giant,
        marginTop: SPACING.massive,
    },
    errorTitle: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.xl,
        color: COLORS.error,
        marginTop: SPACING.lg,
    },
    errorMessage: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xxl,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.round,
    },
    retryText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
    },
})