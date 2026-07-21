// import React, { useState, useRef } from 'react';
// import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import { Calendar } from 'react-native-calendars';
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import { MapPin, Calendar as CalendarIcon, X, Navigation } from 'lucide-react-native';
// import { AppText } from '../../../../../components';
// import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
// import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';

// // NOTE: Replace with your actual API Key
// // const GOOGLE_MAPS_APIKEY = 'AIzaSyB9xCC-TZ0ZY6zHShavQvD45blCq7AXVRQ';

// const PickupStep = ({ form, updateForm }: any) => {
//   const mapRef = useRef<MapView>(null);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectingDate, setSelectingDate] = useState<'start' | 'end'>('start');

//   const formatDateForCalendar = (date: Date) => date.toISOString().split('T')[0];

//   const getMarkedDates = () => {
//     const start = formatDateForCalendar(new Date(form.pickupStartDate));
//     const end = formatDateForCalendar(new Date(form.pickupEndDate));
//     return {
//       [start]: { startingDay: true, color: COLORS.goldPrimary, textColor: 'white' },
//       [end]: { endingDay: true, color: COLORS.goldPrimary, textColor: 'white' },
//     };
//   };

//   // Handle address selection
//   const handlePlaceSelect = (data: any, details: any = null) => {
//     console.log("====data=====", data)
//     console.log("=====details====", details)

//     if (details) {
//       const { lat, lng } = details.geometry.location;
//       const address = data.description || details.formatted_address;

//       updateForm({
//         pickupLocation: address,
//         pickupLat: lat,
//         pickupLng: lng,
//       });

//       // Animate map to the selected location
//       mapRef.current?.animateToRegion({
//         latitude: lat,
//         longitude: lng,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       }, 1000);
//     }
//   };

//   return (
//     <View style={styles.content}>
//       <AppText style={styles.label}>Pickup Location *</AppText>

//       {/* 1. AUTOCOMPLETE SECTION (Wrapped in View for Z-Index) */}
//       <View style={styles.searchContainer}>
//         <GooglePlacesAutocomplete
//           placeholder="Search pickup address"
//           fetchDetails={true}
//           onPress={handlePlaceSelect}
//           query={{
//             key: GOOGLE_MAPS_APIKEY,
//             language: 'en',
//             types: 'address',
//           }}
//           renderLeftButton={() => (
//             <View style={styles.searchIconWrapper}>
//               <MapPin size={18} color={COLORS.goldPrimary} />
//             </View>
//           )}
//           styles={{
//             container: styles.autoCompleteContainer,
//             textInput: styles.autoCompleteInput,
//             listView: styles.autoCompleteListView,
//             row: styles.autoCompleteRow,
//             description: styles.autoCompleteDescription,
//             predefinedPlacesDescription: { color: COLORS.goldPrimary },
//           }}
//           enablePoweredByContainer={false}
//           minLength={2}
//           nearbyPlacesAPI="GooglePlacesSearch"
//           debounce={400}
//         />
//       </View>

//       {/* 2. MAP SECTION */}
//       <View style={styles.mapCard}>
//         <View style={styles.mapWrapper}>
//           <MapView
//             ref={mapRef}
//             provider={PROVIDER_GOOGLE}
//             style={styles.map}
//             region={{
//               latitude: form.pickupLat,
//               longitude: form.pickupLng,
//               latitudeDelta: 0.05,
//               longitudeDelta: 0.05,
//             }}
//           >
//             <Marker
//               coordinate={{ latitude: form.pickupLat, longitude: form.pickupLng }}
//               title="Pickup Point"
//             >
//               <View style={styles.customMarker}>
//                 <Navigation size={20} color={COLORS.white} fill={COLORS.goldPrimary} />
//               </View>
//             </Marker>
//           </MapView>
//         </View>
//         <View style={styles.mapFooter}>
//           <AppText style={styles.mapAddress} numberOfLines={1}>
//             {form.pickupLocation || "Selected location will appear here"}
//           </AppText>
//         </View>
//       </View>

