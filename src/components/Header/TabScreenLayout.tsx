import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenTopGradient } from './ScreenTopGradient';
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
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <ScreenTopGradient />

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
      </SafeAreaView>

      {tabBar}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
});
