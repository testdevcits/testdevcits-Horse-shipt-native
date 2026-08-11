import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import Pdf from 'react-native-pdf';
import WebView from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../../constants';
import { AppHeader } from '../../../components';

type RootStackParamList = {
  PdfViewer: {
    url: string;
    title?: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'PdfViewer'>;

const isImageUrl = (url: string) => {
  if (!url) return false;
  const lower = url.toLowerCase().split('?')[0];
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.webp')
  );
};

const PdfViewerScreen: React.FC<any> = ({ route }) => {
  const { url, title } = route.params;
  const [useWebViewFallback, setUseWebViewFallback] = useState(false);

  console.log('========================', url);

  const isImg = isImageUrl(url);

  return (
    <View style={styles.container}>
      <AppHeader showBack title={title} />
      {isImg ? (
        <Image
          source={{ uri: url }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : useWebViewFallback ? (
        <WebView
          source={{
            uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
              url,
            )}`,
          }}
          style={styles.pdf}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        />
      ) : (
        <Pdf
          source={{
            uri: url,
            cache: true,
            cacheFileName: 'contract.pdf',
          }}
          style={styles.pdf}
          trustAllCerts={false}
          renderActivityIndicator={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
          onError={error => {
            console.log('PDF Error, falling back to WebView:', error);
            setUseWebViewFallback(true);
          }}
        />
      )}
    </View>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});