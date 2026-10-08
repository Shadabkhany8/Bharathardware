import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { Text } from './ui/AppText';
import { router } from 'expo-router';
import { Order, OrderStatus } from '@/types/order.types';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { StatusBadge } from './StatusBadge';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from './ui/Icon';
import { isIndoreAddress } from '@/utils/delivery';


interface AdminOrderCardProps {
  order: Order;
  onMarkDelivered: (order: Order) => Promise<void>;
  onStatusChange?: (order: Order, newStatus: OrderStatus) => Promise<void>;
  onDeleteOrder?: (order: Order) => Promise<void>;
}

const ALL_STATUSES: { status: OrderStatus; label: string; icon: string; color: string }[] = [
  { status: 'PENDING', label: 'Pending Placed', icon: 'clock', color: '#D97706' },
  { status: 'CONFIRMED', label: 'Order Confirmed', icon: 'check-circle', color: '#0284C7' },
  { status: 'PROCESSING', label: 'Packing & Preparing', icon: 'package', color: '#7C3AED' },
  { status: 'DISPATCHED', label: 'Dispatched in Transit', icon: 'truck', color: '#EA580C' },
  { status: 'DELIVERED', label: 'Delivered & Handed Over', icon: 'check', color: '#059669' },
  { status: 'CANCELLED', label: 'Cancelled', icon: 'close', color: '#DC2626' },
];

