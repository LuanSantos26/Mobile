import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HamburgerButton } from './HamburgerButton';
import { HeaderActions } from './HeaderActions';

interface HeaderGreetingProps {
    name: string;
    greeting?: string;
    showCartBadge?: boolean;
    cartItemCount?: number;
    onCartPress?: () => void;
}

export default function HeaderGreeting({
    name,
    greeting = "Bom dia.",
    showCartBadge,
    cartItemCount,
    onCartPress,
}: HeaderGreetingProps) {
    return (
        <View style={styles.userInfo}>
            <HamburgerButton />
            <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color="#F8B125" />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.greetingText}>{greeting}</Text>
                <Text style={styles.userName}>{name}</Text>
            </View>

            <HeaderActions
                showCartBadge={showCartBadge}
                cartItemCount={cartItemCount}
                onCartPress={onCartPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8b22500',
        flex: 1,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 12,
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    greetingText: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
