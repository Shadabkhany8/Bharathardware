import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, TextInput } from '@/components/common/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Icon } from '@/components/ui/Icon';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleRegister = async () => {
    if (!form.name.trim()) return setError('Please enter your contact name');
    if (!form.businessName.trim()) return setError('Please enter your hardware business name');
    if (!/^[0-9]{10}$/.test(form.phone.trim())) return setError('Please enter a valid 10-digit phone number');
    if (!form.email.trim() || !form.email.includes('@')) return setError('Please enter a valid email address');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (!form.address.trim()) return setError('Please enter your warehouse/shop delivery address');
    if (!form.city.trim()) return setError('Please enter city');
    if (!form.state.trim()) return setError('Please enter state');
    if (!/^[0-9]{6}$/.test(form.pincode.trim())) return setError('Please enter a valid 6-digit pincode');

    setLoading(true);
    setError(null);
    try {
      await register({
        name: form.name.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
      });
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check form values.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <Icon name="arrow-left" size={18} color="#FFFFFF" />
              <Text style={styles.backBtnText}>Back to Login</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Register Wholesale Account</Text>
            <Text style={styles.subtitle}>
              Bharat Sponge operates from Indore, MP supplying hardware retailers, workshops, and fabricators in bulk.
            </Text>
          </View>


          {error && (
            <View style={styles.errorBox}>
              <Icon name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formCard}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>1</Text>
              </View>
              <Text style={styles.sectionHeader}>Business & Contact Credentials</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business / Enterprise Name *</Text>
              <View style={styles.inputWrapper}>
                <Icon name="building" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Agarwal Hardware Traders"
                  placeholderTextColor="#94A3B8"
                  value={form.businessName}
                  onChangeText={(v) => updateField('businessName', v)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Person Name *</Text>
              <View style={styles.inputWrapper}>
                <Icon name="profile" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Rahul Agarwal"
                  placeholderTextColor="#94A3B8"
                  value={form.name}
                  onChangeText={(v) => updateField('name', v)}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.halfGroup]}>
                <Text style={styles.label}>10-Digit Mobile *</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="phone" size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="9876543210"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={form.phone}
                    onChangeText={(v) => updateField('phone', v)}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.halfGroup]}>
                <Text style={styles.label}>Business Email *</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="mail" size={16} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="rahul@domain.com"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form.email}
                    onChangeText={(v) => updateField('email', v)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Set Account Password *</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(v) => updateField('password', v)}
                />
              </View>
            </View>

            <View style={[styles.sectionTitleRow, { marginTop: 12 }]}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>2</Text>
              </View>
              <Text style={styles.sectionHeader}>Primary Delivery Warehouse</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delivery Warehouse / Shop Address *</Text>
              <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 10 }]}>
                <Icon name="map-pin" size={18} color="#94A3B8" />
                <TextInput
                  style={[styles.input, { minHeight: 50, textAlignVertical: 'top' }]}
                  placeholder="Shop/Godown No., Street, Landmark"
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={form.address}
                  onChangeText={(v) => updateField('address', v)}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>City *</Text>
                <TextInput
                  style={styles.flatInput}
                  placeholder="e.g. Indore"
                  placeholderTextColor="#94A3B8"
                  value={form.city}
                  onChangeText={(v) => updateField('city', v)}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 6 }]}>
                <Text style={styles.label}>State *</Text>
                <TextInput
                  style={styles.flatInput}
                  placeholder="e.g. Madhya Pradesh"
                  placeholderTextColor="#94A3B8"
                  value={form.state}
                  onChangeText={(v) => updateField('state', v)}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 0.9 }]}>
                <Text style={styles.label}>Pincode *</Text>
                <TextInput
                  style={styles.flatInput}
                  placeholder="452001"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={form.pincode}
                  onChangeText={(v) => updateField('pincode', v)}
                />
              </View>
            </View>

            <View style={styles.registerHintBox}>
              <Icon name="info" size={14} color="#059669" />
              <Text style={styles.registerHintText}>
                Primary warehouse is in Indore, MP. Local Indore orders qualify for free delivery; outside addresses incur an additional delivery charge.
              </Text>
            </View>


            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.88}
              style={[styles.registerBtn, loading && styles.btnDisabled]}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.registerBtnText}>Create Verified Dealer Account</Text>
                  <Icon name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 18,
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
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: 20,
    ...Shadows.card,
    gap: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  sectionBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfGroup: {
    flex: 1,
  },
  flatInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: BorderRadius.md,
    marginTop: 10,
    ...Shadows.primary,
  },
  btnDisabled: {
    backgroundColor: '#94A3B8',
  },
  registerBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  registerHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: BorderRadius.md,
    padding: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  registerHintText: {
    flex: 1,
    fontSize: 11,
    color: '#15803D',
    lineHeight: 15,
    fontWeight: '600',
  },
});

