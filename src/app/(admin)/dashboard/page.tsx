'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CompanyApiService } from '@/utils/api';
import styles from './page.module.css';
import Link from 'next/link';
import {
  User,
  CreditCard,
  Image as ImageIcon,
  LogOut,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Sparkles,
  Smartphone,
  Facebook,
  Instagram,
  Linkedin,
  Camera,
  Crop
} from 'lucide-react';
import AvatarCropper from '@/components/AvatarCropper';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function DashboardPage() {
  const { user, token, loading, logout } = useAuth();
  const [ecards, setEcards] = useState<any[]>([]);
  const [selectedEcard, setSelectedEcard] = useState<any | null>(null);
  
  const [activeSection, setActiveSection] = useState<'basic' | 'theme' | 'social' | 'info' | 'bank' | 'assets' | null>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Separate loaders and croppers for assets
  const [avatarCropperSrc, setAvatarCropperSrc] = useState<string | null>(null);
  const [bannerCropperSrc, setBannerCropperSrc] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Form Fields State
  const [formFields, setFormFields] = useState<Record<string, any>>({
    title: '',
    firstname: '',
    lastname: '',
    slogan: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    geolocation: '',
    color: '#6366f1',
    type: 'personal',
    isPersonal: 1,
    style: 'SBC000',
  });

  // Dynamic Lists State
  const [socialLinks, setSocialLinks] = useState<{ social: string; link: string }[]>([]);
  const [infoFields, setInfoFields] = useState<{ label: string; content: string; url: string }[]>([]);
  const [bankAccounts, setBankAccounts] = useState<{ bank: string; account: string; number: string; type?: string; label?: string; url?: string }[]>([]);

  // Refs for uploads
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  // Load Ecards on token change
  useEffect(() => {
    if (token) {
      const searchParams = new URLSearchParams(window.location.search);
      const queryCode = searchParams.get('code') || undefined;
      loadEcards(queryCode);
    }
  }, [token]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loadEcards = async (selectCode?: string) => {
    if (!token) return;
    try {
      const res = await CompanyApiService.getEcards(token);
      if (res.success) {
        const cards = res.ecards || [];
        setEcards(cards);
        
        // Auto-select first Ecard or the previously selected one
        if (cards.length > 0) {
          const codeToSelect = selectCode || cards[0].code;
          handleSelectEcard(codeToSelect, cards);
        }
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi tải Ecard: ' + err.message, 'error');
    }
  };

  const populateForm = (card: any) => {
    setFormFields({
      title: card.title || '',
      firstname: card.firstname || '',
      lastname: card.lastname || '',
      slogan: card.slogan || '',
      company: card.company || '',
      position: card.position || '',
      email: card.email || '',
      phone: card.phone || '',
      website: card.website || '',
      address: card.address || '',
      geolocation: card.geolocation || '',
      color: card.color || '#6366f1',
      type: card.type || 'personal',
      isPersonal: card.isPersonal !== undefined ? card.isPersonal : 1,
      style: card.style || 'SBC000',
    });

    // Parse Dynamic Lists
    // Social
    let parsedSocial: any[] = [];
    if (typeof card.social === 'string') {
      try { parsedSocial = JSON.parse(card.social); } catch(e) { parsedSocial = []; }
    } else if (Array.isArray(card.social)) {
      parsedSocial = card.social;
    }
    
    // Normalize format
    const normalizedSocial = (parsedSocial || []).map((item: any) => ({
      social: item.social || item.type || 'Facebook',
      link: item.link || item.url || item.label || '',
    }));
    setSocialLinks(normalizedSocial);

    // Info / Bio items
    let parsedInfo: any[] = [];
    if (typeof card.info === 'string') {
      try { parsedInfo = JSON.parse(card.info); } catch(e) { parsedInfo = []; }
    } else if (Array.isArray(card.info)) {
      parsedInfo = card.info;
    }
    setInfoFields(parsedInfo || []);

    // Banks
    let parsedBank: any[] = [];
    if (typeof card.bank === 'string') {
      try { parsedBank = JSON.parse(card.bank); } catch(e) { parsedBank = []; }
    } else if (Array.isArray(card.bank)) {
      parsedBank = card.bank;
    }
    setBankAccounts(parsedBank || []);
  };

  const handleSelectEcard = async (code: string, cardsList: any[] = ecards) => {
    if (!token) return;

    // 1. Try to find from our local list first to give instant preview
    const localCard = cardsList.find(c => c.code === code);
    if (localCard) {
      setSelectedEcard(localCard);
      populateForm(localCard);
    }

    // 2. Fetch from backend as double check, but handle failure gracefully
    setIsLoadingDetails(true);
    try {
      const res = await CompanyApiService.getEcardDetails(token, code);
      if (res.success && res.ecard) {
        setSelectedEcard(res.ecard);
        populateForm(res.ecard);
      } else {
        console.warn('API getEcardDetails returned error, using local ecards list data:', res.message);
      }
    } catch (err: any) {
      console.warn('API getEcardDetails failed:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Workflow 1: Submit Ecard text & layout settings (excluding avatar & banner to prevent 500 error)
  const handleUpdateEcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedEcard) return;
    setIsSubmitting(true);

    try {
      // Format social list
      const formattedSocial = socialLinks.map(item => ({
        social: item.social,
        link: item.link,
        type: item.social.toLowerCase(),
        label: item.link,
        url: item.link
      }));

      // Make sure 'title' is present in formFields to prevent API crash
      const payload = {
        ...formFields,
        title: formFields.title || selectedEcard.title || 'Nhựt', // Title fallback to prevent 500 crash
        social: JSON.stringify(formattedSocial),
        info: JSON.stringify(infoFields),
        bank: JSON.stringify(bankAccounts),
      };

      const res = await CompanyApiService.updateEcard(token, selectedEcard.code, payload);
      if (res.success) {
        showToast('Đã lưu thông tin Ecard thành công!');
        await loadEcards(selectedEcard.code);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi cập nhật: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Workflow 2: Select and Crop Avatar File
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarCropperSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarCropComplete = async (base64Data: string) => {
    if (!token || !selectedEcard) return;
    setAvatarCropperSrc(null);
    setIsUploadingAvatar(true);

    try {
      const res = await CompanyApiService.updateEcardAvatar(token, selectedEcard.code, base64Data);
      if (res.success) {
        showToast('Cập nhật ảnh đại diện Ecard thành công!');
        await loadEcards(selectedEcard.code);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi tải ảnh: ' + err.message, 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Workflow 3: Select and Crop Banner File
  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerCropperSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerCropComplete = async (base64Data: string) => {
    if (!token || !selectedEcard) return;
    setBannerCropperSrc(null);
    setIsUploadingBanner(true);

    try {
      const res = await CompanyApiService.updateEcardBanner(token, selectedEcard.code, base64Data);
      if (res.success) {
        showToast('Cập nhật ảnh bìa Ecard thành công!');
        await loadEcards(selectedEcard.code);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi tải ảnh bìa: ' + err.message, 'error');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  // Dynamic Lists helpers
  // Social
  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { social: 'Facebook', link: '' }]);
  };
  const removeSocialLink = (idx: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== idx));
  };
  const updateSocialLink = (idx: number, field: string, value: string) => {
    const updated = [...socialLinks];
    updated[idx] = { ...updated[idx], [field]: value };
    setSocialLinks(updated);
  };

  // Info fields
  const addInfoField = () => {
    setInfoFields([...infoFields, { label: 'bio', content: '', url: '' }]);
  };
  const removeInfoField = (idx: number) => {
    setInfoFields(infoFields.filter((_, i) => i !== idx));
  };
  const updateInfoField = (idx: number, field: string, value: string) => {
    const updated = [...infoFields];
    updated[idx] = { ...updated[idx], [field]: value };
    setInfoFields(updated);
  };

  // Banks
  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { bank: 'TienPhongBank', account: '', number: '' }]);
  };
  const removeBankAccount = (idx: number) => {
    setBankAccounts(bankAccounts.filter((_, i) => i !== idx));
  };
  const updateBankAccount = (idx: number, field: string, value: string) => {
    const updated = [...bankAccounts];
    updated[idx] = { ...updated[idx], [field]: value };
    setBankAccounts(updated);
  };

  // Helper for rendering Avatar
  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath || avatarPath.includes('default.png')) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    return `https://account.nks.vn/storage/${avatarPath}`;
  };

  // Helper for social icons
  const getSocialIconClass = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return 'fa-brands fa-facebook';
    if (p.includes('instagram')) return 'fa-brands fa-instagram';
    if (p.includes('linkedin')) return 'fa-brands fa-linkedin';
    if (p.includes('zalo')) return 'fa-solid fa-message';
    if (p.includes('youtube')) return 'fa-brands fa-youtube';
    if (p.includes('tiktok')) return 'fa-brands fa-tiktok';
    if (p.includes('twitter')) return 'fa-brands fa-twitter';
    return 'fa-solid fa-globe';
  };

  const getSocialBgColor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return '#1877f2';
    if (p.includes('instagram')) return '#e1306c';
    if (p.includes('linkedin')) return '#0a66c2';
    if (p.includes('zalo')) return '#0068ff';
    if (p.includes('youtube')) return '#ff0000';
    if (p.includes('tiktok')) return '#000000';
    return '#4f46e5';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] dark:bg-gray-900">
        <Loader2 size={48} className="animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert overlay */}
      <div className="fixed top-4 right-4 z-9999 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 border bg-white dark:bg-gray-800 ${t.type === 'error' ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' : 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'}`}>
            {t.type === 'success' ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <AlertCircle size={18} className="text-red-500" />
            )}
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thiết Kế Ecard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Thiết kế và quản lý thông tin hiển thị trên Ecard thông minh.</p>
      </div>

      {/* Ecard select tabs */}
      {ecards.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 p-3 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800">
          {ecards.map((card) => (
            <div
              key={card.code}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200 ${
                selectedEcard?.code === card.code
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20'
                  : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
              onClick={() => handleSelectEcard(card.code)}
            >
              <i className="fa-regular fa-id-badge text-base"></i>
              <span>
                {card.lastname || ''} {card.firstname || ''} ({card.code})
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 p-8 text-center bg-white dark:bg-white/[0.03]">
          <span className="text-sm text-gray-500 dark:text-gray-400">Bạn chưa có chiếc Ecard nào được đăng ký trên hệ thống.</span>
        </div>
      )}

      {/* Main Workspace */}
      {selectedEcard && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Ecard Preview Card */}
          <div className="xl:col-span-5 xl:sticky xl:top-24 flex flex-col items-center bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="w-full mb-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Smartphone size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Xem trước giao diện Ecard</span>
            </div>

            {/* Card Container */}
            <div className={styles.phoneMockup}>
              <div className={`${styles.phoneScreen} ${styles['screen' + formFields.style]}`}>
                
                {/* Banner */}
                <div className={styles.bannerContainer}>
                  {selectedEcard.banner ? (
                    <img
                      src={getAvatarUrl(selectedEcard.banner)}
                      alt="Ecard Banner"
                      className={styles.previewBanner}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800"></div>
                  )}
                </div>

                {/* Avatar */}
                <div className={styles.avatarWrapper}>
                  <img
                    src={getAvatarUrl(selectedEcard.avatar)}
                    alt="Ecard Avatar"
                    className={styles.previewAvatar}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                    }}
                  />
                </div>

                {/* Information Details Card */}
                <div className={styles.cardContent}>
                  <div className={styles.previewName}>
                    {formFields.lastname} {formFields.firstname}
                  </div>
                  {formFields.position && (
                    <div className={styles.previewPosition}>
                      {formFields.position}
                    </div>
                  )}
                  {formFields.company && (
                    <div className={styles.previewCompany}>
                      {formFields.company}
                    </div>
                  )}
                  {formFields.slogan && (
                    <div className={styles.previewSlogan}>
                      &ldquo;{formFields.slogan}&rdquo;
                    </div>
                  )}
                </div>

                {/* Contact Info List */}
                <div className={styles.contactsList}>
                  {formFields.email && (
                    <div className={styles.contactItem}>
                      <div className={styles.contactIconCircle} style={{ backgroundColor: formFields.color }}>
                        <i className="fa-regular fa-envelope"></i>
                      </div>
                      <span className={styles.contactText}>{formFields.email}</span>
                    </div>
                  )}
                  {formFields.phone && (
                    <div className={styles.contactItem}>
                      <div className={styles.contactIconCircle} style={{ backgroundColor: formFields.color }}>
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <span className={styles.contactText}>{formFields.phone}</span>
                    </div>
                  )}
                  {formFields.website && (
                    <div className={styles.contactItem}>
                      <div className={styles.contactIconCircle} style={{ backgroundColor: formFields.color }}>
                        <i className="fa-solid fa-globe"></i>
                      </div>
                      <span className={styles.contactText}>{formFields.website}</span>
                    </div>
                  )}
                  {formFields.address && (
                    <div className={styles.contactItem}>
                      <div className={styles.contactIconCircle} style={{ backgroundColor: formFields.color }}>
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <span className={styles.contactText}>{formFields.address}</span>
                    </div>
                  )}
                </div>

                {/* Bio Info Blocks */}
                {infoFields.length > 0 && (
                  <div className={styles.infoBlocksList}>
                    {infoFields.map((item, idx) => (
                      <div key={idx} className={styles.infoBlockCard}>
                        <div className={styles.infoBlockLabel} style={{ color: formFields.color }}>
                          {item.label}
                        </div>
                        <div className={styles.infoBlockText}>{item.content}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Social Grid */}
                {socialLinks.length > 0 && (
                  <div className={styles.socialGrid}>
                    {socialLinks.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.link.startsWith('http') ? item.link : '#'}
                        className={styles.socialIconCircle}
                        style={{ backgroundColor: getSocialBgColor(item.social) }}
                        onClick={(e) => e.preventDefault()}
                        title={item.social}
                      >
                        <i className={getSocialIconClass(item.social)}></i>
                      </a>
                    ))}
                  </div>
                )}

                {/* Bank Accounts */}
                {bankAccounts.length > 0 && (
                  <div className={styles.banksList}>
                    <h4 className="text-xs text-left font-bold text-gray-500 dark:text-gray-400 mb-2">TÀI KHOẢN GIAO DỊCH</h4>
                    {bankAccounts.map((item, idx) => (
                      <div
                        key={idx}
                        className={styles.contactItem}
                        style={{
                          background: '#f9fafb',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          gap: '4px',
                          marginBottom: '10px'
                        }}
                      >
                        <div className="flex justify-between text-xs text-gray-400 font-bold">
                          <span>{item.bank}</span>
                          <span style={{ color: formFields.color }}>BANK CARD</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900 tracking-wider">{item.number}</div>
                        <div className="text-xs text-gray-600">{item.account}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* QR Code Section */}
                <div className={styles.qrSection}>
                  <div className={styles.qrImageContainer}>
                    <i className="fa-solid fa-qrcode text-3xl text-brand-500"></i>
                  </div>
                  <div className={styles.qrText}>
                    Quét để lưu danh bạ hoặc mở website.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button className={styles.btnGold} style={{ backgroundColor: formFields.color }} onClick={(e) => e.preventDefault()}>
                    <i className="fa-regular fa-address-book"></i> Lưu danh bạ
                  </button>
                  <button className={styles.btnGold} style={{ backgroundColor: formFields.color }} onClick={(e) => e.preventDefault()}>
                    Chat
                  </button>
                  <div className={styles.btnRow}>
                    <button className={styles.btnWhite} onClick={(e) => e.preventDefault()}>
                      <i className="fa-solid fa-phone"></i> Gọi
                    </button>
                    <button className={styles.btnWhite} onClick={(e) => e.preventDefault()}>
                      <i className="fa-solid fa-share-nodes"></i> Chia sẻ
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Editor forms & asset managers */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            
            {/* WORKFLOW 1: TEXT FIELDS & DESIGN CONFIGS FORM */}
            <form onSubmit={handleUpdateEcard} className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Thiết kế Ecard ({selectedEcard.code})
                </h2>
                <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-all cursor-pointer shadow-md shadow-brand-500/20" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu thông tin chữ
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <Loader2 size={32} className="animate-spin text-brand-500" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Section 1: Basic details */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white py-2"
                      onClick={() => setActiveSection(activeSection === 'basic' ? null : 'basic')}
                    >
                      <span className="flex items-center gap-2 text-base">
                        <User size={18} className="text-brand-500" /> Thông tin liên hệ
                      </span>
                      {activeSection === 'basic' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'basic' && (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Danh xưng</label>
                            <input
                              type="text"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="Mr/Ms"
                              value={formFields.title}
                              onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Họ / Tên đệm</label>
                            <input
                              type="text"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="Nguyễn"
                              value={formFields.lastname}
                              onChange={(e) => setFormFields({ ...formFields, lastname: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tên</label>
                            <input
                              type="text"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="Văn A"
                              value={formFields.firstname}
                              onChange={(e) => setFormFields({ ...formFields, firstname: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Slogan cá nhân / Châm ngôn</label>
                            <input
                              type="text"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="Kết nối sức mạnh - Dẫn bước thành công"
                              value={formFields.slogan}
                              onChange={(e) => setFormFields({ ...formFields, slogan: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Loại tài khoản</label>
                            <select
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500 dark:bg-gray-900 bg-white"
                              value={formFields.type}
                              onChange={(e) => setFormFields({ ...formFields, type: e.target.value })}
                              style={{ cursor: 'pointer' }}
                            >
                              <option value="personal">Cá nhân</option>
                              <option value="business">Doanh nghiệp</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Công ty</label>
                            <input
                              type="text"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="NKS Group"
                              value={formFields.company}
                              onChange={(e) => setFormFields({ ...formFields, company: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Chức vụ / Vị trí</label>
                            <input
                              type="text"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="Giám đốc công nghệ"
                              value={formFields.position}
                              onChange={(e) => setFormFields({ ...formFields, position: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email hiển thị</label>
                            <input
                              type="email"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="email@domain.com"
                              value={formFields.email}
                              onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Số điện thoại liên hệ</label>
                            <input
                              type="tel"
                              className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                              placeholder="0912345678"
                              value={formFields.phone}
                              onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Website</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                            placeholder="https://nks.vn"
                            value={formFields.website}
                            onChange={(e) => setFormFields({ ...formFields, website: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Địa chỉ làm việc</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                            placeholder="123 Đường ABC, Quận 1, TP. HCM"
                            value={formFields.address}
                            onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Themes & style settings */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white py-2"
                      onClick={() => setActiveSection(activeSection === 'theme' ? null : 'theme')}
                    >
                      <span className="flex items-center gap-2 text-base">
                        <Settings size={18} className="text-brand-500" /> Giao diện & Chủ đề
                      </span>
                      {activeSection === 'theme' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'theme' && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Chọn phong cách thiết kế</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['SBC000', 'SBC001', 'SBC002'].map((styleName) => (
                              <div
                                key={styleName}
                                className={`p-4 rounded-xl border text-center text-sm font-medium cursor-pointer transition-all duration-200 ${
                                  formFields.style === styleName
                                    ? 'bg-brand-50 border-brand-500 text-brand-500 dark:bg-brand-500/10'
                                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                }`}
                                onClick={() => setFormFields({ ...formFields, style: styleName })}
                              >
                                {styleName === 'SBC000' && 'SBC000 (Đơn giản)'}
                                {styleName === 'SBC001' && 'SBC001 (Gradient)'}
                                {styleName === 'SBC002' && 'SBC002 (Glow)'}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Màu sắc chủ đề chính</label>
                          <div className="flex gap-3 items-center">
                            <input
                              type="color"
                              className="h-10 w-16 p-0 border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer bg-transparent"
                              value={formFields.color}
                              onChange={(e) => setFormFields({ ...formFields, color: e.target.value })}
                            />
                            <span className="text-sm font-mono font-semibold">{formFields.color}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Social Links */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white py-2"
                      onClick={() => setActiveSection(activeSection === 'social' ? null : 'social')}
                    >
                      <span className="flex items-center gap-2 text-base">
                        <Facebook size={18} className="text-brand-500" /> Liên kết mạng xã hội
                      </span>
                      {activeSection === 'social' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'social' && (
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-col gap-3">
                          {socialLinks.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <select
                                className="h-11 rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:bg-gray-900 bg-white"
                                value={item.social}
                                onChange={(e) => updateSocialLink(idx, 'social', e.target.value)}
                                style={{ width: '130px' }}
                              >
                                <option value="Facebook">Facebook</option>
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Zalo">Zalo</option>
                                <option value="YouTube">YouTube</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Website">Website</option>
                              </select>
                              <input
                                type="text"
                                className="h-11 flex-1 rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                                placeholder="Link hoặc số điện thoại..."
                                value={item.link}
                                onChange={(e) => updateSocialLink(idx, 'link', e.target.value)}
                              />
                              <button
                                type="button"
                                className="flex items-center justify-center h-11 w-11 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all cursor-pointer dark:border-red-900/30 dark:hover:bg-red-950/20"
                                onClick={() => removeSocialLink(idx)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-all cursor-pointer py-1"
                          onClick={addSocialLink}
                        >
                          <Plus size={14} /> Thêm liên kết mạng xã hội
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 4: Bio / Info blocks */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white py-2"
                      onClick={() => setActiveSection(activeSection === 'info' ? null : 'info')}
                    >
                      <span className="flex items-center gap-2 text-base">
                        <Globe size={18} className="text-brand-500" /> Các mục giới thiệu (Bio / Dịch vụ)
                      </span>
                      {activeSection === 'info' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'info' && (
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-col gap-4">
                          {infoFields.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 bg-gray-50/50 dark:bg-white/[0.01]">
                              <div className="flex justify-between items-center">
                                <input
                                  type="text"
                                  className="h-9 rounded-lg border border-gray-200 bg-transparent px-3 text-sm font-semibold text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90"
                                  placeholder="Nhãn (ví dụ: bio, Dịch vụ, Giới thiệu)"
                                  value={item.label}
                                  onChange={(e) => updateInfoField(idx, 'label', e.target.value)}
                                  style={{ width: '220px' }}
                                />
                                <button
                                  type="button"
                                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all cursor-pointer dark:border-red-900/30 dark:hover:bg-red-950/20"
                                  onClick={() => removeInfoField(idx)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                              <textarea
                                className="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                                placeholder="Nội dung hiển thị chi tiết..."
                                rows={2}
                                value={item.content}
                                onChange={(e) => updateInfoField(idx, 'content', e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-all cursor-pointer py-1"
                          onClick={addInfoField}
                        >
                          <Plus size={14} /> Thêm mục giới thiệu
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 5: Bank accounts */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div
                      className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 dark:text-white py-2"
                      onClick={() => setActiveSection(activeSection === 'bank' ? null : 'bank')}
                    >
                      <span className="flex items-center gap-2 text-base">
                        <CreditCard size={18} className="text-brand-500" /> Tài khoản ngân hàng (Nhận tiền)
                      </span>
                      {activeSection === 'bank' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'bank' && (
                      <div className="mt-4 space-y-4">
                        <div className="flex flex-col gap-4">
                          {bankAccounts.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 bg-gray-50/50 dark:bg-white/[0.01]">
                              <div className="flex justify-between items-center">
                                <select
                                  className="h-9 rounded-lg border border-gray-200 bg-transparent px-3 text-sm font-semibold text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:bg-gray-900 bg-white"
                                  value={item.bank}
                                  onChange={(e) => updateBankAccount(idx, 'bank', e.target.value)}
                                  style={{ width: '180px' }}
                                >
                                  <option value="TienPhongBank">TPBank</option>
                                  <option value="Agribank">Agribank</option>
                                  <option value="Vietcombank">Vietcombank</option>
                                  <option value="Techcombank">Techcombank</option>
                                  <option value="MBBank">MB Bank</option>
                                  <option value="Vietinbank">Vietinbank</option>
                                  <option value="BIDV">BIDV</option>
                                  <option value="ACB">ACB</option>
                                </select>
                                <button
                                  type="button"
                                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 transition-all cursor-pointer dark:border-red-900/30 dark:hover:bg-red-950/20"
                                  onClick={() => removeBankAccount(idx)}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                                  placeholder="Chủ tài khoản (viết hoa không dấu)"
                                  value={item.account}
                                  onChange={(e) => updateBankAccount(idx, 'account', e.target.value.toUpperCase())}
                                  required
                                />
                                <input
                                  type="text"
                                  className="h-10 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:outline-none dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-500"
                                  placeholder="Số tài khoản"
                                  value={item.number}
                                  onChange={(e) => updateBankAccount(idx, 'number', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-all cursor-pointer py-1"
                          onClick={addBankAccount}
                        >
                          <Plus size={14} /> Thêm tài khoản ngân hàng
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>

            {/* WORKFLOW 2: SEPARATE AVATAR UPDATE CARD */}
            <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                <ImageIcon size={18} className="text-brand-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Ảnh đại diện Ecard (Avatar)</h3>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 flex items-center justify-center">
                  <img
                    src={getAvatarUrl(selectedEcard.avatar)}
                    alt="Ecard Avatar Current"
                    className="w-full h-full object-cover"
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">Thay đổi ảnh đại diện Ecard</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Chọn ảnh mới để cắt tỷ lệ 1:1 làm avatar cho chiếc Ecard của bạn. Ảnh sẽ được tự động đồng bộ lên sau khi cắt.</p>
                  
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarFileSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />

                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold transition-all cursor-pointer shadow-md shadow-brand-500/10"
                    disabled={isUploadingAvatar}
                  >
                    <Camera size={16} /> Chọn và cắt ảnh đại diện
                  </button>
                </div>
              </div>
            </div>

            {/* WORKFLOW 3: SEPARATE BANNER UPDATE CARD */}
            <div className="bg-white dark:bg-white/[0.03] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
                <ImageIcon size={18} className="text-brand-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Ảnh bìa Ecard (Banner)</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 flex items-center justify-center">
                  {selectedEcard.banner ? (
                    <img
                      src={getAvatarUrl(selectedEcard.banner)}
                      alt="Ecard Banner Current"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Chưa có ảnh bìa</span>
                  )}
                  {isUploadingBanner && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 size={32} className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">Thay đổi ảnh bìa Ecard</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Chọn ảnh mới để cắt theo tỷ lệ chữ nhật rộng (2:1) phù hợp làm banner của Ecard.</p>
                  
                  <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerFileSelect}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingBanner}
                  />

                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold transition-all cursor-pointer shadow-md shadow-brand-500/10"
                    disabled={isUploadingBanner}
                  >
                    <Crop size={16} /> Chọn và cắt ảnh bìa
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Avatar Cropper Modal Overlay */}
      {avatarCropperSrc && (
        <AvatarCropper
          imageSrc={avatarCropperSrc}
          onCropComplete={handleAvatarCropComplete}
          onClose={() => setAvatarCropperSrc(null)}
          aspectRatio={1}
          title="Cắt ảnh đại diện Ecard"
        />
      )}

      {/* Banner Cropper Modal Overlay */}
      {bannerCropperSrc && (
        <AvatarCropper
          imageSrc={bannerCropperSrc}
          onCropComplete={handleBannerCropComplete}
          onClose={() => setBannerCropperSrc(null)}
          aspectRatio={2} // Tỷ lệ ảnh bìa chữ nhật rộng (2:1)
          title="Cắt ảnh bìa (Banner) Ecard"
        />
      )}
    </div>
  );
}
