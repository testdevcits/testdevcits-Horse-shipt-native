import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '../../../../../components';
import AppIcon from '../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../constants';
import styles from '../styles.profile';

interface ProfileMenuSectionProps {
  profile: any;
  user: any;
  refetch: () => void;
  navigateTo: (screenName: string, params?: any) => void;
  onLogout: () => void;
}

const ProfileMenuSection: React.FC<ProfileMenuSectionProps> = ({
  profile,
  user,
  refetch,
  navigateTo,
  onLogout,
}) => {
  return (
    <>
      {/* SECTION 1: ACCOUNT & HORSES */}
      <View style={styles.menuSection}>
        <AppText style={styles.sectionTitle}>Account & Profile</AppText>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigateTo('EditProfile', {
                profileData: profile,
                user,
                onSuccess: () => {
                  refetch();
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
                Name, phone number & contact email
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('Horses')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="Heart" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>My Horses</AppText>
              <AppText style={styles.menuItemSub}>
                Registered horses, breeds & health records
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => navigateTo('Shipments')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="Truck" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>My Shipments</AppText>
              <AppText style={styles.menuItemSub}>
                Active transport bookings & shipment history
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION 2: PAYMENTS & BILLING */}
      <View style={styles.menuSection}>
        <AppText style={styles.sectionTitle}>Payments & Transactions</AppText>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => navigateTo('Payments')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="CreditCard" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>
                Payment History & Methods
              </AppText>
              <AppText style={styles.menuItemSub}>
                Transaction receipts & payment details
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION 3: PREFERENCES & SUPPORT */}
      <View style={styles.menuSection}>
        <AppText style={styles.sectionTitle}>Preferences & Support</AppText>
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('Settings')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="Bell" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>
                Notification Preferences
              </AppText>
              <AppText style={styles.menuItemSub}>
                Manage Email, Push & SMS alerts
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('Reviews')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon
                name="MessageSquare"
                size={18}
                color={COLORS.saddleBrown}
              />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>Reviews & Feedback</AppText>
              <AppText style={styles.menuItemSub}>
                Ratings & feedback left for shippers
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('HelpCenter')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="HelpCircle" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>Help & Support</AppText>
              <AppText style={styles.menuItemSub}>
                FAQs, customer support & live chat
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateTo('PrivacyPolicy')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="Lock" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>Privacy Policy</AppText>
              <AppText style={styles.menuItemSub}>
                How your profile & location data is protected
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() => navigateTo('TermsAndConditions')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconBox}>
              <AppIcon name="FileText" size={18} color={COLORS.saddleBrown} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={styles.menuItemTitle}>Terms & Conditions</AppText>
              <AppText style={styles.menuItemSub}>
                HorseShipt platform rules & agreement
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION 4: ACCOUNT ACTION */}
      <View style={styles.menuSection}>
        <AppText style={styles.sectionTitle}>Account Actions</AppText>
        <View style={[styles.menuCard, localStyles.logoutCard]}>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.menuIconBox,
                { backgroundColor: COLORS.redLightBg },
              ]}
            >
              <AppIcon name="LogOut" size={18} color={COLORS.error} />
            </View>
            <View style={styles.menuContent}>
              <AppText style={[styles.menuItemTitle, { color: COLORS.error }]}>
                Log Out
              </AppText>
              <AppText style={styles.menuItemSub}>
                Sign out of your account
              </AppText>
            </View>
            <AppIcon name="ChevronRight" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const localStyles = StyleSheet.create({
  logoutCard: {
    borderColor: COLORS.redBorder,
    backgroundColor: COLORS.redLightBg,
  },
});

export default memo(ProfileMenuSection);
