import { useState } from 'react';
type Regra<T> = {
  campo: keyof T;
  validar: (valor: string, dados: T) => string | null;
};

type Erros<T> = Partial<Record<keyof T, string>>;

export function useFormValidacao<T extends Record<string, string>>(
  regras: Regra<T>[]
) {
  const [erros, setErros] = useState<Erros<T>>({});

  const validarTudo = (dados: T): boolean => {
    const novosErros: Erros<T> = {};
    for (const regra of regras) {
      const mensagem = regra.validar(dados[regra.campo as string], dados);
      if (mensagem) novosErros[regra.campo] = mensagem;
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const limparErro = (campo: keyof T) => {
    setErros(prev => {
      const copia = { ...prev };
      delete copia[campo];
      return copia;
    });
  };

  const limparTudo = () => setErros({});

  return { erros, validarTudo, limparErro, limparTudo };
}

export const regrasComuns = {
  nomeObrigatorio: (campo: string) => ({
    campo,
    validar: (v: string) => (!v?.trim() ? 'Nome é obrigatório.' : null),
  }),

  emailValido: (campo: string) => ({
    campo,
    validar: (v: string) =>
      !v?.includes('@') ? 'Informe um e-mail válido.' : null,
  }),

  senhaMinima: (campo: string, min = 6) => ({
    campo,
    validar: (v: string) =>
      (v?.length ?? 0) < min ? `Senha deve ter pelo menos ${min} caracteres.` : null,
  }),

  senhasIguais: (campo: string, campoPrincipal: string) => ({
    campo,
    validar: (v: string, dados: Record<string, string>) =>
      v !== dados[campoPrincipal] ? 'As senhas não coincidem.' : null,
  }),

  campoObrigatorio: (campo: string, label = 'Campo') => ({
    campo,
    validar: (v: string) => (!v?.trim() ? `${label} é obrigatório.` : null),
  }),
};
