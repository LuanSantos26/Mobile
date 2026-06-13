import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getImageUrl } from '../config/api';
import { Barraquinha, EstoqueItem, formatarQuantidade } from '../services/barracaService';
import { formatarPreco } from '../services/productService';
import { formatarDiaSemana } from '../utils/dateFormat';

interface BarracaCardProps {
  barraquinha: Barraquinha;
  onPress: () => void;
  onDelete: () => void;
}

const CollapsedItem = ({ item }: { item: EstoqueItem }) => (
  <View style={styles.stockItemCardCollapsed}>
    {item.imagemUrl ? (
      <Image source={{ uri: getImageUrl(item.imagemUrl) }} style={styles.thumbnail} />
    ) : (
      <MaterialCommunityIcons name="bottle-wine-outline" size={35} color="#F8B125" style={styles.stockIcon} />
    )}
    <View style={styles.stockTextContainer}>
      <Text style={styles.stockItemName} numberOfLines={2}>{item.nome}</Text>
      <Text style={styles.stockItemPrice}>{formatarPreco(item.precoVenda)}</Text>
      <Text style={styles.stockItemTotal}>
        Total :<Text style={styles.stockItemTotalNumber}>{formatarQuantidade(item.quantidade, item.unidade)}</Text>
      </Text>
    </View>
  </View>
);

const ExpandedItem = ({ item }: { item: EstoqueItem }) => (
  <View style={styles.stockItemCardExpanded}>
    {item.imagemUrl ? (
      <Image source={{ uri: getImageUrl(item.imagemUrl) }} style={styles.expandedThumbnail} />
    ) : (
      <MaterialCommunityIcons name="bottle-wine-outline" size={35} color="#F8B125" style={styles.stockIcon} />
    )}
    <View style={styles.stockTextContainer}>
      <Text style={styles.stockItemName}>{item.nome}</Text>
      <Text style={styles.stockItemPrice}>{formatarPreco(item.precoVenda)}</Text>
      <Text style={styles.stockItemTotal}>
        Total :<Text style={styles.stockItemTotalNumber}>{formatarQuantidade(item.quantidade, item.unidade)}</Text>
      </Text>
    </View>
  </View>
);

export function BarracaCard({ barraquinha, onPress, onDelete }: BarracaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const itensComEstoque = barraquinha.itens.filter((item) => item.quantidade > 0);
  const itensExibicao = itensComEstoque.length ? itensComEstoque : barraquinha.itens;
  const dataLabel = formatarDiaSemana(barraquinha.atualizadoEm);
  const resumo = `${barraquinha.totalProdutos} produto(s) em estoque · ${barraquinha.totalUnidades} un disponíveis`;

  return (
    <View style={styles.mainCard}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded(!expanded)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={[styles.dot, { backgroundColor: '#F8B125' }]} />
            <Text style={styles.cardTitle}>{barraquinha.nome}</Text>
          </View>
          <View style={styles.datePillCard}>
            <Text style={styles.dateTextCard}>{dataLabel}</Text>
            <Ionicons name="calendar-outline" size={14} color="#F8B125" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {expanded && (
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{resumo}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Evento: {barraquinha.eventoNome}</Text>
            </View>
          </View>
        )}

        {!expanded && <Text style={styles.summaryText}>{resumo}</Text>}

        {!expanded && itensExibicao.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {itensExibicao.map((item) => (
              <CollapsedItem key={item.produtoId} item={item} />
            ))}
          </ScrollView>
        ) : null}

        {!expanded && itensExibicao.length === 0 ? (
          <Text style={styles.emptyItemsText}>Nenhum produto com estoque registrado.</Text>
        ) : null}
      </TouchableOpacity>

      {expanded ? (
        <>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <Ionicons name="create-outline" size={18} color="#F8B125" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonDanger} onPress={onDelete}>
              <Ionicons name="trash-outline" size={18} color="#D64545" />
              <Text style={styles.actionButtonDangerText}>Remover</Text>
            </TouchableOpacity>
          </View>

          {itensExibicao.length > 0 ? (
            <View style={styles.gridContainer}>
              {itensExibicao.map((item) => (
                <ExpandedItem key={item.produtoId} item={item} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyItemsText}>Nenhum produto com estoque registrado.</Text>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1.5,
    borderColor: '#EAEAEA',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8B125',
    flexShrink: 1,
  },
  datePillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F8B125',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  dateTextCard: {
    color: '#F8B125',
    fontSize: 10,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#666',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    color: '#F8B125',
    fontWeight: '600',
  },
  actionButtonDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonDangerText: {
    color: '#D64545',
    fontWeight: '600',
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stockItemCardCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F8B125',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    minWidth: 160,
  },
  stockItemCardExpanded: {
    width: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#F8B125',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  thumbnail: {
    width: 35,
    height: 35,
    borderRadius: 8,
    marginRight: 8,
  },
  expandedThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginBottom: 8,
  },
  stockIcon: {
    marginRight: 8,
  },
  stockTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  stockItemPrice: {
    fontSize: 11,
    color: '#F8B125',
    fontWeight: '600',
    textAlign: 'center',
  },
  stockItemTotal: {
    fontSize: 11,
    color: '#000',
    fontWeight: 'bold',
  },
  stockItemTotalNumber: {
    color: '#F8B125',
    fontSize: 14,
  },
  emptyItemsText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 8,
  },
});
