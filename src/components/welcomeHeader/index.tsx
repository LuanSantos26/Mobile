import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, InteractionManager } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

interface WelcomeHeaderProps {
    hideReturnButton?: boolean;
}

export function WelcomeHeader({ hideReturnButton = false }: WelcomeHeaderProps) {
    const navigation = useNavigation<any>();

    return (
        <View style={{ flex: 1 }}>
            {!hideReturnButton &&
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}
                    style={{
                        flex: 1,
                        position: 'absolute',
                        left: -40,
                    }}
                >
                    <AntDesign name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
            }

            <View style={styles.content}>
                <Text style={styles.title}>Quickstock</Text>
                <Text style={styles.subtitle}>BEM-VINDO AO QUICKSTOCK</Text>
                <Text style={styles.description}>Gerenciamento inteligente</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    content:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    title:
    {
        fontSize: 40,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 10
    },

    subtitle:
    {
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 1
    },

    description:
    {
        fontSize: 14,
        color: '#FFF',
        marginBottom: 40
    },

    footer:
    {
        width: '100%',
        paddingBottom: 40
    },
});