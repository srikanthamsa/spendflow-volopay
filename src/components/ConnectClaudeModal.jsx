import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';

export default function ConnectClaudeModal({ onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const localMcpPath = "/Users/srikanthamsa/OpenBot/Agents/agent-c131999f-1e87-4206-9ebe-db75ae65235b/spendflow/bin/mcp-server.js";

  const desktopConfig = JSON.stringify({
    mcpServers: {
      spendflow: {
        command: "node",
        args: [localMcpPath]
      }
    }
  }, null, 2);

  const sseConfig = JSON.stringify({
    mcpServers: {
      spendflow: {
        url: `${window.location.origin}/sse`
      }
    }
  }, null, 2);

  const prompts = [
    {
      label: "Log an infrastructure invoice",
      text: "I received an AWS invoice for $3,850.50 due Dec 15th for our cloud production cluster. Create a bill for Engineering under cost center ENG-INFRA, with 2 line items: 'EC2 Compute Instances - $2,900' and 'RDS Aurora PostgreSQL - $950.50'. Assign Rosh as final approver."
    },
    {
      label: "Create contractor agreement",
      text: "Create a vendor bill in SpendFlow for UI Designer Sarah Chen for $5,000 under Product. Add line item 'Design System Redesign Sprint' for $5,000 with Net 15 terms. Assign Sandeep Juttuga as approver."
    },
    {
      label: "Query pending spend",
      text: "What is our company's current pending spend in SpendFlow? List all bills awaiting approval."
    }
  ];

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121214] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
              Claude MCP Integration
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Connect SpendFlow to Claude Desktop via Model Context Protocol
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 text-xs">

          {/* Claude Desktop Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300">
                Claude Desktop configuration
              </span>
              <button
                onClick={() => handleCopy(desktopConfig, 'desktop')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200"
              >
                {copiedKey === 'desktop' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'desktop' ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              <pre>{desktopConfig}</pre>
            </div>
            <div className="text-[11px] text-zinc-500">
              Paste in <code className="text-zinc-400 font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>
            </div>
          </div>

          {/* Remote SSE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300">
                Remote SSE endpoint
              </span>
              <button
                onClick={() => handleCopy(sseConfig, 'sse')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200"
              >
                {copiedKey === 'sse' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'sse' ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              <pre>{sseConfig}</pre>
            </div>
          </div>

          {/* Test Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-300">
              Sample prompts to run in Claude
            </span>
            <div className="space-y-2">
              {prompts.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300 font-medium">{p.label}</span>
                    <button
                      onClick={() => handleCopy(p.text, `prompt-${idx}`)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
                    >
                      {copiedKey === `prompt-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `prompt-${idx}` ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    "{p.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-md bg-white text-zinc-950 hover:bg-zinc-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
