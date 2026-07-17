import axiosClient from "../axiosClient";
import { GetHorsesResponse, Horse, CreateHorsePayload, GetShipmentsResponse } from "../../types/customer";

/**
 * Customer specific API services
 */
const customerService = {
  /**
   * Fetch all horses belonging to the logged-in customer
   */
  getHorses: async (): Promise<GetHorsesResponse> => {
    return axiosClient.get('/api/customer/horses');
  },

  /**
   * Add a new horse to the customer's profile
   */
  addHorse: async (payload: CreateHorsePayload): Promise<{ success: boolean; horse: Horse }> => {
    return axiosClient.post('/api/customer/horses', payload);
  },

  /**
   * Update an existing horse's details
   */
  updateHorse: async (horseId: string, payload: Partial<CreateHorsePayload>): Promise<{ success: boolean; horse: Horse }> => {
    return axiosClient.put(`/api/customer/horses/${horseId}`, payload);
  },

  /**
   * Delete a horse from the profile
   */
  deleteHorse: async (horseId: string): Promise<{ success: boolean; message: string }> => {
    return axiosClient.delete(`/api/customer/horses/${horseId}`);
  },





  getMyShipments: async (): Promise<GetShipmentsResponse> => {
    // Based on the JSON you provided, the endpoint is:
    return axiosClient.get('/api/customer/shipments/completed');


  },
};

export default customerService;