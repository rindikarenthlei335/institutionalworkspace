import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import type { TenantConfig, MobileUserSession } from '../types';

interface FeesScreenProps {
  tenantConfig: TenantConfig;
  session: MobileUserSession;
  onBack: () => void;
  language?: 'en' | 'lus';
}

interface FeeItem {
  id: string;
  titleEn: string;
  titleLus: string;
  dueDate: string;
  paidDate?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  receiptNo?: string;
}

const SAMPLE_FEES: FeeItem[] = [
  {
    id: 'inv-001',
    titleEn: 'Term 2 Tuition Fee',
    titleLus: 'Term 2 Zirlai Man',
    dueDate: '15 Oct 2024',
    amount: 3500,
    status: 'pending'
  },
  {
    id: 'inv-002',
    titleEn: 'Computer & Science Lab Fee',
    titleLus: 'Computer leh Science Lab Man',
    dueDate: '15 Oct 2024',
    amount: 1000,
    status: 'pending'
  },
  {
    id: 'inv-003',
    titleEn: 'Term 1 Tuition & Bus Service',
    titleLus: 'Term 1 Zirlai leh Bus Man',
    dueDate: '10 Jun 2024',
    paidDate: '08 Jun 2024',
    amount: 14000,
    status: 'paid',
    receiptNo: 'REC-2024-8842'
  },
  {
    id: 'inv-004',
    titleEn: 'Annual Registration & Examination Fee',
    titleLus: 'Kum khat Registration leh Exam Man',
    dueDate: '10 Jun 2024',
    paidDate: '08 Jun 2024',
    amount: 4000,
    status: 'paid',
    receiptNo: 'REC-2024-8843'
  }
];

