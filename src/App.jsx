import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import StatsCards from './components/StatsCards.jsx';
import BillList from './components/BillList.jsx';
import BillDetailModal from './components/BillDetailModal.jsx';
import ConnectClaudeModal from './components/ConnectClaudeModal.jsx';
import NewBillModal from './components/NewBillModal.jsx';
import { ArrowRight, Check } from 'lucide-react';

export default function App() {
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    try {
      const [billsRes, statsRes] = await Promise.all([
        fetch('/api/bills').then(r => r.json()),
        fetch('/api/stats').then(r => r.json())
      ]);
      if (billsRes?.bills) setBills(billsRes.bills);
      if (statsRes) setStats(statsRes);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateClaude = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/simulate-claude', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.bill) {
        await loadData();
        setSelectedBill(data.bill);
        showToast(`Ingested invoice for ${data.bill.vendorName}`);
      }
    } catch (err) {
      console.error('Simulation failed:', err);
      showToast('Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSaveBill = async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/bills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.bill) {
        setSelectedBill(data.bill);
        await loadData();
        showToast('Changes saved');
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleApproveTier = async (id, tierNumber, approverName) => {
    try {
      const res = await fetch(`/api/bills/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierNumber, approverName })
      });
      const data = await res.json();
      if (data.bill) {
        setSelectedBill(data.bill);
        await loadData();
        showToast(`Tier ${tierNumber} approved`);
      }
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handlePay = async (id, paymentMethod) => {
    try {
      const res = await fetch(`/api/bills/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod })
      });
      const data = await res.json();
      if (data.bill) {
        setSelectedBill(data.bill);
        await loadData();
        showToast('Payment dispatched via Volopay');
      }
    } catch (err) {
      console.error('Pay failed:', err);
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await fetch(`/api/bills/${id}`, { method: 'DELETE' });
      await loadData();
      showToast('Invoice deleted');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCreateManualBill = async (billData) => {
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData)
      });
      const data = await res.json();
      if (data.bill) {
        await loadData();
        setSelectedBill(data.bill);
        showToast(`Invoice created for ${data.bill.vendorName}`);
      }
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col selection:bg-zinc-800 selection:text-white">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs shadow-xl flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-zinc-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onSimulateClaude={handleSimulateClaude}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenNewBillModal={() => setIsNewBillModalOpen(true)}
        isSimulating={isSimulating}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
              Vendor payables
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
              Invoices and deliverables structured by Claude via MCP. Edit line items, route approvals, and settle through Volopay.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            >
              <span>MCP connection details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsCards stats={stats} />

        {/* Invoices Table */}
        <BillList
          bills={bills}
          onSelectBill={(bill) => setSelectedBill(bill)}
          onApproveQuick={(id) => handleApproveTier(id, 1, 'Manager')}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400">SpendFlow</span>
            <span>• Built by Srikant Hamsa for Volopay</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500">
            <button onClick={() => setIsConnectModalOpen(true)} className="hover:text-zinc-300 transition-colors">
              MCP specification
            </button>
            <span>•</span>
            <a href="https://github.com/srikanthamsa/spendflow-volopay" target="_blank" rel="noreferrer" className="hover:text-zinc-300 transition-colors">
              GitHub repository
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          onSave={handleSaveBill}
          onApprove={handleApproveTier}
          onPay={handlePay}
          onDelete={handleDeleteBill}
        />
      )}

      {isConnectModalOpen && (
        <ConnectClaudeModal onClose={() => setIsConnectModalOpen(false)} />
      )}

      {isNewBillModalOpen && (
        <NewBillModal
          onClose={() => setIsNewBillModalOpen(false)}
          onSubmit={handleCreateManualBill}
        />
      )}
    </div>
  );
}
