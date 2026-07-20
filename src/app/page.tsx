'use client';

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  Smartphone,
  ShieldCheck,
  Cpu,
  Zap,
  Share2,
  LogOut,
  ArrowRight,
  User,
  Sun,
  Moon
} from "lucide-react";

export default function LandingPage() {
  const { token, user, logout } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Initialize theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
        // match initial html class if possible
        if (document.documentElement.classList.contains("dark")) {
            setTheme("dark");
        }
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white/90 font-outfit overflow-x-hidden selection:bg-brand-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 lg:px-24 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-transparent bg-clip-text">
            <Smartphone size={32} className="text-brand-500" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold font-outfit tracking-wide text-gray-900 dark:text-white">
            NKS SECARD
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title={theme === "dark" ? "Chuyển sang Chế độ sáng" : "Chuyển sang Chế độ tối"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {token ? (
            <>
              <Link href="/profile" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 text-white font-medium hover:bg-brand-600 transition-all shadow-theme-xs">
                <User size={18} /> Quản lý Ecard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold px-2"
              >
                <LogOut size={18} /> <span className="hidden sm:inline">Thoát</span>
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 text-white font-medium hover:bg-brand-600 transition-all shadow-theme-xs">
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 px-6 lg:px-24 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Glow Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-semibold">
            <Zap size={16} /> Danh thiếp thông minh NFC thế hệ mới
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.15]">
            Kết nối danh tính <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
              Chuyên nghiệp
            </span> chỉ với 1 chạm
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Giải pháp danh thiếp điện tử NKS Secard giúp bạn chia sẻ thông tin liên hệ, mạng xã hội, định danh cá nhân CCCD và tài khoản ngân hàng tức thì, nâng tầm phong cách cá nhân và doanh nghiệp.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4">
            {token ? (
              <Link href="/profile" className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-all shadow-theme-md hover:shadow-brand-500/30 hover:-translate-y-1">
                Vào Quản lý Ecard <ArrowRight size={20} />
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-8 py-4 rounded-full bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-all shadow-theme-md hover:shadow-brand-500/30 hover:-translate-y-1">
                Đăng ký & Đăng nhập ngay <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end relative">
          <div className="w-[300px] h-[460px] bg-gradient-to-br from-gray-900 to-black rounded-[32px] border-[6px] border-gray-800 shadow-2xl relative overflow-hidden flex flex-col justify-between p-8 transform transition-transform duration-500 hover:-translate-y-2 hover:rotate-2 hover:shadow-brand-500/20">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="font-outfit font-bold text-lg text-white">NKS Secard</div>
              <Share2 size={24} className="text-brand-400 opacity-80" />
            </div>
            
            <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mt-8 z-10 shadow-inner"></div>
            
            <div className="mt-auto z-10">
              <div className="text-2xl font-bold text-white mb-1">
                {token && user ? user.name : "Nguyễn Hữu Nhựt"}
              </div>
              <div className="text-brand-400 font-medium text-sm">
                Leader / Product Owner
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10 text-[10px] text-gray-400 font-semibold tracking-wider z-10">
              <span>NKS TECHNOLOGY</span>
              <span>NFC INTEGRATED</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 px-6 lg:px-24 max-w-[1400px] mx-auto border-t border-gray-200 dark:border-gray-800">
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Tính năng <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">Vượt trội</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mang đến trải nghiệm kết nối chuyên nghiệp nhất với bộ công cụ đa dạng và mạnh mẽ.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 shadow-theme-xs hover:shadow-theme-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
              <Zap size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Chia sẻ nhanh 1 chạm</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Tích hợp công nghệ thẻ NFC vật lý và mã QR thông minh, chạm là truyền tải mọi thông tin chưa tới 1 giây.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 shadow-theme-xs hover:shadow-theme-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Định danh CCCD (OCR)</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Trí tuệ nhân tạo OCR tự động quét, bóc tách và xác thực thông tin CCCD gắn chip với độ chính xác và bảo mật tuyệt đối.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 shadow-theme-xs hover:shadow-theme-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Cpu size={28} />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Tự do cá nhân hóa</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Kéo thả, đổi màu nền, thêm các liên kết mạng xã hội và thông tin ngân hàng ngay trên Dashboard chuẩn thiết kế TailAdmin.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-transparent">
        <p>© 2026 NKS Secard System. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
