import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from './ui/AppText';
import { router } from 'expo-router';
import { Product } from '@/types/product.types';
import { useCart } from '@/context/CartContext';
import { formatCurrency, resolveImageUrl } from '@/utils/formatters';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { QuantitySelector } from './QuantitySelector';
import { Icon } from './ui/Icon';

interface ProductCardProps {
  product: Product;
  onAddedToCart?: () => void;
  isAdmin?: boolean;
  onEditPress?: (product: Product) => void;
  onDeletePress?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddedToCart,
  isAdmin = false,
  onEditPress,
  onDeletePress,
}) => {
  const { addToCart, getItemQuantity } = useCart();
  const minQty = product.minimumOrderQuantity || 1;
  const inCartQty = getItemQuantity(product.id);
  const [selectedQty, setSelectedQty] = useState<number>(inCartQty > 0 ? inCartQty : minQty);
  const [addedToast, setAddedToast] = useState(false);

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedQty);
    setAddedToast(true);
    if (onAddedToCart) onAddedToCart();
    setTimeout(() => setAddedToast(false), 1600);
  };

  const handleCardPress = () => {
    router.push(`/product/${product.id}` as any);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={handleCardPress}
        activeOpacity={0.88}
        style={styles.imageContainer}>
        <Image
          source={{ uri: resolveImageUrl(product.imageUrl) }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeOverlay}>
          <View style={styles.skuBadge}>
            <Text style={styles.skuBadgeText}>{product.sku}</Text>
          </View>
          {isAdmin && (
            <View style={styles.adminQuickPillsRow}>
              {onDeletePress && (
                <TouchableOpacity
                  onPress={() => onDeletePress(product)}
                  style={styles.adminQuickDeletePill}
                  activeOpacity={0.8}>
                  <Icon name="trash" size={12} color="#EF4444" />
                </TouchableOpacity>
              )}
              {onEditPress && (
                <TouchableOpacity
                  onPress={() => onEditPress(product)}
                  style={styles.adminQuickEditPill}
                  activeOpacity={0.8}>
                  <Icon name="edit" size={12} color="#FFFFFF" />
                  <Text style={styles.adminQuickEditText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {product.categoryName && !isAdmin && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText} numberOfLines={1}>
                {product.categoryName}
              </Text>
            </View>
          )}
        </View>

        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>
        </TouchableOpacity>

        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}

        <View style={styles.pricingRow}>
          <View style={styles.priceCol}>
            <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(product.wholesalePrice)}
            </Text>
            <Text style={styles.unitText} numberOfLines={1}>per {product.unit}</Text>
          </View>

          <View style={styles.stockInfo}>
            <View style={styles.moqBadge}>
              <Icon name="tag" size={11} color="#B45309" />
              <Text style={styles.moqText} numberOfLines={1}>MOQ: {product.minimumOrderQuantity}</Text>
            </View>
            <View style={styles.stockBadge}>
              <View
                style={[
                  styles.stockDot,
                  { backgroundColor: product.stockQuantity < 20 ? '#EF4444' : '#10B981' },
                ]}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.stockText,
                  product.stockQuantity < 20 ? styles.stockLow : styles.stockGood,
                ]}>
                {isOutOfStock ? 'Out of stock' : `${product.stockQuantity} in stock`}
              </Text>
            </View>
          </View>
        </View>

        {isAdmin ? (
          <View style={styles.adminActionRow}>
            <TouchableOpacity
              onPress={() => onEditPress && onEditPress(product)}
              activeOpacity={0.85}
              style={styles.adminEditBtn}>
              <Icon name="edit" size={15} color="#FFFFFF" />
              <Text style={styles.adminEditBtnText} numberOfLines={1}>Edit Stock & MOQ</Text>
            </TouchableOpacity>

            {onDeletePress && (
              <TouchableOpacity
                onPress={() => onDeletePress(product)}
                activeOpacity={0.8}
                style={styles.adminDeleteBtn}>
                <Icon name="trash" size={17} color="#DC2626" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleCardPress}
              activeOpacity={0.8}
              style={styles.adminViewBtn}>
              <Icon name="arrow-right" size={16} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        ) : !isOutOfStock ? (
          <View style={styles.actionRow}>
            <View style={styles.selectorWrapper}>
              <QuantitySelector
                quantity={selectedQty}
                minQuantity={product.minimumOrderQuantity}
                maxQuantity={product.stockQuantity}
                step={1}
                onChange={setSelectedQty}
                compact
              />
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              activeOpacity={0.85}
              style={[styles.addBtn, addedToast && styles.addBtnSuccess]}>
              <Icon
                name={addedToast ? 'check' : inCartQty > 0 ? 'refresh' : 'cart'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.addBtnText} numberOfLines={1} ellipsizeMode="tail">
                {addedToast
                  ? 'Added to Cart'
                  : inCartQty > 0
                  ? `Update (${selectedQty})`
                  : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.outOfStockBanner}>
            <Text style={styles.outOfStockBannerText}>Currently Unavailable for Wholesale</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.card,
  },
  imageContainer: {
    height: 170,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skuBadge: {
    backgroundColor: 'rgba(10, 15, 29, 0.88)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  skuBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    maxWidth: '55%',
  },
  categoryBadgeText: {
    color: '#334155',
    fontSize: 10,
    fontWeight: '800',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 8,
  },
  priceCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.light.primary,
    letterSpacing: -0.3,
  },
  unitText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  stockInfo: {
    alignItems: 'flex-end',
    flexShrink: 0,
    gap: 6,
    maxWidth: '50%',
  },
  moqBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  moqText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stockLow: {
    color: '#EF4444',
  },
  stockGood: {
    color: '#059669',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  selectorWrapper: {
    flexShrink: 0,
  },
  addBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    ...Shadows.primary,
  },
  addBtnSuccess: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  outOfStockBanner: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  outOfStockBannerText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  adminQuickPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminQuickDeletePill: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminQuickEditPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#334155',
  },
  adminQuickEditText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  adminActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  adminEditBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  adminEditBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  adminDeleteBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminViewBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
