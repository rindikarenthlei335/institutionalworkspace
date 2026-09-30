import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';

interface FindSchoolScreenProps {
  onSelectSchool: (schoolSlug: string) => void;
}

export function FindSchoolScreen({ onSelectSchool }: FindSchoolScreenProps) {
  const [code, setCode] = useState<string>('MC-AIZAWL');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLookup = () => {
    if (!code.trim()) {
      Alert.alert('Required', 'Please enter your school code or name.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Resolves MC-AIZAWL or mountcarmel
      onSelectSchool('mountcarmel');
    }, 600);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>EP</Text>
        </View>

        <Text style={styles.title}>EduPortal</Text>
        <Text style={styles.subtitle}>Enter your institutional school code to connect</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>School Code / Identifier</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="e.g. MC-AIZAWL"
            autoCapitalize="characters"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLookup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Find My School →</Text>
          )}
        </TouchableOpacity>

        <View style={styles.presetBox}>
          <Text style={styles.presetLabel}>Quick Demo Institutional Presets:</Text>
          <TouchableOpacity
            style={styles.presetButton}
            onPress={() => {
              setCode('MC-AIZAWL');
              onSelectSchool('mountcarmel');
            }}
          >
            <Text style={styles.presetText}>🏫 Mount Carmel HSS (Aizawl)</Text>
          </TouchableOpacity>
        </View>
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
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#163A2B',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12
  },
  logoText: {
    color: '#C9A84C',
    fontSize: 22,
    fontWeight: '900'
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20
  },
  inputContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#F8FAFC'
  },
  button: {
    backgroundColor: '#163A2B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  },
  presetBox: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  presetLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 8
  },
  presetButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9'
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B'
  }
});
