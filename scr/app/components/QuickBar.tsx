import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5, Entypo } from '@expo/vector-icons';

const COLORS = {
  background: '#FFFFFF',
  border: '#E0E0E0',
  iconPrimary: '#1A1A1A',
  iconSecondary: '#757575',
  accent: '#2196F3', 
};

interface QuickBarProps {

}

const QuickBar: React.FC<QuickBarProps> = () => {
  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
        <Ionicons name="person-circle" size={40} color={COLORS.iconPrimary} />
      </TouchableOpacity>

      <View style={styles.mainActionsContainer}>
        <QuickBarIcon iconType={MaterialIcons} name="dashboard" label="Dashboard" />
        <QuickBarIcon iconType={Ionicons} name="analytics-sharp" label="Analytics" />
        
        <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.8}>
            <Entypo name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <QuickBarIcon iconType={FontAwesome5} name="tasks" label="Tasks" />
        <QuickBarIcon iconType={MaterialIcons} name="message" label="Messages" />
      </View>

      <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
        <Ionicons name="settings-sharp" size={24} color={COLORS.iconSecondary} />
      </TouchableOpacity>
    </View>
  );
};

interface QuickBarIconProps {
    iconType: any;
    name: string;
    label: string;
}

const QuickBarIcon: React.FC<QuickBarIconProps> = ({ iconType: Icon, name }) => {
    return (
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Icon name={name} size={24} color={COLORS.iconPrimary} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',


    backgroundColor: COLORS.background,
    width: 70, 
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    position: 'absolute',
    left: 20,
    top: 50,
    bottom: 50, 
  },
  profileButton: {
    marginBottom: 20,
  },
  mainActionsContainer: {
    flex: 1,
    justifyContent: 'center',
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
 
  primaryActionButton: {
    backgroundColor: COLORS.accent,
    width: 50,
    height: 50,
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
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