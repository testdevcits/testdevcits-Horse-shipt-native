import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Truck, MapPin, ChevronRight } from 'lucide-react-native';
import { AppText } from '../../../../../components';
import styles from './styles.shipmenttab';

interface Props {
  navigation: any;
}

const ShipmentTab: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.tabSection}>
      {/* Vehicles & Capacity Card */}
      <TouchableOpacity
        style={styles.shipmentRowCard}
        onPress={() => navigation.navigate('MyVehicles')}
        activeOpacity={0.8}
      >
        <View style={styles.shipmentRowIconBox}>
          <Truck size={20} color="#A06333" />
        </View>
        <View style={styles.shipmentRowContent}>
          <AppText style={styles.shipmentRowTitle}>Vehicles & Capacity</AppText>
          <AppText style={styles.shipmentRowSub}>
            Manage your shipment capacity and vehicle information.
          </AppText>
        </View>
        <ChevronRight size={18} color="#94A3B8" />
      </TouchableOpacity>

      {/* Preferred Areas Card */}
      <TouchableOpacity
        style={styles.shipmentRowCard}
        onPress={() => navigation.navigate('PreferredAreas')}
        activeOpacity={0.8}
      >
        <View style={styles.shipmentRowIconBox}>
          <MapPin size={20} color="#A06333" />
        </View>
        <View style={styles.shipmentRowContent}>
          <AppText style={styles.shipmentRowTitle}>Preferred Areas</AppText>
          <AppText style={styles.shipmentRowSub}>
            Set your working areas to get better shipment matches.
          </AppText>
        </View>
        <ChevronRight size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
};

export default ShipmentTab;
