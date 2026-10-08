import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const { customer } = useAuth();
  const isAdmin = customer?.role === 'ROLE_ADMIN';

  const ICON_SIZE = Platform.OS === 'android' ? 18 : 22;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: '#64748B',
        tabBarAllowFontScaling: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 6,
          marginBottom: Platform.OS === 'android' ? 30 : 0,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === 'android' ? 8.5 : 11,
          fontWeight: '700',
          letterSpacing: 0.1,
          marginTop: 1,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Icon
                name={focused ? 'home' : 'home-outline'}
                size={ICON_SIZE}
                color={focused ? Colors.light.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Icon
                name={focused ? 'products' : 'products-outline'}
                size={ICON_SIZE}
                color={focused ? Colors.light.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: isAdmin ? 'Admin Orders' : 'My Orders',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Icon
                name={focused ? 'orders' : 'orders-outline'}
                size={ICON_SIZE}
                color={focused ? Colors.light.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Icon
                name={focused ? 'profile' : 'profile-outline'}
                size={ICON_SIZE}
                color={focused ? Colors.light.primary : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: Platform.OS === 'android' ? 30 : 36,
    height: Platform.OS === 'android' ? 24 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Platform.OS === 'android' ? 12 : 15,
  },
  iconBoxActive: {
    backgroundColor: '#FFEDD5',
  },
});
