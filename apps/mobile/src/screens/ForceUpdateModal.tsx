import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking
} from 'react-native';
import type { AppVersioning } from '../types';

interface ForceUpdateModalProps {
  versioning: AppVersioning;
  primaryColor?: string;
  language?: 'en' | 'lus';
}

export function ForceUpdateModal({
  versioning,
  primaryColor = '#163A2B',
  language = 'en'
}: ForceUpdateModalProps) {
  if (!versioning.forceUpdate) {
    return null;
  }

  const handleUpdate = () => {
    const url = versioning.updateUrl || 'https://apps.apple.com';
    Linking.openURL(url).catch(err => {
      console.warn('Could not open store URL:', err);
    });
  };

  const t = {
    title: language === 'lus' ? 'App Update Tih Ngai' : 'Mandatory Update Required',
    body: language === 'lus'
      ? 'School security leh exam grading thar hman a nih theih nan app hi update ngei ngei a ngai e. I app hman lai hian kal zui theih a ni tawh lo.'
      : 'A critical update is required to continue accessing school records, exam results, and fee statements. Please update to the latest version.',
    currentVersion: language === 'lus' ? 'Hman mek:' : 'Installed:',
    requiredVersion: language === 'lus' ? 'A tlem ber:' : 'Required:',
    button: language === 'lus' ? 'App Update Rawh' : 'Update from App Store / Play Store'
  };

  return (
    <Modal visible={true} transparent={false} animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>🚀</Text>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.body}>{t.body}</Text>

          <View style={styles.versionBox}>
            <View style={styles.versionRow}>
              <Text style={styles.versionLabel}>{t.currentVersion}</Text>
              <Text style={styles.versionValue}>v{versioning.clientVersion}</Text>
            </View>
            <View style={styles.versionRow}>
              <Text style={styles.versionLabel}>{t.requiredVersion}</Text>
              <Text style={[styles.versionValue, { color: '#DC2626' }]}>
                v{versioning.minSupportedVersion}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={handleUpdate}
          >
            <Text style={styles.buttonText}>{t.button}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8
  },
  icon: {
    fontSize: 52,
    marginBottom: 12
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8
  },
  body: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20
  },
  versionBox: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3
  },
  versionLabel: {
    fontSize: 12,
    color: '#64748B'
  },
  versionValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#0F172A'
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});
