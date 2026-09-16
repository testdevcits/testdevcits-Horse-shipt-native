import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, StatusBar } from 'react-native';

import {
  COLORS,
  FONTS,
  FONT_SIZE,
  ICON_SIZE,
  RADIUS,
  SPACING,
  SIZES,
} from '../../../../constants';

import AppIcon from '../../../../components/app_icon/AppIcon';
import { AppHeader, AppText } from '../../../../components';
import { moderateScale } from 'react-native-size-matters';

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DateRange {
  start: string;
  end: string;
}

interface Horse {
  photo?: {
    url?: string | null;
    public_id?: string | null;
  };
  registeredName?: string;
  barnName?: string;
  breed?: string;
  otherBreed?: string;
  sex?: string;
  colour?: string;
  age?: number;
  requestedStallSize?: string;
  generalInfo?: string;
  notes?: string;
}

interface Shipment {
  _id?: string;
  shipmentCode?: string;
  status?: string;

  pickupCoords?: Coordinates;
  deliveryCoords?: Coordinates;

  pickupDateRange?: DateRange;
  deliveryDateRange?: DateRange;

  pickupLocation?: string;
  deliveryLocation?: string;

  numberOfHorses?: number;
  horses?: Horse[];
}

interface Customer {
  _id?: string;
  name?: string;
  email?: string;
}

interface QuoteData {
  _id?: string;

  pickupCoords?: Coordinates;
  deliveryCoords?: Coordinates;

  shipment?: Shipment;

  customer?: Customer;

  shipper?: string;

  shipmentCode?: string;

  pickupLocation?: string;
  deliveryLocation?: string;

  message?: string;

  status?: string;

  isSeen?: boolean;

  respondedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  route: {
    params?: {
      data?: QuoteData;
      quote?: QuoteData;
      item?: QuoteData;

      // Also supports passing the object directly as params.
      [key: string]: any;
    };
  };

  navigation: any;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatDate = (date?: string) => {
  if (!date) {
    return '--';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '--';
  }

  return parsedDate.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (date?: string) => {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'open_for_offers':
      return 'Open for Offers';
    case 'accepted':
      return 'Accepted';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status
        ? status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
        : 'Pending';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'accepted':
      return COLORS.greenPrimary;

    case 'completed':
      return COLORS.greenSuccess;

    case 'cancelled':
      return COLORS.redPrimary;

    case 'open_for_offers':
      return COLORS.bluePrimary;

    case 'pending':
    default:
      return COLORS.amberPrimary;
  }
};

const truncateText = (text = '', maxLength = 90) => {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};

/* -------------------------------------------------------------------------- */
/* Screen                                                                     */
/* -------------------------------------------------------------------------- */

const QuoteReceivedDetail = ({ route, navigation }: Props) => {
  /**
   * Supports:
   *
   * navigation.navigate('QuoteReceivedDetail', {
   *   data: quoteData,
   * });
   *
   * OR:
   *
   * navigation.navigate('QuoteReceivedDetail', quoteData);
   */
  const params = route?.params || {};

  const quote: QuoteData = useMemo(() => {
    return (params.data || params.quote || params.item || params) as QuoteData;
  }, [params]);

  const shipment = quote?.shipment;

  const horse = shipment?.horses?.[0];

  const status = quote?.status || 'pending';

  const statusColor = getStatusColor(status);

  const pickupLocation =
    quote?.pickupLocation ||
    shipment?.pickupLocation ||
    'Pickup location unavailable';

  const deliveryLocation =
    quote?.deliveryLocation ||
    shipment?.deliveryLocation ||
    'Delivery location unavailable';

  const pickupDate = shipment?.pickupDateRange?.start;

  const deliveryDate = shipment?.deliveryDateRange?.start;

  const shipmentCode =
    quote?.shipmentCode || shipment?.shipmentCode || 'HS-SHIP';

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <AppHeader
        showBack
        title="Quote Detail"
        showProfileImage={false}
        showNotificationIcon={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Status Hero                                                      */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.shipmentIcon}>
              <AppIcon
                name="Truck"
                size={ICON_SIZE.xl}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.heroInfo}>
              <AppText style={styles.heroLabel}>SHIPMENT REQUEST</AppText>

