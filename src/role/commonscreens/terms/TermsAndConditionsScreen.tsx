import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { AppHeader, AppText } from '../../../components';
import { COLORS } from '../../../constants';
import customerService from '../../../api/services/customerService';
import styles from './styles.termsandconditions';

const TermsAndConditionsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [termsData, setTermsData] = useState<any>(null);

  const fetchTermsAndConditions = async () => {
    try {
      const res = await customerService.getTermsAndConditions();
      if (res?.success && res.data && res.data?.length > 0) {
        setTermsData(res?.data[0]);
      }
    } catch (error) {
      console.error('Fetch Terms & Conditions Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  const htmlContent =
    termsData?.content ||
    `
    <h1>TERMS & CONDITIONS</h1>
    <p>This Terms & Conditions applies to our website and the HorseShipt platform...</p>
  `;

  const webViewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 16px;
            color: ${COLORS.textPrimary};
            line-height: 1.6;
            background-color: ${COLORS.white};
          }
          h1 {
            color: ${COLORS.brandBrown};
            font-size: 22px;
            margin-bottom: 12px;
            font-weight: 700;
          }
          h2 {
            color: ${COLORS.textPrimary};
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: 700;
          }
          h3 {
            color: #374151;
            font-size: 16px;
            margin-top: 16px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          p {
            font-size: 14px;
            color: #4B5563;
            margin-bottom: 12px;
          }
          strong {
            color: #1F2937;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <AppHeader showBack={true} title="Terms & Conditions" showProfileImage={false} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <AppText style={styles.loadingText}>Loading Terms & Conditions...</AppText>
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: webViewHtml }}
          style={styles.webView}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default TermsAndConditionsScreen;
