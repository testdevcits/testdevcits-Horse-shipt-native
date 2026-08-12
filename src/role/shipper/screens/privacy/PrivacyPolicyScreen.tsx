import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { AppHeader, AppText } from '../../../../components';
import { COLORS, FONTS, SPACING, FONT_SIZE } from '../../../../constants';
import shipperService from '../../../../api/services/shipperService';
import styles from './styles.privacypolicy';

const PrivacyPolicyScreen = () => {
  const [loading, setLoading] = useState(true);
  const [policyData, setPolicyData] = useState<any>(null);

  const fetchPrivacyPolicy = async () => {
    try {
      const res = await shipperService.getPrivacyPolicy();
      if (res?.success && res.data && res.data?.length > 0) {
        setPolicyData(res?.data[0]);
      }
    } catch (error) {
      console.error('Fetch Privacy Policy Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const htmlContent = policyData?.content || `
    <h1>PRIVACY POLICY</h1>
    <p>This Privacy Policy applies to our website and the Horseshipt platform...</p>
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
            color: #1F2937;
            line-height: 1.6;
            background-color: #FFFFFF;
          
          }
          h1 {
            color: #A06333;
            font-size: 22px;
            margin-bottom: 12px;
            font-weight: 700;
          }
          h2 {
            color: #1F2937;
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
      <AppHeader showBack={true} title="Privacy Policy" showProfileImage={false} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <AppText style={styles.loadingText}>Loading Privacy Policy...</AppText>
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html: webViewHtml, baseUrl: '' }}
          style={styles.webView}
          showsVerticalScrollIndicator={false}

        />
      )}
    </View>
  );
};

export default PrivacyPolicyScreen;
