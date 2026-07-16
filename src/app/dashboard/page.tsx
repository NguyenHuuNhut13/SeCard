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
  MessageSquare,
  Camera
} from 'lucide-react';

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
    
    // Normalize format (handle both {social, link} and {type, url, label})
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
        // If API returns 404/Not Found, we already have localCard from list (ecards), so we just log warning instead of showing HTML toast!
        console.warn('API getEcardDetails returned error, using local ecards list data:', res.message);
      }
    } catch (err: any) {
      console.warn('API getEcardDetails failed:', err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Submit Ecard edits
  const handleUpdateEcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedEcard) return;
    setIsSubmitting(true);

    try {
      // Format social list so it works for all backends (NKS platform expects type/label/url or social/link)
      const formattedSocial = socialLinks.map(item => ({
        social: item.social,
        link: item.link,
        type: item.social.toLowerCase(),
        label: item.link,
        url: item.link
      }));

      const payload = {
        ...formFields,
        social: JSON.stringify(formattedSocial),
        info: JSON.stringify(infoFields),
        bank: JSON.stringify(bankAccounts),
      };

      const res = await CompanyApiService.updateEcard(token, selectedEcard.code, payload);
      if (res.success) {
        showToast('Đã lưu thông tin Ecard thành công!');
        // Refresh cards list first so we get fresh data
        await loadEcards();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi cập nhật: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload Ecard Avatar File
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && token && selectedEcard) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Data = event.target.result as string;
          setIsSubmitting(true);
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
            setIsSubmitting(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Ecard Banner File
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && token && selectedEcard) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Data = event.target.result as string;
          setIsSubmitting(true);
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
            setIsSubmitting(false);
          }
        }
      };
      reader.readAsDataURL(file);
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
    return 'var(--color-primary)';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-app)' }}>
        <Loader2 size={48} className="fa-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Toast Alert overlay */}
      <div className="nks-toast">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item ${t.type}`}>
            {t.type === 'success' ? (
              <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
            ) : (
              <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
              <i className="fa-solid fa-address-card"></i>
            </div>
            <h1>NKS SECARD</h1>
          </div>

          <div className={styles.headerActions}>
            <Link href="/profile" className="btn-secondary-premium">
              <Smartphone size={16} /> Quản lý Ecard
            </Link>
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-danger)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <LogOut size={16} /> Thoát
            </button>
          </div>
        </header>

        {/* Ecard select tabs */}
        {ecards.length > 0 ? (
          <div className={styles.ecardSelector}>
            {ecards.map((card) => (
              <div
                key={card.code}
                className={`${styles.ecardTab} ${
                  selectedEcard?.code === card.code ? styles.ecardTabActive : ''
                }`}
                onClick={() => handleSelectEcard(card.code)}
              >
                <i className="fa-regular fa-id-badge"></i>
                <span>
                  {card.firstname} {card.lastname} ({card.code})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Bạn chưa có chiếc Ecard nào được đăng ký trên hệ thống.</span>
          </div>
        )}

        {/* Main Workspace */}
        {selectedEcard && (
          <div className={styles.grid}>
            {/* Left Column: Ecard Preview Card (matching the screenshot layout) */}
            <div className={styles.previewPanel}>
              <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Smartphone size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>XEM TRƯỚC GIAO DIỆN ECARD</span>
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
                      <div style={{ width: '100%', height: '100%', background: '#e5e7eb' }}></div>
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
                      {formFields.firstname} {formFields.lastname}
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

                  {/* Contact Info List (Preceded by gold circular icon badges) */}
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
                      <h4 style={{ fontSize: '0.8rem', textAlign: 'left', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px' }}>TÀI KHOẢN GIAO DỊCH</h4>
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>
                            <span>{item.bank}</span>
                            <span style={{ color: formFields.color }}>BANK CARD</span>
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827', letterSpacing: '1px' }}>{item.number}</div>
                          <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>{item.account}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* QR Code Section */}
                  <div className={styles.qrSection}>
                    <div className={styles.qrImageContainer}>
                      <i className="fa-solid fa-qrcode" style={{ fontSize: '2rem', color: '#2563eb' }}></i>
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

            {/* Right Column: Editor form */}
            <form onSubmit={handleUpdateEcard} className={`${styles.editorCard} glass-panel`} style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                  Thiết kế Ecard ({selectedEcard.code})
                </h2>
                <button type="submit" className="btn-premium" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="fa-spin" /> : <Save size={16} />}
                  Lưu thay đổi
                </button>
              </div>

              {isLoadingDetails ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <Loader2 size={32} className="fa-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
              ) : (
                <>
                  {/* Section 1: Basic details */}
                  <div className={styles.formSection}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => setActiveSection(activeSection === 'basic' ? null : 'basic')}
                    >
                      <span className={styles.sectionTitle}>
                        <User size={18} /> Thông tin liên hệ
                      </span>
                      {activeSection === 'basic' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'basic' && (
                      <div className={styles.sectionBody}>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '16px' }}>
                           <div className="form-group">
                            <label className="form-label">Danh xưng</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Mr/Ms"
                              value={formFields.title}
                              onChange={(e) => setFormFields({ ...formFields, title: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Họ / Tên đệm</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Nguyễn"
                              value={formFields.lastname}
                              onChange={(e) => setFormFields({ ...formFields, lastname: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Tên</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Văn A"
                              value={formFields.firstname}
                              onChange={(e) => setFormFields({ ...formFields, firstname: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                          <div className="form-group">
                            <label className="form-label">Slogan cá nhân / Châm ngôn</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Kết nối sức mạnh - Dẫn bước thành công"
                              value={formFields.slogan}
                              onChange={(e) => setFormFields({ ...formFields, slogan: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Loại tài khoản</label>
                            <select
                              className="form-input"
                              value={formFields.type}
                              onChange={(e) => setFormFields({ ...formFields, type: e.target.value })}
                              style={{ background: '#000', cursor: 'pointer' }}
                            >
                              <option value="personal">Cá nhân</option>
                              <option value="business">Doanh nghiệp</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group">
                            <label className="form-label">Công ty</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="NKS Group"
                              value={formFields.company}
                              onChange={(e) => setFormFields({ ...formFields, company: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Chức vụ / Vị trí</label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Giám đốc công nghệ"
                              value={formFields.position}
                              onChange={(e) => setFormFields({ ...formFields, position: e.target.value })}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div className="form-group">
                            <label className="form-label">Email hiển thị</label>
                            <input
                              type="email"
                              className="form-input"
                              placeholder="email@domain.com"
                              value={formFields.email}
                              onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Số điện thoại liên hệ</label>
                            <input
                              type="tel"
                              className="form-input"
                              placeholder="0912345678"
                              value={formFields.phone}
                              onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Website</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="https://nks.vn"
                            value={formFields.website}
                            onChange={(e) => setFormFields({ ...formFields, website: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Địa chỉ làm việc</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="123 Đường ABC, Quận 1, TP. HCM"
                            value={formFields.address}
                            onChange={(e) => setFormFields({ ...formFields, address: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Themes & style settings */}
                  <div className={styles.formSection}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => setActiveSection(activeSection === 'theme' ? null : 'theme')}
                    >
                      <span className={styles.sectionTitle}>
                        <Settings size={18} /> Giao diện & Chủ đề
                      </span>
                      {activeSection === 'theme' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'theme' && (
                      <div className={styles.sectionBody}>
                        <div className="form-group">
                          <label className="form-label">Chọn phong cách thiết kế</label>
                          <div className={styles.themeGrid}>
                            <div
                              className={`${styles.themeOption} ${
                                formFields.style === 'SBC000' ? styles.themeOptionActive : ''
                              }`}
                              onClick={() => setFormFields({ ...formFields, style: 'SBC000' })}
                            >
                              SBC000 (Đơn giản)
                            </div>
                            <div
                              className={`${styles.themeOption} ${
                                formFields.style === 'SBC001' ? styles.themeOptionActive : ''
                              }`}
                              onClick={() => setFormFields({ ...formFields, style: 'SBC001' })}
                            >
                              SBC001 (Gradient)
                            </div>
                            <div
                              className={`${styles.themeOption} ${
                                formFields.style === 'SBC002' ? styles.themeOptionActive : ''
                              }`}
                              onClick={() => setFormFields({ ...formFields, style: 'SBC002' })}
                            >
                              SBC002 (Glow)
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Màu sắc chủ đề chính</label>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <input
                              type="color"
                              className="form-input"
                              value={formFields.color}
                              onChange={(e) => setFormFields({ ...formFields, color: e.target.value })}
                              style={{ width: '60px', height: '40px', padding: '0', cursor: 'pointer' }}
                            />
                            <span>{formFields.color}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Social Links */}
                  <div className={styles.formSection}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => setActiveSection(activeSection === 'social' ? null : 'social')}
                    >
                      <span className={styles.sectionTitle}>
                        <Facebook size={18} /> Liên kết mạng xã hội
                      </span>
                      {activeSection === 'social' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'social' && (
                      <div className={styles.sectionBody}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {socialLinks.map((item, idx) => (
                            <div key={idx} className={styles.dynamicRow}>
                              <select
                                className="form-input"
                                value={item.social}
                                onChange={(e) => updateSocialLink(idx, 'social', e.target.value)}
                                style={{ background: '#000', cursor: 'pointer', width: '130px' }}
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
                                className="form-input"
                                placeholder="Link hoặc số điện thoại..."
                                value={item.link}
                                onChange={(e) => updateSocialLink(idx, 'link', e.target.value)}
                                style={{ flex: '1' }}
                              />
                              <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeSocialLink(idx)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn-secondary-premium"
                          onClick={addSocialLink}
                          style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                        >
                          <Plus size={16} /> Thêm liên kết mạng xã hội
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 4: Bio / Info blocks */}
                  <div className={styles.formSection}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => setActiveSection(activeSection === 'info' ? null : 'info')}
                    >
                      <span className={styles.sectionTitle}>
                        <Globe size={18} /> Các mục giới thiệu (Bio / Dịch vụ)
                      </span>
                      {activeSection === 'info' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'info' && (
                      <div className={styles.sectionBody}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {infoFields.map((item, idx) => (
                            <div key={idx} className={styles.dynamicRow} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="Nhãn (ví dụ: bio, Dịch vụ, Giới thiệu)"
                                  value={item.label}
                                  onChange={(e) => updateInfoField(idx, 'label', e.target.value)}
                                  style={{ fontWeight: 'bold', width: '200px' }}
                                />
                                <button
                                  type="button"
                                  className={styles.removeBtn}
                                  onClick={() => removeInfoField(idx)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <textarea
                                className="form-input"
                                placeholder="Nội dung hiển thị chi tiết..."
                                rows={2}
                                value={item.content}
                                onChange={(e) => updateInfoField(idx, 'content', e.target.value)}
                                style={{ resize: 'vertical' }}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn-secondary-premium"
                          onClick={addInfoField}
                          style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                        >
                          <Plus size={16} /> Thêm mục giới thiệu
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 5: Bank accounts */}
                  <div className={styles.formSection}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => setActiveSection(activeSection === 'bank' ? null : 'bank')}
                    >
                      <span className={styles.sectionTitle}>
                        <CreditCard size={18} /> Tài khoản ngân hàng (Nhận tiền)
                      </span>
                      {activeSection === 'bank' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'bank' && (
                      <div className={styles.sectionBody}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {bankAccounts.map((item, idx) => (
                            <div key={idx} className={styles.dynamicRow} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                                <select
                                  className="form-input"
                                  value={item.bank}
                                  onChange={(e) => updateBankAccount(idx, 'bank', e.target.value)}
                                  style={{ background: '#000', cursor: 'pointer', width: '200px' }}
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
                                  className={styles.removeBtn}
                                  onClick={() => removeBankAccount(idx)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  placeholder="Chủ tài khoản (viết hoa không dấu)"
                                  value={item.account}
                                  onChange={(e) => updateBankAccount(idx, 'account', e.target.value.toUpperCase())}
                                  required
                                />
                                <input
                                  type="text"
                                  className="form-input"
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
                          className="btn-secondary-premium"
                          onClick={addBankAccount}
                          style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                        >
                          <Plus size={16} /> Thêm tài khoản ngân hàng
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Section 6: Assets upload (Avatar & Banner) */}
                  <div className={styles.formSection}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => setActiveSection(activeSection === 'assets' ? null : 'assets')}
                    >
                      <span className={styles.sectionTitle}>
                        <ImageIcon size={18} /> Ảnh đại diện & Ảnh bìa Ecard
                      </span>
                      {activeSection === 'assets' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                    {activeSection === 'assets' && (
                      <div className={styles.sectionBody}>
                        <div className={styles.imageUploaders}>
                          {/* Avatar Upload */}
                          <div className={styles.avatarUpload} onClick={() => avatarInputRef.current?.click()}>
                            <input
                              type="file"
                              ref={avatarInputRef}
                              onChange={handleAvatarUpload}
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={isSubmitting}
                            />
                            {selectedEcard.avatar ? (
                              <img
                                src={getAvatarUrl(selectedEcard.avatar)}
                                alt="Avatar Ecard"
                                className={styles.uploadedPreview}
                              />
                            ) : (
                              <Camera size={24} style={{ color: 'var(--text-dim)' }} />
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tải Avatar</span>
                          </div>

                          {/* Banner Upload */}
                          <div className={styles.bannerUpload} onClick={() => bannerInputRef.current?.click()}>
                            <input
                              type="file"
                              ref={bannerInputRef}
                              onChange={handleBannerUpload}
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={isSubmitting}
                            />
                            {selectedEcard.banner ? (
                              <img
                                src={getAvatarUrl(selectedEcard.banner)}
                                alt="Banner Ecard"
                                className={styles.uploadedBannerPreview}
                              />
                            ) : (
                              <ImageIcon size={24} style={{ color: 'var(--text-dim)' }} />
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tải Ảnh bìa (Banner)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
