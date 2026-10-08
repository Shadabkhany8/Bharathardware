import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '@/components/Header';
import { QuantitySelector } from '@/components/QuantitySelector';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ProductService } from '@/services/product.service';
import { AdminService } from '@/services/admin.service';
import { CategoryService } from '@/services/category.service';
import { Product, Category } from '@/types/product.types';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { formatCurrency, resolveImageUrl } from '@/utils/formatters';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';
import { ProductFormModal } from '@/components/ProductFormModal';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { customer } = useAuth();
  const isAdmin = customer?.role === 'ROLE_ADMIN';
  const { addToCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inCartQty = product ? getItemQuantity(product.id) : 0;
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  const loadProduct = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProductService.getProductById(productId);
      setProduct(data);
      const currentInCart = getItemQuantity(data.id);
      setQuantity(currentInCart > 0 ? currentInCart : data.minimumOrderQuantity || 1);
    } catch (err: any) {
      setError(err?.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CategoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleAdminDelete = () => {
    if (!product) return;
    Alert.alert(
      'Delete Product',
      `Are you sure you want to permanently delete "${product.name}" (SKU: ${product.sku}) from the catalog? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Product',
          style: 'destructive',
          onPress: async () => {
            try {
              await AdminService.deleteProduct(product.id);
              Alert.alert('Product Deleted', `"${product.name}" has been removed from catalog.`, [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert('Delete Failed', err?.message || 'Could not delete product.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Product Specifications" showBack />
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loaderText}>Loading wholesale specifications...</Text>
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <Header title="Product Details" showBack />
        <ErrorBanner
          message={error || 'Product not found'}
          onRetry={() => id && loadProduct(parseInt(id, 10))}
        />
      </View>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const subtotal = product.wholesalePrice * quantity;

  return (
    <View style={styles.container}>
      <Header title={product.name} subtitle={`SKU: ${product.sku}`} showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image Stage */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: resolveImageUrl(product.imageUrl) }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.skuBadge}>
            <Text style={styles.skuBadgeText}>SKU: {product.sku}</Text>
          </View>
          {product.categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{product.categoryName}</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsCard}>
          {/* Admin Inventory Controls Box */}
          {isAdmin && (
            <View style={styles.adminControlBox}>
              <View style={styles.adminControlBoxHeader}>
                <View style={styles.adminBadgeRow}>
                  <Icon name="shield-check" size={13} color="#D97706" />
                  <Text style={styles.adminBadgeText}>ADMIN INVENTORY CONTROLS</Text>
                </View>
                <View style={styles.adminControlBtnGroup}>
                  <TouchableOpacity
                    onPress={handleAdminDelete}
                    activeOpacity={0.8}
                    style={styles.adminDeleteItemBtn}>
                    <Icon name="trash" size={13} color="#DC2626" />
                    <Text style={styles.adminDeleteItemBtnText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormModalVisible(true)}
                    activeOpacity={0.85}
                    style={styles.adminEditItemBtn}>
                    <Icon name="edit" size={13} color="#FFFFFF" />
                    <Text style={styles.adminEditItemBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.adminInventoryGrid}>
                <View style={styles.adminInventoryMetric}>
                  <Text style={styles.adminMetricLabel}>Warehouse Stock</Text>
                  <Text style={styles.adminMetricVal}>{product.stockQuantity} units</Text>
                  <Text style={styles.adminMetricDesc}>Total units in inventory</Text>
                </View>

                <View
                  style={[
                    styles.adminInventoryMetric,
                    { borderColor: '#FED7AA', backgroundColor: '#FFFBEB' },
                  ]}>
                  <Text style={[styles.adminMetricLabel, { color: '#C2410C' }]}>
                    Dealer MOQ Limit
                  </Text>
                  <Text style={[styles.adminMetricVal, { color: Colors.light.primary }]}>
                    Min {product.minimumOrderQuantity} {product.unit}
                  </Text>
                  <Text style={styles.adminMetricDesc}>Minimum purchase order</Text>
                </View>
              </View>
            </View>
          )}

          <Text style={styles.title}>{product.name}</Text>

          {/* Wholesale Pricing Header */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Wholesale Batch Price</Text>
              <Text style={styles.price}>{formatCurrency(product.wholesalePrice)}</Text>
              <Text style={styles.unitText}>per {product.unit}</Text>
            </View>

            <View style={styles.stockBox}>
              <View style={styles.moqChip}>
                <Icon name="tag" size={13} color="#92400E" />
                <Text style={styles.moqChipText}>MOQ: {product.minimumOrderQuantity} {product.unit}</Text>
              </View>
              <View style={styles.stockStatusRow}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOutOfStock ? '#EF4444' : '#10B981' },
                  ]}
                />
                <Text
                  style={[
                    styles.stockStatusText,
                    isOutOfStock ? styles.outOfStock : styles.inStock,
                  ]}>
                  {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} Units In Stock`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Wholesale Guarantee Pillars */}
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitItem}>
              <Icon name="shield-check" size={18} color="#10B981" />
              <Text style={styles.benefitTitle}>Direct Factory Quality</Text>
              <Text style={styles.benefitDesc}>Rigorous abrasive tolerance</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="truck" size={18} color="#0284C7" />
              <Text style={styles.benefitTitle}>Ready Dispatch</Text>
              <Text style={styles.benefitDesc}>Ex-warehouse stock</Text>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="layers" size={18} color={Colors.light.primary} />
              <Text style={styles.benefitTitle}>Contractor Grade</Text>
              <Text style={styles.benefitDesc}>Reusable foam core</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description & Technical Specs */}
          <Text style={styles.sectionHeading}>Hardware Specifications</Text>
          <Text style={styles.description}>
            {product.description ||
              'Industrial grade wholesale hardware specification. Designed for high volume contractors, workshops, and fabrication lines.'}
          </Text>

          <View style={styles.specTable}>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Catalog SKU</Text>
              <Text style={styles.specVal}>{product.sku}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Packaging Unit</Text>
              <Text style={styles.specVal}>{product.unit}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Minimum Wholesale Order</Text>
              <Text style={styles.specVal}>{product.minimumOrderQuantity} {product.unit}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Current Warehouse Stock</Text>
              <Text style={styles.specVal}>{product.stockQuantity} available</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>Settlement Options</Text>
              <Text style={styles.specVal}>Cash, Dynamic QR, Barcode</Text>
            </View>
          </View>

          {/* Wholesale Quantity Picker (Customers only) */}
          {!isAdmin && !isOutOfStock && (
            <View style={styles.quantitySection}>
              <View style={styles.quantityHeaderRow}>
                <Text style={styles.quantityHeaderTitle}>Select Order Quantity:</Text>
                <Text style={styles.subtotalCalc}>
                  Subtotal: <Text style={styles.subtotalAmount}>{formatCurrency(subtotal)}</Text>
                </Text>
              </View>

              <QuantitySelector
                quantity={quantity}
                minQuantity={product.minimumOrderQuantity}
                maxQuantity={product.stockQuantity}
                step={1}
                onChange={setQuantity}
                showQuickPills={true}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      {isAdmin ? (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={handleAdminDelete}
            activeOpacity={0.85}
            style={styles.adminBottomDeleteBtn}>
            <Icon name="trash" size={17} color="#DC2626" />
            <Text style={styles.adminBottomDeleteBtnText}>Delete Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFormModalVisible(true)}
            activeOpacity={0.88}
            style={styles.adminBottomEditBtn}>
            <Icon name="edit" size={18} color="#FFFFFF" />
            <Text style={styles.adminBottomEditBtnText}>
              Edit Stock & MOQ
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarInfo}>
            <Text style={styles.bottomBarSubtotalLabel}>
              {quantity} {product.unit} selected
            </Text>
            <Text style={styles.bottomBarAmount}>{formatCurrency(subtotal)}</Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={isOutOfStock}
            activeOpacity={0.85}
            style={[
              styles.addCartBtn,
              isOutOfStock && styles.btnDisabled,
              addedToast && styles.btnSuccess,
            ]}>
            <Icon
              name={addedToast ? 'check' : inCartQty > 0 ? 'refresh' : 'cart'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.addCartBtnText}>
              {addedToast
                ? 'Added to Cart'
                : inCartQty > 0
                ? `Update (${quantity})`
                : 'Add to Wholesale Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Admin Edit Product Modal */}
      <ProductFormModal
        visible={formModalVisible}
        product={product}
        categories={categories}
        onClose={() => setFormModalVisible(false)}
        onSuccess={(updated) => {
          setProduct(updated);
        }}
        onDelete={() => {
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#0A0F1D',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skuBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(10, 15, 29, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skuBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  categoryBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryBadgeText: {
    color: '#334155',
    fontWeight: '800',
    fontSize: 11,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.light.primary,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  stockBox: {
    alignItems: 'flex-end',
    gap: 6,
  },
  moqChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  moqChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  stockStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inStock: {
    color: '#059669',
  },
  outOfStock: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
  benefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  benefitItem: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    gap: 4,
  },
  benefitTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 4,
  },
  benefitDesc: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  specTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specKey: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  specVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  quantitySection: {
    marginTop: 20,
    backgroundColor: '#FFF7ED',
    borderRadius: BorderRadius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
    gap: 12,
  },
  quantityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9A3412',
  },
  subtotalCalc: {
    fontSize: 12,
    color: '#9A3412',
    fontWeight: '600',
  },
  subtotalAmount: {
    fontWeight: '900',
    color: Colors.light.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  bottomBarInfo: {
    flex: 1,
    marginRight: 14,
  },
  bottomBarSubtotalLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  bottomBarAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.md,
    ...Shadows.primary,
  },
  btnSuccess: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
  },
  btnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  addCartBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  adminControlBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  adminControlBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  adminEditItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  adminEditItemBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  adminInventoryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  adminInventoryMetric: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
  },
  adminMetricLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  adminMetricVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  adminMetricDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  adminBottomEditBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    ...Shadows.primary,
  },
  adminBottomEditBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  adminControlBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminDeleteItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  adminDeleteItemBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '800',
  },
  adminBottomDeleteBtn: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    marginRight: 10,
  },
  adminBottomDeleteBtnText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 14,
  },
});