//       {/* 3. DATE RANGE SECTION */}
//       <AppText style={styles.label}>Pickup Date Range *</AppText>
//       <View style={styles.dateCard}>
//         <TouchableOpacity
//           style={styles.dateBlock}
//           onPress={() => { setSelectingDate('start'); setShowCalendar(true); }}
//         >
//           <AppText style={styles.dateSubLabel}>START DATE</AppText>
//           <View style={styles.dateInfo}>
//             <CalendarIcon size={16} color={COLORS.goldPrimary} />
//             <AppText style={styles.dateText}>
//               {new Date(form.pickupStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             </AppText>
//           </View>
//         </TouchableOpacity>

//         <View style={styles.vDivider} />

//         <TouchableOpacity
//           style={styles.dateBlock}
//           onPress={() => { setSelectingDate('end'); setShowCalendar(true); }}
//         >
//           <AppText style={styles.dateSubLabel}>END DATE</AppText>
//           <View style={styles.dateInfo}>
//             <CalendarIcon size={16} color={COLORS.goldPrimary} />
//             <AppText style={styles.dateText}>
//               {new Date(form.pickupEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//             </AppText>
//           </View>
//         </TouchableOpacity>
//       </View>

//       {/* CALENDAR MODAL */}
//       <Modal visible={showCalendar} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.calendarCard}>
//             <View style={styles.modalHeader}>
//               <AppText style={styles.modalTitle}>Select Date</AppText>
//               <TouchableOpacity onPress={() => setShowCalendar(false)}><X size={24} color={COLORS.textPrimary} /></TouchableOpacity>
//             </View>
//             <Calendar
//               minDate={formatDateForCalendar(new Date())}
//               onDayPress={(day) => {
//                 if (selectingDate === 'start') {
//                   updateForm({ pickupStartDate: new Date(day.timestamp), pickupEndDate: new Date(day.timestamp) });
//                 } else {
//                   updateForm({ pickupEndDate: new Date(day.timestamp) });
//                 }
//                 setShowCalendar(false);
//               }}
//               theme={{ selectedDayBackgroundColor: COLORS.goldPrimary, todayTextColor: COLORS.goldPrimary }}
//               markedDates={getMarkedDates()}
//               markingType={'period'}
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   content: { flex: 1, padding: SPACING.lg },
//   label: { fontFamily: FONTS.bold, fontSize: 14, color: COLORS.goldDarkText, marginBottom: SPACING.sm },

//   // Autocomplete Styling
//   searchContainer: {
//     zIndex: 10, // Essential for suggestions to overlay map
//     marginBottom: SPACING.md,
//   },
//   autoCompleteContainer: {
//     flex: 0,
//   },
//   autoCompleteInput: {
//     height: 52,
//     backgroundColor: COLORS.white,
//     fontFamily: FONTS.medium,
//     fontSize: 14,
//     color: COLORS.textPrimary,
//     borderRadius: RADIUS.md,
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//     paddingLeft: 45, // Space for the icon
//   },
//   searchIconWrapper: {
//     position: 'absolute',
//     left: 15,
//     top: 17,
//     zIndex: 11,
//   },
//   autoCompleteListView: {
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.md,
//     marginTop: 5,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//   },
//   autoCompleteRow: {
//     padding: 13,
//     height: 50,
//     flexDirection: 'row',
//   },
//   autoCompleteDescription: {
//     fontFamily: FONTS.medium,
//     color: COLORS.textPrimary,
//   },

//   // Map Card
//   mapCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.lg,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//     marginBottom: SPACING.xl,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//   },
//   mapWrapper: { height: 180 },
//   map: { ...StyleSheet.absoluteFillObject },
//   mapFooter: { padding: SPACING.md, backgroundColor: COLORS.grey50 },
//   mapAddress: { fontSize: 12, color: COLORS.textSecondary, fontFamily: FONTS.medium },
//   customMarker: {
//     padding: 5,
//     backgroundColor: COLORS.white,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },

//   // Date Styling
//   dateCard: {
//     flexDirection: 'row',
//     backgroundColor: COLORS.white,
//     borderRadius: RADIUS.lg,
//     padding: SPACING.md,
//     borderWidth: 1,
//     borderColor: COLORS.divider,
//     alignItems: 'center',
//   },
//   dateBlock: { flex: 1 },
//   dateSubLabel: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.textLight, letterSpacing: 0.5, marginBottom: 4 },
//   dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   dateText: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.textPrimary },
//   vDivider: { width: 1, height: 35, backgroundColor: COLORS.divider, marginHorizontal: SPACING.md },

