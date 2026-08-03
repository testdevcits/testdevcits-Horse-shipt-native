import { useCallback, useEffect, useState } from 'react';
import customerService from '../../../../api/services/customerService';
import { CustomerProfileData } from '../../../../types/customer';
import ImagePicker from 'react-native-image-crop-picker';
import { useAppDispatch } from '../../../../hooks/redux';
import { updateUser } from '../../../../redux/slices/authSlice';
import Toast from 'react-native-toast-message';

export const useProfile = () => {
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useAppDispatch();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerService.getProfile();
      if (response.success && response.data) {
        setProfile(response.data);
        dispatch(
          updateUser({
            name: `${response.data?.firstName || ''} ${response.data?.lastName || ''}`.trim() || response.data?.name,
            email: response.data?.email,
            profileImage: response.data?.profileImage as any,
            phoneNumber: response.data?.phone,
            metadata: response.data,
          }),
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const handleUpdateProfile = async (payload: {
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      setIsUpdating(true);
      const response = await customerService.updateProfile(payload);
      if (response.success) {
        await fetchProfile(); // Refresh data
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAvatar = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      });

      setUploading(true);

      const formData = new FormData();
      formdata?.append('image', {
        uri: image.path,
        type: image.mime,
        name: image.filename || 'profile.jpg',
      } as any);

      const response = await customerService.updateProfileImage(formData);

      if (response.success) {
        setProfile((prev: any) => ({
          ...prev,
          profileImage: response.profileImage,
        }));
        dispatch(
          updateUser({
            profileImage: response.profileImage as any,
          }),
        );
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Profile image updated successfully',
        });
        return { success: true };
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.error('Upload Error:', error);
        Toast.show({
          type: 'error',
          text1: 'Upload Error',
          text2: error.message || 'Failed to upload profile image',
        });
      }
      return { success: false };
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    isUpdating,
    error,
    uploading,
    uploadAvatar,
    refetch: fetchProfile,
    updateProfile: handleUpdateProfile,
  };
};
