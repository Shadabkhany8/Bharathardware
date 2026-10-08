import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Text, TextInput } from '@/components/common/Text';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { CustomerService } from '@/services/customer.service';
import { Icon } from '@/components/ui/Icon';
import { Config } from '@/constants/config';
import { isIndoreAddress } from '@/utils/delivery';


export default function ProfileScreen() {
  const { customer, isAuthenticated, logout, refreshProfile } = useAuth();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: customer?.name || '',
    businessName: customer?.businessName || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    pincode: customer?.pincode || '',
  });

  const handleOpenEdit = () => {
    if (customer) {
      setEditForm({
        name: customer.name,
        businessName: customer.businessName,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      });
      setEditModalVisible(true);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await CustomerService.updateProfile(editForm);
      await refreshProfile();
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your wholesale account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title="Account Profile" />
        <View style={styles.notAuthCard}>
          <View style={styles.notAuthIconCircle}>
            <Icon name="lock" size={32} color={Colors.light.primary} />
          </View>
          <Text style={styles.notAuthTitle}>Wholesale Customer Account</Text>
          <Text style={styles.notAuthText}>
            Sign in to manage your verified wholesale credentials, check bulk order history, and access factory rates.
          </Text>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => router.push('/(auth)/login' as any)}
            activeOpacity={0.85}>
            <Text style={styles.signInBtnText}>Sign In to Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Dealer Account" showCart={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Customer Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer?.name ? customer.name.charAt(0).toUpperCase() : 'B'}
              </Text>
            </View>
            <View style={styles.profileInfoCol}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{customer?.name}</Text>
              <Text style={styles.businessName} numberOfLines={1} ellipsizeMode="tail">{customer?.businessName}</Text>
              <View style={styles.codeBadgeRow}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText} numberOfLines={1}>{customer?.customerCode || 'CUST-BS-1001'}</Text>
                </View>
                {customer?.role === 'ROLE_ADMIN' ? (
                  <View style={styles.adminBadge}>
                    <Icon name="shield-check" size={13} color="#B45309" />
                    <Text style={styles.adminBadgeText} numberOfLines={1}>System Administrator</Text>
                  </View>
                ) : (
                  <View style={styles.verifiedBadge}>
                    <Icon name="shield-check" size={13} color="#10B981" />
                    <Text style={styles.verifiedBadgeText} numberOfLines={1}>Verified Dealer</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.contactDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Icon name="phone" size={15} color="#64748B" />
                <Text style={styles.detailLabel}>Registered Phone:</Text>
              </View>
              <Text style={styles.detailValue} numberOfLines={1}>+91 {customer?.phone}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Icon name="mail" size={15} color="#64748B" />
                <Text style={styles.detailLabel}>Business Email:</Text>
              </View>
              <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
                {customer?.email}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelRow}>
                <Icon name="building" size={15} color="#64748B" />
                <Text style={styles.detailLabel}>Account Role:</Text>
              </View>
              <Text style={styles.detailValueRole} numberOfLines={1}>{customer?.role}</Text>
            </View>
          </View>
        </View>

        {/* Primary Delivery Address */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Icon name="map-pin" size={18} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Default Delivery Warehouse</Text>
            </View>
            <TouchableOpacity onPress={handleOpenEdit} activeOpacity={0.7}>
              <Text style={styles.editLink}>Edit Address</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressLine}>{customer?.address}</Text>
          <Text style={styles.addressLineSub}>
            {customer?.city}, {customer?.state} - {customer?.pincode}
          </Text>
          {isIndoreAddress(customer?.address, customer?.city) ? (
            <View style={styles.profileZoneBadgeLocal}>
              <Icon name="check-circle" size={13} color="#059669" />
              <Text style={styles.profileZoneTextLocal}>
                Indore Local Service Area (Standard Delivery)
              </Text>
            </View>
          ) : (
            <View style={styles.profileZoneBadgeOutside}>
              <Icon name="alert-triangle" size={13} color="#D97706" />
              <Text style={styles.profileZoneTextOutside}>
                Outside Indore (+₹{Config.outsideIndoreDeliveryCharge} Delivery Surcharge on Orders)
              </Text>
            </View>
          )}
        </View>

        {/* Enterprise Owner & Operations Hub Card */}
        <View style={styles.ownerInfoCard}>
          <View style={styles.ownerInfoTop}>
            <View style={styles.ownerAvatarBox}>
              <Text style={styles.ownerAvatarText}>SK</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.ownerHeaderRow}>
                <Text style={styles.ownerCardTitle}>Bharat Sponge Operations</Text>
                <View style={styles.ownerHubBadge}>
                  <Text style={styles.ownerHubBadgeText}>Indore, MP</Text>
                </View>
              </View>
              <Text style={styles.ownerNameText}>Owner: {Config.ownerName}</Text>
              <Text style={styles.ownerPhoneText}>Direct Contact: +91 {Config.ownerPhone}</Text>
            </View>
          </View>
          <View style={styles.ownerActionsRow}>
            <TouchableOpacity
              style={styles.ownerCallBtn}
              onPress={() => Linking.openURL(`tel:${Config.ownerPhone}`)}
              activeOpacity={0.8}>
              <Icon name="phone" size={14} color="#FFFFFF" />
              <Text style={styles.ownerCallBtnText}>Call Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ownerWhatsappBtn}
              onPress={() => Linking.openURL(`https://wa.me/${Config.whatsappNumber}`)}
              activeOpacity={0.8}>
              <Icon name="message-square" size={14} color="#FFFFFF" />
              <Text style={styles.ownerWhatsappBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Menu Actions */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleOpenEdit}
            activeOpacity={0.7}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FFEDD5' }]}>
              <Icon name="edit" size={18} color={Colors.light.primary} />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Edit Business Profile & Warehouse</Text>
              <Text style={styles.menuSubLabel}>Update delivery destination and contact info</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(tabs)/orders' as any)}
            activeOpacity={0.7}>
            <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Icon name="orders" size={18} color="#0284C7" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Bulk Orders & Invoices</Text>
              <Text style={styles.menuSubLabel}>Check order statuses and historical snapshots</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Wholesale Helpline & Owner Support',
                `Enterprise Owner: ${Config.ownerName}\nPhone: ${Config.supportPhone}\nOperations Hub: ${Config.locationHub}\nEmail: ${Config.supportEmail}\nWorking Hours: Mon-Sat, 9AM-8PM\n\nDelivery Scope:\n• Local Orders: Indore, MP\n• Outside Indore: +₹${Config.outsideIndoreDeliveryCharge} transport surcharge applies`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Call Owner',
                    onPress: () => Linking.openURL(`tel:${Config.ownerPhone}`),
                  },
                  {
                    text: 'WhatsApp',
                    onPress: () => Linking.openURL(`https://wa.me/${Config.whatsappNumber}`),
                  },
                ]
              )
            }
            activeOpacity={0.7}>
            <View style={[styles.menuIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Icon name="phone" size={18} color="#059669" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Factory Helpline & Owner Contact</Text>
              <Text style={styles.menuSubLabel}>Owner: {Config.ownerName} • {Config.supportPhone}</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'About Bharat Sponge B2B',
                `Bharat Sponge is an Indore (Madhya Pradesh) based premier industrial hardware & abrasive wholesaler, owned and managed by ${Config.ownerName}.\n\nWe manufacture and distribute premium abrasive sanding sponges, high-density polishing foam, heavy-duty industrial scourers, and rust preparation abrasives directly to hardware retail marts, fabricators, and contractors across Madhya Pradesh.`
              )
            }
            activeOpacity={0.7}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Icon name="info" size={18} color="#7C3AED" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>About Bharat Sponge (Indore)</Text>
              <Text style={styles.menuSubLabel}>Owner: {Config.ownerName} • Indore, MP Hub</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Wholesale Terms & Delivery Policy',
                `• Primary Service Area: Indore, Madhya Pradesh.\n• Local Delivery: Orders within Indore (MP) receive standard wholesale dispatch.\n• Outside Indore Delivery: For delivery addresses outside Indore, an additional transport surcharge of ₹${Config.outsideIndoreDeliveryCharge} applies.\n• Minimum order quantities (MOQ) strictly apply per SKU.\n• Strictly Offline Settlement: Cash on Delivery or Dynamic UPI QR scan upon receipt. No online gateway fee is charged.`
              )
            }
            activeOpacity={0.7}>
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="tag" size={18} color="#D97706" />
            </View>
            <View style={styles.menuTextCol}>
              <Text style={styles.menuLabel}>Delivery Terms & Indore Policy</Text>
              <Text style={styles.menuSubLabel}>Indore local delivery & outside surcharge terms</Text>
            </View>
            <Icon name="chevron-right" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}>
          <Icon name="log-out" size={18} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Sign Out of Wholesale Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Business Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Contact Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editForm.name}
                  onChangeText={(v) => setEditForm((p) => ({ ...p, name: v }))}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Business / Enterprise Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editForm.businessName}
                  onChangeText={(v) => setEditForm((p) => ({ ...p, businessName: v }))}
                />
              </View>

              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Warehouse Delivery Address</Text>
                <TextInput
                  style={[styles.modalInput, { minHeight: 60, textAlignVertical: 'top' }]}
                  multiline
                  value={editForm.address}
                  onChangeText={(v) => setEditForm((p) => ({ ...p, address: v }))}
                />
              </View>

              <View style={styles.modalRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalLabel}>City</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.city}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, city: v }))}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.modalLabel}>State</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.state}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, state: v }))}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.modalLabel}>Pincode</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.pincode}
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={(v) => setEditForm((p) => ({ ...p, pincode: v }))}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCancelBtn}
                disabled={saving}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={styles.modalSaveBtn}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  notAuthCard: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
    gap: 12,
  },
  notAuthIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  notAuthTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  notAuthText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  signInBtn: {
    marginTop: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.md,
    ...Shadows.primary,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.card,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  profileInfoCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  businessName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  codeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  codeBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  codeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.primaryDark,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  contactDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  detailValueRole: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.primary,
    flex: 1,
    textAlign: 'right',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  editLink: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.light.primary,
  },
  addressLine: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '600',
  },
  addressLineSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuSubLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 29, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalInputGroup: {
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  modalRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.primary,
    ...Shadows.primary,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileZoneBadgeLocal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  profileZoneTextLocal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  profileZoneBadgeOutside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  profileZoneTextOutside: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  ownerInfoCard: {
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFFBF5',
    elevation: 2,
  },
  ownerInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  ownerAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  ownerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  ownerCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  ownerHubBadge: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  ownerHubBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2410C',
  },
  ownerNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#C2410C',
    marginTop: 2,
  },
  ownerPhoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 1,
  },
  ownerActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
  },
  ownerCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  ownerCallBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  ownerWhatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#25D366',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  ownerWhatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

