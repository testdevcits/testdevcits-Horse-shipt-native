import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
 import { SPACING, RADIUS, FONT_SIZE, ICON_SIZE } from '../../constants/dimensions';
import { COLORS, FONTS } from '../../constants';
 
// Using your provided interface
export interface Horse {
    _id: string;
    owner: string;
    registeredName: string;
    barnName: string;
    breed: string;
    otherBreed: string;
    colour: string;
    age: string;
    sex: string;
    defaultStallSize: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface HorseCardProps {
    item: Horse;
    onEdit: (item: Horse) => void;
    onDelete: (id: string) => void;
}

const HorseCard: React.FC<HorseCardProps> = ({ item, onEdit, onDelete }) => {
    return (
        <View style={styles.cardContainer}>
            {/* Header: Registered Name and Lucide Action Icons */}
            <View style={styles.header}>
                <Text style={styles.horseNameText}>{item.registeredName}</Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        onPress={() => onEdit(item)} 
                        activeOpacity={0.7}
                        style={styles.iconButton}
                    >
                        <Pencil 
                            size={ICON_SIZE.md} 
                            color={COLORS.goldPrimary} 
                            strokeWidth={1.8} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onDelete(item._id)} 
                        activeOpacity={0.7}
                    >
                        <Trash2 
                            size={ICON_SIZE.md} 
                            color={COLORS.error} 
                            strokeWidth={1.8} 
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Details Grid: 2 Column Layout */}
            <View style={styles.detailsGrid}>
                {/* Left Column */}
                <View style={styles.column}>
                    <DetailItem label="Barn Name" value={item.barnName} />
                    <DetailItem label="Sex" value={item.sex} />
                    <DetailItem label="Age" value={`${item.age} Years`} />
                </View>

                {/* Right Column */}
                <View style={styles.column}>
                    <DetailItem label="Color" value={item.colour} />
                    <DetailItem 
                        label="Breed" 
                        value={item.breed === 'Other' ? item.otherBreed : item.breed} 
                    />
                    <DetailItem label="Stall" value={item.defaultStallSize} />
                </View>
            </View>

            {/* Notes Section: Matches the inset tan box */}
            {item.notes ? (
                <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>NOTES :</Text>
                    <Text style={styles.notesText}>{item.notes}</Text>
                </View>
            ) : null}
        </View>
    );
};

/**
 * Sub-component for individual detail rows (e.g. Sex : Stallion)
 */
const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.detailRow}>
        <Text style={styles.label}>{label} : </Text>
        <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
);

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: COLORS.white,
        borderRadius: RADIUS.md,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.md,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    horseNameText: {
        fontSize: FONT_SIZE.lg,
        fontFamily: FONTS.bold,
        color: COLORS.textPrimary,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: SPACING.md,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: SPACING.xs,
        flexWrap: 'wrap',
    },
    label: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.semiBold,
        color: COLORS.goldPrimary,
    },
    value: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.textPrimary,
    },
    notesContainer: {
        backgroundColor: COLORS.goldLightBg,
        borderRadius: RADIUS.sm,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.goldBorder,
        marginTop: SPACING.md,
    },
    notesLabel: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.bold,
        color: COLORS.goldPrimary,
        marginBottom: 2,
    },
    notesText: {
        fontSize: FONT_SIZE.md,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
});

export default HorseCard;