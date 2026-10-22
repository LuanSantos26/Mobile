export interface EnderecoEntrega {
  id: number;
  empresaId: number;
  apelido: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  principal: boolean;
  resumo: string;
}

export interface EnderecoEntregaPayload {
  empresaId: number;
  apelido: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  principal?: boolean;
}

export interface DadosCep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}
