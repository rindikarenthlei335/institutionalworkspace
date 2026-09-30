import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import type { TenantConfig, MobileUserSession } from '../types';

interface HomeScreenProps {
  tenantConfig: TenantConfig;
  session: MobileUserSession;
  onNavigate: (tab: 'home' | 'results' | 'digitalId' | 'fees' | 'profile') => void;
}

export function HomeScreen({
  tenantConfig,
  session,
  onNavigate
}: HomeScreenProps) {
  const primaryColor = tenantConfig.branding.primaryColor || '#163A2B';
  const secondaryColor = tenantConfig.branding.secondaryColor || '#C9A84C';
  const modules = tenantConfig.entitlements.modulesEnabled;

  return (
    <ScrollView style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.headerBanner, { backgroundColor: primaryColor }]}>
        <View style={styles.headerTop}>
          <View style={styles.schoolInfo}>
            <Text style={styles.headerSchoolName}>{tenantConfig.tenant.name}</Text>
            <Text style={styles.headerCode}>Code: {tenantConfig.tenant.schoolCode}</Text>
          </View>
          <View style={[styles.miniCrest, { backgroundColor: secondaryColor }]}>
            <Text style={[styles.miniCrestText, { color: primaryColor }]}>
              {tenantConfig.branding.crestInitials}
            </Text>
          </View>
        </View>

        {/* Student ID Card Strip */}
        <View style={styles.studentStrip}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {session.name.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{session.name}</Text>
            <Text style={styles.studentMeta}>
              {session.role === 'staff' ? session.identifier : `${session.className} · ${session.identifier}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.digitalIdBadge}
            onPress={() => onNavigate('digitalId')}
          >
            <Text style={styles.digitalIdBadgeText}>🪪 View ID</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Action Grid */}
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Institutional Services</Text>

        <View style={styles.grid}>
          {/* 1. Exam Results */}
          {modules.exams && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onNavigate('results')}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Text style={styles.cardIcon}>📜</Text>
              </View>
              <Text style={styles.cardTitle}>Exam Results</Text>
              <Text style={styles.cardSub}>Term marksheets & rank</Text>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeText}>Rank #1 (94.2%)</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 2. Digital Identity Card */}
          {modules.digitalId && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onNavigate('digitalId')}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Text style={styles.cardIcon}>🪪</Text>
              </View>
              <Text style={styles.cardTitle}>Digital ID</Text>
              <Text style={styles.cardSub}>Gate pass & verification QR</Text>
              <View style={styles.badgeRow}>
                <Text style={[styles.badgeText, { color: '#2563EB', backgroundColor: '#DBEAFE' }]}>
                  Active · 2024–25
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 3. Fee Dues & Payments */}
          {modules.fees && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onNavigate('fees')}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Text style={styles.cardIcon}>💳</Text>
              </View>
              <Text style={styles.cardTitle}>School Fees</Text>
              <Text style={styles.cardSub}>Online dues & receipts</Text>
              <View style={styles.badgeRow}>
                <Text style={[styles.badgeText, { color: '#D97706', backgroundColor: '#FEF3C7' }]}>
                  Due: ₹ 12,400
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* 4. Notices & Bulletins */}
          {modules.notices && (
            <TouchableOpacity
              style={styles.card}
              onPress={() => onNavigate('profile')}
            >
              <View style={[styles.cardIconBox, { backgroundColor: '#FAF5FF' }]}>
                <Text style={styles.cardIcon}>📢</Text>
              </View>
              <Text style={styles.cardTitle}>Notices</Text>
              <Text style={styles.cardSub}>School announcements</Text>
              <View style={styles.badgeRow}>
                <Text style={[styles.badgeText, { color: '#7E22CE', backgroundColor: '#F3E8FF' }]}>
                  Sports Meet
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Institutional Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeTag}>OFFICIAL CIRCULAR · OCT 2026</Text>
          <Text style={styles.noticeTitle}>Winter Session Sports Meet 2026</Text>
          <Text style={styles.noticeBody}>
            Inter-house football, athletics, and cultural competitions begin on October 15. All day scholars and hostellers must report by 8:30 AM in house jerseys.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  headerBanner: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  schoolInfo: {
    flex: 1
  },
  headerSchoolName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  headerCode: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2
  },
  miniCrest: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  miniCrestText: {
    fontWeight: '900',
    fontSize: 15
  },
  studentStrip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarText: {
    color: '#163A2B',
    fontWeight: '800',
    fontSize: 14
  },
  studentDetails: {
    flex: 1
  },
  studentName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  studentMeta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 1
  },
  digitalIdBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  digitalIdBadgeText: {
    color: '#163A2B',
    fontSize: 10,
    fontWeight: '800'
  },
  body: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  cardIcon: {
    fontSize: 18
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A'
  },
  cardSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 8
  },
  badgeRow: {
    alignSelf: 'flex-start'
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  noticeTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 4
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6
  },
  noticeBody: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16
  }
});
