import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={estilos.scrollContent}>
        
        {/* ── Cabeçalho ── */}
        <View style={estilos.cabecalho}>
          <View style={estilos.logoContainer}>
            <MaterialIcons name="shopping-cart" size={28} color="#3bbdd4" />
            <Text style={estilos.logoTexto}>QuickBar</Text>
          </View>
          <TouchableOpacity style={estilos.perfilBtn}>
            <Ionicons name="person-circle" size={44} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* ── Boas-vindas ── */}
        <View style={estilos.boasVindasContainer}>
          <Text style={estilos.saudacao}>BEM-VINDO,</Text>
          <Text style={estilos.nomeUsuario}>Luan</Text>
          <Text style={estilos.subtitulo}>Aqui está o resumo do seu negócio.</Text>
        </View>

        {/* ── Barra de Busca ── */}
        <View style={estilos.buscaContainer}>
          <Feather name="search" size={20} color="#757575" style={estilos.buscaIcone} />
          <TextInput 
            style={estilos.buscaInput} 
            placeholder="Buscar produtos, pedidos..." 
            placeholderTextColor="#999"
          />
        </View>

        {/* ── Cards de Resumo (Grid) ── */}
        <View style={estilos.gridCards}>
          
          {/* Card 1 */}
          <View style={estilos.card}>
            <View style={[estilos.iconeCardBg, { backgroundColor: '#e3fcec' }]}>
              <MaterialIcons name="attach-money" size={24} color="#2e7d32" />
            </View>
            <Text style={estilos.cardTitulo}>Total de Vendas</Text>
            <Text style={estilos.cardValor}>R$ 4.250,00</Text>
            <Text style={estilos.cardVariacao}>+12% na semana</Text>
          </View>

          {/* Card 2 */}
          <View style={estilos.card}>
            <View style={[estilos.iconeCardBg, { backgroundColor: '#e1f5fe' }]}>
              <Feather name="box" size={22} color="#0288d1" />
            </View>
            <Text style={estilos.cardTitulo}>Produtos Ativos</Text>
            <Text style={estilos.cardValor}>128</Text>
            <Text style={estilos.cardVariacaoNeutro}>Em estoque</Text>
          </View>

          {/* Card 3 */}
          <View style={estilos.card}>
            <View style={[estilos.iconeCardBg, { backgroundColor: '#fff3e0' }]}>
              <Feather name="clipboard" size={22} color="#f57c00" />
            </View>
            <Text style={estilos.cardTitulo}>Pedidos Hoje</Text>
            <Text style={estilos.cardValor}>34</Text>
            <Text style={estilos.cardVariacaoNeutro}>5 pendentes</Text>
          </View>

          {/* Card 4 */}
          <View style={estilos.card}>
            <View style={[estilos.iconeCardBg, { backgroundColor: '#f3e5f5' }]}>
              <Feather name="bar-chart-2" size={22} color="#7b1fa2" />
            </View>
            <Text style={estilos.cardTitulo}>Faturamento</Text>
            <Text style={estilos.cardValor}>R$ 12.800</Text>
            <Text style={estilos.cardVariacaoNeutro}>Mensal</Text>
          </View>

        </View>

        {/* ── Atalhos Rápidos ── */}
        <View style={estilos.atalhosContainer}>
          <Text style={estilos.secaoTitulo}>Atalhos Rápidos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={estilos.scrollAtalhos}>
            
            <TouchableOpacity style={estilos.atalhoBtn}>
              <Feather name="plus-circle" size={20} color="#fff" />
              <Text style={estilos.atalhoTextoBranco}>Novo Produto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[estilos.atalhoBtn, estilos.atalhoBtnSecundario]}>
              <Feather name="shopping-bag" size={20} color="#3bbdd4" />
              <Text style={estilos.atalhoTextoSecundario}>Nova Venda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[estilos.atalhoBtn, estilos.atalhoBtnSecundario]}>
              <Feather name="file-text" size={20} color="#3bbdd4" />
              <Text style={estilos.atalhoTextoSecundario}>Relatórios</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC', // Fundo cinza bem claro/azulado
  },
  scrollContent: {
    paddingTop: 30,
    paddingRight: 24,
    paddingBottom: 40,
    // ESSENCIAL: Espaço na esquerda para a sua QuickBar não cobrir o texto
    paddingLeft: 110, 
  },
  
  // Cabeçalho
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoTexto: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  perfilBtn: {
    borderRadius: 22,
  },

  // Boas-vindas
  boasVindasContainer: {
    marginBottom: 24,
  },
  saudacao: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '600',
    letterSpacing: 1,
  },
  nomeUsuario: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3bbdd4', // Azul do seu App
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: '#9E9E9E',
  },

  // Busca
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  buscaIcone: {
    marginRight: 10,
  },
  buscaInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  // Cards
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '47%', 
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  iconeCardBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 6,
    fontWeight: '500',
  },
  cardValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  cardVariacao: {
    fontSize: 12,
    color: '#2e7d32', // Verde
    fontWeight: '600',
  },
  cardVariacaoNeutro: {
    fontSize: 12,
    color: '#9E9E9E',
  },

  // Atalhos
  atalhosContainer: {
    marginTop: 10,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  scrollAtalhos: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  atalhoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3bbdd4', // Azul principal
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginRight: 12,
    gap: 8,
    shadowColor: '#3bbdd4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  atalhoTextoBranco: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  atalhoBtnSecundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  atalhoTextoSecundario: {
    color: '#3bbdd4',
    fontWeight: '600',
    fontSize: 14,
  },
});