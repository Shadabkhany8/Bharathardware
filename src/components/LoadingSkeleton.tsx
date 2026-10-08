import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from './ui/AppText';
import { Colors } from '@/constants/theme';

interface LoadingSkeletonProps {
  message?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ message = 'Loading wholesale catalog...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});
