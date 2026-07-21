// src/screens/notifications/Notifications.tsx
import React from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import {
    MessageSquare, Truck, Trash2, CheckCircle2,
    Circle, BellOff, CheckSquare, X, MousePointerClick
} from 'lucide-react-native';
import { COLORS } from '../../../constants';
import styles from './styles.notification';
import useNotifications from './useNotifications';
import { AppHeader, AppLoader, AppText, EmptyState, ErrorView } from '../../../components';

const Notifications = () => {
    const {
        notifications, loading, refreshing, actionLoading, error,
        activeFilter, setActiveFilter, selectedIds,
        toggleSelect, selectAll, handleMarkRead, handleDelete,
        fetchNotifications, clearSelection
    } = useNotifications();

    const renderNotification = ({ item }: any) => {
        const isSelected = selectedIds.includes(item._id);
        const isSelectionMode = selectedIds.length > 0;
        const Icon = item.type === 'chat_message' ? MessageSquare : Truck;

        return (
            <TouchableOpacity
                style={[styles.card, !item.read && styles.unreadCard, isSelected && styles.selectedCard]}
                onPress={() => isSelectionMode ? toggleSelect(item._id) : null}
                onLongPress={() => toggleSelect(item._id)}
                activeOpacity={0.7}
            >
                {isSelectionMode && (
                    <View style={styles.checkContainer}>
                        {isSelected ? (
                            <CheckCircle2 size={22} color={COLORS.goldPrimary} fill={COLORS.goldLightBg} />
                        ) : (
                            <Circle size={22} color={COLORS.grey300} />
                        )}
                    </View>
                )}

                <View style={[styles.iconBox, { elevation: item.read ? 0 : 1 }]}>
                    <Icon size={22} color={COLORS.goldPrimary} />
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                        <AppText style={styles.cardTitle}>{item.title}</AppText>
                        {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <AppText style={styles.cardMsg} numberOfLines={2}>{item.message}</AppText>
                    <View style={styles.cardFooter}>
                        <AppText style={styles.cardTime}>10:45 AM • 20 Jul 2026</AppText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) return <AppLoader visible={true} />;
    if (error) return <ErrorView message={error} onRetry={() => fetchNotifications()} />;

    return (
        <View style={styles.container}>
            <AppHeader  showBack={true} title='Notifications'/>
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

            {/* 2. Bulk Action Ribbon (Stripe Style) */}
            {selectedIds.length > 0 && (
                <View style={styles.ribbon}>
                    <View style={styles.ribbonLeft}>
                        <TouchableOpacity onPress={selectAll}>
                            <CheckSquare size={20} color={COLORS.goldPrimary} />
                        </TouchableOpacity>
                        <AppText style={styles.selectionCount}>{selectedIds.length} Selected</AppText>
                    </View>
                    <View style={styles.ribbonActions}>
                        <TouchableOpacity onPress={handleMarkRead}><CheckCircle2 size={20} color={COLORS.success} /></TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}><Trash2 size={20} color={COLORS.error} /></TouchableOpacity>
                        <TouchableOpacity onPress={clearSelection}><X size={20} color={COLORS.grey900} /></TouchableOpacity>
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