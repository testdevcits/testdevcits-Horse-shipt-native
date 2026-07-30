import React from 'react';
import { View, ScrollView } from 'react-native';
import { AppHeader, AppText } from '../../../../components';
import styles from './styles.postload';

const PostLoadScreen = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Post Load / Quote" showNotificationBell />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Post Available Vehicle / Load</AppText>
          <AppText style={styles.cardSub}>
            Post your available routes, truck capacity, or custom transport offers.
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
};

export default PostLoadScreen;
