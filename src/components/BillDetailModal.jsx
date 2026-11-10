import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('details');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...bill });
  }, [bill]);

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
      id: `li-${Date.now()}`,
      description: "Service deliverable",
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
    if (formData.lineItems.length <= 1) return;
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
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const isApproved = formData.status === 'Approved' || formData.status === 'Paid';
  const isPaid = formData.status === 'Paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
                  {formData.vendorName}
                </h2>
                <span className="font-mono text-xs text-zinc-500">
                  {formData.invoiceNumber}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  ({formData.source === 'Claude MCP' ? 'via mcp' : 'manual'})
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formData.category} • {formData.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveChanges}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              {saveSuccess ? "Saved" : "Save"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-800 px-5 bg-zinc-950/20">
          {[
            { id: 'details', label: 'Items & terms' },
            { id: 'approvals', label: 'Approvals' },
            { id: 'audit', label: 'History' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-white text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 text-xs">

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <>
              {/* Metadata Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-normal text-zinc-500 mb-1">Vendor</label>
                  <input
                    type="text"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-zinc-500 mb-1">Invoice number</label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 font-mono focus:outline-none focus:border-zinc-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-zinc-500 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-700"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-normal text-zinc-500 mb-1">Due date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">Deliverables & items</span>
                  <button
                    onClick={handleAddLineItem}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add item
                  </button>
                </div>

                <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/60 text-zinc-500 border-b border-zinc-800 font-normal">
                      <tr>
                        <th className="py-2 px-3 font-normal">Description</th>
                        <th className="py-2 px-2 font-normal w-16 text-center">Qty</th>
                        <th className="py-2 px-3 font-normal w-24 text-right">Unit price</th>
                        <th className="py-2 px-3 font-normal w-24 text-right">Total</th>
                        <th className="py-2 px-2 font-normal w-8 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {formData.lineItems.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-zinc-700"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                              className="w-full px-1.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 text-center focus:outline-none focus:border-zinc-700"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 text-right font-mono focus:outline-none focus:border-zinc-700"
                            />
                          </td>
                          <td className="p-2 text-right font-mono text-zinc-200 tabular-nums">
                            {formData.currency} {Number(item.total).toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteLineItem(idx)}
                              className="p-1 text-zinc-600 hover:text-zinc-300"
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

              {/* Notes & Financial Calculation */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="w-full sm:max-w-xs space-y-1">
                  <label className="block text-[11px] font-normal text-zinc-500">Context notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-2 text-xs bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-700"
                    placeholder="Statement details or SLA notes..."
                  />
                </div>

                <div className="w-full sm:w-56 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span className="font-sans">Subtotal</span>
                    <span>{formData.currency} {formData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-sans">Tax %</span>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.taxRate}
                      onChange={(e) => handleTaxOrDiscountChange('taxRate', e.target.value)}
                      className="w-14 px-1 py-0.5 text-right bg-zinc-900 border border-zinc-800 rounded text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-sans">Discount</span>
                    <input
                      type="number"
                      step="1"
                      value={formData.discount}
                      onChange={(e) => handleTaxOrDiscountChange('discount', e.target.value)}
                      className="w-14 px-1 py-0.5 text-right bg-zinc-900 border border-zinc-800 rounded text-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div className="pt-2 border-t border-zinc-800 flex justify-between font-semibold text-zinc-100">
                    <span className="font-sans font-medium">Total</span>
                    <span>{formData.currency} {formData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: APPROVALS */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-medium text-zinc-300">Approval tiers</span>
                <div className="space-y-2">
                  {formData.approvalTiers?.map((tier, idx) => {
                    const isTierApproved = tier.status === 'Approved';
                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-zinc-200">
                              Tier {tier.tier}: {tier.role}
                            </span>
                            <span className={`text-[11px] ${isTierApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                              ● {tier.status}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            Approver: {tier.approverName}
                            {tier.approvedAt && (
                              <span className="text-zinc-600 ml-2">
                                ({new Date(tier.approvedAt).toLocaleDateString()})
                              </span>
                            )}
                          </div>
                        </div>

                        {!isTierApproved && !isPaid && (
                          <button
                            onClick={async () => {
                              await onApprove(formData.id, tier.tier, tier.approverName);
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volopay Settlement */}
              <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-200 mb-0.5">
                    Volopay payout execution
                  </div>
                  <div className="text-xs text-zinc-500">
                    {isPaid 
                      ? `Settled via ${formData.paymentMethod || 'Volopay Card'}`
                      : 'Executes payment once all approval tiers sign off'}
                  </div>
                </div>

                {!isPaid && (
                  <button
                    onClick={async () => {
                      await onPay(formData.id, 'Volopay Virtual Card (*4491)');
                    }}
                    disabled={!isApproved}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      isApproved
                        ? 'bg-white text-zinc-950 hover:bg-zinc-200'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                  >
                    Authorize settlement
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-950/40 divide-y divide-zinc-800/60">
                {formData.auditLog?.map((log, idx) => (
                  <div key={log.id || idx} className="py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-zinc-200">{log.action}</span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">{log.actor}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{log.details}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Delete invoice ${formData.invoiceNumber}?`)) {
                onDelete(formData.id);
                onClose();
              }
            }}
            className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
          >
            Delete invoice
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            >
              Close
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-4 py-1.5 text-xs font-medium rounded-md bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              {saveSuccess ? "Saved" : "Save changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
