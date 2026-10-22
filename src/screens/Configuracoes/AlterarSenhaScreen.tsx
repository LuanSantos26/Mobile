import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { atualizarUsuario } from '../../services/authService';
import { AjustesCampo } from './components/AjustesCampo';
import { AjustesSubtela } from './components/AjustesSubtela';

/** Subtela de Ajustes: troca de senha. */
export function AlterarSenhaScreen() {
  const { user } = useAuth();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSalvar = async () => {
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('Usuário não identificado.');
      return;
    }
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await atualizarUsuario(user.id, { senha });
      setSenha('');
      setConfirmarSenha('');
      setSuccess('Senha alterada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AjustesSubtela
      title="Alterar senha"
      icon="lock-closed-outline"
      subtitle="Defina uma nova senha para a sua conta."
      saveLabel="Alterar senha"
      onSave={handleSalvar}
      loading={loading}
      error={error}
      success={success}
    >
      <AjustesCampo
        label="Nova senha"
        icon="lock-closed-outline"
        value={senha}
        onChangeText={setSenha}
        placeholder="Mínimo 6 caracteres"
        autoCapitalize="none"
        secureTextEntry
      />

      <AjustesCampo
        label="Confirmar senha"
        icon="lock-closed-outline"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        placeholder="Repita a nova senha"
        autoCapitalize="none"
        secureTextEntry
      />
    </AjustesSubtela>
  );
}
