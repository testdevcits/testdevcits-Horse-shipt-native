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
            <AppHeader showBack={true} title='Notifications' />
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


// import React, { useMemo } from 'react';
// import { View, FlatList, TouchableOpacity, RefreshControl, Animated as RNAnimated } from 'react-native';
// import {
//     MessageSquare, Truck, Trash2, CheckCircle2,
//     Bell, BellOff, Info, CreditCard, Tag, Search,
//     MoreVertical, Check, Archive,
//     CheckSquare
// } from 'lucide-react-native';
// import { RectButton } from 'react-native-gesture-handler';
// import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
// import moment from 'moment';

// import { COLORS } from '../../../constants';
// import styles from './styles.notification';
// import useNotifications from './useNotifications';
// import { AppHeader, AppLoader, AppText, EmptyState } from '../../../components';

// const Notifications = () => {
//     const {
//         notifications, loading, refreshing, actionLoading,
//         activeFilter, setActiveFilter, selectedIds,
//         toggleSelect, selectAll, handleMarkRead, handleDelete,
//         fetchNotifications, clearSelection
//     } = useNotifications();

//     // Grouping Logic: Today, Yesterday, Earlier
//     const groupedNotifications = useMemo(() => {
//         const groups: { [key: string]: any[] } = {
//             Today: [],
//             Yesterday: [],
//             Earlier: [],
//         };

//         notifications.forEach(n => {
//             const date = moment(n.createdAt);
//             if (date.isSame(moment(), 'day')) groups.Today.push(n);
//             else if (date.isSame(moment().subtract(1, 'days'), 'day')) groups.Yesterday.push(n);
//             else groups.Earlier.push(n);
//         });

//         return Object.keys(groups)
//             .filter(key => groups[key].length > 0)
//             .map(key => ({ title: key, data: groups[key] }));
//     }, [notifications]);

//     const getIcon = (type: string) => {
//         switch (type) {
//             case 'chat_message': return { Icon: MessageSquare, color: '#3B82F6' };
//             case 'shipment_update': return { Icon: Truck, color: COLORS.goldPrimary };
//             case 'payment': return { Icon: CreditCard, color: '#10B981' };
//             case 'offer': return { Icon: Tag, color: '#8B5CF6' };
//             default: return { Icon: Info, color: COLORS.grey500 };
//         }
//     };

//     const renderRightActions = (id: string, progress: RNAnimated.AnimatedInterpolation<number>) => {
//         const trans = progress.interpolate({
//             inputRange: [0, 1],
//             outputRange: [80, 0],
//         });
//         return (
//             <View style={styles.swipeContainer}>
//                 <RNAnimated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
//                     <RectButton style={[styles.swipeAction, { backgroundColor: COLORS.error }]} onPress={() => handleDelete(id)}>
//                         <Trash2 size={20} color={COLORS.white} />
//                     </RectButton>
//                 </RNAnimated.View>
//             </View>
//         );
//     };

//     const renderNotification = ({ item }: any) => {
//         const isSelected = selectedIds.includes(item._id);
//         const isSelectionMode = selectedIds.length > 0;
//         const { Icon, color } = getIcon(item.type);

//         return (
//             <ReanimatedSwipeable
//                 renderRightActions={(prog) => renderRightActions(item._id, prog)}
//             >
//                 <TouchableOpacity
//                     style={[styles.card, !item.read && styles.unreadCard, isSelected && styles.selectedCard]}
//                     onPress={() => isSelectionMode ? toggleSelect(item._id) : null}
//                     onLongPress={() => {
//                         toggleSelect(item._id);
//                     }}
//                     activeOpacity={0.9}
//                 >
//                     <View style={styles.cardInner}>
//                         {isSelectionMode && (
//                             <View style={styles.selectionCircle}>
//                                 <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
//                                     {isSelected && <Check size={14} color={COLORS.white} strokeWidth={3} />}
//                                 </View>
//                             </View>
//                         )}

//                         <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
//                             <Icon size={22} color={color} />
//                         </View>

//                         <View style={styles.contentContainer}>
//                             <View style={styles.row}>
//                                 <AppText style={[styles.title, !item.read && styles.boldText]} numberOfLines={1}>
//                                     {item.title}
//                                 </AppText>
//                                 <AppText style={styles.time}>{moment(item.createdAt).fromNow(true)}</AppText>
//                             </View>
//                             <AppText style={styles.message} numberOfLines={2}>{item.message}</AppText>
//                         </View>

//                         {!item.read && <View style={styles.indicator} />}
//                     </View>
//                 </TouchableOpacity>
//             </ReanimatedSwipeable>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <AppHeader showBack title="Activity" />
//             <AppLoader visible={actionLoading} />

//             {/* Filter Tabs */}
//             <View style={styles.tabWrapper}>
//                 <View style={styles.segmentedControl}>
//                     {['all', 'unread'].map((tab) => (
//                         <TouchableOpacity
//                             key={tab}
//                             style={[styles.tabBtn, activeFilter === tab && styles.tabBtnActive]}
//                             onPress={() => setActiveFilter(tab as any)}
//                         >
//                             <AppText style={[styles.tabLabel, activeFilter === tab && styles.tabLabelActive]}>
//                                 {tab === 'all' ? 'All Activity' : 'Unread'}
//                             </AppText>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//                 <TouchableOpacity style={styles.searchBtn}>
//                     <Search size={20} color={COLORS.grey500} />
//                 </TouchableOpacity>
//             </View>

//             {/* Bulk Action Toolbar (Floating) */}
//             {selectedIds.length > 0 && (
//                 <RNAnimated.View style={styles.floatingToolbar}>
//                     <TouchableOpacity onPress={clearSelection} style={styles.toolbarClose}>
//                         <CheckSquare size={20} color={COLORS.white} />
//                         <AppText style={styles.toolbarText}>{selectedIds.length} Selected</AppText>
//                     </TouchableOpacity>
//                     <View style={styles.toolbarActions}>
//                         <TouchableOpacity onPress={handleMarkRead} style={styles.actionIcon}><Archive size={20} color={COLORS.white} /></TouchableOpacity>
//                         <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}><Trash2 size={20} color={COLORS.white} /></TouchableOpacity>
//                     </View>
//                 </RNAnimated.View>
//             )}

//             <FlatList
//                 data={groupedNotifications}
//                 keyExtractor={(item) => item.title}
//                 renderItem={({ item }) => (
//                     <View>
//                         <View style={styles.sectionHeader}>
//                             <AppText style={styles.sectionTitle}>{item.title}</AppText>
//                         </View>
//                         <FlatList
//                             data={item.data}
//                             keyExtractor={(n) => n._id}
//                             renderItem={renderNotification}
//                         />
//                     </View>
//                 )}
//                 contentContainerStyle={styles.listPadding}
//                 refreshControl={
//                     <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} tintColor={COLORS.goldPrimary} />
//                 }
//                 ListEmptyComponent={<EmptyState icon={BellOff} title="All quiet for now" message="We'll notify you about shipment updates and offers." />}
//             />
//         </View>
//     );
// };

// export default Notifications;