import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS, SPACING } from '../../../../../constants';
import { formatDate } from '../../../../../utils/helpers';
import styles from '../styles.earnings';

interface TransactionRowItemProps {
  tx: any;
  isLast: boolean;
  onSelectTx: (tx: any) => void;
}

export const TransactionRowItem: React.FC<TransactionRowItemProps> = ({
  tx,
  isLast,
  onSelectTx,
}) => {
  const formattedDate = tx?.createdAt
    ? formatDate(tx.createdAt, 'MMM DD, YYYY')
    : 'Not Available';

  const formatTxId = (id: string) => {
    if (!id) return 'tr_...';
    if (id.length > 16) {
      return `${id.substring(0, 9)}.....${id.substring(id.length - 4)}`;
    }
    return id;
  };

  const statusText = tx?.status
    ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
    : 'Not Available';

  return (
    <View
      style={[
        styles.tableRow,
        isLast && styles.tableRowLast,
        { backgroundColor: COLORS.white, paddingHorizontal: SPACING.md },
      ]}
    >
      {/* ID */}
      <TouchableOpacity style={styles.idCol} onPress={() => onSelectTx(tx)}>
        <AppText style={styles.idText} numberOfLines={1}>
          {formatTxId(tx.id)}
        </AppText>
        <AppIcon name="Eye" size={13} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Amount */}
      <AppText style={styles.amountText}>
        $
        {tx.amount
          ? tx?.amount % 1 === 0
            ? tx?.amount.toFixed(2)
            : tx?.amount
          : 'not available'}
      </AppText>

      {/* Date */}
      <AppText style={styles.dateText}>{formattedDate}</AppText>

      {/* Status Badge */}
      <View style={styles.statusCol}>
        <View style={styles.paidBadge}>
          <AppText style={styles.paidBadgeText}>{statusText}</AppText>
        </View>
      </View>
    </View>
  );
};
