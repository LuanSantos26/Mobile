import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
// Você pode precisar instalar os ícones: npx expo install @expo/vector-icons
import { MaterialIcons, Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';

// Defina as cores com base na imagem
const COLORS = {
  background: '#FFFFFF',
  border: '#E0E0E0',
  iconPrimary: '#1A1A1A',
  iconSecondary: '#757575',
  accent: '#2196F3', // Um azul para o botão principal
};

interface QuickBarProps {
  // Você pode adicionar props para controlar o estado ou callbacks
  // Por exemplo: onProfilePress?: () => void;
}

const QuickBar: React.FC<QuickBarProps> = () => {
  return (
    <View style={styles.container}>
      {/* Botão de Perfil do Usuário na parte superior */}
      <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
        <Ionicons name="person-circle" size={40} color={COLORS.iconPrimary} />
      </TouchableOpacity>

      {/* Seção Central de Ícones/Ações */}
      <View style={styles.mainActionsContainer}>
        {/* Usando ícones genéricos para replicar a aparência visual */}
        <QuickBarIcon iconType={MaterialIcons} name="dashboard" label="Dashboard" />
        <QuickBarIcon iconType={Ionicons} name="analytics-sharp" label="Analytics" />
        
        {/* Botão de ação principal em destaque (como um "Adicionar Novo") */}
        <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8}>
            <Entypo name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <QuickBarIcon iconType={FontAwesome5} name="tasks" label="Tasks" />
        <QuickBarIcon iconType={MaterialIcons} name="message" label="Messages" />
      </View>

      {/* Botão de Configurações na parte inferior */}
      <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
        <Ionicons name="settings-sharp" size={24} color={COLORS.iconSecondary} />
      </TouchableOpacity>
    </View>
  );
};

// Componente auxiliar para renderizar os ícones de ação
interface QuickBarIconProps {
    iconType: any;
    name: string;
    label: string;
}

const QuickBarIcon: React.FC<QuickBarIconProps> = ({ iconType: Icon, name, label }) => {
    return (
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Icon name={name} size={24} color={COLORS.iconPrimary} />
            {/* Você pode adicionar um label se desejar, mas a imagem não o tem explicitamente */}
            {/* <Text style={styles.iconLabel}>{label}</Text> */}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    // Alinhamento vertical e centralizado
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between', // Separa o topo, o meio e a base

    // Aparência visual fiel à imagem (borda, sombra, cantos arredondados)
    backgroundColor: COLORS.background,
    width: 70, // Largura aproximada da barra
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,

    // Sombra para dar profundidade (ajuste conforme necessário)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Para Android

    // Posicionamento (exemplo: à esquerda na tela)
    position: 'absolute',
    left: 20,
    top: 50,
    bottom: 50, // Ocupa a maior parte da altura da tela
  },
  profileButton: {
    marginBottom: 20,
  },
  mainActionsContainer: {
    flex: 1, // Ocupa o espaço central disponível
    justifyContent: 'center', // Centraliza os ícones verticalmente
    width: '100%',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // iconLabel: {
  //   fontSize: 10,
  //   marginTop: 4,
  //   color: COLORS.iconPrimary,
  // },
  primaryActionButton: {
    backgroundColor: COLORS.accent,
    width: 50,
    height: 50,
    borderRadius: 25, // Torna o botão perfeitamente circular
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    // Sombra para o botão principal
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  settingsButton: {
    marginTop: 20,
  },
});

export default QuickBar;