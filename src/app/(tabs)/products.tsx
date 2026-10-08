import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, TextInput } from '@/components/common/Text';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { CategoryPills } from '@/components/CategoryPills';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { ProductService } from '@/services/product.service';
import { AdminService } from '@/services/admin.service';
import { CategoryService } from '@/services/category.service';
import { Category, Product } from '@/types/product.types';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/context/AuthContext';
import { ProductFormModal } from '@/components/ProductFormModal';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'moq_asc';

export default function ProductsScreen() {
  const { customer } = useAuth();
  const isAdmin = customer?.role === 'ROLE_ADMIN';

  const params = useLocalSearchParams<{ categoryId?: string; query?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    params.categoryId ? parseInt(params.categoryId, 10) : null
  );
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [debouncedQuery, setDebouncedQuery] = useState(params.query || '');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin Product Form State
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadCategories = async () => {
    try {
      const cats = await CategoryService.getCategories();
      setCategories(cats);
    } catch {
      // Ignore
    }
  };

  const fetchProducts = async (pageToFetch: number, reset = false) => {
    if (reset) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    let sortParam: string | undefined;
    let sortDir: 'asc' | 'desc' | undefined;
    if (sortBy === 'price_asc') {
      sortParam = 'wholesalePrice';
      sortDir = 'asc';
    } else if (sortBy === 'price_desc') {
      sortParam = 'wholesalePrice';
      sortDir = 'desc';
    } else if (sortBy === 'moq_asc') {
      sortParam = 'minimumOrderQuantity';
      sortDir = 'asc';
    }

    try {
      const res = await ProductService.getProducts({
        query: debouncedQuery.trim() || undefined,
        categoryId: selectedCategoryId || undefined,
        page: pageToFetch,
        size: 10,
        sortBy: sortParam,
        sortDir,
      });

      if (reset) {
        setProducts(res.content);
      } else {
        setProducts((prev) => [...prev, ...res.content]);
      }

      setTotalCount(res.totalElements);
      setPage(res.pageNumber);
      setIsLastPage(res.last);
    } catch (err: any) {
      setError(err?.message || 'Failed to load wholesale catalog.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (params.categoryId) {
      setSelectedCategoryId(parseInt(params.categoryId, 10));
    }
  }, [params.categoryId]);

  useEffect(() => {
    if (params.query !== undefined) {
      setSearchQuery(params.query);
      setDebouncedQuery(params.query);
    }
  }, [params.query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, debouncedQuery, sortBy]);

  const handleEndReached = () => {
    if (!loading && !loadingMore && !isLastPage) {
      fetchProducts(page + 1, false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(0, true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategoryId(null);
    setSortBy('default');
  };

  const handleAdminDeleteProduct = (prod: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to permanently delete "${prod.name}" (SKU: ${prod.sku}) from the wholesale catalog? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Product',
          style: 'destructive',
          onPress: async () => {
            try {
              await AdminService.deleteProduct(prod.id);
              setProducts((prev) => prev.filter((p) => p.id !== prod.id));
              setTotalCount((prev) => Math.max(0, prev - 1));
              Alert.alert('Product Deleted', `"${prod.name}" has been removed from catalog.`);
            } catch (err: any) {
              Alert.alert('Delete Failed', err?.message || 'Could not delete product.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={isAdmin ? 'Wholesale Inventory' : 'Wholesale Catalog'}
        subtitle={
          isAdmin
            ? 'Manage inventory stock, dealer MOQ & catalog items'
            : 'Direct factory abrasive sponges & hardware finishing supplies'
        }
      />

      {/* Admin Inventory Management Banner */}
      {isAdmin && (
        <View style={styles.adminBanner}>
          <View style={styles.adminBannerLeft}>
            <View style={styles.adminBadgeRow}>
              <Icon name="package" size={13} color="#D97706" />
              <Text style={styles.adminBadgeText}>INVENTORY MANAGER</Text>
            </View>
            <Text style={styles.adminBannerTitle}>Product Catalog Control</Text>
            <Text style={styles.adminBannerSub}>
              Set warehouse stock quantity & dealer MOQ buy requirements
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setEditingProduct(null);
              setFormModalVisible(true);
            }}
            activeOpacity={0.88}
            style={styles.adminAddBtn}>
            <Icon name="plus" size={17} color="#FFFFFF" />
            <Text style={styles.adminAddBtnText}>Add Item</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by SKU (e.g. BS-SP-101) or hardware..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter Pills */}
      <CategoryPills
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      {/* Sort Options & Count Bar */}
      <View style={styles.filterSubBar}>
        <Text style={styles.itemCountText}>
          {totalCount} {totalCount === 1 ? 'Product' : 'Products'} Available
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortChips}>
          <TouchableOpacity
            onPress={() => setSortBy('default')}
            style={[styles.sortChip, sortBy === 'default' && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sortBy === 'default' && styles.sortChipTextActive]}>
              Featured
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('price_asc')}
            style={[styles.sortChip, sortBy === 'price_asc' && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sortBy === 'price_asc' && styles.sortChipTextActive]}>
              Price: Low → High
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('price_desc')}
            style={[styles.sortChip, sortBy === 'price_desc' && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sortBy === 'price_desc' && styles.sortChipTextActive]}>
              Price: High → Low
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortBy('moq_asc')}
            style={[styles.sortChip, sortBy === 'moq_asc' && styles.sortChipActive]}>
            <Text style={[styles.sortChipText, sortBy === 'moq_asc' && styles.sortChipTextActive]}>
              Lowest MOQ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {error && <ErrorBanner message={error} onRetry={() => fetchProducts(0, true)} />}

      {loading ? (
        <LoadingSkeleton message="Fetching wholesale product catalog..." />
      ) : products.length === 0 ? (
        <EmptyState
          iconName="search"
          title="No Products Found"
          message="We couldn't find any hardware matching your search or category filter."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isAdmin={isAdmin}
              onEditPress={(prod) => {
                setEditingProduct(prod);
                setFormModalVisible(true);
              }}
              onDeletePress={handleAdminDeleteProduct}
            />
          )}
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
                <Text style={styles.footerText}>Loading more products...</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Admin Add / Edit Product Modal */}
      <ProductFormModal
        visible={formModalVisible}
        product={editingProduct}
        categories={categories}
        onClose={() => setFormModalVisible(false)}
        onSuccess={() => {
          fetchProducts(0, true);
        }}
        onDelete={(deletedId) => {
          setProducts((prev) => prev.filter((p) => p.id !== deletedId));
          setTotalCount((prev) => Math.max(0, prev - 1));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  filterSubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  itemCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    marginRight: 10,
  },
  sortChips: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F1F5F9',
  },
  sortChipActive: {
    backgroundColor: '#FFEDD5',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  sortChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: Colors.light.primaryDark,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingBottom: 48,
  },
  footerLoader: {
    paddingVertical: 18,
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
  adminBanner: {
    backgroundColor: '#0F172A',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: BorderRadius.xl,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    ...Shadows.card,
  },
  adminBannerLeft: {
    flex: 1,
    gap: 3,
  },
  adminBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
  adminBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  adminBannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  adminBannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 14,
  },
  adminAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  adminAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
