import React from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import {
    MessageSquare, Truck, Trash2, CheckCircle2,
    Circle, BellOff, CheckSquare, X, CreditCard, Tag, Star, Bell
} from 'lucide-react-native';
import moment from 'moment';
import { COLORS } from '../../../constants';
import styles from './styles.notification';
import useNotifications from './useNotifications';
import { AppHeader, AppLoader, AppText, EmptyState, ErrorView } from '../../../components';

const getNotificationConfig = (type?: string) => {
    switch (type) {
        case 'chat_message':
            return { Icon: MessageSquare, bg: '#EFF6FF', color: '#3B82F6' };
        case 'shipment_update':
        case 'upcoming_shipment':
            return { Icon: Truck, bg: COLORS.goldLightBg, color: COLORS.goldPrimary };
        case 'payment':
            return { Icon: CreditCard, bg: '#ECFDF5', color: '#10B981' };
        case 'offer':
        case 'quote':
            return { Icon: Tag, bg: '#F5F3FF', color: '#8B5CF6' };
        case 'review':
            return { Icon: Star, bg: '#FEF3C7', color: '#D97706' };
        default:
            return { Icon: Bell, bg: COLORS.goldLightBg, color: COLORS.goldPrimary };
    }
};

const Notifications = () => {
    const {
        notifications, loading, refreshing, actionLoading, error,
        activeFilter, setActiveFilter, selectedIds,
        toggleSelect, selectAll, handleMarkRead, handleMarkSingleRead, handleDelete,
        fetchNotifications, clearSelection
    } = useNotifications();

    const handleItemPress = (item: any) => {
        if (selectedIds.length > 0) {
            toggleSelect(item._id);
        } else if (!item.read) {
            handleMarkSingleRead(item._id);
        }
    };

    const renderNotification = ({ item }: any) => {
        const isSelected = selectedIds.includes(item._id);
        const isSelectionMode = selectedIds.length > 0;
        const { Icon, bg, color } = getNotificationConfig(item.type);
        const formattedTime = item.createdAt ? moment(item.createdAt).fromNow() : moment().fromNow();

        return (
            <TouchableOpacity
                style={[styles.card, !item.read && styles.unreadCard, isSelected && styles.selectedCard]}
                onPress={() => handleItemPress(item)}
                onLongPress={() => toggleSelect(item._id)}
                activeOpacity={0.7}
            >
                {isSelectionMode && (
                    <View style={styles.checkContainer}>
                        {isSelected ? (
                            <CheckCircle2 size={20} color={COLORS.goldPrimary} fill={COLORS.goldLightBg} />
                        ) : (
                            <Circle size={20} color={COLORS.grey300} />
                        )}
                    </View>
                )}

                <View style={[styles.iconBox, { backgroundColor: bg }]}>
                    <Icon size={20} color={color} />
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                        <AppText style={styles.cardTitle}>{item.title}</AppText>
                        {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <AppText style={styles.cardMsg} numberOfLines={2}>{item.message}</AppText>
                    <View style={styles.cardFooter}>
                        <AppText style={styles.cardTime}>{formattedTime}</AppText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) return <AppLoader visible={true} />;
    if (error) return <ErrorView message={error} onRetry={() => fetchNotifications()} />;

    return (
        <View style={styles.container}>
            <AppHeader showBack={true} title="Notifications" />
            <AppLoader visible={actionLoading} />

            {/* 1. Header Segmented Filter */}
            <View style={styles.headerPillContainer}>
                <View style={styles.pillTrack}>
                    {(['all', 'unread'] as const).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.pillBtn, activeFilter === filter && styles.activePill]}
                            onPress={() => { clearSelection(); setActiveFilter(filter); }}
                        >
                            <AppText style={[styles.pillText, activeFilter === filter && styles.activePillText]}>
                                {filter.toUpperCase()}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* 2. Bulk Action Ribbon */}
            {selectedIds.length > 0 && (
                <View style={styles.ribbon}>
                    <View style={styles.ribbonLeft}>
                        <TouchableOpacity onPress={selectAll}>
                            <CheckSquare size={18} color={COLORS.goldPrimary} />
                        </TouchableOpacity>
                        <AppText style={styles.selectionCount}>{selectedIds.length} Selected</AppText>
                    </View>
                    <View style={styles.ribbonActions}>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleMarkRead}>
                            <CheckCircle2 size={18} color={COLORS.success} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
                            <Trash2 size={18} color={COLORS.error} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={clearSelection}>
                            <X size={18} color={COLORS.grey900} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* 3. Main List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderNotification}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchNotifications(true)}
                        tintColor={COLORS.goldPrimary}
                    />
                }
                ListEmptyComponent={
                    <EmptyState
                        icon={BellOff}
                        title="No Notifications"
                        message={activeFilter === 'all' ? "You're all caught up! No new activities found." : "You've read all your notifications."}
                    />
                }
            />
        </View>
    );
};

export default Notifications;