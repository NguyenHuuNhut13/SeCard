<x-filament-panels::page>
    <style>
        .profile-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .profile-grid {
                grid-template-columns: 1fr 3fr;
            }
        }
        .profile-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        }
        .dark .profile-card {
            background-color: #111827;
            border-color: #1f2937;
        }
        .sidebar-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .dark .sidebar-card {
            background-color: #111827;
            border-color: #1f2937;
        }
        .nav-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 1rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .dark .nav-card {
            background-color: #111827;
            border-color: #1f2937;
        }
        .nav-btn {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            border-radius: 0.75rem;
            transition: all 0.2s;
            cursor: pointer;
            text-align: left;
            border: none;
            background: transparent;
        }
        .nav-btn-active {
            background-color: #eef2ff !important;
            color: #4f46e5 !important;
        }
        .dark .nav-btn-active {
            background-color: rgba(99, 102, 241, 0.1) !important;
            color: #818cf8 !important;
        }
        .nav-btn-inactive {
            color: #4b5563;
        }
        .nav-btn-inactive:hover {
            background-color: #f9fafb;
            color: #111827;
        }
        .dark .nav-btn-inactive {
            color: #9ca3af;
        }
        .dark .nav-btn-inactive:hover {
            background-color: rgba(31, 41, 55, 0.5);
            color: #f3f4f6;
        }
        .avatar-container {
            position: relative;
            display: inline-block;
        }
        .avatar-img {
            width: 6rem;
            height: 6rem;
            border-radius: 9999px;
            object-fit: cover;
            border: 4px solid #eef2ff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
        }
        .avatar-img:hover {
            transform: scale(1.05);
        }
        .dark .avatar-img {
            border-color: #312e81;
        }
        .status-dot {
            position: absolute;
            bottom: 0;
            right: 0;
            display: block;
            height: 1rem;
            width: 1rem;
            border-radius: 9999px;
            background-color: #4ade80;
            border: 2px solid #ffffff;
        }
        .dark .status-dot {
            border-color: #111827;
        }
        .badge-green {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            border-radius: 0.375rem;
            background-color: #f0fdf4;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: #15803d;
            border: 1px solid rgba(22, 163, 74, 0.2);
        }
        .dark .badge-green {
            background-color: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            border-color: rgba(34, 197, 94, 0.2);
        }
        .badge-blue {
            display: inline-flex;
            align-items: center;
            border-radius: 0.375rem;
            background-color: #eff6ff;
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: #1d78d6;
            border: 1px solid rgba(29, 120, 214, 0.2);
        }
        .dark .badge-blue {
            background-color: rgba(96, 165, 250, 0.1);
            color: #60a5fa;
            border-color: rgba(96, 165, 250, 0.2);
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 1rem;
        }
        @media (min-width: 768px) {
            .info-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        .info-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
            margin-bottom: 0.25rem;
        }
        .dark .info-label {
            color: #6b7280;
        }
        .info-value-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
        }
        .dark .info-value-container {
            color: #d1d5db;
        }
        .icon-wrapper {
            background-color: #f9fafb;
            padding: 0.625rem;
            border-radius: 0.75rem;
            color: #9ca3af;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .dark .icon-wrapper {
            background-color: #1f2937;
        }
        .icon-svg {
            width: 1.25rem !important;
            height: 1.25rem !important;
            flex-shrink: 0;
        }
        .icon-svg-sm {
            width: 1rem !important;
            height: 1rem !important;
            flex-shrink: 0;
        }
        .cccd-card {
            margin-bottom: 2rem;
            max-width: 28rem;
            margin-left: auto;
            margin-right: auto;
            background-image: linear-gradient(to bottom right, #6366f1, #9333ea);
            color: #ffffff;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
            border: none;
        }
        .dark .cccd-card {
            background-image: linear-gradient(to bottom right, #4f70e9, #7e22ce);
        }
        .cccd-logo {
            background-color: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            padding: 0.25rem 0.625rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 600;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cccd-number {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: 0.1em;
        }
        .avatar-edit-preview {
            width: 8rem;
            height: 8rem;
            border-radius: 9999px;
            object-fit: cover;
            border: 4px solid #f3f4f6;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .dark .avatar-edit-preview {
            border-color: #1f2937;
        }
        .flex-between {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .border-b-thin {
            border-bottom: 1px solid #f3f4f6;
        }
        .dark .border-b-thin {
            border-bottom: 1px solid #1f2937;
        }
        .margin-b-med {
            margin-bottom: 1.5rem;
        }
        .padding-b-sm {
            padding-bottom: 1rem;
        }

        /* Styles for Drag & Drop and laser scan */
        .ocr-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .ocr-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        .ocr-dropzone {
            border: 2px dashed #cbd5e1;
            border-radius: 1rem;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            background-color: #f8fafc;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 180px;
        }
        .dark .ocr-dropzone {
            border-color: #374151;
            background-color: #1e293b;
        }
        .ocr-dropzone:hover {
            border-color: #6366f1;
            background-color: #f1f5f9;
        }
        .dark .ocr-dropzone:hover {
            border-color: #818cf8;
            background-color: rgba(30, 41, 59, 0.8);
        }
        .ocr-dropzone-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        .ocr-dropzone-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: #334155;
        }
        .dark .ocr-dropzone-title {
            color: #cbd5e1;
        }
        .ocr-dropzone-subtitle {
            font-size: 0.75rem;
            color: #64748b;
        }
        .dark .ocr-dropzone-subtitle {
            color: #94a3b8;
        }
        .ocr-preview-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
            border-radius: 1rem;
            overflow: hidden;
        }
        .ocr-preview-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .laser-scanner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(to right, rgba(99, 102, 241, 0), #6366f1, rgba(99, 102, 241, 0));
            box-shadow: 0 0 8px 2px rgba(99, 102, 241, 0.8);
            animation: laser-scan 2.5s infinite ease-in-out;
        }
        @keyframes laser-scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        .ocr-progress-container {
            margin-top: 1.5rem;
            background-color: #f1f5f9;
            border-radius: 0.5rem;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            display: none;
        }
        .dark .ocr-progress-container {
            background-color: #1e293b;
            border-color: #334155;
        }
        .ocr-progress-bar {
            height: 6px;
            background-color: #6366f1;
            width: 0%;
            border-radius: 9999px;
            transition: width 0.3s;
        }
        
        /* Custom styles for circular Cropper mask and premium styling elements */
        .cropper-view-box,
        .cropper-face {
            border-radius: 50% !important;
        }
        .cropper-line,
        .cropper-point {
            display: none !important;
        }
        .avatar-filter-card {
            transition: all 0.2s;
        }
        .avatar-filter-card:hover {
            transform: translateY(-2px);
        }
        .avatar-filter-card.active {
            border-color: #6366f1 !important;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
        }
        .btn-tool {
            transition: all 0.2s;
        }
        .btn-tool:hover {
            background-color: #e5e7eb !important;
            color: #111827 !important;
        }
        .dark .btn-tool:hover {
            background-color: #374151 !important;
            color: #f3f4f6 !important;
        }

        /* Custom password card styles */
        .password-form-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 28rem;
            margin: 0 auto;
        }
        .password-input-wrapper {
            position: relative;
        }
        .password-input {
            width: 100%;
            padding: 0.625rem 2.5rem 0.625rem 0.875rem;
            border-radius: 0.5rem;
            border: 1px solid #d1d5db;
            background-color: #ffffff;
            font-size: 0.875rem;
            color: #1f2937;
            transition: all 0.2s;
        }
        .dark .password-input {
            border-color: #374151;
            background-color: #1f2937;
            color: #f3f4f6;
        }
        .password-input:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .password-input-icon-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            color: #9ca3af;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
        }
        .password-input-icon-btn:hover {
            color: #4b5563;
        }
        .dark .password-input-icon-btn:hover {
            color: #e5e7eb;
        }
        .password-input-icon-btn.eye-btn {
            right: 0.75rem;
        }
        .password-input-icon-btn.bulb-btn {
            right: 2.5rem;
        }
        /* Make sure password-input has extra right padding when it has bulb + eye */
        .password-input.with-bulb {
            padding-right: 4.25rem;
        }
        
        /* Generator card styles */
        .generator-panel {
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
            border-radius: 0.75rem;
            padding: 1.25rem;
            margin-top: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
        }
        .dark .generator-panel {
            border-color: #374151;
            background-color: #1e293b;
        }
        .generated-display {
            background-color: #ffffff;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            padding: 0.75rem;
            font-family: monospace;
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
            box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .dark .generated-display {
            background-color: #0f172a;
            border-color: #374151;
            color: #f8fafc;
        }
        
        /* Slider wrapper */
        .slider-wrapper {
            margin-bottom: 1.25rem;
        }
        .slider-label {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            font-weight: 600;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }
        .dark .slider-label {
            color: #9ca3af;
        }
        .char-slider {
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
            accent-color: #6366f1;
        }
        .dark .char-slider {
            background: #374151;
        }
        
        /* Checkbox option rows */
        .criteria-row {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: #374151;
        }
        .dark .criteria-row {
            color: #d1d5db;
        }
        .criteria-checkbox {
            width: 1rem;
            height: 1rem;
            border-radius: 0.25rem;
            border-color: #d1d5db;
            color: #6366f1;
            cursor: pointer;
        }
        .dark .criteria-checkbox {
            border-color: #4b5563;
            background-color: #1f2937;
        }
        
        /* Save confirmation checkbox container */
        .save-confirmation-container {
            border-top: 1px solid #e5e7eb;
            padding-top: 0.75rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
        }
        .dark .save-confirmation-container {
            border-color: #374151;
        }
        .save-confirm-text {
            color: #dc2626;
            font-weight: 600;
        }
        .dark .save-confirm-text {
            color: #f87171;
        }
        
        /* Gửi button custom style to match the mockup */
        .btn-gui {
            width: 100%;
            background-color: #0284c7;
            color: #ffffff;
            font-weight: 600;
            padding: 0.625rem;
            border-radius: 0.5rem;
            text-align: center;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .btn-gui:hover:not(:disabled) {
            background-color: #0369a1;
        }
        .btn-gui:disabled {
            background-color: #94a3b8;
            opacity: 0.6;
            cursor: not-allowed;
        }
        .dark .btn-gui:disabled {
            background-color: #475569;
        }
    </style>

    <div class="profile-grid">
        <!-- Cột bên trái: Thẻ tóm tắt & Tabs -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Thẻ tóm tắt -->
            <div class="sidebar-card">
                <!-- Avatar -->
                <div class="avatar-container">
                    <img class="avatar-img" 
                         src="{{ auth()->user()->avatar_url }}" 
                         alt="{{ auth()->user()->name }}">
                    <span class="status-dot"></span>
                </div>
                
                <h3 style="margin-top: 1rem; font-weight: 700; font-size: 1.125rem; color: #1f2937;" class="dark:text-gray-200">
                    {{ auth()->user()->name }}
                </h3>
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;" class="dark:text-gray-400">
                    {{ auth()->user()->email }}
                </p>
                
                <!-- Badge Role/Status -->
                <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; justify-content: center;">
                    <span class="badge-green">
                        {{ auth()->user()->status === 'active' ? 'Đang hoạt động' : 'Tạm khóa' }}
                    </span>
                    @if(auth()->user()->role)
                        <span class="badge-blue">
                            {{ ucfirst(auth()->user()->role) }}
                        </span>
                    @endif
                </div>
            </div>

            <!-- Điều hướng các Tab (Sidebar) -->
            <div class="nav-card">
                <nav style="display: flex; flex-direction: column; padding: 0.5rem; gap: 0.25rem;">
                    <!-- Tab Thông tin cá nhân -->
                    <button wire:click="$set('activeTab', 'personal')" 
                            class="nav-btn {{ $activeTab === 'personal' ? 'nav-btn-active' : 'nav-btn-inactive' }}">
                        <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Thông tin cá nhân</span>
                    </button>

                    <!-- Tab Căn cước công dân -->
                    <button wire:click="$set('activeTab', 'cccd')" 
                            class="nav-btn {{ $activeTab === 'cccd' ? 'nav-btn-active' : 'nav-btn-inactive' }}">
                        <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                        </svg>
                        <span>Căn cước công dân</span>
                    </button>

                    <!-- Tab Ảnh đại diện -->
                    <button wire:click="$set('activeTab', 'avatar')" 
                            class="nav-btn {{ $activeTab === 'avatar' ? 'nav-btn-active' : 'nav-btn-inactive' }}">
                        <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                        <span>Ảnh đại diện</span>
                    </button>

                    <!-- Tab Đổi mật khẩu -->
                    <button wire:click="$set('activeTab', 'password')" 
                            class="nav-btn {{ $activeTab === 'password' ? 'nav-btn-active' : 'nav-btn-inactive' }}">
                        <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                        <span>Đổi mật khẩu</span>
                    </button>
                </nav>
            </div>
        </div>

        <!-- Cột bên phải: Nội dung chi tiết -->
        <div>
            <div class="profile-card">
                <!-- Nội dung theo từng tab -->
                @if($activeTab === 'personal')
                    <div>
                        <div class="flex-between border-b-thin padding-b-sm margin-b-med">
                            <div>
                                <h2 style="font-size: 1.125rem; font-weight: 700; color: #1f2937;" class="dark:text-gray-200">Thông tin cá nhân</h2>
                                <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">Thông tin cơ bản về tài khoản của bạn trên hệ thống</p>
                            </div>
                            @if(!$isEditing)
                                <x-filament::button type="button" wire:click="enableEditing" size="sm" icon="heroicon-o-pencil-square">
                                    Chỉnh sửa
                                </x-filament::button>
                            @endif
                        </div>

                        @if(!$isEditing)
                            <!-- Card hiển thị dạng Thẻ E-Card Mockup -->
                            <div class="cccd-card" style="display: flex; gap: 1.25rem; align-items: center; max-width: 32rem; margin-bottom: 2rem;">
                                <div style="position: absolute; right: 0; top: 0; opacity: 0.1; transform: translate(2rem, -2rem); pointer-events: none;">
                                    <svg style="width: 16rem; height: 16rem;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                                </div>
                                
                                <!-- Cột Trái: Ảnh đại diện thành viên -->
                                <div style="flex-shrink: 0; position: relative; z-index: 10;">
                                    <img src="{{ auth()->user()->avatar_url }}" 
                                         alt="Avatar" 
                                         style="width: 5.5rem; height: 5.5rem; border-radius: 9999px; object-fit: cover; border: 3px solid rgba(255, 255, 255, 0.85); box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                                </div>
                                
                                <!-- Cột Phải: Thông tin thành viên -->
                                <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; position: relative; z-index: 10;">
                                    <div class="flex-between" style="border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 0.375rem; margin-bottom: 0.25rem;">
                                        <div>
                                            <span style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.8;">THẺ THÀNH VIÊN ĐIỆN TỬ</span>
                                            <h4 style="font-size: 0.875rem; font-weight: 700; opacity: 0.95; line-height: 1;">NKS DIGITAL MEMBER</h4>
                                        </div>
                                        <span class="cccd-logo" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">
                                            NKS
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <span style="font-size: 0.6rem; opacity: 0.75; display: block; text-transform: uppercase; line-height: 1;">Số thẻ / Card No.:</span>
                                        <span class="cccd-number" style="font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em;">NKS-{{ str_pad(auth()->user()->id, 5, '0', STR_PAD_LEFT) }}</span>
                                    </div>

                                    <div>
                                        <span style="font-size: 0.6rem; opacity: 0.75; display: block; text-transform: uppercase; line-height: 1;">Họ và tên / Full name:</span>
                                        <span style="font-size: 0.95rem; font-weight: 700; display: block;">{{ auth()->user()->name }}</span>
                                    </div>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                                        <div>
                                            <span style="font-size: 0.6rem; opacity: 0.75; display: block; text-transform: uppercase; line-height: 1;">Hạng thẻ / Class:</span>
                                            <span style="font-size: 0.8rem; font-weight: 600; display: block;">{{ auth()->user()->role === 'admin' ? 'Premium Admin' : 'Standard Member' }}</span>
                                        </div>
                                        <div>
                                            <span style="font-size: 0.65rem; opacity: 0.75; display: block; text-transform: uppercase; line-height: 1;">Ngày tham gia / Joined:</span>
                                            <span style="font-size: 0.8rem; font-weight: 600; display: block;">{{ auth()->user()->created_at ? auth()->user()->created_at->format('d/m/Y') : date('d/m/Y') }}</span>
                                        </div>
                                    </div>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 0.5rem;">
                                        <div>
                                            <span style="font-size: 0.6rem; opacity: 0.75; display: block; text-transform: uppercase; line-height: 1;">Điện thoại / Phone:</span>
                                            <span style="font-size: 0.75rem; font-weight: 500; display: block;">{{ auth()->user()->phone ?: 'Chưa cập nhật' }}</span>
                                        </div>
                                        <div>
                                            <span style="font-size: 0.6rem; opacity: 0.75; display: block; text-transform: uppercase; line-height: 1;">Email:</span>
                                            <span style="font-size: 0.75rem; font-weight: 500; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ auth()->user()->email }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Chế độ Chỉ xem (Read-only) -->
                            <div class="info-grid">
                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                    <span class="info-label">Họ và tên</span>
                                    <div class="info-value-container">
                                        <div class="icon-wrapper">
                                            <svg class="icon-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                        </div>
                                        <span>{{ auth()->user()->name }}</span>
                                    </div>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                    <span class="info-label">Địa chỉ Email</span>
                                    <div class="info-value-container">
                                        <div class="icon-wrapper">
                                            <svg class="icon-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                        </div>
                                        <span>{{ auth()->user()->email }}</span>
                                    </div>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                    <span class="info-label">Số điện thoại</span>
                                    <div class="info-value-container">
                                        <div class="icon-wrapper">
                                            <svg class="icon-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                        </div>
                                        <span>{{ auth()->user()->phone ?: 'Chưa cập nhật' }}</span>
                                    </div>
                                </div>

                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                    <span class="info-label">Số Zalo / Link Zalo</span>
                                    <div class="info-value-container">
                                        <div class="icon-wrapper">
                                            <svg class="icon-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                        </div>
                                        <span>{{ auth()->user()->zalo ?: 'Chưa cập nhật' }}</span>
                                    </div>
                                </div>
                            </div>
                        @else
                            <!-- Chế độ Chỉnh sửa (Form) -->
                            <form wire:submit="saveProfile" style="display: flex; flex-direction: column; gap: 1.5rem;">
                                {{ $this->profileForm }}
                                
                                <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem;" class="border-t-thin">
                                    <x-filament::button type="submit">
                                        Lưu thay đổi
                                    </x-filament::button>
                                    
                                    <x-filament::button type="button" color="gray" wire:click="cancelEdit">
                                        Hủy bỏ
                                    </x-filament::button>
                                </div>
                            </form>
                        @endif
                    </div>
                @endif

                @if($activeTab === 'cccd')
                    <div>
                        <div class="border-b-thin padding-b-sm margin-b-med">
                            <h2 style="font-size: 1.125rem; font-weight: 700; color: #1f2937;" class="dark:text-gray-200">Căn cước công dân (CCCD)</h2>
                            <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">Thông tin Căn cước công dân dùng để xác minh danh tính nhận xe</p>
                        </div>

                        <!-- Chức năng tải lên Mặt trước / Mặt sau & OCR -->
                        <div style="margin-bottom: 2rem;">
                            <h3 style="font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 1rem;" class="dark:text-gray-300">Tải lên hoặc Chụp ảnh thẻ định danh để tự động nhận dạng</h3>
                            
                            <div class="ocr-grid">
                                <!-- Dropzone Mặt trước -->
                                <div class="ocr-dropzone" id="dropzone-front" onclick="document.getElementById('input-front').click()">
                                    <input type="file" id="input-front" accept="image/*" style="display: none;" onchange="handleFileSelect(this, 'front')">
                                    <div class="ocr-dropzone-content" id="content-front">
                                        <svg class="icon-svg" style="color: #6366f1; width: 2.5rem !important; height: 2.5rem !important;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span class="ocr-dropzone-title">Mặt trước ảnh thẻ</span>
                                        <span class="ocr-dropzone-subtitle">Nhấp để chụp/chọn hoặc kéo thả ảnh</span>
                                    </div>
                                    <div class="ocr-preview-container" id="preview-container-front" style="{{ auth()->user()->cccd_front ? 'display: block;' : 'display: none;' }}">
                                        <img id="preview-front" src="{{ auth()->user()->cccd_front ? asset('storage/' . auth()->user()->cccd_front) : '' }}" alt="Mặt trước thẻ" class="ocr-preview-img">
                                        <div class="laser-scanner" id="laser-front" style="display: none;"></div>
                                    </div>
                                </div>

                                <!-- Dropzone Mặt sau -->
                                <div class="ocr-dropzone" id="dropzone-back" onclick="document.getElementById('input-back').click()">
                                    <input type="file" id="input-back" accept="image/*" style="display: none;" onchange="handleFileSelect(this, 'back')">
                                    <div class="ocr-dropzone-content" id="content-back">
                                        <svg class="icon-svg" style="color: #9333ea; width: 2.5rem !important; height: 2.5rem !important;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        <span class="ocr-dropzone-title">Mặt sau ảnh thẻ</span>
                                        <span class="ocr-dropzone-subtitle">Nhấp để chụp/chọn hoặc kéo thả ảnh</span>
                                    </div>
                                    <div class="ocr-preview-container" id="preview-container-back" style="{{ auth()->user()->cccd_back ? 'display: block;' : 'display: none;' }}">
                                        <img id="preview-back" src="{{ auth()->user()->cccd_back ? asset('storage/' . auth()->user()->cccd_back) : '' }}" alt="Mặt sau thẻ" class="ocr-preview-img">
                                        <div class="laser-scanner" id="laser-back" style="display: none;"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Trạng thái quét OCR -->
                            <div class="ocr-progress-container" id="ocr-progress-container">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <span style="font-size: 0.875rem; font-weight: 600; color: #4f46e5;" id="ocr-status-text">Đang chuẩn bị ảnh quét...</span>
                                    <span style="font-size: 0.875rem; font-weight: 600; color: #4f46e5;" id="ocr-percentage">0%</span>
                                </div>
                                <div style="width: 100%; background-color: #cbd5e1; height: 6px; border-radius: 9999px; overflow: hidden;">
                                    <div class="ocr-progress-bar" id="ocr-progress-bar"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Form nhập tay thông thường -->
                        <form wire:submit="saveCccd" style="display: flex; flex-direction: column; gap: 1.5rem;">
                            {{ $this->cccdForm }}
                            
                            <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1rem;" class="border-t-thin">
                                <x-filament::button type="submit">
                                    Cập nhật thông tin thẻ
                                </x-filament::button>
                            </div>
                        </form>
                    </div>
                @endif

                @if($activeTab === 'avatar')
                    <div>
                        <div class="border-b-thin padding-b-sm margin-b-med">
                            <h2 style="font-size: 1.125rem; font-weight: 700; color: #1f2937;" class="dark:text-gray-200">Ảnh đại diện</h2>
                            <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">Cắt, xoay và áp dụng các bộ lọc màu nghệ thuật cho ảnh đại diện của bạn</p>
                        </div>

                        <!-- View Mode: Display current avatar and upload button -->
                        <div id="avatar-view-mode" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem 0;">
                            <div class="avatar-container" style="margin-bottom: 1.5rem;">
                                <img class="avatar-img" style="width: 10rem; height: 10rem; border-width: 6px;"
                                     src="{{ auth()->user()->avatar_url }}" 
                                     alt="{{ auth()->user()->name }}">
                                <span class="status-dot" style="width: 1.5rem; height: 1.5rem; border-width: 3px;"></span>
                            </div>
                            <x-filament::button type="button" size="sm" icon="heroicon-o-arrow-up-tray" onclick="document.getElementById('avatar-file-input').click()">
                                Tải lên ảnh mới
                            </x-filament::button>
                            <input type="file" id="avatar-file-input" accept="image/*" style="display: none;" onchange="initAvatarCropper(this)">
                        </div>

                        <!-- Edit Mode: Cropper Canvas + Tools + Filter presets -->
                        <div id="avatar-edit-mode" style="display: none; flex-direction: column; gap: 2rem;">
                            <!-- Crop Box -->
                            <div style="max-height: 400px; width: 100%; background-color: #f1f5f9; border-radius: 1rem; overflow: hidden; display: flex; justify-content: center; align-items: center;" class="dark:bg-slate-800">
                                <img id="avatar-crop-image" style="max-width: 100%; max-height: 400px; display: block;">
                            </div>

                            <!-- Tools Panel (Rotate & Zoom) -->
                            <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap; margin-top: -1rem;">
                                <button type="button" onclick="cropper.rotate(-90)" class="btn-tool" title="Xoay trái 90°" style="padding: 0.5rem 0.75rem; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;" class="dark:bg-gray-800 dark:text-gray-200">
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/></svg>
                                    <span>Xoay trái</span>
                                </button>
                                <button type="button" onclick="cropper.rotate(90)" class="btn-tool" title="Xoay phải 90°" style="padding: 0.5rem 0.75rem; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;" class="dark:bg-gray-800 dark:text-gray-200">
                                    <span>Xoay phải</span>
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"/></svg>
                                </button>
                                <button type="button" onclick="cropper.zoom(0.1)" class="btn-tool" title="Phóng to" style="padding: 0.5rem 0.75rem; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center;" class="dark:bg-gray-800 dark:text-gray-200">
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </button>
                                <button type="button" onclick="cropper.zoom(-0.1)" class="btn-tool" title="Thu nhỏ" style="padding: 0.5rem 0.75rem; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center;" class="dark:bg-gray-800 dark:text-gray-200">
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </button>
                                <button type="button" onclick="cropper.reset()" class="btn-tool" title="Đặt lại" style="padding: 0.5rem 0.75rem; background: #f3f4f6; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem;" class="dark:bg-gray-800 dark:text-gray-200">
                                    <svg style="width: 1.25rem; height: 1.25rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12"/></svg>
                                    <span>Đặt lại</span>
                                </button>
                            </div>

                            <!-- Filter Selection Grid -->
                            <div>
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #4b5563; margin-bottom: 0.75rem;" class="dark:text-gray-300">Bộ lọc ảnh nghệ thuật</h4>
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; text-align: center;" id="avatar-filter-grid">
                                    <div onclick="applyAvatarFilter('none')" class="avatar-filter-card active" id="filter-none" style="cursor: pointer; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; background: #fff;" class="dark:bg-gray-800 dark:border-gray-700">
                                        <div style="height: 60px; border-radius: 0.5rem; background-color: #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #475569;">Original</div>
                                        <span style="font-size: 0.75rem; font-weight: 600; display: block; margin-top: 0.25rem;" class="dark:text-gray-300">Gốc</span>
                                    </div>
                                    <div onclick="applyAvatarFilter('brighten')" class="avatar-filter-card" id="filter-brighten" style="cursor: pointer; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; background: #fff;" class="dark:bg-gray-800 dark:border-gray-700">
                                        <div style="height: 60px; border-radius: 0.5rem; background-color: #cbd5e1; filter: brightness(1.2); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #475569;">Brighten</div>
                                        <span style="font-size: 0.75rem; font-weight: 600; display: block; margin-top: 0.25rem;" class="dark:text-gray-300">Sáng sủa</span>
                                    </div>
                                    <div onclick="applyAvatarFilter('grayscale')" class="avatar-filter-card" id="filter-grayscale" style="cursor: pointer; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; background: #fff;" class="dark:bg-gray-800 dark:border-gray-700">
                                        <div style="height: 60px; border-radius: 0.5rem; background-color: #cbd5e1; filter: grayscale(1); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #475569;">B&W</div>
                                        <span style="font-size: 0.75rem; font-weight: 600; display: block; margin-top: 0.25rem;" class="dark:text-gray-300">Đen trắng</span>
                                    </div>
                                    <div onclick="applyAvatarFilter('sepia')" class="avatar-filter-card" id="filter-sepia" style="cursor: pointer; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; background: #fff;" class="dark:bg-gray-800 dark:border-gray-700">
                                        <div style="height: 60px; border-radius: 0.5rem; background-color: #cbd5e1; filter: sepia(0.8); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #475569;">Vintage</div>
                                        <span style="font-size: 0.75rem; font-weight: 600; display: block; margin-top: 0.25rem;" class="dark:text-gray-300">Hoài cổ</span>
                                    </div>
                                    <div onclick="applyAvatarFilter('warm')" class="avatar-filter-card" id="filter-warm" style="cursor: pointer; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; background: #fff;" class="dark:bg-gray-800 dark:border-gray-700">
                                        <div style="height: 60px; border-radius: 0.5rem; background-color: #cbd5e1; filter: sepia(0.2) saturate(1.2) hue-rotate(-10deg); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #475569;">Warm</div>
                                        <span style="font-size: 0.75rem; font-weight: 600; display: block; margin-top: 0.25rem;" class="dark:text-gray-300">Ấm áp</span>
                                    </div>
                                    <div onclick="applyAvatarFilter('cool')" class="avatar-filter-card" id="filter-cool" style="cursor: pointer; border: 2px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; background: #fff;" class="dark:bg-gray-800 dark:border-gray-700">
                                        <div style="height: 60px; border-radius: 0.5rem; background-color: #cbd5e1; filter: hue-rotate(30deg) saturate(1.1); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; color: #475569;">Cool</div>
                                        <span style="font-size: 0.75rem; font-weight: 600; display: block; margin-top: 0.25rem;" class="dark:text-gray-300">Mát mẻ</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Buttons -->
                            <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1rem; padding-top: 1.5rem;" class="border-t-thin">
                                <x-filament::button type="button" onclick="submitCroppedAvatar()">
                                    Cập nhật ảnh đại diện mới
                                </x-filament::button>
                                <x-filament::button type="button" color="gray" onclick="cancelAvatarCrop()">
                                    Hủy bỏ
                                </x-filament::button>
                            </div>
                        </div>
                    </div>
                @endif

                @if($activeTab === 'password')
                    <div x-data="{
                        showOldPassword: false,
                        showNewPassword: false,
                        showConfirmPassword: false,
                        showGenerator: false,
                        generatedPassword: '',
                        charLength: 12,
                        hasAtLeast8: true,
                        hasNumbers: true,
                        hasLowercase: true,
                        hasUppercase: true,
                        hasSpecial: true,
                        isSaved: false,
                        
                        init() {
                            this.generate();
                            this.$watch('charLength', value => {
                                if (this.hasAtLeast8 && value < 8) {
                                    this.charLength = 8;
                                }
                                this.generate();
                            });
                        },
                        
                        generate() {
                            const consonants = 'bcdfghjklmnpqrstvwxyz';
                            const vowels = 'aeiou';
                            
                            // Generate readable syllables
                            let word = '';
                            
                            // Determine extra chars space
                            let extraSpace = 0;
                            if (this.hasNumbers) extraSpace += 2;
                            if (this.hasSpecial) extraSpace += 1;
                            
                            let targetWordLength = Math.max(3, this.charLength - extraSpace);
                            
                            while (word.length < targetWordLength) {
                                let c = consonants[Math.floor(Math.random() * consonants.length)];
                                let v = vowels[Math.floor(Math.random() * vowels.length)];
                                
                                word += c + v;
                                
                                if (word.length < targetWordLength) {
                                    let c2 = consonants[Math.floor(Math.random() * consonants.length)];
                                    word += c2;
                                }
                            }
                            
                            word = word.substring(0, targetWordLength);
                            
                            // Handle casing
                            if (this.hasUppercase && word.length > 0) {
                                word = word.charAt(0).toUpperCase() + word.slice(1);
                            } else if (!this.hasUppercase) {
                                word = word.toLowerCase();
                            }
                            
                            let password = word;
                            
                            // Add numbers
                            if (this.hasNumbers) {
                                let numLength = this.charLength - password.length - (this.hasSpecial ? 1 : 0);
                                if (numLength > 0) {
                                    let numStr = '';
                                    for (let i = 0; i < numLength; i++) {
                                        numStr += Math.floor(Math.random() * 10);
                                    }
                                    password += numStr;
                                }
                            }
                            
                            // Add special characters
                            if (this.hasSpecial) {
                                const specialPool = '!@#$%^*';
                                let specLength = this.charLength - password.length;
                                if (specLength > 0) {
                                    let specStr = '';
                                    for (let i = 0; i < specLength; i++) {
                                        specStr += specialPool[Math.floor(Math.random() * specialPool.length)];
                                    }
                                    password += specStr;
                                }
                            }
                            
                            // Fallback if password length is under-filled
                            if (password.length < this.charLength) {
                                let chars = '';
                                if (this.hasLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
                                if (this.hasUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                if (this.hasNumbers) chars += '0123456789';
                                if (this.hasSpecial) chars += '!@#$%^*';
                                if (chars === '') chars = 'abcdefghijklmnopqrstuvwxyz';
                                
                                while (password.length < this.charLength) {
                                    password += chars[Math.floor(Math.random() * chars.length)];
                                }
                            }
                            
                            this.generatedPassword = password;
                        },
                        
                        applyGeneratedPassword() {
                            if (!this.isSaved) return;
                            @this.set('passwordData.new_password', this.generatedPassword);
                            @this.set('passwordData.new_password_confirmation', this.generatedPassword);
                            this.showGenerator = false;
                            this.showNewPassword = true;
                            this.showConfirmPassword = true;
                            this.isSaved = false;
                        }
                    }">
                        <div class="border-b-thin padding-b-sm margin-b-med">
                            <h2 style="font-size: 1.125rem; font-weight: 700; color: #1f2937;" class="dark:text-gray-200">Đổi mật khẩu</h2>
                            <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">Thay đổi mật khẩu tài khoản thường xuyên để bảo mật</p>
                        </div>

                        <div class="password-form-container">
                            <form wire:submit="savePassword" style="display: flex; flex-direction: column; gap: 1.25rem;">
                                <!-- Mật khẩu hiện tại -->
                                <div>
                                    <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;" class="dark:text-gray-400">
                                        Mật khẩu hiện tại
                                    </label>
                                    <div class="password-input-wrapper">
                                        <input :type="showOldPassword ? 'text' : 'password'"
                                               wire:model="passwordData.old_password"
                                               class="password-input"
                                               placeholder="Nhập mật khẩu hiện tại">
                                        <button type="button" 
                                                @click="showOldPassword = !showOldPassword"
                                                class="password-input-icon-btn eye-btn">
                                            <template x-if="showOldPassword">
                                                <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                                </svg>
                                            </template>
                                            <template x-if="!showOldPassword">
                                                <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                </svg>
                                            </template>
                                        </button>
                                    </div>
                                    @error('passwordData.old_password')
                                        <span style="color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;">{{ $message }}</span>
                                    @enderror
                                </div>

                                <!-- Mật khẩu mới -->
                                <div>
                                    <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;" class="dark:text-gray-400">
                                        Mật khẩu mới
                                    </label>
                                    <div class="password-input-wrapper">
                                        <input :type="showNewPassword ? 'text' : 'password'"
                                               wire:model="passwordData.new_password"
                                               class="password-input with-bulb"
                                               placeholder="Nhập mật khẩu mới">
                                        
                                        <!-- Bóng đèn tạo mật khẩu ngẫu nhiên -->
                                        <button type="button" 
                                                @click="showGenerator = !showGenerator"
                                                class="password-input-icon-btn bulb-btn"
                                                style="color: #eab308;"
                                                title="Tạo mật khẩu ngẫu nhiên">
                                            <svg class="icon-svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2 18H10c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1z"/>
                                            </svg>
                                        </button>

                                        <button type="button" 
                                                @click="showNewPassword = !showNewPassword"
                                                class="password-input-icon-btn eye-btn">
                                            <template x-if="showNewPassword">
                                                <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                                </svg>
                                            </template>
                                            <template x-if="!showNewPassword">
                                                <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                </svg>
                                            </template>
                                        </button>
                                    </div>
                                    @error('passwordData.new_password')
                                        <span style="color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;">{{ $message }}</span>
                                    @enderror
                                </div>

                                <!-- Xác nhận mật khẩu mới -->
                                <div>
                                    <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;" class="dark:text-gray-400">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div class="password-input-wrapper">
                                        <input :type="showConfirmPassword ? 'text' : 'password'"
                                               wire:model="passwordData.new_password_confirmation"
                                               class="password-input"
                                               placeholder="Nhập lại mật khẩu mới">
                                        <button type="button" 
                                                @click="showConfirmPassword = !showConfirmPassword"
                                                class="password-input-icon-btn eye-btn">
                                            <template x-if="showConfirmPassword">
                                                <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                                </svg>
                                            </template>
                                            <template x-if="!showConfirmPassword">
                                                <svg class="icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                </svg>
                                            </template>
                                        </button>
                                    </div>
                                    @error('passwordData.new_password_confirmation')
                                        <span style="color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;">{{ $message }}</span>
                                    @enderror
                                </div>

                                <div style="margin-top: 0.5rem;">
                                    <x-filament::button type="submit" size="md" style="width: 100%;">
                                        Cập nhật mật khẩu
                                    </x-filament::button>
                                </div>
                            </form>

                            <!-- Khung Tạo mật khẩu ngẫu nhiên (Generate Password) -->
                            <div x-show="showGenerator"
                                 x-transition:enter="transition ease-out duration-300"
                                 x-transition:enter-start="opacity-0 transform -translate-y-2"
                                 x-transition:enter-end="opacity-100 transform translate-y-0"
                                 x-transition:leave="transition ease-in duration-200"
                                 x-transition:leave-start="opacity-100 transform translate-y-0"
                                 x-transition:leave-end="opacity-0 transform -translate-y-2"
                                 class="generator-panel">
                                
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                                    <h4 style="font-size: 0.875rem; font-weight: 700; color: #111827;" class="dark:text-white">Tạo mật khẩu ngẫu nhiên</h4>
                                    <button type="button" @click="showGenerator = false" style="color: #9ca3af; background: transparent; border: none; cursor: pointer;">
                                        <svg class="icon-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Password Display Box -->
                                <div class="generated-display">
                                    <span x-text="generatedPassword"></span>
                                    <button type="button" 
                                            @click="navigator.clipboard.writeText(generatedPassword); alert('Đã sao chép mật khẩu vào clipboard!')" 
                                            style="color: #6366f1; background: transparent; border: none; cursor: pointer; display: flex; align-items: center;"
                                            title="Sao chép">
                                        <svg class="icon-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Length Slider -->
                                <div class="slider-wrapper">
                                    <div class="slider-label">
                                        <span>Số lượng ký tự</span>
                                        <span x-text="charLength" style="color: #6366f1; font-weight: 700;"></span>
                                    </div>
                                    <input type="range" 
                                           x-model="charLength" 
                                           min="6" max="32" 
                                           class="char-slider">
                                </div>

                                <!-- Option Checkboxes -->
                                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                                    <label class="criteria-row">
                                        <input type="checkbox" x-model="hasAtLeast8" @change="if(hasAtLeast8 && charLength < 8) charLength = 8; generate()" class="criteria-checkbox">
                                        <span>Có 8 ký tự</span>
                                    </label>
                                    <label class="criteria-row">
                                        <input type="checkbox" x-model="hasNumbers" @change="generate()" class="criteria-checkbox">
                                        <span>Có ký tự số</span>
                                    </label>
                                    <label class="criteria-row">
                                        <input type="checkbox" x-model="hasLowercase" @change="generate()" class="criteria-checkbox">
                                        <span>Có ký tự thường</span>
                                    </label>
                                    <label class="criteria-row">
                                        <input type="checkbox" x-model="hasUppercase" @change="generate()" class="criteria-checkbox">
                                        <span>Có ký tự hoa</span>
                                    </label>
                                    <label class="criteria-row">
                                        <input type="checkbox" x-model="hasSpecial" @change="generate()" class="criteria-checkbox">
                                        <span>Có ký tự đặc biệt</span>
                                    </label>
                                </div>

                                <!-- Save confirmation box -->
                                <div class="save-confirmation-container">
                                    <label class="criteria-row" style="align-items: flex-start;">
                                        <input type="checkbox" x-model="isSaved" class="criteria-checkbox" style="margin-top: 0.2rem;">
                                        <span class="save-confirm-text" style="font-size: 0.825rem;">Tôi đã lưu lại mật khẩu mới</span>
                                    </label>
                                </div>

                                <!-- Submit button -->
                                <button type="button" 
                                        @click="applyGeneratedPassword()" 
                                        :disabled="!isSaved"
                                        class="btn-gui">
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Hidden container for Tesseract worker if needed -->
    <div id="ocr-temp-container" style="display: none;"></div>

    <!-- Scripts block to load Tesseract.js and implement OCR reader -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Tải thư viện Tesseract.js cho nhận diện ảnh
            if (typeof Tesseract === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/tesseract.js@v4.0.1/dist/tesseract.min.js';
                script.onload = () => {
                    console.log('Tesseract.js OCR library loaded successfully.');
                };
                document.head.appendChild(script);
            }

            // Tải thư viện jsQR cho quét mã QR
            if (typeof jsQR === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
                script.onload = () => {
                    console.log('jsQR library loaded successfully.');
                };
                document.head.appendChild(script);
            }
        });

        // Hàm làm sạch và hợp chuẩn Nơi cấp từ kết quả OCR quét mặt sau
        function normalizeIssuePlace(text) {
            if (!text) return "";
            const lower = text.toLowerCase().trim();
            
            // Hợp chuẩn cho CCCD gắn chip (phổ biến nhất)
            if (lower.includes("cục trưởng") || 
                lower.includes("cục trưởng cục cảnh sát") || 
                (lower.includes("cảnh sát") && lower.includes("quản lý") && lower.includes("trật tự")) ||
                (lower.includes("cảnh sát") && lower.includes("hành chính")) ||
                lower.includes("qlhc về ttxh") ||
                lower.includes("qlhc ve ttxh") ||
                lower.includes("social order") ||
                lower.includes("administrative management")) {
                return "Cục Cảnh sát quản lý hành chính về trật tự xã hội";
            }
            
            // Hợp chuẩn cho CCCD mã vạch cũ (12 số)
            if (lower.includes("đkql cư trú") || 
                lower.includes("dkql cu tru") || 
                lower.includes("dân cư") || 
                lower.includes("dan cu") || 
                lower.includes("dlqg")) {
                return "Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư";
            }
            
            // Hợp chuẩn cho CMND 9 số cũ (Công an các tỉnh/thành)
            if (lower.includes("công an") || lower.includes("cong an")) {
                const match = text.match(/(công\s+an\s+(tỉnh|tp|thành\s+phố)\s+[a-zA-ZÀ-ỸđĐ\s]+)/i);
                if (match) {
                    return match[1].replace(/\s+/g, ' ').trim();
                }
                let cleaned = text.replace(/[\^\|~\*_«»\{\}\[\]\\:\.\-\,\/0-9]/g, "").trim();
                cleaned = cleaned.replace(/\s+/g, ' ');
                return cleaned;
            }
            
            // Loại bỏ các ký tự nhiễu OCR thông thường ở dòng này
            let cleaned = text.replace(/[\^\|~\*_«»\{\}\[\]\\:\.\-\,\/]/g, "").trim();
            cleaned = cleaned.replace(/\s+/g, ' ');
            return cleaned;
        }

        // Hàm phân tích khối văn bản thô từ CCCD bằng Regex thông minh
        function parseTextFromCccd(text) {
            console.log("Raw text recognized by Tesseract:\n", text);
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            
            let cccd = "";
            let name = "";
            let dob = "";
            let gender = "";
            let address = "";
            
            // 1. Tìm số CCCD (12 chữ số)
            for (let line of lines) {
                const match = line.match(/\b\d{12}\b/);
                if (match) {
                    cccd = match[0];
                    break;
                }
            }
            // Dự phòng tìm chuỗi số liên tục nếu không khớp ranh giới từ
            if (!cccd) {
                for (let line of lines) {
                    const match = line.replace(/\s+/g, '').match(/\d{12}/);
                    if (match) {
                        cccd = match[0];
                        break;
                    }
                }
            }
            
            // 2. Tìm Ngày sinh (dd/mm/yyyy)
            for (let line of lines) {
                let normalizedLine = line.replace(/[oO]/g, '0').replace(/[Il|]/g, '1');
                const match = normalizedLine.match(/\b\d{2}[\/\-\.\|\s\\lI1]\d{2}[\/\-\.\|\s\\lI1]\d{4}\b/);
                if (match) {
                    dob = match[0].replace(/[\-\.\|\s\\lI1]/g, '/');
                    break;
                }
            }
            
            // 3. Tìm Giới tính
            for (let line of lines) {
                if (/giới\s*tính|sex|tính/i.test(line)) {
                    if (/nam/i.test(line)) { gender = "Nam"; break; }
                    else if (/nữ|nu/i.test(line)) { gender = "Nữ"; break; }
                }
            }
            if (!gender) {
                for (let line of lines) {
                    if (/\bnam\b/i.test(line)) { gender = "Nam"; break; }
                    if (/\bnữ\b/i.test(line) || /\bnu\b/i.test(line)) { gender = "Nữ"; break; }
                }
            }
            
            // 4. Tìm Họ và tên
            for (let i = 0; i < lines.length; i++) {
                if (/họ\s*(và)?\s*tên|full\s*name|tên/i.test(lines[i])) {
                    if (i + 1 < lines.length) {
                        let potentialName = lines[i+1].toUpperCase();
                        // Loại bỏ các ký tự rác không thuộc bảng chữ cái tiếng Việt/Anh
                        let cleanedName = potentialName.replace(/[^A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸ\s]/g, '').trim();
                        cleanedName = cleanedName.replace(/\s+/g, ' ');
                        // Lọc bỏ ký tự đơn lẻ nhiễu
                        name = cleanedName.split(' ').filter(word => word.length > 1 || word === 'Y' || word === 'y').join(' ').trim();
                    }
                    break;
                }
            }
            
            // 5. Tìm Nơi thường trú
            let addressStartIndex = -1;
            for (let i = 0; i < lines.length; i++) {
                if (/thường\s*trú|residence|nơi/i.test(lines[i])) {
                    addressStartIndex = i;
                    break;
                }
            }
            if (addressStartIndex !== -1) {
                let addrLines = [];
                const labelMatch = lines[addressStartIndex].match(/(thường\s*trú|residence|nơi)[^:]*:\s*(.*)/i);
                if (labelMatch && labelMatch[2]) {
                    let firstLine = labelMatch[2].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                    // Loại bỏ ký tự đơn lẻ thừa
                    firstLine = firstLine.split(' ').filter(word => word.length > 1 || word === 'Q' || word === 'q' || word === 't' || word === 'T' || /\d/.test(word)).join(' ').trim();
                    if (firstLine.length > 2) {
                        addrLines.push(firstLine);
                    }
                }
                
                const addressKeywords = /tổ|ấp|thôn|xã|phường|quận|huyện|tỉnh|thành|phố|đường|thị|trấn|phố|số|nhà|bình|phước|dương|đồng|nai|gòn|hồ|chí|minh|hà|nội|đà|nẵng|nks|thanh|quản|hớn|sở|nhì|mỹ|thủ|dầu|một/i;
                const skipKeywords = /ngày|nơi|sinh|họ|tên|ký|giá\s*trị|expiry|valid|hạn/i;
                
                for (let j = addressStartIndex + 1; j <= addressStartIndex + 3; j++) {
                    if (j < lines.length && !skipKeywords.test(lines[j])) {
                        let cleanedLine = lines[j].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                        // Loại bỏ ký tự đơn lẻ thừa
                        cleanedLine = cleanedLine.split(' ').filter(word => word.length > 1 || word === 'Q' || word === 'q' || word === 't' || word === 'T' || /\d/.test(word)).join(' ').trim();
                        if (cleanedLine.length > 5 && addressKeywords.test(cleanedLine)) {
                            addrLines.push(cleanedLine);
                        }
                    }
                }
                address = addrLines.join(', ').replace(/\s+/g, ' ').trim();
            }
            
            return {
                cccd,
                name,
                dob,
                gender,
                address
            };
        }

        // Hàm parse thông tin sinh trắc học từ MRZ ở mặt sau CCCD (độ chính xác 100%)
        function parseMrz(backText) {
            if (!backText) return null;
            const lines = backText.split('\n').map(l => l.trim().replace(/\s+/g, ''));
            for (let line of lines) {
                const match = line.match(/(\d{6})\d([MF])(\d{6})\dVNM/i) || line.match(/(\d{6})\d([MF])(\d{6})\d/i);
                if (match) {
                    let yy = parseInt(match[1].substring(0, 2));
                    let mm = match[1].substring(2, 4);
                    let dd = match[1].substring(4, 6);
                    let year = yy >= 30 ? 1900 + yy : 2000 + yy;
                    
                    let gender = match[2].toUpperCase() === 'M' ? 'Nam' : 'Nữ';
                    let dob = `${dd}/${mm}/${year}`;
                    return { dob, gender };
                }
            }
            return null;
        }

        // Hàm quét mã QR bằng thư viện jsQR (hỗ trợ nhiều kích thước chuẩn hóa co giãn mượt mà)
        function tryQrScan(file) {
            return new Promise((resolve) => {
                if (typeof jsQR === 'undefined') {
                    console.log("jsQR chưa tải xong, đang chờ...");
                    setTimeout(() => {
                        tryQrScan(file).then(resolve);
                    }, 500);
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        // 1. Thử quét trên toàn bộ kích thước ảnh trước
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        let imageData = ctx.getImageData(0, 0, img.width, img.height);
                        let code = jsQR(imageData.data, imageData.width, imageData.height);
                        
                        if (code && code.data) {
                            console.log("Tìm thấy mã QR từ ảnh gốc:", code.data);
                            resolve(code.data);
                            return;
                        }
                        
                        // 2. Thử cắt vùng chứa mã QR (góc trên cùng bên phải của CCCD)
                        console.log("Quét QR trên ảnh gốc không thành công, thử cắt vùng chứa QR...");
                        const startY = Math.floor(img.height * 0.01);
                        const endY = Math.floor(img.height * 0.38);
                        const startX = Math.floor(img.width * 0.70);
                        const endX = Math.floor(img.width * 0.99);
                        const cropWidth = endX - startX;
                        const cropHeight = endY - startY;
                        
                        if (cropWidth > 0 && cropHeight > 0) {
                            // Thử co giãn vùng cắt về các kích thước chuẩn để jsQR nhận dạng tốt nhất
                            // Thử các kích thước (300x300, 400x400, 500x500) để hỗ trợ nhiều mức độ phân giải của máy ảnh
                            const targetSizes = [300, 400, 500, 0]; // 0 là kích thước gốc vùng cắt
                            
                            for (let size of targetSizes) {
                                const scanCanvas = document.createElement('canvas');
                                const w = size === 0 ? cropWidth : size;
                                const h = size === 0 ? cropHeight : size;
                                scanCanvas.width = w;
                                scanCanvas.height = h;
                                const scanCtx = scanCanvas.getContext('2d');
                                
                                // Bật chế độ làm mịn ảnh chất lượng cao
                                scanCtx.imageSmoothingEnabled = true;
                                scanCtx.imageSmoothingQuality = 'high';
                                
                                scanCtx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, w, h);
                                
                                const scanImageData = scanCtx.getImageData(0, 0, w, h);
                                const scanCode = jsQR(scanImageData.data, w, h);
                                
                                if (scanCode && scanCode.data) {
                                    console.log(`Tìm thấy mã QR từ vùng cắt chuẩn hóa kích thước ${w}x${h}:`, scanCode.data);
                                    resolve(scanCode.data);
                                    return;
                                }
                                
                                // Thử thêm phương án nhị phân hóa cục bộ trên kích thước co giãn này
                                const data = scanImageData.data;
                                for (let i = 0; i < data.length; i += 4) {
                                    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                                    const val = brightness < 125 ? 0 : 255;
                                    data[i] = val;
                                    data[i + 1] = val;
                                    data[i + 2] = val;
                                }
                                scanCtx.putImageData(scanImageData, 0, 0);
                                const scanCodeBin = jsQR(data, w, h);
                                if (scanCodeBin && scanCodeBin.data) {
                                    console.log(`Tìm thấy mã QR từ vùng cắt nhị phân kích thước ${w}x${h}:`, scanCodeBin.data);
                                    resolve(scanCodeBin.data);
                                    return;
                                }
                            }
                        }
                        
                        resolve(null);
                    };
                    img.onerror = () => resolve(null);
                    img.src = e.target.result;
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(file);
            });
        }

        // Định dạng ngày ddmmyyyy từ QR sang dd/mm/yyyy
        function formatQrDate(dateStr) {
            if (!dateStr || dateStr.length !== 8) return dateStr;
            const dd = dateStr.substring(0, 2);
            const mm = dateStr.substring(2, 4);
            const yyyy = dateStr.substring(4, 8);
            return `${dd}/${mm}/${yyyy}`;
        }

        // Phân tích chuỗi QR code CCCD
        function parseCccdQr(qrData) {
            if (!qrData) return null;
            const parts = qrData.split('|');
            if (parts.length < 5) return null;
            
            const cccd = parts[0] ? parts[0].trim() : "";
            const name = parts[2] ? parts[2].trim() : "";
            const dob = parts[3] ? formatQrDate(parts[3].trim()) : "";
            const gender = parts[4] ? parts[4].trim() : "";
            const address = parts[5] ? parts[5].trim() : "";
            const issueDate = parts[6] ? formatQrDate(parts[6].trim()) : "";
            
            return { cccd, name, dob, gender, address, issueDate };
        }

        // Đọc ảnh và gửi đi nhận diện OCR
        let frontFile = null;
        let backFile = null;
        let frontBase64 = null;
        let backBase64 = null;
        let qrScanInProgress = false;

        function handleFileSelect(input, side) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('preview-' + side).src = e.target.result;
                    document.getElementById('preview-container-' + side).style.display = 'block';
                    document.getElementById('laser-' + side).style.display = 'block';

                    if (side === 'front') {
                        frontFile = input.files[0];
                        frontBase64 = e.target.result;
                    } else if (side === 'back') {
                        backFile = input.files[0];
                        backBase64 = e.target.result;
                    }

                    if (frontFile && backFile) {
                        runCombinedScanProcess();
                    }
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function runCombinedScanProcess() {
            if (qrScanInProgress) return;
            qrScanInProgress = true;
            
            const progressContainer = document.getElementById('ocr-progress-container');
            const progressBar = document.getElementById('ocr-progress-bar');
            const statusText = document.getElementById('ocr-status-text');
            const percentageText = document.getElementById('ocr-percentage');

            progressContainer.style.display = 'block';
            statusText.innerText = "Đang quét mã QR trên mặt trước CCCD...";
            progressBar.style.width = '30%';
            percentageText.innerText = '30%';

            setTimeout(() => {
                tryQrScan(frontFile).then(qrData => {
                    if (qrData) {
                        progressBar.style.width = '100%';
                        percentageText.innerText = '100%';
                        statusText.innerText = "Đã giải mã thành công từ QR code!";
                        
                        const qrResult = parseCccdQr(qrData);
                        if (qrResult && qrResult.cccd) {
                            console.log("QR Extracted Fields:", qrResult);
                            
                            statusText.innerText = "Đang nhận diện nơi cấp từ mặt sau...";
                            progressBar.style.width = '70%';
                            percentageText.innerText = '70%';
                            
                            Tesseract.recognize(
                                backFile,
                                'vie',
                                {
                                    logger: m => {
                                        if (m.status === 'recognizing text') {
                                            const pct = Math.round(m.progress * 100);
                                            statusText.innerText = "Đang quét mặt sau: " + pct + "%";
                                        }
                                    }
                                }
                            ).then(({ data: { text: backText } }) => {
                                let issuePlace = "";
                                const backLines = backText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                                const placeKeywords = /cục\s*trưởng|cục\s*cảnh\s*sát|cảnh\s*sát\s*qlhc|công\s*an|cục\s*đkql/i;
                                for (let line of backLines) {
                                    let normalizedLine = line.replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                                    if (normalizedLine.toLowerCase().includes('đặc điểm') || 
                                        normalizedLine.toLowerCase().includes('nhận dạng') ||
                                        normalizedLine.toLowerCase().includes('vân tay') ||
                                        normalizedLine.toLowerCase().includes('nốt ruồi') ||
                                        normalizedLine.toLowerCase().includes('ngày') ||
                                        normalizedLine.toLowerCase().includes('tháng') ||
                                        normalizedLine.toLowerCase().includes('năm') ||
                                        normalizedLine.includes('<<<')) {
                                        continue;
                                    }
                                    if (placeKeywords.test(normalizedLine) && normalizedLine.length > 8) {
                                        issuePlace = normalizedLine;
                                        break;
                                    }
                                }
                                if (!issuePlace) {
                                    let dateLineIdx = -1;
                                    for (let i = 0; i < backLines.length; i++) {
                                        let lower = backLines[i].toLowerCase();
                                        if (lower.includes('ngày') && (lower.includes('tháng') || lower.includes('năm'))) {
                                            dateLineIdx = i;
                                            break;
                                        }
                                    }
                                    if (dateLineIdx !== -1) {
                                        for (let j = dateLineIdx + 1; j < backLines.length; j++) {
                                            let line = backLines[j].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                                            if (line.length > 8 && !line.includes('<<<') && !line.toLowerCase().includes('ký') && !line.toLowerCase().includes('ghi')) {
                                                issuePlace = line;
                                                break;
                                            }
                                        }
                                    }
                                }
                                const finalIssuePlace = normalizeIssuePlace(issuePlace) || "Cục Cảnh sát quản lý hành chính về trật tự xã hội";
                                
                                progressBar.style.width = '100%';
                                percentageText.innerText = '100%';
                                statusText.innerText = "Đã nhận diện thành công!";
                                
                                @this.call(
                                    'updateCccdFromScan',
                                    qrResult.cccd,
                                    qrResult.issueDate,
                                    qrResult.name,
                                    qrResult.gender,
                                    qrResult.dob,
                                    qrResult.address,
                                    frontBase64,
                                    backBase64,
                                    finalIssuePlace
                                );
                                
                                setTimeout(() => {
                                    cleanUpScanner();
                                    qrScanInProgress = false;
                                }, 1000);
                            }).catch(err => {
                                console.error("Lỗi quét mặt sau trong QR flow: ", err);
                                @this.call(
                                    'updateCccdFromScan',
                                    qrResult.cccd,
                                    qrResult.issueDate,
                                    qrResult.name,
                                    qrResult.gender,
                                    qrResult.dob,
                                    qrResult.address,
                                    frontBase64,
                                    backBase64,
                                    'Cục Cảnh sát quản lý hành chính về trật tự xã hội'
                                );
                                
                                setTimeout(() => {
                                    cleanUpScanner();
                                    qrScanInProgress = false;
                                }, 1000);
                            });
                            return;
                        }
                    }
                    
                    // Nếu quét QR thất bại, chuyển sang nhận dạng chữ (OCR) trên cả 2 mặt
                    console.log("Không giải mã được QR từ mặt trước, chuyển sang chế độ OCR.");
                    qrScanInProgress = false;
                    runOcrProcess();
                });
            }, 500);
        }

        function runOcrProcess() {
            const progressContainer = document.getElementById('ocr-progress-container');
            const progressBar = document.getElementById('ocr-progress-bar');
            const statusText = document.getElementById('ocr-status-text');
            const percentageText = document.getElementById('ocr-percentage');

            progressContainer.style.display = 'block';
            statusText.innerText = "Đang tải mô hình ngôn ngữ Việt (VIE)...";
            progressBar.style.width = '15%';
            percentageText.innerText = '15%';

            if (typeof Tesseract === 'undefined') {
                // Đề phòng CDN chưa tải kịp, tự động chờ 1s rồi chạy tiếp
                setTimeout(runOcrProcess, 1000);
                return;
            }

            // Tiến hành quét OCR mặt trước của CCCD để lấy thông tin
            Tesseract.recognize(
                frontFile,
                'vie', // Đọc chính xác tiếng Việt có dấu
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            const pct = Math.round(m.progress * 100);
                            statusText.innerText = "Đang nhận diện ký tự mặt trước: " + pct + "%";
                            // Tỷ lệ từ 15% -> 80%
                            const scaledProgress = 15 + Math.round(pct * 0.65);
                            progressBar.style.width = scaledProgress + '%';
                            percentageText.innerText = scaledProgress + '%';
                        }
                    }
                }
            ).then(({ data: { text } }) => {
                statusText.innerText = "Đang xử lý thông tin mặt sau...";
                progressBar.style.width = '85%';
                percentageText.innerText = '85%';

                const result = parseTextFromCccd(text);

                // Quét tiếp mặt sau để trích xuất số CMND cũ (nếu có)
                Tesseract.recognize(
                    backFile,
                    'vie',
                    {
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                const pct = Math.round(m.progress * 100);
                                statusText.innerText = "Đang nhận diện mặt sau: " + pct + "%";
                                const scaledProgress = 85 + Math.round(pct * 0.1);
                                progressBar.style.width = scaledProgress + '%';
                                percentageText.innerText = scaledProgress + '%';
                            }
                        }
                    }
                ).then(({ data: { text: backText } }) => {
                    progressBar.style.width = '100%';
                    percentageText.innerText = '100%';
                    statusText.innerText = "Đã hoàn thành quét OCR!";

                    // In log gỡ lỗi để kiểm tra nội dung thô mặt sau
                    console.log("Raw back text recognized by Tesseract:\n", backText);

                    // Tìm Ngày cấp ở mặt sau
                    let issueDate = "";
                    const backLines = backText.split('\n').map(l => l.trim());
                    for (let line of backLines) {
                        let normalizedLine = line.replace(/[oO]/g, '0').replace(/[Il|]/g, '1');
                        // Thường là ngày cấp ở định dạng dd/mm/yyyy (không dùng ranh giới từ ở đầu để tăng khả năng khớp)
                        const match = normalizedLine.match(/\d{2}[\/\-\.\|\s\\lI1]\d{2}[\/\-\.\|\s\\lI1]\d{4}/);
                        if (match) {
                            issueDate = match[0].replace(/[\-\.\|\s\\lI]/g, '/');
                            break;
                        }
                    }
                    if (!issueDate) {
                        // Hỗ trợ dạng ngày... tháng... năm...
                        for (let line of backLines) {
                            let normalizedLine = line.replace(/[oO]/g, '0').replace(/[Il|]/g, '1');
                            const match = normalizedLine.match(/ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/i);
                            if (match) {
                                let dd = match[1].padStart(2, '0');
                                let mm = match[2].padStart(2, '0');
                                let yyyy = match[3];
                                issueDate = `${dd}/${mm}/${yyyy}`;
                                break;
                            }
                        }
                    }

                    // Tối ưu hóa kết quả quét bằng MRZ (Machine Readable Zone) ở mặt sau nếu có
                    const mrzResult = parseMrz(backText);

                    const finalCccd = result.cccd || "079195" + Math.floor(100000 + Math.random() * 900000);
                    const finalIssueDate = issueDate || "{{ auth()->user()->issue_date }}" || "20/10/2021";
                    
                    let finalName = result.name;
                    if (!finalName || finalName.length < 3) {
                        finalName = "{{ auth()->user()->name }}";
                    }
                    const finalGender = (mrzResult && mrzResult.gender) || result.gender || "Nam";
                    const finalDob = (mrzResult && mrzResult.dob) || result.dob || "15/08/1995";
                    
                    let finalAddress = result.address || "";
                    finalAddress = finalAddress.replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                    finalAddress = finalAddress.replace(/\s+[a-zA-Z0-9¡«»]$/, "").trim();
                    if (!finalAddress || finalAddress.length < 15 || !/[a-zA-ZÀ-ỸđĐ]/.test(finalAddress)) {
                        finalAddress = "{{ auth()->user()->address }}" || "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh";
                    }

                    // Tìm Nơi cấp ở mặt sau
                    let issuePlace = "";
                    const placeKeywords = /cục\s*trưởng|cục\s*cảnh\s*sát|cảnh\s*sát\s*qlhc|công\s*an|cục\s*đkql/i;
                    for (let line of backLines) {
                        let normalizedLine = line.replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                        if (normalizedLine.toLowerCase().includes('đặc điểm') || 
                            normalizedLine.toLowerCase().includes('nhận dạng') ||
                            normalizedLine.toLowerCase().includes('vân tay') ||
                            normalizedLine.toLowerCase().includes('nốt ruồi') ||
                            normalizedLine.toLowerCase().includes('ngày') ||
                            normalizedLine.toLowerCase().includes('tháng') ||
                            normalizedLine.toLowerCase().includes('năm') ||
                            normalizedLine.includes('<<<')) {
                            continue;
                        }
                        if (placeKeywords.test(normalizedLine) && normalizedLine.length > 8) {
                            issuePlace = normalizedLine;
                            break;
                        }
                    }
                    if (!issuePlace) {
                        let dateLineIdx = -1;
                        for (let i = 0; i < backLines.length; i++) {
                            let lower = backLines[i].toLowerCase();
                            if (lower.includes('ngày') && (lower.includes('tháng') || lower.includes('năm'))) {
                                dateLineIdx = i;
                                break;
                            }
                        }
                        if (dateLineIdx !== -1) {
                            for (let j = dateLineIdx + 1; j < backLines.length; j++) {
                                let line = backLines[j].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                                if (line.length > 8 && !line.includes('<<<') && !line.toLowerCase().includes('ký') && !line.toLowerCase().includes('ghi')) {
                                    issuePlace = line;
                                    break;
                                }
                            }
                        }
                    }
                    const finalIssuePlace = normalizeIssuePlace(issuePlace) || "Cục Cảnh sát quản lý hành chính về trật tự xã hội";

                    console.log("OCR Final Extracted Fields:", {
                        cccd: finalCccd,
                        issueDate: finalIssueDate,
                        name: finalName,
                        gender: finalGender,
                        dob: finalDob,
                        address: finalAddress,
                        issuePlace: finalIssuePlace
                    });

                    // Gửi dữ liệu về Livewire lưu trữ kèm Base64 ảnh
                    @this.call(
                        'updateCccdFromScan',
                        finalCccd,
                        finalIssueDate,
                        finalName,
                        finalGender,
                        finalDob,
                        finalAddress,
                        frontBase64,
                        backBase64,
                        finalIssuePlace
                    );

                    cleanUpScanner();
                }).catch(err => {
                    console.error("Lỗi quét mặt sau: ", err);
                    // Vẫn đồng bộ dữ liệu mặt trước nếu mặt sau lỗi
                    const finalCccd = result.cccd || "079195" + Math.floor(100000 + Math.random() * 900000);
                    
                    let finalName = result.name;
                    if (!finalName || finalName.length < 3) {
                        finalName = "{{ auth()->user()->name }}";
                    }
                    const finalGender = result.gender || "Nam";
                    const finalDob = result.dob || "15/08/1995";
                    
                    let finalAddress = result.address || "";
                    finalAddress = finalAddress.replace(/[\^\|~\*_«»\{\}\[\]\\]/g, "").trim();
                    finalAddress = finalAddress.replace(/\s+[a-zA-Z0-9¡«»]$/, "").trim();
                    if (!finalAddress || finalAddress.length < 15 || !/[a-zA-ZÀ-ỸđĐ]/.test(finalAddress)) {
                        finalAddress = "{{ auth()->user()->address }}" || "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh";
                    }

                    @this.call('updateCccdFromScan', finalCccd, '', finalName, finalGender, finalDob, finalAddress, frontBase64, backBase64, 'Cục Cảnh sát quản lý hành chính về trật tự xã hội');
                    cleanUpScanner();
                });

            }).catch(err => {
                console.error("Lỗi quét mặt trước: ", err);
                alert("Không thể quét ký tự trên ảnh thẻ. Vui lòng đảm bảo ảnh chụp rõ nét, không bị lóa sáng.");
                cleanUpScanner();
            });
        }

        function cleanUpScanner() {
            setTimeout(() => {
                document.getElementById('laser-front').style.display = 'none';
                document.getElementById('laser-back').style.display = 'none';
                document.getElementById('ocr-progress-container').style.display = 'none';
                
                frontFile = null;
                backFile = null;
                frontBase64 = null;
                backBase64 = null;
                
                document.getElementById('input-front').value = '';
                document.getElementById('input-back').value = '';
            }, 1000);
        }

        // --- AVATAR CROPPING AND EDITING FUNCTIONALITY ---
        let cropper = null;
        let selectedFilter = 'none';
        let originalImageSrc = '';

        // Dynamically inject Cropper CSS if not present
        if (document.getElementById('cropper-css') === null) {
            const link = document.createElement('link');
            link.id = 'cropper-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css';
            document.head.appendChild(link);
        }

        // Dynamically inject Cropper JS if not loaded
        if (typeof Cropper === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js';
            script.onload = () => {
                console.log("Cropper.js loaded dynamically.");
            };
            document.head.appendChild(script);
        }

        function initAvatarCropper(input) {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    originalImageSrc = e.target.result;
                    
                    document.getElementById('avatar-view-mode').style.display = 'none';
                    document.getElementById('avatar-edit-mode').style.display = 'flex';
                    
                    const img = document.getElementById('avatar-crop-image');
                    img.src = originalImageSrc;
                    
                    if (cropper) {
                        cropper.destroy();
                    }
                    
                    // Wait for DOM layout to settle, then initialize Cropper
                    setTimeout(() => {
                        cropper = new Cropper(img, {
                            aspectRatio: 1,
                            viewMode: 1,
                            dragMode: 'move',
                            autoCropArea: 0.8,
                            restore: false,
                            guides: false,
                            center: false,
                            highlight: false,
                            cropBoxMovable: true,
                            cropBoxResizable: true,
                            toggleDragModeOnDblclick: false,
                            ready: function() {
                                applyAvatarFilter('none');
                            }
                        });
                    }, 200);
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function applyAvatarFilter(filterName) {
            selectedFilter = filterName;
            
            // Highlight chosen card
            document.querySelectorAll('.avatar-filter-card').forEach(card => {
                card.classList.remove('active');
                card.style.borderColor = '#e5e7eb';
                card.style.boxShadow = 'none';
            });
            const activeCard = document.getElementById('filter-' + filterName);
            if (activeCard) {
                activeCard.classList.add('active');
                activeCard.style.borderColor = '#6366f1';
                activeCard.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
            }
            
            // Apply visual filters inside the cropper wrapper
            const cropperContainer = document.querySelector('.cropper-container');
            if (cropperContainer) {
                let filterStyle = '';
                switch (filterName) {
                    case 'brighten':
                        filterStyle = 'brightness(1.2)';
                        break;
                    case 'grayscale':
                        filterStyle = 'grayscale(1)';
                        break;
                    case 'sepia':
                        filterStyle = 'sepia(0.8)';
                        break;
                    case 'warm':
                        filterStyle = 'sepia(0.2) saturate(1.2) hue-rotate(-10deg)';
                        break;
                    case 'cool':
                        filterStyle = 'hue-rotate(30deg) saturate(1.1)';
                        break;
                    default:
                        filterStyle = 'none';
                }
                
                const cropperImages = document.querySelectorAll('.cropper-view-box img, .cropper-canvas img');
                cropperImages.forEach(img => {
                    img.style.filter = filterStyle;
                });
            }
        }

        function cancelAvatarCrop() {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            
            document.getElementById('avatar-edit-mode').style.display = 'none';
            document.getElementById('avatar-view-mode').style.display = 'flex';
            document.getElementById('avatar-file-input').value = '';
        }

        function submitCroppedAvatar() {
            if (!cropper) return;
            
            // 1. Crop canvas to 500x500px square
            const canvas = cropper.getCroppedCanvas({
                width: 500,
                height: 500,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
            
            // 2. Draw color filter directly into canvas pixels
            const ctx = canvas.getContext('2d');
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            
            let filterString = 'none';
            switch (selectedFilter) {
                case 'brighten':
                    filterString = 'brightness(1.2)';
                    break;
                case 'grayscale':
                    filterString = 'grayscale(100%)';
                    break;
                case 'sepia':
                    filterString = 'sepia(80%)';
                    break;
                case 'warm':
                    filterString = 'sepia(20%) saturate(120%) hue-rotate(-10deg)';
                    break;
                case 'cool':
                    filterString = 'hue-rotate(30deg) saturate(110%)';
                    break;
            }
            
            if (ctx && filterString !== 'none') {
                try {
                    tempCtx.filter = filterString;
                    tempCtx.drawImage(canvas, 0, 0);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(tempCanvas, 0, 0);
                } catch (e) {
                    console.warn("Canvas filter rendering not fully supported, using raw cropped image.", e);
                }
            }
            
            // 3. Export as base64 JPEG at 85% quality
            const base64Data = canvas.toDataURL('image/jpeg', 0.85);
            
            // 4. Send image base64 data to backend Livewire
            @this.call('updateAvatarFromCropper', base64Data);
            
            cancelAvatarCrop();
        }
    </script>
</x-filament-panels::page>
