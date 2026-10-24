import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { atualizarUsuario, uploadFotoUsuario } from '../../services/authService';
import { getImageUrl } from '../../config/api';
import { prepararImagemProduto } from '../../utils/productImage';
import { CLIENTE_COLORS } from '../../theme/theme';
import { AjustesCampo } from './components/AjustesCampo';
import { AjustesSubtela } from './components/AjustesSubtela';
import { clienteStyles } from './styles';

/** Subtela de Ajustes: nome e e-mail da conta (e foto de perfil, para o cliente). */
export function DadosPessoaisScreen() {
  const { user, updateUser, perfilUso } = useAuth();
  const isCliente = perfilUso === 'Cliente';

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [fotoLocal, setFotoLocal] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    setNome(user.nome ?? '');
    setEmail(user.email ?? '');
    setFotoUrl(user.fotoUrl ?? '');
  }, [user]);

  const escolherFoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Permissão para acessar a galeria é necessária.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) return;
    try {
      const preparada = await prepararImagemProduto(result.assets[0].uri);
      setFotoLocal(preparada.uri);
      setError('');
    } catch {
      setError('Não foi possível processar a imagem. Tente outra foto.');
    }
  };

  const removerFoto = () => {
    setFotoLocal(undefined);
    setFotoUrl('');
  };

  const fotoPreview = fotoLocal ?? getImageUrl(fotoUrl || undefined);

  const handleSalvar = async () => {
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('Usuário não identificado.');
      return;
    }

    const nomeTrim = nome.trim();
    const emailTrim = email.trim().toLowerCase();
    if (!nomeTrim) {
      setError('Informe seu nome.');
      return;
    }
    if (!emailTrim) {
      setError('Informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      const payload: Parameters<typeof atualizarUsuario>[1] = { nome: nomeTrim, email: emailTrim };
      if (isCliente) {
        payload.fotoUrl = fotoLocal ? await uploadFotoUsuario(fotoLocal) : fotoUrl;
      }
      const usuarioAtualizado = await atualizarUsuario(user.id, payload);
      await updateUser({
        ...user,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        fotoUrl: usuarioAtualizado.fotoUrl,
      });
      setFotoLocal(undefined);
      setSuccess('Dados pessoais salvos com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados pessoais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AjustesSubtela
      title="Dados pessoais"
      icon="person-outline"
      subtitle="Nome e e-mail da conta."
      saveLabel="Salvar dados pessoais"
      onSave={handleSalvar}
      loading={loading}
      error={error}
      success={success}
    >
      {isCliente ? (
        <View style={clienteStyles.fotoWrap}>
          <TouchableOpacity style={clienteStyles.fotoBox} onPress={escolherFoto} activeOpacity={0.85}>
            {fotoPreview ? (
              <Image source={{ uri: fotoPreview }} style={clienteStyles.fotoImage} resizeMode="cover" />
            ) : (
              <Ionicons name="person-outline" size={36} color={CLIENTE_COLORS.primary} />
            )}
            <View style={clienteStyles.fotoBadge}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={escolherFoto}>
            <Text style={clienteStyles.fotoAction}>{fotoPreview ? 'Trocar foto' : 'Adicionar foto'}</Text>
          </TouchableOpacity>
          {fotoPreview ? (
            <TouchableOpacity onPress={removerFoto}>
              <Text style={clienteStyles.fotoRemove}>Remover foto</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      <AjustesCampo
        label="Nome"
        icon="person-outline"
        value={nome}
        onChangeText={setNome}
        placeholder="Seu nome"
        autoCapitalize="words"
      />

      <AjustesCampo
        label="E-mail"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </AjustesSubtela>
  );
}
