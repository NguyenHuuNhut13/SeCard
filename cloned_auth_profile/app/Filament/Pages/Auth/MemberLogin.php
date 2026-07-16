<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use App\Services\CompanyApiService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Filament\Notifications\Notification;
use Illuminate\Validation\ValidationException;

class MemberLogin extends BaseLogin
{
    public function authenticate(): ?\Filament\Auth\Http\Responses\Contracts\LoginResponse
    {
        try {
            $this->rateLimit(5);
        } catch (\Filament\Exceptions\RateLimitExceededException $exception) {
            Notification::make()
                ->title($exception->getMessage())
                ->danger()
                ->send();

            return null;
        }

        $data = $this->form->getState();

        // 1. Gọi API công ty để xác thực thông tin đăng nhập trước
        $apiResult = CompanyApiService::login($data['email'], $data['password']);

        $token = null;
        $apiUser = null;
        $isLocalAuth = false;
        $user = null;

        if ($apiResult['success']) {
            $token = $apiResult['token'];
            $apiUser = $apiResult['user'];
        } else {
            // Dự phòng: Thử đăng nhập bằng Database cục bộ (ví dụ: tài khoản admin@nks.vn)
            $localUser = User::where('email', $data['email'])->first();
            if ($localUser && Hash::check($data['password'], $localUser->password)) {
                $user = $localUser;
                $isLocalAuth = true;
            } else {
                // Nếu cả API và Database cục bộ đều thất bại, trả về lỗi của API
                throw ValidationException::withMessages([
                    'data.email' => $apiResult['message'] ?? 'Thông tin đăng nhập không chính xác.',
                ]);
            }
        }

        if (!$isLocalAuth) {
            // Nếu API đăng nhập thành công nhưng chưa có thông tin user, gọi API lấy Profile
            if (empty($apiUser)) {
                $profileResult = CompanyApiService::getProfile($token);
                if ($profileResult['success']) {
                    $apiUser = $profileResult['user'];
                }
            }

            // Cần đảm bảo có email để đối chiếu tài khoản cục bộ
            $email = $apiUser['email'] ?? $data['email'];

            // 2. Tìm hoặc tạo user cục bộ và đồng bộ thông tin từ API
            $user = User::where('email', $email)->first();

            $userData = [
                'name' => $apiUser['name'] ?? $apiUser['username'] ?? strtok($email, '@'),
                'phone' => $apiUser['phone'] ?? null,
                'zalo' => $apiUser['zalo'] ?? null,
                'avatar' => $apiUser['avatar'] ?? $apiUser['avatar_url'] ?? null,
                'cccd' => $apiUser['cccd'] ?? $apiUser['cccd_number'] ?? null,
                // Lưu hash password cục bộ để tương thích với auth của Laravel
                'password' => Hash::make($data['password']), 
            ];

            if ($user) {
                // Kiểm tra trạng thái khóa tài khoản cục bộ
                if ($user->status === 'blocked') {
                    throw ValidationException::withMessages([
                        'data.email' => 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
                    ]);
                }
                $user->update($userData);
            } else {
                $userData['email'] = $email;
                $userData['role'] = 'member'; // Mặc định gán vai trò member
                $userData['status'] = 'active';
                $user = User::create($userData);
            }

            // 3. Lưu Access Token vào session VÀ database (để bền vững hơn trên serverless)
            session(['company_api_token' => $token]);
            try {
                $user->company_api_token = $token;
                $user->save();
            } catch (\Exception $e) {
                // Cột company_api_token có thể chưa tồn tại nếu migration chưa chạy
                // Token đã được lưu trong session, đăng nhập vẫn thành công
                \Illuminate\Support\Facades\Log::warning('Could not save company_api_token to DB: ' . $e->getMessage());
            }
        } else {
            // Kiểm tra trạng thái khóa tài khoản cục bộ đối với tài khoản local
            if ($user->status === 'blocked') {
                throw ValidationException::withMessages([
                    'data.email' => 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
                ]);
            }
        }

        // 4. Đăng nhập cục bộ trong Laravel
        Auth::login($user, $data['remember'] ?? false);

        session()->regenerate();

        // 5. Chuyển hướng về trang chủ thay vì trang tài khoản/dashboard
        return new class implements \Filament\Auth\Http\Responses\Contracts\LoginResponse {
            public function toResponse($request): \Illuminate\Http\RedirectResponse|\Livewire\Features\SupportRedirects\Redirector
            {
                return redirect('/');
            }
        };
    }
}
