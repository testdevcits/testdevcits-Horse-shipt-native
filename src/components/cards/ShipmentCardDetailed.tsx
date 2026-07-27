 

// import React, { memo } from 'react';
// import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { MapPin, Calendar, ExternalLink, Truck } from 'lucide-react-native';
// import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
// import AppText from '../common/AppText';

// const ShipmentHorizontalCard = memo(({ item, onPress }: { item: any; onPress: () => void }) => {
//   const horse = item.horses[0];

//   return (
//     <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>

//       {/* 1. Left Section: Horse Image */}
//       <Image
//         source={{ uri:  horse.photo.url || 'https://via.placeholder.com/150' }}
//         style={styles.image}
//       />

//       {/* 2. Middle Section: Details */}
//       <View style={styles.content}>
//         <View style={styles.titleRow}>
//           <AppText style={styles.title} numberOfLines={2}>
//             {item.horsesCount || 1} Horse Shipping from {item.origin} to {item.destination}
//           </AppText>

//           {/* External Link Button */}
//           <TouchableOpacity style={styles.exportBtn}>
//             <ExternalLink size={18} color={COLORS.white} />                                                                                  
//           </TouchableOpacity>
//         </View>

//         {/* Status Badge */}
//         <View style={styles.statusRow}>
//           <AppText style={styles.label}>Delivery</AppText>
//           <View style={styles.badge}>                               
//             <AppText style={styles.badgeText}>Today</AppText>
//           </View>
//         </View>

//         {/* Address Row */}
//         <View style={styles.infoRow}>
//           <MapPin size={20} color={COLORS.grey500} />
//           <AppText style={styles.infoText}>{item.address || 'Address Name here'}</AppText>
//         </View>

//         {/* Date Row */}
//         <View style={styles.infoRow}>
//           <Calendar size={20} color={COLORS.grey500} />
//           <AppText style={styles.infoText}>{item.date || 'January 02, 2024'}</AppText>
//         </View>
//       </View>

//       {/* 3. Right Section: Vertical Progress Timeline */}
//       <View style={styles.timelineContainer}>
//         <View style={styles.dot} />
//         <View style={styles.dashedLine} />
//         <View style={styles.truckCircle}>
//           <Truck size={10} color={COLORS.greenPrimary} fill={COLORS.greenPrimary} />
//         </View>
//         <View style={styles.dashedLine} />
//         <View style={styles.dot} />
//       </View>

