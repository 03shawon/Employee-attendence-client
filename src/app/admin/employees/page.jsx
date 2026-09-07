'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '@/lib/api';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    employeeId: '', 
    department: '', 
    designation: '', 
    email: '', 
    pin: '' 
  });
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0); // ডাটা রিফ্রেশ করার জন্য স্টেট

  // useEffect-এর ভেতরেই ফাংশনটি ডিক্লেয়ার করা হয়েছে
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/employees`);
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, [reload]); // reload চেঞ্জ হলেই useEffect আবার রান করবে

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', employeeId: '', department: '', designation: '', email: '', pin: '' });
        setReload((prev) => prev + 1); // টেবিল রিফ্রেশ করবে
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to add employee');
      }
    } catch (error) {
      alert('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReload((prev) => prev + 1); // টেবিল রিফ্রেশ করবে
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#09090b] text-zinc-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Employee Directory</h1>
          <p className="text-xs text-zinc-400">Manage all registered company employees</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-white text-black hover:bg-zinc-200 rounded-xl transition-all shadow-lg"
        >
          + Add New Employee
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-[#121215] border border-[#1e1e22] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1a1a1e] text-zinc-400 border-b border-[#27272a]">
            <tr>
              <th className="p-3.5 font-semibold">ID</th>
              <th className="p-3.5 font-semibold">Name</th>
              <th className="p-3.5 font-semibold">Department</th>
              <th className="p-3.5 font-semibold">Designation</th>
              <th className="p-3.5 font-semibold">Email</th>
              <th className="p-3.5 font-semibold">PIN</th>
              <th className="p-3.5 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e22] text-zinc-300">
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-[#1a1a1e]/50 transition-colors">
                <td className="p-3.5 font-mono text-zinc-400">{emp.employeeId}</td>
                <td className="p-3.5 font-medium text-white">{emp.name}</td>
                <td className="p-3.5">{emp.department}</td>
                <td className="p-3.5 text-zinc-300">{emp.designation || '-'}</td>
                <td className="p-3.5 text-zinc-400">{emp.email}</td>
                <td className="p-3.5 font-mono">••••</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121215] border border-[#1e1e22] rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1a1a1e] text-xs text-white px-3 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Employee ID (e.g. EMP002)"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full bg-[#1a1a1e] text-xs text-white px-3 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#1a1a1e] text-xs text-white px-3 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Designation (e.g. Software Engineer)"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-[#1a1a1e] text-xs text-white px-3 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#1a1a1e] text-xs text-white px-3 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
                required
              />
              <input
                type="password"
                maxLength={4}
                placeholder="4-Digit PIN"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full bg-[#1a1a1e] text-xs text-white px-3 py-2.5 rounded-xl border border-[#27272a] focus:outline-none"
                required
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold bg-[#1a1a1e] text-zinc-400 hover:text-white rounded-xl border border-[#27272a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 text-xs font-semibold bg-white text-black hover:bg-zinc-200 rounded-xl"
                >
                  {loading ? 'Saving...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}