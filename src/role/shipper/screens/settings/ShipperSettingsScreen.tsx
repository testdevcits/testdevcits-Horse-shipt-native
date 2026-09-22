import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { AppHeader, AppText, SettingsSkeleton } from '../../../../components';
import { COLORS } from '../../../../constants';
import styles from './styles.shippersettings';
import AppIcon from '../../../../components/app_icon/AppIcon';
import useShipperNotificationSetting from './useShipperNotificationSetting';

const ShipperSettingsScreen = () => {
  const {
    NOTIFICATION_ITEMS,
    loading,
    refreshing,
    onRefresh,
    handleToggleNotification,
    notifications,
  } = useShipperNotificationSetting();

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" showProfileImage={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <AppText style={styles.sectionHeaderTitle}>Notifications</AppText>
        <AppText style={styles.sectionHeaderSub}>
          Choose how and when you receive updates about your shipments and
          activity.
        </AppText>

        {loading && !refreshing ? (
          <SettingsSkeleton />
        ) : (
          <>
            {/* Shipment Notifications Card */}
            <View style={styles.notificationsCard}>
              <View style={styles.subCardHeader}>
                <View style={styles.goldSquareIconBox}>
                  <AppIcon name={'Bell'} size={22} color={COLORS.saddleBrown} />
                </View>

                <View style={styles.subHeaderTextCol}>
                  <AppText style={styles.subHeaderTitle}>
                    Shipment Notifications
                  </AppText>
                  <AppText style={styles.subHeaderSub}>
                    Configure email & SMS alerts for carrier activity
                  </AppText>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Column Headers */}
              <View style={styles.notifColHeadersRow}>
                <AppText style={styles.notifChannelText}>Email</AppText>
                <AppText style={styles.notifChannelText}>SMS</AppText>
              </View>

              {/* Notification Rows */}
              {NOTIFICATION_ITEMS.map((item, idx) => {
                const isEmailChecked = notifications[item?.key]?.email;
                const isSmsChecked = notifications[item?.key]?.sms;
                const isLast = idx === NOTIFICATION_ITEMS.length - 1;

                return (
                  <View
                    key={item?.key}
                    style={[
                      styles.notifItemRow,
                      isLast && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View style={styles.notifTextCol}>
                      <AppText style={styles.notifItemTitle}>
                        {item?.title}
                      </AppText>
                      <AppText style={styles.notifItemDesc}>
                        {item?.desc}
                      </AppText>
                    </View>

                    <View style={styles.notifCheckboxesCol}>
                      {/* Email Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.notifCheckbox,
                          isEmailChecked && styles.notifCheckboxActive,
                        ]}
                        onPress={() =>
                          handleToggleNotification(item?.key, 'email')
                        }
                        activeOpacity={0.8}
                      >
                        {isEmailChecked && (
                          <AppIcon
                            name={'Check'}
                            size={14}
                            color={COLORS.saddleBrown}
                          />
                        )}
                      </TouchableOpacity>

                      {/* SMS Checkbox */}
                      <TouchableOpacity
                        style={[
                          styles.notifCheckbox,
                          isSmsChecked && styles.notifCheckboxActive,
                        ]}
                        onPress={() =>
                          handleToggleNotification(item?.key, 'sms')
                        }
                        activeOpacity={0.8}
                      >
                        {isSmsChecked && (
                          <AppIcon
                            name={'Check'}
                            size={14}
                            color={COLORS.saddleBrown}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Bottom Callout Banner */}
            <View style={styles.calloutBanner}>
              <AppText style={styles.calloutText}>
                SMS notifications may incur carrier charges depending on your
                plan.
              </AppText>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ShipperSettingsScreen;
