import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  buscarResumoFinanceiro,
  buscarStockDia,
  FinanceiroResumo,
  StockDia,
} from '../../services/financeiroService';
import type { AbaCarteira } from './components/CarteiraWidgets';

export function useCards() {
  const { user } = useAuth();
  const empresaId = user?.empresa?.id;

  const [abaAtiva, setAbaAtiva] = useState<AbaCarteira>('stockDia');
  const [stockDia, setStockDia] = useState<StockDia | null>(null);
  const [resumo, setResumo] = useState<FinanceiroResumo | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStock, setErrorStock] = useState('');
  const [errorStats, setErrorStats] = useState('');

  const carregarStockDia = useCallback(async () => {
    if (!empresaId) return;
    setLoadingStock(true);
    try {
      const data = await buscarStockDia(empresaId);
      setStockDia(data);
      setErrorStock('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar stock do dia.';
      setErrorStock(msg);
    } finally {
      setLoadingStock(false);
    }
  }, [empresaId]);

  const carregarResumo = useCallback(async () => {
    if (!empresaId) return;
    setLoadingStats(true);
    try {
      const data = await buscarResumoFinanceiro(empresaId);
      setResumo(data);
      setErrorStats('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar estatísticas.';
      setErrorStats(msg);
    } finally {
      setLoadingStats(false);
    }
  }, [empresaId]);

  useFocusEffect(
    useCallback(() => {
      carregarStockDia();
      carregarResumo();
    }, [carregarStockDia, carregarResumo]),
  );

  return {
    abaAtiva,
    setAbaAtiva,
    stockDia,
    resumo,
    loadingStock,
    loadingStats,
    errorStock,
    errorStats,
    carregarStockDia,
    carregarResumo,
  };
}
