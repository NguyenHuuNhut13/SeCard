"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, HelpCircle } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    closeDropdown();
    logout();
    router.push("/login");
  };

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath || avatarPath.includes('default.png')) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
    }
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    return `https://account.nks.vn/storage/${avatarPath}`;
  };

  // Get first name or short name
  const getShortName = (fullName?: string) => {
    if (!fullName) return "Thành viên";
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1];
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle cursor-pointer"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border border-gray-200 dark:border-gray-800">
          <img
            width={44}
            height={44}
            src={getAvatarUrl(user?.avatar)}
            alt="User"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
            }}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm text-gray-800 dark:text-white/90">
          {getShortName(user?.name)}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
          <span className="block font-semibold text-gray-800 text-sm dark:text-white">
            {user?.name || "Thành viên NKS"}
          </span>
          <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email || "email@domain.com"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pb-3 border-b border-gray-100 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <User size={18} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Hồ sơ cá nhân
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Settings size={18} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Cài đặt tài khoản
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <HelpCircle size={18} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Hỗ trợ
            </DropdownItem>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-3 py-2 mt-3 font-medium text-red-500 hover:text-red-600 rounded-lg group text-theme-sm hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </Dropdown>
    </div>
  );
}