//   // Modal
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: SPACING.lg },
//   calendarCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
//   modalTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
// });

// export default PickupStep;


import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Calendar } from 'react-native-calendars';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  X, 
  Navigation, 
  ChevronRight 
} from 'lucide-react-native';

import { AppText } from '../../../../../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../../../constants';
import { GOOGLE_MAPS_APIKEY } from '../../../../../config/constants';

interface PickupStepProps {
  form: any;
  updateForm: (updates: any) => void;
}

const PickupStep: React.FC<PickupStepProps> = ({ form, updateForm }) => {
  const mapRef = useRef<MapView>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingDate, setSelectingDate] = useState<'start' | 'end'>('start');

  // Fallback coordinates (India center) to prevent map crash
  const INITIAL_REGION = {
    latitude: form.pickupLat || 20.5937,
    longitude: form.pickupLng || 78.9629,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const formatDateForCalendar = (date: Date) => {
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  const getMarkedDates = () => {
    const start = formatDateForCalendar(form.pickupStartDate);
    const end = formatDateForCalendar(form.pickupEndDate);
    return {
      [start]: { startingDay: true, color: COLORS.goldPrimary, textColor: 'white' },
      [end]: { endingDay: true, color: COLORS.goldPrimary, textColor: 'white' },
    };
  };

  const handlePlaceSelect = (data: any, details: any = null) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const address = data.description || details.formatted_address;

      updateForm({
        pickupLocation: address,
        pickupLat: lat,
        pickupLng: lng,
      });

      // Fly to the new location
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1200);
    }
  };

  return (
    <View style={styles.content}>
      <AppText style={styles.label}>Pickup Location *</AppText>

      {/* 1. GOOGLE AUTOCOMPLETE (Z-Index is critical here) */}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search pickup address"
          fetchDetails={true}
          onPress={handlePlaceSelect}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: 'en',
            types: 'address',
          }}
          renderLeftButton={() => (
            <View style={styles.searchIconWrapper}>
              <MapPin size={18} color={COLORS.goldPrimary} />
            </View>
          )}
          styles={{
            container: { flex: 0 },
            textInput: styles.autoCompleteInput,
            listView: styles.autoCompleteListView,
            row: styles.autoCompleteRow,
            description: styles.autoCompleteDescription,
          }}
          enablePoweredByContainer={false}
          minLength={2}
          debounce={400}
          keepResultsAfterBlur={true}
          keyboardShouldPersistTaps="handled"
        />
      </View>

      {/* 2. INTERACTIVE MAP CARD */}
      <View style={styles.mapCard}>
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={INITIAL_REGION}
          >
            {form.pickupLat && (
              <Marker
                coordinate={{ latitude: form.pickupLat, longitude: form.pickupLng }}
              >
                <View style={styles.customMarker}>
                  <Navigation size={18} color={COLORS.white} fill={COLORS.goldPrimary} />
                </View>
              </Marker>
            )}
          </MapView>
        </View>
        <View style={styles.mapFooter}>
          <AppText style={styles.mapAddress} numberOfLines={1}>
            {form.pickupLocation || "Address will appear here..."}
          </AppText>
        </View>
      </View>

      {/* 3. DATE RANGE SECTION */}
      <AppText style={styles.label}>Pickup Date Range *</AppText>
      <View style={styles.dateCard}>
        <TouchableOpacity
          style={styles.dateBlock}
          activeOpacity={0.7}
          onPress={() => { setSelectingDate('start'); setShowCalendar(true); }}
        >
          <AppText style={styles.dateSubLabel}>START DATE</AppText>
          <View style={styles.dateInfo}>
            <CalendarIcon size={16} color={COLORS.goldPrimary} />
            <AppText style={styles.dateText}>
              {new Date(form.pickupStartDate).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric' 
              })}
            </AppText>
          </View>
        </TouchableOpacity>

        <View style={styles.vDivider} />

        <TouchableOpacity
          style={styles.dateBlock}
          activeOpacity={0.7}
          onPress={() => { setSelectingDate('end'); setShowCalendar(true); }}
        >
          <AppText style={styles.dateSubLabel}>END DATE</AppText>
          <View style={styles.dateInfo}>
            <CalendarIcon size={16} color={COLORS.goldPrimary} />
            <AppText style={styles.dateText}>
              {new Date(form.pickupEndDate).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric' 
              })}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>

      {/* CALENDAR MODAL */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarCard}>
            <View style={styles.modalHeader}>
              <View>
                <AppText style={styles.modalTitle}>Select Date</AppText>
                <AppText style={styles.modalSubtitle}>
                    Pick a {selectingDate === 'start' ? 'start' : 'deadline'} date
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <Calendar
              minDate={formatDateForCalendar(new Date())}
              onDayPress={(day: any) => {
                const selectedDate = new Date(day.timestamp);
                if (selectingDate === 'start') {
                  updateForm({ 
                    pickupStartDate: selectedDate, 
                    pickupEndDate: selectedDate // Default end to same as start
                  });
                } else {
                  updateForm({ pickupEndDate: selectedDate });
                }
                setShowCalendar(false);
              }}
              theme={{
                selectedDayBackgroundColor: COLORS.goldPrimary,
                todayTextColor: COLORS.goldPrimary,
                arrowColor: COLORS.goldPrimary,
                textDayFontFamily: FONTS.medium,
                textMonthFontFamily: FONTS.bold,
              }}
              markedDates={getMarkedDates()}
              markingType={'period'}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: { 
    flex: 1, 
    padding: SPACING.lg,
    backgroundColor: COLORS.background 
  },
  label: { 
    fontFamily: FONTS.bold, 
    fontSize: 14, 
    color: COLORS.goldDarkText, 
    marginBottom: SPACING.sm 
  },

  // Autocomplete Container & List
  searchContainer: {
    zIndex: 9999,      // Ensures dropdown is on top of map
    elevation: 10,     // Required for Android shadow/layering
    marginBottom: SPACING.md,
    position: 'relative',
  },
  searchIconWrapper: {
    position: 'absolute',
    left: 15,
    top: 17,
    zIndex: 10001,
  },
  autoCompleteInput: {
    height: 52,
    backgroundColor: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    paddingLeft: 45,
    paddingRight: 15,
  },
  autoCompleteListView: {
    position: 'absolute',
    top: 55,             // Right below the input
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    elevation: 11,
    zIndex: 10000,
    borderWidth: 1,
    borderColor: COLORS.divider,
    maxHeight: 220,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  autoCompleteRow: {
    padding: 15,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  autoCompleteDescription: {
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
    fontSize: 13,
  },

  // Map Card Styling
  mapCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
    marginBottom: SPACING.xl,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  mapWrapper: { height: 190 },
  map: { ...StyleSheet.absoluteFillObject },
  mapFooter: { 
    padding: SPACING.md, 
    backgroundColor: COLORS.grey50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  mapAddress: { 
    fontSize: 12, 
    color: COLORS.textSecondary, 
    fontFamily: FONTS.medium,
    flex: 1 
  },
  customMarker: {
    padding: 6,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.round,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  // Date Card Layout
  dateCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.divider,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  dateBlock: { flex: 1 },
  dateSubLabel: { 
    fontSize: 10, 
    fontFamily: FONTS.bold, 
    color: COLORS.textLight, 
    letterSpacing: 0.5, 
    marginBottom: 4 
  },
  dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  vDivider: { 
    width: 1, 
    height: 35, 
    backgroundColor: COLORS.divider, 
    marginHorizontal: SPACING.md 
  },

  // Modal Overlays
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(15, 23, 42, 0.4)', 
    justifyContent: 'center', 
    padding: SPACING.lg 
  },
  calendarCard: { 
    backgroundColor: COLORS.white, 
    borderRadius: RADIUS.xl, 
    padding: SPACING.lg,
    elevation: 20 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: SPACING.md 
  },
  modalTitle: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.textPrimary },
  modalSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
});

export default PickupStep;