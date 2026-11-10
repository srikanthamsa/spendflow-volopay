import React from 'react';
import { DollarSign, Clock, CheckCircle2, CreditCard, Bot } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Total Incurred Spend",
      amount: `$${(stats.totalSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${stats.totalBills || 0} active vendor invoices`,
      icon: DollarSign,
      color: "from-blue-500/10 to-indigo-500/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Pending Approval",
      amount: `$${(stats.pendingAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${stats.pendingCount || 0} awaiting manager / CTO sign-off`,
      icon: Clock,
      color: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-500/20",
      iconColor: "text-amber-400"
    },
    {
      title: "Approved & Scheduled",
      amount: `$${(stats.approvedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${stats.approvedCount || 0} ready for Volopay payout`,
      icon: CheckCircle2,
      color: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400"
    },
    {
      title: "Paid via Volopay",
      amount: `$${(stats.paidAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${stats.paidCount || 0} completed corporate card payments`,
      icon: CreditCard,
      color: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20",
      iconColor: "text-purple-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`p-5 rounded-2xl bg-gradient-to-br ${card.color} bg-slate-900/60 border ${card.border} backdrop-blur-sm transition-all hover:translate-y-[-2px] shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-800/80 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white tracking-tight mb-1">
              {card.amount}
            </div>
            <div className="text-xs text-slate-400">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
