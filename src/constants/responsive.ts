import {Dimensions, PixelRatio} from 'react-native';

const {width} = Dimensions.get('window');

const BASE_WIDTH = 375;

export const responsiveFontSize = (size: number) => {
  const scale = width / BASE_WIDTH;

  const scaled = size * scale;

  const min = size * 0.9;
  const max = size * 1.15;

  return PixelRatio.roundToNearestPixel(
    Math.min(Math.max(scaled, min), max),
  );
};