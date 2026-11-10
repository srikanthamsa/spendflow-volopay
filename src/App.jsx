import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import StatsCards from './components/StatsCards.jsx';
import BillList from './components/BillList.jsx';
import BillDetailModal from './components/BillDetailModal.jsx';
import ConnectClaudeModal from './components/ConnectClaudeModal.jsx';
import NewBillModal from './components/NewBillModal.jsx';
import { 
  Sparkles, 
  Layers, 
  Bot, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ExternalLink 
} from 'lucide-react';

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
    setTimeout(() => setToastMessage(null), 4000);
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
      console.error('Error fetching SpendFlow data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 5 seconds for updates (e.g. when Claude MCP tool runs)
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
        showToast(`✨ Claude MCP ingested new bill for '${data.bill.vendorName}'!`);
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
        showToast('✓ Invoice & line items saved successfully');
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
        showToast(`✓ Tier ${tierNumber} approved!`);
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
        showToast('✓ Payment dispatched via Volopay Corporate Card!');
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
        showToast(`✓ Manual bill created for '${data.bill.vendorName}'`);
      }
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-medium text-xs sm:text-sm shadow-2xl shadow-indigo-600/50 border border-indigo-400 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
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

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Volopay Product & Tech Assignment • Candidate: Srikant Hamsa
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              SpendFlow: The Zero-AI Autonomous Spend Hub
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Customers already pay for Claude. They type in vendor agreements, quotes, or invoices; Claude reads and structures the data via <strong className="text-white">Model Context Protocol (MCP)</strong>. <strong className="text-white">SpendFlow</strong> stays live 24/7, lets finance teams edit line items, enforces multi-tier approvals, and dispatches payouts via <strong className="text-white">Volopay</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>View Claude MCP Connection Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSimulateClaude}
                disabled={isSimulating}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Simulate Claude Ingestion Demo</span>
              </button>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-40 -top-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Stats Grid */}
        <StatsCards stats={stats} />

        {/* Bills Table & Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Active Vendor Invoices & SOWs</h2>
              <p className="text-xs text-slate-400">Review items structured by Claude, edit line item amounts, and approve for payout</p>
            </div>
          </div>

          <BillList
            bills={bills}
            onSelectBill={(bill) => setSelectedBill(bill)}
            onApproveQuick={(id) => handleApproveTier(id, 1, 'Quick Approver')}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">SpendFlow</span>
            <span>• Built for Volopay by Srikant Hamsa</span>
            <span className="text-slate-600">|</span>
            <span>Zero AI Inside • Pure MCP Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="mailto:sandeep.juttuga@volopay.co" className="hover:text-slate-200">sandeep.juttuga@volopay.co</a>
            <a href="mailto:rosh@volopay.co" className="hover:text-slate-200">rosh@volopay.co</a>
            <span className="text-slate-600">|</span>
            <button onClick={() => setIsConnectModalOpen(true)} className="text-indigo-400 hover:text-indigo-300">
              MCP Documentation
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
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
