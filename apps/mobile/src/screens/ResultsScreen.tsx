import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import type { TenantConfig, MobileUserSession } from '../types';

interface ResultsScreenProps {
  tenantConfig: TenantConfig;
  session: MobileUserSession;
  onBack: () => void;
}

export function ResultsScreen({
  tenantConfig,
  session,
  onBack
}: ResultsScreenProps) {
  const primaryColor = tenantConfig.branding.primaryColor || '#163A2B';

  const subjects = [
    { code: 'ENG-10', name: 'English Literature', max: 100, score: 94, grade: 'A1' },
    { code: 'MIZ-10', name: 'Mizo Vernacular', max: 100, score: 96, grade: 'A1' },
    { code: 'MTH-10', name: 'Mathematics', max: 100, score: 98, grade: 'A1' },
    { code: 'SCI-10', name: 'Integrated Science', max: 100, score: 92, grade: 'A1' },
    { code: 'SOC-10', name: 'Social Studies', max: 100, score: 90, grade: 'A2' },
    { code: 'CSC-10', name: 'Computer Applications', max: 100, score: 95, grade: 'A1' },
    { code: 'PED-10', name: 'Physical Education', max: 50, score: 48, grade: 'A' }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Examination Marksheet</Text>
        <Text style={styles.headerSubtitle}>Half-Yearly Examination (2024–2025)</Text>
      </View>

      <View style={styles.body}>
        {/* Student Merit Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.studentName}>{session.name}</Text>
              <Text style={styles.studentId}>{session.identifier} · {session.className}</Text>
            </View>
            <View style={styles.rankPill}>
              <Text style={styles.rankText}>Rank #1</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>565 / 600</Text>
              <Text style={styles.metricLabel}>TOTAL SCORE</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>94.2%</Text>
              <Text style={styles.metricLabel}>PERCENTAGE</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: '#059669' }]}>Grade A1</Text>
              <Text style={styles.metricLabel}>OVERALL</Text>
            </View>
          </View>

          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>Verification Token:</Text>
            <Text style={styles.tokenText}>MS-MC-2024-X-001-A1B9C8D7</Text>
          </View>
        </View>

        {/* Subject-Wise Assessment Table */}
        <Text style={styles.sectionHeader}>Subject-Wise Assessment</Text>
        <View style={styles.tableCard}>
          {subjects.map((sub, idx) => (
            <View
              key={sub.code}
              style={[
                styles.tableRow,
                idx === subjects.length - 1 && styles.tableRowLast
              ]}
            >
              <View style={styles.subInfo}>
                <Text style={styles.subName}>{sub.name}</Text>
                <Text style={styles.subCode}>{sub.code} · Max: {sub.max}</Text>
              </View>
              <View style={styles.subScoreBox}>
                <Text style={styles.subScore}>{sub.score}</Text>
                <View style={styles.gradeBadge}>
                  <Text style={styles.gradeText}>{sub.grade}</Text>
                </View>
              </View>
            </View>
          ))}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  backBtn: {
    marginBottom: 8
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2
  },
  body: {
    padding: 20
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A'
  },
  studentId: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  rankPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  rankText: {
    color: '#92400E',
    fontWeight: '800',
    fontSize: 11
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 12
  },
  metricItem: {
    flex: 1,
    alignItems: 'center'
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0'
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  tokenBox: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tokenLabel: {
    fontSize: 10,
    color: '#64748B'
  },
  tokenText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#0F172A'
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    marginBottom: 10
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  tableRowLast: {
    borderBottomWidth: 0
  },
  subInfo: {
    flex: 1
  },
  subName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A'
  },
  subCode: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1
  },
  subScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  subScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  gradeBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  gradeText: {
    color: '#065F46',
    fontWeight: '800',
    fontSize: 10
  }
});
