import axiosClient from './axiosClient';
import API_ENDPOINTS from './endpoints';
import authService from './services/authService';
import customerService from './services/customerService';
import driverService from './services/driverService';
import shipperService from './services/shipperService';
import { getLiveTracking } from './services/trackingService';

export {
  axiosClient,
  API_ENDPOINTS,
  authService,
  customerService,
  driverService,
  shipperService,
  getLiveTracking,
};

export default API_ENDPOINTS;
