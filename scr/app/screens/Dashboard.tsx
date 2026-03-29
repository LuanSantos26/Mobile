import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';

import CardMetrica from '../components/CardMetrica';
import ItemPedido  from '../components/ItemPedido';

const { width } = Dimensions.get('window');
const CONTENT_WIDTH = width - 110 - 24;

const AZUL        = '#3bbdd4';
const AZUL_ESCURO = '#1a7a8a';
const FUNDO       = '#F7F9FC';
const PRETO       = '#1A1A1A';
const CINZA       = '#757575';
const CINZA_CLARO = '#9E9E9E';
const BRANCO      = '#FFFFFF';

function saudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const CARDS = [
  {
    icone: 'attach-money' as const,
    lib: 'material' as const,
    bg: '#e3fcec',
    cor: '#2e7d32',
    titulo: 'Total de Vendas',
    valor: 'R$ 4.250',
    badge: '+12%',
    badgeCor: '#2e7d32',
    badgeBg: '#c8f5d8',
    sub: 'esta semana',
  },
  {
    icone: 'box' as const,
    lib: 'feather' as const,
    bg: '#e1f5fe',
    cor: '#0288d1',
    titulo: 'Produtos Ativos',
    valor: '128',
    badge: '8 baixo',
    badgeCor: '#f57c00',
    badgeBg: '#fff3e0',
    sub: 'em estoque',
  },
  {
    icone: 'clipboard' as const,
    lib: 'feather' as const,
    bg: '#fff3e0',
    cor: '#f57c00',
    titulo: 'Pedidos Hoje',
    valor: '34',
    badge: '5 pend.',
    badgeCor: '#d32f2f',
    badgeBg: '#ffebee',
    sub: 'realizados',
  },
  {
    icone: 'bar-chart-2' as const,
    lib: 'feather' as const,
    bg: '#f3e5f5',
    cor: '#7b1fa2',
    titulo: 'Faturamento',
    valor: 'R$ 12.800',
    badge: '+5%',
    badgeCor: '#2e7d32',
    badgeBg: '#c8f5d8',
    sub: 'mensal',
  },
];

const GRAFICO = [
  { dia: 'Seg', valor: 60  },
  { dia: 'Ter', valor: 85  },
  { dia: 'Qua', valor: 70  },
  { dia: 'Qui', valor: 95  },
  { dia: 'Sex', valor: 78  },
  { dia: 'Sáb', valor: 110 },
  { dia: 'Dom', valor: 45  },
];
const GRAFICO_MAX = Math.max(...GRAFICO.map(g => g.valor));


const PEDIDOS = [
  { id: '#0034', produto: 'Cerveja Heineken 600ml',  hora: '14:32', status: 'Entregue',   cor: '#2e7d32', bg: '#e3fcec' },
  { id: '#0033', produto: 'Combo Petisco + Refri',   hora: '13:58', status: 'Em preparo', cor: '#f57c00', bg: '#fff3e0' },
  { id: '#0032', produto: 'Caipirinha de Limão',     hora: '13:20', status: 'Entregue',   cor: '#2e7d32', bg: '#e3fcec' },
  { id: '#0031', produto: 'Porcão de Batata Frita',  hora: '12:45', status: 'Cancelado',  cor: '#d32f2f', bg: '#ffebee' },
];

