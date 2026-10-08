import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '@/components/Header';
import { StatusBadge } from '@/components/StatusBadge';
import { ErrorBanner } from '@/components/ErrorBanner';
import { OrderService } from '@/services/order.service';
import { AdminService } from '@/services/admin.service';
import { useAuth } from '@/context/AuthContext';
import { Order, OrderStatus } from '@/types/order.types';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';
import { Config } from '@/constants/config';
import { isIndoreAddress } from '@/utils/delivery';


const STATUS_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'PENDING', label: 'Placed', icon: 'receipt' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: 'check-circle' },
  { status: 'PROCESSING', label: 'Packing', icon: 'package' },
  { status: 'DISPATCHED', label: 'Dispatched', icon: 'truck' },
  { status: 'DELIVERED', label: 'Delivered', icon: 'check' },
];

const ADMIN_STATUS_OPTIONS: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'PENDING', label: 'Pending', color: '#D97706' },
  { status: 'CONFIRMED', label: 'Confirmed', color: '#0284C7' },
  { status: 'PROCESSING', label: 'Processing', color: '#7C3AED' },
  { status: 'DISPATCHED', label: 'Dispatched', color: '#EA580C' },
  { status: 'DELIVERED', label: 'Delivered', color: '#059669' },
  { status: 'CANCELLED', label: 'Cancelled', color: '#DC2626' },
];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { customer } = useAuth();
  const isAdmin = customer?.role === 'ROLE_ADMIN';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (orderId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = isAdmin
        ? await AdminService.getOrderById(orderId)
        : await OrderService.getOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdmin]);

  // Admin mark as delivered
  const handleAdminMarkDelivered = async () => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const updated = await AdminService.updateOrderStatus(order.id, 'DELIVERED', 'PAID');
      setOrder(updated);
      Alert.alert(
        'Delivery Confirmed!',
        `Order #${order.orderNumber} has been updated to DELIVERED & PAID.\n\nThe customer's app now displays the order as Delivered.`,
        [{ text: 'Great' }]
      );
    } catch (err: any) {
      Alert.alert('Update Error', err?.message || 'Could not mark order delivered.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Admin change status
  const handleAdminUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order || order.orderStatus === newStatus) return;
    setUpdatingStatus(true);
    try {
      const paymentStatus = newStatus === 'DELIVERED' ? 'PAID' : order.paymentStatus;
      const updated = await AdminService.updateOrderStatus(order.id, newStatus, paymentStatus);
      setOrder(updated);
      Alert.alert(
        'Status Changed',
        `Order #${order.orderNumber} status changed to ${newStatus}.`,
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      Alert.alert('Update Error', err?.message || 'Could not update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Admin delete order
  const handleAdminDeleteOrder = () => {
    if (!order) return;
    Alert.alert(
      'Delete Wholesale Order',
      `Are you sure you want to permanently delete order #${order.orderNumber} for ${order.customerName || order.businessName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Order',
          style: 'destructive',
          onPress: async () => {
            setUpdatingStatus(true);
            try {
              await AdminService.deleteOrder(order.id);
              Alert.alert('Order Deleted', `Order #${order.orderNumber} has been removed.`, [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (err: any) {
              Alert.alert('Delete Failed', err?.message || 'Could not delete order.');
              setUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const handleCallDealer = () => {
    if (order?.customerPhone) {
      Linking.openURL(`tel:${order.customerPhone}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Order Details" showBack />
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loaderText}>Loading wholesale order data...</Text>
        </View>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.container}>
        <Header title="Order Details" showBack />
        <ErrorBanner
          message={error || 'Order not found'}
          onRetry={() => id && fetchOrder(parseInt(id, 10))}
        />
      </View>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.orderStatus);
  const paymentIcon =
    order.paymentMethod === 'CASH'
      ? 'cash'
      : order.paymentMethod === 'QR'
      ? 'qr-code'
      : 'barcode';

  return (
    <View style={styles.container}>
      <Header
        title={order.orderNumber}
        subtitle={isAdmin ? 'Wholesale Order Management & Fulfillment' : 'Order Details & Tracking'}
        showBack
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Admin Order Control Hub */}
        {isAdmin && (
          <View style={styles.adminControlCard}>
            <View style={styles.adminControlHeader}>
              <View style={styles.adminControlBadge}>
                <Icon name="shield-check" size={13} color="#D97706" />
                <Text style={styles.adminControlBadgeText}>Admin Fulfillment Hub</Text>
              </View>
              <View style={styles.adminControlHeaderRight}>
                {updatingStatus && <ActivityIndicator size="small" color={Colors.light.primary} />}
                <TouchableOpacity
                  onPress={handleAdminDeleteOrder}
                  disabled={updatingStatus}
                  activeOpacity={0.75}
                  style={styles.adminDeleteHeaderBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Icon name="trash" size={13} color="#DC2626" />
                  <Text style={styles.adminDeleteHeaderBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Deliver CTA */}
            {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' ? (
              <TouchableOpacity
                onPress={handleAdminMarkDelivered}
                disabled={updatingStatus}
                activeOpacity={0.88}
                style={[styles.adminDeliverBigBtn, updatingStatus && styles.btnDisabled]}>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.adminDeliverBigBtnText}>Mark Order as Delivered</Text>
              </TouchableOpacity>
            ) : order.orderStatus === 'DELIVERED' ? (
              <View style={styles.adminDeliveredSuccessBox}>
                <Icon name="check-circle" size={18} color="#059669" />
                <Text style={styles.adminDeliveredSuccessText}>
                  Order Delivered & Settlement Completed
                </Text>
              </View>
            ) : (
              <View style={styles.adminCancelledBox}>
                <Icon name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.adminCancelledText}>This Wholesale Order is Cancelled</Text>
              </View>
            )}

            {/* Change Status Option Chips */}
            <Text style={styles.adminStatusGridTitle}>Change Status To:</Text>
            <View style={styles.adminStatusGrid}>
              {ADMIN_STATUS_OPTIONS.map((opt) => {
                const isSelected = order.orderStatus === opt.status;
                return (
                  <TouchableOpacity
                    key={opt.status}
                    onPress={() => handleAdminUpdateStatus(opt.status)}
                    disabled={updatingStatus}
                    activeOpacity={0.75}
                    style={[
                      styles.adminStatusChip,
                      isSelected && {
                        backgroundColor: opt.color,
                        borderColor: opt.color,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.adminStatusChipText,
                        isSelected && { color: '#FFFFFF', fontWeight: '900' },
                      ]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>



            {/* Delete Order Action Button */}
            <TouchableOpacity
              onPress={handleAdminDeleteOrder}
              disabled={updatingStatus}
              activeOpacity={0.8}
              style={[styles.adminDeleteOrderCardBtn, updatingStatus && styles.btnDisabled]}>
              <Icon name="trash" size={15} color="#DC2626" />
              <Text style={styles.adminDeleteOrderCardBtnText}>Delete This Wholesale Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Customer Information Card (Crucial for Admin) */}
        {isAdmin && (
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardSectionTitle}>Dealer Account & Contact</Text>
              {order.customerPhone && (
                <TouchableOpacity
                  onPress={handleCallDealer}
                  activeOpacity={0.75}
                  style={styles.dealerCallBtn}>
                  <Icon name="phone" size={13} color="#059669" />
                  <Text style={styles.dealerCallBtnText}>Call Dealer</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.dealerDetailsGrid}>
              <View style={styles.dealerRow}>
                <Text style={styles.dealerLabel}>Business / Store:</Text>
                <Text style={styles.dealerValueBold} numberOfLines={1} ellipsizeMode="tail">
                  {order.businessName || 'Wholesale Client'}
                </Text>
              </View>
              <View style={styles.dealerRow}>
                <Text style={styles.dealerLabel}>Contact Person:</Text>
                <Text style={styles.dealerValue} numberOfLines={1} ellipsizeMode="tail">
                  {order.customerName}
                </Text>
              </View>
              {order.customerPhone && (
                <View style={styles.dealerRow}>
                  <Text style={styles.dealerLabel}>Phone Number:</Text>
                  <Text style={styles.dealerValue} numberOfLines={1}>
                    {order.customerPhone}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Order Header Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.orderHeaderCol}>
              <Text style={styles.orderNumber} numberOfLines={1} ellipsizeMode="tail">
                {order.orderNumber}
              </Text>
              <Text style={styles.dateText} numberOfLines={1}>
                Placed on {formatDateTime(order.createdAt)}
              </Text>
            </View>
            <StatusBadge status={order.orderStatus} />
          </View>

          {/* Stepped Timeline Status Tracker */}
          {order.orderStatus !== 'CANCELLED' ? (
            <View style={styles.timelineContainer}>
              <View style={styles.timelineLine}>
                <View
                  style={[
                    styles.timelineProgress,
                    {
                      width: `${Math.max(
                        0,
                        (currentStepIndex / (STATUS_STEPS.length - 1)) * 100
                      )}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.timelineSteps}>
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <View key={step.status} style={styles.stepCol}>
                      <View
                        style={[
                          styles.stepDot,
                          isDone && styles.stepDotDone,
                          isCurrent && styles.stepDotCurrent,
                        ]}>
                        <Icon
                          name={isDone ? 'check' : 'clock'}
                          size={11}
                          color={isDone ? '#FFFFFF' : '#94A3B8'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.stepLabel,
                          isDone && styles.stepLabelDone,
                          isCurrent && styles.stepLabelCurrent,
                        ]}>
                        {step.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.cancelledBox}>
              <Icon name="alert-circle" size={16} color="#EF4444" />
              <Text style={styles.cancelledText}>This wholesale order was cancelled.</Text>
            </View>
          )}
        </View>

        {/* Delivery & Settlement Overview Cards */}
        <View style={styles.card}>
          <View style={styles.deliveryHeaderRow}>
            <Text style={styles.cardSectionTitle}>Warehouse Delivery</Text>
            <View
              style={[
                styles.zoneBadge,
                isIndoreAddress(order.deliveryAddress)
                  ? styles.zoneBadgeLocal
                  : styles.zoneBadgeOutside,
              ]}>
              <Icon
                name={isIndoreAddress(order.deliveryAddress) ? 'map-pin' : 'truck'}
                size={11}
                color={isIndoreAddress(order.deliveryAddress) ? '#059669' : '#D97706'}
              />
              <Text
                style={[
                  styles.zoneBadgeText,
                  isIndoreAddress(order.deliveryAddress)
                    ? styles.zoneTextLocal
                    : styles.zoneTextOutside,
                ]}>
                {isIndoreAddress(order.deliveryAddress)
                  ? 'Indore Local Dispatch'
                  : 'Outside Indore (+₹250 Surcharge)'}
              </Text>
            </View>
          </View>
          <View style={styles.destRow}>
            <Icon name="map-pin" size={18} color={Colors.light.primary} />
            <Text style={styles.destAddress}>{order.deliveryAddress}</Text>
          </View>

          {/* Owner & Hub Dispatch Line */}
          <View style={styles.ownerDispatchLine}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerDispatchTitle}>Indore Dispatch Hub • Owner: {Config.ownerName}</Text>
              <Text style={styles.ownerDispatchSub}>Direct Support: +91 {Config.ownerPhone}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${Config.ownerPhone}`)}
              style={styles.ownerQuickCallBtn}
              activeOpacity={0.8}>
              <Icon name="phone" size={12} color="#FFFFFF" />
              <Text style={styles.ownerQuickCallText}>Call Owner</Text>
            </TouchableOpacity>
          </View>

          {order.notes && (
            <View style={styles.notesRow}>
              <Text style={styles.notesLabel}>Dispatch Instructions:</Text>
              <Text style={styles.notesVal}>{order.notes}</Text>
            </View>
          )}


          <View style={styles.divider} />

          <Text style={styles.cardSectionTitle}>Offline Payment Settlement</Text>
          <View style={styles.paymentInfoRow}>
            <View style={styles.paymentLeft}>
              <View style={styles.paymentIconBox}>
                <Icon name={paymentIcon as any} size={18} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.paymentMethodTitle}>Settlement via {order.paymentMethod}</Text>
                <Text style={styles.paymentDesc}>Payment collected upon dispatch / delivery</Text>
              </View>
            </View>
            <View
              style={[
                styles.paymentStatusPill,
                order.paymentStatus === 'PAID' && styles.paymentStatusPillPaid,
              ]}>
              <Text
                style={[
                  styles.paymentStatusText,
                  order.paymentStatus === 'PAID' && styles.paymentStatusTextPaid,
                ]}>
                {order.paymentStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Ordered Hardware Items Snapshot */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>
            Ordered Hardware ({order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} •{' '}
            {order.totalQuantity} units)
          </Text>

          <View style={styles.itemsList}>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Image
                  source={{
                    uri:
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500',
                  }}
                  style={styles.itemThumb}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <Text style={styles.itemMeta} numberOfLines={1}>
                    {item.quantity} units × {formatCurrency(item.unitPrice)}
                  </Text>
                </View>
                <Text style={styles.itemSubtotal} numberOfLines={1}>
                  {formatCurrency(item.subtotal)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Authoritative Total</Text>
            <Text style={styles.totalVal} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>
        </View>

      </ScrollView>
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
    padding: 16,
    paddingBottom: 48,
    gap: 14,
  },
  adminControlCard: {
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.xl,
    padding: 16,
    ...Shadows.card,
    gap: 12,
  },
  adminControlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminControlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  adminControlBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  adminControlHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminDeleteHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  adminDeleteHeaderBtnText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '800',
  },
  adminDeleteOrderCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 11,
    borderRadius: BorderRadius.md,
    marginTop: 4,
  },
  adminDeleteOrderCardBtnText: {
    color: '#F87171',
    fontSize: 12.5,
    fontWeight: '800',
  },
  adminDeliverBigBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  adminDeliverBigBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  adminDeliveredSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#064E3B',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#059669',
  },
  adminDeliveredSuccessText: {
    color: '#A7F3D0',
    fontSize: 13,
    fontWeight: '800',
  },
  adminCancelledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7F1D1D',
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  adminCancelledText: {
    color: '#FECACA',
    fontSize: 13,
    fontWeight: '800',
  },
  adminStatusGridTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  adminStatusChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  adminStatusChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dealerCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  dealerCallBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#047857',
  },
  dealerDetailsGrid: {
    gap: 8,
  },
  dealerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dealerLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    flexShrink: 0,
  },
  dealerValue: {
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  dealerValueBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  orderHeaderCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
    gap: 2,
  },
  orderNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  timelineContainer: {
    paddingTop: 12,
    paddingBottom: 4,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 22,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  timelineProgress: {
    height: 3,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  timelineSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
    gap: 6,
    width: 60,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  stepDotDone: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  stepDotCurrent: {
    borderColor: '#EA580C',
    backgroundColor: '#EA580C',
    transform: [{ scale: 1.15 }],
  },
  stepLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  stepLabelDone: {
    color: '#0F172A',
  },
  stepLabelCurrent: {
    color: Colors.light.primary,
    fontWeight: '900',
  },
  cancelledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: BorderRadius.sm,
  },
  cancelledText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  deliveryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  zoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
  },
  zoneBadgeLocal: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  zoneBadgeOutside: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  zoneBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  zoneTextLocal: {
    color: '#065F46',
  },
  zoneTextOutside: {
    color: '#92400E',
  },
  ownerDispatchLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: BorderRadius.sm,
    padding: 10,
    marginTop: 10,
  },
  ownerDispatchTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#9A3412',
  },
  ownerDispatchSub: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#C2410C',
    marginTop: 1,
  },
  ownerQuickCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ownerQuickCallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  destAddress: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '600',
  },
  notesRow: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.sm,
  },
  notesLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  notesVal: {
    fontSize: 12,
    color: '#0F172A',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  paymentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  paymentIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  paymentDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  paymentStatusPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  paymentStatusPillPaid: {
    backgroundColor: '#DCFCE7',
  },
  paymentStatusText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '800',
  },
  paymentStatusTextPaid: {
    color: '#166534',
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemSku: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  btnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
});
