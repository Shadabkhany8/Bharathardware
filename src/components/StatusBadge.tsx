import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './ui/AppText';
import { OrderStatus } from '@/types/order.types';
import { getOrderStatusMeta } from '@/utils/formatters';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const meta = getOrderStatusMeta(status);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: meta.bg },
        size === 'small' && styles.badgeSmall,
      ]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          { color: meta.color },
          size === 'small' && styles.textSmall,
        ]}>
        {meta.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
    flexShrink: 0,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 11,
  },
});