export default function Dashboard() {
  const [busca, setBusca] = useState('');

  return (
    <SafeAreaView style={estilos.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.scrollContent}
      >
        <View style={estilos.cabecalho}>
          <View style={estilos.logoContainer}>
            <View style={estilos.logoIconeBg}>
              <MaterialIcons name="shopping-cart" size={20} color={BRANCO} />
            </View>
            <Text style={estilos.logoTexto}>QuickBar</Text>
          </View>
          <View style={estilos.cabecalhoDireita}>
            <TouchableOpacity style={estilos.notifBtn}>
              <Feather name="bell" size={20} color={CINZA} />
              <View style={estilos.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity style={estilos.avatarBtn}>
              <Ionicons name="person-circle" size={40} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>


        <View style={estilos.boasVindas}>
          <Text style={estilos.saudacaoTexto}>{saudacao()}, 👋</Text>
          <Text style={estilos.nomeUsuario}>Luan</Text>
          <Text style={estilos.subtituloBoasVindas}>Aqui está o resumo do seu negócio hoje.</Text>
        </View>


        <View style={estilos.buscaContainer}>
          <Feather name="search" size={18} color={CINZA} style={{ marginRight: 10 }} />
          <TextInput
            style={estilos.buscaInput}
            placeholder="Buscar produtos, pedidos..."
            placeholderTextColor={CINZA_CLARO}
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')}>
              <Feather name="x" size={16} color={CINZA} />
            </TouchableOpacity>
          )}
        </View>

        <View style={estilos.gridCards}>
          {CARDS.map((c, i) => (
            <CardMetrica
              key={i}
              lib={c.lib}
              icone={c.icone}
              bg={c.bg}
              cor={c.cor}
              titulo={c.titulo}
              valor={c.valor}
              badge={c.badge}
              badgeCor={c.badgeCor}
              badgeBg={c.badgeBg}
              sub={c.sub}
              largura={(CONTENT_WIDTH - 14) / 2}
            />
          ))}
        </View>


        <View style={estilos.secao}>
          <View style={estilos.secaoTopo}>
            <Text style={estilos.secaoTitulo}>Vendas da Semana</Text>
            <TouchableOpacity>
              <Text style={estilos.secaoLink}>Ver mais</Text>
            </TouchableOpacity>
          </View>
          <View style={estilos.graficoCard}>
            <View style={estilos.graficoBars}>
              {GRAFICO.map((g, i) => {
                const alturaRelativa = (g.valor / GRAFICO_MAX) * 100;
                const ehMaior = g.valor === GRAFICO_MAX;
                return (
                  <View key={i} style={estilos.graficoColuna}>
                    <Text style={estilos.graficoValor}>{ehMaior ? g.valor : ''}</Text>
                    <View style={estilos.graficoBarraFundo}>
                      <View
                        style={[
                          estilos.graficoBarra,
                          {
                            height: `${alturaRelativa}%`,
                            backgroundColor: ehMaior ? AZUL : '#c8edf4',
                          },
                        ]}
                      />
                    </View>
                    <Text style={estilos.graficoDia}>{g.dia}</Text>
                  </View>
                );
              })}
            </View>
            <View style={estilos.graficoRodape}>
              <Text style={estilos.graficoTotal}>
                Total: <Text style={{ color: AZUL, fontWeight: '700' }}>R$ 4.250</Text>
              </Text>
              <Text style={estilos.graficoMeta}>Meta: R$ 5.000</Text>
            </View>
          </View>
        </View>


        <View style={estilos.secao}>
          <View style={estilos.secaoTopo}>
            <Text style={estilos.secaoTitulo}>Pedidos Recentes</Text>
            <TouchableOpacity>
              <Text style={estilos.secaoLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View style={estilos.pedidosLista}>
            {PEDIDOS.map((p, i) => (
              <ItemPedido
                key={i}
                id={p.id}
                produto={p.produto}
                hora={p.hora}
                status={p.status}
                cor={p.cor}
                bg={p.bg}
              />
            ))}
          </View>
        </View>


        <View style={estilos.secao}>
          <Text style={estilos.secaoTitulo}>Atalhos Rápidos</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 14 }}
            contentContainerStyle={{ gap: 12 }}
          >
            {[
              { icon: 'plus-circle',  label: 'Novo Produto', primario: true  },
              { icon: 'shopping-bag', label: 'Nova Venda',   primario: false },
              { icon: 'file-text',    label: 'Relatórios',   primario: false },
              { icon: 'users',        label: 'Clientes',     primario: false },
              { icon: 'settings',     label: 'Configurar',   primario: false },
            ].map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[estilos.atalhoBtn, !a.primario && estilos.atalhoBtnSecundario]}
                activeOpacity={0.8}
              >
                <Feather name={a.icon as any} size={18} color={a.primario ? BRANCO : AZUL} />
                <Text style={[estilos.atalhoTexto, !a.primario && { color: AZUL }]}>
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },
  scrollContent: {
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 50,
    paddingLeft: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconeBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AZUL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTexto: {
    fontSize: 20,
    fontWeight: '700',
    color: PRETO,
  },
  cabecalhoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: BRANCO,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#d32f2f',
    borderWidth: 1.5,
    borderColor: BRANCO,
  },
  avatarBtn: {
    borderRadius: 22,
  },
  boasVindas: {
    marginBottom: 20,
  },
  saudacaoTexto: {
    fontSize: 15,
    color: CINZA,
    fontWeight: '500',
  },
  nomeUsuario: {
    fontSize: 30,
    fontWeight: 'bold',
    color: AZUL,
    lineHeight: 36,
  },
  subtituloBoasVindas: {
    fontSize: 13,
    color: CINZA_CLARO,
    marginTop: 2,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRANCO,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  buscaInput: {
    flex: 1,
    fontSize: 14,
    color: PRETO,
  },
  gridCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  secao: {
    marginBottom: 28,
  },
  secaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: PRETO,
  },
  secaoLink: {
    fontSize: 13,
    color: AZUL,
    fontWeight: '600',
  },
  graficoCard: {
    backgroundColor: BRANCO,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  graficoBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 110,
    marginBottom: 8,
  },
  graficoColuna: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  graficoValor: {
    fontSize: 10,
    color: AZUL,
    fontWeight: '700',
    marginBottom: 2,
    height: 14,
  },
  graficoBarraFundo: {
    width: 18,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  graficoBarra: {
    width: '100%',
    borderRadius: 6,
  },
  graficoDia: {
    fontSize: 10,
    color: CINZA_CLARO,
    marginTop: 6,
    fontWeight: '500',
  },
  graficoRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 4,
  },
  graficoTotal: {
    fontSize: 13,
    color: CINZA,
    fontWeight: '500',
  },
  graficoMeta: {
    fontSize: 13,
    color: CINZA_CLARO,
  },
  pedidosLista: {
    backgroundColor: BRANCO,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  atalhoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AZUL,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 8,
    shadowColor: AZUL,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
  },
  atalhoBtnSecundario: {
    backgroundColor: BRANCO,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  atalhoTexto: {
    color: BRANCO,
    fontWeight: '600',
    fontSize: 13,
  },
});
