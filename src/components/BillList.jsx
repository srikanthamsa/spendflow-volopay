import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Bot, 
  User, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  AlertCircle,
  FileEdit,
  ArrowUpDown
} from 'lucide-react';

export default function BillList({ bills, onSelectBill, onApproveQuick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'PAID'
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const filteredBills = bills.filter(bill => {
    const matchesSearch = 
      bill.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.category && bill.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && bill.status === 'Pending Approval') ||
      (statusFilter === 'APPROVED' && bill.status === 'Approved') ||
      (statusFilter === 'PAID' && bill.status === 'Paid');

    const matchesDepartment = 
      departmentFilter === 'ALL' || bill.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <CreditCard className="w-3 h-3" /> Paid via Volopay
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'Pending Approval':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending Approval
          </span>
        );
    }
  };

  const getDueDateBadge = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-[11px] font-semibold text-rose-400">Overdue by {Math.abs(diffDays)}d</span>;
    }
    if (diffDays === 0) {
      return <span className="text-[11px] font-semibold text-amber-400">Due today</span>;
    }
    return <span className="text-[11px] text-slate-400">Due in {diffDays}d ({dueDateStr})</span>;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
      
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800/80 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Bills', count: bills.length },
            { id: 'PENDING', label: 'Pending', count: bills.filter(b => b.status === 'Pending Approval').length },
            { id: 'APPROVED', label: 'Approved', count: bills.filter(b => b.status === 'Approved').length },
            { id: 'PAID', label: 'Paid', count: bills.filter(b => b.status === 'Paid').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                statusFilter === tab.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Department Selector */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vendor, invoice, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Depts</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

      </div>

      {/* Bills Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th className="py-3.5 px-5">Vendor & Category</th>
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Dept / Cost Center</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Source</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-slate-600" />
                    <span>No vendor bills found matching your criteria.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr 
                  key={bill.id} 
                  className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  onClick={() => onSelectBill(bill)}
                >
                  {/* Vendor Name & Category */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0 group-hover:border-indigo-500/50 transition-colors">
                        {bill.vendorName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                          {bill.vendorName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {bill.category || 'General Operations'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Invoice # */}
                  <td className="py-4 px-4 font-mono text-slate-300 text-xs">
                    {bill.invoiceNumber}
                  </td>

                  {/* Dept & Cost Center */}
                  <td className="py-4 px-4">
                    <div className="text-slate-200 font-medium">{bill.department}</div>
                    <div className="text-[10px] font-mono text-slate-500">{bill.costCenter || '—'}</div>
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-4">
                    {getDueDateBadge(bill.dueDate)}
                  </td>

                  {/* Source */}
                  <td className="py-4 px-4">
                    {bill.source === 'Claude MCP' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                        <Bot className="w-3 h-3" /> Claude MCP
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                        <User className="w-3 h-3" /> Manual
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {getStatusBadge(bill.status)}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-5 text-right font-mono font-bold text-white text-sm">
                    {bill.currency} {bill.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onSelectBill(bill)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                        title="Review and Edit in Web App"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                      {bill.status === 'Pending Approval' && (
                        <button
                          onClick={() => onApproveQuick(bill.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-semibold transition-all"
                          title="Quick Approve"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          Showing <span className="font-semibold text-slate-200">{filteredBills.length}</span> of <span className="font-semibold text-slate-200">{bills.length}</span> bills
        </div>
        <div className="text-[11px] text-slate-500">
          💡 Click any invoice to open the live Human Editor, adjust line items, and inspect the approval pipeline.
        </div>
      </div>

    </div>
  );
}
