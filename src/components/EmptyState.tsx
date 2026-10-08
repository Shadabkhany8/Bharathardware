import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './ui/AppText';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon, IconName } from './ui/Icon';

interface EmptyStateProps {
  icon?: string;
  iconName?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  iconName,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {iconName ? (
          <Icon name={iconName} size={36} color={Colors.light.primary} />
        ) : icon ? (
          <Text style={styles.emojiText}>{icon}</Text>
        ) : (
          <Icon name="products" size={36} color={Colors.light.primary} />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={styles.actionBtn}
          activeOpacity={0.85}>
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emojiText: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  actionBtn: {
    marginTop: 14,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    ...Shadows.primary,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
