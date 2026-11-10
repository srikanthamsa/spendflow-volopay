import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Check, 
  Clock, 
  Bot, 
  User, 
  Building2, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Save, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function BillDetailModal({ 
  bill, 
  onClose, 
  onSave, 
  onApprove, 
  onPay, 
  onDelete 
}) {
  if (!bill) return null;

  const [formData, setFormData] = useState({ ...bill });
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'approvals' | 'audit'
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...bill });
  }, [bill]);

  // Recalculate totals
  const recalculateTotals = (items, taxRate, discount) => {
    const subtotal = items.reduce((acc, item) => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      return acc + (q * p);
    }, 0);
    const tax = (subtotal * (Number(taxRate) || 0)) / 100;
    const total = Math.max(0, subtotal + tax - (Number(discount) || 0));
    return {
      subtotal: Number(subtotal.toFixed(2)),
      totalAmount: Number(total.toFixed(2))
    };
  };

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...formData.lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate line total
    const q = Number(newItems[index].quantity) || 0;
    const p = Number(newItems[index].unitPrice) || 0;
    newItems[index].total = Number((q * p).toFixed(2));

    const { subtotal, totalAmount } = recalculateTotals(newItems, formData.taxRate, formData.discount);
    setFormData({
      ...formData,
      lineItems: newItems,
      subtotal,
      totalAmount
    });
  };

  const handleAddLineItem = () => {
    const newItem = {
      id: `li-new-${Date.now()}`,
      description: "New Service / Deliverable",
      quantity: 1,
      unitPrice: 100.00,
      total: 100.00
    };
    const newItems = [...formData.lineItems, newItem];
    const { subtotal, totalAmount } = recalculateTotals(newItems, formData.taxRate, formData.discount);
    setFormData({
      ...formData,
      lineItems: newItems,
      subtotal,
      totalAmount
    });
  };

  const handleDeleteLineItem = (index) => {
    if (formData.lineItems.length <= 1) {
      alert("A bill must contain at least one line item.");
      return;
    }
    const newItems = formData.lineItems.filter((_, i) => i !== index);
    const { subtotal, totalAmount } = recalculateTotals(newItems, formData.taxRate, formData.discount);
    setFormData({
      ...formData,
      lineItems: newItems,
      subtotal,
      totalAmount
    });
  };

  const handleTaxOrDiscountChange = (field, value) => {
    const taxRate = field === 'taxRate' ? Number(value) : formData.taxRate;
    const discount = field === 'discount' ? Number(value) : formData.discount;
    const { subtotal, totalAmount } = recalculateTotals(formData.lineItems, taxRate, discount);
    setFormData({
      ...formData,
      [field]: Number(value) || 0,
      subtotal,
      totalAmount
    });
  };

  const handleSaveChanges = async () => {
    await onSave(formData.id, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const isApproved = formData.status === 'Approved' || formData.status === 'Paid';
  const isPaid = formData.status === 'Paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
              {formData.vendorName ? formData.vendorName.substring(0, 2).toUpperCase() : 'VN'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {formData.vendorName}
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {formData.invoiceNumber}
                </span>
                {formData.source === 'Claude MCP' ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                    <Bot className="w-3 h-3" /> Claude MCP Ingested
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    <User className="w-3 h-3" /> Manual Entry
                  </span>
                )}
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                  isPaid 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/25'
                    : isApproved
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                }`}>
                  {formData.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Created: {new Date(formData.createdAt).toLocaleString()} • Last edited: {new Date(formData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccess ? "Saved!" : "Save Changes"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Invoice & Line Items (Human Editor)
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Approval Matrix</span>
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-300">
              {formData.approvalTiers?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Audit Trail</span>
            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-300">
              {formData.auditLog?.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* TAB 1: DETAILS & LINE ITEMS */}
          {activeTab === 'details' && (
            <>
              {/* Note callout banner */}
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-200">
                  <span className="font-semibold text-white">Zero-AI Human Revision:</span> All fields and line items below were structured by Claude via MCP, and are directly editable by you. Modify amounts, add deliverables, or update cost centers before authorizing payout.
                </div>
              </div>

              {/* Editable Bill Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Cost Center</label>
                  <input
                    type="text"
                    value={formData.costCenter || ''}
                    onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="SGD">SGD (S$)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Itemized Deliverables & Charges
                  </h3>
                  <button
                    onClick={handleAddLineItem}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Description</th>
                        <th className="py-2.5 px-3 font-semibold w-20 text-center">Qty</th>
                        <th className="py-2.5 px-3 font-semibold w-28 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 font-semibold w-28 text-right">Total</th>
                        <th className="py-2.5 px-3 font-semibold w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {formData.lineItems.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-800/30">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-slate-800/50 border border-slate-700/80 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                              className="w-full px-2 py-1.5 text-xs bg-slate-800/50 border border-slate-700/80 rounded-lg text-white text-center focus:outline-none focus:border-indigo-500"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1.5 text-xs bg-slate-800/50 border border-slate-700/80 rounded-lg text-white text-right focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-semibold text-white px-3">
                            {formData.currency} {Number(item.total).toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteLineItem(idx)}
                              className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                              title="Delete Line Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Calculation Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="w-full sm:max-w-xs space-y-2">
                  <label className="block text-xs font-semibold text-slate-400">Context & Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Notes on agreement, SOW terms, or department budget..."
                  />
                </div>

                <div className="w-full sm:w-64 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-200">{formData.currency} {formData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Tax (%):</span>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.taxRate}
                      onChange={(e) => handleTaxOrDiscountChange('taxRate', e.target.value)}
                      className="w-16 px-1.5 py-0.5 text-right font-mono bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Discount:</span>
                    <input
                      type="number"
                      step="1"
                      value={formData.discount}
                      onChange={(e) => handleTaxOrDiscountChange('discount', e.target.value)}
                      className="w-16 px-1.5 py-0.5 text-right font-mono bg-slate-800 border border-slate-700 rounded text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-white">
                    <span>Total Amount:</span>
                    <span className="font-mono text-indigo-400">{formData.currency} {formData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: APPROVAL MATRIX & VOLOPAY PAYOUT */}
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Hierarchical Approval Pipeline
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Multi-tier governance based on spend thresholds. Both Srikant Hamsa (Product / Finance Lead) and Rajesh Raikwar / Sandeep Juttuga (Founder / CTO) sign off before Volopay payment dispatch.
                </p>

                <div className="space-y-3">
                  {formData.approvalTiers?.map((tier, idx) => {
                    const isTierApproved = tier.status === 'Approved';
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border transition-all ${
                          isTierApproved 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-slate-800/80 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-300">
                                Tier {tier.tier}: {tier.role}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                isTierApproved 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {tier.status}
                              </span>
                            </div>
                            <div className="text-xs text-white font-medium mt-1">
                              Approver: <span className="text-indigo-300">{tier.approverName}</span>
                            </div>
                            {tier.approvedAt && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Signed off on {new Date(tier.approvedAt).toLocaleString()}
                              </div>
                            )}
                            {tier.notes && (
                              <div className="text-xs text-slate-300 italic mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                                "{tier.notes}"
                              </div>
                            )}
                          </div>

                          {!isTierApproved && !isPaid && (
                            <button
                              onClick={async () => {
                                await onApprove(formData.id, tier.tier, tier.approverName);
                              }}
                              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve Tier {tier.tier}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volopay Payment Dispatch Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">Volopay Corporate Card Settlement</h4>
                    </div>
                    <p className="text-xs text-slate-300 max-w-lg">
                      Once all approval tiers are satisfied, bills can be executed directly using Volopay Virtual Corporate Cards or queued for multi-currency international vendor payout.
                    </p>
                    {isPaid && (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl font-medium">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        Settled via {formData.paymentMethod || 'Volopay Card (*4491)'} on {formData.paidAt ? new Date(formData.paidAt).toLocaleDateString() : 'recent'}
                      </div>
                    )}
                  </div>

                  {!isPaid && (
                    <button
                      onClick={async () => {
                        await onPay(formData.id, 'Volopay Virtual Corporate Card (*4491)');
                      }}
                      disabled={!isApproved}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-lg ${
                        isApproved
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-purple-600/30 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Execute Volopay Payout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Complete, immutable audit log of actions performed by Claude MCP and team members.
              </div>
              <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/60 divide-y divide-slate-800">
                {formData.auditLog?.map((log, idx) => (
                  <div key={log.id || idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                      {log.actor?.includes('Claude') ? (
                        <Bot className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <User className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{log.action}</span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-300 font-medium">{log.actor}</div>
                      <p className="text-xs text-slate-400 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete invoice ${formData.invoiceNumber}?`)) {
                onDelete(formData.id);
                onClose();
              }
            }}
            className="text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Invoice</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              {saveSuccess ? "Saved Successfully!" : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
