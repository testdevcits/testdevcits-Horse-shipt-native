import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import customerService from '../../../../api/services/customerService';
import { Horse } from '../../../../types/customer';

import {
  setHorses,
  setLoading,
  setError,
} from '../../../../redux/slices/horseSlice';
import { RootState } from '../../../../app/store';

const useMyHorses = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const horses = useSelector((state: RootState) => state.horse.horses);
  const loading = useSelector((state: RootState) => state.horse.loading);

  const [refreshing, setRefreshing] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);

  const fetchHorses = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const response = await customerService.getHorses();

      if (response.success) {
        dispatch(setHorses(response.horses));
      } else {
        dispatch(setError('Unable to fetch horses.'));
      }
    } catch (error: any) {
      console.log(error);

      dispatch(setError(error?.message || 'Something went wrong'));
    } finally {
      dispatch(setLoading(false));
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchHorses();
  }, [fetchHorses]);

  const handleDelete = (id: string) => {
    setSelectedHorseId(id);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHorseId) return;
    try {
      dispatch(setLoading(true));

      await customerService.deleteHorse(selectedHorseId);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Horse removed successfully',
      });

      fetchHorses();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete horse',
      });
    } finally {
      dispatch(setLoading(false));
      setIsDeleteModalVisible(false);
      setSelectedHorseId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedHorseId(null);
  };

  const handleEdit = (horse: Horse) => {
    navigation.navigate('AddEditHorse', { horse });
  };

  return {
    horses,
    loading,
    refreshing,
    fetchHorses,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    isDeleteModalVisible,
    handleEdit,
    setRefreshing,
  };
};

export default useMyHorses;