              <AppText style={styles.heroCode}>{shipmentCode}</AppText>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: `${statusColor}15`,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: statusColor,
                  },
                ]}
              />

              <AppText
                style={[
                  styles.statusText,
                  {
                    color: statusColor,
                  },
                ]}
              >
                {getStatusLabel(status)}
              </AppText>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottomRow}>
            <View style={styles.heroMeta}>
              <AppIcon
                name="Calendar"
                size={ICON_SIZE.sm}
                color={COLORS.textSecondary}
              />

              <AppText style={styles.heroMetaText}>
                Requested {formatDate(quote?.createdAt)}
              </AppText>
            </View>

            <View style={styles.heroMeta}>
              <AppIcon
                name="Box"
                size={ICON_SIZE.sm}
                color={COLORS.textSecondary}
              />

              <AppText style={styles.heroMetaText}>
                {shipment?.numberOfHorses || 1}{' '}
                {shipment?.numberOfHorses === 1 ? 'Horse' : 'Horses'}
              </AppText>
            </View>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Route                                                             */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.sectionHeader}>
          <View>
            <AppText style={styles.sectionTitle}>Shipment Route</AppText>

            <AppText style={styles.sectionSubtitle}>
              Pickup and delivery details
            </AppText>
          </View>

          <View style={styles.routeIcon}>
            <AppIcon name="Route" size={ICON_SIZE.sm} color={COLORS.primary} />
          </View>
        </View>

        <View style={styles.routeCard}>
          {/* Pickup */}

          <View style={styles.locationRow}>
            <View style={styles.timelineContainer}>
              <View
                style={[
                  styles.locationDot,
                  {
                    backgroundColor: COLORS.greenPrimary,
                  },
                ]}
              />

              <View style={styles.timelineLine} />
            </View>

            <View style={styles.locationContent}>
              <View style={styles.locationHeader}>
                <AppText style={styles.locationType}>PICKUP</AppText>

                <View style={styles.datePill}>
                  <AppIcon
                    name="Calendar"
                    size={ICON_SIZE.xs}
                    color={COLORS.greenPrimary}
                  />

                  <AppText style={styles.datePillText}>
                    {formatDate(pickupDate)}
                  </AppText>
                </View>
              </View>

              <AppText style={styles.locationText}>{pickupLocation}</AppText>

              {pickupDate && (
                <View style={styles.timeRow}>
                  <AppIcon
                    name="Clock"
                    size={ICON_SIZE.xs}
                    color={COLORS.textLight}
                  />

                  <AppText style={styles.timeText}>
                    {formatTime(pickupDate) || 'Scheduled pickup'}
                  </AppText>
                </View>
              )}
            </View>
          </View>

          {/* Delivery */}

          <View style={styles.locationRow}>
            <View style={styles.timelineContainer}>
              <View
                style={[
                  styles.locationDot,
                  {
                    backgroundColor: COLORS.redPrimary,
                  },
                ]}
              />
            </View>

            <View style={styles.locationContent}>
              <View style={styles.locationHeader}>
                <AppText style={styles.locationType}>DELIVERY</AppText>

                <View
                  style={[
                    styles.datePill,
                    {
                      backgroundColor: COLORS.redLightBg,
                    },
                  ]}
                >
                  <AppIcon
                    name="Calendar"
                    size={ICON_SIZE.xs}
                    color={COLORS.redPrimary}
                  />

                  <AppText
                    style={[
                      styles.datePillText,
                      {
                        color: COLORS.redPrimary,
                      },
                    ]}
                  >
                    {formatDate(deliveryDate)}
                  </AppText>
                </View>
              </View>

              <AppText style={styles.locationText}>{deliveryLocation}</AppText>

              {deliveryDate && (
                <View style={styles.timeRow}>
                  <AppIcon
                    name="Clock"
                    size={ICON_SIZE.xs}
                    color={COLORS.textLight}
                  />

                  <AppText style={styles.timeText}>
                    {formatTime(deliveryDate) || 'Scheduled delivery'}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Shipment Summary                                                 */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryTitleRow}>
              <View style={styles.smallIconContainer}>
                <AppIcon
                  name="Package"
                  size={ICON_SIZE.sm}
                  color={COLORS.primary}
                />
              </View>

              <AppText style={styles.summaryTitle}>Shipment Summary</AppText>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>HORSES</AppText>

              <AppText style={styles.summaryValue}>
                {shipment?.numberOfHorses || 1}
              </AppText>
            </View>

            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>SHIPMENT</AppText>

              <AppText style={styles.summaryValueSmall} numberOfLines={1}>
                {shipment?.status ? getStatusLabel(shipment.status) : 'Open'}
              </AppText>
            </View>

            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>PICKUP</AppText>

              <AppText style={styles.summaryValueSmall}>
                {formatDate(pickupDate)}
              </AppText>
            </View>

            <View style={styles.summaryItem}>
              <AppText style={styles.summaryLabel}>DELIVERY</AppText>

              <AppText style={styles.summaryValueSmall}>
                {formatDate(deliveryDate)}
              </AppText>
            </View>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Horse Details                                                    */}
        {/* ---------------------------------------------------------------- */}

        {horse && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <AppText style={styles.sectionTitle}>Horse Details</AppText>

                <AppText style={styles.sectionSubtitle}>
                  Information provided for this shipment
                </AppText>
              </View>
            </View>

            <View style={styles.horseCard}>
              <View style={styles.horseHeader}>
                <View style={styles.horseAvatar}>
                  <AppIcon
                    name="Heart"
                    size={ICON_SIZE.lg}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.horseNameContainer}>
                  <AppText style={styles.horseName}>
                    {horse?.registeredName || 'Unnamed Horse'}
                  </AppText>

                  <AppText style={styles.horseBarnName}>
                    {horse?.barnName || 'Barn not specified'}
                  </AppText>
                </View>

                <View style={styles.horseAgeBadge}>
                  <AppText style={styles.horseAge}>
                    {horse?.age ?? '--'}
                  </AppText>

                  <AppText style={styles.horseAgeLabel}>yrs</AppText>
                </View>
              </View>

              <View style={styles.horseDivider} />

              <View style={styles.horseDetailsGrid}>
                <HorseDetail
                  icon="Award"
                  label="Breed"
                  value={horse?.breed || horse?.otherBreed || 'Not specified'}
                />

                <HorseDetail
                  icon="User"
                  label="Sex"
                  value={horse?.sex || 'Not specified'}
                />

                <HorseDetail
                  icon="Circle"
                  label="Colour"
                  value={horse?.colour || 'Not specified'}
                />

                <HorseDetail
                  icon="Box"
                  label="Stall Size"
                  value={horse?.requestedStallSize || 'Not specified'}
                />
              </View>

              {horse?.generalInfo && (
                <View style={styles.infoBox}>
                  <View style={styles.infoBoxHeader}>
                    <AppIcon
                      name="Info"
                      size={ICON_SIZE.xs}
                      color={COLORS.primary}
                    />

                    <AppText style={styles.infoBoxTitle}>
                      General Information
                    </AppText>
                  </View>

                  <AppText style={styles.infoBoxText}>
                    {horse?.generalInfo}
                  </AppText>
                </View>
              )}

              {horse?.notes && (
                <View style={styles.notesBox}>
                  <View style={styles.infoBoxHeader}>
                    <AppIcon
                      name="FileText"
                      size={ICON_SIZE.xs}
                      color={COLORS.textSecondary}
                    />

                    <AppText style={styles.notesTitle}>Notes</AppText>
                  </View>

                  <AppText style={styles.notesText}>{horse?.notes}</AppText>
                </View>
              )}
            </View>
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Customer                                                          */}
        {/* ---------------------------------------------------------------- */}

        {quote?.customer && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <AppText style={styles.sectionTitle}>Customer</AppText>

                <AppText style={styles.sectionSubtitle}>
                  Shipment requested by
                </AppText>
              </View>
            </View>

            <View style={styles.customerCard}>
              <View style={styles.customerAvatar}>
                <AppIcon
                  name="User"
                  size={ICON_SIZE.lg}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.customerInfo}>
                <AppText style={styles.customerName}>
                  {quote?.customer?.name || 'Customer'}
                </AppText>

                {!!quote?.customer?.email && (
                  <View style={styles.customerMeta}>
                    <AppIcon
                      name="Mail"
                      size={ICON_SIZE.xs}
                      color={COLORS.textSecondary}
                    />

                    <AppText style={styles.customerEmail}>
                      {quote?.customer?.email}
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Customer Message                                                  */}
        {/* ---------------------------------------------------------------- */}

        {!!quote?.message && (
          <View style={styles.messageCard}>
            <View style={styles.messageIcon}>
              <AppIcon
                name="MessageSquare"
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
            </View>

            <View style={styles.messageContent}>
              <AppText style={styles.messageTitle}>Customer Message</AppText>

              <AppText style={styles.messageText}>
                {truncateText(quote?.message, 180)}
              </AppText>
            </View>
          </View>
        )}

        {/* Bottom spacing for sticky actions */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom Action Bar                                                   */}
      {/* ------------------------------------------------------------------ */}
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* Horse Detail Component                                                     */
/* -------------------------------------------------------------------------- */

interface HorseDetailProps {
  icon: any;
  label: string;
  value: string;
}

const HorseDetail = ({ icon, label, value }: HorseDetailProps) => {
  return (
    <View style={styles.horseDetailItem}>
      <View style={styles.horseDetailIcon}>
        <AppIcon name={icon} size={ICON_SIZE.xs} color={COLORS.primary} />
      </View>

      <View style={styles.horseDetailContent}>
        <AppText style={styles.horseDetailLabel}>{label}</AppText>

        <AppText style={styles.horseDetailValue} numberOfLines={1}>
          {value}
        </AppText>
      </View>
    </View>
  );
};

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Header */

  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },

  /* Hero */

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  shipmentIcon: {
    width: SIZES.avatarLg,
    height: SIZES.avatarLg,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  heroLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    letterSpacing: 0.7,
  },

  heroCode: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },

  statusBadge: {
    minHeight: moderateScale(30),
    paddingHorizontal: SPACING.sm2,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: RADIUS.circle,
    marginRight: SPACING.xs,
  },

  statusText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
  },

  heroDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },

  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroMetaText: {
    marginLeft: SPACING.xs,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  /* Section */

  sectionHeader: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },

  sectionSubtitle: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  routeIcon: {
    width: SIZES.iconActionBtn,
    height: SIZES.iconActionBtn,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Route */

  routeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  locationRow: {
    flexDirection: 'row',
  },

  timelineContainer: {
    width: moderateScale(24),
    alignItems: 'center',
  },

  locationDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: RADIUS.circle,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: moderateScale(65),
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.border,
  },

  locationContent: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  locationType: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    letterSpacing: 0.7,
  },

  datePill: {
    backgroundColor: COLORS.greenLightBg,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    flexDirection: 'row',
    alignItems: 'center',
  },

  datePillText: {
    marginLeft: SPACING.xs,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xxs,
    color: COLORS.greenPrimary,
  },

  locationText: {
    marginTop: SPACING.sm,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: moderateScale(20),
    color: COLORS.textPrimary,
  },

  timeRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    marginLeft: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
  },

  /* Summary */

  summaryCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  summaryHeader: {
    marginBottom: SPACING.lg,
  },

  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallIconContainer: {
    width: SIZES.iconActionBtn,
    height: SIZES.iconActionBtn,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryTitle: {
    marginLeft: SPACING.sm,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },

  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: SPACING.lg,
  },

  summaryItem: {
    width: '50%',
  },

  summaryLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xxs,
    letterSpacing: 0.6,
    color: COLORS.textLight,
  },

  summaryValue: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },

  summaryValueSmall: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  /* Horse */

  horseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  horseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  horseAvatar: {
    width: SIZES.avatarXl,
    height: SIZES.avatarXl,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  horseNameContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  horseName: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },

  horseBarnName: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  horseAgeBadge: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  horseAge: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.primaryDark,
  },

  horseAgeLabel: {
    marginTop: -2,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.xxs,
    color: COLORS.goldBrownText,
  },

  horseDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.lg,
  },

  horseDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: SPACING.lg,
  },

  horseDetailItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.sm,
  },

  horseDetailIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  horseDetailContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },

  horseDetailLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xxs,
    color: COLORS.textLight,
  },

  horseDetailValue: {
    marginTop: 2,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textPrimary,
  },

  infoBox: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.goldLightBg,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
  },

  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoBoxTitle: {
    marginLeft: SPACING.xs,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.goldDarkText,
  },

  infoBoxText: {
    marginTop: SPACING.sm,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: moderateScale(18),
    color: COLORS.textPrimary,
  },

  notesBox: {
    marginTop: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grey50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  notesTitle: {
    marginLeft: SPACING.xs,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  notesText: {
    marginTop: SPACING.sm,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: moderateScale(18),
    color: COLORS.textSecondary,
  },

  /* Customer */

  customerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  customerAvatar: {
    width: SIZES.avatarMd44,
    height: SIZES.avatarMd44,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  customerInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  customerName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },

  customerMeta: {
    marginTop: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },

  customerEmail: {
    marginLeft: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  /* Message */

  messageCard: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
  },

  messageIcon: {
    width: SIZES.iconActionBtn,
    height: SIZES.iconActionBtn,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.goldCreamBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messageContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  messageTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },

  messageText: {
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: moderateScale(18),
    color: COLORS.textSecondary,
  },

  /* Bottom */

  bottomSpacing: {
    height: moderateScale(100),
  },
});

export default QuoteReceivedDetail;
