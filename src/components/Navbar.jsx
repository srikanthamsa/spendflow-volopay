import React from 'react';
import { Download, Plus, Terminal, RefreshCw } from 'lucide-react';

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
    <header className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-950 font-semibold text-xs tracking-tight">
              SF
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-100 tracking-tight">SpendFlow</span>
              <span className="text-xs text-zinc-600 font-normal">/</span>
              <span className="text-xs text-zinc-400 font-normal hidden sm:inline">Payables</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onSimulateClaude}
              disabled={isSimulating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Simulate ingestion</span>
            </button>

            <button
              onClick={onOpenConnectModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span>MCP setup</span>
            </button>

            <button
              onClick={handleExportVolopay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition-colors hidden sm:inline-flex"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onOpenNewBillModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New invoice</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
