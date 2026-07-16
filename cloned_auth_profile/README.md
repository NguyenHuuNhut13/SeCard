# HƯỚNG DẪN TÍCH HỢP TRANG ĐĂNG NHẬP & HỒ SƠ THÀNH VIÊN (KÈM E-CARD)

Tài liệu này hướng dẫn cách di chuyển và tích hợp tính năng **Đăng nhập**, **Hồ sơ thành viên** (kèm quét ảnh CCCD, cắt ảnh đại diện bằng Cropper, thẻ thành viên điện tử E-Card) sang dự án mới chạy Laravel và Filament.

---

## 1. Cấu trúc thư mục các tệp được Clone
Hãy sao chép các tệp tương ứng trong thư mục `cloned_auth_profile` vào dự án mới theo cấu trúc sau:

```text
dự-án-mới/
├── app/
│   ├── Filament/
│   │   ├── Member/
│   │   │   └── Pages/
│   │   │       └── Profile.php              <-- Class trang Hồ sơ cá nhân
│   │   └── Pages/
│   │       └── Auth/
│   │           └── MemberLogin.php          <-- Class xử lý Đăng nhập qua API và Local
│   └── Services/
│       └── CompanyApiService.php            <-- Kết nối API tài khoản NKS (account.nks.vn)
└── resources/
    └── views/
        └── filament/
            ├── hooks/
            │   └── login-remember-js.blade.php <-- Script JavaScript xử lý ghi nhớ tài khoản
            └── member/
                └── pages/
                    └── profile.blade.php    <-- Giao diện chi tiết Hồ sơ & E-Card
```

---

## 2. Di chuyển Cơ sở dữ liệu (Database Migration)
Tạo một file migration mới trong dự án mới để bổ sung các cột cần thiết cho bảng `users`:
```bash
php artisan make:migration add_profile_fields_to_users_table
```

Mở file migration vừa tạo và cập nhật nội dung như sau:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('zalo')->nullable()->after('phone');
            $table->string('avatar')->nullable()->after('zalo');
            $table->string('role')->default('member')->after('avatar');
            $table->string('status')->default('active')->after('role'); // active, blocked
            
            // Thông tin CCCD và thẻ thành viên
            $table->string('cccd')->nullable()->after('status');
            $table->string('gender')->nullable()->after('cccd');
            $table->string('dob')->nullable()->after('gender');
            $table->text('address')->nullable()->after('dob');
            $table->string('issue_date')->nullable()->after('address');
            $table->string('issue_place')->nullable()->after('issue_date');
            $table->string('cccd_front')->nullable()->after('issue_place');
            $table->string('cccd_back')->nullable()->after('cccd_front');
            $table->text('company_api_token')->nullable()->after('cccd_back');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'zalo', 'avatar', 'role', 'status',
                'cccd', 'gender', 'dob', 'address', 'issue_date', 'issue_place',
                'cccd_front', 'cccd_back', 'company_api_token'
            ]);
        });
    }
};
```
Sau đó chạy lệnh:
```bash
php artisan migrate
```

---

## 3. Cập nhật Model `User.php`
Trong dự án mới, hãy mở file `app/Models/User.php` và thực hiện các chỉnh sửa sau:

1. Thêm các trường mới vào mảng `$fillable` để cho phép ghi dữ liệu:
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'phone',
    'zalo',
    'avatar',
    'role',
    'status',
    'cccd',
    'gender',
    'dob',
    'address',
    'issue_date',
    'issue_place',
    'cccd_front',
    'cccd_back',
    'company_api_token',
];
```

2. Ẩn `company_api_token` trong mảng `$hidden`:
```php
protected $hidden = [
    'password',
    'remember_token',
    'company_api_token',
];
```

3. Triển khai interface `FilamentUser` và `HasAvatar` (nếu dùng Filament hiển thị ảnh đại diện):
```php
use Filament\Models\Contracts\FilamentUser;
use Filament\Models\Contracts\HasAvatar;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser, HasAvatar
{
    // ... các code cũ ...

    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'member') {
            return $this->status === 'active';
        }
        return true;
    }

    /**
     * Tự động lấy URL ảnh đại diện của User (từ NKS API hoặc Local storage)
     */
    public function getAvatarUrlAttribute(): string
    {
        if (!$this->avatar || str_contains($this->avatar, 'default.png')) {
            return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80';
        }

        if (str_starts_with($this->avatar, 'http://') || str_starts_with($this->avatar, 'https://')) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }
}
```