export function FeesScreen({
  tenantConfig,
  session,
  onBack,
  language = 'en'
}: FeesScreenProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const primaryColor = tenantConfig.branding.primaryColor || '#163A2B';
  const secondaryColor = tenantConfig.branding.secondaryColor || '#C9A84C';

  const t = {
    title: language === 'lus' ? 'School Fee & Chawina' : 'Fees & Invoices',
    pendingTab: language === 'lus' ? 'Chawi Ngaite' : 'Due & Pending',
    historyTab: language === 'lus' ? 'Chawi Tawhte' : 'Payment History',
    totalDue: language === 'lus' ? 'Chawi tur zat' : 'Total Outstanding',
    totalPaid: language === 'lus' ? 'Chawi tawh zat' : 'Total Paid',
    payAll: language === 'lus' ? 'Pay Online (Razorpay / UPI)' : 'Pay Outstanding Online',
    dueDate: language === 'lus' ? 'Chawi hun tawp' : 'Due Date',
    paidOn: language === 'lus' ? 'Ni-a chawi' : 'Paid On',
    receipt: language === 'lus' ? 'Receipt la rawh' : 'Receipt',
    secureBadge: language === 'lus' ? '🔒 RBI Compliant 256-bit Gate' : '🔒 256-bit Encrypted Institutional Gateway',
    payNow: language === 'lus' ? 'Chawi nghal rawh' : 'Pay Now',
    cancel: language === 'lus' ? 'Thulh leh rawh' : 'Cancel',
    processing: language === 'lus' ? 'Chawi mek a ni...' : 'Opening Payment Gateway...'
  };

  const pendingList = SAMPLE_FEES.filter(f => f.status !== 'paid');
  const paidList = SAMPLE_FEES.filter(f => f.status === 'paid');

  const totalOutstanding = pendingList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = paidList.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePay = (item?: FeeItem) => {
    setSelectedFee(item || null);
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentSuccess(true);
    }, 1200);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← {language === 'lus' ? 'Let leh' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.screenHeading}>{t.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { borderLeftColor: '#EF4444' }]}>
          <Text style={styles.summaryLabel}>{t.totalDue}</Text>
          <Text style={[styles.summaryAmount, { color: '#B91C1C' }]}>
            ₹ {totalOutstanding.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.summarySub}>{pendingList.length} Invoices pending</Text>
        </View>

        <View style={[styles.summaryCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.summaryLabel}>{t.totalPaid}</Text>
          <Text style={[styles.summaryAmount, { color: '#047857' }]}>
            ₹ {totalPaid.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.summarySub}>{paidList.length} Invoices cleared</Text>
        </View>
      </View>

      {/* Quick Pay Banner if outstanding */}
      {totalOutstanding > 0 && (
        <View style={[styles.payBanner, { borderColor: secondaryColor }]}>
          <View style={styles.payBannerTextCol}>
            <Text style={styles.payBannerTitle}>Term 2 Settlement</Text>
            <Text style={styles.payBannerSub}>No convenience fee for UPI / NetBanking</Text>
          </View>
          <TouchableOpacity
            style={[styles.payBannerBtn, { backgroundColor: primaryColor }]}
            onPress={() => handlePay()}
          >
            <Text style={styles.payBannerBtnText}>{t.payAll}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pending' && { borderBottomColor: primaryColor, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && { color: primaryColor, fontWeight: '700' }]}>
            {t.pendingTab} ({pendingList.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && { borderBottomColor: primaryColor, borderBottomWidth: 3 }]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && { color: primaryColor, fontWeight: '700' }]}>
            {t.historyTab} ({paidList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Invoice List */}
      <View style={styles.listContainer}>
        {activeTab === 'pending' ? (
          pendingList.map(item => (
            <View key={item.id} style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}>
                <View style={styles.badgePending}>
                  <Text style={styles.badgePendingText}>PENDING</Text>
                </View>
                <Text style={styles.dueDateText}>{t.dueDate}: {item.dueDate}</Text>
              </View>
              <Text style={styles.invoiceTitle}>
                {language === 'lus' ? item.titleLus : item.titleEn}
              </Text>
              <View style={styles.invoiceFooter}>
                <Text style={styles.invoicePrice}>₹ {item.amount.toLocaleString('en-IN')}</Text>
                <TouchableOpacity
                  style={[styles.singlePayBtn, { backgroundColor: primaryColor }]}
                  onPress={() => handlePay(item)}
                >
                  <Text style={styles.singlePayBtnText}>{t.payNow}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          paidList.map(item => (
            <View key={item.id} style={styles.invoiceCard}>
              <View style={styles.invoiceHeader}>
                <View style={styles.badgePaid}>
                  <Text style={styles.badgePaidText}>PAID</Text>
                </View>
                <Text style={styles.paidDateText}>{t.paidOn}: {item.paidDate}</Text>
              </View>
              <Text style={styles.invoiceTitle}>
                {language === 'lus' ? item.titleLus : item.titleEn}
              </Text>
              <View style={styles.invoiceFooter}>
                <Text style={styles.invoicePrice}>₹ {item.amount.toLocaleString('en-IN')}</Text>
                <TouchableOpacity
                  style={styles.receiptBtn}
                  onPress={() => {
                    Alert.alert(
                      'Official Receipt',
                      `Receipt No: ${item.receiptNo}\nAmount: ₹${item.amount}\nStatus: Settled via Payment Gateway\nInstitution: ${tenantConfig.tenant.name}`
                    );
                  }}
                >
                  <Text style={styles.receiptBtnText}>🧾 {t.receipt}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Gateway Security footer */}
      <View style={styles.gatewayFooter}>
        <Text style={styles.gatewayFooterText}>{t.secureBadge}</Text>
      </View>

      {/* Payment Processing / Success Modal */}
      <Modal visible={paymentProcessing || showPaymentSuccess} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {paymentProcessing ? (
              <View style={styles.modalContent}>
                <Text style={styles.modalSpinner}>💳</Text>
                <Text style={styles.modalTitle}>{t.processing}</Text>
                <Text style={styles.modalSub}>
                  Redirecting to Razorpay / UPI secure portal...
                </Text>
              </View>
            ) : (
              <View style={styles.modalContent}>
                <Text style={styles.modalSuccessIcon}>✅</Text>
                <Text style={styles.modalTitle}>Payment Received!</Text>
                <Text style={styles.modalSub}>
                  Amount: ₹ {selectedFee ? selectedFee.amount.toLocaleString('en-IN') : totalOutstanding.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.receiptCode}>Receipt Ref: REC-2024-9981</Text>
                <TouchableOpacity
                  style={[styles.closeModalBtn, { backgroundColor: primaryColor }]}
                  onPress={() => setShowPaymentSuccess(false)}
                >
                  <Text style={styles.closeModalBtnText}>Done</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2
  },
  summarySub: {
    fontSize: 10,
    color: '#94A3B8'
  },
  payBanner: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  payBannerTextCol: {
    flex: 1,
    paddingRight: 10
  },
  payBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A'
  },
  payBannerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  payBannerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  payBannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  },
  tabText: {
    fontSize: 13,
    color: '#64748B'
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  badgePending: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgePendingText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#DC2626'
  },
  badgePaid: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgePaidText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#059669'
  },
  dueDateText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '500'
  },
  paidDateText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500'
  },
  invoiceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  invoicePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },
  singlePayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  singlePayBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  receiptBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  receiptBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155'
  },
  gatewayFooter: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  gatewayFooterText: {
    fontSize: 11,
    color: '#94A3B8'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20
  },
  modalContent: {
    alignItems: 'center'
  },
  modalSpinner: {
    fontSize: 40,
    marginBottom: 12
  },
  modalSuccessIcon: {
    fontSize: 44,
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12
  },
  receiptCode: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 16
  },
  closeModalBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
