'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';
import { Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface SavedAccount {
  email: string;
  name: string;
  avatar: string;
}

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  // Load saved accounts from localStorage on client-side mount
  useEffect(() => {
    try {
      const accountsJson = localStorage.getItem('nks_saved_accounts');
      if (accountsJson) {
        const parsed = JSON.parse(accountsJson);
        if (Array.isArray(parsed)) {
          setSavedAccounts(parsed);
        }
      }

      // Check if remember was checked last time
      const lastUser = localStorage.getItem('nks_last_user_email');
      if (lastUser) {
        setEmail(lastUser);
        setRemember(true);
      }
    } catch (e) {
      console.error('Error reading localStorage', e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message || 'Đăng nhập không thành công.');
      } else {
        // If logged in successfully, save email preference if remember is checked
        if (remember) {
          localStorage.setItem('nks_last_user_email', email);
        } else {
          localStorage.removeItem('nks_last_user_email');
        }
      }
    } catch (err: any) {
      setError('Lỗi hệ thống: ' + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (account: SavedAccount) => {
    setEmail(account.email);
    setError(null);
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={`${styles.glow} ${styles.glow1}`}></div>
      <div className={`${styles.glow} ${styles.glow2}`}></div>

      <div className={`${styles.cardWrapper} animate-fade-in-up`}>
        {/* Brand Header */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <i className="fa-solid fa-address-card"></i>
          </div>
          <h1>NKS SECARD</h1>
          <p>Hệ thống Thẻ Thành Viên & Ecard Điện Tử</p>
        </div>

        {/* Login Card */}
        <div className={styles.loginCard}>
          {/* Quick Login Section */}
          {savedAccounts.length > 0 && (
            <div className={styles.savedAccountsSection}>
              <h3 className={styles.savedAccountsTitle}>Đăng nhập nhanh</h3>
              <div className={styles.accountsList}>
                {savedAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className={styles.accountCard}
                    onClick={() => handleQuickLogin(account)}
                    title={`Chọn ${account.name}`}
                  >
                    <div className={styles.accountInfo}>
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className={styles.avatar}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
                        }}
                      />
                      <div className={styles.accountDetails}>
                        <span className={styles.accountName}>{account.name}</span>
                        <span className={styles.accountEmail}>{account.email}</span>
                      </div>
                    </div>
                    <UserCheck className={styles.quickLoginIcon} />
                  </div>
                ))}
              </div>
              <div className={styles.divider}>Hoặc bằng tài khoản khác</div>
            </div>
          )}

          {/* Form */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle className={styles.errorIcon} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Tài khoản / Email
              </label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  type="email"
                  className={`form-input ${styles.inputWithIcon}`}
                  placeholder="name@nks.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Mật khẩu
              </label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  ref={passwordRef}
                  type="password"
                  className={`form-input ${styles.inputWithIcon}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className={styles.rememberRow}>
              <label className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={isSubmitting}
                />
                Ghi nhớ tài khoản
              </label>
              <a href="#" className={styles.forgotLink} onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ quản trị viên qua Zalo để lấy lại mật khẩu.'); }}>
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="btn-premium"
              disabled={isSubmitting}
              style={{ width: '100%', gap: '10px' }}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Đang xác thực...
                </>
              ) : (
                <>
                  Đăng Nhập <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
