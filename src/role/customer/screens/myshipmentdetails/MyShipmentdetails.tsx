import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import {
  X,
  FileText,
  Navigation,
  MapPin,
  Calendar,
  Truck,
  User,
  Info,
  Circle,
  MoreHorizontal
} from 'lucide-react-native';
import moment from 'moment';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../constants';
import { AppText } from '../../../../components';

const MyShipmentDetails = ({ route, navigation }: any) => {
  const { item } = route.params;
  const horse = item.horses[0];

  // Helper for Status Colors
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'assigned': return { bg: '#EBF8FF', text: COLORS.info };
      case 'delivered': return { bg: '#F0FFF4', text: COLORS.success };
      case 'in-progress': return { bg: '#FFFBEB', text: COLORS.warning };
      default: return { bg: COLORS.grey100, text: COLORS.textSecondary };
    }
  };

  const statusStyle = getStatusStyle(item.status);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* PROFESSIONAL HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <X size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleCenter}>
          <AppText style={styles.headerSub}>SHIPMENT ID</AppText>
          <AppText style={styles.headerMain}>{item.shipmentCode}</AppText>
        </View>
        <TouchableOpacity style={styles.backBtn}>
          <MoreHorizontal size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        {/* STATUS & DATE SUMMARY */}
        <View style={styles.summaryCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <AppText style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status.toUpperCase()}
            </AppText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.dateGroup}>
            <Calendar size={16} color={COLORS.textSecondary} />
            <AppText style={styles.summaryDate}>
              Est. Arrival: {moment(item.deliveryDateRange?.start).format('MMM DD')}
            </AppText>
          </View>
        </View>

        {/* ELEGANT ROUTE TIMELINE */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>TIMELINE</AppText>
          <View style={styles.timelineRow}>
            <View style={styles.timelineVisual}>
              <Circle size={12} color={COLORS.goldPrimary} fill={COLORS.goldPrimary} />
              <View style={styles.dashedLine} />
              <MapPin size={18} color={COLORS.goldPrimary} fill={COLORS.goldPrimary} />
            </View>
            <View style={styles.timelineContent}>
              <View style={styles.locBlock}>
                <AppText style={styles.locLabel}>PICKUP FROM</AppText>
                <AppText style={styles.locName}>{item.pickupLocation}</AppText>
                <AppText style={styles.locDate}>{moment(item.pickupDateRange.start).format('ddd, MMM DD YYYY')}</AppText>
              </View>
              <View style={styles.locBlock}>
                <AppText style={styles.locLabel}>DELIVERY TO</AppText>
                <AppText style={styles.locName}>{item.deliveryLocation}</AppText>
                <AppText style={styles.locDate}>{moment(item.deliveryDateRange?.start).format('ddd, MMM DD YYYY')}</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK DETAILS GRID */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
             <Truck size={20} color={COLORS.goldPrimary} />
             <View>
               <AppText style={styles.gridSub}>STALL TYPE</AppText>
               <AppText style={styles.gridMain}>{horse?.requestedStallSize || '1/2 Box'}</AppText>
             </View>
          </View>
          <View style={styles.gridItem}>
             <Info size={20} color={COLORS.goldPrimary} />
             <View>
               <AppText style={styles.gridSub}>HORSES</AppText>
               <AppText style={styles.gridMain}>{item.numberOfHorses} Head</AppText>
             </View>
          </View>
        </View>

        {/* SHIPPER PROFILE */}
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>ASSIGNED SHIPPER</AppText>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <User size={24} color={COLORS.goldPrimary} />
            </View>
            <View style={styles.profileInfo}>
              <AppText style={styles.profileName}>{item.shipper.name}</AppText>
              <AppText style={styles.profileSub}>{item.shipper.email}</AppText>
            </View>
            <TouchableOpacity style={styles.contactBtn}>
               <AppText style={styles.contactText}>Message</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* HORSE PROFILE SECTION
        <AppText style={styles.sectionHeader}>HORSE INFORMATION</AppText>
        <View style={styles.horseMainCard}>
          <Image
            source={{ uri: horse?.photo?.url || 'https://via.placeholder.com/400' }}
            style={styles.heroImage}
          />
          <View style={styles.horseDetailsBody}>
            <View style={styles.horseHeader}>
               <AppText style={styles.horseNameText}>{horse?.barnName || 'Horse'}</AppText>
               <View style={styles.genderChip}>
                 <AppText style={styles.genderChipText}>{horse?.sex}</AppText>
               </View>
            </View>
            <AppText style={styles.horseRegName}>{horse?.registeredName}</AppText>
            
            <View style={styles.chipContainer}>
              {[horse?.breed, `${horse?.age} yrs`, horse?.colour].map((tag, i) => (
                <View key={i} style={styles.chip}>
                  <AppText style={styles.chipText}>{tag}</AppText>
                </View>
              ))}
            </View>

            {horse?.notes && (
              <View style={styles.notesBox}>
                <AppText style={styles.notesLabel}>Notes:</AppText>
                <AppText style={styles.notesContent}>{horse.notes}</AppText>
              </View>
            )}
          </View>
        </View> */}


