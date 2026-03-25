export const COLORS = {

  azul:         '#3bbdd4',
  azulEscuro:   '#1a7a8a',
  azulClaro:    '#d6f4f8',
  amarelo:      '#e8a020',
  amareloClaro: '#fff3d6',
  terra:        '#c8a030',
  branco:       '#FFFFFF',
  fundoApp:     '#F7F9FC',
  cinzaClaro:   '#E0E0E0',
  cinzaMedio:   '#9E9E9E',
  cinzaEscuro:  '#757575',
  preto:        '#1A1A1A',
  sucesso:      '#2e7d32',
  sucessoFundo: '#e3fcec',
  alerta:       '#f57c00',
  alertaFundo:  '#fff3e0',
  info:         '#0288d1',
  infoFundo:    '#e1f5fe',
  destaque:     '#7b1fa2',
  destaqueFundo:'#f3e5f5',

  erro:         '#d32f2f',
  erroFundo:    '#ffebee',

 
  overlay:      'rgba(0,0,0,0.45)',
  overlayClaro: 'rgba(255,255,255,0.15)',
  fundoCampo:   'rgba(255,255,255,0.90)',
};

export const FONTES = {
  regular:   '400' as const,
  medio:     '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,

  xs:   11,
  sm:   13,
  md:   15,
  lg:   17,
  xl:   20,
  xxl:  24,
  xxxl: 32,
  hero: 40,
};

export const ESPACOS = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const BORDAS = {
  sm:     8,
  md:     16,
  lg:     20,
  xl:     30,
  circulo:999,
};

export const SOMBRAS = {
  leve: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  media: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  forte: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 8,
  },
};
