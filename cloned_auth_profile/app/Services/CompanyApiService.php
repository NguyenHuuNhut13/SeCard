<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CompanyApiService
{
    protected static $baseUrl = 'https://account.nks.vn/api';

    /**
     * Gửi request POST tới API công ty kèm theo Logging chi tiết.
     */
    protected static function post($endpoint, array $data = [], $token = null)
    {
        $url = self::$baseUrl . '/' . ltrim($endpoint, '/');

        // Gửi token qua cả Bearer Authorization header (chuẩn REST) lẫn body (tương thích ngược)
        $request = Http::asJson();
        if ($token) {
            $request = $request->withToken($token); // Authorization: Bearer {token}
            $data['access_token'] = $token;         // Body fallback
        }

        Log::info("Company API Request: POST {$url}", [
            'payload' => collect($data)->except(['password', 'old_password', 'new_password', 'password_confirmation', 'access_token', 'front', 'back', 'front_base64', 'back_base64'])->toArray(),
            'has_token' => !empty($token),
        ]);

        try {
            $response = $request->post($url, $data);

            Log::info("Company API Response: {$response->status()}", [
                'url'  => $url,
                'body' => $response->json(),
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error("Company API Exception: " . $e->getMessage(), [
                'url'   => $url,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Đăng nhập thành viên
     */
    public static function login($email, $password)
    {
        try {
            // Thử gửi cả email và username để tương thích tối đa với API công ty
            $response = self::post('nks/user/login', [
                'email' => $email,
                'username' => $email, 
                'password' => $password,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                // Đọc chính xác token và user từ JSON phản hồi
                $token = $data['data']['access_token'] ?? $data['token'] ?? $data['access_token'] ?? $data['data']['token'] ?? null;
                $user = $data['data']['user'] ?? $data['user'] ?? $data['data'] ?? null;

                if ($token) {
                    return [
                        'success' => true,
                        'token' => $token,
                        'user' => $user
                    ];
                }
            }

            $message = $response->json()['error'] ?? $response->json()['message'] ?? 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản.';
            return [
                'success' => false,
                'message' => $message
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Không thể kết nối đến máy chủ xác thực: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Lấy thông tin thành viên (POST /api/nks/user)
     */
    public static function getProfile($token)
    {
        try {
            $response = self::post('nks/user', [], $token);

            if ($response->successful()) {
                $data = $response->json();
                $user = $data['data']['user'] ?? $data['user'] ?? $data['data'] ?? $data;
                return [
                    'success' => true,
                    'user' => $user
                ];
            }

            return [
                'success' => false,
                'message' => 'Không thể lấy thông tin thành viên từ API.'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Lỗi kết nối API lấy profile: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Cập nhật thông tin thành viên (POST /api/nks/user)
     */
    public static function updateProfile($token, array $data)
    {
        try {
            $response = self::post('nks/user/updateInfo', $data, $token);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Cập nhật thông tin thành công!'
                ];
            }

            return [
                'success' => false,
                'message' => $response->json()['error'] ?? $response->json()['message'] ?? 'Cập nhật thông tin thất bại.'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Lỗi kết nối API cập nhật thông tin: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Cập nhật mật khẩu (POST /api/nks/user/updatePass)
     */
    public static function updatePassword($token, $oldPassword, $newPassword)
    {
        try {
            $response = self::post('nks/user/updatePass', [
                'old_password' => $oldPassword,
                'password' => $newPassword,
                'password_confirmation' => $newPassword, // Điền cả 2 định dạng phổ biến
                'new_password' => $newPassword
            ], $token);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Đổi mật khẩu thành công!'
                ];
            }

            return [
                'success' => false,
                'message' => $response->json()['error'] ?? $response->json()['message'] ?? 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Lỗi kết nối API đổi mật khẩu: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Cập nhật ảnh đại diện (POST /api/nks/user/updateAvatar)
     */
    public static function updateAvatar($token, $avatarPath)
    {
        try {
            if (str_starts_with($avatarPath, 'data:')) {
                $base64Image = $avatarPath;
            } else {
                // Đọc file và chuyển sang định dạng Base64 kèm Mime-type
                $mimeType = mime_content_type($avatarPath);
                $base64Image = 'data:' . $mimeType . ';base64,' . base64_encode(file_get_contents($avatarPath));
            }

            // Gửi request JSON POST thông qua hàm post() dùng chung
            $response = self::post('nks/user/updateAvatar', [
                'avatar' => $base64Image,
            ], $token);

            if ($response->successful()) {
                $data = $response->json();
                $avatarUrl = $data['avatar'] ?? $data['avatar_url'] ?? $data['data']['avatar_url'] ?? null;
                return [
                    'success' => true,
                    'avatar_url' => $avatarUrl,
                    'message' => 'Cập nhật ảnh đại diện thành công!'
                ];
            }

            return [
                'success' => false,
                'message' => $response->json()['error'] ?? $response->json()['message'] ?? 'Cập nhật ảnh đại diện thất bại.'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Lỗi kết nối API upload avatar: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Cập nhật CCCD (POST /api/nks/user/updateCccd)
     */
    public static function updateCccd($token, array $data)
    {
        try {
            // Convert date sang YYYY-MM-DD (API công ty yêu cầu format này)
            // Xử lý cả DD/MM/YYYY và DD-MM-YYYY và YYYY-MM-DD
            $rawDate   = $data['issue_date'] ?? '';
            $parsedDate = '';
            if ($rawDate) {
                // Thử parse nhiều format phổ biến
                foreach (['d/m/Y', 'd-m-Y', 'Y-m-d', 'm/d/Y', 'd/m/y'] as $fmt) {
                    $dt = \DateTime::createFromFormat($fmt, $rawDate);
                    if ($dt && $dt->format($fmt) === $rawDate) {
                        $parsedDate = $dt->format('Y-m-d');
                        break;
                    }
                }
                // Nếu không parse được thì giữ nguyên
                if (!$parsedDate) {
                    $parsedDate = $rawDate;
                }
            }

            $payload = [
                'number'      => $data['cccd'] ?? '',
                'date'        => $parsedDate,
                'place'       => $data['address'] ?? '',
                'cccd'        => $data['cccd'] ?? '',
                'cccd_number' => $data['cccd'] ?? '',
            ];
            // Chỉ thêm front/back khi có ảnh thực sự (tránh API crash khi parse empty string)
            if (!empty($data['front_base64'])) {
                $payload['front'] = $data['front_base64'];
            }
            if (!empty($data['back_base64'])) {
                $payload['back'] = $data['back_base64'];
            }

            $response = self::post('nks/user/updateCccd', $payload, $token);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Cập nhật Căn cước công dân thành công!'
                ];
            }

            $body = $response->json();
            return [
                'success' => false,
                'message' => '[HTTP ' . $response->status() . '] ' . ($body['error'] ?? $body['message'] ?? 'Cập nhật CCCD thất bại.')
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Lỗi kết nối API cập nhật CCCD: ' . $e->getMessage()
            ];
        }
    }
}
