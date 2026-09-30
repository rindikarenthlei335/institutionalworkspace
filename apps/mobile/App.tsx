import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar
} from 'react-native';
import { useTenantConfig, DEFAULT_MOUNT_CARMEL_CONFIG } from './src/hooks/useTenantConfig';
import type { MobileUserSession } from './src/types';
import { FindSchoolScreen } from './src/screens/FindSchoolScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { DigitalIDScreen } from './src/screens/DigitalIDScreen';
import { FeesScreen } from './src/screens/FeesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ForceUpdateModal } from './src/screens/ForceUpdateModal';

export type AppTab = 'home' | 'results' | 'digitalId' | 'fees' | 'profile';

const DEMO_STUDENT_SESSION: MobileUserSession = {
  userId: 'usr-student-01',
  role: 'student',
  name: 'David Lalrinsanga',
  identifier: 'ADM-2024-001',
  className: 'Class 10-A',
  token: 'jwt-auth-session-token-demo'
};

export default function App() {
  const [tenantSlug, setTenantSlug] = useState<string | null>('mountcarmel');
  const [session, setSession] = useState<MobileUserSession | null>(DEMO_STUDENT_SESSION);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [language, setLanguage] = useState<'en' | 'lus'>('en');

  const { config, isModuleEnabled } = useTenantConfig(tenantSlug || 'mountcarmel');
  const primaryColor = config.branding.primaryColor || '#163A2B';

  // 1. Force update check (blocks entire app if client < minSupportedVersion)
  if (config.appVersioning.forceUpdate) {
    return (
      <ForceUpdateModal
        versioning={config.appVersioning}
        primaryColor={primaryColor}
        language={language}
      />
    );
  }

  // 2. School selector if tenant not set
  if (!tenantSlug) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" />
        <FindSchoolScreen
          onSelectSchool={(slug) => setTenantSlug(slug)}
        />
      </SafeAreaView>
    );
  }

  // 3. Login screen if user session not active
  if (!session) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" />
        <LoginScreen
          tenantConfig={config}
          onLoginSuccess={(newSession) => setSession(newSession)}
          onBackToFinder={() => setTenantSlug(null)}
        />
      </SafeAreaView>
    );
  }

  // 4. Main Tab Navigation & Screens
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Screen Render */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            tenantConfig={config}
            session={session}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'results' && isModuleEnabled('exams') && (
          <ResultsScreen
            tenantConfig={config}
            session={session}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'digitalId' && isModuleEnabled('digitalId') && (
          <DigitalIDScreen
            tenantConfig={config}
            session={session}
            onBack={() => setActiveTab('home')}
            language={language}
          />
        )}

        {activeTab === 'fees' && isModuleEnabled('fees') && (
          <FeesScreen
            tenantConfig={config}
            session={session}
            onBack={() => setActiveTab('home')}
            language={language}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            tenantConfig={config}
            session={session}
            onLogout={() => setSession(null)}
            language={language}
            onLanguageChange={setLanguage}
          />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && { color: primaryColor }]}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && { color: primaryColor, fontWeight: '700' }]}>
            {language === 'lus' ? 'Inpui' : 'Home'}
          </Text>
        </TouchableOpacity>

        {isModuleEnabled('exams') && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('results')}
          >
            <Text style={[styles.tabIcon, activeTab === 'results' && { color: primaryColor }]}>📜</Text>
            <Text style={[styles.tabLabel, activeTab === 'results' && { color: primaryColor, fontWeight: '700' }]}>
              {language === 'lus' ? 'Result' : 'Results'}
            </Text>
          </TouchableOpacity>
        )}

        {isModuleEnabled('digitalId') && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('digitalId')}
          >
            <Text style={[styles.tabIcon, activeTab === 'digitalId' && { color: primaryColor }]}>🪪</Text>
            <Text style={[styles.tabLabel, activeTab === 'digitalId' && { color: primaryColor, fontWeight: '700' }]}>
              {language === 'lus' ? 'ID Card' : 'Digital ID'}
            </Text>
          </TouchableOpacity>
        )}

        {isModuleEnabled('fees') && (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('fees')}
          >
            <Text style={[styles.tabIcon, activeTab === 'fees' && { color: primaryColor }]}>💳</Text>
            <Text style={[styles.tabLabel, activeTab === 'fees' && { color: primaryColor, fontWeight: '700' }]}>
              {language === 'lus' ? 'Fee' : 'Fees'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
        >
          <Text style={[styles.tabIcon, activeTab === 'profile' && { color: primaryColor }]}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && { color: primaryColor, fontWeight: '700' }]}>
            {language === 'lus' ? 'Profile' : 'Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  screenContainer: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2
  },
  tabLabel: {
    fontSize: 10,
    color: '#64748B'
  }
});
