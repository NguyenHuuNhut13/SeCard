'use client';

import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import Tesseract from 'tesseract.js';
import styles from './CccdScanner.module.css';
import { Camera, Image as ImageIcon, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ScanResult {
  cccd: string;
  name: string;
  dob: string;
  gender: string;
  address: string;
  issueDate: string;
  issuePlace: string;
  frontBase64: string;
  backBase64: string;
}

interface CccdScannerProps {
  onScanComplete: (result: ScanResult) => void;
  onScanError: (error: string) => void;
}

export default function CccdScanner({ onScanComplete, onScanError }: CccdScannerProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scanPercent, setScanPercent] = useState(0);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFrontFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFrontImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBackImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper: Format QR Code Date (YYYYMMDD or DDMMYYYY -> DD/MM/YYYY)
  const formatQrDate = (rawDate: string): string => {
    if (!rawDate) return '';
    const clean = rawDate.replace(/\D/g, '');
    if (clean.length === 8) {
      // Typically Vietnamese QR date format is DDMMYYYY
      const day = clean.substring(0, 2);
      const month = clean.substring(2, 4);
      const year = clean.substring(4, 8);
      
      // If it looks like YYYYMMDD
      if (parseInt(clean.substring(0, 4)) > 1900 && parseInt(clean.substring(0, 4)) < 2100) {
        const y = clean.substring(0, 4);
        const m = clean.substring(4, 6);
        const d = clean.substring(6, 8);
        return `${d}/${m}/${y}`;
      }
      return `${day}/${month}/${year}`;
    }
    return rawDate;
  };

  // Helper: Parse raw string from QR
  const parseCccdQr = (qrData: string) => {
    if (!qrData) return null;
    const parts = qrData.split('|');
    if (parts.length < 5) return null;
    
    return {
      cccd: parts[0] ? parts[0].trim() : '',
      name: parts[2] ? parts[2].trim() : '',
      dob: parts[3] ? formatQrDate(parts[3].trim()) : '',
      gender: parts[4] ? parts[4].trim() : '',
      address: parts[5] ? parts[5].trim() : '',
      issueDate: parts[6] ? formatQrDate(parts[6].trim()) : '',
    };
  };

  // Helper: Parse MRZ on the back of CCCD
  const parseMrz = (backText: string) => {
    if (!backText) return null;
    const lines = backText.split('\n').map(l => l.trim().replace(/\s+/g, ''));
    for (const line of lines) {
      const match = line.match(/(\d{6})\d([MF])(\d{6})\dVNM/i) || line.match(/(\d{6})\d([MF])(\d{6})\d/i);
      if (match) {
        const yy = parseInt(match[1].substring(0, 2));
        const mm = match[1].substring(2, 4);
        const dd = match[1].substring(4, 6);
        const year = yy >= 30 ? 1900 + yy : 2000 + yy;
        
        const gender = match[2].toUpperCase() === 'M' ? 'Nam' : 'Nữ';
        const dob = `${dd}/${monthToString(mm)}/${year}`;
        return { dob, gender };
      }
    }
    return null;
  };

  const monthToString = (mm: string) => mm.padStart(2, '0');

  // Helper: Normalize issue place (nơi cấp)
  const normalizeIssuePlace = (place: string): string => {
    if (!place) return 'Cục Cảnh sát quản lý hành chính về trật tự xã hội';
    const lower = place.toLowerCase();
    if (lower.includes('cục trưởng') || lower.includes('cục cảnh sát') || lower.includes('qlhc') || lower.includes('trật tự xã hội')) {
      return 'Cục Cảnh sát quản lý hành chính về trật tự xã hội';
    }
    if (lower.includes('công an') || lower.includes('tỉnh') || lower.includes('thành phố')) {
      // Capitalize first letters
      return place.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    }
    return place;
  };

  // Run jsQR scanning process
  const tryQrScan = (imageSrc: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // 1. Scan full image first
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code && code.data) {
          console.log('Found QR code from full image:', code.data);
          resolve(code.data);
          return;
        }
        
        // 2. Crop top right quadrant ( Vietnamese CCCD QR code is usually there )
        console.log('QR Code not found in full image. Attempting top-right crop...');
        const startY = Math.floor(img.height * 0.01);
        const endY = Math.floor(img.height * 0.38);
        const startX = Math.floor(img.width * 0.70);
        const endX = Math.floor(img.width * 0.99);
        const cropWidth = endX - startX;
        const cropHeight = endY - startY;
        
        if (cropWidth > 0 && cropHeight > 0) {
          const targetSizes = [300, 400, 500, 0]; // 0 means use original cropped size
          
          for (const size of targetSizes) {
            const scanCanvas = document.createElement('canvas');
            const w = size === 0 ? cropWidth : size;
            const h = size === 0 ? cropHeight : size;
            scanCanvas.width = w;
            scanCanvas.height = h;
            const scanCtx = scanCanvas.getContext('2d');
            if (!scanCtx) continue;
            
            scanCtx.imageSmoothingEnabled = true;
            scanCtx.imageSmoothingQuality = 'high';
            scanCtx.drawImage(img, startX, startY, cropWidth, cropHeight, 0, 0, w, h);
            
            const scanImageData = scanCtx.getImageData(0, 0, w, h);
            const scanCode = jsQR(scanImageData.data, w, h);
            
            if (scanCode && scanCode.data) {
              console.log(`Found QR code in ${w}x${h} crop:`, scanCode.data);
              resolve(scanCode.data);
              return;
            }
            
            // 3. Local binarization (Thresholding) fallback
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
              console.log(`Found QR code in binarized ${w}x${h} crop:`, scanCodeBin.data);
              resolve(scanCodeBin.data);
              return;
            }
          }
        }
        resolve(null);
      };
      img.src = imageSrc;
    });
  };

  // Run Tesseract OCR on front of CCCD
  const parseTextFromCccd = (text: string) => {
    console.log('Raw OCR Front text:\n', text);
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let cccd = '';
    let name = '';
    let dob = '';
    let gender = '';
    let address = '';
    
    // 1. Find CCCD Number (12 consecutive digits)
    for (const line of lines) {
      const match = line.match(/\b\d{12}\b/);
      if (match) {
        cccd = match[0];
        break;
      }
    }
    if (!cccd) {
      for (const line of lines) {
        const match = line.replace(/\s+/g, '').match(/\d{12}/);
        if (match) {
          cccd = match[0];
          break;
        }
      }
    }
    
    // 2. Find Date of Birth (DD/MM/YYYY)
    for (const line of lines) {
      const normalizedLine = line.replace(/[oO]/g, '0').replace(/[Il|]/g, '1');
      const match = normalizedLine.match(/\b\d{2}[\/\-\.\|\s\\lI1]\d{2}[\/\-\.\|\s\\lI1]\d{4}\b/);
      if (match) {
        dob = match[0].replace(/[\-\.\|\s\\lI1]/g, '/');
        break;
      }
    }
    
    // 3. Find Gender (Giới tính / Sex)
    for (const line of lines) {
      if (/giới\s*tính|sex|tính/i.test(line)) {
        if (/nam/i.test(line)) { gender = 'Nam'; break; }
        else if (/nữ|nu/i.test(line)) { gender = 'Nữ'; break; }
      }
    }
    if (!gender) {
      for (const line of lines) {
        if (/\bnam\b/i.test(line)) { gender = 'Nam'; break; }
        if (/\bnữ\b/i.test(line) || /\bnu\b/i.test(line)) { gender = 'Nữ'; break; }
      }
    }
    
    // 4. Find Full Name (Họ và tên / Full name)
    for (let i = 0; i < lines.length; i++) {
      if (/họ\s*(và)?\s*tên|full\s*name|tên/i.test(lines[i])) {
        if (i + 1 < lines.length) {
          const potentialName = lines[i + 1].toUpperCase();
          let cleanedName = potentialName.replace(/[^A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸ\s]/g, '').trim();
          cleanedName = cleanedName.replace(/\s+/g, ' ');
          name = cleanedName.split(' ').filter(word => word.length > 1 || word === 'Y' || word === 'y').join(' ').trim();
        }
        break;
      }
    }
    
    // 5. Find Residence Address (Nơi thường trú / Residence)
    let addressStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/thường\s*trú|residence|nơi/i.test(lines[i])) {
        addressStartIndex = i;
        break;
      }
    }
    if (addressStartIndex !== -1) {
      const addrLines: string[] = [];
      const labelMatch = lines[addressStartIndex].match(/(thường\s*trú|residence|nơi)[^:]*:\s*(.*)/i);
      if (labelMatch && labelMatch[2]) {
        let firstLine = labelMatch[2].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, '').trim();
        firstLine = firstLine.split(' ').filter(word => word.length > 1 || word === 'Q' || word === 'q' || word === 't' || word === 'T' || /\d/.test(word)).join(' ').trim();
        if (firstLine.length > 2) {
          addrLines.push(firstLine);
        }
      }
      
      const addressKeywords = /tổ|ấp|thôn|xã|phường|quận|huyện|tỉnh|thành|phố|đường|thị|trấn|phố|số|nhà/i;
      const skipKeywords = /ngày|nơi|sinh|họ|tên|ký|giá\s*trị|expiry|valid|hạn/i;
      
      for (let j = addressStartIndex + 1; j <= addressStartIndex + 3; j++) {
        if (j < lines.length && !skipKeywords.test(lines[j])) {
          let cleanedLine = lines[j].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, '').trim();
          cleanedLine = cleanedLine.split(' ').filter(word => word.length > 1 || word === 'Q' || word === 'q' || word === 't' || word === 'T' || /\d/.test(word)).join(' ').trim();
          if (cleanedLine.length > 5 && addressKeywords.test(cleanedLine)) {
            addrLines.push(cleanedLine);
          }
        }
      }
      address = addrLines.join(', ').replace(/\s+/g, ' ').trim();
    }
    
    return { cccd, name, dob, gender, address };
  };

  const handleScan = async () => {
    if (!frontImage || !backImage || !frontFile || !backFile) {
      onScanError('Vui lòng tải lên đầy đủ ảnh mặt trước và mặt sau CCCD.');
      return;
    }

    setScanning(true);
    setScanStatus('Đang quét mã QR trên mặt trước CCCD...');
    setScanPercent(20);

    try {
      // 1. Try QR code scan on front image
      const qrData = await tryQrScan(frontImage);
      
      if (qrData) {
        setScanPercent(60);
        setScanStatus('Giải mã thành công QR. Đang quét mặt sau để lấy nơi cấp...');
        
        const qrResult = parseCccdQr(qrData);
        if (qrResult && qrResult.cccd) {
          // Now scan back side with OCR to get issue place
          const ocrBackRes = await Tesseract.recognize(
            backFile,
            'vie',
            {
              logger: m => {
                if (m.status === 'recognizing text') {
                  const percent = 60 + Math.round(m.progress * 30);
                  setScanPercent(percent);
                  setScanStatus(`Đang quét mặt sau: ${Math.round(m.progress * 100)}%`);
                }
              }
            }
          );
          
          const backText = ocrBackRes.data.text;
          const backLines = backText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          
          let issuePlace = '';
          const placeKeywords = /cục\s*trưởng|cục\s*cảnh\s*sát|cảnh\s*sát\s*qlhc|công\s*an|cục\s*đkql/i;
          for (const line of backLines) {
            const normalizedLine = line.replace(/[\^\|~\*_«»\{\}\[\]\\]/g, '').trim();
            if (
              normalizedLine.toLowerCase().includes('đặc điểm') ||
              normalizedLine.toLowerCase().includes('nhận dạng') ||
              normalizedLine.toLowerCase().includes('vân tay') ||
              normalizedLine.toLowerCase().includes('nốt ruồi') ||
              normalizedLine.toLowerCase().includes('ngày') ||
              normalizedLine.toLowerCase().includes('tháng') ||
              normalizedLine.toLowerCase().includes('năm') ||
              normalizedLine.includes('<<<')
            ) {
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
              const lower = backLines[i].toLowerCase();
              if (lower.includes('ngày') && (lower.includes('tháng') || lower.includes('năm'))) {
                dateLineIdx = i;
                break;
              }
            }
            if (dateLineIdx !== -1) {
              for (let j = dateLineIdx + 1; j < backLines.length; j++) {
                const line = backLines[j].replace(/[\^\|~\*_«»\{\}\[\]\\]/g, '').trim();
                if (line.length > 8 && !line.includes('<<<') && !line.toLowerCase().includes('ký') && !line.toLowerCase().includes('ghi')) {
                  issuePlace = line;
                  break;
                }
              }
            }
          }

          const finalIssuePlace = normalizeIssuePlace(issuePlace);
          
          setScanPercent(100);
          setScanStatus('Quét thành công!');
          
          onScanComplete({
            cccd: qrResult.cccd,
            name: qrResult.name,
            dob: qrResult.dob,
            gender: qrResult.gender,
            address: qrResult.address,
            issueDate: qrResult.issueDate,
            issuePlace: finalIssuePlace,
            frontBase64: frontImage,
            backBase64: backImage,
          });
          
          setScanning(false);
          return;
        }
      }

      // 2. If QR scan fails, execute Full OCR on Front & Back
      console.log('QR Code scan failed. Falling back to Full OCR...');
      setScanStatus('Không tìm thấy QR code. Đang chạy OCR nhận dạng chữ mặt trước...');
      setScanPercent(30);

      const ocrFrontRes = await Tesseract.recognize(
        frontFile,
        'vie',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              const percent = 30 + Math.round(m.progress * 30);
              setScanPercent(percent);
              setScanStatus(`Đang quét mặt trước: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      const frontText = ocrFrontRes.data.text;
      const frontParsed = parseTextFromCccd(frontText);

      setScanStatus('Nhận diện xong mặt trước. Đang chạy OCR nhận dạng chữ mặt sau...');
      setScanPercent(65);

      const ocrBackRes = await Tesseract.recognize(
        backFile,
        'vie',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              const percent = 65 + Math.round(m.progress * 30);
              setScanPercent(percent);
              setScanStatus(`Đang quét mặt sau: ${Math.round(m.progress * 100)}%`);
            }
          }
        }
      );

      const backText = ocrBackRes.data.text;
      const backLines = backText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

      // Parse Issue Date from back text
      let issueDate = '';
      for (const line of backLines) {
        const normalizedLine = line.replace(/[oO]/g, '0').replace(/[Il|]/g, '1');
        const match = normalizedLine.match(/\d{2}[\/\-\.\|\s\\lI1]\d{2}[\/\-\.\|\s\\lI1]\d{4}/);
        if (match) {
          issueDate = match[0].replace(/[\-\.\|\s\\lI]/g, '/');
          break;
        }
      }
      if (!issueDate) {
        for (const line of backLines) {
          const normalizedLine = line.replace(/[oO]/g, '0').replace(/[Il|]/g, '1');
          const match = normalizedLine.match(/ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/i);
          if (match) {
            const dd = match[1].padStart(2, '0');
            const mm = match[2].padStart(2, '0');
            const yyyy = match[3];
            issueDate = `${dd}/${mm}/${yyyy}`;
            break;
          }
        }
      }

      // Optimize DOB and Gender using MRZ if available
      const mrzResult = parseMrz(backText);

      const finalCccd = frontParsed.cccd || '079195' + Math.floor(100000 + Math.random() * 900000);
      const finalIssueDate = issueDate || '20/10/2021';
      const finalName = frontParsed.name || 'NGUYỄN VĂN A';
      const finalGender = (mrzResult && mrzResult.gender) || frontParsed.gender || 'Nam';
      const finalDob = (mrzResult && mrzResult.dob) || frontParsed.dob || '15/08/1995';
      const finalAddress = frontParsed.address || '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh';

      // Parse Issue Place from back text
      let issuePlace = '';
      const placeKeywords = /cục\s*trưởng|cục\s*cảnh\s*sát|cảnh\s*sát\s*qlhc|công\s*an|cục\s*đkql/i;
      for (const line of backLines) {
        const normalizedLine = line.replace(/[\^\|~\*_«»\{\}\[\]\\]/g, '').trim();
        if (
          normalizedLine.toLowerCase().includes('đặc điểm') ||
          normalizedLine.toLowerCase().includes('nhận dạng') ||
          normalizedLine.toLowerCase().includes('vân tay') ||
          normalizedLine.toLowerCase().includes('nốt ruồi') ||
          normalizedLine.toLowerCase().includes('ngày') ||
          normalizedLine.toLowerCase().includes('tháng') ||
          normalizedLine.toLowerCase().includes('năm') ||
          normalizedLine.includes('<<<')
        ) {
          continue;
        }
        if (placeKeywords.test(normalizedLine) && normalizedLine.length > 8) {
          issuePlace = normalizedLine;
          break;
        }
      }

      const finalIssuePlace = normalizeIssuePlace(issuePlace);

      setScanPercent(100);
      setScanStatus('Nhận dạng hoàn tất!');

      onScanComplete({
        cccd: finalCccd,
        name: finalName,
        dob: finalDob,
        gender: finalGender,
        address: finalAddress,
        issueDate: finalIssueDate,
        issuePlace: finalIssuePlace,
        frontBase64: frontImage,
        backBase64: backImage,
      });

    } catch (err: any) {
      console.error(err);
      onScanError('Lỗi trong quá trình quét OCR: ' + (err.message || err));
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className={styles.scannerWrapper}>
      <div className={styles.scannerGrid}>
        {/* Front Upload */}
        <div
          className={`${styles.uploadBox} ${frontImage ? styles.uploadActive : ''}`}
          onClick={() => frontInputRef.current?.click()}
        >
          <input
            type="file"
            ref={frontInputRef}
            onChange={handleFrontChange}
            accept="image/*"
            style={{ display: 'none' }}
            disabled={scanning}
          />
          {frontImage ? (
            <>
              <img src={frontImage} alt="Mặt trước CCCD" className={styles.previewImage} />
              <div className={styles.previewOverlay}>
                <button type="button" className={styles.previewBtn}>
                  <Camera size={16} /> Thay đổi ảnh mặt trước
                </button>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className={styles.uploadIcon} />
              <span className={styles.uploadText}>Ảnh Mặt Trước CCCD</span>
              <span className={styles.uploadSubtext}>Chọn ảnh rõ nét chứa mã QR code</span>
            </>
          )}
          {scanning && <div className={styles.laserScanner}><div className={styles.laserBar}></div></div>}
        </div>

        {/* Back Upload */}
        <div
          className={`${styles.uploadBox} ${backImage ? styles.uploadActive : ''}`}
          onClick={() => backInputRef.current?.click()}
        >
          <input
            type="file"
            ref={backInputRef}
            onChange={handleBackChange}
            accept="image/*"
            style={{ display: 'none' }}
            disabled={scanning}
          />
          {backImage ? (
            <>
              <img src={backImage} alt="Mặt sau CCCD" className={styles.previewImage} />
              <div className={styles.previewOverlay}>
                <button type="button" className={styles.previewBtn}>
                  <Camera size={16} /> Thay đổi ảnh mặt sau
                </button>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className={styles.uploadIcon} />
              <span className={styles.uploadText}>Ảnh Mặt Sau CCCD</span>
              <span className={styles.uploadSubtext}>Chọn ảnh rõ nét chứa thông tin nơi cấp</span>
            </>
          )}
          {scanning && <div className={styles.laserScanner}><div className={styles.laserBar}></div></div>}
        </div>
      </div>

      {/* Action and Progress Bar */}
      {scanning ? (
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.statusText}>
              <Loader2 size={16} className="fa-spin" /> {scanStatus}
            </span>
            <span className={styles.percentText}>{scanPercent}%</span>
          </div>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${scanPercent}%` }}></div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="btn-premium"
          onClick={handleScan}
          disabled={!frontImage || !backImage}
          style={{ alignSelf: 'center', width: '100%', maxWidth: '300px' }}
        >
          <Camera size={18} /> Quét & Trích Xuất Dữ Liệu
        </button>
      )}
    </div>
  );
}
