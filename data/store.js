import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'bills.json');

const INITIAL_BILLS = [
  {
    id: "bill-aws-2026",
    invoiceNumber: "INV-AWS-88291",
    vendorName: "Amazon Web Services (AWS)",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    category: "Cloud Infrastructure",
    department: "Engineering",
    costCenter: "ENG-INFRA-01",
    currency: "INR",
    issueDate: "2026-11-01",
    dueDate: "2026-11-25",
    paymentTerms: "Net 25",
    status: "Pending Approval",
    source: "Claude MCP",
    notes: "Monthly production compute and database cluster. Claude extracted this from AWS billing email summary.",
    lineItems: [
      { id: "li-1", description: "EC2 m6i.4xlarge Production Kubernetes Nodes", quantity: 6, unitPrice: 35000.00, total: 210000.00 },
      { id: "li-2", description: "Amazon Aurora PostgreSQL Multi-AZ Cluster", quantity: 1, unitPrice: 70000.00, total: 70000.00 },
      { id: "li-3", description: "CloudFront CDN Data Transfer (14TB)", quantity: 14, unitPrice: 2500.00, total: 35000.00 }
    ],
    taxRate: 18.0,
    discount: 0.0,
    subtotal: 315000.00,
    totalAmount: 371700.00,
    approvalTiers: [
      {
        tier: 1,
        role: "Department Manager",
        approverName: "Srikant Hamsa",
        status: "Approved",
        approvedAt: "2026-11-05T10:15:00Z",
        notes: "Verified against sprint cloud capacity plan."
      },
      {
        tier: 2,
        role: "CTO / Executive",
        approverName: "Rajesh Raikwar",
        status: "Pending",
        approvedAt: null,
        notes: null
      }
    ],
    auditLog: [
      {
        id: "log-1",
        timestamp: "2026-11-02T08:30:00Z",
        actor: "Claude MCP Assistant",
        action: "Created Bill",
        details: "Parsed AWS statement and ingested 3 line items via create_vendor_bill MCP tool."
      },
      {
        id: "log-2",
        timestamp: "2026-11-05T10:15:00Z",
        actor: "Srikant Hamsa",
        action: "Tier 1 Approval Granted",
        details: "Manager approval confirmed."
      }
    ],
    createdAt: "2026-11-02T08:30:00Z",
    updatedAt: "2026-11-05T10:15:00Z"
  },
  {
    id: "bill-datadog-2026",
    invoiceNumber: "DD-94812",
    vendorName: "Datadog, Inc.",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Datadog_logo.svg",
    category: "Observability & APM",
    department: "Engineering",
    costCenter: "ENG-OPS",
    currency: "INR",
    issueDate: "2026-11-03",
    dueDate: "2026-11-30",
    paymentTerms: "Net 30",
    status: "Pending Approval",
    source: "Claude MCP",
    notes: "Annual telemetry and log analytics renewal quote.",
    lineItems: [
      { id: "li-dd1", description: "Pro APM Host Monitoring (50 hosts)", quantity: 50, unitPrice: 2500.00, total: 125000.00 },
      { id: "li-dd2", description: "Log Management Retention (15-day indexed)", quantity: 1, unitPrice: 53000.00, total: 53000.00 }
    ],
    taxRate: 18.0,
    discount: 8000.00,
    subtotal: 178000.00,
    totalAmount: 202040.00,
    approvalTiers: [
      {
        tier: 1,
        role: "Engineering Lead",
        approverName: "Rajesh Raikwar",
        status: "Pending",
        approvedAt: null,
        notes: null
      }
    ],
    auditLog: [
      {
        id: "log-dd1",
        timestamp: "2026-11-03T11:00:00Z",
        actor: "Claude MCP Assistant",
        action: "Created Bill",
        details: "Parsed renewal quote and applied volume discount via MCP."
      }
    ],
    createdAt: "2026-11-03T11:00:00Z",
    updatedAt: "2026-11-03T11:00:00Z"
  },
  {
    id: "bill-figma-2026",
    invoiceNumber: "FIG-2026-441",
    vendorName: "Figma (Adobe)",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    category: "Design Software",
    department: "Product",
    costCenter: "PROD-DESIGN",
    currency: "INR",
    issueDate: "2026-10-28",
    dueDate: "2026-11-15",
    paymentTerms: "Net 15",
    status: "Approved",
    source: "Human User",
    notes: "Design seats renewal for Q4 product redesign.",
    lineItems: [
      { id: "li-f1", description: "Figma Enterprise Design Seats", quantity: 8, unitPrice: 6200.00, total: 49600.00 },
      { id: "li-f2", description: "FigJam Whiteboard Collaborative Seats", quantity: 15, unitPrice: 420.00, total: 6300.00 }
    ],
    taxRate: 18.0,
    discount: 0.0,
    subtotal: 55900.00,
    totalAmount: 65962.00,
    approvalTiers: [
      {
        tier: 1,
        role: "Product Lead",
        approverName: "Sandeep Juttuga",
        status: "Approved",
        approvedAt: "2026-10-30T14:20:00Z",
        notes: "Approved for product team roadmap work."
      }
    ],
    auditLog: [
      {
        id: "log-f1",
        timestamp: "2026-10-28T09:00:00Z",
        actor: "Srikant Hamsa",
        action: "Created Bill",
        details: "Created manually for design software licensing."
      },
      {
        id: "log-f2",
        timestamp: "2026-10-30T14:20:00Z",
        actor: "Sandeep Juttuga",
        action: "Approval Granted",
        details: "Founder office approval confirmed."
      }
    ],
    createdAt: "2026-10-28T09:00:00Z",
    updatedAt: "2026-10-30T14:20:00Z"
  },
  {
    id: "bill-stripe-2026",
    invoiceNumber: "STRIPE-FEE-1029",
    vendorName: "Stripe Technology Inc.",
    vendorLogo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    category: "Payment Processing",
    department: "Finance",
    costCenter: "FIN-OPS",
    currency: "INR",
    issueDate: "2026-10-15",
    dueDate: "2026-10-30",
    paymentTerms: "Due on Receipt",
    status: "Paid",
    source: "Claude MCP",
    notes: "Card processing gateway platform fees for October.",
    lineItems: [
      { id: "li-s1", description: "Merchant Gateway Settlement Charges (Volopay Corporate Card)", quantity: 1, unitPrice: 116000.00, total: 116000.00 }
    ],
    taxRate: 18.0,
    discount: 0.0,
    subtotal: 116000.00,
    totalAmount: 136880.00,
    approvalTiers: [
      {
        tier: 1,
        role: "Head of Finance",
        approverName: "Sandeep Juttuga",
        status: "Approved",
        approvedAt: "2026-10-18T16:00:00Z",
        notes: "Approved."
      }
    ],
    auditLog: [
      {
        id: "log-s1",
        timestamp: "2026-10-15T08:00:00Z",
        actor: "Claude MCP Assistant",
        action: "Created Bill",
        details: "Auto-ingested from Stripe merchant invoice PDF."
      },
      {
        id: "log-s2",
        timestamp: "2026-10-25T11:45:00Z",
        actor: "Finance Ops",
        action: "Dispatched Payment",
        details: "Paid via Volopay Virtual Corporate Card (*4491)."
      }
    ],
    createdAt: "2026-10-15T08:00:00Z",
    updatedAt: "2026-10-25T11:45:00Z"
  }
];

function ensureDataFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_BILLS, null, 2), 'utf-8');
}

export function getAllBills() {
  if (!fs.existsSync(DATA_FILE)) {
    ensureDataFile();
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data file:", err);
    return INITIAL_BILLS;
  }
}

export function saveBills(bills) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bills, null, 2), 'utf-8');
}

export function getBillById(id) {
  const bills = getAllBills();
  return bills.find(b => b.id === id || b.invoiceNumber.toLowerCase() === id.toLowerCase()) || null;
}

export function calculateTotals(lineItems = [], taxRate = 0, discount = 0) {
  const subtotal = lineItems.reduce((acc, item) => {
    const itemTotal = (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0);
    return acc + itemTotal;
  }, 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));
  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2))
  };
}

export function createBill(data, source = "Claude MCP") {
  const bills = getAllBills();
  const id = `bill-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  
  const rawLineItems = Array.isArray(data.lineItems) && data.lineItems.length > 0 
    ? data.lineItems 
    : [{ description: data.description || "Vendor Services", quantity: 1, unitPrice: Number(data.totalAmount) || 0 }];

  const lineItems = rawLineItems.map((li, idx) => {
    const qty = Number(li.quantity) || 1;
    const price = Number(li.unitPrice) || 0;
    return {
      id: `li-${idx + 1}-${Date.now().toString(36)}`,
      description: li.description || "Line Item",
      quantity: qty,
      unitPrice: price,
      total: Number((qty * price).toFixed(2))
    };
  });

  const taxRate = Number(data.taxRate) || 0;
  const discount = Number(data.discount) || 0;
  const { subtotal, totalAmount } = calculateTotals(lineItems, taxRate, discount);

  const defaultApprovers = [
    {
      tier: 1,
      role: "Department Lead",
      approverName: data.approverName || (data.department === "Engineering" ? "Rajesh Raikwar" : "Srikant Hamsa"),
      status: "Pending",
      approvedAt: null,
      notes: null
    }
  ];

  if (totalAmount > 250000) {
    defaultApprovers.push({
      tier: 2,
      role: "Executive / Founder Approval",
      approverName: "Sandeep Juttuga",
      status: "Pending",
      approvedAt: null,
      notes: null
    });
  }

  const now = new Date().toISOString();
  const newBill = {
    id,
    invoiceNumber: data.invoiceNumber || `INV-${Math.floor(10000 + Math.random() * 90000)}`,
    vendorName: data.vendorName || "Vendor Co.",
    vendorLogo: data.vendorLogo || null,
    category: data.category || "General Operations",
    department: data.department || "Operations",
    costCenter: data.costCenter || `${(data.department || "OPS").toUpperCase().substring(0, 3)}-GEN`,
    currency: "INR",
    issueDate: data.issueDate || now.split('T')[0],
    dueDate: data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    paymentTerms: data.paymentTerms || "Net 14",
    status: data.status || "Pending Approval",
    source,
    notes: data.notes || (source === "Claude MCP" ? "Ingested and structured automatically via Claude MCP." : "Created manually."),
    lineItems,
    taxRate,
    discount,
    subtotal,
    totalAmount,
    approvalTiers: Array.isArray(data.approvalTiers) && data.approvalTiers.length > 0 ? data.approvalTiers : defaultApprovers,
    auditLog: [
      {
        id: `log-${Date.now().toString(36)}`,
        timestamp: now,
        actor: source,
        action: "Created Bill",
        details: `Created invoice with ${lineItems.length} line items totaling ₹${totalAmount.toLocaleString('en-IN')}.`
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  bills.unshift(newBill);
  saveBills(bills);
  return newBill;
}

export function updateBill(id, updates, actor = "Human User") {
  const bills = getAllBills();
  const index = bills.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = bills[index];
  const now = new Date().toISOString();

  let lineItems = current.lineItems;
  if (Array.isArray(updates.lineItems)) {
    lineItems = updates.lineItems.map((li, idx) => {
      const qty = Number(li.quantity) || 1;
      const price = Number(li.unitPrice) || 0;
      return {
        id: li.id || `li-${idx + 1}-${Date.now().toString(36)}`,
        description: li.description || "Line Item",
        quantity: qty,
        unitPrice: price,
        total: Number((qty * price).toFixed(2))
      };
    });
  }

  const taxRate = updates.taxRate !== undefined ? Number(updates.taxRate) : current.taxRate;
  const discount = updates.discount !== undefined ? Number(updates.discount) : current.discount;
  const { subtotal, totalAmount } = calculateTotals(lineItems, taxRate, discount);

  const auditDetails = [];
  if (updates.vendorName && updates.vendorName !== current.vendorName) auditDetails.push(`Vendor changed to ${updates.vendorName}`);
  if (updates.totalAmount && updates.totalAmount !== current.totalAmount) auditDetails.push(`Amount updated to ₹${totalAmount.toLocaleString('en-IN')}`);
  if (updates.status && updates.status !== current.status) auditDetails.push(`Status updated to ${updates.status}`);

  const logEntry = {
    id: `log-${Date.now().toString(36)}`,
    timestamp: now,
    actor,
    action: "Updated Bill",
    details: auditDetails.length > 0 ? auditDetails.join("; ") : "Line items and details updated in web editor."
  };

  const updatedBill = {
    ...current,
    ...updates,
    currency: "INR",
    lineItems,
    taxRate,
    discount,
    subtotal,
    totalAmount,
    updatedAt: now,
    auditLog: [logEntry, ...(current.auditLog || [])]
  };

  bills[index] = updatedBill;
  saveBills(bills);
  return updatedBill;
}

export function approveTier(id, tierNumber, approverName, notes = "") {
  const bills = getAllBills();
  const index = bills.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = bills[index];
  const now = new Date().toISOString();

  let allApproved = true;
  const updatedTiers = current.approvalTiers.map(t => {
    if (t.tier === tierNumber) {
      return {
        ...t,
        status: "Approved",
        approvedAt: now,
        notes: notes || t.notes || "Approved via SpendFlow"
      };
    }
    if (t.status !== "Approved") allApproved = false;
    return t;
  });

  const newStatus = allApproved ? "Approved" : "Pending Approval";

  const logEntry = {
    id: `log-${Date.now().toString(36)}`,
    timestamp: now,
    actor: approverName || "Reviewer",
    action: `Approved Tier ${tierNumber}`,
    details: `Tier ${tierNumber} approved. ${allApproved ? "All approval tiers satisfied -> Ready for Payment." : "Waiting for remaining tiers."}`
  };

  const updatedBill = {
    ...current,
    status: newStatus,
    approvalTiers: updatedTiers,
    updatedAt: now,
    auditLog: [logEntry, ...(current.auditLog || [])]
  };

  bills[index] = updatedBill;
  saveBills(bills);
  return updatedBill;
}

export function markAsPaid(id, paymentMethod = "Volopay Corporate Card (*4491)", actor = "Finance Operations") {
  const bills = getAllBills();
  const index = bills.findIndex(b => b.id === id);
  if (index === -1) return null;

  const current = bills[index];
  const now = new Date().toISOString();

  const logEntry = {
    id: `log-${Date.now().toString(36)}`,
    timestamp: now,
    actor,
    action: "Payment Dispatched",
    details: `Dispatched payment of ₹${current.totalAmount.toLocaleString('en-IN')} via ${paymentMethod}.`
  };

  const updatedBill = {
    ...current,
    status: "Paid",
    paidAt: now,
    paymentMethod,
    updatedAt: now,
    auditLog: [logEntry, ...(current.auditLog || [])]
  };

  bills[index] = updatedBill;
  saveBills(bills);
  return updatedBill;
}

export function deleteBill(id) {
  const bills = getAllBills();
  const filtered = bills.filter(b => b.id !== id);
  if (filtered.length === bills.length) return false;
  saveBills(filtered);
  return true;
}

export function getStats() {
  const bills = getAllBills();
  const totalSpend = bills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const pendingBills = bills.filter(b => b.status === "Pending Approval");
  const approvedBills = bills.filter(b => b.status === "Approved");
  const paidBills = bills.filter(b => b.status === "Paid");

  const pendingAmount = pendingBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const approvedAmount = approvedBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const paidAmount = paidBills.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return {
    totalBills: bills.length,
    totalSpend: Number(totalSpend.toFixed(2)),
    pendingCount: pendingBills.length,
    pendingAmount: Number(pendingAmount.toFixed(2)),
    approvedCount: approvedBills.length,
    approvedAmount: Number(approvedAmount.toFixed(2)),
    paidCount: paidBills.length,
    paidAmount: Number(paidAmount.toFixed(2)),
    claudeCreatedCount: bills.filter(b => b.source === "Claude MCP").length
  };
}
