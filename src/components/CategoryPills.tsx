import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from './ui/AppText';
import { Category } from '@/types/product.types';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from './ui/Icon';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
          activeOpacity={0.75}
          style={[styles.pill, selectedCategoryId === null && styles.pillActive]}>
          <Icon
            name="layers"
            size={14}
            color={selectedCategoryId === null ? '#FFFFFF' : '#64748B'}
          />
          <Text
            style={[
              styles.pillText,
              selectedCategoryId === null && styles.pillTextActive,
            ]}>
            All Items
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.75}
              style={[styles.pill, isActive && styles.pillActive]}>
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
    ...Shadows.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
