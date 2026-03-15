import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const aoClicarLogin = () => {
    if (!usuario || !senha) {
      Alert.alert('Atenção', 'Preencha usuário e senha para continuar.');
      return;
    }
    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      Alert.alert('Bem-vindo!', `Login realizado com sucesso!\nUsuário: ${usuario}`);
    }, 1800);
  };

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Fundo: azul no topo, transição para amarelo/terra */}
      <View style={estilos.fundoTopo} />
      <View style={estilos.fundoBase} />

      {/* Cacto decorativo (canto inferior direito) */}
      <View style={estilos.cactoContainer}>
        <View style={estilos.cactoTronco}>
          {/* Braço direito */}
          <View style={estilos.bracoDireitoH} />
          <View style={estilos.bracoDireitoV} />
          {/* Braço esquerdo */}
          <View style={estilos.bracoEsquerdoH} />
          <View style={estilos.bracoEsquerdoV} />
        </View>
        <View style={estilos.vasoAro} />
        <View style={estilos.vasoCopo} />
      </View>

      <KeyboardAvoidingView
        style={estilos.conteudo}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Logo ── */}
        <View style={estilos.cabecalho}>
          <View style={estilos.logoRow}>
            {/* Carrinho de compras desenhado com Views */}
            <View style={estilos.carrinho}>
              <View style={estilos.carrinhoAlca} />
              <View style={estilos.carrinhoCorpo}>
                <View style={estilos.gradeLinha} />
                <View style={estilos.gradeLinha} />
                <View style={estilos.gradeLinha} />
              </View>
              <View style={estilos.rodasRow}>
                <View style={estilos.roda} />
                <View style={estilos.roda} />
              </View>
            </View>
            <Text style={estilos.logoTexto}>QuickBar</Text>
          </View>

          <Text style={estilos.bemVindo}>BEM-VINDO AO QUICKBAR</Text>
          <Text style={estilos.subtitulo}>Gerenciamento inteligente</Text>
        </View>

        {/* ── Campos ── */}
        <View style={estilos.formulario}>

          {/* Usuário */}
          <View style={estilos.campoWrapper}>
            <View style={estilos.iconeBox}>
              {/* Ícone pessoa */}
              <View style={estilos.pessoaCabeca} />
              <View style={estilos.pessoaCorpo} />
            </View>
            <TextInput
              style={estilos.input}
              placeholder="Digite seu usuário"
              placeholderTextColor="#5aafbf"
              autoCapitalize="none"
              value={usuario}
              onChangeText={setUsuario}
              selectionColor="#e8a020"
            />
          </View>

          {/* Senha */}
          <View style={estilos.campoWrapper}>
            <View style={estilos.iconeBox}>
              {/* Ícone cadeado */}
              <View style={estilos.cadeadoArco} />
              <View style={estilos.cadeadoCorpo} />
            </View>
            <TextInput
              style={[estilos.input, { flex: 1 }]}
              placeholder="Digite sua senha"
              placeholderTextColor="#5aafbf"
              secureTextEntry={!senhaVisivel}
              value={senha}
              onChangeText={setSenha}
              selectionColor="#e8a020"
            />
            <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)} style={{ paddingHorizontal: 4 }}>
              <Text style={{ color: '#5aafbf', fontSize: 13 }}>{senhaVisivel ? '◉' : '○'}</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Login */}
          <TouchableOpacity
            style={estilos.botaoLogin}
            onPress={aoClicarLogin}
            activeOpacity={0.85}
          >
            {carregando
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={estilos.botaoTexto}>Login</Text>
            }
          </TouchableOpacity>

          {/* Esqueceu a senha */}
          <TouchableOpacity style={estilos.esqueciBtn}>
            <Text style={estilos.esqueciTexto}>Esqueceu a senha</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* ── Rodapé ── */}
      <View style={estilos.rodape}>
        <TouchableOpacity style={estilos.criaContaBtn}>
          <Text style={estilos.criaContaIcone}>👤</Text>
          <Text style={estilos.criaContaTexto}>Cria conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Paleta ──────────────────────────────────────────
