import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from './styles.shipperprofile';

interface FleetNavigationCardProps {
  navigation: any;
  profileData: any;
  user: any;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
}

const FleetNavigationCard: React.FC<FleetNavigationCardProps> = ({
  navigation,
  profileData,
  user,
  setProfileData,
}) => {
  return (
    <View style={styles.menuSection}>
      <AppText style={styles.sectionTitle}>Account & Fleet</AppText>
      <View style={styles.menuCard}>
        {/* Edit Personal Profile */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            navigation.navigate('EditProfile', {
              profileData,
              user,
              onSuccess: (updatedData: any) => {
                setProfileData((prev: any) => ({
                  ...prev,
                  ...updatedData,
                }));
              },
            })
          }
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="User" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>Personal Info</AppText>
            <AppText style={styles.menuItemSub}>
              Name, phone, bio & operating location
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Operating Service Areas */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PreferredAreas')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="MapPin" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>
              Service Coverage Areas
            </AppText>
            <AppText style={styles.menuItemSub}>
              Operating zones & bidding preferences
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Google Review Link */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('GoogleReview')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="Star" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>
              Google Review Link
            </AppText>
            <AppText style={styles.menuItemSub}>
              Connect your Google Business reviews
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* My Vehicles & Capacity */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyVehicles')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="Truck" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>
              My Vehicles & Fleet
            </AppText>
            <AppText style={styles.menuItemSub}>
              Trucks, trailers & capacity management
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>

        {/* Truck Drivers */}
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemLast]}
          onPress={() => navigation.navigate('TruckDriver')}
          activeOpacity={0.7}
        >
          <View style={styles.menuIconBox}>
            <AppIcon name="Users" size={18} color={COLORS.saddleBrown} />
          </View>
          <View style={styles.menuContent}>
            <AppText style={styles.menuItemTitle}>Truck Drivers</AppText>
            <AppText style={styles.menuItemSub}>
              Manage driver accounts & assignments
            </AppText>
          </View>
          <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(FleetNavigationCard);