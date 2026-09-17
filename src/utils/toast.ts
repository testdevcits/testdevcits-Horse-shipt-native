import Toast, { ToastShowParams } from 'react-native-toast-message';
import { LucideIcon } from 'lucide-react-native';

export interface ToastOptions extends Partial<ToastShowParams> {
  showCloseButton?: boolean;
  icon?: LucideIcon;
}

export const showSuccessToast = (
  text1: string,
  text2?: string,
  options?: ToastOptions,
) => {
  const { props, ...rest } = options || {};
  Toast.show({
    type: 'success',
    text1,
    text2,
    props: {
      showCloseButton: options?.showCloseButton,
      icon: options?.icon,
      ...props,
    },
    ...rest,
  });
};

export const showErrorToast = (
  text1: string,
  text2?: string,
  options?: ToastOptions,
) => {
  const { props, ...rest } = options || {};
  Toast.show({
    type: 'error',
    text1,
    text2,
    props: {
      showCloseButton: options?.showCloseButton,
      icon: options?.icon,
      ...props,
    },
    ...rest,
  });
};

export const showWarningToast = (
  text1: string,
  text2?: string,
  options?: ToastOptions,
) => {
  const { props, ...rest } = options || {};
  Toast.show({
    type: 'warning',
    text1,
    text2,
    props: {
      showCloseButton: options?.showCloseButton,
      icon: options?.icon,
      ...props,
    },
    ...rest,
  });
};

export const showInfoToast = (
  text1: string,
  text2?: string,
  options?: ToastOptions,
) => {
  const { props, ...rest } = options || {};
  Toast.show({
    type: 'info',
    text1,
    text2,
    props: {
      showCloseButton: options?.showCloseButton,
      icon: options?.icon,
      ...props,
    },
    ...rest,
  });
};

export const hideToast = () => {
  Toast.hide();
};

