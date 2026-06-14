import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SPACING } from '../../theme/theme';
import { BackButton } from '../BackButton';
import { useAppGoBack } from '../../hooks/useAppGoBack';
import { useHeaderTopPadding } from '../../utils/safeArea';

interface WelcomeHeaderProps {
    hideReturnButton?: boolean;
}

export function WelcomeBackButton() {
    const goBack = useAppGoBack('Welcome');
    const topPadding = useHeaderTopPadding(SPACING.xs);

    return (
        <View style={[styles.topBackWrap, { paddingTop: topPadding }]}>
            <BackButton onPress={goBack} style={styles.backButtonCorner} />
        </View>
    );
}

export function WelcomeHeader({ hideReturnButton = false }: WelcomeHeaderProps) {
    const goBack = useAppGoBack('Welcome');
    const topPadding = useHeaderTopPadding(SPACING.xs);

    return (
        <View style={styles.container}>
            {!hideReturnButton ? (
                <View style={[styles.backRow, { paddingTop: topPadding }]}>
                    <BackButton onPress={goBack} style={styles.backButtonCorner} />
                </View>
            ) : null}

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
    topBackWrap: {
        alignSelf: 'flex-start',
        marginLeft: -16,
        paddingBottom: SPACING.sm,
    },
    backRow: {
        alignSelf: 'flex-start',
        marginLeft: -16,
        marginBottom: SPACING.sm,
    },
    backButtonCorner: {
        marginLeft: 0,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 8,
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