---

## 4. Đăng ký View Hooks trong `AppServiceProvider.php`
Để tính năng **ghi nhớ tài khoản** và **đồng bộ trạng thái tài khoản tự động** hoạt động chính xác thông qua `localStorage`, hãy mở tệp `app/Providers/AppServiceProvider.php` và thêm đoạn mã sau vào phương thức `boot()`:

```php
use Filament\Support\Facades\FilamentView;

public function boot(): void
{
    // Đăng ký JS Hook xử lý ghi nhớ mật khẩu/tài khoản trên trang đăng nhập
    FilamentView::registerRenderHook(
        'panels::auth.login.form.after',
        fn () => view('filament.hooks.login-remember-js')
    );

    // Đăng ký JS Hook tự động đồng bộ thông tin tài khoản vừa đăng nhập vào localStorage
    FilamentView::registerRenderHook(
        'panels::body.start',
        function () {
            if (auth()->check()) {
                $user = auth()->user();
                $email = json_encode($user->email);
                $name = json_encode($user->name);
                $avatar = json_encode($user->avatar_url);
                return "<script>
                    (function() {
                        const email = {$email};
                        const name = {$name};
                        const avatar = {$avatar};
                        
                        localStorage.setItem('nks_last_user_email', email);
                        localStorage.setItem('nks_last_user_name', name);
                        localStorage.setItem('nks_last_user_avatar', avatar);
                        
                        let accounts = [];
                        try {
                            accounts = JSON.parse(localStorage.getItem('nks_saved_accounts')) || [];
                        } catch(e) { accounts = []; }
                        if (!Array.isArray(accounts)) accounts = [];
                        
                        let existIndex = accounts.findIndex(acc => acc.email === email);
                        if (existIndex > -1) {
                            accounts[existIndex].name = name;
                            accounts[existIndex].avatar = avatar;
                        } else {
                            accounts.push({
                                email: email,
                                name: name,
                                avatar: avatar,
                                password: '',
                                remember: false
                            });
                        }
                        localStorage.setItem('nks_saved_accounts', JSON.stringify(accounts));
                    })();
                </script>";
            }
            return '';
        }
    );
}
```

---

## 5. Cấu hình Panel Provider của Filament (ví dụ `MemberPanelProvider.php`)
Cần đăng ký trang Login tùy chỉnh và trang Profile tùy chỉnh vào cấu hình panel của bạn.

Mở file cấu hình panel (thường là `app/Providers/Filament/MemberPanelProvider.php` hoặc `AdminPanelProvider.php`):

```php
use App\Filament\Pages\Auth\MemberLogin;
use App\Filament\Member\Pages\Profile;

public function panel(Panel $panel): Panel
{
    return $panel
        // ... các cấu hình khác ...
        
        // 1. Chỉ định class Đăng nhập tùy chỉnh
        ->login(MemberLogin::class)
        
        // 2. Thêm class trang hồ sơ vào danh sách pages
        ->pages([
            Pages\Dashboard::class,
            Profile::class, // <-- Thêm dòng này
        ])
        
        // 3. Khai báo các thư mục views của Livewire
        ->discoverPages(in: app_path('Filament/Member/Pages'), for: 'App\\Filament\\Member\\Pages')
        
        // 4. Nếu có sử dụng fileupload, đảm bảo cấu hình link storage chuẩn xác
        ->databaseNotifications();
}
```

---

## 6. Lưu ý về Thư viện Phụ thuộc (Dependencies)
* **FontAwesome**: Trang Hồ sơ và trang Đăng nhập có sử dụng một số icon FontAwesome. Đảm bảo rằng tệp layout tổng của Filament trong dự án mới hoặc view của bạn có nạp FontAwesome CDN (hoặc cài đặt cục bộ).
* **Cropper.js & Instascan**: Trong `profile.blade.php` đã nhúng sẵn các CDN của Cropper.js và Instascan cho chức năng cắt ảnh/quét mã QR. Bạn không cần cài đặt thêm thông qua npm/yarn.