//     </TouchableOpacity>
//   );
// });

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.md,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     overflow: 'hidden',
//     height: 180, // Fixed height to match design aspect ratio
//     marginVertical: SPACING.sm,
//     marginHorizontal:SPACING.sm
//   },
//   image: {
//     width: '40%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   content: {
//     flex: 1,
//     padding: SPACING.md,
//     justifyContent: 'space-between',
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   title: {
//     flex: 1,
//     fontSize: 17,
//     fontFamily: FONTS.bold,
//     color: COLORS.grey800,
//     lineHeight: 22,
//     paddingRight: SPACING.sm,
//   },
//   exportBtn: {
//     backgroundColor: COLORS.primary, // Gold color #B69556
//     padding: 6,
//     borderRadius: RADIUS.sm,
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SPACING.sm,
//     marginVertical: SPACING.xs,
//   },
//   label: {
//     fontSize: 18,
//     fontFamily: FONTS.medium,
//     color: COLORS.grey800,
//   },
//   badge: {
//     borderWidth: 1.5,
//     borderColor: COLORS.greenActive,
//     backgroundColor: COLORS.greenLightBg,
//     paddingHorizontal: 10 ,
//     paddingVertical: 4,
//     borderRadius: RADIUS.round,
//   },
//   badgeText: {
//     color: COLORS.greenActive,
//     fontFamily: FONTS.medium,
//     fontSize: 10,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: SPACING.sm,
//   },
//   infoText: {
//     fontSize: 10,
//     fontFamily: FONTS.regular,
//     color: COLORS.grey700,
//   },
//   /* Timeline Styles */
//   timelineContainer: {
//     width: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: SPACING.lg,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     borderWidth: 1.5,
//     borderColor: COLORS.grey300,
//     backgroundColor: COLORS.white,
//   },
//   dashedLine: {
//     width: 1,
//     flex: 1,
//     borderStyle: 'dashed',
//     borderWidth: 1,
//     borderColor: COLORS.grey300,
//     marginVertical: 2,
//   },
//   truckCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.greenActive,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.white,
//   },
// });

// export default ShipmentHorizontalCard;


import React, { memo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Calendar, ExternalLink, Truck } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants';
import AppText from '../common/AppText';

// Helper to format date (e.g., "2026-07-27..." -> "July 27, 2026")
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper to clean up status strings (e.g., "open_for_offers" -> "Open For Offers")
const formatStatus = (status: string) => {
  if (!status) return 'Unknown';
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper to extract City/Country from a full address string for the title
const getShortLocation = (address: string) => {
  if (!address) return '';
  const parts = address.split(',');
  if (parts.length < 2) return address;
  // Returns the last two parts (usually City, Country)
  return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`;
};

const ShipmentHorizontalCard = memo(({ item, onPress }: { item: any; onPress: () => void }) => {
  const horse = item.horses?.[0];
  const pickupDate = formatDate(item.pickupDateRange?.start);
  const statusLabel = formatStatus(item.status);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>

      {/* 1. Left Section: Horse Image */}
      <Image
        source={{ 
            uri: horse?.photo?.url || 'https://thumbs.dreamstime.com/b/simple-horse-logo-icon-vector-art-illustration-simple-horse-logo-icon-vector-art-illustration-features-clean-minimalist-design-351219938.jpg' 
        }}
        style={styles.image}
        resizeMode='stretch'
      />

      {/* 2. Middle Section: Details */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <AppText style={styles.title} numberOfLines={2}>
            {item.numberOfHorses} {item.numberOfHorses > 1 ? 'Horses' : 'Horse'} from {getShortLocation(item.pickupLocation)} to {getShortLocation(item.deliveryLocation)}
          </AppText>

          {/* Shipment Code / External Action */}
          <TouchableOpacity style={styles.exportBtn}>
            <ExternalLink size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusRow}>
          <AppText style={styles.label}>Status</AppText>
          <View style={[
              styles.badge, 
              { borderColor: item.status === 'open_for_offers' ? COLORS.greenActive : COLORS.primary }
          ]}>
            <AppText style={[
                styles.badgeText, 
                { color: item.status === 'open_for_offers' ? COLORS.greenActive : COLORS.primary }
            ]}>
                {statusLabel}
            </AppText>
          </View>
        </View>

        {/* Address Row (Pickup Location) */}
        <View style={styles.infoRow}>
          <MapPin size={16} color={COLORS.grey500} />
          <AppText style={styles.infoText} numberOfLines={1}>
            {item.pickupLocation}
          </AppText>
        </View>

        {/* Date Row (Pickup Date) */}
        <View style={styles.infoRow}>
          <Calendar size={16} color={COLORS.grey500} />
          <AppText style={styles.infoText}>
            {pickupDate}
          </AppText>
        </View>
      </View>

      {/* 3. Right Section: Vertical Progress Timeline */}
      <View style={styles.timelineContainer}>
        <View style={styles.dot} />
        <View style={styles.dashedLine} />
        <View style={[
            styles.truckCircle, 
            { borderColor: item.status === 'delivered' ? COLORS.greenActive : COLORS.grey300 }
        ]}>
          <Truck 
            size={12} 
            color={item.status === 'open_for_offers' ? COLORS.grey400 : COLORS.greenPrimary} 
            fill={item.status === 'open_for_offers' ? 'transparent' : COLORS.greenPrimary} 
          />
        </View>
        <View style={styles.dashedLine} />
        <View style={styles.dot} />
      </View>

    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    // height: 170, 
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.sm,
    // Add shadow for better depth
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  image: {
    width: '35%',
    height: '100%',
    backgroundColor: COLORS.grey100, // Background color if image fails
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.grey800,
    lineHeight: 18,
    paddingRight: SPACING.xs,
  },
  exportBtn: {
    backgroundColor: COLORS.primary, 
    padding: 6,
    borderRadius: RADIUS.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginVertical: 2,
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.grey600,
  },
  badge: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.grey700,
  },
  /* Timeline Styles */
  timelineContainer: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.grey50, // Subtle contrast for the timeline area
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.grey300,
    backgroundColor: COLORS.white,
  },
  dashedLine: {
    width: 1,
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.grey300,
    marginVertical: 2,
  },
  truckCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
});

export default ShipmentHorizontalCard;