import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

/** @deprecated Use SacolaScreen — mantido para rotas antigas. */
export function CheckoutScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    navigation.replace('Sacola');
  }, [navigation]);

  return null;
}