const AZUL       = '#3bbdd4';
const AZUL_CAMPO = '#d6f4f8';
const AMARELO    = '#e8a020';
const TERRA      = '#c8a030';
const VERDE_CACTO = '#5aaa6e';

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Fundo em duas camadas
  fundoTopo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AZUL,
    bottom: height * 0.28,
  },
  fundoBase: {
    position: 'absolute',
    left: 0, right: 0,
    top: height * 0.58,
    bottom: 0,
    backgroundColor: TERRA,
  },

  // ── Cacto ──────────────────────────────────────────
  cactoContainer: {
    position: 'absolute',
    bottom: 52,
    right: 18,
    alignItems: 'center',
  },
  cactoTronco: {
    width: 34,
    height: 100,
    backgroundColor: VERDE_CACTO,
    borderRadius: 17,
  },
  // Braço direito
  bracoDireitoH: {
    position: 'absolute',
    top: 30,
    right: -24,
    width: 26,
    height: 12,
    backgroundColor: VERDE_CACTO,
    borderRadius: 6,
  },
  bracoDireitoV: {
    position: 'absolute',
    top: 8,
    right: -24,
    width: 12,
    height: 26,
    backgroundColor: VERDE_CACTO,
    borderRadius: 6,
  },
  // Braço esquerdo
  bracoEsquerdoH: {
    position: 'absolute',
    top: 52,
    left: -20,
    width: 22,
    height: 11,
    backgroundColor: VERDE_CACTO,
    borderRadius: 5,
  },
  bracoEsquerdoV: {
    position: 'absolute',
    top: 32,
    left: -20,
    width: 11,
    height: 24,
    backgroundColor: VERDE_CACTO,
    borderRadius: 5,
  },
  vasoAro: {
    width: 46,
    height: 10,
    backgroundColor: AMARELO,
    borderRadius: 3,
    marginTop: 2,
  },
  vasoCopo: {
    width: 40,
    height: 30,
    backgroundColor: AMARELO,
    borderRadius: 5,
    marginTop: 2,
  },

  // ── Conteúdo ───────────────────────────────────────
  conteudo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'ios' ? 64 : 52,
  },

  // ── Logo / cabeçalho ──────────────────────────────
  cabecalho: {
    alignItems: 'center',
    marginBottom: 34,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },

  // Carrinho
  carrinho: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  carrinhoAlca: {
    width: 22,
    height: 10,
    borderWidth: 2.5,
    borderColor: '#fff',
    borderRadius: 8,
    borderBottomWidth: 0,
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginBottom: -1,
  },
  carrinhoCorpo: {
    width: 34,
    height: 22,
    borderWidth: 2.5,
    borderColor: '#fff',
    borderRadius: 4,
    borderTopWidth: 0,
    paddingHorizontal: 3,
    paddingTop: 2,
    gap: 2,
  },
  gradeLinha: {
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  rodasRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 3,
  },
  roda: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },

  logoTexto: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  bemVindo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    letterSpacing: 0.3,
  },

  // ── Formulário ────────────────────────────────────
  formulario: {
    gap: 14,
  },
  campoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 10,
  },
  iconeBox: {
    width: 22,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Pessoa
  pessoaCabeca: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AZUL,
    marginBottom: 2,
  },
  pessoaCorpo: {
    width: 16,
    height: 9,
    borderRadius: 8,
    backgroundColor: AZUL,
  },

  // Cadeado
  cadeadoArco: {
    width: 12,
    height: 7,
    borderWidth: 2,
    borderColor: AZUL,
    borderRadius: 6,
    borderBottomWidth: 0,
    marginBottom: 1,
  },
  cadeadoCorpo: {
    width: 14,
    height: 10,
    backgroundColor: AZUL,
    borderRadius: 3,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#1a7a8a',
    paddingVertical: 0,
  },

  // Botão
  botaoLogin: {
    backgroundColor: AMARELO,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // Esqueceu
  esqueciBtn: {
    alignSelf: 'center',
    marginTop: 2,
  },
  esqueciTexto: {
    color: '#fff',
    fontSize: 13,
    textDecorationLine: 'underline',
    opacity: 0.9,
  },

  // ── Rodapé ────────────────────────────────────────
  rodape: {
    backgroundColor: '#e4e4e4',
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  criaContaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  criaContaIcone: {
    fontSize: 16,
    color: AZUL,
  },
  criaContaTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: AZUL,
  },
});