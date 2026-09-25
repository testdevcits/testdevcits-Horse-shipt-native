import React, { useState } from "react"
 
import { showErrorToast, showSuccessToast } from "../../../../../utils/toast";


const useHome = ({ activeShipment, handleStartTrip }: { activeShipment: any, handleStartTrip: (id: string) => Promise<any> }) => {


    // Collapsible accordion state for the Assigned Vehicle card [1]
    const [isVehicleCollapsed, setIsVehicleCollapsed] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);

    const onStartTrip = async () => {
        if (!activeShipment?._id || !activeShipment?.shipment?._id) {
            showErrorToast('Unable to start trip', 'Quote ID not found.');
            return;
        }

        try {
            const response = await handleStartTrip(activeShipment?._id);

            showSuccessToast(
                'Trip Started',
                response?.message || 'Trip started successfully.',
            );
        } catch (error: any) {
            showErrorToast(
                'Failed to Start Trip',
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong.',
            );

            console.error(error);
        }
    };

    const getShortLocation = (fullName?: string) => {
        if (!fullName) return 'N/A';
        return fullName?.split(',')[0].trim();
    };

    return {
        isVehicleCollapsed,
        setIsVehicleCollapsed,
        isMapModalVisible,
        setIsMapModalVisible,
        mapVisible,
        setMapVisible,
        onStartTrip,
        getShortLocation,
    };
};

export default useHome;