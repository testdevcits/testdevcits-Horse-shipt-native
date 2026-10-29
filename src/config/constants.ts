import {
  BASE_URL as ENV_BASE_URL,
  GOOGLE_MAPS_APIKEY as ENV_GOOGLE_MAPS_APIKEY,
  GOOGLE_WEB_CLIENT_ID as ENV_GOOGLE_WEB_CLIENT_ID,
  REACT_APP_STRIPE_PUBLISHABLE_KEY as ENV_STRIPE_KEY,
} from '@env';

const requireEnv = (name: string, value: string): string => {
  const configuredValue = value.trim();
  if (!configuredValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return configuredValue;
};

const configuredBaseUrl = requireEnv('BASE_URL', ENV_BASE_URL);
if (!/^https?:\/\/\S+$/i.test(configuredBaseUrl)) {
  throw new Error('BASE_URL must be an absolute HTTP or HTTPS URL');
}

export const BASE_URL = configuredBaseUrl.replace(/\/+$/, '');
export const API_ORIGIN = BASE_URL.replace(/\/api$/i, '');

export const GOOGLE_MAPS_APIKEY = requireEnv(
  'GOOGLE_MAPS_APIKEY',
  ENV_GOOGLE_MAPS_APIKEY,
);
export const GOOGLE_WEB_CLIENT_ID = requireEnv(
  'GOOGLE_WEB_CLIENT_ID',
  ENV_GOOGLE_WEB_CLIENT_ID,
);
export const REACT_APP_STRIPE_PUBLISHABLE_KEY = requireEnv(
  'REACT_APP_STRIPE_PUBLISHABLE_KEY',
  ENV_STRIPE_KEY,
);

// export const MAP_DELTA = {
//   latitudeDelta: 0.005,
//   longitudeDelta: 0.005,
// };

// export const DEBOUNCE_TIME = 400;

export const horsePlaceholderImage =
  'https://thumbs.dreamstime.com/b/simple-horse-logo-icon-vector-art-illustration-simple-horse-logo-icon-vector-art-illustration-features-clean-minimalist-design-351219938.jpg';
