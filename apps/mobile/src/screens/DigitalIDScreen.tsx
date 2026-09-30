import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import type { TenantConfig, MobileUserSession } from '../types';

interface DigitalIDScreenProps {
  tenantConfig: TenantConfig;
  session: MobileUserSession;
  onBack: () => void;
  language?: 'en' | 'lus';
}

export function DigitalIDScreen({
  tenantConfig,
  session,
  onBack,
  language = 'en'
}: DigitalIDScreenProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const primaryColor = tenantConfig.branding.primaryColor || '#163A2B';
  const secondaryColor = tenantConfig.branding.secondaryColor || '#C9A84C';

  const t = {
    title: language === 'lus' ? 'Zirlai ID Card' : 'Digital Student ID',
    flipToBack: language === 'lus' ? '🔄 Hnunglam En rawh' : '🔄 Flip to Back',
    flipToFront: language === 'lus' ? '🔄 Hma lam En rawh' : '🔄 Flip to Front',
    studentId: language === 'lus' ? 'Zirlai No' : 'Admission No',
    class: language === 'lus' ? 'Pawl' : 'Class & Sec',
    rollNo: language === 'lus' ? 'Roll No' : 'Roll No',
    bloodGroup: language === 'lus' ? 'Thisen Group' : 'Blood Group',
    emergency: language === 'lus' ? 'Hmanhmawh Biakna' : 'Emergency Contact',
    validUntil: language === 'lus' ? 'Hman theih hun' : 'Valid Thru',
    offlineStatus: language === 'lus' ? '🟢 Offline-ah pawh a tlang' : '🟢 Verified Offline · Signed Token',
    instructions: language === 'lus'
      ? 'He card hi Mount Carmel School ta a ni. Chhar chuan office-ah thehlut rawh.'
      : 'This card remains the property of the school. If found, please return to the school administration office.',
    saveWallet: language === 'lus' ? 'Apple / Google Wallet-ah dah rawh' : 'Add to Apple / Google Wallet',
    verifyNotice: language === 'lus' ? 'Gate-ah QR scan theih a ni' : 'Scan QR at security gate for instant check'
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Navigation Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← {language === 'lus' ? 'Let leh' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenHeading}>{t.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Verification / Offline Pill */}
      <View style={styles.statusPillContainer}>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{t.offlineStatus}</Text>
        </View>
      </View>

      {/* CR80 ID Card Container */}
      <View style={styles.cardWrapper}>
        {!isFlipped ? (
          /* FRONT SIDE */
          <View style={[styles.card, { borderColor: primaryColor }]}>
            {/* Header bar */}
            <View style={[styles.cardHeader, { backgroundColor: primaryColor }]}>
              <View style={[styles.crestCircle, { backgroundColor: secondaryColor }]}>
                <Text style={[styles.crestText, { color: primaryColor }]}>
                  {tenantConfig.branding.crestInitials}
                </Text>
              </View>
              <View style={styles.headerTitles}>
                <Text style={styles.schoolHeaderTitle} numberOfLines={1}>
                  {tenantConfig.tenant.name}
                </Text>
                <Text style={styles.schoolHeaderSub}>
                  Affiliated to MBSE · Code: {tenantConfig.tenant.schoolCode}
                </Text>
              </View>
            </View>

            {/* Gold Divider Ribbon */}
            <View style={[styles.goldRibbon, { backgroundColor: secondaryColor }]} />

            {/* Body */}
            <View style={styles.cardBody}>
              {/* Photo Box */}
              <View style={styles.photoContainer}>
                <View style={[styles.photoBox, { borderColor: secondaryColor }]}>
                  <Text style={[styles.photoInitials, { color: primaryColor }]}>
                    {session.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </Text>
                  <View style={styles.photoOverlay}>
                    <Text style={styles.photoOverlayText}>VERIFIED</Text>
                  </View>
                </View>
                <View style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{session.role.toUpperCase()}</Text>
                </View>
              </View>

              {/* Student Metadata */}
              <View style={styles.metaContainer}>
                <Text style={styles.fullName}>{session.name}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{t.studentId}:</Text>
                  <Text style={styles.metaValue}>{session.identifier}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{t.class}:</Text>
                  <Text style={styles.metaValue}>{session.className || 'Class 10-A'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{t.bloodGroup}:</Text>
                  <Text style={styles.metaValue}>O+ (Positive)</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{t.emergency}:</Text>
                  <Text style={styles.metaValue}>+91 98623 54321</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{t.validUntil}:</Text>
                  <Text style={[styles.metaValue, { fontWeight: '700', color: primaryColor }]}>
                    31 March 2025
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Bar */}
            <View style={styles.cardFooter}>
              <Text style={styles.barcodePlaceholder}>||| | ||||| |||| ||| |||| | ||| ||||||| |</Text>
              <Text style={styles.cardSerial}>ID: 2024-{session.identifier}</Text>
            </View>
          </View>
        ) : (
          /* BACK SIDE */
          <View style={[styles.card, { borderColor: primaryColor }]}>
            {/* Magnetic Stripe / Tech Stripe */}
            <View style={styles.magneticStripe} />

            <View style={styles.backBody}>
              <View style={styles.backHeader}>
                <Text style={[styles.backSchoolName, { color: primaryColor }]}>
                  {tenantConfig.tenant.name}
                </Text>
                <Text style={styles.backAddress}>
                  Mission Veng, Aizawl, Mizoram - 796001 · Phone: 0389-2322123
                </Text>
              </View>

              {/* QR Code Container */}
              <View style={styles.qrSection}>
                <View style={styles.qrBox}>
                  {/* Simulated QR Pattern */}
                  <View style={styles.qrGrid}>
                    <View style={styles.qrCornerBlock} />
                    <View style={styles.qrDot} />
                    <View style={styles.qrCornerBlock} />
                    <View style={styles.qrDot} />
                    <View style={styles.qrCenterLogo}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: primaryColor }}>MC</Text>
                    </View>
                    <View style={styles.qrDot} />
                    <View style={styles.qrCornerBlock} />
                    <View style={styles.qrDot} />
                    <View style={styles.qrDot} />
                  </View>
                </View>
                <View style={styles.qrMeta}>
                  <Text style={styles.qrTitle}>OFFICIAL VERIFICATION</Text>
                  <Text style={styles.qrSub}>{t.verifyNotice}</Text>
                  <Text style={styles.qrUrl}>
                    eduportal.in/verify/id/{session.identifier.toLowerCase()}
                  </Text>
                </View>
              </View>

              {/* Instructions & Signature */}
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>{t.instructions}</Text>
              </View>

              <View style={styles.signatureRow}>
                <View style={styles.sigBox}>
                  <Text style={styles.sigScript}>C. Lalremruata</Text>
                  <View style={styles.sigLine} />
                  <Text style={styles.sigTitle}>Principal / Headmaster</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Flip Button */}
      <TouchableOpacity
        style={[styles.flipButton, { backgroundColor: primaryColor }]}
        onPress={() => setIsFlipped(!isFlipped)}
      >
        <Text style={styles.flipButtonText}>
          {!isFlipped ? t.flipToBack : t.flipToFront}
        </Text>
      </TouchableOpacity>

      {/* Wallet Action Button */}
      <TouchableOpacity style={styles.walletButton}>
        <Text style={styles.walletButtonText}> {t.saveWallet}</Text>
      </TouchableOpacity>

      {/* Privacy note */}
      <Text style={styles.legalNote}>
        Compliant with school board photo identity regulations & student minor privacy guidelines.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    padding: 16,
    alignItems: 'center'
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155'
  },
  screenHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A'
  },
  statusPillContainer: {
    marginBottom: 16
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86EFAC'
  },
  statusPillText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '600'
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: 1.586, // Standard CR80 ratio
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  crestCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  crestText: {
    fontSize: 15,
    fontWeight: '800'
  },
  headerTitles: {
    flex: 1
  },
  schoolHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  schoolHeaderSub: {
    color: '#E2E8F0',
    fontSize: 9.5
  },
  goldRibbon: {
    height: 3,
    width: '100%'
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center'
  },
  photoContainer: {
    alignItems: 'center',
    marginRight: 14
  },
  photoBox: {
    width: 86,
    height: 104,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  photoInitials: {
    fontSize: 28,
    fontWeight: '800'
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 2,
    alignItems: 'center'
  },
  photoOverlayText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1
  },
  roleTag: {
    marginTop: 4,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569'
  },
  metaContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  fullName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    width: 95
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  barcodePlaceholder: {
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 2,
    color: '#334155'
  },
  cardSerial: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B'
  },
  // Back card styles
  magneticStripe: {
    height: 28,
    backgroundColor: '#1E293B',
    width: '100%'
  },
  backBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },
  backHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4
  },
  backSchoolName: {
    fontSize: 12,
    fontWeight: '700'
  },
  backAddress: {
    fontSize: 9,
    color: '#64748B'
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  qrBox: {
    width: 66,
    height: 66,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  qrGrid: {
    width: 54,
    height: 54,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 2
  },
  qrCornerBlock: {
    width: 14,
    height: 14,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  qrDot: {
    width: 6,
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 1
  },
  qrCenterLogo: {
    width: 16,
    height: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  qrMeta: {
    flex: 1
  },
  qrTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A'
  },
  qrSub: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1
  },
  qrUrl: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    color: '#2563EB',
    marginTop: 2
  },
  instructionsContainer: {
    backgroundColor: '#F8FAFC',
    padding: 4,
    borderRadius: 4
  },
  instructionsText: {
    fontSize: 8.5,
    color: '#64748B',
    lineHeight: 11
  },
  signatureRow: {
    alignItems: 'flex-end',
    marginTop: 2
  },
  sigBox: {
    alignItems: 'center',
    width: 120
  },
  sigScript: {
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 11,
    color: '#1E293B'
  },
  sigLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#94A3B8',
    marginVertical: 1
  },
  sigTitle: {
    fontSize: 8,
    fontWeight: '600',
    color: '#64748B'
  },
  flipButton: {
    width: '100%',
    maxWidth: 380,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  walletButton: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16
  },
  walletButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  legalNote: {
    fontSize: 10.5,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 340
  }
});
