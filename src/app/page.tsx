'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './landing.module.css';
import Link from 'next/link';
import {
  Smartphone,
  ShieldCheck,
  Cpu,
  Zap,
  Share2,
  LogOut,
  ArrowRight,
  User,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const { token, user, logout } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <div className={styles.landing}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <Smartphone size={28} />
          </div>
          <h1>NKS SECARD</h1>
        </Link>
        
        <div className={styles.navActions}>
          <button
            onClick={toggleTheme}
            className="btn-secondary-premium"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              padding: 0,
              borderRadius: '12px',
              cursor: 'pointer',
            }}
            title={theme === 'dark' ? 'Chuyển sang Chế độ sáng' : 'Chuyển sang Chế độ tối'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {token ? (
            <>
              <Link href="/profile" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Quản lý Ecard
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
            </>
          ) : (
            <Link href="/login" className="btn-premium">
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Zap size={14} /> Danh thiếp thông minh NFC thế hệ mới
          </div>
          
          <h2 className={styles.heroTitle}>
            Kết nối danh tính <span>Chuyên nghiệp</span> chỉ với 1 chạm
          </h2>
          
          <p className={styles.heroDesc}>
            Giải pháp danh thiếp điện tử NKS Secard giúp bạn chia sẻ thông tin liên hệ, mạng xã hội, định danh cá nhân CCCD và tài khoản ngân hàng tức thì, nâng tầm phong cách chuyên nghiệp.
          </p>

          <div className={styles.heroBtns}>
            {token ? (
              <Link href="/profile" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px' }}>
                Vào Quản lý Ecard <ArrowRight size={18} />
              </Link>
            ) : (
              <Link href="/login" className="btn-premium" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px' }}>
                Đăng ký & Đăng nhập ngay <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.cardMockup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className={styles.mockupLogo}>NKS Secard</div>
              <div style={{ color: 'var(--color-primary)', opacity: 0.8 }}>
                <Share2 size={24} />
              </div>
            </div>
            
            <div className={styles.mockupChip}></div>
            
            <div className={styles.mockupDetails}>
              <div className={styles.mockupName}>
                {token && user ? user.name : 'Nguyễn Hữu Nhựt'}
              </div>
              <div className={styles.mockupTitle}>
                Leader / Product Owner
              </div>
            </div>
            
            <div className={styles.mockupFooter}>
              <span>NKS TECHNOLOGY CO., LTD</span>
              <span>NFC INTEGRATED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className={styles.features}>
        <h3 className={styles.sectionTitle}>
          Tính năng <span>Vượt trội</span>
        </h3>
        
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Zap size={24} />
            </div>
            <h4 className={styles.featureName}>Chia sẻ nhanh 1 chạm</h4>
            <p className={styles.featureDesc}>
              Tích hợp công nghệ NFC và mã QR, chỉ cần chạm nhẹ vào điện thoại đối tác là toàn bộ thông tin cá nhân sẽ được chia sẻ tự động.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <ShieldCheck size={24} />
            </div>
            <h4 className={styles.featureName}>Định danh CCCD (OCR)</h4>
            <p className={styles.featureDesc}>
              Tính năng quét OCR thông minh giúp nhận diện và đồng bộ thông tin Căn cước công dân trực tiếp lên thẻ ecard cực kỳ tiện lợi và bảo mật.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Cpu size={24} />
            </div>
            <h4 className={styles.featureName}>Tự do cá nhân hóa</h4>
            <p className={styles.featureDesc}>
              Dễ dàng cập nhật ảnh đại diện, ảnh bìa, màu chủ đề thẻ, thông tin tài khoản ngân hàng và các liên kết mạng xã hội bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 NKS Secard System. Tất cả các quyền được bảo lưu.</p>
      </footer>
    </div>
  );
}
