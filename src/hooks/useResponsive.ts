// hooks/useResponsive.ts
import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;
  const isMobile = width < 640;
  const maxW = Math.min(width, 1160);
  const hPad = isDesktop ? 80 : isTablet ? 40 : 24;
  return { width, isDesktop, isTablet, isMobile, maxW, hPad };
};
