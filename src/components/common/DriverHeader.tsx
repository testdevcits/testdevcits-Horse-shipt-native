import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Platform,
    ViewStyle,
    StyleProp,
    TouchableOpacity,
} from 'react-native';
import { Star, ShieldCheck, Radio } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from './AppText';

const HEADER_COLORS = {
    goldPrimary: '#A37F3D',
    goldLightBg: '#FAF6EE',
    goldBorder: '#DCCEB2',
    goldDarkText: '#5C441E',
    greenIndicator: '#10B981',
    background: '#FAF6EE',
};

interface DriverHeaderProps {
    name: string;
    statusText?: string;
    profileImageUrl?: string | null;
    isOnline?: boolean;
    rating?: number;
    rightComponent?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    onStatusToggle?: () => void;
}

const DriverHeader: React.FC<DriverHeaderProps> = ({
    name,
    statusText = 'ON DISPATCH',
    profileImageUrl,
    isOnline = true,
    rating = 4.9,
    rightComponent,
    containerStyle,
    onStatusToggle,
}) => {
    const firstLetter = name ? name.trim().charAt(0).toUpperCase() : 'C';

    const getAvatarUri = (img: any): string | null => {
        if (!img) return null;
        if (typeof img === 'string' && img.trim() !== '' && img !== '/default-avatar.png') {
            return img;
        }
        if (typeof img === 'object' && img.url) {
            return img.url;
        }
        return null;
    };

    const avatarUri = getAvatarUri(profileImageUrl);

    return (
        <View style={[styles.safeArea, containerStyle]}>
            <View style={styles.headerRow}>
                {/* Left Side: Avatar Box & Status Dot */}
                <View style={styles.leftContainer}>
                    <View style={styles.avatarWrapper}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                            <AppText style={styles.monogramText}>{firstLetter}</AppText>
                        )}
                    </View>
                    {isOnline && <View style={styles.indicatorDot} />}
                </View>

                {/* Center: Captain Name, Rating & Status Pill */}
                <View style={styles.middleContainer}>
                    <View style={styles.nameRow}>
                        <AppText style={styles.driverName} numberOfLines={1}>
                            Captain {name || 'Driver'}
                        </AppText>
                        <View style={styles.ratingBadge}>
                            <Star size={12} color="#EAB308" fill="#EAB308" />
                            <AppText style={styles.ratingText}>{rating.toFixed(1)}</AppText>
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onStatusToggle}
                        style={styles.statusBadge}
                    >
                        <Radio size={12} color={isOnline ? '#10B981' : COLORS.textLight} />
                        <AppText style={styles.statusBadgeText}>
                            {isOnline ? statusText.toUpperCase() : 'OFFLINE'}
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Right Side: Action Slot */}
                {rightComponent ? (
                    <View style={styles.rightContainer}>
                        {rightComponent}
                    </View>
                ) : (
                    <View style={styles.captainShieldBox}>
                        <ShieldCheck size={20} color={HEADER_COLORS.goldPrimary} />
                        <AppText style={styles.verifiedCaptainTag}>VERIFIED</AppText>
                    </View>
                )}
            </View>
        </View>
    );
};

export default DriverHeader;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: HEADER_COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: HEADER_COLORS.goldBorder,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        ...Platform.select({
            android: {
                paddingTop: 14,
            },
        }),
    },
    leftContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatarWrapper: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: HEADER_COLORS.goldPrimary,
        borderRadius: RADIUS.md,
        backgroundColor: HEADER_COLORS.goldLightBg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    monogramText: {
        fontFamily: FONTS.bold,
        fontSize: 22,
        color: HEADER_COLORS.goldPrimary,
    },
    indicatorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: HEADER_COLORS.greenIndicator,
        borderWidth: 2,
        borderColor: HEADER_COLORS.background,
        position: 'absolute',
        bottom: -2,
        right: -2,
        zIndex: 10,
    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    driverName: {
        fontFamily: FONTS.bold,
        fontSize: 16,
        color: COLORS.textPrimary,
        flexShrink: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#FEF08A',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    ratingText: {
        fontFamily: FONTS.bold,
        fontSize: 11,
        color: '#854D0E',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderWidth: 1,
        borderColor: HEADER_COLORS.goldBorder,
        backgroundColor: HEADER_COLORS.goldLightBg,
        borderRadius: 12,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    statusBadgeText: {
        fontFamily: FONTS.bold,
        fontSize: 10,
        color: HEADER_COLORS.goldDarkText,
        letterSpacing: 0.4,
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    captainShieldBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.sm,
        borderWidth: 1,
        borderColor: HEADER_COLORS.goldBorder,
    },
    verifiedCaptainTag: {
        fontFamily: FONTS.bold,
        fontSize: 8,
        color: HEADER_COLORS.goldPrimary,
        marginTop: 2,
        letterSpacing: 0.5,
    },
});