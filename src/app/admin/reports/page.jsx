'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

// সময় ফরম্যাট করার হেলপার ফাংশন
const formatTime = (timeValue) => {
  if (!timeValue || timeValue === '-') return '-';
  const date = new Date(timeValue);
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  return timeValue;
};

// সাপ্তাহিক তারিখের রেঞ্জ বের করার হেলপার ফাংশন (Monday - Sunday)
const getWeekRange = (dateStr) => {
  if (!dateStr) return { start: '', end: '' };
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay(); // 0 is Sun, 1 is Mon
  const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diffToMon));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);

  const format = (dt) => dt.toISOString().split('T')[0];
  return { start: format(mon), end: format(sun) };
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('All');
  const [gmEmail, setGmEmail] = useState('gm@company.com');

  const [reportData, setReportData] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, late: 0, absent: 0 });
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // রিপোর্ট টাইপ পরিবর্তনের সাথে ডেট ফরম্যাট এডজাস্টমেন্ট
  const handleReportTypeChange = (type) => {
    setReportType(type);
    if (type === 'monthly') {
      if (selectedDate.length > 7) {
        setSelectedDate(selectedDate.slice(0, 7)); // YYYY-MM
      }
    } else {
      if (selectedDate.length === 7) {
        setSelectedDate(`${selectedDate}-01`); // YYYY-MM-DD
      }
    }
  };

  // ডাটা ফেচ করার useEffect (রেড ওয়ার্নিং মুক্ত)
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setMessage({ type: '', text: '' });

      try {
        let url = `${API_BASE_URL}/attendance/logs`;
        if (reportType === 'daily' && selectedDate) {
          url += `?date=${selectedDate}`;
        }

        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          let filtered = Array.isArray(data) ? data : [];

          // রিপোর্ট টাইপ অনুযায়ী ফিল্টারিং
          if (reportType === 'daily') {
            filtered = filtered.filter((item) => !selectedDate || item.date === selectedDate);
          } else if (reportType === 'weekly') {
            const { start, end } = getWeekRange(selectedDate);
            filtered = filtered.filter((item) => item.date >= start && item.date <= end);
          } else if (reportType === 'monthly') {
            filtered = filtered.filter((item) => item.date && item.date.startsWith(selectedDate));
          }

          // ডিপার্টমেন্ট ফিল্টারিং
          if (department !== 'All') {
            filtered = filtered.filter((item) => item.department === department);
          }

          setReportData(filtered);

          // স্ট্যাটাস হিসাব
          const present = filtered.filter((r) => r.checkIn).length;
          const late = filtered.filter((r) => r.status === 'Late').length;
          setStats({
            total: filtered.length,
            present: present,
            late: late,
            absent: Math.max(0, filtered.length - present),
          });
        }
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedDate, reportType, department]);

  // ইমেইল পাঠানোর হ্যান্ডলার
  const handleSendEmail = async () => {
    if (!gmEmail) {
      setMessage({ type: 'error', text: 'Please enter a valid GM email address.' });
      return;
    }

    setEmailSending(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/attendance/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: gmEmail, reportType, date: selectedDate, department }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Report sent successfully to GM!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send email.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to backend server.' });
    } finally {
      setEmailSending(false);
    }
  };

  // সুসজ্জিত CSV এক্সপোর্ট ফাংশন
  // const handleExportCSV = () => {
  //   if (reportData.length === 0) {
  //     alert('No data available to export!');
  //     return;
  //   }

  //   let reportTitle = 'COMPANY ATTENDANCE REPORT';
  //   let periodText = '';

  //   if (reportType === 'daily') {
  //     reportTitle = 'DAILY ATTENDANCE REPORT';
  //     periodText = `Selected Date: ${selectedDate}`;
  //   } else if (reportType === 'weekly') {
  //     reportTitle = 'WEEKLY ATTENDANCE REPORT';
  //     const { start, end } = getWeekRange(selectedDate);
  //     periodText = `Date Range: ${start} to ${end}`;
  //   } else if (reportType === 'monthly') {
  //     reportTitle = 'MONTHLY ATTENDANCE REPORT';
  //     periodText = `Selected Month: ${selectedDate}`;
  //   }

  //   const generatedTime = new Date().toLocaleString('en-US', {
  //     timeZone: 'Asia/Dhaka',
  //     dateStyle: 'medium',
  //     timeStyle: 'short',
  //   });

  //   // CSV হেডার ও মেটাডাটা সেকশন (Excel-এ সুন্দর দেখানোর জন্য)
  //   const metaRows = [
  //     `================================================================================`,
  //     `"${reportTitle}"`,
  //     `================================================================================`,
  //     `"${periodText}"`,
  //     `"Department: ${department}"`,
  //     `"Generated On: ${generatedTime}"`,
  //     ``,
  //     `--------------------------------------------------------------------------------`,
  //     `"SUMMARY STATISTICS"`,
  //     `--------------------------------------------------------------------------------`,
  //     `"Total Logs","Present Count","Late Count","Absent Count"`,
  //     `"${stats.total}","${stats.present}","${stats.late}","${stats.absent}"`,
  //     ``,
  //     `--------------------------------------------------------------------------------`,
  //     `"DETAILED ATTENDANCE LOGS"`,
  //     `--------------------------------------------------------------------------------`,
  //   ];

  //   const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Designation', 'Check In', 'Check Out', 'Status'];

  //   const dataRows = reportData.map((log) => [
  //     `"${log.date || ''}"`,
  //     `"${log.employeeId || ''}"`,
  //     `"${log.name || ''}"`,
  //     `"${log.department || '-'}"`,
  //     `"${log.designation || '-'}"`,
  //     `"${formatTime(log.checkIn)}"`,
  //     `"${formatTime(log.checkOut)}"`,
  //     `"${log.status || ''}"`,
  //   ]);

  //   const csvLines = [
  //     ...metaRows,
  //     headers.map((h) => `"${h}"`).join(','),
  //     ...dataRows.map((row) => row.join(',')),
  //   ];

  //   const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvLines.join('\n');
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', encodedUri);
  //   link.setAttribute('download', `Attendance_Report_${reportType}_${selectedDate}.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // সুসজ্জিত ও কালারফুল Excel Export Function (.xls)
  const handleExportExcel = () => {
    if (reportData.length === 0) {
      alert('No data available to export!');
      return;
    }

    let reportTitle = 'COMPANY ATTENDANCE REPORT';
    let periodText = '';

    if (reportType === 'daily') {
      reportTitle = 'DAILY ATTENDANCE REPORT';
      periodText = `Selected Date: ${selectedDate}`;
    } else if (reportType === 'weekly') {
      reportTitle = 'WEEKLY ATTENDANCE REPORT';
      const { start, end } = getWeekRange(selectedDate);
      periodText = `Date Range: ${start} to ${end}`;
    } else if (reportType === 'monthly') {
      reportTitle = 'MONTHLY ATTENDANCE REPORT';
      periodText = `Selected Month: ${selectedDate}`;
    }

    const generatedTime = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Excel HTML Template with CSS Colors & Formatting
    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Attendance Report</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          .title-hdr { background-color: #0f172a; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; padding: 12px; }
          .meta-label { font-weight: bold; color: #475569; background-color: #f1f5f9; width: 140px; border: 1px solid #cbd5e1; }
          .meta-val { color: #0f172a; border: 1px solid #cbd5e1; }
          .stat-hdr { font-weight: bold; text-align: center; color: #ffffff; padding: 8px; font-size: 10pt; }
          .stat-val { font-size: 14pt; font-weight: bold; text-align: center; padding: 8px; border: 1px solid #cbd5e1; }
          .tbl-hdr { background-color: #1e293b; color: #ffffff; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #334155; }
          .td-cell { padding: 8px; border: 1px solid #cbd5e1; text-align: left; }
          .bg-alt { background-color: #f8fafc; }
          .status-ontime { background-color: #dcfce7; color: #15803d; font-weight: bold; text-align: center; }
          .status-late { background-color: #fef9c3; color: #a16207; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <table>
          <!-- Header Banner -->
          <tr><td colspan="8" class="title-hdr">${reportTitle}</td></tr>
          <tr><td colspan="8"></td></tr>

          <!-- Meta Information -->
          <tr><td colspan="2" class="meta-label">Period:</td><td colspan="6" class="meta-val">${periodText}</td></tr>
          <tr><td colspan="2" class="meta-label">Department:</td><td colspan="6" class="meta-val">${department}</td></tr>
          <tr><td colspan="2" class="meta-label">Generated On:</td><td colspan="6" class="meta-val">${generatedTime}</td></tr>
          <tr><td colspan="8"></td></tr>
          
          <!-- Colored Summary Cards -->
          <tr>
            <td colspan="2" class="stat-hdr" style="background-color: #2563eb;">Total Records</td>
            <td colspan="2" class="stat-hdr" style="background-color: #16a34a;">Present</td>
            <td colspan="2" class="stat-hdr" style="background-color: #ca8a04;">Late</td>
            <td colspan="2" class="stat-hdr" style="background-color: #dc2626;">Absent</td>
          </tr>
          <tr>
            <td colspan="2" class="stat-val" style="background-color: #eff6ff; color: #1d4ed8;">${stats.total}</td>
            <td colspan="2" class="stat-val" style="background-color: #f0fdf4; color: #15803d;">${stats.present}</td>
            <td colspan="2" class="stat-val" style="background-color: #fefce8; color: #a16207;">${stats.late}</td>
            <td colspan="2" class="stat-val" style="background-color: #fef2f2; color: #b91c1c;">${stats.absent}</td>
          </tr>
          <tr><td colspan="8"></td></tr>

          <!-- Data Table Headers -->
          <tr>
            <th class="tbl-hdr">Date</th>
            <th class="tbl-hdr">Employee ID</th>
            <th class="tbl-hdr">Name</th>
            <th class="tbl-hdr">Department</th>
            <th class="tbl-hdr">Designation</th>
            <th class="tbl-hdr">Check In</th>
            <th class="tbl-hdr">Check Out</th>
            <th class="tbl-hdr">Status</th>
          </tr>

          <!-- Data Rows -->
          ${reportData
            .map(
              (log, idx) => `
            <tr class="${idx % 2 === 0 ? '' : 'bg-alt'}">
              <td class="td-cell">${log.date || ''}</td>
              <td class="td-cell">${log.employeeId || ''}</td>
              <td class="td-cell">${log.name || ''}</td>
              <td class="td-cell">${log.department || '-'}</td>
              <td class="td-cell">${log.designation || '-'}</td>
              <td class="td-cell">${formatTime(log.checkIn)}</td>
              <td class="td-cell">${formatTime(log.checkOut)}</td>
              <td class="td-cell ${log.status === 'On Time' ? 'status-ontime' : 'status-late'}">${log.status || ''}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance_Report_${reportType}_${selectedDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Attendance Reports</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Generate, preview, download, and email attendance summaries for management.
        </p>
      </div>

      {/* Control Panel */}
      <div className="bg-[#121215] border border-[#1e1e22] p-6 rounded-2xl space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Type Selection */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
              className="w-full bg-[#1a1a1e] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
            >
              <option value="daily">Daily Attendance Report</option>
              <option value="weekly">Weekly Attendance Report</option>
              <option value="monthly">Monthly Attendance Summary</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              {reportType === 'daily' && 'Select Date'}
              {reportType === 'weekly' && 'Select Any Date in Week'}
              {reportType === 'monthly' && 'Select Month'}
            </label>
            <input
              type={reportType === 'monthly' ? 'month' : 'date'}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#1a1a1e] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-[#1a1a1e] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="IT">IT</option>
              <option value="Retail">Retail</option>
              <option value="Business Operation">Business Operation</option>
            </select>
          </div>

          {/* GM Email Input */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Recipient Email (GM)</label>
            <input
              type="email"
              value={gmEmail}
              onChange={(e) => setGmEmail(e.target.value)}
              placeholder="gm@company.com"
              className="w-full bg-[#1a1a1e] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
            />
          </div>
        </div>

        {/* Selected Period Badge */}
        {reportType === 'weekly' && (
          <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
            📅 Week Period: <span className="font-semibold">{getWeekRange(selectedDate).start}</span> to{' '}
            <span className="font-semibold">{getWeekRange(selectedDate).end}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleSendEmail}
            disabled={emailSending}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {emailSending ? 'Sending Email...' : '📧 Send Report to GM Email'}
          </button>

          {/* <button
            onClick={handleExportCSV}
            className="bg-[#1a1a1e] hover:bg-[#27272a] border border-[#27272a] text-zinc-200 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
          >
            📥 Download Report (CSV)
          </button> */}

          <button
  onClick={handleExportExcel}
  className="bg-[#1a1a1e] hover:bg-[#27272a] border border-[#27272a] text-zinc-200 font-semibold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-2"
>
  📥 Download Excel Report (.xls)
</button>
        </div>

        {/* Message Status */}
        {message.text && (
          <p
            className={`text-xs font-medium p-3 rounded-xl border ${
              message.type === 'success'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-red-400 bg-red-500/10 border-red-500/20'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#121215] border border-[#1e1e22] p-4 rounded-xl">
          <p className="text-[11px] text-zinc-400">Total Records</p>
          <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
        </div>
        <div className="bg-[#121215] border border-[#1e1e22] p-4 rounded-xl">
          <p className="text-[11px] text-zinc-400">Present</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">{stats.present}</p>
        </div>
        <div className="bg-[#121215] border border-[#1e1e22] p-4 rounded-xl">
          <p className="text-[11px] text-zinc-400">Late</p>
          <p className="text-xl font-bold text-amber-400 mt-1">{stats.late}</p>
        </div>
        <div className="bg-[#121215] border border-[#1e1e22] p-4 rounded-xl">
          <p className="text-[11px] text-zinc-400">Absent</p>
          <p className="text-xl font-bold text-red-400 mt-1">{stats.absent}</p>
        </div>
      </div>

      {/* Live Preview Table */}
      <div className="bg-[#121215] border border-[#1e1e22] rounded-xl overflow-hidden shadow-xl space-y-3">
        <div className="p-4 border-b border-[#1e1e22]">
          <h3 className="text-sm font-semibold text-white">Report Live Preview</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1a1a1e] text-zinc-400 border-b border-[#27272a]">
              <tr>
                <th className="p-3.5 font-semibold">Date</th>
                <th className="p-3.5 font-semibold">Employee ID</th>
                <th className="p-3.5 font-semibold">Name</th>
                <th className="p-3.5 font-semibold">Department</th>
                <th className="p-3.5 font-semibold">Designation</th>
                <th className="p-3.5 font-semibold">Check In</th>
                <th className="p-3.5 font-semibold">Check Out</th>
                <th className="p-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e22] text-zinc-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-zinc-500">
                    Generating preview...
                  </td>
                </tr>
              ) : reportData.length > 0 ? (
                reportData.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-[#1a1a1e]/50 transition-colors">
                    <td className="p-3.5 text-zinc-400 font-mono">{log.date}</td>
                    <td className="p-3.5 font-mono text-zinc-400">{log.employeeId}</td>
                    <td className="p-3.5 font-medium text-white">{log.name}</td>
                    <td className="p-3.5 text-zinc-300">{log.department || '-'}</td>
                    <td className="p-3.5 text-zinc-300">{log.designation || '-'}</td>
                    <td className="p-3.5 text-emerald-400 font-mono">{formatTime(log.checkIn)}</td>
                    <td className="p-3.5 text-amber-400 font-mono">{formatTime(log.checkOut)}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          log.status === 'On Time'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-zinc-500">
                    No attendance data available for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}