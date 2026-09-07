'use client';

export default function QrCodePage() {
  const qrTargetUrl = typeof window !== 'undefined' ? `${window.location.origin}/scan` : 'http://localhost:3000/scan';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto text-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Office Attendance QR Code</h2>
        <p className="text-sm text-zinc-400 mt-1">Print and display this QR code at the office entrance.</p>
      </div>

      <div className="bg-[#121215] border border-[#1e1e22] p-8 rounded-2xl flex flex-col items-center justify-center space-y-6 shadow-2xl">
        {/* QR Display Frame */}
        <div className="bg-white p-6 rounded-2xl shadow-inner border-4 border-zinc-200 flex flex-col items-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrTargetUrl)}`}
            alt="Office Attendance QR Code"
            className="w-60 h-60"
          />
          <p className="text-black font-bold text-lg mt-4">SCAN TO CHECK IN / OUT</p>
          <p className="text-xs text-zinc-500 font-mono mt-1">{qrTargetUrl}</p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors"
        >
          Print QR Code
        </button>
      </div>
    </div>
  );
}