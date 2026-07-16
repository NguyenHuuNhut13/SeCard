'use client';

import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import styles from './AvatarCropper.module.css';
import { X, Sparkles, Check, Crop } from 'lucide-react';

interface AvatarCropperProps {
  imageSrc: string;
  onCropComplete: (base64Data: string) => void;
  onClose: () => void;
}

type FilterType = 'none' | 'brighten' | 'grayscale' | 'sepia' | 'warm' | 'cool';

export default function AvatarCropper({ imageSrc, onCropComplete, onClose }: AvatarCropperProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  useEffect(() => {
    if (imageRef.current) {
      cropperRef.current = new Cropper(imageRef.current, {
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
        ready() {
          // Adjust preview layout if needed
        },
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }
    };
  }, [imageSrc]);

  // Apply CSS filters to cropper view box for live preview
  useEffect(() => {
    const cropperContainer = document.querySelector('.cropper-container');
    if (!cropperContainer) return;

    let filterStyle = 'none';
    switch (selectedFilter) {
      case 'brighten':
        filterStyle = 'brightness(1.2)';
        break;
      case 'grayscale':
        filterStyle = 'grayscale(100%)';
        break;
      case 'sepia':
        filterStyle = 'sepia(80%)';
        break;
      case 'warm':
        filterStyle = 'sepia(20%) saturate(120%) hue-rotate(-10deg)';
        break;
      case 'cool':
        filterStyle = 'hue-rotate(30deg) saturate(110%)';
        break;
    }

    // Apply the filter styling directly to cropper elements for visual feedback
    const viewImages = cropperContainer.querySelectorAll('.cropper-view-box img, .cropper-canvas img');
    viewImages.forEach((el) => {
      (el as HTMLElement).style.filter = filterStyle;
    });
  }, [selectedFilter]);

  const handleSubmit = () => {
    if (!cropperRef.current) return;

    // 1. Crop canvas to 500x500px square
    const canvas = cropperRef.current.getCroppedCanvas({
      width: 500,
      height: 500,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

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

    if (ctx && tempCtx && filterString !== 'none') {
      try {
        tempCtx.filter = filterString;
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      } catch (e) {
        console.warn('Canvas filter rendering not fully supported, using raw cropped image.', e);
      }
    }

    // 2. Export as base64 JPEG at 85% quality
    const base64Data = canvas.toDataURL('image/jpeg', 0.85);
    onCropComplete(base64Data);
  };

  const filtersList: { type: FilterType; label: string; previewClass: string }[] = [
    { type: 'none', label: 'Gốc', previewClass: '' },
    { type: 'brighten', label: 'Sáng', previewClass: 'brightness-125' },
    { type: 'grayscale', label: 'Bản Đen', previewClass: 'grayscale' },
    { type: 'sepia', label: 'Cổ Điển', previewClass: 'sepia' },
    { type: 'warm', label: 'Ấm Áp', previewClass: 'warm' },
    { type: 'cool', label: 'Dịu Mát', previewClass: 'cool' },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3>Cắt ảnh đại diện</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className={styles.cropperWrapper}>
            <img ref={imageRef} src={imageSrc} alt="Crop Source" className={styles.cropperImage} />
          </div>

          {/* Filters Selection */}
          <div className={styles.filtersSection}>
            <span className={styles.sectionTitle}>
              <Sparkles size={12} style={{ marginRight: '4px' }} /> Bộ lọc màu sắc
            </span>
            <div className={styles.filtersGrid}>
              {filtersList.map((filter) => (
                <div
                  key={filter.type}
                  className={`${styles.filterCard} ${
                    selectedFilter === filter.type ? styles.filterCardActive : ''
                  }`}
                  onClick={() => setSelectedFilter(filter.type)}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                      filter:
                        filter.type === 'brighten'
                          ? 'brightness(1.2)'
                          : filter.type === 'grayscale'
                          ? 'grayscale(100%)'
                          : filter.type === 'sepia'
                          ? 'sepia(80%)'
                          : filter.type === 'warm'
                          ? 'sepia(20%) saturate(120%) hue-rotate(-10deg)'
                          : filter.type === 'cool'
                          ? 'hue-rotate(30deg) saturate(110%)'
                          : 'none',
                    }}
                  ></div>
                  <span className={styles.filterLabel}>{filter.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button type="button" className="btn-secondary-premium" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="button" className="btn-premium" onClick={handleSubmit}>
            <Crop size={16} /> Xác nhận cắt ảnh
          </button>
        </div>
      </div>
    </div>
  );
}
