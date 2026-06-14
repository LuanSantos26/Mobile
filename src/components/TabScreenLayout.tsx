import React from 'react';
import {
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenHeader } from './ScreenHeader';
import { PageHeader } from './PageHeader';
import { PageContent } from './PageContent';
import { useTabBarScrollPadding } from './BottomTabBar';

interface ScreenHeaderConfig {
  name?: string;
  greeting?: string;
  showGreeting?: boolean;
  showCartBadge?: boolean;
  cartItemCount?: number;
  onCartPress?: () => void;
  style?: ViewStyle;
}

interface TabScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  scrollContentStyle?: StyleProp<ViewStyle>;
  screenHeaderProps?: ScreenHeaderConfig;
  wrapContent?: boolean;
  footer?: React.ReactNode;
  tabBar?: React.ReactNode;
}

export function TabScreenLayout({
  title,
  subtitle,
  children,
  scrollContentStyle,
  screenHeaderProps,
  wrapContent = true,
  footer,
  tabBar,
}: TabScreenLayoutProps) {
  const scrollBottomPadding = useTabBarScrollPadding();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <LinearGradient colors={['#F8B125', '#FAFAFA']} style={styles.topGradient} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: scrollBottomPadding },
          scrollContentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader {...screenHeaderProps} />
        <PageHeader title={title} subtitle={subtitle} />
        {wrapContent ? <PageContent>{children}</PageContent> : children}
      </ScrollView>

      {footer}
      {tabBar}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
});
