import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './ui/AppText';
import { router } from 'expo-router';
import { Order } from '@/types/order.types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { StatusBadge } from './StatusBadge';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from './ui/Icon';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const handlePress = () => {
    router.push(`/order/${order.id}` as any);
  };

  const productCount = order.items?.length || 0;
  const paymentIcon =
    order.paymentMethod === 'CASH'
      ? 'cash'
      : order.paymentMethod === 'QR'
      ? 'qr-code'
      : 'barcode';

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.88}
      style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.orderMeta}>
          <Text style={styles.orderNumber} numberOfLines={1} ellipsizeMode="tail">
            {order.orderNumber}
          </Text>
          <View style={styles.dateRow}>
            <Icon name="clock" size={12} color="#64748B" />
            <Text style={styles.date} numberOfLines={1}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>
        <StatusBadge status={order.orderStatus} size="small" />
      </View>

      {/* Item Sneak Peek */}
      {order.items && order.items.length > 0 && (
        <View style={styles.itemsPreview}>
          <Text style={styles.itemsPreviewText} numberOfLines={1} ellipsizeMode="tail">
            {order.items.map((i) => `${i.productName} (${i.quantity})`).join(' • ')}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel} numberOfLines={1}>Wholesale Items</Text>
          <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
            {productCount} {productCount === 1 ? 'Product' : 'Products'} ({order.totalQuantity} units)
          </Text>
        </View>

        <View style={[styles.detailItem, styles.detailItemRight]}>
          <Text style={styles.detailLabel} numberOfLines={1}>Order Total</Text>
          <Text style={styles.amountValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.paymentCol}>
          <Icon name={paymentIcon as any} size={14} color="#475569" />
          <Text style={styles.paymentInfo} numberOfLines={1} ellipsizeMode="tail">
            {order.paymentMethod} •{' '}
            <Text
              style={
                order.paymentStatus === 'PAID'
                  ? styles.paymentPaid
                  : styles.paymentPending
              }>
              {order.paymentStatus}
            </Text>
          </Text>
        </View>

        <View style={styles.actionsRight}>
          <View style={styles.viewRow}>
            <Text style={styles.viewLink}>Details</Text>
            <Icon name="chevron-right" size={13} color={Colors.light.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  orderMeta: {
    flex: 1,
    paddingRight: 8,
    gap: 3,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  itemsPreview: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  itemsPreviewText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailItem: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  detailItemRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
    maxWidth: '48%',
  },
  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  amountValue: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    gap: 8,
  },
  paymentCol: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 6,
  },
  paymentInfo: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  paymentPaid: {
    color: '#10B981',
    fontWeight: '800',
  },
  paymentPending: {
    color: '#D97706',
    fontWeight: '800',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewLink: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.primary,
  },
});
