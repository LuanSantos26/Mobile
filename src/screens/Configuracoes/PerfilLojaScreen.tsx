import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { atualizarEmpresa, uploadImagemEmpresa } from '../../services/authService';
import { getImageUrl } from '../../config/api';
import { prepararImagemProduto } from '../../utils/productImage';
import { AjustesSubtela } from './components/AjustesSubtela';
import { styles } from './styles';

const DESCRICAO_LOJA_MAX = 300;

type TipoImagemLoja = 'logo' | 'capa';

/** Subtela de Ajustes do fornecedor: foto, capa e descrição exibidas aos clientes. */
export function PerfilLojaScreen() {
  const { user, updateUser } = useAuth();

  const [descricaoLoja, setDescricaoLoja] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [capaUrl, setCapaUrl] = useState('');
  const [logoLocal, setLogoLocal] = useState<string | undefined>();
  const [capaLocal, setCapaLocal] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    setDescricaoLoja(user.empresa?.descricao ?? '');
    setLogoUrl(user.empresa?.logoUrl ?? '');
    setCapaUrl(user.empresa?.capaUrl ?? '');
  }, [user]);

  const escolherImagem = async (tipo: TipoImagemLoja) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Permissão para acessar a galeria é necessária.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: tipo === 'logo' ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) return;
    try {
      const preparada = await prepararImagemProduto(result.assets[0].uri);
      if (tipo === 'logo') setLogoLocal(preparada.uri);
      else setCapaLocal(preparada.uri);
      setError('');
    } catch {
      setError('Não foi possível processar a imagem. Tente outra foto.');
    }
  };

  const removerImagem = (tipo: TipoImagemLoja) => {
    if (tipo === 'logo') {
      setLogoLocal(undefined);
      setLogoUrl('');
    } else {
      setCapaLocal(undefined);
      setCapaUrl('');
    }
  };

  const logoPreview = logoLocal ?? getImageUrl(logoUrl || undefined);
  const capaPreview = capaLocal ?? getImageUrl(capaUrl || undefined);

  const handleSalvar = async () => {
    setError('');
    setSuccess('');

    if (!user?.empresa?.id) {
      setError('Usuário não identificado.');
      return;
    }

    setLoading(true);
    try {
      const empresaAtualizada = await atualizarEmpresa(user.empresa.id, {
        nome: user.empresa.nome,
        cnpj: user.empresa.cnpj,
        telefone: user.empresa.telefone || undefined,
        descricao: descricaoLoja.trim(),
        logoUrl: logoLocal ? await uploadImagemEmpresa(logoLocal) : logoUrl,
        capaUrl: capaLocal ? await uploadImagemEmpresa(capaLocal) : capaUrl,
      });

      await updateUser({
        ...user,
        empresa: {
          ...user.empresa,
          descricao: empresaAtualizada.descricao,
          logoUrl: empresaAtualizada.logoUrl,
          capaUrl: empresaAtualizada.capaUrl,
        },
      });

      setLogoLocal(undefined);
      setCapaLocal(undefined);
      setSuccess('Perfil da loja salvo com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar o perfil da loja.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AjustesSubtela
      title="Perfil da loja"
      icon="storefront-outline"
      subtitle="Foto, capa e descrição exibidas aos clientes."
      saveLabel="Salvar perfil da loja"
      onSave={handleSalvar}
      loading={loading}
      error={error}
      success={success}
    >
      <TouchableOpacity
        style={styles.capaBox}
        onPress={() => escolherImagem('capa')}
        activeOpacity={0.85}
      >
        {capaPreview ? (
          <Image source={{ uri: capaPreview }} style={styles.capaImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color="#9AA3B2" />
            <Text style={styles.imagePlaceholderText}>Adicionar capa</Text>
          </View>
        )}
        <View style={styles.imageEditBadge}>
          <Ionicons name="camera" size={14} color="#FFF" />
        </View>
      </TouchableOpacity>

      <View style={styles.logoRow}>
        <TouchableOpacity
          style={styles.logoBox}
          onPress={() => escolherImagem('logo')}
          activeOpacity={0.85}
        >
          {logoPreview ? (
            <Image source={{ uri: logoPreview }} style={styles.logoImage} resizeMode="cover" />
          ) : (
            <Ionicons name="storefront-outline" size={28} color="#9AA3B2" />
          )}
          <View style={styles.imageEditBadge}>
            <Ionicons name="camera" size={12} color="#FFF" />
          </View>
        </TouchableOpacity>
        <View style={styles.imageActions}>
          <TouchableOpacity onPress={() => escolherImagem('logo')}>
            <Text style={styles.imageActionText}>
              {logoPreview ? 'Trocar foto' : 'Adicionar foto'}
            </Text>
          </TouchableOpacity>
          {logoPreview ? (
            <TouchableOpacity onPress={() => removerImagem('logo')}>
              <Text style={styles.imageRemoveText}>Remover foto</Text>
            </TouchableOpacity>
          ) : null}
          {capaPreview ? (
            <TouchableOpacity onPress={() => removerImagem('capa')}>
              <Text style={styles.imageRemoveText}>Remover capa</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descricaoLoja}
        onChangeText={setDescricaoLoja}
        placeholder="Conte aos clientes o que sua loja oferece"
        multiline
        maxLength={DESCRICAO_LOJA_MAX}
        textAlignVertical="top"
      />
      <Text style={styles.counter}>
        {descricaoLoja.length}/{DESCRICAO_LOJA_MAX}
      </Text>
    </AjustesSubtela>
  );
}
