import React from 'react';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import CustomToast from '../../utils/CustomToast';

/**
 * Global Toast Configuration for react-native-toast-message
 * Renders professional CustomToast variants with theme colors and icons
 */
export const toastConfig: ToastConfig = {
  success: (params: ToastConfigParams<any>) => (
    <CustomToast
      type="success"
      text1={params.text1}
      text2={params.text2}
      onPress={params.onPress}
      onClose={params.hide}
      showCloseButton={!!params.props?.showCloseButton}
      icon={params.props?.icon}
    />
  ),
  error: (params: ToastConfigParams<any>) => (
    <CustomToast
      type="error"
      text1={params.text1}
      text2={params.text2}
      onPress={params.onPress}
      onClose={params.hide}
      showCloseButton={!!params.props?.showCloseButton}
      icon={params.props?.icon}
    />
  ),
  warning: (params: ToastConfigParams<any>) => (
    <CustomToast
      type="warning"
      text1={params.text1}
      text2={params.text2}
      onPress={params.onPress}
      onClose={params.hide}
      showCloseButton={!!params.props?.showCloseButton}
      icon={params.props?.icon}
    />
  ),
  info: (params: ToastConfigParams<any>) => (
    <CustomToast
      type="info"
      text1={params.text1}
      text2={params.text2}
      onPress={params.onPress}
      onClose={params.hide}
      showCloseButton={!!params.props?.showCloseButton}
      icon={params.props?.icon}
    />
  ),
};

export default toastConfig;

