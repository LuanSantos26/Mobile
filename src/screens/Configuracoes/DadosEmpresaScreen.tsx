import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { atualizarEmpresa } from '../../services/authService';
import { formatarCnpjInput, formatarTelefoneInput, normalizarDocumento } from '../../utils/pixUtils';
import { AjustesCampo } from './components/AjustesCampo';
import { AjustesSubtela } from './components/AjustesSubtela';

/** Subtela de Ajustes: dados da empresa (fornecedor) ou do negócio (cliente, sem telefone). */
export function DadosEmpresaScreen() {
  const { user, updateUser, perfilUso } = useAuth();
  const isCliente = perfilUso === 'Cliente';

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpjEmpresa, setCnpjEmpresa] = useState('');
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) return;
    setNomeEmpresa(user.empresa?.nome ?? '');
    setCnpjEmpresa(user.empresa?.cnpj ?? '');
    setTelefoneEmpresa(user.empresa?.telefone ?? '');
  }, [user]);

  const handleSalvar = async () => {
    setError('');
    setSuccess('');

    if (!user?.empresa?.id) {
      setError('Usuário não identificado.');
      return;
    }

    const nomeEmpresaTrim = nomeEmpresa.trim();
    const cnpjDigits = normalizarDocumento(cnpjEmpresa);
    if (!nomeEmpresaTrim) {
      setError(isCliente ? 'Informe o nome do negócio.' : 'Informe o nome da empresa.');
      return;
    }
    if (cnpjDigits.length !== 14) {
      setError('Informe um CNPJ válido com 14 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const empresaAtualizada = await atualizarEmpresa(user.empresa.id, {
        nome: nomeEmpresaTrim,
        cnpj: formatarCnpjInput(cnpjDigits),
        telefone: telefoneEmpresa.trim() || undefined,
      });
      await updateUser({
        ...user,
        empresa: {
          ...user.empresa,
          nome: empresaAtualizada.nome,
          cnpj: empresaAtualizada.cnpj,
          telefone: empresaAtualizada.telefone,
        },
      });
      setSuccess(isCliente ? 'Dados do negócio salvos com sucesso!' : 'Dados da empresa salvos com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados da empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AjustesSubtela
      title={isCliente ? 'Dados do negócio' : 'Dados da empresa'}
      subtitle={isCliente ? 'Nome e CNPJ do estabelecimento.' : 'Informações usadas nos pedidos.'}
      icon="business-outline"
      saveLabel={isCliente ? 'Salvar dados do negócio' : 'Salvar dados da empresa'}
      onSave={handleSalvar}
      loading={loading}
      error={error}
      success={success}
    >
      <AjustesCampo
        label={isCliente ? 'Nome do negócio' : 'Nome da empresa'}
        icon="storefront-outline"
        value={nomeEmpresa}
        onChangeText={setNomeEmpresa}
        placeholder={isCliente ? 'Nome do estabelecimento' : 'Razão social ou nome fantasia'}
        autoCapitalize="words"
      />

      <AjustesCampo
        label="CNPJ"
        icon="document-text-outline"
        value={cnpjEmpresa}
        onChangeText={(text) => setCnpjEmpresa(formatarCnpjInput(text))}
        placeholder="00.000.000/0000-00"
        keyboardType="number-pad"
        maxLength={18}
      />

      {isCliente ? null : (
        <AjustesCampo
          label="Telefone"
          icon="call-outline"
          value={telefoneEmpresa}
          onChangeText={(text) => setTelefoneEmpresa(formatarTelefoneInput(text))}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          maxLength={15}
        />
      )}
    </AjustesSubtela>
  );
}