export const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  order,
  onMarkDelivered,
  onStatusChange,
  onDeleteOrder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handlePromptDelete = () => {
    Alert.alert(
      'Delete Wholesale Order',
      `Are you sure you want to permanently delete order #${order.orderNumber} for ${order.customerName || order.businessName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Order',
          style: 'destructive',
          onPress: async () => {
            if (onDeleteOrder) {
              setUpdating(true);
              try {
                await onDeleteOrder(order);
              } finally {
                setUpdating(false);
              }
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    if (order.customerPhone) {
      Linking.openURL(`tel:${order.customerPhone}`);
    }
  };

  const handleDeliver = async () => {
    setUpdating(true);
    try {
      await onMarkDelivered(order);
    } finally {
      setUpdating(false);
    }
  };

  const handleSelectStatus = async (status: OrderStatus) => {
    setModalVisible(false);
    if (status === order.orderStatus) return;
    if (onStatusChange) {
      setUpdating(true);
      try {
        await onStatusChange(order, status);
      } finally {
        setUpdating(false);
      }
    }
  };

  const isDelivered = order.orderStatus === 'DELIVERED';
  const isCancelled = order.orderStatus === 'CANCELLED';

  return (
    <View style={styles.card}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.orderIdentCol}>
          <Text style={styles.orderNumber} numberOfLines={1} ellipsizeMode="tail">
            {order.orderNumber}
          </Text>
          <View style={styles.dateRow}>
            <Icon name="clock" size={12} color="#64748B" />
            <Text style={styles.dateText} numberOfLines={1} ellipsizeMode="tail">
              {formatDateTime(order.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.headerRightRow}>
          <StatusBadge status={order.orderStatus} size="medium" />
          {onDeleteOrder && (
            <TouchableOpacity
              onPress={handlePromptDelete}
              disabled={updating}
              activeOpacity={0.75}
              style={styles.cardDeleteBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="trash" size={15} color="#DC2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Customer Wholesale Information Box */}
      <View style={styles.customerBox}>
        <View style={styles.customerInfoCol}>
          <View style={styles.businessRow}>
            <Icon name="building" size={15} color={Colors.light.primary} />
            <Text style={styles.businessName} numberOfLines={2} ellipsizeMode="tail">
              {order.businessName || 'Wholesale Client'}
            </Text>
          </View>
          <Text style={styles.customerName} numberOfLines={1} ellipsizeMode="tail">
            Attn: <Text style={styles.customerNameBold}>{order.customerName}</Text>
          </Text>
        </View>

        {order.customerPhone ? (
          <TouchableOpacity
            onPress={handleCall}
            activeOpacity={0.75}
            style={styles.callBtn}>
            <Icon name="phone" size={13} color="#059669" />
            <Text style={styles.callBtnText}>Call Dealer</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Delivery Address & Zone Preview */}
      <View style={styles.addressRow}>
        <Icon name="map-pin" size={14} color="#64748B" />
        <Text style={styles.addressText} numberOfLines={2} ellipsizeMode="tail">
          {order.deliveryAddress}
        </Text>
      </View>
      <View style={styles.adminZoneRow}>
        <View
          style={[
            styles.adminZoneBadge,
            isIndoreAddress(order.deliveryAddress)
              ? styles.adminZoneLocal
              : styles.adminZoneOutside,
          ]}>
          <Icon
            name={isIndoreAddress(order.deliveryAddress) ? 'map-pin' : 'truck'}
            size={11}
            color={isIndoreAddress(order.deliveryAddress) ? '#059669' : '#D97706'}
          />
          <Text
            style={[
              styles.adminZoneText,
              isIndoreAddress(order.deliveryAddress)
                ? styles.adminZoneTextLocal
                : styles.adminZoneTextOutside,
            ]}>
            {isIndoreAddress(order.deliveryAddress)
              ? 'Indore Local Dispatch'
              : 'Outside Indore (+₹250 Surcharge)'}
          </Text>
        </View>
      </View>


      {/* Items Breakdown */}
      {order.items && order.items.length > 0 && (
        <View style={styles.itemsPreview}>
          <Text style={styles.itemsPreviewHeading} numberOfLines={1}>
            Ordered Hardware ({order.items.length} {order.items.length === 1 ? 'item' : 'items'} •{' '}
            {order.totalQuantity} units):
          </Text>
          {order.items.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.itemLine}>
              <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
                • {item.productName}
              </Text>
              <Text style={styles.itemMeta} numberOfLines={1}>
                {item.quantity} × {formatCurrency(item.unitPrice)}
              </Text>
            </View>
          ))}
          {order.items.length > 3 && (
            <Text style={styles.moreItemsText} numberOfLines={1}>
              + {order.items.length - 3} more product line items
            </Text>
          )}
        </View>
      )}

      {/* Financial Settlement & Total */}
      <View style={styles.financesRow}>
        <View style={styles.paymentCol}>
          <Text style={styles.financeLabel} numberOfLines={1}>Offline Settlement</Text>
          <View style={styles.paymentMethodPill}>
            <Icon
              name={order.paymentMethod === 'CASH' ? 'cash' : 'qr-code'}
              size={13}
              color="#334155"
            />
            <Text style={styles.paymentMethodText} numberOfLines={1}>{order.paymentMethod}</Text>
            <Text
              numberOfLines={1}
              style={[
                styles.paymentStatusText,
                order.paymentStatus === 'PAID'
                  ? styles.paymentPaid
                  : styles.paymentPending,
              ]}>
              ({order.paymentStatus})
            </Text>
          </View>
        </View>

        <View style={styles.amountCol}>
          <Text style={styles.financeLabel} numberOfLines={1}>Authoritative Total</Text>
          <Text style={styles.amountValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Action Controls */}
      <View style={styles.actionsContainer}>
        {!isDelivered && !isCancelled ? (
          <View style={styles.activeActionsRow}>
            {/* Direct Mark Delivered Action */}
            <TouchableOpacity
              onPress={handleDeliver}
              disabled={updating}
              activeOpacity={0.85}
              style={[styles.deliverBtn, updating && styles.btnDisabled]}>
              {updating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="check-circle" size={16} color="#FFFFFF" />
                  <Text style={styles.deliverBtnText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>Mark Delivered</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Change Status Action */}
            {onStatusChange && (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                disabled={updating}
                activeOpacity={0.8}
                style={styles.changeStatusBtn}>
                <Icon name="truck" size={14} color="#0F172A" />
                <Text style={styles.changeStatusBtnText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>Change Status</Text>
                <Icon name="chevron-down" size={13} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        ) : isDelivered ? (
          <View style={styles.deliveredRibbonRow}>
            <View style={styles.deliveredRibbon}>
              <Icon name="check-circle" size={16} color="#059669" />
              <Text style={styles.deliveredRibbonText} numberOfLines={1} ellipsizeMode="tail">
                Delivered & Settlement Confirmed
              </Text>
            </View>
            {onStatusChange && (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.changeStatusSmallBtn}>
                <Text style={styles.changeStatusSmallText}>Change Status</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.cancelledRibbonRow}>
            <View style={styles.cancelledRibbon}>
              <Icon name="alert-circle" size={15} color="#DC2626" />
              <Text style={styles.cancelledRibbonText} numberOfLines={1}>Order Cancelled</Text>
            </View>
            {onStatusChange && (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.changeStatusSmallBtn}>
                <Text style={styles.changeStatusSmallText}>Change Status</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* View Details Link */}
        <TouchableOpacity
          onPress={() => router.push(`/order/${order.id}` as any)}
          activeOpacity={0.7}
          style={styles.detailsRowBtn}>
          <Text style={styles.detailsBtnText} numberOfLines={1}>View Full Invoice & Tracking</Text>
          <Icon name="arrow-right" size={14} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      {/* Change Status Modal */}
      {onStatusChange && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Change Order Status</Text>
                  <Text style={styles.modalSubtitle}>{order.orderNumber} • {order.customerName}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalOptionsList}>
                {ALL_STATUSES.map((item) => {
                  const isCurrent = item.status === order.orderStatus;
                  return (
                    <TouchableOpacity
                      key={item.status}
                      onPress={() => handleSelectStatus(item.status)}
                      activeOpacity={0.7}
                      style={[
                        styles.statusSelectRow,
                        isCurrent && styles.statusSelectRowActive,
                      ]}>
                      <View style={styles.statusSelectLeft}>
                        <View
                          style={[
                            styles.statusSelectDot,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusSelectText,
                            isCurrent && styles.statusSelectTextActive,
                          ]}>
                          {item.label}
                        </Text>
                      </View>
                      {isCurrent ? (
                        <Icon name="check" size={18} color="#059669" />
                      ) : (
                        <Icon name="chevron-right" size={16} color="#CBD5E1" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    ...Shadows.card,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderIdentCol: {
    flex: 1,
    paddingRight: 8,
    gap: 3,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  customerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  customerInfoCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  businessName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  customerName: {
    fontSize: 12,
    color: '#475569',
  },
  customerNameBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexShrink: 0,
  },
  callBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#047857',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  addressText: {
    flex: 1,
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    fontWeight: '500',
  },
  adminZoneRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  adminZoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
  },
  adminZoneLocal: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  adminZoneOutside: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  adminZoneText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  adminZoneTextLocal: {
    color: '#065F46',
  },
  adminZoneTextOutside: {
    color: '#92400E',
  },
  itemsPreview: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: BorderRadius.sm,
    marginBottom: 12,
    gap: 4,
  },
  itemsPreviewHeading: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 2,
  },
  itemLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  itemName: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    flex: 1,
    minWidth: 0,
  },
  itemMeta: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '700',
    flexShrink: 0,
  },
  moreItemsText: {
    fontSize: 11,
    color: Colors.light.primaryDark,
    fontWeight: '700',
    marginTop: 2,
  },
  financesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
    gap: 8,
  },
  paymentCol: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  financeLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paymentMethodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
  paymentMethodText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  paymentStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  paymentPaid: {
    color: '#059669',
  },
  paymentPending: {
    color: '#D97706',
  },
  amountCol: {
    alignItems: 'flex-end',
    gap: 2,
    flexShrink: 0,
    maxWidth: '45%',
  },
  amountValue: {
    fontSize: 19,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  actionsContainer: {
    gap: 10,
  },
  activeActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliverBtn: {
    flex: 1.15,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  deliverBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  changeStatusBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  changeStatusBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },
  deliveredRibbonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deliveredRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
    paddingRight: 6,
  },
  deliveredRibbonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
    flex: 1,
  },
  changeStatusSmallBtn: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flexShrink: 0,
  },
  changeStatusSmallText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  cancelledRibbonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelledRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  cancelledRibbonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  modalOptionsList: {
    gap: 8,
  },
  statusSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusSelectRowActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  statusSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusSelectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusSelectText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  statusSelectTextActive: {
    fontWeight: '900',
    color: '#15803D',
  },
  detailsRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  detailsBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardDeleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
