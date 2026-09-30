'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ServiceCatalogItem, ServiceCategory, ServiceOrder } from '../types';
import { FULL_SERVICE_CATALOG } from '../data/catalog';
import { ServiceDetailsDrawer } from './ServiceDetailsDrawer';
import { ServiceCheckoutModal } from './ServiceCheckoutModal';
import { ServiceOrderTrackerView } from './ServiceOrderTrackerView';
import { PlanTier } from '@eduportal/shared';
import {
  Globe,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Smartphone,
  Database,
  Bot,
  Layers,
  ShoppingBag,
  ArrowRight,
  Info,
  Check,
  PackageCheck
} from 'lucide-react';
import { SERVICE_STORE_ETA_DISCLAIMER } from '../lib/eta';

export function ServiceCatalogView() {
  const currentPlan: PlanTier = 'pro'; // Default active tenant Mount Carmel is on Pro plan
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart selection
  const [selectedItems, setSelectedItems] = useState<ServiceCatalogItem[]>([]);
  const [drawerItem, setDrawerItem] = useState<ServiceCatalogItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Orders State (seeded with an initial order)
  const [orders, setOrders] = useState<ServiceOrder[]>([
    {
      id: 'ord-init-1',
      orderNumber: 'ORD-2026-1049',
      tenantId: 't-mount-carmel',
      tenantName: 'Mount Carmel Higher Secondary School',
      status: 'paid',
      subtotalINR: 0,
      discountINR: 1200,
      taxINR: 0,
      totalAmountINR: 0,
      paymentStatus: 'paid',
      paymentId: 'pay_platform_free_pro_tier',
      paymentGateway: 'PLATFORM_RAZORPAY',
      termsAcceptedAt: '2026-09-20T10:00:00Z',
      termsIpHash: 'sha256-mount-carmel-admin',
      termsVersion: 'v2.1',
      items: [
        {
          id: 'item-init-1',
          orderId: 'ord-init-1',
          tenantId: 't-mount-carmel',
          serviceId: 'seo_bundle',
          serviceTitle: 'Google Presence & Local SEO Bundle',
          priceINR: 0,
          recurringINR: 0,
          status: 'in_progress',
          clockStartedAt: '2026-09-22T09:00:00Z',
          etaWorkingDays: 7,
          documents: [
            {
              id: 'doc-init-1',
              itemId: 'item-init-1',
              documentKey: 'campus_photos',
              label: 'Campus Front Gate & Building Photos',
              fileName: 'mount_carmel_gate_and_grounds.jpg',
              fileSizeBytes: 2450000,
              mimeType: 'image/jpeg',
              storagePath: 'tenants/mount-carmel/seo/gate.jpg',
              status: 'approved',
              uploadedAt: '2026-09-21T11:00:00Z',
              reviewedAt: '2026-09-22T08:30:00Z',
              reviewedBy: 'EduPortal Operations Lead'
            }
          ],
          events: [
            {
              id: 'evt-init-1',
              itemId: 'item-init-1',
              eventType: 'docs_approved',
              title: 'Verification Complete - ETA Clock Started',
              description: 'Campus photo assets verified. Search Console and Google Maps pins dispatched.',
              createdAt: '2026-09-22T09:00:00Z'
            }
          ],
          createdAt: '2026-09-20T10:00:00Z'
        }
      ],
      createdAt: '2026-09-20T10:00:00Z'
    }
  ]);

  // School contact information for auto-filling templates
  const schoolDetails = {
    name: 'Mount Carmel Higher Secondary School',
    principalName: 'Rev. Dr. Lalthansanga',
    email: 'principal@mountcarmel.edu.in',
    phone: '+91 98621 55667',
    address: 'Mission Veng, Aizawl, Mizoram 796001',
    affiliationNumber: 'CBSE-332019'
  };

  // Filter Catalog
  const filteredCatalog = FULL_SERVICE_CATALOG.filter(service => {
    const matchesCategory =
      selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      service.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.titleLus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.oneLineBenefitEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSelectService = (service: ServiceCatalogItem) => {
    if (selectedItems.some(s => s.id === service.id)) {
      setSelectedItems(selectedItems.filter(s => s.id !== service.id));
    } else {
      setSelectedItems([...selectedItems, service]);
    }
  };

  const handleOrderComplete = (newOrder: ServiceOrder) => {
    setOrders([newOrder, ...orders]);
    setSelectedItems([]);
    setIsCheckoutOpen(false);
    setActiveTab('orders');
  };

  // Cart total calculations
  const cartSubtotal = selectedItems.reduce((acc, s) => {
    return acc + (s.pricing[currentPlan]?.amountINR || 0);
  }, 0);

  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Add-ons & Managed Services
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Current Plan: {currentPlan.toUpperCase()} (₹8,000/yr)
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Services & Add-ons Store
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Order institutional domains (.in, .edu.in), Google Search Console indexation, and native mobile apps.
          </p>
        </div>

        {/* View Switcher: Catalog vs My Orders */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Browse Catalog
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            My Orders ({orders.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: MY ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <ServiceOrderTrackerView orders={orders} />
      )}

      {/* VIEW 2: BROWSE CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Plan Entitlement Announcement */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20 border border-blue-200 dark:border-blue-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Pro Plan Advantage Unlocked
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Google Search Console, Google Maps pin verification, and the Complete SEO Bundle are <strong>100% FREE (₹0)</strong> for your school.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
              ₹1,200 Savings Auto-Applied
            </span>
          </div>

          {/* Filters & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'all', label: 'All Services (14)', icon: Layers },
                  { id: 'domains', label: 'Domains & DNS (5)', icon: Globe },
                  { id: 'google_seo', label: 'Google & SEO (3)', icon: Search },
                  { id: 'mobile_apps', label: 'Mobile Apps (3)', icon: Smartphone },
                  { id: 'data_storage', label: 'Data & Storage (2)', icon: Database },
                  { id: 'ai', label: 'AI Copilot (1)', icon: Bot }
                ] as const
              ).map(cat => {
                const Icon = cat.icon;
                const isCatActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as ServiceCategory)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      isCatActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search services, domain TLDs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Service Cards Grid (Tick Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map(service => {
              const pricing = service.pricing[currentPlan] || { priceType: 'fixed', amountINR: 0 };
              const isFree = pricing.priceType === 'free' || pricing.amountINR === 0;
              const isSelected = selectedItems.some(s => s.id === service.id);

              return (
                <div
                  key={service.id}
                  onClick={() => toggleSelectService(service)}
                  className={`group relative rounded-2xl border transition-all cursor-pointer p-5 flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Card Top: Checkbox and Category */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {service.category.replace('_', ' ')}
                      </span>

                      {/* Tick Checkbox */}
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-blue-500'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">
                      {service.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">
                      {service.titleLus}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {service.oneLineBenefitEn}
                    </p>
                  </div>

                  {/* Card Meta & Price */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {service.etaMinDays}-{service.etaMaxDays} working days
                      </span>
                      <span>
                        {service.requiredDocuments.length === 0
                          ? 'No docs needed'
                          : `${service.requiredDocuments.length} doc${service.requiredDocuments.length > 1 ? 's' : ''}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        {isFree ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              FREE
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (Included in Pro)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              ₹{pricing.amountINR.toLocaleString('en-IN')}
                            </span>
                            {pricing.priceType === 'work_fee_plus_actual' && (
                              <span className="text-[10px] text-slate-400">+ actual</span>
                            )}
                            {service.isRecurring && (
                              <span className="text-[10px] text-slate-400">/ yr</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Details Drawer Trigger (stop propagation to avoid toggling card) */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setDrawerItem(service);
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Info className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal Disclaimer Footer */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-normal">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Notice & Fulfillment Policy:{' '}
            </span>
            {SERVICE_STORE_ETA_DISCLAIMER}
          </div>
        </div>
      )}

      {/* Sticky Bottom Cart Bar */}
      {selectedItems.length > 0 && activeTab === 'catalog' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl p-4 transition-transform animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {selectedItems.length}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {selectedItems.length} service{selectedItems.length > 1 ? 's' : ''} selected
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1 max-w-md">
                  {selectedItems.map(s => s.titleEn).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total Work Fee</span>
                <span className="text-lg font-bold font-display text-blue-600 dark:text-blue-400">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedItems([])}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Clear Cart
              </Button>

              <Button
                variant="primary"
                onClick={() => setIsCheckoutOpen(true)}
                className="flex items-center gap-1.5 px-6"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Drawer */}
      <ServiceDetailsDrawer
        service={drawerItem}
        currentPlan={currentPlan}
        isSelected={drawerItem ? selectedItems.some(s => s.id === drawerItem.id) : false}
        onToggleSelect={toggleSelectService}
        onClose={() => setDrawerItem(null)}
      />

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <ServiceCheckoutModal
          selectedServices={selectedItems}
          currentPlan={currentPlan}
          schoolDetails={schoolDetails}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </div>
  );
}
