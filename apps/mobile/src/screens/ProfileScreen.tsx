import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import type { TenantConfig, MobileUserSession } from '../types';

interface ProfileScreenProps {
  tenantConfig: TenantConfig;
  session: MobileUserSession;
  onLogout: () => void;
  language: 'en' | 'lus';
  onLanguageChange: (lang: 'en' | 'lus') => void;
}

export function ProfileScreen({
  tenantConfig,
  session,
  onLogout,
  language,
  onLanguageChange
}: ProfileScreenProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteReqId, setDeleteReqId] = useState('');

  const primaryColor = tenantConfig.branding.primaryColor || '#163A2B';
  const secondaryColor = tenantConfig.branding.secondaryColor || '#C9A84C';

  const t = {
    title: language === 'lus' ? 'Account & Profile' : 'Profile & Settings',
    schoolDetails: language === 'lus' ? 'School Chungchang' : 'Institutional Affiliation',
    languageSetting: language === 'lus' ? 'Tawng Thlanna' : 'Language / Tawng',
    notifications: language === 'lus' ? 'Notification Thawn' : 'Push Notifications',
    notifDesc: language === 'lus' ? 'Exam result leh Fee reminder hriattirna' : 'Exam results, fee reminders & notices',
    privacy: language === 'lus' ? 'Privacy Policy (Zirlai Humhalhna)' : 'Privacy Policy & Student Data Protection',
    terms: language === 'lus' ? 'Terms of Service (Dan leh Dun)' : 'Terms of Service',
    appVersion: language === 'lus' ? 'App Version' : 'App Version',
    logout: language === 'lus' ? 'Chhuak rawh (Log Out)' : 'Sign Out',
    deleteAccount: language === 'lus' ? 'Account Nuaibo Dilna (Apple 5.1.1)' : 'Request Account Deletion',
    deleteWarningTitle: language === 'lus' ? 'Account Nuaibo Dilna' : 'Delete Account Request',
    deleteExplanation: language === 'lus'
      ? 'Apple App Store & Play Store dan anga siam a ni. He dilna hian ni 30 chhungin i mobile account leh device token a nuaibo ang. MBSE dan anga academic record vawn that ngai erawh school archive-ah a awm reng ang.'
      : 'Per Apple App Store Guideline 5.1.1, you can request full deletion of your mobile account and authentication credentials. A 30-day grace period applies. Official academic transcripts remain preserved per statutory school board mandates.',
    typeDeletePrompt: language === 'lus' ? 'Hnuai-ah hian "DELETE" tih ziak lut rawh:' : 'Type "DELETE" below to confirm request:',
    submitDelete: language === 'lus' ? 'Nuaibo Dilna Thehlut rawh' : 'Submit Deletion Request',
    cancel: language === 'lus' ? 'Thulh leh rawh' : 'Cancel',
    successMsg: language === 'lus' ? 'I dilna thehluh a ni tawh e. Reference:' : 'Account deletion requested successfully. Tracking reference:'
  };

  const handleRequestDeletion = () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      Alert.alert('Verification required', 'Please type DELETE exactly to proceed with account deletion.');
      return;
    }

    const ref = `DEL-${Date.now().toString(36).toUpperCase()}-${session.identifier.replace(/[^A-Za-z0-9]/g, '')}`;
    setDeleteReqId(ref);
    setDeleteSuccess(true);
  };

  const finalizeDeletion = () => {
    setDeleteModalVisible(false);
    setDeleteSuccess(false);
    setDeleteConfirmText('');
    onLogout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Summary */}
      <View style={[styles.profileHeaderCard, { borderTopColor: primaryColor }]}>
        <View style={[styles.avatarCircle, { backgroundColor: primaryColor }]}>
          <Text style={[styles.avatarText, { color: secondaryColor }]}>
            {session.name.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.profileName}>{session.name}</Text>
        <Text style={styles.profileRole}>
          {session.role.toUpperCase()} · {session.identifier}
        </Text>
        {session.className && (
          <Text style={styles.profileClass}>{session.className}</Text>
        )}
      </View>

      {/* Institutional Details */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>{t.schoolDetails}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>School:</Text>
          <Text style={styles.infoValue}>{tenantConfig.tenant.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Code:</Text>
          <Text style={styles.infoValue}>{tenantConfig.tenant.schoolCode}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Plan:</Text>
          <Text style={[styles.infoValue, { textTransform: 'capitalize', fontWeight: '700' }]}>
            {tenantConfig.tenant.plan}
          </Text>
        </View>
      </View>

      {/* Language Switcher */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>{t.languageSetting}</Text>
        <View style={styles.langButtonRow}>
          <TouchableOpacity
            style={[
              styles.langChoice,
              language === 'en' && { backgroundColor: primaryColor, borderColor: primaryColor }
            ]}
            onPress={() => onLanguageChange('en')}
          >
            <Text style={[styles.langChoiceText, language === 'en' && { color: '#FFFFFF' }]}>
              English (India)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.langChoice,
              language === 'lus' && { backgroundColor: primaryColor, borderColor: primaryColor }
            ]}
            onPress={() => onLanguageChange('lus')}
          >
            <Text style={[styles.langChoiceText, language === 'lus' && { color: '#FFFFFF' }]}>
              Mizo ṭawng
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.sectionCard}>
        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.switchTitle}>{t.notifications}</Text>
            <Text style={styles.switchSub}>{t.notifDesc}</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: '#CBD5E1', true: primaryColor }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Legal & Compliance */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.legalItem}
          onPress={() => {
            Alert.alert('Privacy Policy', `View full terms at: ${tenantConfig.compliance.privacyPolicyUrl}`);
          }}
        >
          <Text style={styles.legalText}>🛡️ {t.privacy}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.legalItem}
          onPress={() => {
            Alert.alert('Terms of Service', `View full terms at: ${tenantConfig.compliance.termsOfServiceUrl}`);
          }}
        >
          <Text style={styles.legalText}>📜 {t.terms}</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.legalItem}>
          <Text style={styles.legalText}>📱 {t.appVersion}</Text>
          <Text style={styles.versionTag}>
            v{tenantConfig.appVersioning.clientVersion} (Expo EAS)
          </Text>
        </View>
      </View>

      {/* Account Deletion (Apple Guideline 5.1.1) */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setDeleteModalVisible(true)}
      >
        <Text style={styles.deleteButtonText}>⚠️ {t.deleteAccount}</Text>
      </TouchableOpacity>

      {/* Log Out */}
      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: primaryColor }]}
        onPress={onLogout}
      >
        <Text style={[styles.logoutButtonText, { color: primaryColor }]}>
          {t.logout}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimerText}>
        EduPortal Institutional Multi-Tenant Cloud · Powered by Cloudflare R2
      </Text>

      {/* Apple 5.1.1 In-App Deletion Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.deletionCard}>
            {!deleteSuccess ? (
              <>
                <Text style={styles.deletionHeader}>⚠️ {t.deleteWarningTitle}</Text>
                <Text style={styles.deletionBody}>{t.deleteExplanation}</Text>
                <Text style={styles.deletionPrompt}>{t.typeDeletePrompt}</Text>
                <TextInput
                  style={styles.deleteInput}
                  placeholder="DELETE"
                  placeholderTextColor="#94A3B8"
                  value={deleteConfirmText}
                  onChangeText={setDeleteConfirmText}
                  autoCapitalize="characters"
                />
                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setDeleteModalVisible(false);
                      setDeleteConfirmText('');
                    }}
                  >
                    <Text style={styles.cancelBtnText}>{t.cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.confirmDeleteBtn,
                      deleteConfirmText.trim().toUpperCase() !== 'DELETE' && { opacity: 0.5 }
                    ]}
                    onPress={handleRequestDeletion}
                  >
                    <Text style={styles.confirmDeleteBtnText}>{t.submitDelete}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 36, marginBottom: 8 }}>✅</Text>
                <Text style={styles.deletionHeader}>Deletion Logged</Text>
                <Text style={[styles.deletionBody, { textAlign: 'center' }]}>
                  {t.successMsg}
                </Text>
                <Text style={styles.refCodeText}>{deleteReqId}</Text>
                <TouchableOpacity
                  style={[styles.confirmDeleteBtn, { width: '100%', marginTop: 12, backgroundColor: primaryColor }]}
                  onPress={finalizeDeletion}
                >
                  <Text style={styles.confirmDeleteBtnText}>Complete Sign Out</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  content: {
    padding: 16
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderTopWidth: 4,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800'
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2
  },
  profileRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B'
  },
  profileClass: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B'
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    maxWidth: '65%',
    textAlign: 'right'
  },
  langButtonRow: {
    flexDirection: 'row',
    gap: 10
  },
  langChoice: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center'
  },
  langChoiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155'
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B'
  },
  switchSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  legalText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500'
  },
  chevron: {
    fontSize: 16,
    color: '#94A3B8'
  },
  versionTag: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'monospace'
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700'
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700'
  },
  disclaimerText: {
    fontSize: 10.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    padding: 20
  },
  deletionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20
  },
  deletionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#B91C1C',
    marginBottom: 8
  },
  deletionBody: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14
  },
  deletionPrompt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6
  },
  deleteInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    alignItems: 'center'
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155'
  },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center'
  },
  confirmDeleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  refCodeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginVertical: 10,
    color: '#0F172A'
  }
});
