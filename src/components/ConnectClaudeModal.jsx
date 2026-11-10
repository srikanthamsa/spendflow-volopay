import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Terminal, 
  Bot, 
  ExternalLink, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ConnectClaudeModal({ onClose }) {
  const [copiedSection, setCopiedSection] = useState(null);

  const localMcpPath = "/Users/srikanthamsa/OpenBot/Agents/agent-c131999f-1e87-4206-9ebe-db75ae65235b/spendflow/bin/mcp-server.js";

  const claudeDesktopConfig = JSON.stringify({
    mcpServers: {
      spendflow: {
        command: "node",
        args: [localMcpPath]
      }
    }
  }, null, 2);

  const remoteSseConfig = JSON.stringify({
    mcpServers: {
      spendflow: {
        url: `${window.location.origin}/sse`
      }
    }
  }, null, 2);

  const samplePrompts = [
    {
      title: "1. Ingest an AWS Cloud Infrastructure Bill",
      prompt: "I just got an invoice from AWS for $3,850.50 due on Dec 15th for our cloud production cluster. Create a bill for Engineering under cost center ENG-INFRA, with 2 line items: 'EC2 Compute Instances - $2,900' and 'RDS Aurora PostgreSQL - $950.50'. Assign Rosh as the final approver."
    },
    {
      title: "2. Set up Design Contractor Retainer",
      prompt: "Create a vendor bill in SpendFlow for UI Designer Sarah Chen for $5,000 under Product. Add line item 'Design System Redesign Sprint' for $5,000 with Net 15 terms. Assign Sandeep Juttuga as approver."
    },
    {
      title: "3. Check Spend & Pending Bills",
      prompt: "What is our company's current pending spend in SpendFlow? List all bills awaiting approval."
    }
  ];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Connect Claude via MCP
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero AI Keys Required
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Claude does the reading and parsing on your plan; SpendFlow hosts, edits, and executes the bills.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs sm:text-sm">

          {/* Quick Explanation */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-slate-900 border border-indigo-500/20 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              How the MCP Integration Works
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you paste an invoice, receipt, or plain text vendor agreement into Claude, Claude automatically calls SpendFlow’s <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">create_vendor_bill</code> tool. The parsed bill immediately appears live on this web dashboard for human review, line item adjustments, and Volopay settlement.
            </p>
          </div>

          {/* Option A: Claude Desktop Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Claude Desktop Configuration (Local stdio)
                </h3>
                <p className="text-xs text-slate-400">
                  Add this to your <code className="text-slate-300 font-mono">claude_desktop_config.json</code>:
                </p>
              </div>
              <button
                onClick={() => handleCopy(claudeDesktopConfig, 'desktop')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                {copiedSection === 'desktop' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'desktop' ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{claudeDesktopConfig}</pre>
            </div>
            <div className="text-[11px] text-slate-500">
              Config location on Mac: <code className="text-slate-400">~/Library/Application Support/Claude/claude_desktop_config.json</code>
            </div>
          </div>

          {/* Option B: Remote SSE MCP Endpoint */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  Remote Web MCP / SSE Endpoint
                </h3>
                <p className="text-xs text-slate-400">
                  For remote Claude clients or mcp-remote:
                </p>
              </div>
              <button
                onClick={() => handleCopy(remoteSseConfig, 'sse')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              >
                {copiedSection === 'sse' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'sse' ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre>{remoteSseConfig}</pre>
            </div>
          </div>

          {/* Sample Prompts to Try in Claude */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Try These Prompts in Claude
            </h3>
            <div className="space-y-2.5">
              {samplePrompts.map((p, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{p.title}</span>
                    <button
                      onClick={() => handleCopy(p.prompt, `prompt-${idx}`)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {copiedSection === `prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSection === `prompt-${idx}` ? "Copied" : "Copy Prompt"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-sans">
                    "{p.prompt}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
