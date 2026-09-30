import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import type { TenantConfig, MobileUserSession, UserRole } from '../types';

interface LoginScreenProps {
  tenantConfig: TenantConfig;
  onLoginSuccess: (session: MobileUserSession) => void;
  onBackToFinder: () => void;
}

export function LoginScreen({
  tenantConfig,
  onLoginSuccess,
  onBackToFinder
}: LoginScreenProps) {
  const [role, setRole] = useState<UserRole>('parent');
  const [username, setUsername] = useState<string>('parent.demo@mountcarmel.edu.in');
  const [password, setPassword] = useState<string>('DemoParent2025!');
  const [loading, setLoading] = useState<boolean>(false);

  const primaryColor = tenantConfig.branding.primaryColor || '#163A2B';

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        userId: 'demo-user-101',
        role,
        name: role === 'staff' ? 'Rev. Dr. Lalthansanga' : 'Lalrintluanga Sailo',
        identifier: role === 'staff' ? 'EMP-MC-001' : 'ADM-2024-0012',
        className: 'Class X-A',
        token: 'mobile-jwt-token-12345'
      });
    }, 500);
  };

  const handleReviewerAutofill = () => {
    setRole('parent');
    setUsername(tenantConfig.reviewerDemoAccount?.username || 'apple.reviewer@mountcarmel.edu.in');
    setPassword(tenantConfig.reviewerDemoAccount?.passwordHint || 'ReviewerDemo2025!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Back Link */}
        <TouchableOpacity style={styles.backBtn} onPress={onBackToFinder}>
          <Text style={styles.backText}>← Change School</Text>
        </TouchableOpacity>

        {/* School Header */}
        <View style={styles.header}>
          <View style={[styles.crest, { backgroundColor: primaryColor }]}>
            <Text style={styles.crestText}>{tenantConfig.branding.crestInitials}</Text>
          </View>
          <Text style={styles.schoolName}>{tenantConfig.tenant.name}</Text>
          <Text style={styles.tagline}>{tenantConfig.tenant.schoolCode} · Portal Login</Text>
        </View>

        {/* Role Tabs */}
        <View style={styles.roleTabs}>
          {(['parent', 'student', 'staff'] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleTab,
                role === r && { backgroundColor: primaryColor }
              ]}
              onPress={() => setRole(r)}
            >
              <Text
                style={[
                  styles.roleTabText,
                  role === r && styles.roleTabTextActive
                ]}
              >
                {r.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {role === 'staff' ? 'Official Email / Employee ID' : 'Parent Mobile / Admission No'}
          </Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password / PIN</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: primaryColor }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginBtnText}>Sign In to Portal</Text>
          )}
        </TouchableOpacity>

        {/* App Reviewer Demo Account (Mandatory for Store Review) */}
        {tenantConfig.reviewerDemoAccount?.isAvailable && (
          <TouchableOpacity
            style={styles.reviewerBtn}
            onPress={handleReviewerAutofill}
          >
            <Text style={styles.reviewerBtnText}>
              🛡️ App Reviewer Demo Account (1-Tap Fill)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5
  },
  backBtn: {
    marginBottom: 12
  },
  backText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  crest: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  crestText: {
    color: '#C9A84C',
    fontSize: 20,
    fontWeight: '900'
  },
  schoolName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  tagline: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16
  },
  roleTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  roleTabText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B'
  },
  roleTabTextActive: {
    color: '#FFFFFF'
  },
  inputGroup: {
    marginBottom: 14
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC'
  },
  loginBtn: {
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  reviewerBtn: {
    marginTop: 14,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center'
  },
  reviewerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46'
  }
});
