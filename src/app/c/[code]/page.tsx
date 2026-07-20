'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './card.module.css';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Share2,
  Copy,
  Check,
  UserPlus,
  Info,
  CreditCard,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Smartphone
} from 'lucide-react';

export default function PublicCardView() {
  const params = useParams();
  const code = params.code as string;

  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Load Ecard details
  useEffect(() => {
    if (code) {
      const fetchCardDetails = async () => {
        try {
          const res = await fetch('https://account.nks.vn/api/nks/user/ecard/show', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          const result = await res.json();
          if (result.success && result.data) {
            setCard(result.data);
          } else {
            setError(result.message || 'Không tìm thấy thông tin danh thiếp.');
          }
        } catch (err: any) {
          setError(err.message || 'Lỗi kết nối máy chủ.');
        } finally {
          setLoading(false);
        }
      };
      fetchCardDetails();
    }
  }, [code]);

  // Helper for reading Local/Remote Avatar URLs
  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath || avatarPath.includes('default.png')) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    return `https://account.nks.vn/storage/${avatarPath}`;
  };

  // Helper for Banner URLs
  const getBannerUrl = (bannerPath?: string) => {
    if (!bannerPath) {
      return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
    }
    if (bannerPath.startsWith('http://') || bannerPath.startsWith('https://')) {
      return bannerPath;
    }
    return `https://account.nks.vn/storage/${bannerPath}`;
  };

  // Generate and download vCard (.vcf file)
  const handleSaveContact = () => {
    if (!card) return;

    const firstName = card.firstname || '';
    const lastName = card.lastname || '';
    const name = `${firstName} ${lastName}`.trim();
    
    // Construct VCard string
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${name}
ORG:${card.company || 'NKS'}
TITLE:${card.position || ''}
TEL;TYPE=CELL:${card.phone || ''}
EMAIL;TYPE=PREF,INTERNET:${card.email || ''}
URL:${card.website || ''}
ADR;TYPE=WORK:;;${card.address || ''};;;;
NOTE:${card.slogan || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${firstName.replace(/\s+/g, '_')}_${lastName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy bank account number
  const handleCopyBank = (number: string, index: number) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  if (loading) {
    return (
      <div className={styles.errorState}>
        <Loader2 size={44} className="fa-spin" style={{ color: 'var(--color-primary)' }} />
        <p>Đang tải danh thiếp thông minh...</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className={styles.errorState}>
        <AlertTriangle size={48} style={{ color: 'var(--color-danger)' }} />
        <h3>Lỗi tải danh thiếp</h3>
        <p>{error || 'Thông tin thẻ không tồn tại hoặc đã bị ẩn.'}</p>
        <Link href="/" className="btn-premium" style={{ marginTop: '16px' }}>
          Quay lại Trang chủ
        </Link>
      </div>
    );
  }

  // Parse Dynamic lists
  // Social
  let socialLinks: any[] = [];
  if (typeof card.social === 'string') {
    try { socialLinks = JSON.parse(card.social); } catch(e) {}
  } else if (Array.isArray(card.social)) {
    socialLinks = card.social;
  }
  
  // Info
  let infoFields: any[] = [];
  if (typeof card.info === 'string') {
    try { infoFields = JSON.parse(card.info); } catch(e) {}
  } else if (Array.isArray(card.info)) {
    infoFields = card.info;
  }

  // Bank
  let bankAccounts: any[] = [];
  if (typeof card.bank === 'string') {
    try { bankAccounts = JSON.parse(card.bank); } catch(e) {}
  } else if (Array.isArray(card.bank)) {
    bankAccounts = card.bank;
  }

  const themeColor = card.color || '#6366f1';

  return (
    <div className={styles.cardPage}>
      <div className={styles.cardContainer} style={{ '--theme-color': themeColor } as React.CSSProperties}>
        {/* Banner & Avatar */}
        <div className={styles.headerArea}>
          <img
            src={getBannerUrl(card.banner)}
            alt="Card Banner"
            className={styles.bannerImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className={styles.avatarWrapper}>
            <img
              src={getAvatarUrl(card.avatar)}
              alt={`${card.lastname} ${card.firstname}`}
              className={styles.avatarImage}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
              }}
            />
          </div>
        </div>

        {/* User Info */}
        <div className={styles.profileInfo}>
          <h2 className={styles.fullName}>{card.lastname} {card.firstname}</h2>
          <div className={styles.position}>{card.position || 'Chuyên viên'}</div>
          <div className={styles.company}>{card.company || 'NKS'}</div>
          {card.slogan && <p className={styles.slogan}>"{card.slogan}"</p>}
        </div>

        {/* Add to Contacts Button */}
        <div className={styles.mainActions}>
          <button onClick={handleSaveContact} className={styles.btnSaveContact}>
            <UserPlus size={18} /> Lưu danh bạ điện thoại
          </button>
        </div>

        {/* Contact Links */}
        <div className={styles.contactGrid}>
          {card.phone && (
            <a href={`tel:${card.phone}`} className={styles.contactItem}>
              <div className={styles.contactIcon}><Phone size={20} /></div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Số điện thoại</span>
                <span className={styles.contactVal}>{card.phone}</span>
              </div>
            </a>
          )}

          {card.email && (
            <a href={`mailto:${card.email}`} className={styles.contactItem}>
              <div className={styles.contactIcon}><Mail size={20} /></div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Địa chỉ Email</span>
                <span className={styles.contactVal}>{card.email}</span>
              </div>
            </a>
          )}

          {card.website && (
            <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <div className={styles.contactIcon}><Globe size={20} /></div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Trang web / Portfolio</span>
                <span className={styles.contactVal}>{card.website}</span>
              </div>
            </a>
          )}

          {card.address && (
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><MapPin size={20} /></div>
              <div className={styles.contactDetails}>
                <span className={styles.contactLabel}>Địa chỉ văn phòng</span>
                <span className={styles.contactVal}>{card.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* Social Media Link Items */}
        {socialLinks.length > 0 && (
          <div className={styles.socialSection}>
            <h4 className={styles.sectionTitle}>
              <Share2 size={16} /> Liên kết mạng xã hội
            </h4>
            <div className={styles.socialRow}>
              {socialLinks.map((item: any, idx: number) => {
                const link = item.link || item.url || '#';
                if (!link || link === '#') return null;
                const name = item.social || item.type || 'Mạng xã hội';
                return (
                  <a
                    key={idx}
                    href={link.startsWith('http') ? link : `https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                  >
                    <span>{name}</span>
                    <ExternalLink size={12} />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        {bankAccounts.length > 0 && (
          <div className={styles.socialSection}>
            <h4 className={styles.sectionTitle}>
              <CreditCard size={16} /> Thông tin chuyển khoản
            </h4>
            <div className={styles.bankGrid}>
              {bankAccounts.map((acc: any, idx: number) => {
                const bankName = acc.bank || acc.type || 'Ngân hàng';
                const number = acc.number || '';
                const holder = acc.account || acc.label || '';
                if (!number) return null;
                return (
                  <div key={idx} className={styles.bankCard}>
                    <div className={styles.bankInfo}>
                      <span className={styles.bankName}>{bankName}</span>
                      <span className={styles.bankAccNumber}>{number}</span>
                      <span className={styles.bankHolder}>{holder}</span>
                    </div>
                    <button
                      onClick={() => handleCopyBank(number, idx)}
                      className={styles.btnCopy}
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={14} style={{ color: 'var(--color-success)' }} /> Đã chép
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Sao chép
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bio Sections */}
        {infoFields.length > 0 && (
          <div className={styles.socialSection}>
            <h4 className={styles.sectionTitle}>
              <Info size={16} /> Thông tin thêm
            </h4>
            <div className={styles.bioGrid}>
              {infoFields.map((field: any, idx: number) => {
                const label = field.label || 'Mục';
                const content = field.content || '';
                if (!content) return null;
                return (
                  <div key={idx} className={styles.bioItem}>
                    <div className={styles.bioLabel}>{label}</div>
                    <div className={styles.bioContent}>{content}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Powered by Footer */}
        <div className={styles.cardFooter}>
          <Link href="/" className={styles.footerBrand}>
            <Smartphone size={14} /> Powered by NKS Secard
          </Link>
        </div>
      </div>
    </div>
  );
}
