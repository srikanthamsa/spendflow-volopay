import React from 'react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: "Total spend",
      value: `$${(stats.totalSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      meta: `${stats.totalBills || 0} invoices recorded`
    },
    {
      label: "Pending review",
      value: `$${(stats.pendingAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      meta: `${stats.pendingCount || 0} awaiting approval`
    },
    {
      label: "Approved",
      value: `$${(stats.approvedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      meta: `${stats.approvedCount || 0} ready for settlement`
    },
    {
      label: "Settled via Volopay",
      value: `$${(stats.paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      meta: `${stats.paidCount || 0} card payouts executed`
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col justify-between"
        >
          <div className="text-xs font-normal text-zinc-400 mb-2">
            {card.label}
          </div>
          <div className="text-xl font-semibold text-zinc-100 tabular-nums tracking-tight mb-1">
            {card.value}
          </div>
          <div className="text-xs text-zinc-500 font-normal">
            {card.meta}
          </div>
        </div>
      ))}
    </div>
  );
}
