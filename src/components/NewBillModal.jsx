import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function NewBillModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    vendorName: '',
    invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
    category: 'Software & Cloud',
    department: 'Engineering',
    costCenter: 'ENG-OPS',
    currency: 'USD',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    paymentTerms: 'Net 14',
    notes: '',
    approverName: 'Rajesh Raikwar',
    taxRate: 0,
    discount: 0,
    lineItems: [
      { description: 'Cloud infrastructure / subscription', quantity: 1, unitPrice: 1200.00 }
    ]
  });

  const handleLineItemChange = (index, field, value) => {
    const newItems = [...formData.lineItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, lineItems: newItems });
  };

  const handleAddLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: 'Additional item', quantity: 1, unitPrice: 200.00 }]
    });
  };

  const handleDeleteLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.vendorName.trim()) {
      alert('Enter a vendor name');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const subtotal = formData.lineItems.reduce((acc, item) => {
    return acc + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));
  }, 0);
  const total = Math.max(0, subtotal + (subtotal * (Number(formData.taxRate) || 0) / 100) - (Number(formData.discount) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">New invoice</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Record a vendor payable directly</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-normal text-zinc-500 mb-1">Vendor name</label>
              <input
                type="text"
                required
                placeholder="AWS, Stripe, Contractor"
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-normal text-zinc-500">Items</label>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            <div className="space-y-1.5">
              {formData.lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                    className="w-14 px-1.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 text-center"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                    className="w-20 px-1.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200 text-right font-mono"
                  />
                  {formData.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteLineItem(idx)}
                      className="p-1 text-zinc-600 hover:text-zinc-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between items-center font-mono">
            <span className="font-sans text-zinc-400">Total amount</span>
            <span className="text-sm font-medium text-zinc-100">
              {formData.currency} {total.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium rounded-md bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              Create invoice
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
