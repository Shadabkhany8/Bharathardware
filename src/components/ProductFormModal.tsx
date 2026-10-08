import { BorderRadius, Colors, Shadows } from '@/constants/theme';
import { AdminService } from '@/services/admin.service';
import { Category, CreateProductPayload, Product } from '@/types/product.types';
import { resolveImageUrl } from '@/utils/formatters';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text, TextInput } from './ui/AppText';
import { Icon } from './ui/Icon';

interface ProductFormModalProps {
  visible: boolean;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: (savedProduct: Product) => void;
  onDelete?: (deletedProductId: number) => void;
}

const COMMON_UNITS = ['Piece', 'Box', 'Pack', 'Roll', 'Set', 'Kg'];

const SAMPLE_IMAGES = [
  {
    label: 'Abrasive Block',
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=500&auto=format&fit=crop',
  },
  {
    label: 'Buffing Pad',
    url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop',
  },
  {
    label: 'Scouring Pad',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop',
  },
  {
    label: 'Metal Prep',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop',
  },
  {
    label: 'Hardware Roll',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop',
  },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  product,
  categories,
  onClose,
  onSuccess,
  onDelete,
}) => {
  const isEditing = !!product;

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('100');
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState('10');
  const [unit, setUnit] = useState('Piece');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteProduct = () => {
    if (!product) return;
    Alert.alert(
      'Delete Product',
      `Are you sure you want to permanently delete "${name || product.name}" (SKU: ${sku || product.sku}) from the catalog? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Product',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            setError(null);
            try {
              await AdminService.deleteProduct(product.id);
              if (onDelete) {
                onDelete(product.id);
              }
              onClose();
              Alert.alert('Product Deleted', `"${product.name}" has been removed from the catalog.`);
            } catch (err: any) {
              setError(err?.message || 'Failed to delete product.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSku(product.sku || '');
      setCategoryId(product.categoryId || categories[0]?.id || 1);
      setWholesalePrice(product.wholesalePrice ? product.wholesalePrice.toString() : '');
      setStockQuantity(
        typeof product.stockQuantity === 'number' ? product.stockQuantity.toString() : '0'
      );
      setMinimumOrderQuantity(
        typeof product.minimumOrderQuantity === 'number'
          ? product.minimumOrderQuantity.toString()
          : '1'
      );
      setUnit(product.unit || 'Piece');
      setImageUrl(product.imageUrl || '');
      setDescription(product.description || '');
      setError(null);
    } else {
      setName('');
      setSku(`BS-SP-${Math.floor(100 + Math.random() * 900)}`);
      setCategoryId(categories[0]?.id || 1);
      setWholesalePrice('');
      setStockQuantity('250');
      setMinimumOrderQuantity('15');
      setUnit('Piece');
      setImageUrl('');
      setDescription('');
      setError(null);
    }
  }, [product, visible, categories]);

  const handleGenerateSku = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSku(`BS-SP-${randomNum}`);
  };

  const handleAdjustStock = (delta: number) => {
    const current = parseInt(stockQuantity, 10) || 0;
    const nextVal = Math.max(0, current + delta);
    setStockQuantity(nextVal.toString());
  };

  const handleAdjustMoq = (delta: number) => {
    const current = parseInt(minimumOrderQuantity, 10) || 1;
    const nextVal = Math.max(1, current + delta);
    setMinimumOrderQuantity(nextVal.toString());
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera permission in settings to click product photos directly.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        await processAndUploadImage(localUri);
      }
    } catch (err: any) {
      Alert.alert('Camera Error', err?.message || 'Could not open camera.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Photo Library Permission Required',
          'Please allow photo library permission in settings to select product images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        await processAndUploadImage(localUri);
      }
    } catch (err: any) {
      Alert.alert('Gallery Error', err?.message || 'Could not open gallery.');
    }
  };

  const processAndUploadImage = async (localUri: string) => {
    setImageUrl(localUri);
    setUploadingImage(true);
    setError(null);
    try {
      const uploadRes = await AdminService.uploadProductImage(localUri);
      if (uploadRes && uploadRes.imageUrl) {
        setImageUrl(uploadRes.imageUrl);
      }
    } catch (uploadErr: any) {
      console.warn('Backend image upload error, keeping local URI:', uploadErr);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (!sku.trim()) {
      setError('Please enter a unique SKU code');
      return;
    }
    const priceNum = parseFloat(wholesalePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid wholesale price (greater than ₹0)');
      return;
    }
    const stockNum = parseInt(stockQuantity, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setError('Please enter a valid warehouse stock quantity');
      return;
    }
    const moqNum = parseInt(minimumOrderQuantity, 10);
    if (isNaN(moqNum) || moqNum < 1) {
      setError('Please enter a valid Minimum Order Quantity (at least 1)');
      return;
    }

    setLoading(true);
    setError(null);

    const payload: CreateProductPayload = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      categoryId,
      wholesalePrice: priceNum,
      stockQuantity: stockNum,
      minimumOrderQuantity: moqNum,
      unit: unit.trim(),
      imageUrl: imageUrl.trim() || SAMPLE_IMAGES[0].url,
      description: description.trim(),
      active: true,
    };

    try {
      let result: Product;
      if (isEditing && product) {
        result = await AdminService.updateProduct(product.id, payload);
        Alert.alert(
          'Product Updated',
          `"${result.name}" inventory details (Stock: ${result.stockQuantity}, MOQ: ${result.minimumOrderQuantity}) have been updated.`,
          [{ text: 'OK' }]
        );
      } else {
        result = await AdminService.createProduct(payload);
        Alert.alert(
          'Product Added Successfully!',
          `"${result.name}" (SKU: ${result.sku}) is now live in the wholesale catalog with Stock: ${result.stockQuantity} and MOQ: ${result.minimumOrderQuantity}.`,
          [{ text: 'OK' }]
        );
      }

      onSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ gap: 2, flex: 1 }}>
              <View style={styles.badgeRow}>
                <Icon name="package" size={14} color={Colors.light.primary} />
                <Text style={styles.badgeText}>
                  {isEditing ? 'EDIT WHOLESALE ITEM' : 'ADD NEW CATALOG ITEM'}
                </Text>
              </View>
              <Text style={styles.title}>
                {isEditing ? 'Update Inventory & MOQ' : 'Add Item to Catalog'}
              </Text>
              <Text style={styles.subtitle}>
                Set warehouse stock quantity and dealer minimum purchase limits
              </Text>
            </View>
            <View style={styles.headerActionGroup}>
              {isEditing && (
                <TouchableOpacity
                  onPress={handleDeleteProduct}
                  disabled={loading || deleting}
                  style={styles.headerDeleteBtn}
                  activeOpacity={0.75}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Icon name="trash" size={17} color="#DC2626" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Icon name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Icon name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* 1. Item Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Product Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Industrial Dual-Grit Sanding Block"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* 2. Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Category <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryChipsRow}>
                {categories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategoryId(cat.id)}
                      activeOpacity={0.75}
                      style={[
                        styles.catChip,
                        isSelected && styles.catChipActive,
                      ]}>
                      <Text
                        style={[
                          styles.catChipText,
                          isSelected && styles.catChipTextActive,
                        ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 3. SKU & Unit Row */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1.3 }]}>
                <View style={styles.labelWithAction}>
                  <Text style={styles.label}>
                    SKU Code <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity onPress={handleGenerateSku}>
                    <Text style={styles.actionLink}>Auto-Gen</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="BS-SP-101"
                  placeholderTextColor="#94A3B8"
                  value={sku}
                  onChangeText={setSku}
                  autoCapitalize="characters"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Unit</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Piece"
                  placeholderTextColor="#94A3B8"
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>

            {/* Common Units Chips */}
            <View style={styles.unitChipsRow}>
              {COMMON_UNITS.map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setUnit(u)}
                  style={[styles.unitChip, unit === u && styles.unitChipActive]}>
                  <Text style={[styles.unitChipText, unit === u && styles.unitChipTextActive]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 4. Wholesale Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Wholesale Price per {unit} (₹) <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWithPrefix}>
                <Text style={styles.prefixText}>₹</Text>
                <TextInput
                  style={[styles.input, styles.inputPrefixed]}
                  placeholder="95.00"
                  placeholderTextColor="#94A3B8"
                  value={wholesalePrice}
                  onChangeText={setWholesalePrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* 5. Warehouse Stock Quantity (kitni quantity rakhna hai) */}
            <View style={styles.highlightCard}>
              <View style={styles.highlightHeader}>
                <View style={styles.highlightTitleRow}>
                  <Icon name="layers" size={16} color={Colors.light.primary} />
                  <Text style={styles.highlightTitle}>
                    Warehouse Stock Quantity (Available Inventory)
                  </Text>
                </View>
                <Text style={styles.highlightHelp}>
                  Kitni quantity warehouse mein available rakhna hai
                </Text>
              </View>

              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  onPress={() => handleAdjustStock(-50)}
                  style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>-50</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAdjustStock(-10)}
                  style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>-10</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.stepperInput}
                  value={stockQuantity}
                  onChangeText={setStockQuantity}
                  keyboardType="numeric"
                  textAlign="center"
                />

                <TouchableOpacity
                  onPress={() => handleAdjustStock(10)}
                  style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>+10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAdjustStock(50)}
                  style={styles.stepBtn}>
                  <Text style={styles.stepBtnText}>+50</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAdjustStock(100)}
                  style={[styles.stepBtn, styles.stepBtnPrimary]}>
                  <Text style={styles.stepBtnPrimaryText}>+100</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 6. Minimum Order Quantity / MOQ (kitni quantity buy kar sakta hai) */}
            <View style={[styles.highlightCard, { borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }]}>
              <View style={styles.highlightHeader}>
                <View style={styles.highlightTitleRow}>
                  <Icon name="tag" size={16} color="#D97706" />
                  <Text style={[styles.highlightTitle, { color: '#92400E' }]}>
                    Minimum Order Quantity (MOQ Requirement)
                  </Text>
                </View>
                <Text style={[styles.highlightHelp, { color: '#B45309' }]}>
                  Dealer ek baar mein kitni minimum quantity buy kar sakta hai
                </Text>
              </View>

              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  onPress={() => handleAdjustMoq(-10)}
                  style={[styles.stepBtn, { borderColor: '#FCD34D' }]}>
                  <Text style={[styles.stepBtnText, { color: '#92400E' }]}>-10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAdjustMoq(-5)}
                  style={[styles.stepBtn, { borderColor: '#FCD34D' }]}>
                  <Text style={[styles.stepBtnText, { color: '#92400E' }]}>-5</Text>
                </TouchableOpacity>

                <TextInput
                  style={[styles.stepperInput, { borderColor: '#F59E0B', color: '#92400E' }]}
                  value={minimumOrderQuantity}
                  onChangeText={setMinimumOrderQuantity}
                  keyboardType="numeric"
                  textAlign="center"
                />

                <TouchableOpacity
                  onPress={() => handleAdjustMoq(5)}
                  style={[styles.stepBtn, { borderColor: '#FCD34D' }]}>
                  <Text style={[styles.stepBtnText, { color: '#92400E' }]}>+5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAdjustMoq(10)}
                  style={[styles.stepBtn, { borderColor: '#FCD34D' }]}>
                  <Text style={[styles.stepBtnText, { color: '#92400E' }]}>+10</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAdjustMoq(25)}
                  style={[styles.stepBtn, { backgroundColor: '#F59E0B', borderColor: '#F59E0B' }]}>
                  <Text style={[styles.stepBtnPrimaryText]}>+25</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 7. Product Photo (Camera Click & Gallery) */}
            <View style={styles.photoSection}>
              <View style={styles.photoSectionHeader}>
                <View style={styles.photoTitleRow}>
                  <Icon name="camera" size={17} color={Colors.light.primary} />
                  <Text style={styles.photoTitle}>Product Photo (Click or Pick)</Text>
                </View>
                <Text style={styles.photoSubtitle}>
                  Camera se direct photo click karein ya gallery se select karein
                </Text>
              </View>

              {/* Photo Preview Card */}
              <View style={styles.photoPreviewCard}>
                {imageUrl ? (
                  <View style={styles.previewImageContainer}>
                    <Image
                      source={{ uri: resolveImageUrl(imageUrl) }}
                      style={styles.previewHeroImage}
                      resizeMode="cover"
                    />
                    {uploadingImage && (
                      <View style={styles.uploadingOverlay}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text style={styles.uploadingText}>Saving photo to server...</Text>
                      </View>
                    )}
                    <View style={styles.previewStatusBadge}>
                      <Icon name="check" size={12} color="#FFFFFF" />
                      <Text style={styles.previewStatusText}>Photo Selected</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyPhotoBox}>
                    <View style={styles.emptyPhotoIconCircle}>
                      <Icon name="camera" size={26} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.emptyPhotoTitle}>No Photo Added Yet</Text>
                    <Text style={styles.emptyPhotoSub}>
                      Item ki real photo click karein taaki dealers ko clear product dikhe
                    </Text>
                  </View>
                )}

                {/* Primary Action Buttons: Take Photo & Choose Gallery */}
                <View style={styles.photoActionRow}>
                  <TouchableOpacity
                    onPress={handleTakePhoto}
                    disabled={uploadingImage}
                    activeOpacity={0.85}
                    style={styles.cameraBtn}>
                    <Icon name="camera" size={18} color="#FFFFFF" />
                    <Text style={styles.cameraBtnText}>Click Photo (Camera)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePickFromGallery}
                    disabled={uploadingImage}
                    activeOpacity={0.85}
                    style={styles.galleryBtn}>
                    <Icon name="image" size={18} color={Colors.light.primary} />
                    <Text style={styles.galleryBtnText}>Choose Gallery</Text>
                  </TouchableOpacity>
                </View>

                {imageUrl ? (
                  <TouchableOpacity
                    onPress={() => setImageUrl('')}
                    style={styles.removePhotoBtn}>
                    <Icon name="trash" size={14} color="#EF4444" />
                    <Text style={styles.removePhotoText}>Remove Photo</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Expandable Fallback for Sample Presets / Direct URL */}
              <TouchableOpacity
                onPress={() => setShowUrlFallback(!showUrlFallback)}
                style={styles.fallbackToggleRow}
                activeOpacity={0.7}>
                <Icon
                  name={showUrlFallback ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color="#64748B"
                />
                <Text style={styles.fallbackToggleText}>
                  {showUrlFallback
                    ? 'Hide sample images & URL option'
                    : 'Or choose sample images / enter custom URL'}
                </Text>
              </TouchableOpacity>

              {showUrlFallback && (
                <View style={styles.urlFallbackBox}>
                  <Text style={styles.presetLabel}>Quick Sample Presets:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetScroll}>
                    {SAMPLE_IMAGES.map((sample) => (
                      <TouchableOpacity
                        key={sample.label}
                        onPress={() => setImageUrl(sample.url)}
                        style={[
                          styles.presetChip,
                          imageUrl === sample.url && styles.presetChipActive,
                        ]}>
                        <Text
                          style={[
                            styles.presetChipText,
                            imageUrl === sample.url && styles.presetChipTextActive,
                          ]}>
                          {sample.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={[styles.inputGroup, { marginTop: 10, marginBottom: 0 }]}>
                    <Text style={styles.label}>Direct Image URL</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="https://..."
                      placeholderTextColor="#94A3B8"
                      value={imageUrl}
                      onChangeText={setImageUrl}
                    />
                  </View>
                </View>
              )}
            </View>

            {/* 8. Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Specifications & Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Industrial grade abrasive foam sponge for paint prep, wood sanding, metal finishing..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Danger Zone: Delete Product */}
            {isEditing && (
              <View style={styles.dangerZoneCard}>
                <View style={styles.dangerZoneHeader}>
                  <View style={styles.dangerTitleRow}>
                    <Icon name="trash" size={16} color="#DC2626" />
                    <Text style={styles.dangerZoneTitle}>Catalog Danger Zone</Text>
                  </View>
                  <Text style={styles.dangerZoneDesc}>
                    Permanently delete this product and all associated inventory details from the wholesale catalog.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleDeleteProduct}
                  disabled={loading || deleting}
                  activeOpacity={0.85}
                  style={[styles.dangerDeleteBtn, (loading || deleting) && styles.btnDisabled]}>
                  {deleting ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <>
                      <Icon name="trash" size={15} color="#DC2626" />
                      <Text style={styles.dangerDeleteBtnText}>Delete This Product</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              disabled={loading}
              style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.88}
              style={[styles.submitBtn, loading && styles.btnDisabled]}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Icon
                    name={isEditing ? 'check' : 'plus'}
                    size={17}
                    color="#FFFFFF"
                  />
                  <Text style={styles.submitBtnText}>
                    {isEditing ? 'Save Changes' : 'Add Item to Catalog'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    paddingTop: 20,
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.light.primaryDark,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 24,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#334155',
  },
  labelWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionLink: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
  },
  prefixText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.primary,
    marginRight: 6,
  },
  inputPrefixed: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryChipsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  unitChipsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  unitChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.xs,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  unitChipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FDBA74',
  },
  unitChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  unitChipTextActive: {
    color: Colors.light.primaryDark,
    fontWeight: '800',
  },
  highlightCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 14,
    gap: 10,
  },
  highlightHeader: {
    gap: 2,
  },
  highlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  highlightHelp: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  stepBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  stepBtnPrimary: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  stepBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepperInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    fontSize: 18,
    fontWeight: '900',
    color: Colors.light.primary,
    paddingVertical: 8,
  },
  photoSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 12,
  },
  photoSectionHeader: {
    gap: 2,
  },
  photoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  photoSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  photoPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    padding: 12,
    gap: 10,
  },
  previewImageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  previewHeroImage: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewStatusBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  previewStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyPhotoBox: {
    height: 130,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 4,
  },
  emptyPhotoIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  emptyPhotoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  emptyPhotoSub: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 240,
  },
  photoActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cameraBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    ...Shadows.primary,
  },
  cameraBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  galleryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  galleryBtnText: {
    color: Colors.light.primaryDark,
    fontSize: 12.5,
    fontWeight: '800',
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  removePhotoText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  fallbackToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 4,
  },
  fallbackToggleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  urlFallbackBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
  },
  presetScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  textArea: {
    height: 72,
    paddingTop: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    ...Shadows.primary,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  btnDisabled: {
    opacity: 0.65,
  },
  headerActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDeleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerZoneCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    padding: 14,
    gap: 12,
    marginTop: 6,
  },
  dangerZoneHeader: {
    gap: 4,
  },
  dangerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dangerZoneTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#991B1B',
  },
  dangerZoneDesc: {
    fontSize: 11.5,
    color: '#B91C1C',
    lineHeight: 16,
  },
  dangerDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  dangerDeleteBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '800',
  },
});
