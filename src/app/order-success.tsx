import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { formatCurrency } from '@/utils/formatters';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';
import { Config } from '@/constants/config';

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams<{
    orderNumber: string;
    orderId: string;
    totalAmount: string;
    totalQuantity: string;
    paymentMethod: string;
    deliveryZone?: string;
    deliveryCharge?: string;
  }>();

  const isOutside = Number(params.deliveryCharge || 0) > 0;

  const handleCallOwner = () => {
    Linking.openURL(`tel:${Config.ownerPhone}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Animated Check Ring */}
        <View style={styles.checkCircle}>
          <Icon name="check" size={44} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Your wholesale order has been registered in the Bharat Sponge system and queued for factory dispatch from Indore, MP.
        </Text>

        {/* Perforated Invoice Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.label} numberOfLines={1}>Order Number</Text>
            <View style={styles.orderNumberBadge}>
              <Text style={styles.orderNumber} numberOfLines={1}>{params.orderNumber || 'BS-2026-000001'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.label} numberOfLines={1}>Status</Text>
            <View style={styles.statusChip}>
              <View style={styles.statusDot} />
              <Text style={styles.statusChipText} numberOfLines={1}>Pending Verification</Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.label} numberOfLines={1}>Delivery Zone</Text>
            <View style={[styles.zoneBadge, isOutside ? styles.zoneBadgeOutside : styles.zoneBadgeLocal]}>
              <Icon
                name={isOutside ? 'truck' : 'map-pin'}
                size={12}
                color={isOutside ? '#B45309' : '#059669'}
              />
              <Text
                style={[styles.zoneBadgeText, isOutside ? styles.zoneTextOutside : styles.zoneTextLocal]}
                numberOfLines={1}>
                {params.deliveryZone || (isOutside ? 'Outside Indore' : 'Indore Local Dispatch')}
              </Text>
            </View>
          </View>

          {isOutside && (
            <View style={styles.receiptRow}>
              <Text style={styles.label} numberOfLines={1}>Out-of-Indore Delivery</Text>
              <Text style={styles.surchargeVal} numberOfLines={1}>+₹{params.deliveryCharge || '250'}</Text>
            </View>
          )}

          <View style={styles.receiptRow}>
            <Text style={styles.label} numberOfLines={1}>Settlement Mode</Text>
            <View style={styles.paymentMethodRow}>
              <Icon
                name={
                  params.paymentMethod === 'QR'
                    ? 'qr-code'
                    : params.paymentMethod === 'BARCODE'
                    ? 'barcode'
                    : 'cash'
                }
                size={14}
                color="#0F172A"
              />
              <Text style={styles.valBold} numberOfLines={1}>{params.paymentMethod || 'CASH'}</Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.label} numberOfLines={1}>Total Wholesale Units</Text>
            <Text style={styles.val} numberOfLines={1}>{params.totalQuantity || '0'} units</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.totalLabel} numberOfLines={1}>Order Total</Text>
            <Text style={styles.totalAmount} numberOfLines={1} adjustsFontSizeToFit>
              {formatCurrency(params.totalAmount || '0')}
            </Text>
          </View>

          {/* Barcode Graphic Simulation */}
          <View style={styles.barcodeSection}>
            <View style={styles.barcodeLines}>
              {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 5, 2, 4, 3, 1, 2, 4, 1, 3].map(
                (w, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.barcodeBar,
                      { width: w * 2, marginHorizontal: (idx % 3) + 1 },
                    ]}
                  />
                )
              )}
            </View>
            <Text style={styles.barcodeText}>*{params.orderNumber || 'BS-2026-000001'}*</Text>
          </View>

          <View style={styles.noticeBox}>
            <Icon name="info" size={16} color="#0369A1" />
            <Text style={styles.noticeText}>
              Payment is not charged online. Please keep payment ready via {params.paymentMethod || 'selected method'} upon delivery or pickup.
            </Text>
          </View>

          {/* Owner & Dispatch Contact */}
          <View style={styles.ownerContactBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerLabel}>Operations Hub: Indore, MP</Text>
              <Text style={styles.ownerName}>Owner: {Config.ownerName}</Text>
              <Text style={styles.ownerPhone}>📞 {Config.supportPhone}</Text>
            </View>
            <TouchableOpacity onPress={handleCallOwner} style={styles.callOwnerBtn} activeOpacity={0.8}>
              <Icon name="phone" size={14} color="#FFFFFF" />
              <Text style={styles.callOwnerText}>Call Owner</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.viewOrderBtn}
            onPress={() => {
              if (params.orderId) {
                router.replace(`/order/${params.orderId}` as any);
              } else {
                router.replace('/(tabs)/orders' as any);
              }
            }}
            activeOpacity={0.88}>
            <Text style={styles.viewOrderBtnText}>View Order Details & Status</Text>
            <Icon name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => router.replace('/(tabs)/products' as any)}
            activeOpacity={0.8}>
            <Text style={styles.continueBtnText}>Continue Wholesale Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 310,
    lineHeight: 18,
    marginBottom: 24,
  },
  receiptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 20,
    width: '100%',
    ...Shadows.lg,
    gap: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    flexShrink: 0,
  },
  orderNumberBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.light.primaryDark,
    letterSpacing: 0.5,
  },
  val: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valBold: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.sm,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  statusChipText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.light.primary,
  },
  barcodeSection: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
  },
  barcodeLines: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  barcodeBar: {
    height: 36,
    backgroundColor: '#0F172A',
  },
  barcodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 2,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
    fontWeight: '500',
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  viewOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.primary,
  },
  viewOrderBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  continueBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 15,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  zoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  zoneBadgeLocal: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  zoneBadgeOutside: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  zoneBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  zoneTextLocal: {
    color: '#15803D',
  },
  zoneTextOutside: {
    color: '#B45309',
  },
  surchargeVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  ownerContactBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: BorderRadius.md,
    padding: 12,
    marginTop: 4,
  },
  ownerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9A3412',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  ownerPhone: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2410C',
    marginTop: 2,
  },
  callOwnerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  callOwnerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

