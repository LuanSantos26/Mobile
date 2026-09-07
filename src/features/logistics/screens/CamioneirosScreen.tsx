import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { BackTitleHeader } from '../../../components/BackTitleHeader';
import { ScreenTopGradient } from '../../../components/ScreenTopGradient';
import { useAppGoBack } from '../../../hooks/useAppGoBack';

const motoristas = [
  {
    
    nome: 'Leandro Nogueira',
    rota: 'Recife → Salvador',
    veiculo: 'Truck 15',
    status: 'Atrasado',
    clientes: ['Casa da Feira'],
  },
];

export function CamioneirosScreen() {
  const navigation = useNavigation<any>();
  const goBack = useAppGoBack('Home');

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenTopGradient />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackTitleHeader
          title="Caminhoneiros"
          onBack={goBack}
          rightSlot={
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('CadastroCamioneiros')}
            >
              <Text style={styles.headerButtonText}>+ Novo</Text>
            </TouchableOpacity>
          }
        />

        <View style={styles.summary}>
          <Text style={styles.summaryValue}>18</Text>
          <Text style={styles.summaryLabel}>motoristas ativos</Text>
        </View>

        {motoristas.map((motorista) => (
          <View key={motorista.nome} style={styles.card}>
            <View style={styles.headRow}>
              <View>
                <Text style={styles.name}>{motorista.nome}</Text>
                <Text style={styles.route}>Rota: {motorista.rota}</Text>
              </View>
              <View style={[styles.statusBadge, getStatusStyle(motorista.status)]}>
                <Text style={styles.statusText}>{motorista.status}</Text>
              </View>
            </View>

            <Text style={styles.vehicle}>Veículo: {motorista.veiculo}</Text>

            <Text style={styles.clientLabel}>Entregas:</Text>
            {motorista.clientes.map((cliente) => (
              <Text key={`${motorista.nome}-${cliente}`} style={styles.clientName}>• {cliente}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case 'Em rota':
      return styles.statusEmRota;
    case 'Carregando':
      return styles.statusCarregando;
    case 'Disponível':
      return styles.statusDisponivel;
    case 'Atrasado':
      return styles.statusAtrasado;
    default:
      return styles.statusPadrao;
  }
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
  headerButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F8B125',
  },
  headerButtonText: {
    color: '#F8B125',
    fontWeight: '700',
    fontSize: 12,
  },
  summary: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    alignItems: 'center',
  },
  summaryValue: {
    color: '#F8B125',
    fontSize: 32,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    color: '#222',
    fontWeight: '800',
    fontSize: 16,
  },
  route: {
    marginTop: 4,
    color: '#666',
    fontSize: 12,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusEmRota: {
    backgroundColor: '#EAF9EE',
  },
  statusCarregando: {
    backgroundColor: '#FFF4D6',
  },
  statusDisponivel: {
    backgroundColor: '#ECF4FF',
  },
  statusAtrasado: {
    backgroundColor: '#FFE7E7',
  },
  statusPadrao: {
    backgroundColor: '#F3F3F3',
  },
  vehicle: {
    marginTop: 14,
    color: '#333',
    fontSize: 13,
  },
  clientLabel: {
    marginTop: 12,
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
  },
  clientName: {
    color: '#333',
    fontSize: 13,
    marginTop: 4,
  },
});
