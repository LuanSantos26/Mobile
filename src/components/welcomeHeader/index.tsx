import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING } from '../../theme/theme';

interface WelcomeHeaderProps {
    hideReturnButton?: boolean;
}

export function WelcomeBackButton() {
    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    return (
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
                styles.topBackButton,
                { paddingTop: insets.top + SPACING.sm },
            ]}
            activeOpacity={0.7}
        >
            <AntDesign name="arrow-left" size={22} color="white" />
        </TouchableOpacity>
    );
}

export function WelcomeHeader({ hideReturnButton = false }: WelcomeHeaderProps) {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            {!hideReturnButton &&
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <AntDesign name="arrow-left" size={22} color="white" />
                </TouchableOpacity>
            }

            <View style={[styles.content, hideReturnButton && styles.contentWithoutBack]}>
                <Text style={styles.title}>Quickstock</Text>
                <Text style={styles.subtitle}>BEM-VINDO AO QUICKSTOCK</Text>
                <Text style={styles.description}>Gerenciamento inteligente</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 10,
        padding: 8,
        zIndex: 10,
    },
    topBackButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingBottom: SPACING.sm,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    contentWithoutBack: {
        paddingTop: 0,
    },
    title: {
        fontSize: 40,
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#FFF',
        letterSpacing: 1
    },
    description: {
        fontSize: 14,
        color: '#FFF',
        marginBottom: 40
    }
});