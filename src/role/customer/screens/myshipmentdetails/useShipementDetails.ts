import { useCallback, useEffect, useState } from 'react';
import customerService from '../../../../api/services/customerService';

const useShipmentDetails = (shipmentId: string) => {
  const [shipment, setShipment] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [matchingShippers, setMatchingShippers] = useState<string[]>([]);
  const [invitedShippers, setInvitedShippers] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShipmentDetails = useCallback(async () => {
    try {
      setLoading(true);

      const [
        shipmentResponse,
        quotesResponse,
        questionsResponse,
        matchingShippersResponse,
      ] = await Promise.all([
        customerService.getShipmentById(shipmentId),
        customerService.getQuotes(shipmentId),
        customerService.getQuestions(shipmentId),
        customerService.getMatchingShippers(shipmentId),
      ]);

      if (shipmentResponse.success) {
        setShipment(shipmentResponse.shipment);
      }

      if (quotesResponse.success) {
        setQuotes(quotesResponse.quotes ?? []);
      }

      if (questionsResponse.success) {
        setQuestions(
          Array.isArray(questionsResponse.data)
            ? questionsResponse.data
            : (questionsResponse as any).questions ?? [],
        );
      }

      if (matchingShippersResponse.success) {
        setMatchingShippers(matchingShippersResponse.shippers ?? []);
        setInvitedShippers(matchingShippersResponse.invitedShippers ?? []);
      }
    } catch (error) {
      console.error('Failed to fetch shipment details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shipmentId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchShipmentDetails();
  }, [fetchShipmentDetails]);

  useEffect(() => {
    if (shipmentId) {
      fetchShipmentDetails();
    }
  }, [shipmentId, fetchShipmentDetails]);

  return {
    shipment,
    quotes,
    questions,
    matchingShippers,
    invitedShippers,

    loading,
    refreshing,

    onRefresh,
    refetch: fetchShipmentDetails,
  };
};

export default useShipmentDetails;
