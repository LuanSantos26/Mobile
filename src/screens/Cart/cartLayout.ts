import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const H_PADDING = 15;
export const SECTION_INSET = 16;
export const CARD_GAP = 12;
export const FEATURED_WIDTH = width - H_PADDING * 2 - SECTION_INSET * 2;
export const FEATURED_HEIGHT = Math.round(FEATURED_WIDTH * 0.48);
export const PARTNER_CARD_WIDTH = Math.round(
  (width - H_PADDING * 2 - SECTION_INSET * 2 - CARD_GAP) / 1.85,
);
export const PARTNER_COVER_HEIGHT = Math.round(PARTNER_CARD_WIDTH * 0.58);
export const STORE_COVER_WIDTH = width - H_PADDING * 2 - SECTION_INSET * 2;
