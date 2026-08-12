import {
  BASE_URL as ENV_BASE_URL,
  GOOGLE_MAPS_APIKEY as ENV_MAPS_KEY,
  REACT_APP_STRIPE_PUBLISHABLE_KEY as ENV_STRIPE_KEY,
} from '@env';

export const BASE_URL = ENV_BASE_URL || 'https://horse-shipt.vercel.app';

export const GOOGLE_MAPS_APIKEY = ENV_MAPS_KEY || 'AIzaSyBUX8zHtnnP48SEh0Ur1mtAr2tckIugLsw';

export const REACT_APP_STRIPE_PUBLISHABLE_KEY =
  ENV_STRIPE_KEY || 'pk_test_51T6oVICVoPk11ijL51FMIuNhin8FIjyoJSOITwlK6AqEutL9Jl4bwdOrhziWtZdaBesLZSJheByHGV5RNHbMrYfH00yf77nS4r';

export const MAP_DELTA = {
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

export const DEBOUNCE_TIME = 400;

export const horsePlaceholderImage =
  'https://thumbs.dreamstime.com/b/simple-horse-logo-icon-vector-art-illustration-simple-horse-logo-icon-vector-art-illustration-features-clean-minimalist-design-351219938.jpg';
