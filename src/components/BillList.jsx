import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

export default function BillList({ bills, onSelectBill, onApproveQuick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  const renderStatus = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
            Settled
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Approved
          </span>
        );
      case 'Pending Approval':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Pending
          </span>
        );
    }
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return '—';
    const due = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-rose-400">{Math.abs(diffDays)}d overdue</span>;
    }
    if (diffDays === 0) {
      return <span className="text-amber-300">Due today</span>;
    }
    return <span className="text-zinc-400">In {diffDays}d</span>;
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden">
      
      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1">
          {[
            { id: 'ALL', label: 'All', count: bills.length },
            { id: 'PENDING', label: 'Pending', count: bills.filter(b => b.status === 'Pending Approval').length },
            { id: 'APPROVED', label: 'Approved', count: bills.filter(b => b.status === 'Approved').length },
            { id: 'PAID', label: 'Settled', count: bills.filter(b => b.status === 'Paid').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === tab.id
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {tab.label} <span className="text-zinc-500 ml-1">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search & Department Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 w-44 sm:w-56"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-md text-zinc-300 focus:outline-none focus:border-zinc-700"
          >
            <option value="ALL">All departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

      </div>

      {/* Clean Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/40 text-zinc-500 border-b border-zinc-800/80 font-normal">
            <tr>
              <th className="py-2.5 px-4 font-normal">Vendor</th>
              <th className="py-2.5 px-3 font-normal">Invoice</th>
              <th className="py-2.5 px-3 font-normal">Department</th>
              <th className="py-2.5 px-3 font-normal">Due</th>
              <th className="py-2.5 px-3 font-normal">Origin</th>
              <th className="py-2.5 px-3 font-normal">Status</th>
              <th className="py-2.5 px-4 font-normal text-right">Amount</th>
              <th className="py-2.5 px-3 font-normal text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-zinc-500 text-xs">
                  No invoices found matching criteria.
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr 
                  key={bill.id} 
                  className="hover:bg-zinc-900/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectBill(bill)}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-zinc-200">
                      {bill.vendorName}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-normal">
                      {bill.category}
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-zinc-400 text-xs">
                    {bill.invoiceNumber}
                  </td>

                  <td className="py-3 px-3 text-zinc-400">
                    {bill.department}
                  </td>

                  <td className="py-3 px-3">
                    {formatDueDate(bill.dueDate)}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] text-zinc-500">
                      {bill.source === 'Claude MCP' ? 'mcp' : 'manual'}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    {renderStatus(bill.status)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-zinc-100 tabular-nums">
                    ₹{bill.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {bill.status === 'Pending Approval' && (
                        <button
                          onClick={() => onApproveQuick(bill.id)}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => onSelectBill(bill)}
                        className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Meta */}
      <div className="px-4 py-2.5 border-t border-zinc-800/80 bg-zinc-950/20 text-xs text-zinc-500 flex items-center justify-between">
        <div>
          {filteredBills.length} of {bills.length} records
        </div>
        <div className="text-[11px] text-zinc-600">
          Press any invoice to inspect or edit line items
        </div>
      </div>

    </div>
  );
}
