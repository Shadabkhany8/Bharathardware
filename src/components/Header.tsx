import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { Icon } from './ui/Icon';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  subtitle?: string;
  onSearchPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showCart = true,
  subtitle,
}) => {
  const { customer, isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftRow}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Icon name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {title ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.brandContainer}>
              <View style={styles.brandRow}>
                <View style={styles.brandLogoBox}>
                  <Text style={styles.brandLogoText}>BS</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.brandTitle} numberOfLines={1}>Bharat Sponge</Text>
                    <View style={styles.b2bTag}>
                      <Text style={styles.b2bTagText}>B2B</Text>
                    </View>
                    <View style={styles.locationTag}>
                      <Icon name="map-pin" size={10} color="#F97316" />
                      <Text style={styles.locationTagText}>Indore, MP</Text>
                    </View>
                  </View>
                  <View style={styles.verifiedRow}>
                    <Icon name="shield-check" size={13} color={Colors.light.success} />
                    <Text style={styles.dealerText} numberOfLines={1} ellipsizeMode="tail">
                      {isAuthenticated && (customer?.businessName || customer?.name)
                        ? `${customer.businessName || customer.name}`
                        : 'Indore Wholesale Hardware Mart'}
                    </Text>
                  </View>

                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.rightRow}>
          {showCart && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push('/cart' as any)}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="cart" size={20} color="#FFFFFF" />
              {itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0A0F1D',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0A0F1D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  brandContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogoBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    ...Shadows.primary,
  },
  brandLogoText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    flexShrink: 1,
  },
  b2bTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    flexShrink: 0,
  },
  b2bTagText: {
    color: Colors.light.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#F97316',
    flexShrink: 0,
  },
  locationTagText: {
    color: '#FB923C',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    flex: 1,
  },
  dealerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    flex: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.md,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#0A0F1D',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
