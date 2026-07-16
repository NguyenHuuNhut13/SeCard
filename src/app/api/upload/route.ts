import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for Ecard avatar/banner uploads.
 * Sends the request from Next.js server → NKS API, bypassing browser CORS restrictions.
 * 
 * Expected JSON body:
 * {
 *   "type": "avatar" | "banner",
 *   "code": "ecard-code",
 *   "image": "data:image/...;base64,...",
 *   "access_token": "jwt-token"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, code, image, access_token } = body;

    if (!type || !code || !image || !access_token) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin: type, code, image, access_token.' },
        { status: 400 }
      );
    }

    // Determine the correct NKS API endpoint
    let endpoint: string;
    let fieldName: string;
    if (type === 'avatar') {
      endpoint = 'nks/user/ecard/updateAvatar';
      fieldName = 'avatar';
    } else if (type === 'banner') {
      endpoint = 'nks/user/ecard/updateBanner';
      fieldName = 'banner';
    } else {
      return NextResponse.json(
        { success: false, message: 'type phải là "avatar" hoặc "banner".' },
        { status: 400 }
      );
    }

    const apiUrl = `https://account.nks.vn/api/${endpoint}?access_token=${access_token}`;

    // Build multipart/form-data body (matching Thunder Client's "Form" tab)
    const formData = new FormData();
    formData.append('access_token', access_token);
    formData.append('code', code);
    formData.append(fieldName, image);

    console.log(`[Upload Proxy] POST ${apiUrl} | type=${type} code=${code} imageLen=${image.length}`);

    // Do NOT set Content-Type — fetch sets it automatically with the correct multipart boundary
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const contentType = apiResponse.headers.get('content-type');
    let result: any;
    if (contentType && contentType.includes('application/json')) {
      result = await apiResponse.json();
    } else {
      const text = await apiResponse.text();
      result = { message: text };
    }

    console.log(`[Upload Proxy] Response: ${apiResponse.status}`, result);

    if (!apiResponse.ok) {
      return NextResponse.json(
        { success: false, message: result.error || result.message || `API Error (HTTP ${apiResponse.status})` },
        { status: apiResponse.status }
      );
    }

    // After upload success, fetch latest ecard data to get the new image URL
    const showUrl = `https://account.nks.vn/api/nks/user/ecard/show`;
    const showResponse = await fetch(showUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token, code }),
    });
    let ecardData: any = null;
    if (showResponse.ok) {
      const showResult = await showResponse.json();
      ecardData = showResult.data;
    }

    return NextResponse.json({
      success: true,
      message: type === 'avatar' ? 'Cập nhật ảnh đại diện thành công!' : 'Cập nhật ảnh bìa thành công!',
      data: ecardData,
    });
  } catch (error: any) {
    console.error('[Upload Proxy] Exception:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Lỗi server proxy.' },
      { status: 500 }
    );
  }
}
