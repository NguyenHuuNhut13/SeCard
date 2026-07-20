'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CompanyApiService } from '@/utils/api';
import CccdScanner from '@/components/CccdScanner';
import AvatarCropper from '@/components/AvatarCropper';
import Link from 'next/link';
import {
  User,
  CreditCard,
  Image as ImageIcon,
  Key,
  Camera,
  CheckCircle,
  AlertCircle,
  Edit2,
  Loader2,
  Smartphone,
  Share2,
  ArrowLeft,
  Pencil,
  Facebook,
  Linkedin,
  Instagram
} from 'lucide-react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

// X / Twitter Icon Component
const XIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z" />
  </svg>
);

export default function ProfilePage() {
  const { user, token, refreshProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ecards' | 'personal' | 'cccd' | 'avatar' | 'password'>('personal');
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

  // Load Ecards list on token change
  useEffect(() => {
    if (token) {
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
  }, [token]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Helper for reading Avatar URLs
  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath || avatarPath.includes('default.png')) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    return `https://account.nks.vn/storage/${avatarPath}`;
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

  // Save CCCD
  const handleSaveCccd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSavingCccd(true);

    try {
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
      issue_date: result.issue_date,
      issue_place: result.issue_place || 'Cục Cảnh sát QLHC về TTXH',
    });
    showToast('Đã quét thẻ CCCD thành công! Vui lòng kiểm tra lại thông tin bên dưới.', 'success');
  };

  // Select Avatar file
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

  // Crop Complete
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
        showToast('Đổi mật khẩu tài khoản thành công!');
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

  // Helper to split full name into first and last name
  const parseFullName = (fullName?: string) => {
    if (!fullName) return { firstName: '', lastName: '' };
    const parts = fullName.trim().split(" ");
    if (parts.length <= 1) return { firstName: fullName, lastName: "" };
    const firstName = parts[parts.length - 1];
    const lastName = parts.slice(0, parts.length - 1).join(" ");
    return { firstName, lastName };
  };

  const { firstName, lastName } = parseFullName(user?.name);

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

      {/* Title Header */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>

      {/* VIEW MODE: Exact TailAdmin Demo Layout */}
      {!isEditing ? (
        <div className="space-y-6 animate-fade-in">
          
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="p-5 lg:p-6">
            
            {/* Card Header: Title + Edit Button */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">My Profile</h4>
              <button
                onClick={() => {
                  setActiveTab('personal');
                  setIsEditing(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <Pencil size={14} /> Edit
              </button>
            </div>

            {/* Profile Meta Header (Avatar + Name + Role) */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 flex-shrink-0 bg-gray-50">
                <img
                  src={getAvatarUrl(user?.avatar)}
                  alt={user?.name || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                  }}
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {user?.name || 'Thành viên NKS'}
                </h2>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>Team Member</span>
                  <span className="text-gray-300 dark:text-gray-700">|</span>
                  <span>Việt Nam</span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{firstName || "—"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{lastName || "—"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Email address</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white break-all">{user?.email || "—"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Phone</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.phone || "—"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Bio</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.zalo || "Team Member"}</span>
              </div>

              <div>
                <span className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Social Links</span>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <span className="cursor-pointer hover:text-brand-500 transition-colors" title="Facebook">
                    <Facebook size={16} />
                  </span>
                  <span className="cursor-pointer hover:text-brand-500 transition-colors" title="X / Twitter">
                    <XIcon size={16} />
                  </span>
                  <span className="cursor-pointer hover:text-brand-500 transition-colors" title="LinkedIn">
                    <Linkedin size={16} />
                  </span>
                  <span className="cursor-pointer hover:text-brand-500 transition-colors" title="Instagram">
                    <Instagram size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-5 dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">Address & Identification</h4>
              <button
                onClick={() => {
                  setActiveTab('cccd');
                  setIsEditing(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <Pencil size={14} /> Edit
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Số Căn cước (CCCD)</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.cccd || "Chưa cập nhật / Chưa quét"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Giới tính</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.gender || "Nam"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Ngày sinh</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.dob || "Chưa cập nhật"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Ngày cấp CCCD</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.issue_date || "Chưa cập nhật"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Nơi thường trú (Địa chỉ)</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.address || "Chưa cập nhật"}</span>
              </div>

              <div>
                <span className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400">Nơi cấp</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">{user?.issue_place || "Cục Cảnh sát QLHC về TTXH"}</span>
              </div>
            </div>
          </div>

          {/* CARD 3: MY ECARDS */}
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-white dark:bg-white/[0.03]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">My Ecards</h4>
              <button
                onClick={() => {
                  setActiveTab('ecards');
                  setIsEditing(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <Pencil size={14} /> Edit
              </button>
            </div>

            {isLoadingEcards ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-brand-500" />
              </div>
            ) : ecards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ecards.map((card) => (
                  <div key={card.code} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500/50 transition-all flex gap-4 items-center bg-gray-50/20 dark:bg-white/[0.01]">
                    <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 flex-shrink-0">
                      <img
                        src={getAvatarUrl(card.avatar)}
                        alt="card avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {card.lastname || ''} {card.firstname || ''}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{card.position || 'Chưa thiết lập vị trí'}</p>
                      <p className="text-xs text-brand-500 font-semibold mt-1">Code: {card.code}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <Link
                        href={`/dashboard?code=${card.code}`}
                        className="flex items-center justify-center p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all"
                        title="Thiết kế Ecard"
                      >
                        <Edit2 size={13} />
                      </Link>
                      <button
                        onClick={() => setQrModalCard(card)}
                        className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                        title="Xem mã QR Ecard"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                Bạn chưa sở hữu chiếc Ecard thành viên nào.
              </div>
            )}
          </div>

        </div>
          </div>
        )
      : (
        /* EDIT MODE: Functional Editors Tab Screen */
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-all cursor-pointer"
            >
              <ArrowLeft size={14} /> Quay lại xem hồ sơ
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Side: Profile Summary & Tabs */}
            <div className="lg:col-span-4 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col items-center text-center">
              
              {/* User Large Avatar */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 mb-4 bg-gray-50 flex items-center justify-center">
                <img
                  src={getAvatarUrl(user?.avatar)}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                  }}
                />
              </div>

              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">{user?.name || 'Thành viên NKS'}</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">{user?.email || 'email@domain.com'}</p>

              {/* Navigation Tabs List */}
              <div className="w-full flex flex-col gap-1 border-t border-gray-100 dark:border-gray-800/60 pt-4 text-left">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'personal'
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <User size={16} /> Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('cccd')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'cccd'
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <CreditCard size={16} /> Xác minh căn cước (CCCD)
                </button>
                <button
                  onClick={() => setActiveTab('avatar')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'avatar'
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <ImageIcon size={16} /> Thay đổi Avatar cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'password'
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Key size={16} /> Đổi mật khẩu
                </button>
                <button
                  onClick={() => setActiveTab('ecards')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'ecards'
                      ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <Smartphone size={16} /> Danh sách Ecard
                </button>
              </div>
            </div>

            {/* Right Side: Tab Contents Panel */}
            <div className="lg:col-span-8 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              
              {/* TAB 1: PERSONAL INFO */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin tài khoản</h3>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-all cursor-pointer"
                    >
                      <Edit2 size={12} /> {isEditingProfile ? 'Hủy chỉnh sửa' : 'Chỉnh sửa'}
                    </button>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Họ và tên thành viên</label>
                      <input
                        type="text"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-60"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        disabled={!isEditingProfile}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Địa chỉ Email đăng nhập (Không thể thay đổi)</label>
                      <input
                        type="email"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-50 bg-gray-50 dark:bg-white/[0.02]"
                        value={profileForm.email}
                        disabled
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Số điện thoại liên hệ</label>
                        <input
                          type="tel"
                          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-60"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Zalo ID hoặc Link liên hệ</label>
                        <input
                          type="text"
                          className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 disabled:opacity-60"
                          value={profileForm.zalo}
                          onChange={(e) => setProfileForm({ ...profileForm, zalo: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-all cursor-pointer shadow-theme-xs"
                      >
                        Lưu thông tin cá nhân
                      </button>
                    )}
                  </form>
                </div>
              )}

              {/* TAB 2: CCCD VERIFICATION */}
              {activeTab === 'cccd' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin định danh CCCD</h3>
                    <button
                      type="button"
                      onClick={() => setShowScanner(!showScanner)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition-all cursor-pointer bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-100 dark:border-brand-500/20"
                    >
                      {showScanner ? 'Nhập thủ công' : 'Quét CCCD bằng Camera'}
                    </button>
                  </div>

                  {showScanner ? (
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.01]">
                      <CccdScanner onScanComplete={handleCccdScanComplete} onScanError={(err) => showToast(err, 'error')} />
                    </div>
                  ) : (
                    <form onSubmit={handleSaveCccd} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Số CCCD</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            placeholder="Số CCCD gồm 12 chữ số"
                            maxLength={15}
                            value={cccdForm.cccd}
                            onChange={(e) => setCccdForm({ ...cccdForm, cccd: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Họ và tên trên CCCD</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            placeholder="NGUYỄN VĂN A"
                            value={cccdForm.name}
                            onChange={(e) => setCccdForm({ ...cccdForm, name: e.target.value.toUpperCase() })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Giới tính</label>
                          <select
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 dark:bg-gray-900 bg-white"
                            value={cccdForm.gender}
                            onChange={(e) => setCccdForm({ ...cccdForm, gender: e.target.value })}
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Ngày sinh</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            placeholder="DD/MM/YYYY (Ví dụ: 15/08/1995)"
                            value={cccdForm.dob}
                            onChange={(e) => setCccdForm({ ...cccdForm, dob: e.target.value })}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Nơi thường trú</label>
                          <textarea
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            placeholder="Địa chỉ ghi trên thẻ CCCD"
                            rows={2}
                            value={cccdForm.address}
                            onChange={(e) => setCccdForm({ ...cccdForm, address: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Ngày cấp</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            placeholder="DD/MM/YYYY (Ví dụ: 20/10/2021)"
                            value={cccdForm.issue_date}
                            onChange={(e) => setCccdForm({ ...cccdForm, issue_date: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Nơi cấp</label>
                          <input
                            type="text"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                            placeholder="Cục Cảnh sát QLHC về TTXH"
                            value={cccdForm.issue_place}
                            onChange={(e) => setCccdForm({ ...cccdForm, issue_place: e.target.value })}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-all cursor-pointer shadow-theme-xs"
                        disabled={isSavingCccd}
                      >
                        {isSavingCccd ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Đang cập nhật...
                          </>
                        ) : (
                          'Lưu thông tin định danh'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: MEMBER AVATAR */}
              {activeTab === 'avatar' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ảnh đại diện thành viên</h3>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8 py-4">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      {isUploadingAvatar ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 size={36} className="animate-spin text-white" />
                        </div>
                      ) : (
                        <>
                          <img
                            src={getAvatarUrl(user?.avatar)}
                            alt={user?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                            }}
                          />
                          <div
                            className="absolute bottom-2 right-2 p-2 bg-brand-500 text-white rounded-full cursor-pointer hover:bg-brand-600 transition-all shadow"
                            onClick={() => fileInputRef.current?.click()}
                            title="Chọn ảnh đại diện mới"
                          >
                            <Camera size={16} />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-3 flex-1 text-center md:text-left">
                      <h4 className="font-semibold text-gray-800 dark:text-white/90 text-base">Cập nhật ảnh hồ sơ cá nhân</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Chọn ảnh mới để cắt tỷ lệ vuông (1:1), phóng to, xoay ảnh, và chỉnh sửa bộ lọc màu sắc trước khi lưu làm ảnh đại diện chính thức của bạn.</p>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarFileSelect}
                        accept="image/*"
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 text-sm font-semibold transition-all cursor-pointer shadow-md shadow-brand-500/10"
                        disabled={isUploadingAvatar}
                      >
                        <Camera size={16} /> Chọn file hình ảnh mới
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PASSWORD CHANGE */}
              {activeTab === 'password' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thay đổi mật khẩu tài khoản</h3>
                  </div>

                  <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg mt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                        placeholder="••••••••"
                        value={passwordForm.old_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                        placeholder="••••••••"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 focus:border-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                        placeholder="••••••••"
                        value={passwordForm.new_password_confirmation}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-all cursor-pointer shadow-theme-xs"
                      disabled={isChangingPass}
                    >
                      {isChangingPass ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Đang cập nhật...
                        </>
                      ) : (
                        'Thay đổi mật khẩu'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: ECARDS LIST */}
              {activeTab === 'ecards' && (
                <div className="space-y-4">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Danh sách Ecard của bạn</h3>
                  </div>

                  {isLoadingEcards ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 size={32} className="animate-spin text-brand-500" />
                    </div>
                  ) : ecards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ecards.map((card) => (
                        <div key={card.code} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500/50 transition-all flex gap-4 items-center bg-gray-50/30 dark:bg-transparent">
                          <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 flex-shrink-0">
                            <img
                              src={getAvatarUrl(card.avatar)}
                              alt="card avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {card.lastname || ''} {card.firstname || ''}
                            </h4>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{card.position || 'Chưa thiết lập vị trí'}</p>
                            <p className="text-xs text-brand-500 font-semibold mt-1">Code: {card.code}</p>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Link
                              href={`/dashboard?code=${card.code}`}
                              className="flex items-center justify-center p-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all"
                              title="Thiết kế Ecard"
                            >
                              <Edit2 size={14} />
                            </Link>
                            <button
                              onClick={() => setQrModalCard(card)}
                              className="flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                              title="Xem mã QR Ecard"
                            >
                              <Share2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                      Bạn chưa sở hữu chiếc Ecard thành viên nào.
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* QR Code sharing Modal Overlay */}
      {qrModalCard && (
        <div className="fixed inset-0 z-99999 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-sm w-full flex flex-col items-center gap-4 border border-gray-200 dark:border-gray-800 text-center animate-zoom-in">
            <h4 className="font-bold text-gray-900 dark:text-white text-base">Mã QR Ecard thành viên</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quét để truy cập ngay Ecard cá nhân của {qrModalCard.lastname} {qrModalCard.firstname}.</p>
            
            <div className="p-3 bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800 rounded-2xl">
              <i className="fa-solid fa-qrcode text-9xl text-brand-600"></i>
            </div>
            
            <p className="text-xs font-mono bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-gray-800 select-all">{`https://ecard-nks.vn/c/${qrModalCard.code}`}</p>

            <button
              onClick={() => setQrModalCard(null)}
              className="mt-2 w-full rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}

      {/* Avatar Cropper Modal Overlay */}
      {cropperSrc && (
        <AvatarCropper
          imageSrc={cropperSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setCropperSrc(null)}
          aspectRatio={1}
          title="Cắt ảnh đại diện cá nhân"
        />
      )}
    </div>
  );
}