{/* HORSE PROFILE SECTION - LISTING ALL HORSES */}
        <View style={styles.sectionHeaderRow}>
            <AppText style={styles.sectionHeader}>HORSES IN SHIPMENT</AppText>
            <View style={styles.countBadge}>
                <AppText style={styles.countText}>{item.horses?.length || 0}</AppText>
            </View>
        </View>

        {item.horses?.map((horse: any, index: number) => (
          <View key={horse._id || index} style={[styles.horseMainCard, { marginBottom: SPACING.lg }]}>
            <Image
              source={{ uri: horse?.photo?.url || 'https://via.placeholder.com/400' }}
              style={styles.heroImage}
            />
            {/* Index Tag */}
            <View style={styles.horseIndexTag}>
               <AppText style={styles.horseIndexText}>Horse #{index + 1}</AppText>
            </View>

            <View style={styles.horseDetailsBody}>
              <View style={styles.horseHeader}>
                 <AppText style={styles.horseNameText}>{horse?.barnName || 'Horse'}</AppText>
                 <View style={styles.genderChip}>
                   <AppText style={styles.genderChipText}>{horse?.sex}</AppText>
                 </View>
              </View>
              <AppText style={styles.horseRegName}>{horse?.registeredName}</AppText>
              
              <View style={styles.chipContainer}>
                <View style={styles.chip}>
                    <AppText style={styles.chipText}>{horse?.breed}</AppText>
                </View>
                <View style={styles.chip}>
                    <AppText style={styles.chipText}>{horse?.age} yrs</AppText>
                </View>
                <View style={styles.chip}>
                    <AppText style={styles.chipText}>{horse?.colour}</AppText>
                </View>
                <View style={styles.chip}>
                    <AppText style={styles.chipText}>{horse?.requestedStallSize}</AppText>
                </View>
              </View>

              {horse?.notes && (
                <View style={styles.notesBox}>
                  <AppText style={styles.notesLabel}>Owner Notes:</AppText>
                  <AppText style={styles.notesContent}>{horse.notes}</AppText>
                </View>
              )}
            </View>
          </View>
        ))}



        <View style={{ height: 120 }} />
      </ScrollView>

      {/* STICKY BOTTOM ACTIONS (2 Primary focus) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryBtn}>
          <FileText size={20} color={COLORS.textPrimary} />
          <AppText style={styles.secondaryBtnText}>Docs</AppText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.primaryBtn}>
          <Navigation size={20} color={COLORS.white} />
          <AppText style={styles.primaryBtnText}>Track Shipment</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backBtn: { padding: 8 },
  headerTitleCenter: { alignItems: 'center' },
  headerSub: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.textLight, letterSpacing: 1 },
  headerMain: { fontSize: 16, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  
  scroll: { padding: SPACING.md },
  
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.round },
  statusText: { fontSize: 12, fontFamily: FONTS.bold },
  summaryDivider: { width: 1, height: 20, backgroundColor: COLORS.divider, marginHorizontal: SPACING.md },
  dateGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryDate: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.textPrimary },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  cardTitle: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.textLight, marginBottom: 16, letterSpacing: 0.5 },
  
  timelineRow: { flexDirection: 'row' },
  timelineVisual: { alignItems: 'center', width: 24, paddingVertical: 4 },
  dashedLine: { flex: 1, width: 2, backgroundColor: COLORS.divider, marginVertical: 4 },
  timelineContent: { flex: 1, paddingLeft: SPACING.md },
  locBlock: { marginBottom: 24 },
  locLabel: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.textLight, marginBottom: 4 },
  locName: { fontSize: 16, fontFamily: FONTS.bold, color: COLORS.goldPrimary },
  locDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  grid: { flexDirection: 'row', gap: 12, marginBottom: SPACING.md },
  gridItem: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gridSub: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.textLight },
  gridMain: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.textPrimary },

  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.goldLightBg, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  profileSub: { fontSize: 12, color: COLORS.textLight },
  contactBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: COLORS.goldPrimary },
  contactText: { color: COLORS.goldPrimary, fontSize: 12, fontFamily: FONTS.bold },

  sectionHeader: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.textLight, marginTop: 10, marginBottom: 12 },
  horseMainCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.divider },
  heroImage: { width: '100%', height: 220 },
  horseDetailsBody: { padding: SPACING.lg },
  horseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  horseNameText: { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  genderChip: { backgroundColor: '#EBF8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  genderChipText: { color: COLORS.info, fontSize: 11, fontFamily: FONTS.bold },
  horseRegName: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 16 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: COLORS.grey50, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.divider },
  chipText: { fontSize: 12, color: COLORS.textPrimary, fontFamily: FONTS.medium },
  notesBox: { marginTop: 20, padding: 12, backgroundColor: COLORS.grey50, borderRadius: 8 },
  notesLabel: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.textSecondary, marginBottom: 4 },
  notesContent: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 18 },

  footer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.md,
    height: 54,
  },
  secondaryBtnText: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  primaryBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.goldPrimary,
    borderRadius: RADIUS.md,
    height: 54,
  },
  primaryBtnText: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.white },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 12,
  },
  // sectionHeader: { 
  //   fontSize: 14, 
  //   fontFamily: FONTS.bold, 
  //   color: COLORS.textLight, 
  //   letterSpacing: 0.5 
  // },
  countBadge: {
    backgroundColor: COLORS.goldPrimary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  horseIndexTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    // backdropFilter: 'blur(10px)', // For iOS effect
  },
  horseIndexText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
});

export default MyShipmentDetails;