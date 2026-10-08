import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { Text, TextInput } from '@/components/common/Text';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { OrderCard } from '@/components/OrderCard';
import { AdminOrderCard } from '@/components/AdminOrderCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { OrderService } from '@/services/order.service';
import { AdminService } from '@/services/admin.service';
import { Category, Product } from '@/types/product.types';
import { Order, OrderStatus } from '@/types/order.types';
import { Colors, Shadows, BorderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';
import { Icon } from '@/components/ui/Icon';
import { Config } from '@/constants/config';


export default function HomeScreen() {
  const { customer, isAuthenticated } = useAuth();
  const { itemCount, totalQuantity, totalAmount } = useCart();
  const isAdmin = customer?.role === 'ROLE_ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadDashboardData = async () => {
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        CategoryService.getCategories(),
        ProductService.getFeaturedProducts(),
      ]);
      setCategories(cats);
      setPopularProducts(prods);

      if (isAuthenticated) {
        try {
          if (customer?.role === 'ROLE_ADMIN') {
            const adminRes = await AdminService.getAllOrders(undefined, 0, 5);
            setRecentOrders(adminRes.content);
          } else {
            const orders = await OrderService.getRecentOrders();
            setRecentOrders(orders);
          }
        } catch {
          // Non-blocking
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to Bharat Sponge backend. Please check server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, customer?.role]);

  const handleAdminMarkDelivered = async (order: Order) => {
    try {
      const updated = await AdminService.updateOrderStatus(order.id, 'DELIVERED', 'PAID');
      setRecentOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, ...updated, orderStatus: 'DELIVERED', paymentStatus: 'PAID' }
            : o
        )
      );
      Alert.alert(
        'Order Delivered!',
        `Order #${order.orderNumber} for ${order.customerName} has been marked as DELIVERED & PAID.`
      );
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Could not update order status.');
    }
  };

  const handleAdminStatusChange = async (order: Order, newStatus: OrderStatus) => {
    try {
      const paymentStatus = newStatus === 'DELIVERED' ? 'PAID' : order.paymentStatus;
      const updated = await AdminService.updateOrderStatus(order.id, newStatus, paymentStatus);
      setRecentOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, ...updated, orderStatus: newStatus, paymentStatus } : o
        )
      );
      Alert.alert('Status Updated', `Order #${order.orderNumber} status changed to ${newStatus}.`);
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Could not update order status.');
    }
  };

  const handleAdminDeleteOrder = async (order: Order) => {
    try {
      await AdminService.deleteOrder(order.id);
      setRecentOrders((prev) => prev.filter((o) => o.id !== order.id));
      Alert.alert(
        'Order Deleted',
        `Order #${order.orderNumber} for ${order.customerName || order.businessName} has been permanently deleted.`
      );
    } catch (err: any) {
      Alert.alert('Delete Failed', err?.message || 'Could not delete order.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(tabs)/products',
        params: { query: searchQuery.trim() },
      } as any);
    } else {
      router.push('/(tabs)/products' as any);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
          />
        }>
        {error && <ErrorBanner message={error} onRetry={loadDashboardData} />}

        {/* Hero Wholesale Command Center Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTopRow}>
            <View style={styles.superBadge}>
              <View style={styles.superBadgeDot} />
              <Text style={styles.superBadgeText}>FACTORY DISPATCH • INDORE</Text>
            </View>
            <View style={isAdmin ? styles.adminTierPill : styles.verifiedTierPill}>
              <Icon name="shield-check" size={13} color={isAdmin ? '#B45309' : '#10B981'} />
              <Text style={isAdmin ? styles.adminTierText : styles.verifiedTierText}>
                {isAdmin ? 'System Admin' : 'Tier 1 Partner'}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>
            {customer?.name
              ? isAdmin
                ? `Administrator: ${customer.name}`
                : `Welcome back, ${customer.name}`
              : 'Wholesale Hardware Mart'}
          </Text>
          <Text style={styles.businessSubtitle}>
            {customer?.businessName || (isAdmin ? 'Bharat Sponge Management' : 'Authorized Industrial Hardware Buyer')} • Code:{' '}
            <Text style={styles.codeHighlight}>
              {(customer?.customerCode || (isAdmin ? 'ADMIN-HQ' : 'GUEST')).replace(/-/g, '\u2011')}
            </Text>
          </Text>

          {/* Admin Quick Action Hub Banner */}
          {isAdmin && (
            <View style={styles.adminQuickHub}>
              <View style={styles.adminQuickHubHeader}>
                <View style={styles.adminHubIconCol}>
                  <View style={styles.adminHubIconBox}>
                    <Icon name="analytics" size={20} color="#D97706" />
                  </View>
                  <View style={{ gap: 2, flex: 1 }}>
                    <Text style={styles.adminHubTitle}>Wholesale Orders & Dispatch Hub</Text>
                    <Text style={styles.adminHubSub}>
                      Mark shipments delivered & monitor turnover
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/orders' as any)}
                  activeOpacity={0.8}
                  style={styles.adminHubBtn}>
                  <Text style={styles.adminHubBtnText}>Manage</Text>
                  <Icon name="arrow-right" size={13} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Indore Hub & Owner Contact Strip */}
          <View style={styles.hubServiceStrip}>
            <View style={styles.hubServiceLeft}>
              <View style={styles.hubServiceIconBox}>
                <Icon name="map-pin" size={14} color="#F97316" />
              </View>
              <View style={styles.hubServiceTextCol}>
                <Text style={styles.hubServiceTitle} numberOfLines={1}>
                  Indore Hub • Owner: {Config.ownerName}
                </Text>
                <Text style={styles.hubServiceSubtitle} numberOfLines={1}>
                  Indore Local Dispatch • Regional Delivery
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${Config.ownerPhone}`)}
              style={styles.quickCallBtn}
              activeOpacity={0.8}>
              <Icon name="phone" size={12} color="#FFFFFF" />
              <Text style={styles.quickCallText}>Call</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Search within Hero */}
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by SKU (e.g. BS-SP-101) or product name..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Popular Tag Chips */}
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Popular:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScroll}>
              {['Sanding Sponge', 'Buffing Pad', 'Rust Stripper', 'Foam Roll', 'Abrasive Disc'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagChip}
                  onPress={() =>
                    router.push({
                      pathname: '/(tabs)/products',
                      params: { query: tag },
                    } as any)
                  }>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Metric Tiles Bar */}
        <View style={styles.metricsContainer}>
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/(tabs)/orders' as any)}
            activeOpacity={0.8}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="orders" size={16} color="#059669" />
            </View>
            <Text style={styles.metricVal} numberOfLines={1} adjustsFontSizeToFit>
              {recentOrders.length > 0 ? `${recentOrders.length} Orders` : '0 Orders'}
            </Text>
            <Text style={styles.metricLabel} numberOfLines={1} adjustsFontSizeToFit>
              Recent Bulk
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/cart' as any)}
            activeOpacity={0.8}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#FFEDD5' }]}>
              <Icon name="cart" size={16} color={Colors.light.primary} />
            </View>
            <Text style={styles.metricVal} numberOfLines={1} adjustsFontSizeToFit>
              {itemCount > 0 ? `${itemCount} Items` : 'Empty'}
            </Text>
            <Text style={styles.metricLabel} numberOfLines={1} adjustsFontSizeToFit>
              Cart Total
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/(tabs)/products' as any)}
            activeOpacity={0.8}>
            <View style={[styles.metricIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Icon name="tag" size={16} color="#0284C7" />
            </View>
            <Text style={styles.metricVal} numberOfLines={1} adjustsFontSizeToFit>
              Wholesale
            </Text>
            <Text style={styles.metricLabel} numberOfLines={1} adjustsFontSizeToFit>
              MOQ Locked
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Cart Floating Strip (if items present) */}
        {itemCount > 0 && (
          <TouchableOpacity
            style={styles.cartBar}
            onPress={() => router.push('/cart' as any)}
            activeOpacity={0.85}>
            <View style={styles.cartBarLeft}>
              <View style={styles.cartBarIconCircle}>
                <Icon name="cart" size={18} color="#FFFFFF" />
              </View>
              <View style={styles.cartBarTextCol}>
                <Text style={styles.cartBarTitle} numberOfLines={1} ellipsizeMode="tail">
                  {itemCount} {itemCount === 1 ? 'Product' : 'Products'} ({totalQuantity} units) in Cart
                </Text>
                <Text style={styles.cartBarAmount} numberOfLines={1}>{formatCurrency(totalAmount)}</Text>
              </View>
            </View>
            <View style={styles.cartBarCtaRow}>
              <Text style={styles.cartBarCta} numberOfLines={1}>Review Order</Text>
              <Icon name="arrow-right" size={15} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Quick Wholesale Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/products' as any)}
            activeOpacity={0.8}>
            <View style={[styles.actionIconBg, { backgroundColor: '#FFEDD5' }]}>
              <Icon name="products" size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.actionTitle} numberOfLines={1}>Products</Text>
            <Text style={styles.actionDesc} numberOfLines={1}>Bulk Catalog</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/cart' as any)}
            activeOpacity={0.8}>
            <View style={[styles.actionIconBg, { backgroundColor: '#E0F2FE' }]}>
              <Icon name="cart" size={20} color="#0284C7" />
            </View>
            <Text style={styles.actionTitle} numberOfLines={1}>Cart</Text>
            <Text style={styles.actionDesc} numberOfLines={1}>
              {itemCount > 0 ? `${itemCount} Items` : '0 Items'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/orders' as any)}
            activeOpacity={0.8}>
            <View style={[styles.actionIconBg, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="orders" size={20} color="#059669" />
            </View>
            <Text style={styles.actionTitle} numberOfLines={1}>Orders</Text>
            <Text style={styles.actionDesc} numberOfLines={1}>Track Status</Text>
          </TouchableOpacity>
        </View>

        {/* Factory Value Propositions Strip */}
        <View style={styles.factoryStrip}>
          <View style={styles.factoryItem}>
            <Icon name="building" size={15} color={Colors.light.primary} />
            <Text style={styles.factoryItemText} numberOfLines={1}>Direct Factory</Text>
          </View>
          <View style={styles.factoryDivider} />
          <View style={styles.factoryItem}>
            <Icon name="shield-check" size={15} color="#10B981" />
            <Text style={styles.factoryItemText} numberOfLines={1}>Guaranteed MOQ</Text>
          </View>
          <View style={styles.factoryDivider} />
          <View style={styles.factoryItem}>
            <Icon name="truck" size={15} color="#0284C7" />
            <Text style={styles.factoryItemText} numberOfLines={1}>Fast Dispatch</Text>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleCol}>
              <Text style={styles.sectionTitle}>Hardware Categories</Text>
              <Text style={styles.sectionSubtitle}>Select category to filter catalog</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/products' as any)}
              style={styles.viewAllBtn}>
              <Text style={styles.sectionLink}>View All</Text>
              <Icon name="chevron-right" size={14} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.catCard}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/products',
                    params: { categoryId: cat.id },
                  } as any)
                }
                activeOpacity={0.85}>
                <Image source={{ uri: cat.imageUrl }} style={styles.catImage} />
                <View style={styles.catOverlay}>
                  <Text style={styles.catName} numberOfLines={2}>
                    {cat.name}
                  </Text>
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>Browse →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular / Frequently Ordered Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleCol}>
              <Text style={styles.sectionTitle}>Popular Wholesale Products</Text>
              <Text style={styles.sectionSubtitle}>Top ordered hardware with immediate dispatch</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/products' as any)}
              style={styles.viewAllBtn}>
              <Text style={styles.sectionLink}>Full Catalog</Text>
              <Icon name="chevron-right" size={14} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <LoadingSkeleton message="Loading popular hardware..." />
          ) : (
            popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </View>

        {/* Recent Orders Section */}
        {isAuthenticated && recentOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleCol}>
                <Text style={styles.sectionTitle}>
                  {isAdmin ? 'Incoming Wholesale Orders' : 'Recent Bulk Orders'}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {isAdmin
                    ? 'Latest wholesale orders placed across dealer accounts'
                    : 'Track deliveries and view order history'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/orders' as any)}
                style={styles.viewAllBtn}>
                <Text style={styles.sectionLink}>{isAdmin ? 'Manage All' : 'Order History'}</Text>
                <Icon name="chevron-right" size={14} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>

            {recentOrders.map((order) =>
              isAdmin ? (
                <AdminOrderCard
                  key={order.id}
                  order={order}
                  onMarkDelivered={handleAdminMarkDelivered}
                  onStatusChange={handleAdminStatusChange}
                  onDeleteOrder={handleAdminDeleteOrder}
                />
              ) : (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              )
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  heroBanner: {
    backgroundColor: '#0A0F1D',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    ...Shadows.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  superBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(234, 88, 12, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.3)',
    flexShrink: 0,
  },
  superBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
  },
  superBadgeText: {
    color: Colors.light.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  verifiedTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#064E3B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    flexShrink: 0,
  },
  verifiedTierText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  businessSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 14,
  },
  codeHighlight: {
    color: '#FDBA74',
    fontWeight: '800',
  },
  hubServiceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hubServiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  hubServiceTextCol: {
    flex: 1,
    minWidth: 0,
  },
  hubServiceIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubServiceTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  hubServiceSubtitle: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 1,
  },
  quickCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexShrink: 0,
  },
  quickCallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },

  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    padding: 0,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  tagsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    flexShrink: 0,
  },
  tagsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 6,
  },
  tagChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#334155',
    flexShrink: 0,
  },
  tagChipText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -16,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.sm,
  },
  metricIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    width: '100%',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
    width: '100%',
  },
  cartBar: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.light.secondary,
    borderRadius: BorderRadius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.light.primary,
    gap: 8,
    ...Shadows.primary,
  },
  cartBarLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 6,
  },
  cartBarIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cartBarTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  cartBarTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  cartBarAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  cartBarCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    flexShrink: 0,
  },
  cartBarCta: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  actionCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.xs,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionDesc: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  factoryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  factoryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  factoryItemText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  factoryDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E2E8F0',
  },
  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionTitleCol: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
    paddingLeft: 6,
    flexShrink: 0,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  categoryScroll: {
    gap: 12,
    paddingRight: 16,
    paddingBottom: 4,
  },
  catCard: {
    width: 150,
    height: 140,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    ...Shadows.sm,
  },
  catImage: {
    width: '100%',
    height: '100%',
    opacity: 0.72,
  },
  catOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(10, 15, 29, 0.75)',
    gap: 4,
  },
  catName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 15,
  },
  catBadge: {
    alignSelf: 'flex-start',
  },
  catBadgeText: {
    color: '#FDBA74',
    fontSize: 10,
    fontWeight: '700',
  },
  adminTierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexShrink: 0,
  },
  adminTierText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '800',
  },
  adminQuickHub: {
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  adminQuickHubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  adminHubIconCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  adminHubIconBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminHubTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  adminHubSub: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 14,
  },
  adminHubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  adminHubBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
