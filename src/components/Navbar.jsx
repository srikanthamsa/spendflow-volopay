import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Download, 
  Plus, 
  CreditCard,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function Navbar({ 
  onSimulateClaude, 
  onOpenConnectModal, 
  onOpenNewBillModal, 
  isSimulating 
}) {
  const handleExportVolopay = () => {
    window.location.href = '/api/export/volopay';
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">SpendFlow</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero-AI Engine
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline-flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Volopay Sync
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Powered by customer's Claude via MCP • Zero AI runtime costs
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onSimulateClaude}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 transition-all hover:border-indigo-400 shadow-sm disabled:opacity-50"
              title="Simulate Claude calling the create_vendor_bill MCP tool"
            >
              <Sparkles className={`w-4 h-4 text-indigo-400 ${isSimulating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Simulate</span> Claude MCP
            </button>

            <button
              onClick={onOpenConnectModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Connect MCP</span>
            </button>

            <button
              onClick={handleExportVolopay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 transition-all hidden lg:inline-flex"
              title="Export approved bills to Volopay batch payout format"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Volopay CSV</span>
            </button>

            <button
              onClick={onOpenNewBillModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bill</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
