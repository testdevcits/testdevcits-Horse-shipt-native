import React, { memo } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import {
    Calendar,
    DollarSign,
    Hash,
    X,
    ShieldCheck,
    CreditCard,
    Package,
} from 'lucide-react-native';
import { AppText } from '../../../../components';
import { COLORS, FONT_SIZE, FONTS, SPACING, RADIUS } from '../../../../constants';
import { formatDate } from '../../../../utils/helpers';

interface TransactionDetailsModalProps {
    selectedTx: any;
    setSelectedTx: (tx: any) => void;
}

const DetailRow = memo(
    ({
        icon: Icon,
        label,
        value,
        valueColor,
    }: {
        icon: any;
        label: string;
        value: string;
        valueColor?: string;
    }) => (
        <View style={styles.detailRow}>
            <View style={styles.iconBox}>
                <Icon size={16} color={COLORS.primary} />
            </View>
            <View style={styles.rowTextWrap}>
                <AppText style={styles.rowLabel}>{label}</AppText>
                <AppText
                    style={[styles.rowValue, valueColor ? { color: valueColor } : null]}
                    numberOfLines={1}
                >
                    {value}
                </AppText>
            </View>
        </View>
    ),
);

const TransactionDetailsModal = ({
    selectedTx,
    setSelectedTx,
}: TransactionDetailsModalProps) => {
    if (!selectedTx) return null;

    const isSuccess =
        (selectedTx.status || 'paid').toLowerCase() === 'paid' ||
        (selectedTx.status || '').toLowerCase() === 'completed';

    return (
        <Modal
            visible={Boolean(selectedTx)}
            transparent
            animationType="fade"
            onRequestClose={() => setSelectedTx(null)}
        >
            <View style={styles.overlay}>
                <View style={styles.cardContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <AppText style={styles.title}>Transaction Details</AppText>
                            <AppText style={styles.subtitle}>Payout Receipt & Info</AppText>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setSelectedTx(null)}
                            activeOpacity={0.7}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <X size={18} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Hero Amount Box */}
                    <View style={styles.heroBox}>
                        <AppText style={styles.heroLabel}>TOTAL PAYOUT</AppText>
                        <AppText style={styles.heroAmount}>
                            ${selectedTx.amount ? Number(selectedTx.amount).toFixed(2) : '0.00'}{' '}
                            <AppText style={styles.currencyText}>
                                {selectedTx.currency ? selectedTx.currency.toUpperCase() : 'USD'}
                            </AppText>
                        </AppText>

                        <View
                            style={[
                                styles.statusBadge,
                                isSuccess ? styles.statusSuccess : styles.statusPending,
                            ]}
                        >
                            <ShieldCheck size={13} color={isSuccess ? '#047857' : '#D97706'} />
                            <AppText
                                style={[
                                    styles.statusText,
                                    { color: isSuccess ? '#047857' : '#D97706' },
                                ]}
                            >
                                {isSuccess
                                    ? 'Payout Completed'
                                    : (selectedTx.status || 'Pending').toUpperCase()}
                            </AppText>
                        </View>
                    </View>

                    {/* Details Card */}
                    <View style={styles.detailsCard}>
                        <DetailRow
                            icon={Hash}
                            label="Payout Reference ID"
                            value={selectedTx.id || 'N/A'}
                        />

                        <View style={styles.rowDivider} />

                        <DetailRow
                            icon={Package}
                            label="Shipment Code"
                            value={selectedTx.shipmentCode || 'N/A'}
                        />

                        <View style={styles.rowDivider} />

                        <DetailRow
                            icon={Calendar}
                            label="Date & Time"
                            value={
                                selectedTx.createdAt
                                    ? formatDate(selectedTx.createdAt, 'MMMM DD, YYYY')
                                    : 'N/A'
                            }
                        />

                        <View style={styles.rowDivider} />

                        <DetailRow
                            icon={CreditCard}
                            label="Payout Method"
                            value="Stripe Express Direct Transfer"
                        />
                    </View>

                    {/* Footer Action Button */}
                    <TouchableOpacity
                        style={styles.doneBtn}
                        onPress={() => setSelectedTx(null)}
                        activeOpacity={0.8}
                    >
                        <AppText style={styles.doneBtnText}>Done</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
    },
    cardContainer: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 8,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZE.md + 1,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    heroBox: {
        backgroundColor: '#FAF6EE',
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#F3E5C2',
    },
    heroLabel: {
        fontSize: FONT_SIZE.xxs,
        fontFamily: FONTS.bold,
        color: COLORS.primary,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    heroAmount: {
        fontSize: FONT_SIZE.display,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
        marginVertical: SPACING.xs,
    },
    currencyText: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.semiBold,
        color: COLORS.textSecondary,
    },

    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: RADIUS.xs,
        marginTop: 4,
    },
    statusSuccess: {
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    statusPending: {
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    statusText: {
        fontSize: FONT_SIZE.xs - 1,
        fontFamily: FONTS.bold,
        letterSpacing: 0.2,
    },

    detailsCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: SPACING.lg,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.xs,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    rowTextWrap: {
        flex: 1,
    },
    rowLabel: {
        fontSize: FONT_SIZE.xs - 1,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
    },
    rowValue: {
        fontSize: FONT_SIZE.xs,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
        marginTop: 1,
    },
    rowDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
    },

    doneBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneBtnText: {
        fontSize: FONT_SIZE.sm,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
});

export default memo(TransactionDetailsModal);