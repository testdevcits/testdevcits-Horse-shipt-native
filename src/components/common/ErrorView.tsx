import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { memo } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react-native';
import AppText from './AppText';
import { COLORS, FONTS, RADIUS } from '../../constants';

const ErrorView = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <View style={styles.centerContainer}>
        <AlertCircle size={48} color={COLORS.error} />
        <AppText style={styles.errorTitle}>Oops! Something went wrong</AppText>
        <AppText style={styles.errorMessage}>{message}</AppText>
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
            <RefreshCcw size={16} color={COLORS.white} style={{ marginRight: 8 }} />
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
        padding: 40,
        marginTop: 60,
    },
    errorTitle: {
        fontFamily: FONTS.bold,
        fontSize: 18,
        color: COLORS.error,
        marginTop: 16,
    },
    errorMessage: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        marginTop: 8,
        marginBottom: 24,
    },
    retryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: RADIUS.round,
    },
    retryText: {
        color: COLORS.white,
        fontFamily: FONTS.bold,
    },
})