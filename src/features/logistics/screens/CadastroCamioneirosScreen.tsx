import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackTitleHeader } from '../../../components/BackTitleHeader';
import { ScreenTopGradient } from '../../../components/ScreenTopGradient';
import { useAppGoBack } from '../../../hooks/useAppGoBack';

interface Entrega {
  nomeCliente: string;
  cidade: string;
  rota: string;
  status: 'Em rota' | 'Carregando' | 'Entregue';
}

interface Caminhoneiro {
  id: number;
  nome: string;
  veiculo: string;
  rota: string;
  entregas: Entrega[];
}

const initialMotoristas: Caminhoneiro[] = [
  {
    id: 1,
    nome: 'Rafael Costa',
    veiculo: 'Truck 27',
    rota: 'São Paulo → Curitiba',
    entregas: [
      { nomeCliente: 'Ana Paula', cidade: 'Curitiba', rota: 'São Paulo → Curitiba', status: 'Em rota' },
      { nomeCliente: 'Beto Ltda', cidade: 'Londrina', rota: 'São Paulo → Curitiba', status: 'Carregando' },
    ],
  },
  {
    id: 2,
    nome: 'Marcos Silva',
    veiculo: 'Truck 11',
    rota: 'Campinas → Porto Alegre',
    entregas: [
      { nomeCliente: 'Maria Souza', cidade: 'Porto Alegre', rota: 'Campinas → Porto Alegre', status: 'Em rota' },
    ],
  },
];

export function CadastroCamioneirosScreen() {
  const goBack = useAppGoBack('Home');
  const [motoristas, setMotoristas] = useState<Caminhoneiro[]>(initialMotoristas);
  const [nome, setNome] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [rota, setRota] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [clienteCidade, setClienteCidade] = useState('');

  const totalEntregas = useMemo(
    () => motoristas.reduce((acc, item) => acc + item.entregas.length, 0),
    [motoristas],
  );

  const cadastrarMotorista = () => {
    if (!nome.trim() || !veiculo.trim() || !rota.trim()) {
      Alert.alert('Atenção', 'Preencha nome, veículo e rota do caminhoneiro.');
      return;
    }

    const novoMotorista: Caminhoneiro = {
      id: Date.now(),
      nome: nome.trim(),
      veiculo: veiculo.trim(),
      rota: rota.trim(),
      entregas: clienteNome.trim()
        ? [
            {
              nomeCliente: clienteNome.trim(),
              cidade: clienteCidade.trim() || 'Local não informado',
              rota: rota.trim(),
              status: 'Carregando',
            },
          ]
        : [],
    };

    setMotoristas((prev) => [novoMotorista, ...prev]);
    setNome('');
    setVeiculo('');
    setRota('');
    setClienteNome('');
    setClienteCidade('');

    Alert.alert('Sucesso', 'Caminhoneiro cadastrado com sucesso.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScreenTopGradient />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackTitleHeader title="Cadastro de caminhoneiros" onBack={goBack} />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{motoristas.length}</Text>
          <Text style={styles.summaryLabel}>caminhoneiros ativos</Text>
          <Text style={styles.summarySub}>Total de entregas: {totalEntregas}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados do caminhoneiro</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />

          <Text style={styles.label}>Veículo</Text>
          <TextInput style={styles.input} value={veiculo} onChangeText={setVeiculo} placeholder="Ex: Truck 22" />

          <Text style={styles.label}>Rota atual</Text>
          <TextInput
            style={styles.input}
            value={rota}
            onChangeText={setRota}
            placeholder="Ex: São Paulo → Rio"
          />

          <Text style={styles.sectionTitle}>Entrega vinculada</Text>

          <Text style={styles.label}>Nome do cliente</Text>
          <TextInput
            style={styles.input}
            value={clienteNome}
            onChangeText={setClienteNome}
            placeholder="Ex: João da Padaria"
          />

          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={clienteCidade}
            onChangeText={setClienteCidade}
            placeholder="Ex: Campinas"
          />

          <TouchableOpacity style={styles.button} onPress={cadastrarMotorista}>
            <Text style={styles.buttonText}>Salvar caminhoneiro</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Caminhoneiros cadastrados</Text>

          {motoristas.map((motorista) => (
            <View key={motorista.id} style={styles.motoristaCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.motoristaNome}>{motorista.nome}</Text>
                <Text style={styles.vehicleTag}>{motorista.veiculo}</Text>
              </View>

              <Text style={styles.rotaText}>Rota: {motorista.rota}</Text>

              {motorista.entregas.length > 0 ? (
                <View style={styles.entregasList}>
                  {motorista.entregas.map((entrega, index) => (
                    <View key={`${motorista.id}-${index}`} style={styles.entregaItem}>
                      <View style={styles.dot} />
                      <View style={styles.entregaInfo}>
                        <Text style={styles.entregaCliente}>{entrega.nomeCliente}</Text>
                        <Text style={styles.entregaMeta}>{entrega.cidade} • {entrega.rota}</Text>
                        <Text style={styles.entregaStatus}>{entrega.status}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.semEntrega}>Sem entregas vinculadas.</Text>
              )}
            </View>
          ))}
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
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  summaryValue: {
    color: '#F8B125',
    fontWeight: '800',
    fontSize: 32,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },
  summarySub: {
    marginTop: 6,
    color: '#333',
    fontSize: 12,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F3E3B1',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  listCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#F3E3B1',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#222',
    marginBottom: 12,
  },
  label: {
    color: '#555',
    fontSize: 12,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#F8B125',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  motoristaCard: {
    backgroundColor: '#FFF9EC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3CF82',
    marginTop: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  motoristaNome: {
    color: '#222',
    fontSize: 16,
    fontWeight: '800',
  },
  vehicleTag: {
    color: '#A66B00',
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#FFF0C7',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rotaText: {
    marginTop: 8,
    color: '#555',
    fontSize: 12,
  },
  entregasList: {
    marginTop: 12,
    gap: 8,
  },
  entregaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F8B125',
    marginTop: 6,
    marginRight: 10,
  },
  entregaInfo: {
    flex: 1,
  },
  entregaCliente: {
    color: '#222',
    fontWeight: '700',
    fontSize: 13,
  },
  entregaMeta: {
    color: '#666',
    fontSize: 11,
    marginTop: 2,
  },
  entregaStatus: {
    marginTop: 4,
    color: '#2DBE6A',
    fontSize: 11,
    fontWeight: '700',
  },
  semEntrega: {
    marginTop: 8,
    color: '#777',
    fontSize: 12,
  },
});
