import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardTypeOptions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTES, ESPACOS, BORDAS } from '../constants/theme';

interface CampoTextoProps {
  icone: React.ComponentProps<typeof Feather>['name'];
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureText?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  editable?: boolean;
  mostrarOlho?: boolean;
  corIcone?: string;
}

export default function CampoTexto({
  icone,
  placeholder,
  value,
  onChangeText,
  secureText = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  editable = true,
  mostrarOlho = false,
  corIcone = COLORS.azul,
}: CampoTextoProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={estilos.campoWrapper}>
      <Feather name={icone} size={17} color={corIcone} style={estilos.campoIcone} />
      <TextInput
        style={[estilos.input, mostrarOlho && { flex: 1 }]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.cinzaMedio}
        secureTextEntry={secureText && !visivel}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete as any}
        value={value}
        onChangeText={onChangeText}
        selectionColor={COLORS.azul}
        editable={editable}
      />
      {mostrarOlho && (
        <TouchableOpacity
          onPress={() => setVisivel(!visivel)}
          style={estilos.olhoBtn}
          disabled={!editable}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name={visivel ? 'eye' : 'eye-off'}
            size={17}
            color={COLORS.cinzaMedio}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  campoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: BORDAS.xl,
    paddingHorizontal: ESPACOS.md,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    borderWidth: 1,
    borderColor: 'rgba(59,189,212,0.20)',
    minHeight: 50,
  },
  campoIcone: {
    marginRight: ESPACOS.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTES.md,
    color: COLORS.preto,
    paddingVertical: 0,
  },
  olhoBtn: {
    padding: ESPACOS.xs,
  },
});
