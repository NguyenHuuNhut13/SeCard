'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CompanyApiService } from '@/utils/api';
import CccdScanner from '@/components/CccdScanner';
import AvatarCropper from '@/components/AvatarCropper';
import styles from './profile.module.css';
import Link from 'next/link';
import {
  User,
  CreditCard,
  Image as ImageIcon,
  Key,
  LogOut,
  ChevronLeft,
  Camera,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Eye,
  Edit2,
  Loader2,
  Smartphone,
  Layers,
  Share2
} from 'lucide-react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

export default function ProfilePage() {
  const { user, token, logout, refreshProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'ecards' | 'personal' | 'cccd' | 'avatar' | 'password'>('ecards');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [ecards, setEcards] = useState<any[]>([]);
  const [isLoadingEcards, setIsLoadingEcards] = useState(false);
  const [qrModalCard, setQrModalCard] = useState<any | null>(null);

  // 1. Personal Info Tab State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    zalo: '',
  });

  // 2. CCCD Tab State
  const [showScanner, setShowScanner] = useState(false);
  const [cccdForm, setCccdForm] = useState({
    cccd: '',
    name: '',
    gender: 'Nam',
    dob: '',
    address: '',
    issue_date: '',
    issue_place: '',
  });
  const [isSavingCccd, setIsSavingCccd] = useState(false);

  // 3. Avatar Tab State
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // 4. Password Tab State
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Load user data into form states on mount or user change
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        zalo: user.zalo || '',
      });

      setCccdForm({
        cccd: user.cccd || '',
        name: user.name || '',
        gender: user.gender || 'Nam',
        dob: user.dob || '',
        address: user.address || '',
        issue_date: user.issue_date || '',
        issue_place: user.issue_place || '',
      });
    }
  }, [user]);

  // Load Ecards list for Ecards tab
  useEffect(() => {
    if (token && activeTab === 'ecards') {
      const fetchEcards = async () => {
        setIsLoadingEcards(true);
        try {
          const res = await CompanyApiService.getEcards(token);
          if (res.success) {
            setEcards(res.ecards || []);
          } else {
            showToast(res.message, 'error');
          }
        } catch (err: any) {
          showToast('Lỗi tải danh sách Ecard: ' + err.message, 'error');
        } finally {
          setIsLoadingEcards(false);
        }
      };
      fetchEcards();
    }
  }, [token, activeTab]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Helper for reading Local/Remote Avatar URLs
  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath || avatarPath.includes('default.png')) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    return `https://account.nks.vn/storage/${avatarPath}`; // NKS API server path
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const res = await CompanyApiService.updateProfile(token, {
        name: profileForm.name,
        phone: profileForm.phone,
        zalo: profileForm.zalo,
      });

      if (res.success) {
        showToast('Đã cập nhật thông tin cá nhân thành công!');
        await refreshProfile();
        setIsEditingProfile(false);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Không thể kết nối tới server: ' + err.message, 'error');
    }
  };

  // Save CCCD (Manual or Scanned)
  const handleSaveCccd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingCccd(true);

    try {
      // Sync names first if they differ
      if (cccdForm.name !== (user?.name || '')) {
        await CompanyApiService.updateProfile(token, {
          name: cccdForm.name,
          phone: profileForm.phone,
          zalo: profileForm.zalo,
        });
      }

      const res = await CompanyApiService.updateCccd(token, {
        cccd: cccdForm.cccd,
        issue_date: cccdForm.issue_date,
        address: cccdForm.issue_place || 'Cục Cảnh sát QLHC về TTXH',
        // In client-side flow we can pass base64 if scanned, otherwise undefined
      });

      if (res.success) {
        showToast('Cập nhật thông tin CCCD thành công!');
        await refreshProfile();
        setShowScanner(false);
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Có lỗi xảy ra: ' + err.message, 'error');
    } finally {
      setIsSavingCccd(false);
    }
  };

  // Handle CCCD scanner success
  const handleCccdScanComplete = async (result: any) => {
    setCccdForm({
      cccd: result.cccd,
      name: result.name,
      gender: result.gender,
      dob: result.dob,
      address: result.address,
      issue_date: result.issueDate,
      issue_place: result.issuePlace,
    });
    
    showToast('Trích xuất dữ liệu CCCD thành công! Nhấp "Lưu thông tin" để gửi lên hệ thống.', 'success');
    setShowScanner(false);

    // Automatically push images to NKS if token is present
    if (token) {
      try {
        await CompanyApiService.updateCccd(token, {
          cccd: result.cccd,
          issue_date: result.issueDate,
          address: result.issuePlace,
          front_base64: result.frontBase64,
          back_base64: result.backBase64,
        });
        showToast('Đồng bộ ảnh CCCD lên máy chủ thành công!');
        await refreshProfile();
      } catch (err) {
        console.error('Error syncing CCCD images:', err);
      }
    }
  };

  // Select File for Avatar Crop
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCropperSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Crop Complete - submit base64 directly to API
  const handleCropComplete = async (base64Data: string) => {
    if (!token) return;
    setCropperSrc(null);
    setIsUploadingAvatar(true);

    try {
      const res = await CompanyApiService.updateAvatar(token, base64Data);
      if (res.success) {
        showToast('Cập nhật ảnh đại diện thành công!');
        await refreshProfile();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Lỗi cập nhật ảnh đại diện: ' + err.message, 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Change Password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      showToast('Xác nhận mật khẩu mới không khớp.', 'error');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await CompanyApiService.updatePassword(
        token,
        passwordForm.old_password,
        passwordForm.new_password
      );

      if (res.success) {
        showToast('Thay đổi mật khẩu thành công!');
        setPasswordForm({
          old_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast('Có lỗi xảy ra: ' + err.message, 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className={styles.container}>
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

      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <ChevronLeft size={28} />
          </div>
          <div>
            <h2>Quay về Trang chủ</h2>
          </div>
        </Link>
        
        {user && (
          <div className={styles.userMenu}>
            <img
              src={getAvatarUrl(user.avatar)}
              alt={user.name}
              className={styles.userAvatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
              }}
            />
            <span className={styles.userName}>{user.name}</span>
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
        )}
      </header>

      {/* Main Profile Grid */}
      <div className={styles.profileGrid}>
        {/* Sidebar Nav */}
        <div className={`${styles.sidebar} glass-panel`} style={{ padding: '16px' }}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'ecards' ? styles.tabBtnActive : ''}`}
            onClick={() => { setActiveTab('ecards'); setShowScanner(false); }}
          >
            <Smartphone size={18} /> Quản lý Ecard
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'personal' ? styles.tabBtnActive : ''}`}
            onClick={() => { setActiveTab('personal'); setShowScanner(false); }}
          >
            <User size={18} /> Thông tin cá nhân
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'cccd' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('cccd')}
          >
            <CreditCard size={18} /> Căn cước công dân (CCCD)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'avatar' ? styles.tabBtnActive : ''}`}
            onClick={() => { setActiveTab('avatar'); setShowScanner(false); }}
          >
            <ImageIcon size={18} /> Ảnh đại diện (Avatar)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'password' ? styles.tabBtnActive : ''}`}
            onClick={() => { setActiveTab('password'); setShowScanner(false); }}
          >
            <Key size={18} /> Thay đổi mật khẩu
          </button>
        </div>

        {/* Tab content panel */}
        <div className={`${styles.contentCard} glass-panel`}>
          {/* TAB: ECARDS LIST */}
          {activeTab === 'ecards' && (
            <div className="animate-fade-in-up">
              <div className={styles.sectionHeader}>
                <h3>Danh sách Ecard của bạn</h3>
              </div>

              {isLoadingEcards ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                  <Loader2 size={36} className="fa-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
              ) : ecards.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                  Không tìm thấy Ecard nào. Vui lòng liên hệ quản trị viên để cấp Ecard.
                </div>
              ) : (
                <div className={styles.cardGrid}>
                  {ecards.map((card) => (
                    <div
                      key={card.id}
                      className={styles.ecardCard}
                    >
                      <div className={`${styles.cardStatus} ${card.status === 'PUBLISHED' ? styles.statusPublished : styles.statusDraft}`}>
                        {card.status === 'PUBLISHED' ? 'Đang bật' : 'Nháp'}
                      </div>
                      
                      <img
                        src={card.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                        alt={card.title}
                        className={styles.cardAvatar}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                        }}
                      />
                      
                      <div className={styles.cardInfo}>
                        <div className={styles.cardTitle}>{card.firstname} {card.lastname}</div>
                        <div className={styles.cardSubtitle}>{card.position || 'Chưa cập nhật chức vụ'}</div>
                        <div className={styles.cardCompany}>{card.company || 'NKS'}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <Link
                          href={`/dashboard?code=${card.code}`}
                          className="btn-premium"
                          style={{ width: '100%', fontSize: '0.85rem', padding: '8px 16px', textDecoration: 'none', textAlign: 'center' }}
                        >
                          Chỉnh sửa Ecard
                        </Link>
                        
                        <button
                          onClick={() => setQrModalCard(card)}
                          className="btn-secondary-premium"
                          style={{ width: '100%', fontSize: '0.85rem', padding: '8px 16px', display: 'flex', justifyContent: 'center', gap: '6px' }}
                        >
                          <Share2 size={14} /> Mã QR & Chia sẻ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <form onSubmit={handleSaveProfile} className="animate-fade-in-up">
              <div className={styles.sectionHeader}>
                <h3>Thông tin cá nhân</h3>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    className="btn-secondary-premium"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <Edit2 size={16} /> Chỉnh sửa
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary-premium"
                      onClick={() => {
                        setIsEditingProfile(false);
                        if (user) {
                          setProfileForm({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            zalo: user.zalo || '',
                          });
                        }
                      }}
                    >
                      Hủy bỏ
                    </button>
                    <button type="submit" className="btn-premium">
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGrid} style={{ marginTop: '24px' }}>
                <div className="form-group">
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    disabled={!isEditingProfile}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    disabled // Email usually non-editable
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Ví dụ: 0912345678"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số Zalo / Link Zalo</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ví dụ: 0912345678"
                    value={profileForm.zalo}
                    onChange={(e) => setProfileForm({ ...profileForm, zalo: e.target.value })}
                    disabled={!isEditingProfile}
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: CCCD INFO */}
          {activeTab === 'cccd' && (
            <div className="animate-fade-in-up">
              <div className={styles.sectionHeader}>
                <h3>Căn cước công dân</h3>
                <button
                  type="button"
                  className="btn-premium"
                  onClick={() => setShowScanner(!showScanner)}
                >
                  {showScanner ? 'Nhập thủ công' : 'Quét CCCD (OCR)'}
                </button>
              </div>

              {showScanner ? (
                <div style={{ marginTop: '24px' }}>
                  <CccdScanner
                    onScanComplete={handleCccdScanComplete}
                    onScanError={(err) => showToast(err, 'error')}
                  />
                </div>
              ) : (
                <form onSubmit={handleSaveCccd} style={{ marginTop: '24px' }}>
                  {cccdForm.cccd ? (
                    <div className={styles.cccdStatus} style={{ marginBottom: '24px' }}>
                      <CheckCircle size={18} />
                      <span>Thông tin Căn cước công dân đã được đồng bộ lên hệ thống.</span>
                    </div>
                  ) : (
                    <div className={styles.cccdStatusPending} style={{ marginBottom: '24px' }}>
                      <HelpCircle size={18} />
                      <span>Bạn chưa hoàn tất định danh thẻ thành viên. Chọn quét CCCD để cập nhật.</span>
                    </div>
                  )}

                  <div className={styles.formGrid}>
                    <div className="form-group">
                      <label className="form-label">Số Căn cước công dân (CCCD)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Số CCCD gồm 12 chữ số"
                        maxLength={15}
                        value={cccdForm.cccd}
                        onChange={(e) => setCccdForm({ ...cccdForm, cccd: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Họ và tên trên CCCD</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="NGUYỄN VĂN A"
                        value={cccdForm.name}
                        onChange={(e) => setCccdForm({ ...cccdForm, name: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Giới tính</label>
                      <select
                        className={styles.formSelect}
                        value={cccdForm.gender}
                        onChange={(e) => setCccdForm({ ...cccdForm, gender: e.target.value })}
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ngày sinh</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="DD/MM/YYYY (Ví dụ: 15/08/1995)"
                        value={cccdForm.dob}
                        onChange={(e) => setCccdForm({ ...cccdForm, dob: e.target.value })}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Nơi thường trú</label>
                      <textarea
                        className="form-input"
                        placeholder="Địa chỉ ghi trên thẻ CCCD"
                        rows={2}
                        value={cccdForm.address}
                        onChange={(e) => setCccdForm({ ...cccdForm, address: e.target.value })}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Ngày cấp</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="DD/MM/YYYY (Ví dụ: 20/10/2021)"
                        value={cccdForm.issue_date}
                        onChange={(e) => setCccdForm({ ...cccdForm, issue_date: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nơi cấp</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Cục Cảnh sát QLHC về TTXH"
                        value={cccdForm.issue_place}
                        onChange={(e) => setCccdForm({ ...cccdForm, issue_place: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="submit"
                      className="btn-premium"
                      disabled={isSavingCccd}
                      style={{ minWidth: '150px' }}
                    >
                      {isSavingCccd ? (
                        <>
                          <Loader2 size={16} className="fa-spin" /> Đang cập nhật...
                        </>
                      ) : (
                        'Lưu thông tin'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: AVATAR UPDATE */}
          {activeTab === 'avatar' && (
            <div className={`${styles.avatarSection} animate-fade-in-up`}>
              <div className={styles.sectionHeader} style={{ width: '100%' }}>
                <h3>Ảnh đại diện thành viên</h3>
              </div>

              <div className={styles.avatarContainer}>
                {isUploadingAvatar ? (
                  <div
                    className={styles.avatarImageLarge}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <Loader2 size={40} className="fa-spin" style={{ color: 'var(--color-primary)' }} />
                  </div>
                ) : (
                  <>
                    <img
                      src={getAvatarUrl(user?.avatar)}
                      alt={user?.name}
                      className={styles.avatarImageLarge}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                      }}
                    />
                    <div
                      className={styles.uploadOverlay}
                      onClick={() => fileInputRef.current?.click()}
                      title="Chọn ảnh đại diện mới"
                    >
                      <Camera size={18} />
                    </div>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <div className={styles.avatarTip}>
                <p>Nhấp vào biểu tượng camera để tải ảnh mới lên. Bạn có thể phóng to, xoay, chỉnh sửa bộ lọc màu cổ điển trước khi lưu.</p>
                <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Hỗ trợ các tệp PNG, JPG hoặc JPEG có kích thước tối đa 5MB.
                </p>
              </div>

              {/* Avatar Cropper Modal Overlay */}
              {cropperSrc && (
                <AvatarCropper
                  imageSrc={cropperSrc}
                  onCropComplete={handleCropComplete}
                  onClose={() => setCropperSrc(null)}
                />
              )}
            </div>
          )}

          {/* TAB 4: PASSWORD CHANGE */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="animate-fade-in-up">
              <div className={styles.sectionHeader}>
                <h3>Thay đổi mật khẩu tài khoản</h3>
              </div>

              <div className={styles.formGrid} style={{ marginTop: '24px', maxWidth: '500px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={passwordForm.old_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Tối thiểu 6 ký tự"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={passwordForm.new_password_confirmation}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.buttonRow} style={{ justifyContent: 'flex-start', maxWidth: '500px' }}>
                <button
                  type="submit"
                  className="btn-premium"
                  disabled={isChangingPass}
                  style={{ minWidth: '150px' }}
                >
                  {isChangingPass ? (
                    <>
                      <Loader2 size={16} className="fa-spin" /> Đang cập nhật...
                    </>
                  ) : (
                    'Đổi mật khẩu'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalCard && (
        <div className={styles.modalOverlay} onClick={() => setQrModalCard(null)}>
          <div className={`${styles.modalContent} glass-panel`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Mã QR Ecard</h3>
              <button className={styles.closeBtn} onClick={() => setQrModalCard(null)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/c/${qrModalCard.code}`
                    : `http://localhost:3000/c/${qrModalCard.code}`
                )}`}
                alt="QR Code"
                className={styles.qrImage}
              />
              
              <div className={styles.qrUrlBox}>
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? `${window.location.origin}/c/${qrModalCard.code}` : ''}
                  className="form-input"
                  style={{ fontSize: '0.85rem' }}
                />
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/c/${qrModalCard.code}`;
                    navigator.clipboard.writeText(url);
                    showToast('Đã sao chép liên kết Ecard!');
                  }}
                  className="btn-premium"
                  style={{ padding: '10px 14px' }}
                >
                  Chép
                </button>
              </div>
              
              <p className={styles.qrTip}>
                Quét mã QR này bằng Camera điện thoại hoặc Zalo để mở nhanh Ecard của {qrModalCard.firstname} {qrModalCard.lastname}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
