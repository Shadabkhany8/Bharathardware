import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './ui/AppText';
import { Colors, BorderRadius } from '@/constants/theme';
import { Icon } from './ui/Icon';

interface QuantitySelectorProps {
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  step?: number;
  onChange: (newQuantity: number) => void;
  showQuickPills?: boolean;
  compact?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  minQuantity = 1,
  maxQuantity = 99999,
  step = 1,
  onChange,
  showQuickPills = false,
  compact = false,
}) => {
  const handleDecrement = () => {
    if (quantity - step >= minQuantity) {
      onChange(quantity - step);
    } else {
      onChange(minQuantity);
    }
  };

  const handleIncrement = () => {
    if (quantity + step <= maxQuantity) {
      onChange(quantity + step);
    }
  };

  const handleQuickAdd = (addAmount: number) => {
    const next = quantity + addAmount;
    if (next <= maxQuantity) {
      onChange(next);
    }
  };

  const isMin = quantity <= minQuantity;
  const isMax = quantity >= maxQuantity;

  return (
    <View style={styles.container}>
      <View style={[styles.stepperContainer, compact && styles.stepperCompact]}>
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={isMin}
          activeOpacity={0.7}
          style={[styles.btn, isMin && styles.btnDisabled]}>
          <Icon name="minus" size={compact ? 14 : 16} color={isMin ? '#CBD5E1' : '#0F172A'} />
        </TouchableOpacity>

        <View style={[styles.qtyDisplay, compact && styles.qtyDisplayCompact]}>
          <Text style={[styles.qtyText, compact && styles.qtyTextCompact]}>{quantity}</Text>
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          disabled={isMax}
          activeOpacity={0.7}
          style={[styles.btn, isMax && styles.btnDisabled]}>
          <Icon name="plus" size={compact ? 14 : 16} color={isMax ? '#CBD5E1' : '#0F172A'} />
        </TouchableOpacity>
      </View>

      {showQuickPills && (
        <View style={styles.quickPillsRow}>
          {[5, 10, 25, 50].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => handleQuickAdd(num)}
              activeOpacity={0.6}
              style={styles.pill}>
              <Text style={styles.pillText}>+{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  stepperCompact: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  btn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnDisabled: {
    backgroundColor: '#F8FAFC',
    opacity: 0.6,
  },
  qtyDisplay: {
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyDisplayCompact: {
    paddingHorizontal: 8,
    minWidth: 32,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  qtyTextCompact: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: '#FFF7ED',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.primaryDark,
  },
});
