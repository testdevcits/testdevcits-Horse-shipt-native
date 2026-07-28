import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
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

const PdfViewerScreen = ({ route }: Props) => {
  const { url ,title} = route.params;

  console.log("========================",url)

  return (
    <View style={styles.container}>
      <AppHeader showBack title={title}/>
      <Pdf
        source={{ uri: url, cache: true }}
        style={styles.pdf}
        trustAllCerts={false}
        renderActivityIndicator={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        )}
        onError={error => {
          console.log('PDF Error:', error);
        }}
      />
    </View>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  COLORS.white,
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});