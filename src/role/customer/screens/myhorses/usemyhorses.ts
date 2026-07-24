import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

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

  const horses = useSelector(
    (state: RootState) => state.horse.horses,
  );

  const loading = useSelector(
    (state: RootState) => state.horse.loading,
  );

  const [refreshing, setRefreshing] = useState(false);

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

      dispatch(
        setError(error?.message || 'Something went wrong'),
      );
    } finally {
      dispatch(setLoading(false));
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchHorses();
  }, [fetchHorses]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Horse',
      'Are you sure you want to remove this horse?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              dispatch(setLoading(true));

              await customerService.deleteHorse(id);

              fetchHorses();
            } catch (error) {
              console.log(error);
            } finally {
              dispatch(setLoading(false));
            }
          },
        },
      ],
    );
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
    handleEdit,
    setRefreshing,
  };
};

export default useMyHorses;