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
import { getApiBaseUrl, setApiBaseUrl } from '@/services/api';
import { Icon } from '@/components/ui/Icon';

export default function LoginScreen() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('bharatsponge@gmail.com');
  const [password, setPassword] = useState('Bharat@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Advanced developer connection settings
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState(getApiBaseUrl());

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login({
        identifier: identifier.trim(),
        password,
      });
      router.replace('/(tabs)' as any);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials or server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setIdentifier('customer@bharatsponge.com');
      setPassword('Password@123');
    } else {
      setIdentifier('bharatsponge@gmail.com');
      setPassword('Bharat@123');
    }
    setError(null);
  };

  const handleSaveServerUrl = async () => {
    await setApiBaseUrl(customServerUrl);
    setShowServerConfig(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.brandLogoBox}>
              <Text style={styles.brandLogoText}>BS</Text>
            </View>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>BHARAT SPONGE B2B • INDORE (MP)</Text>
            </View>
            <Text style={styles.title}>Wholesale Portal</Text>
            <Text style={styles.subtitle}>
              B2B wholesale portal for hardware retailers & fabricators in Indore, MP. Managed by Shadab Khan (+91 83052 88431).
            </Text>
          </View>


          {error && (
            <View style={styles.errorBox}>
              <Icon name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registered Email or Phone</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. customer@bharatsponge.com or 9876543210"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={(text) => {
                    setIdentifier(text);
                    setError(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter account password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((p) => !p)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.88}
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Sign In to Wholesale Portal</Text>
                  <Icon name="arrow-right" size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Quick Fill Demo Credentials:</Text>
              <View style={styles.demoButtonsRow}>
                <TouchableOpacity
                  onPress={() => handleFillDemo('customer')}
                  style={styles.demoBtn}
                  activeOpacity={0.75}>
                  <Icon name="building" size={14} color={Colors.light.primary} />
                  <Text style={styles.demoBtnText}>Demo Dealer (Indore)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleFillDemo('admin')}
                  style={styles.demoBtn}
                  activeOpacity={0.75}>
                  <Icon name="shield-check" size={14} color="#059669" />
                  <Text style={styles.demoBtnText}>Owner (Shadab Khan)</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.demoHintsCard}>
                <Text style={styles.demoHintText}>
                  • <Text style={styles.demoHintBold}>Dealer (Indore):</Text> customer@bharatsponge.com / Password@123
                </Text>
                <Text style={styles.demoHintText}>
                  • <Text style={styles.demoHintBold}>Owner Admin (Shadab Khan):</Text> bharatsponge@gmail.com / Bharat@123
                </Text>
              </View>
            </View>

          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New wholesale buyer / contractor?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
              <Text style={styles.registerLink}>Register Dealer Account</Text>
            </TouchableOpacity>
          </View>

          {/* Developer Connection Settings Toggle */}
          <View style={styles.serverConfigContainer}>
            <TouchableOpacity
              onPress={() => setShowServerConfig((p) => !p)}
              style={styles.serverConfigToggle}>
              <Icon name="refresh" size={13} color="#64748B" />
              <Text style={styles.serverConfigToggleText}>
                {showServerConfig ? 'Hide Server URL Config' : 'Backend Connection: ' + customServerUrl}
              </Text>
            </TouchableOpacity>

            {showServerConfig && (
              <View style={styles.serverConfigCard}>
                <Text style={styles.serverConfigLabel}>Spring Boot REST API Endpoint:</Text>
                <TextInput
                  style={styles.serverConfigInput}
                  value={customServerUrl}
                  onChangeText={setCustomServerUrl}
                  placeholder="http://10.0.2.2:8080/api or http://localhost:8080/api"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={handleSaveServerUrl} style={styles.saveServerBtn}>
                  <Text style={styles.saveServerBtnText}>Apply API Endpoint</Text>
                </TouchableOpacity>
              </View>
            )}
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
    paddingTop: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandLogoBox: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FED7AA',
    marginBottom: 12,
    ...Shadows.primary,
  },
  brandLogoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandBadge: {
    backgroundColor: 'rgba(234, 88, 12, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.4)',
    marginBottom: 8,
  },
  brandBadgeText: {
    color: '#FDBA74',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: 310,
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
    width: '100%',
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
    padding: 22,
    width: '100%',
    ...Shadows.card,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: BorderRadius.md,
    marginTop: 6,
    ...Shadows.primary,
  },
  loginBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 8,
  },
  demoTitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoBtnText: {
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '700',
  },
  demoHintsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  demoHintText: {
    fontSize: 10.5,
    color: '#64748B',
    lineHeight: 15,
  },
  demoHintBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  registerLink: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  serverConfigContainer: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  serverConfigToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  serverConfigToggleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  serverConfigCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: BorderRadius.md,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  serverConfigLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  serverConfigInput: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    color: '#FFFFFF',
  },
  saveServerBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveServerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
