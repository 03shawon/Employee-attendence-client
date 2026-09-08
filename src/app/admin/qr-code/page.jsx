'use client';

import { useState, useEffect } from 'react';

export default function QrCodePage() {
  const [qrTargetUrl, setQrTargetUrl] = useState('https://employee-attendence-client.vercel.app/admin/qr-code');
  const [downloading, setDownloading] = useState(false);

  // useEffect-এর ভেতর নিরাপদভাবে URL ইনিশিয়ালাইজ করা
  useEffect(() => {
    const initTargetUrl = () => {
      if (typeof window !== 'undefined') {
        setQrTargetUrl(`${window.location.origin}/scan`);
      }
    };
    initTargetUrl();
  }, []);

  // High-Res QR Code Image API (600x600)
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&data=${encodeURIComponent(qrTargetUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 2X HD High-DPI Canvas for Crystal Clear Image Quality
      const scale = 2;
      const width = 700 * scale;   // 1400px
      const height = 800 * scale;  // 1600px (Clean Compact Height)

      canvas.width = width;
      canvas.height = height;

      // Enable High-Quality Image Smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // White Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Outer Border
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 6 * scale;
      ctx.strokeRect(20 * scale, 20 * scale, width - 40 * scale, height - 40 * scale);

      // Header Branding
      ctx.fillStyle = '#3730a3';
      ctx.font = `bold ${34 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('ASSET SHEBA', width / 2, 90 * scale);

      ctx.fillStyle = '#6b7280';
      ctx.font = `600 ${15 * scale}px sans-serif`;
      ctx.fillText('EMPLOYEE ATTENDANCE SYSTEM', width / 2, 122 * scale);

      // Divider Line
      ctx.beginPath();
      ctx.moveTo(80 * scale, 148 * scale);
      ctx.lineTo(width - 80 * scale, 148 * scale);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      // Load High-Res QR Code Image
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
        qrImg.src = qrCodeApiUrl;
      });

      const qrSize = 380 * scale;
      const qrX = (width - qrSize) / 2;
      const qrY = 175 * scale;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      // Load Center Logo (.jpeg)
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/logo.jpeg';

      await new Promise((resolve) => {
        logoImg.onload = () => {
          const badgeW = 110 * scale;
          const badgeH = 110 * scale;
          const centerX = width / 2;
          const centerY = qrY + qrSize / 2;
          const badgeX = centerX - badgeW / 2;
          const badgeY = centerY - badgeH / 2;

          // Draw Rounded Rectangle Badge for Logo
          const radius = 20 * scale;
          ctx.beginPath();
          ctx.moveTo(badgeX + radius, badgeY);
          ctx.lineTo(badgeX + badgeW - radius, badgeY);
          ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + radius);
          ctx.lineTo(badgeX + badgeW, badgeY + badgeH - radius);
          ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - radius, badgeY + badgeH);
          ctx.lineTo(badgeX + radius, badgeY + badgeH);
          ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - radius);
          ctx.lineTo(badgeX, badgeY + radius);
          ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
          ctx.closePath();

          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#4f46e5';
          ctx.lineWidth = 4 * scale;
          ctx.stroke();

          // Calculate Image Draw Position (contain mode)
          const imgAspect = logoImg.width / logoImg.height;
          const padding = 10 * scale;
          const maxW = badgeW - padding * 2;
          const maxH = badgeH - padding * 2;

          let drawW = maxW;
          let drawH = maxW / imgAspect;
          if (drawH > maxH) {
            drawH = maxH;
            drawW = maxH * imgAspect;
          }

          const imgX = centerX - drawW / 2;
          const imgY = centerY - drawH / 2;

          ctx.drawImage(logoImg, imgX, imgY, drawW, drawH);
          resolve();
        };
        logoImg.onerror = () => resolve();
      });

      // Footer Instructions
      ctx.fillStyle = '#111827';
      ctx.font = `bold ${24 * scale}px sans-serif`;
      ctx.fillText('SCAN TO CHECK IN / OUT', width / 2, 615 * scale);

      ctx.fillStyle = '#4b5563';
      ctx.font = `${16 * scale}px sans-serif`;
      ctx.fillText('Please scan this QR code with your mobile camera', width / 2, 652 * scale);
      ctx.fillText('to give daily office attendance.', width / 2, 680 * scale);

      // Download Trigger
      const link = document.createElement('a');
      link.download = 'Asset_Sheba_Attendance_QR.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download QR code:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Office Attendance QR Code</h2>
        <p className="text-xs text-zinc-400 mt-1">Print or download this QR poster for Asset Sheba office entrance.</p>
      </div>

      <div className="bg-[#121215] border border-[#1e1e22] p-6 sm:p-10 rounded-2xl flex flex-col items-center justify-center space-y-6 shadow-2xl">
        {/* Printable Card */}
        <div id="printable-qr-card" className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-indigo-500/20 flex flex-col items-center max-w-sm w-full">
          {/* Header Branding */}
          <div className="flex flex-col items-center mb-4">
            <img 
              src="/logo.jpeg" 
              alt="Asset Sheba Logo" 
              className="h-12 w-auto mb-2 object-contain"
            />
            <h3 className="text-2xl font-extrabold text-indigo-900 tracking-wider">ASSET SHEBA</h3>
            <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">
              Attendance Management System
            </p>
          </div>

          <div className="w-full h-px bg-zinc-200 my-2"></div>

          {/* QR Display with Centered Logo Overlay */}
          <div className="relative my-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center">
            <img
              src={qrCodeApiUrl}
              alt="Asset Sheba Attendance QR Code"
              className="w-64 h-64 rounded-lg"
            />
            {/* Center Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-2 rounded-2xl border-2 border-indigo-600 shadow-xl flex items-center justify-center w-24 h-24">
                <img
                  src="/logo.jpeg"
                  alt="Badge Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Scan Instructions */}
          <div className="space-y-1 mt-2">
            <p className="text-black font-extrabold text-lg tracking-wide">SCAN TO CHECK IN / OUT</p>
            <p className="text-xs text-zinc-600 font-medium">
              Open mobile camera to give your daily attendance
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2 w-full max-w-sm">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {downloading ? 'Generating...' : '📥 Download QR (PNG)'}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 bg-[#1a1a1e] hover:bg-[#27272a] border border-[#27272a] text-zinc-200 font-semibold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            🖨️ Print Poster
          </button>
        </div>
      </div>
    </div>
  );
}