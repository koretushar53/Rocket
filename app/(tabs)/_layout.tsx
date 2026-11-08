import { Tabs } from 'expo-router';
import { House, Library, ListMusic, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PlayerFooter from '@/components/PlayerFooter';

type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigateToTab: (routeKey: string) => void;
};

const tabs = [
  { name: 'index', title: 'Home', Icon: House },
  { name: 'library', title: 'Library', Icon: Library },
  { name: 'search', title: 'Search', Icon: Search },
  { name: 'playlists', title: 'Playlists', Icon: ListMusic },
];

function RocketTabBar({ state, navigateToTab }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.bottomDock}>
      <PlayerFooter />
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {tabs.map(({ name, title, Icon }) => {
          const route = state.routes.find((item) => item.name === name);
          const active = state.routes[state.index]?.name === name;
          if (!route) return null;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigateToTab(route.key)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={title}
            >
              <Icon size={20} color={active ? '#C084FC' : '#777281'} strokeWidth={active ? 2.4 : 1.8} />
              <Text style={[styles.label, active && styles.activeLabel]}>{title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <RocketTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#08080D' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="library" options={{ title: 'Library' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="playlists" options={{ title: 'Playlists' }} />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomDock: {
    alignItems: 'center',
    backgroundColor: '#08080D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.055)',
  },
  tabBar: {
    width: '100%',
    maxWidth: 620,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 6,
    backgroundColor: '#08080D',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    color: '#777281',
    fontSize: 10,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#C084FC',
  },
});
