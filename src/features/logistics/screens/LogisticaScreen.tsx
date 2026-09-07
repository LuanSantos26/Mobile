import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackTitleHeader } from '../../../components/BackTitleHeader';
import { ScreenTopGradient } from '../../../components/ScreenTopGradient';
import { useAppGoBack } from '../../../hooks/useAppGoBack';

const processos = [
  { nome: 'Pedido confirmado', concluido: true, horario: '08:10' },
  { nome: 'Separação no estoque', concluido: true, horario: '08:40' },
  { nome: 'Carregamento', concluido: true, horario: '09:15' },
  { nome: 'Em trânsito', concluido: true, horario: '10:25' },
  { nome: 'Entrega prevista', concluido: false, horario: '12:00' },
];

export function LogisticaScreen() {
  const goBack = useAppGoBack('Home');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenTopGradient />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackTitleHeader title="Logística e envio" onBack={goBack} />

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Status da entrega</Text>
          <Text style={styles.heroValue}>Em trânsito</Text>
          <Text style={styles.heroSubtitle}>Tempo estimado: 2h 15min</Text>
        </View>

        <View style={styles.timelineCard}>
          {processos.map((processo, index) => (
            <View key={processo.nome} style={styles.stepRow}>
              <View style={styles.stepMarkerWrap}>
                <View style={[styles.stepMarker, processo.concluido ? styles.stepMarkerDone : styles.stepMarkerPending]} />
                {index < processos.length - 1 ? <View style={styles.stepLine} /> : null}
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepName}>{processo.nome}</Text>
                <Text style={styles.stepTime}>{processo.horario}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Pedido</Text>
            <Text style={styles.metricValue}>#1049</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Motorista</Text>
            <Text style={styles.metricValue}>Rafael</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Rota</Text>
            <Text style={styles.metricValue}>SP → PR</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  heroTitle: {
    color: '#666',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroValue: {
    marginTop: 12,
    color: '#222',
    fontWeight: '800',
    fontSize: 30,
  },
  heroSubtitle: {
    marginTop: 6,
    color: '#555',
    fontSize: 13,
  },
  timelineCard: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepMarkerWrap: {
    width: 26,
    alignItems: 'center',
    marginRight: 12,
  },
  stepMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  stepMarkerDone: {
    backgroundColor: '#2DBE6A',
    borderColor: '#2DBE6A',
  },
  stepMarkerPending: {
    backgroundColor: '#FFF',
    borderColor: '#D2D2D2',
  },
  stepLine: {
    width: 2,
    height: 28,
    backgroundColor: '#E5E5E5',
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 10,
  },
  stepName: {
    color: '#222',
    fontWeight: '700',
    fontSize: 14,
  },
  stepTime: {
    marginTop: 4,
    color: '#666',
    fontSize: 12,
  },
  summaryGrid: {
    marginTop: 20,
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  metricLabel: {
    color: '#666',
    fontSize: 12,
  },
  metricValue: {
    marginTop: 6,
    color: '#222',
    fontWeight: '800',
    fontSize: 20,
  },
});
