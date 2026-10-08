import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, TextInput } from '@/components/common/Text';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { OrderCard } from '@/components/OrderCard';
import { AdminOrderCard } from '@/components/AdminOrderCard';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { OrderService } from '@/services/order.service';
import { AdminService } from '@/services/admin.service';
import { Order, OrderStatus, AdminStats } from '@/types/order.types';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';
import { Icon } from '@/components/ui/Icon';

const STATUS_FILTERS: { label: string; value: OrderStatus | null }[] = [
  { label: 'All Orders', value: null },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Dispatched', value: 'DISPATCHED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default function OrdersScreen() {
  const { customer, isAuthenticated } = useAuth();
  const isAdmin = customer?.role === 'ROLE_ADMIN';

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (pageToFetch: number, reset = false) => {
    if (reset) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      if (isAdmin) {
        // Fetch all wholesale orders for admin
        const [ordersRes, statsRes] = await Promise.all([
          AdminService.getAllOrders(selectedStatus || undefined, pageToFetch, 25),
          AdminService.getStats(),
        ]);

        if (reset) {
          setOrders(ordersRes.content);
        } else {
          setOrders((prev) => [...prev, ...ordersRes.content]);
        }
        setAdminStats(statsRes);
        setPage(ordersRes.pageNumber);
        setIsLastPage(ordersRes.last);
      } else {
        // Customer personal orders
        const res = await OrderService.getMyOrders(selectedStatus || undefined, pageToFetch, 10);
        if (reset) {
          setOrders(res.content);
        } else {
          setOrders((prev) => [...prev, ...res.content]);
        }
        setPage(res.pageNumber);
        setIsLastPage(res.last);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch order history.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders(0, true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, selectedStatus, isAdmin]);

  const handleEndReached = () => {
    if (!loading && !loadingMore && !isLastPage) {
      fetchOrders(page + 1, false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(0, true);
  };

  // Admin mark delivered action
  const handleAdminMarkDelivered = async (order: Order) => {
    try {
      const updated = await AdminService.updateOrderStatus(order.id, 'DELIVERED', 'PAID');
      // Update locally in orders array
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...updated, orderStatus: 'DELIVERED', paymentStatus: 'PAID' } : o))
      );

      // Refresh admin stats
      AdminService.getStats().then(setAdminStats).catch(() => {});

      Alert.alert(
        'Order Delivered!',
        `Order #${order.orderNumber} for ${order.customerName} has been marked as DELIVERED & PAID.\n\nThis is now updated in real-time on the customer's app as well.`,
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Could not update order status.');
    }
  };

  // Admin change status action
  const handleAdminStatusChange = async (order: Order, newStatus: OrderStatus) => {
    try {
      const paymentStatus = newStatus === 'DELIVERED' ? 'PAID' : order.paymentStatus;
      const updated = await AdminService.updateOrderStatus(order.id, newStatus, paymentStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...updated, orderStatus: newStatus, paymentStatus } : o))
      );

      AdminService.getStats().then(setAdminStats).catch(() => {});

      Alert.alert(
        'Status Updated',
        `Order #${order.orderNumber} status changed to ${newStatus}.`,
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Could not update order status.');
    }
  };

  // Admin delete order action
  const handleAdminDeleteOrder = async (order: Order) => {
    try {
      await AdminService.deleteOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      AdminService.getStats().then(setAdminStats).catch(() => {});
      Alert.alert(
        'Order Deleted',
        `Order #${order.orderNumber} for ${order.customerName || order.businessName} has been permanently deleted.`
      );
    } catch (err: any) {
      Alert.alert('Delete Failed', err?.message || 'Could not delete order.');
    }
  };

  // Filter orders by admin search query (Order #, Customer Name, Business Name, Phone)
  const filteredOrders = useMemo(() => {
    if (!isAdmin || !searchQuery.trim()) {
      return orders;
    }
    const q = searchQuery.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.businessName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q)
    );
  }, [orders, searchQuery, isAdmin]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title="Wholesale Orders" />
        <EmptyState
          iconName="lock"
          title="Sign In Required"
          message="Please sign in to your wholesale account to review and track your bulk orders."
          actionLabel="Go to Login"
          onAction={() => router.push('/(auth)/login' as any)}
        />
      </View>
    );
  }

  // Helper count for status chips in Admin mode
  const getStatusCount = (statusVal: OrderStatus | null): number | null => {
    if (!adminStats) return null;
    if (statusVal === null) return adminStats.totalOrders;
    switch (statusVal) {
      case 'PENDING': return adminStats.pendingOrders;
      case 'CONFIRMED': return adminStats.confirmedOrders;
      case 'PROCESSING': return adminStats.processingOrders;
      case 'DISPATCHED': return adminStats.dispatchedOrders;
      case 'DELIVERED': return adminStats.deliveredOrders;
      case 'CANCELLED': return adminStats.cancelledOrders;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isAdmin ? 'Wholesale Orders Hub' : 'Wholesale Orders'}
        subtitle={
          isAdmin
            ? 'Live Orders, Fulfillment & Delivery Dispatch'
            : 'Track deliveries and view order history'
        }
      />

      {/* Admin Executive Revenue & Orders Overview Card */}
      {isAdmin && adminStats && (
        <View style={styles.adminStatsCard}>
          <View style={styles.statsTopRow}>
            <View style={styles.statMetricMain}>
              <View style={styles.statBadge}>
                <Icon name="trending-up" size={13} color="#FFFFFF" />
                <Text style={styles.statBadgeText} numberOfLines={1}>Wholesale Turnover</Text>
              </View>
              <Text style={styles.statValueLarge} numberOfLines={1} adjustsFontSizeToFit>
                {formatCurrency(adminStats.totalRevenue)}
              </Text>
              <Text style={styles.statSubtext} numberOfLines={2}>
                Total value from {adminStats.totalOrders} bulk wholesale orders
              </Text>
            </View>

            <View style={styles.statSideBox}>
              <View style={styles.statMiniCard}>
                <Text style={styles.statMiniLabel} numberOfLines={1}>Orders</Text>
                <Text style={styles.statMiniValue} numberOfLines={1}>{adminStats.totalOrders}</Text>
              </View>
              <View style={[styles.statMiniCard, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <Text style={[styles.statMiniLabel, { color: '#047857' }]} numberOfLines={1}>Delivered</Text>
                <Text style={[styles.statMiniValue, { color: '#065F46' }]} numberOfLines={1}>
                  {adminStats.deliveredOrders}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.statsSummaryBar}>
            <TouchableOpacity
              onPress={() => setSelectedStatus('PENDING')}
              activeOpacity={0.7}
              style={[
                styles.summaryPill,
                selectedStatus === 'PENDING' && styles.summaryPillActive,
              ]}>
              <View style={[styles.summaryDot, { backgroundColor: '#D97706' }]} />
              <Text style={styles.summaryPillLabel} numberOfLines={1}>Pending</Text>
              <Text style={styles.summaryPillCount} numberOfLines={1}>{adminStats.pendingOrders}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedStatus('DISPATCHED')}
              activeOpacity={0.7}
              style={[
                styles.summaryPill,
                selectedStatus === 'DISPATCHED' && styles.summaryPillActive,
              ]}>
              <View style={[styles.summaryDot, { backgroundColor: '#EA580C' }]} />
              <Text style={styles.summaryPillLabel} numberOfLines={1}>Transit</Text>
              <Text style={styles.summaryPillCount} numberOfLines={1}>{adminStats.dispatchedOrders}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedStatus('DELIVERED')}
              activeOpacity={0.7}
              style={[
                styles.summaryPill,
                selectedStatus === 'DELIVERED' && styles.summaryPillActive,
              ]}>
              <View style={[styles.summaryDot, { backgroundColor: '#059669' }]} />
              <Text style={styles.summaryPillLabel} numberOfLines={1}>Delivered</Text>
              <Text style={styles.summaryPillCount} numberOfLines={1}>{adminStats.deliveredOrders}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Admin Real-time Search Box */}
      {isAdmin && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={16} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Order #, Customer, Shop, or Phone..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Status Filter Tabs */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {STATUS_FILTERS.map((f) => {
            const isActive = selectedStatus === f.value;
            const count = isAdmin ? getStatusCount(f.value) : null;
            return (
              <TouchableOpacity
                key={f.label}
                onPress={() => setSelectedStatus(f.value)}
                activeOpacity={0.75}
                style={[styles.filterChip, isActive && styles.filterChipActive]}>
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {f.label}
                  {count !== null ? ` (${count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {error && <ErrorBanner message={error} onRetry={() => fetchOrders(0, true)} />}

      {loading ? (
        <LoadingSkeleton message={isAdmin ? 'Loading all incoming orders...' : 'Loading order history...'} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          iconName="orders"
          title={
            searchQuery
              ? 'No Matching Orders'
              : selectedStatus
              ? `No ${selectedStatus} Orders`
              : isAdmin
              ? 'No Wholesale Orders Placed Yet'
              : 'No Orders Placed Yet'
          }
          message={
            searchQuery
              ? `No wholesale orders found matching "${searchQuery}". Try a different keyword.`
              : selectedStatus
              ? `There are currently no orders in ${selectedStatus} status.`
              : isAdmin
              ? 'Incoming orders from wholesale dealers will automatically appear here.'
              : 'Browse our wholesale hardware catalog and place your first bulk order.'
          }
          actionLabel={
            searchQuery
              ? 'Clear Search'
              : selectedStatus
              ? 'Show All Orders'
              : 'Refresh Orders'
          }
          onAction={
            searchQuery
              ? () => setSearchQuery('')
              : selectedStatus
              ? () => setSelectedStatus(null)
              : () => fetchOrders(0, true)
          }
        />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            isAdmin ? (
              <AdminOrderCard
                order={item}
                onMarkDelivered={handleAdminMarkDelivered}
                onStatusChange={handleAdminStatusChange}
                onDeleteOrder={handleAdminDeleteOrder}
              />
            ) : (
              <OrderCard order={item} />
            )
          }
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.light.primary]}
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={Colors.light.primary} />
                <Text style={styles.footerText}>Loading more orders...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  adminStatsCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.xl,
    padding: 16,
    ...Shadows.card,
  },
  statsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  statMetricMain: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
  statBadgeText: {
    color: '#FED7AA',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  statValueLarge: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  statSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statSideBox: {
    flexShrink: 0,
    gap: 8,
  },
  statMiniCard: {
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  statMiniLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  statMiniValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statsSummaryBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  summaryPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  summaryPillActive: {
    borderColor: '#FED7AA',
    backgroundColor: '#334155',
  },
  summaryDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  summaryPillLabel: {
    fontSize: 10.5,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  summaryPillCount: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginTop: 6,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingBottom: 48,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
});
