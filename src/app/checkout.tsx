import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, TextInput } from '@/components/common/Text';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { OrderService } from '@/services/order.service';
import { PaymentMethod } from '@/types/order.types';
import { formatCurrency, getPaymentMethodMeta } from '@/utils/formatters';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';
import { Config } from '@/constants/config';
import { getDeliveryZoneInfo, isIndoreAddress } from '@/utils/delivery';

export default function CheckoutScreen() {
  const { customer } = useAuth();
  const { items, totalQuantity, totalAmount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [deliveryAddress, setDeliveryAddress] = useState(
    customer ? `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}` : ''
  );
  // Delivery zone selection: 'AUTO' relies on address detection; can also explicitly choose 'INDORE' or 'OUTSIDE'
  const [zoneMode, setZoneMode] = useState<'AUTO' | 'INDORE' | 'OUTSIDE'>('AUTO');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine active delivery zone
  const isAddressIndore = isIndoreAddress(deliveryAddress);
  const isIndore =
    zoneMode === 'INDORE' ? true : zoneMode === 'OUTSIDE' ? false : isAddressIndore;
  const zoneInfo = getDeliveryZoneInfo(deliveryAddress, !isIndore);
  const deliveryCharge = zoneInfo.deliveryCharge;
  const grandTotal = totalAmount + deliveryCharge;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your wholesale cart is empty.');
      router.back();
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please provide a valid warehouse/shop delivery address.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const zoneTag = isIndore ? '[Indore Local Dispatch]' : `[Outside Indore - Surcharge +₹${deliveryCharge}]`;
      const fullDeliveryAddress = `${deliveryAddress.trim()} ${zoneTag}`;
      const fullNotes = [
        notes.trim() || undefined,
        `[Zone: ${zoneInfo.zoneLabel} | Surcharge: ${zoneInfo.deliveryChargeFormatted} | Hub: Indore, MP]`,
      ]
        .filter(Boolean)
        .join(' • ');

      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        paymentMethod,
        deliveryAddress: fullDeliveryAddress,
        notes: fullNotes,
      };

      const createdOrder = await OrderService.createOrder(payload);

      // Order created successfully on server! Clear local cart
      clearCart();

      // Navigate to order-success screen with order details
      router.replace({
        pathname: '/order-success',
        params: {
          orderNumber: createdOrder.orderNumber,
          orderId: createdOrder.id.toString(),
          totalAmount: grandTotal.toString(),
          totalQuantity: createdOrder.totalQuantity.toString(),
          paymentMethod: createdOrder.paymentMethod,
          deliveryZone: zoneInfo.zoneLabel,
          deliveryCharge: deliveryCharge.toString(),
        },
      } as any);
    } catch (err: any) {
      const errMsg =
        err?.message || 'Failed to place order. Please review stock availability and try again.';
      setError(errMsg);
      Alert.alert('Order Placement Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions: PaymentMethod[] = ['CASH', 'QR', 'BARCODE'];


  return (
    <View style={styles.container}>
      <Header title="Wholesale Checkout" subtitle="Confirm dispatch & settlement" showBack showCart={false} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {error && (
          <View style={styles.errorBox}>
            <Icon name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* 1. Customer Information Card */}
        <View style={styles.card}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.cardHeader}>Wholesale Customer Account</Text>
          </View>

          <View style={styles.infoContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Name</Text>
              <Text style={styles.infoValBold} numberOfLines={1} ellipsizeMode="tail">
                {customer?.businessName || 'Authorized Mart'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Person</Text>
              <Text style={styles.infoVal} numberOfLines={1} ellipsizeMode="tail">
                {customer?.name || 'Authorized Buyer'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Customer Code</Text>
              <View style={styles.codePill}>
                <Text style={styles.infoCode} numberOfLines={1}>
                  {customer?.customerCode || 'CUST-BS-1001'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoVal} numberOfLines={1}>+91 {customer?.phone || '9876543210'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Delivery Warehouse */}
        <View style={styles.card}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeader}>Delivery Warehouse & Service Area</Text>
              <Text style={styles.cardHeaderSub}>Operations Hub: Indore, MP • Owner: {Config.ownerName}</Text>
            </View>
          </View>

          {/* Delivery Zone Selector */}
          <Text style={styles.inputLabel}>Delivery Service Zone *</Text>
          <View style={styles.zoneSelectorRow}>
            <TouchableOpacity
              style={[
                styles.zoneBtn,
                isIndore && styles.zoneBtnActive,
              ]}
              onPress={() => setZoneMode('INDORE')}
              activeOpacity={0.8}>
              <View style={styles.zoneRadio}>
                {isIndore && <View style={styles.zoneRadioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.zoneTitleRow}>
                  <Text style={[styles.zoneTitle, isIndore && styles.zoneTitleActive]}>
                    📍 Indore Local
                  </Text>
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>FREE DELIVERY</Text>
                  </View>
                </View>
                <Text style={styles.zoneDesc}>Local dispatch within Indore city limits</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.zoneBtn,
                !isIndore && styles.zoneBtnActiveWarning,
              ]}
              onPress={() => setZoneMode('OUTSIDE')}
              activeOpacity={0.8}>
              <View style={[styles.zoneRadio, !isIndore && { borderColor: '#D97706' }]}>
                {!isIndore && <View style={[styles.zoneRadioDot, { backgroundColor: '#D97706' }]} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.zoneTitleRow}>
                  <Text style={[styles.zoneTitle, !isIndore && styles.zoneTitleWarning]}>
                    🚚 Outside Indore
                  </Text>
                  <View style={styles.surchargeBadge}>
                    <Text style={styles.surchargeBadgeText}>+₹{Config.outsideIndoreDeliveryCharge}</Text>
                  </View>
                </View>
                <Text style={styles.zoneDesc}>Out-of-district transport surcharge applies</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Zone Dynamic Notice Banner */}
          {isIndore ? (
            <View style={styles.localZoneNotice}>
              <Icon name="check-circle" size={17} color="#059669" />
              <View style={{ flex: 1 }}>
                <Text style={styles.localZoneNoticeTitle}>Indore Local Service Area</Text>
                <Text style={styles.localZoneNoticeText}>
                  Your order qualifies for direct wholesale factory dispatch within Indore with no extra delivery fee.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.outsideZoneNotice}>
              <Icon name="alert-triangle" size={18} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.outsideZoneNoticeTitle}>
                  Additional Delivery Charge (Outside Indore)
                </Text>
                <Text style={styles.outsideZoneNoticeText}>
                  Bharat Sponge is located in Indore, MP. An additional transport surcharge of ₹{Config.outsideIndoreDeliveryCharge} is added for orders delivered outside Indore.
                </Text>
              </View>
            </View>
          )}

          <Text style={[styles.inputLabel, { marginTop: 14 }]}>Confirm Complete Address *</Text>
          <TextInput
            style={styles.addressInput}
            multiline
            numberOfLines={3}
            value={deliveryAddress}
            onChangeText={(text) => {
              setDeliveryAddress(text);
              if (zoneMode === 'AUTO') {
                // Keep automatic sync
              }
            }}
            placeholder="Enter complete delivery warehouse address with landmark & pincode (e.g. Loha Mandi, Indore or outside address)"
            placeholderTextColor="#94A3B8"
          />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>
            Dispatch Notes / Unloading Instructions (Optional):
          </Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Unload at rear dock, morning truck convoy, call supervisor..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* 3. Payment Method Selection - STRICTLY OFFLINE SETTLEMENT */}
        <View style={styles.card}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <Text style={styles.cardHeader}>Payment Settlement Method</Text>
          </View>

          {/* Strict B2B offline notice */}
          <View style={styles.paymentNoticeBox}>
            <Icon name="info" size={18} color="#0284C7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentNoticeTitle}>Strictly Offline Settlement</Text>
              <Text style={styles.paymentNoticeText}>
                No online credit card, netbanking, or gateway charge occurs inside this app. Choose your preferred offline payment method below. Payment will be collected upon dispatch or warehouse delivery.
              </Text>
            </View>
          </View>

          <View style={styles.methodsContainer}>
            {paymentOptions.map((method) => {
              const meta = getPaymentMethodMeta(method);
              const isSelected = paymentMethod === method;
              const methodIcon =
                method === 'CASH'
                  ? 'cash'
                  : method === 'QR'
                  ? 'qr-code'
                  : 'barcode';

              return (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  activeOpacity={0.8}
                  style={[styles.methodOption, isSelected && styles.methodOptionSelected]}>
                  <View style={styles.methodLeft}>
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View
                      style={[
                        styles.methodIconBox,
                        isSelected && { backgroundColor: '#FFEDD5' },
                      ]}>
                      <Icon
                        name={methodIcon as any}
                        size={20}
                        color={isSelected ? Colors.light.primary : '#64748B'}
                      />
                    </View>
                  </View>
                  <View style={styles.methodInfo}>
                    <Text style={[styles.methodTitle, isSelected && styles.methodTitleSelected]}>
                      {meta.label}
                    </Text>
                    <Text style={styles.methodDesc}>{meta.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Order Summary */}
        <View style={styles.card}>
          <View style={styles.stepHeaderRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={styles.cardHeader}>Wholesale Order Review</Text>
          </View>

          <View style={styles.itemsList}>
            {items.map((item) => (
              <View key={item.productId} style={styles.itemRow}>
                <View style={styles.itemRowInfo}>
                  <Text style={styles.itemRowName} numberOfLines={1} ellipsizeMode="tail">
                    {item.productName}
                  </Text>
                  <Text style={styles.itemRowSku} numberOfLines={1} ellipsizeMode="tail">
                    SKU: {item.sku} • {item.quantity} {item.unit} × {formatCurrency(item.wholesalePrice)}
                  </Text>
                </View>
                <Text style={styles.itemRowSubtotal} numberOfLines={1}>
                  {formatCurrency(item.wholesalePrice * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.totalDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel} numberOfLines={1}>Total Wholesale Units:</Text>
            <Text style={styles.totalVal} numberOfLines={1}>{totalQuantity} units</Text>
          </View>

          <View style={[styles.totalRow, { marginTop: 6 }]}>
            <Text style={styles.totalLabel} numberOfLines={1}>Items Wholesale Subtotal:</Text>
            <Text style={styles.totalVal} numberOfLines={1}>{formatCurrency(totalAmount)}</Text>
          </View>

          <View style={[styles.totalRow, { marginTop: 6 }]}>
            <View style={styles.deliveryLabelRow}>
              <Icon
                name={isIndore ? 'map-pin' : 'truck'}
                size={14}
                color={isIndore ? '#059669' : '#D97706'}
              />
              <Text style={styles.totalLabel} numberOfLines={1}>
                {isIndore ? 'Indore Local Delivery:' : 'Outside Indore Delivery Surcharge:'}
              </Text>
            </View>
            <Text
              style={[
                styles.deliveryValText,
                isIndore ? styles.deliveryFreeText : styles.deliverySurchargeText,
              ]}
              numberOfLines={1}>
              {isIndore ? 'FREE (Indore Local)' : `+${formatCurrency(deliveryCharge)}`}
            </Text>
          </View>

          <View style={[styles.totalRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
            <Text style={styles.finalTotalLabel} numberOfLines={1}>Order Total Payable:</Text>
            <Text style={styles.finalTotalAmount} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Place Order CTA */}
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading}
          activeOpacity={0.88}
          style={[styles.placeOrderBtn, loading && styles.btnDisabled]}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.placeOrderBtnText}>
                Confirm Wholesale Order ({formatCurrency(grandTotal)})
              </Text>
              <Icon name="arrow-right" size={18} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerDisclaimer}>
          By placing this order, you confirm wholesale purchase terms with Bharat Sponge (Indore, MP - Owner: {Config.ownerName}). An authoritative order number formatted as BS-YYYY-XXXXXX will be generated.
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    gap: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: BorderRadius.md,
    padding: 12,
  },
  errorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  infoContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    flexShrink: 0,
  },
  infoVal: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  infoValBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },
  codePill: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  infoCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.primaryDark,
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  addressInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
    minHeight: 76,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
  },
  paymentNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: BorderRadius.md,
    padding: 12,
    marginBottom: 14,
  },
  paymentNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 2,
  },
  paymentNoticeText: {
    fontSize: 11,
    color: '#0C4A6E',
    lineHeight: 16,
  },
  methodsContainer: {
    gap: 10,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  methodOptionSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: '#FFF7ED',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  methodIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  methodTitleSelected: {
    color: Colors.light.primaryDark,
  },
  methodDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  itemsList: {
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  itemRowInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    paddingRight: 6,
  },
  itemRowName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemRowSku: {
    fontSize: 11,
    color: '#64748B',
  },
  itemRowSubtotal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flexShrink: 0,
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    flexShrink: 0,
  },
  totalVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 0,
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    flexShrink: 0,
  },
  finalTotalAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.light.primary,
    flexShrink: 0,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.primary,
    marginTop: 6,
  },
  btnDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.7,
  },
  placeOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  footerDisclaimer: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },
  cardHeaderSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  zoneSelectorRow: {
    gap: 8,
    marginBottom: 12,
  },
  zoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  zoneBtnActive: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  zoneBtnActiveWarning: {
    borderColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  zoneRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#059669',
  },
  zoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  zoneTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  zoneTitleActive: {
    color: '#065F46',
  },
  zoneTitleWarning: {
    color: '#92400E',
  },
  zoneDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  freeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803D',
  },
  surchargeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  surchargeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  localZoneNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  localZoneNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#15803D',
    marginBottom: 2,
  },
  localZoneNoticeText: {
    fontSize: 11,
    color: '#166534',
    lineHeight: 15,
  },
  outsideZoneNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginBottom: 8,
  },
  outsideZoneNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 2,
  },
  outsideZoneNoticeText: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 15,
  },
  deliveryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  deliveryValText: {
    fontSize: 13,
    fontWeight: '800',
    flexShrink: 0,
  },
  deliveryFreeText: {
    color: '#059669',
  },
  deliverySurchargeText: {
    color: '#D97706',
  },
});

