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
import { ShieldCheck, Radio } from 'lucide-react-native';
import { COLORS, FONT_SIZE, FONTS, RADIUS, SPACING, SIZES } from '../../constants';
import AppText from './AppText';

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
                        {/* <View style={styles.ratingBadge}>
                            <Star size={12} color={COLORS.warning} fill={COLORS.warning} />
                            <AppText style={styles.ratingText}>{rating.toFixed(1)}</AppText>
                        </View> */}
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onStatusToggle}
                        style={styles.statusBadge}
                    >
                        <Radio size={12} color={isOnline ? COLORS.greenActive : COLORS.textLight} />
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
                        <ShieldCheck size={20} color={COLORS.primary} />
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
        backgroundColor: COLORS.goldLightBg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.goldBorder,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs2,
        backgroundColor: COLORS.white,
        borderBottomWidth: SIZES.borderWidthThin,
        borderBottomColor: COLORS.grey200,
        ...Platform.select({
            android: {
                paddingTop: SPACING.md2,
            },
        }),
    },
    leftContainer: {
        position: 'relative',
        marginRight: SPACING.md,
    },
    avatarWrapper: {
        width: RADIUS.circle,
        height: RADIUS.circle,
        borderWidth: SIZES.borderWidthThick,
        borderColor: COLORS.primary,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.goldLightBg,
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
        fontSize: FONT_SIZE.title,
        color: COLORS.primary,
    },
    indicatorDot: {
        width: SPACING.md,
        height: SPACING.md,
        borderRadius: RADIUS.xs2,
        backgroundColor: COLORS.greenActive,
        borderWidth: SIZES.borderWidthThick,
        borderColor: COLORS.goldLightBg,
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
        gap: SPACING.xs2,
    },
    driverName: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.sm,
        color: COLORS.textPrimary,
        flexShrink: 1,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: COLORS.amberLightBg,
        paddingHorizontal: SPACING.xs2,
        paddingVertical: SPACING.xxs,
        borderRadius: RADIUS.sm2,
    },
    ratingText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.sm,
        color: COLORS.amberWarning,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderWidth: SIZES.borderWidthThin,
        borderColor: COLORS.goldBorder,
        backgroundColor: COLORS.goldLightBg,
        borderRadius: RADIUS.md,
        paddingVertical: 3,
        paddingHorizontal: SPACING.sm2,
        marginTop: SPACING.xs,
        alignSelf: 'flex-start',
    },
    statusBadgeText: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.xs,
        color: COLORS.goldDarkText,
        letterSpacing: 0.4,
    },
    rightContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginLeft: SPACING.sm,
    },
    captainShieldBox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.sm,
        borderWidth: SIZES.borderWidthThin,
        borderColor: COLORS.goldBorder,
    },
    verifiedCaptainTag: {
        fontFamily: FONTS.bold,
        fontSize: FONT_SIZE.xxs,
        color: COLORS.primary,
        marginTop: SPACING.xxs,
        letterSpacing: 0.5,
    },
});