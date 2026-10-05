import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {
  COLORS,
} from '../../../../constants';
import { AppHeader, AppText } from '../../../../components';
import AppIcon from '../../../../components/app_icon/AppIcon';
import styles from './styles.HelpCenter';

const HelpCenter = ({ }: any) => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:noreply.horseshipt2026@gmail.com');
  };

  return (
    <View style={styles.container}>
      <AppHeader
        showBack={true}
        title="Help Center"
        showNotificationIcon={false}
        showProfileImage={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Support Card */}
        <View style={styles.helpCard}>
          {/* Header Row */}
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.questionIconBox}>
                <AppIcon name={'HelpCircle'} size={20} color={COLORS.primary} />
              </View>
              <View>
                <AppText style={styles.cardTitle}>Customer Help</AppText>
                <AppText style={styles.cardSubtitle}>
                  Contact our support team
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Body Content */}
          <View style={styles.cardBody}>
            <AppText style={styles.description}>
              Need help with your customer dashboard? Send us an email and we
              will get back to you.
            </AppText>

            {/* Email Box */}
            <TouchableOpacity
              style={styles.emailHighlightBox}
              activeOpacity={0.7}
              onPress={handleEmailPress}
            >
              <View style={styles.mailIconBox}>
                <AppIcon name={'Mail'} size={18} color={COLORS.primary} />
              </View>
              <View>
                <AppText style={styles.emailLabel}>HELP EMAIL</AppText>
                <AppText style={styles.emailValue}>
                  noreply.horseshipt2026@gmail.com
                </AppText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Additional FAQ Section */}
        <AppText style={styles.sectionLabel}>
          Frequently Asked Questions
        </AppText>

        <View style={styles.faqContainer}>
          <FaqItem
            title="How to track my shipment?"
            description="You can track your shipment from the My Shipments section. Open the shipment you want to track to view its current status, pickup details, delivery information, and updates."
          />

          <FaqItem
            title="How do I pay my quote?"
            description="Open your shipment and review the available quote. Once you accept the quote, you can proceed with the available payment option to complete your payment."
          />

          <FaqItem
            title="Cancellation policy details"
            description="Cancellation availability may depend on the current status of your shipment. Please review the shipment details or contact our support team for assistance with cancellation requests."
            isLast
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Sub-component for FAQ List
// const FaqItem = ({ title, isLast }: { title: string; isLast?: boolean }) => (
//   <TouchableOpacity
//     style={[styles.faqItem, isLast && { borderBottomWidth: 0 }]}
//   >
//     <AppText style={styles.faqText}>{title}</AppText>
//     <AppIcon name={'ChevronRight'} size={16} color={COLORS.grey400} />
//   </TouchableOpacity>
// );

const FaqItem = ({
  title,
  description,
  isLast,
}: {
  title: string;
  description: string;
  isLast?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpanded(prev => !prev)}
      style={[styles.faqItem, isLast && !expanded && { borderBottomWidth: 0 }]}
    >
      <View style={styles.faqContent}>
        <View style={styles.faqHeader}>
          <AppText style={styles.faqText}>{title}</AppText>

          <AppIcon
            name={expanded ? 'ChevronUp' : 'ChevronDown'}
            size={16}
            color={COLORS.grey400}
          />
        </View>

        {expanded && (
          <AppText style={styles.faqDescription}>{description}</AppText>
        )}
      </View>
    </TouchableOpacity>
  );
};



export default HelpCenter;
