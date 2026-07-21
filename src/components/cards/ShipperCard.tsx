import React, { memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking, Pressable } from 'react-native';
import { Star, MapPin, ShieldCheck, Heart, ArrowRight, Globe } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';
import imageIndex from '../../assets/images/imageIndex';

interface ShipperCardProps {
    item: any;
    onPress: () => void; // Add this to your interface
}


const ShipperCard = memo(({ item, onPress }: ShipperCardProps) => {
    const isNew = item.rating === 0;

    return (
        <Pressable onPress={onPress} style={styles.card}>
            <View style={styles.mainRow}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={item.profileImage.startsWith('http') ? { uri: item.profileImage } : imageIndex.AccountIcon}
                        style={styles.avatar}
                    />
                    <View style={styles.onlineBadge} />
                </View>

                <View style={styles.info}>
                    <View style={styles.nameRow}>
                        <AppText style={styles.name} numberOfLines={1}>{item.name}</AppText>
                        <ShieldCheck size={16} color={COLORS.info} fill={`${COLORS.info}20`} />
                    </View>

                    <View style={styles.locationRow}>
                        <MapPin size={12} color={COLORS.textLight} />
                        <AppText style={styles.locationText} numberOfLines={1}>{item.region}</AppText>
                    </View>

                    <View style={styles.ratingRow}>
                        <Star size={14} color={isNew ? COLORS.grey300 : COLORS.goldPrimary} fill={isNew ? 'transparent' : COLORS.goldPrimary} />
                        <AppText style={styles.ratingText}>
                            {isNew ? 'New Shipper' : `${item.rating.toFixed(1)} (${item.reviewCount})`}
                        </AppText>
                    </View>
                </View>

                <TouchableOpacity style={styles.favBtn}>
                    <Heart size={20} color={COLORS.grey300} />
                </TouchableOpacity>
            </View>

            <View style={styles.descriptionBox}>
                <AppText style={styles.reviewText} numberOfLines={2}>
                    "{item.reviewText}"
                </AppText>
            </View>

            <View style={styles.footer}>
                {item.googleReviewLink && (
                    <TouchableOpacity
                        style={styles.googleBtn}
                        onPress={() => Linking.openURL(item.googleReviewLink)}
                    >
                        <Globe size={14} color={COLORS.goldPrimary} />
                        <AppText style={styles.googleText}>Google Reviews</AppText>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.bookBtn}>
                    <AppText style={styles.bookText}>View Profile</AppText>
                    <ArrowRight size={14} color={COLORS.white} />
                </TouchableOpacity>
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.divider,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    mainRow: { flexDirection: 'row', alignItems: 'center' },
    imageWrapper: { position: 'relative' },
    avatar: { width: 60, height: 60, borderRadius: RADIUS.md, backgroundColor: COLORS.grey50 },
    onlineBadge: { position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.white },
    info: { flex: 1, marginLeft: SPACING.md, gap: 2 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    name: { fontSize: 16, fontFamily: FONTS.bold, color: COLORS.textPrimary },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.medium },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    ratingText: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.textPrimary },
    favBtn: { padding: 8 },
    descriptionBox: {
        backgroundColor: COLORS.grey50,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginVertical: SPACING.md
    },
    reviewText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', lineHeight: 18 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.md },
    googleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    googleText: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.goldPrimary, textDecorationLine: 'underline' },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.goldPrimary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: RADIUS.round,
        gap: 8
    },
    bookText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: 13 },
});

export default ShipperCard;