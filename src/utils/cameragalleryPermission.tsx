import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export type PermissionType = 'camera' | 'gallery';

class PermissionService {
  /**
   * Request multiple permissions sequentially
   * Returns true only if ALL requested permissions are granted
   */
  async requestMultiple(types: PermissionType[]): Promise<boolean> {
    const results = await Promise.all(types.map(t => this.request(t)));
    return results.every(res => res === true);
  }

  /**
   * Request single permission
   */
  async request(type: PermissionType): Promise<boolean> {
    if (Platform.OS === 'android') {
      return this.handleAndroidPermission(type);
    }
    // iOS standard check (usually handled by the picker library, 
    // but logic should be here if you use manual camera layers)
    return true; 
  }

  private async handleAndroidPermission(type: PermissionType): Promise<boolean> {
    try {
      const permission = this.getAndroidPermissionString(type);
      if (!permission) return true;

      // 1. Check current status
      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;

      // 2. Request from system
      const status = await PermissionsAndroid.request(permission, {
        title: `${type.toUpperCase()} Permission`,
        message: `Scan2Hire needs access to your ${type} to complete this action.`,
        buttonPositive: 'OK',
      });

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        this.showSettingsAlert(type);
      }

      return false;
    } catch (err) {
      return false;
    }
  }

  private getAndroidPermissionString(type: PermissionType) {
    if (type === 'camera') return PermissionsAndroid.PERMISSIONS.CAMERA;
    
    if (type === 'gallery') {
      // Android 13+ (API 33) uses granular media permissions
      return Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    }
    return null;
  }

  private showSettingsAlert(type: PermissionType) {
    Alert.alert(
      'Permission Required',
      `You have permanently denied ${type} access. Please enable it in Settings to continue.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]
    );
  }
}

export const permissionService = new PermissionService();