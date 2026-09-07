import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

export function useAppGoBack(fallbackRoute = 'Home') {
  const navigation = useNavigation<any>();

  return useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(fallbackRoute);
    }
  }, [navigation, fallbackRoute]);
}
