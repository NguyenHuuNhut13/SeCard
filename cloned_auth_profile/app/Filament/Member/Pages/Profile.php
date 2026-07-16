<?php

namespace App\Filament\Member\Pages;

use Filament\Pages\Page;
use App\Services\CompanyApiService;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Schema;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Unique;
use Livewire\Attributes\Url;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Grid;

class Profile extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-user-circle';

    protected static ?string $navigationLabel = 'Hồ sơ';

    protected static ?string $title = 'Hồ sơ';

    protected static ?string $slug = 'profile';

    protected string $view = 'filament.member.pages.profile';

    #[Url]
    public string $activeTab = 'personal';

    public bool $isEditing = false;

    public ?array $profileData = [];
    public ?array $cccdData = [];
    public ?array $avatarData = [];
    public ?array $passwordData = [];

    public function mount(): void
    {
        $user = auth()->user();

        $this->profileData = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'zalo' => $user->zalo,
        ];

        $this->cccdData = [
            'cccd' => $user->cccd,
            'name' => $user->name,
            'gender' => $user->gender,
            'dob' => $user->dob,
            'address' => $user->address,
            'issue_date' => $user->issue_date,
            'issue_place' => $user->issue_place,
        ];

        $this->avatarData = [
            'avatar' => $user->avatar,
        ];

        $this->passwordData = [
            'old_password' => '',
            'new_password' => '',
            'new_password_confirmation' => '',
        ];

        $this->profileForm->fill($this->profileData);
        $this->cccdForm->fill($this->cccdData);
        $this->avatarForm->fill($this->avatarData);
    }

    protected function getForms(): array
    {
        return [
            'profileForm',
            'cccdForm',
            'avatarForm',
        ];
    }

    public function profileForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Họ và tên')
                    ->required()
                    ->placeholder('Ví dụ: Nguyễn Văn A'),

                TextInput::make('email')
                    ->label('Địa chỉ Email')
                    ->email()
                    ->required()
                    ->unique(
                        table: 'users',
                        column: 'email',
                        ignorable: fn () => auth()->user()
                    )
                    ->placeholder('Ví dụ: nhut@example.com'),

                TextInput::make('phone')
                    ->label('Số điện thoại')
                    ->tel()
                    ->placeholder('Ví dụ: 0932030958'),

                TextInput::make('zalo')
                    ->label('Số Zalo / Link Zalo')
                    ->placeholder('Ví dụ: 0932030958'),
            ])
            ->statePath('profileData');
    }

    public function cccdForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('cccd')
                    ->label('Số Căn cước công dân (CCCD)')
                    ->placeholder('Ví dụ: 079195000123')
                    ->maxLength(15)
                    ->required(),

                TextInput::make('name')
                    ->label('Họ và tên')
                    ->placeholder('Ví dụ: NGUYỄN VĂN A')
                    ->required(),

                TextInput::make('issue_date')
                    ->label('Ngày cấp')
                    ->placeholder('Ví dụ: 20/10/2021'),

                TextInput::make('issue_place')
                    ->label('Nơi cấp')
                    ->placeholder('Ví dụ: Cục Cảnh sát QLHC về TTXH'),
            ])
            ->statePath('cccdData');
    }

    public function avatarForm(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('avatar')
                    ->label('Ảnh đại diện (Avatar)')
                    ->image()
                    ->avatar()
                    ->disk('public')
                    ->directory('avatars')
                    ->columnSpanFull()
                    ->required(),
            ])
            ->statePath('avatarData');
    }



    /**
     * Lấy API token của company: ưu tiên từ session, fallback sang DB.
     * Điều này tránh mất token trên môi trường serverless (Vercel).
     */
    protected function getApiToken(): ?string
    {
        $token = session('company_api_token');
        if (!$token) {
            $token = auth()->user()->company_api_token ?? null;
            // Đồng bộ lại session nếu lấy từ DB
            if ($token) {
                session(['company_api_token' => $token]);
            }
        }
        return $token ?: null;
    }


    public function enableEditing(): void
    {
        $this->isEditing = true;
    }

    public function cancelEdit(): void
    {
        $user = auth()->user();
        $this->profileData = [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'zalo' => $user->zalo,
        ];
        $this->profileForm->fill($this->profileData);
        $this->isEditing = false;
    }

    public function saveProfile(): void
    {
        $user = auth()->user();
        $data = $this->profileForm->getState();
        $token = $this->getApiToken();

        if ($token) {
            $profileRes = CompanyApiService::updateProfile($token, [
                'name' => $data['name'],
                'phone' => $data['phone'],
                'zalo' => $data['zalo'],
            ]);

            if (!$profileRes['success']) {
                Notification::make()
                    ->title('Lỗi cập nhật thông tin lên hệ thống: ' . $profileRes['message'])
                    ->danger()
                    ->send();
                return;
            }
        }

        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->phone = $data['phone'];
        $user->zalo = $data['zalo'];
        $user->save();

        Notification::make()
            ->title('Đã cập nhật thông tin cá nhân thành công!')
            ->success()
            ->send();

        $this->isEditing = false;
    }

    public function saveCccd(): void
    {
        $user  = auth()->user();
        $data  = $this->cccdForm->getState();
        $token = $this->getApiToken();

        // Lưu local
        $nameChanged = $data['name'] !== $user->name;
        if ($nameChanged) {
            $user->name = $data['name'];
            $this->profileData['name'] = $data['name'];
            $this->profileForm->fill($this->profileData);
        }
        $user->cccd        = $data['cccd'];
        $user->gender      = $data['gender'] ?? $user->gender;
        $user->dob         = $data['dob'] ?? $user->dob;
        $user->address     = $data['address'] ?? $user->address;
        $user->issue_date  = $data['issue_date'];
        $user->issue_place = $data['issue_place'] ?? null;
        $user->save();

        // Cập nhật tên lên API nếu có thay đổi (updateInfo hoạt động bình thường)
        if ($token && $nameChanged) {
            CompanyApiService::updateProfile($token, [
                'name'  => $data['name'],
                'phone' => $user->phone,
                'zalo'  => $user->zalo,
            ]);
        }

        // Cập nhật CCCD lên API công ty nếu có token
        if ($token) {
            $frontBase64 = null;
            $backBase64 = null;

            if ($user->cccd_front) {
                // Đọc file từ storage để chuyển thành base64 data URL
                $frontContent = \Illuminate\Support\Facades\Storage::disk('public')->get($user->cccd_front);
                if ($frontContent) {
                    $frontBase64 = 'data:image/jpeg;base64,' . base64_encode($frontContent);
                }
            }

            if ($user->cccd_back) {
                $backContent = \Illuminate\Support\Facades\Storage::disk('public')->get($user->cccd_back);
                if ($backContent) {
                    $backBase64 = 'data:image/jpeg;base64,' . base64_encode($backContent);
                }
            }

            $cccdRes = CompanyApiService::updateCccd($token, [
                'cccd' => $data['cccd'],
                'issue_date' => $data['issue_date'],
                'address' => $data['issue_place'] ?? 'Cục Cảnh sát QLHC về TTXH', // default or issuing authority
                'front_base64' => $frontBase64,
                'back_base64' => $backBase64,
            ]);

            if (!$cccdRes['success']) {
                Notification::make()
                    ->title('Lỗi cập nhật CCCD lên hệ thống: ' . $cccdRes['message'])
                    ->danger()
                    ->send();
                return;
            }
        }

        Notification::make()
            ->title('Cập nhật CCCD thành công!')
            ->success()
            ->send();
    }


    public function saveAvatar(): void
    {
        $user = auth()->user();
        $data = $this->avatarForm->getState();
        $token = $this->getApiToken();

        if (!empty($data['avatar']) && $data['avatar'] !== $user->avatar) {
            if ($token) {
                $avatarPath = storage_path('app/public/' . $data['avatar']);
                if (file_exists($avatarPath)) {
                    $avatarRes = CompanyApiService::updateAvatar($token, $avatarPath);
                    if (!$avatarRes['success']) {
                        Notification::make()
                            ->title('Lỗi cập nhật ảnh đại diện: ' . $avatarRes['message'])
                            ->danger()
                            ->send();
                        return;
                    }
                }
            }

            $user->avatar = $data['avatar'];
            $user->save();

            Notification::make()
                ->title('Cập nhật ảnh đại diện thành công!')
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Ảnh đại diện không thay đổi hoặc không hợp lệ.')
                ->warning()
                ->send();
        }
    }

    public function savePassword(): void
    {
        $this->validate([
            'passwordData.old_password' => 'required',
            'passwordData.new_password' => 'required|min:6',
            'passwordData.new_password_confirmation' => 'required|same:passwordData.new_password',
        ], [
            'passwordData.old_password.required' => 'Mật khẩu hiện tại không được để trống.',
            'passwordData.new_password.required' => 'Mật khẩu mới không được để trống.',
            'passwordData.new_password.min' => 'Mật khẩu mới phải chứa ít nhất 6 ký tự.',
            'passwordData.new_password_confirmation.required' => 'Xác nhận mật khẩu mới không được để trống.',
            'passwordData.new_password_confirmation.same' => 'Xác nhận mật khẩu mới không trùng khớp.',
        ]);

        $user = auth()->user();
        $data = $this->passwordData;
        $token = $this->getApiToken();

        if ($token) {
            $passRes = CompanyApiService::updatePassword($token, $data['old_password'], $data['new_password']);
            if (!$passRes['success']) {
                Notification::make()
                    ->title('Lỗi đổi mật khẩu: ' . $passRes['message'])
                    ->danger()
                    ->send();
                return;
            }
        } else {
            if (!Hash::check($data['old_password'], $user->password)) {
                Notification::make()
                    ->title('Mật khẩu hiện tại không chính xác.')
                    ->danger()
                    ->send();
                return;
            }
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        Notification::make()
            ->title('Đổi mật khẩu thành công!')
            ->success()
            ->send();

        $this->passwordData = [
            'old_password' => '',
            'new_password' => '',
            'new_password_confirmation' => '',
        ];
    }

    public function updateCccdFromScan(
        string $cccd,
        ?string $issueDate = null,
        ?string $name = null,
        ?string $gender = null,
        ?string $dob = null,
        ?string $address = null,
        ?string $frontBase64 = null,
        ?string $backBase64 = null,
        ?string $issuePlace = null
    ): void {
        $user = auth()->user();
        $token = $this->getApiToken();

        // Lưu ảnh mặt trước và mặt sau cục bộ vào storage
        $frontPath = $user->cccd_front;
        $backPath = $user->cccd_back;

        // Tạo thư mục nếu chưa tồn tại
        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists('cccds')) {
            \Illuminate\Support\Facades\Storage::disk('public')->makeDirectory('cccds');
        }

        if ($frontBase64) {
            $frontData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $frontBase64));
            $frontPath = 'cccds/' . $user->id . '_front.jpg';
            \Illuminate\Support\Facades\Storage::disk('public')->put($frontPath, $frontData);
        }
        if ($backBase64) {
            $backData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $backBase64));
            $backPath = 'cccds/' . $user->id . '_back.jpg';
            \Illuminate\Support\Facades\Storage::disk('public')->put($backPath, $backData);
        }

        // Cập nhật CCCD form state
        $this->cccdData = [
            'cccd' => $cccd,
            'name' => $name,
            'gender' => $gender,
            'dob' => $dob,
            'address' => $address,
            'issue_date' => $issueDate,
            'issue_place' => $issuePlace,
        ];
        $this->cccdForm->fill($this->cccdData);

        // Cập nhật tên nếu có
        if ($name && $name !== $user->name) {
            $this->profileData['name'] = $name;
            $this->profileForm->fill($this->profileData);

            if ($token) {
                CompanyApiService::updateProfile($token, [
                    'name'  => $name,
                    'phone' => $user->phone,
                    'zalo'  => $user->zalo,
                ]);
            }
            $user->name = $name;
        }

        // Lưu CCCD local
        $user->cccd        = $cccd;
        $user->gender      = $gender;
        $user->dob         = $dob;
        $user->address     = $address;
        $user->issue_date  = $issueDate;
        $user->issue_place = $issuePlace;
        $user->cccd_front  = $frontPath;
        $user->cccd_back   = $backPath;
        $user->save();

        // Cập nhật CCCD lên API công ty nếu có token
        if ($token) {
            $cccdRes = CompanyApiService::updateCccd($token, [
                'cccd' => $cccd,
                'issue_date' => $issueDate,
                'address' => $issuePlace ?: 'Cục Cảnh sát QLHC về TTXH', // default or issuing authority
                'front_base64' => $frontBase64,
                'back_base64' => $backBase64,
            ]);

            if (!$cccdRes['success']) {
                Notification::make()
                    ->title('Lỗi cập nhật CCCD lên hệ thống: ' . $cccdRes['message'])
                    ->danger()
                    ->send();
                return;
            }
        }

        Notification::make()
            ->title('Nhận diện và cập nhật thông tin CCCD thành công!')
            ->success()
            ->send();
    }

    public function updateAvatarFromCropper(string $base64Data): void
    {
        $user = auth()->user();
        $token = $this->getApiToken();

        // 1. Decode base64 data
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Data));
        if (!$imageData) {
            Notification::make()
                ->title('Ảnh đại diện không hợp lệ.')
                ->danger()
                ->send();
            return;
        }

        // 2. Save image locally to public disk
        $filename = 'avatars/' . $user->id . '_' . time() . '.jpg';
        
        // Ensure avatars directory exists
        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists('avatars')) {
            \Illuminate\Support\Facades\Storage::disk('public')->makeDirectory('avatars');
        }
        
        \Illuminate\Support\Facades\Storage::disk('public')->put($filename, $imageData);
        $fullPublicPath = storage_path('app/public/' . $filename);

        // 3. Sync to Company API if token is present
        if ($token) {
            $avatarRes = CompanyApiService::updateAvatar($token, $base64Data);
            if (!$avatarRes['success']) {
                // Delete temporary local file
                \Illuminate\Support\Facades\Storage::disk('public')->delete($filename);
                
                Notification::make()
                    ->title('Lỗi cập nhật ảnh đại diện lên hệ thống: ' . $avatarRes['message'])
                    ->danger()
                    ->send();
                return;
            }
            // Use the URL returned by the API if available, otherwise fallback to local path
            $remoteUrl = $avatarRes['avatar_url'] ?? null;
            if ($remoteUrl) {
                // If it is successfully uploaded to NKS CDN, we store that URL
                $user->avatar = $remoteUrl;
            } else {
                $user->avatar = $filename;
            }
        } else {
            $user->avatar = $filename;
        }

        $user->save();

        // Refresh the form state
        $this->avatarData = [
            'avatar' => $user->avatar,
        ];
        $this->avatarForm->fill($this->avatarData);

        Notification::make()
            ->title('Cập nhật ảnh đại diện thành công!')
            ->success()
            ->send();
    }
}

