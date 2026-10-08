import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { QuantitySelector } from '@/components/QuantitySelector';
import { EmptyState } from '@/components/EmptyState';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { CartItem } from '@/types/order.types';
import { Icon } from '@/components/ui/Icon';

const FREE_FREIGHT_THRESHOLD = 10000;

export default function CartScreen() {
  const { items, totalQuantity, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Wholesale Login Required',
        'Please sign in to confirm delivery warehouse details and place your wholesale order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login' as any) },
        ]
      );
      return;
    }
    router.push('/checkout' as any);
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all wholesale items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  const progressPercent = Math.min(100, Math.round((totalAmount / FREE_FREIGHT_THRESHOLD) * 100));
  const remainingForFreight = Math.max(0, FREE_FREIGHT_THRESHOLD - totalAmount);

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemSubtotal = item.wholesalePrice * item.quantity;
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemTopRow}>
          <Image
            source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500' }}
            style={styles.itemImage}
          />
          <View style={styles.itemInfo}>
            <View style={styles.skuRow}>
              <View style={styles.skuBadge}>
                <Text style={styles.skuBadgeText}>{item.sku}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeFromCart(item.productId)}
                style={styles.deleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="trash" size={16} color="#EF4444" />
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.productName}
            </Text>
            <Text style={styles.itemUnitPrice}>
              {formatCurrency(item.wholesalePrice)} / {item.unit}
            </Text>
          </View>
        </View>

        <View style={styles.itemBottomRow}>
          <View style={styles.qtyContainer}>
            <View style={styles.moqBadge}>
              <Icon name="tag" size={11} color="#B45309" />
              <Text style={styles.moqNote} numberOfLines={1}>MOQ: {item.minimumOrderQuantity}</Text>
            </View>
            <QuantitySelector
              quantity={item.quantity}
              minQuantity={item.minimumOrderQuantity}
              maxQuantity={item.stockQuantity}
              step={1}
              onChange={(newQty) => updateQuantity(item.productId, newQty)}
              compact
            />
          </View>

          <View style={styles.itemSubtotalCol}>
            <Text style={styles.subtotalLabel} numberOfLines={1}>Subtotal</Text>
            <Text style={styles.subtotalValue} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(itemSubtotal)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Wholesale Cart" showBack showCart={false} />

      {items.length === 0 ? (
        <EmptyState
          iconName="cart"
          title="Your Wholesale Cart is Empty"
          message="Browse Bharat Sponge abrasive products, sponges, and industrial hardware to start your bulk order."
          actionLabel="Explore Wholesale Catalog"
          onAction={() => router.push('/(tabs)/products' as any)}
        />
      ) : (
        <>
          {/* Freight Incentive Progress Banner */}
          <View style={styles.freightBanner}>
            <View style={styles.freightHeader}>
              <View style={styles.freightTitleRow}>
                <Icon name="truck" size={16} color={Colors.light.primary} />
                <Text style={styles.freightTitle} numberOfLines={1} ellipsizeMode="tail">
                  {remainingForFreight > 0
                    ? `Add ${formatCurrency(remainingForFreight)} for Free Freight`
                    : '🎉 Free Regional Factory Freight Qualified!'}
                </Text>
              </View>
              <Text style={styles.freightPercent} numberOfLines={1}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          {/* Indore Hub Dispatch Notice */}
          <View style={styles.indoreDeliveryNotice}>
            <Icon name="map-pin" size={13} color="#059669" />
            <Text style={styles.indoreDeliveryNoticeText} numberOfLines={2}>
              Orders dispatched from Indore, MP. Local Indore delivery included; outside Indore addresses incur additional transport charge.
            </Text>
          </View>

          <View style={styles.cartHeaderBar}>
            <Text style={styles.cartCountText} numberOfLines={1}>
              {items.length} {items.length === 1 ? 'Product' : 'Products'} ({totalQuantity} total units)
            </Text>
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearAllLink} numberOfLines={1}>Clear Cart</Text>
            </TouchableOpacity>
          </View>


          <FlatList
            data={items}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
          />

          {/* Bottom Checkout Summary */}
          <View style={styles.checkoutFooter}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLeftCol}>
                <Text style={styles.footerQty} numberOfLines={1}>Total: {totalQuantity} units</Text>
                <Text style={styles.footerTotal} numberOfLines={1} adjustsFontSizeToFit>
                  {formatCurrency(totalAmount)}
                </Text>
                <Text style={styles.taxNote} numberOfLines={1}>Ex-Warehouse Wholesale</Text>
              </View>

              <TouchableOpacity
                onPress={handleProceedToCheckout}
                style={styles.checkoutBtn}
                activeOpacity={0.85}>
                <Text style={styles.checkoutBtnText} numberOfLines={1}>Checkout</Text>
                <Icon name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  freightBanner: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
  },
  freightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  freightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  freightTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9A3412',
  },
  freightPercent: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#FED7AA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  indoreDeliveryNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBF7D0',
  },
  indoreDeliveryNoticeText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    lineHeight: 15,
  },
  cartHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cartCountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  clearAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  itemTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.md,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  skuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skuBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  skuBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '700',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  itemUnitPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    gap: 8,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  moqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  moqNote: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  itemSubtotalCol: {
    alignItems: 'flex-end',
    flex: 1,
    minWidth: 0,
    paddingLeft: 6,
  },
  subtotalLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subtotalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Shadows.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  summaryLeftCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  footerQty: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  taxNote: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.md,
    flexShrink: 0,
    ...Shadows.primary,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
