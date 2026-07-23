import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import customerService from '../../../../api/services/customerService';
import { Horse } from '../../../../types/customer';
import { useNavigation } from '@react-navigation/native';

const useMyHorses = () => {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchHorses = useCallback(async () => {
    try {
      const response = await customerService.getHorses();
      if (response.success) setHorses(response.horses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHorses();
  }, [fetchHorses]);

  const handleDelete = (id: string) => {
    Alert.alert('Delete Horse', 'Are you sure you want to remove this horse?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await customerService.deleteHorse(id);
          fetchHorses();
        },
      },
    ]);
  };

  const handleEdit = (horse: Horse) => {
    // Logic to navigate to Edit Screen

    navigation.navigate('AddEditHorse', { horse: horse });
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
