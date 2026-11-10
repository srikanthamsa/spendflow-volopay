import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  approveTier,
  markAsPaid,
  deleteBill,
  getStats
} from './data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set up the shared MCP server instance for SSE
function createMcpServerInstance() {
  const mcpServer = new Server(
    {
      name: "spendflow-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "create_vendor_bill",
          description: "Creates a new vendor bill or invoice in SpendFlow with itemized breakdown, department, and multi-tier approval routing.",
          inputSchema: {
            type: "object",
            properties: {
              vendorName: { type: "string", description: "Vendor / company name" },
              invoiceNumber: { type: "string", description: "Invoice or quote ID" },
              category: { type: "string", description: "Expense category" },
              department: { type: "string", description: "Department (Engineering, Product, Marketing, Finance, Operations)" },
              costCenter: { type: "string", description: "Cost center code (e.g. ENG-INFRA)" },
              currency: { type: "string", description: "Currency code (USD, EUR, INR, SGD)" },
              dueDate: { type: "string", description: "Due date YYYY-MM-DD" },
              paymentTerms: { type: "string", description: "Payment terms (e.g. Net 15, Net 30)" },
              notes: { type: "string", description: "Summary or context extracted from text" },
              approverName: { type: "string", description: "Designated approver name" },
              taxRate: { type: "number", description: "Tax rate %" },
              discount: { type: "number", description: "Discount amount" },
              lineItems: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    description: { type: "string" },
                    quantity: { type: "number" },
                    unitPrice: { type: "number" }
                  },
                  required: ["description", "quantity", "unitPrice"]
                }
              }
            },
            required: ["vendorName"]
          }
        },
        {
          name: "list_bills",
          description: "Lists all vendor bills in SpendFlow with statuses and amounts.",
          inputSchema: {
            type: "object",
            properties: {
              status: { type: "string", description: "Filter by status" },
              department: { type: "string", description: "Filter by department" }
            }
          }
        },
        {
          name: "get_bill",
          description: "Get full details of a specific bill by ID or invoice number.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Bill ID or invoice number" }
            },
            required: ["id"]
          }
        },
        {
          name: "approve_bill",
          description: "Approves a vendor bill in SpendFlow for payout routing.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Bill ID" },
              tierNumber: { type: "number", description: "Tier number (default 1)" },
              approverName: { type: "string", description: "Approver name" },
              notes: { type: "string", description: "Approval notes" }
            },
            required: ["id"]
          }
        },
        {
          name: "get_spend_summary",
          description: "Returns company-wide spend analytics and counts.",
          inputSchema: { type: "object", properties: {} }
        }
      ]
    };
  });

  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      if (name === "create_vendor_bill") {
        const bill = createBill(args, "Claude MCP");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `Bill for '${bill.vendorName}' created in SpendFlow!`,
                billId: bill.id,
                invoiceNumber: bill.invoiceNumber,
                totalAmount: `${bill.currency} ${bill.totalAmount.toLocaleString()}`,
                dueDate: bill.dueDate,
                status: bill.status,
                action: "Reviewable and editable immediately on the SpendFlow dashboard."
              }, null, 2)
            }
          ]
        };
      }

      if (name === "list_bills") {
        let bills = getAllBills();
        if (args?.status) bills = bills.filter(b => b.status.toLowerCase() === args.status.toLowerCase());
        if (args?.department) bills = bills.filter(b => b.department.toLowerCase() === args.department.toLowerCase());
        return {
          content: [{ type: "text", text: JSON.stringify(bills.map(b => ({ id: b.id, vendor: b.vendorName, amount: `${b.currency} ${b.totalAmount}`, status: b.status })), null, 2) }]
        };
      }

      if (name === "get_bill") {
        const bill = getBillById(args.id);
        if (!bill) return { isError: true, content: [{ type: "text", text: `Bill ${args.id} not found.` }] };
        return { content: [{ type: "text", text: JSON.stringify(bill, null, 2) }] };
      }

      if (name === "approve_bill") {
        const bill = approveTier(args.id, Number(args.tierNumber) || 1, args.approverName || "Claude Approver", args.notes || "Approved");
        if (!bill) return { isError: true, content: [{ type: "text", text: `Bill ${args.id} not found.` }] };
        return { content: [{ type: "text", text: JSON.stringify({ success: true, status: bill.status }, null, 2) }] };
      }

      if (name === "get_spend_summary") {
        return { content: [{ type: "text", text: JSON.stringify(getStats(), null, 2) }] };
      }

      return { isError: true, content: [{ type: "text", text: `Unknown tool: ${name}` }] };
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: err.message }] };
    }
  });

  return mcpServer;
}

// Map to hold active SSE transports
const sseTransports = new Map();

// MCP SSE endpoint
app.get('/sse', async (req, res) => {
  const mcpServer = createMcpServerInstance();
  const transport = new SSEServerTransport('/messages', res);
  sseTransports.set(transport.sessionId, transport);

  res.on('close', () => {
    sseTransports.delete(transport.sessionId);
  });

  await mcpServer.connect(transport);
});

// MCP Messages POST endpoint
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = sseTransports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).json({ error: 'SSE session not found or expired' });
  }
});

// --- REST API for Web App ---

// List all bills
app.get('/api/bills', (req, res) => {
  const bills = getAllBills();
  res.json({ bills });
});

// Get single bill
app.get('/api/bills/:id', (req, res) => {
  const bill = getBillById(req.params.id);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  res.json({ bill });
});

// Create bill (manual or from API)
app.post('/api/bills', (req, res) => {
  const bill = createBill(req.body, req.body.source || 'Human User');
  res.status(201).json({ bill });
});

// Update bill (line items, details, vendor)
app.put('/api/bills/:id', (req, res) => {
  const updated = updateBill(req.params.id, req.body, req.body.actor || 'Human User');
  if (!updated) return res.status(404).json({ error: 'Bill not found' });
  res.json({ bill: updated });
});

// Delete bill
app.delete('/api/bills/:id', (req, res) => {
  const success = deleteBill(req.params.id);
  if (!success) return res.status(404).json({ error: 'Bill not found' });
  res.json({ success: true });
});

// Approve tier
app.post('/api/bills/:id/approve', (req, res) => {
  const { tierNumber = 1, approverName = 'Approver', notes = '' } = req.body;
  const updated = approveTier(req.params.id, Number(tierNumber), approverName, notes);
  if (!updated) return res.status(404).json({ error: 'Bill not found' });
  res.json({ bill: updated });
});

// Mark paid
app.post('/api/bills/:id/pay', (req, res) => {
  const { paymentMethod = 'Volopay Corporate Card (*4491)', actor = 'Finance Ops' } = req.body;
  const updated = markAsPaid(req.params.id, paymentMethod, actor);
  if (!updated) return res.status(404).json({ error: 'Bill not found' });
  res.json({ bill: updated });
});

// Stats summary
app.get('/api/stats', (req, res) => {
  res.json(getStats());
});

// Volopay Batch Payout Export (Standard CSV)
app.get('/api/export/volopay', (req, res) => {
  const bills = getAllBills().filter(b => b.status === 'Approved' || b.status === 'Paid');
  const headers = ['Invoice Number', 'Beneficiary / Vendor', 'Category', 'Department', 'Currency', 'Amount', 'Due Date', 'Status', 'Payment Method'];
  const rows = bills.map(b => [
    `"${b.invoiceNumber}"`,
    `"${b.vendorName}"`,
    `"${b.category}"`,
    `"${b.department}"`,
    `"${b.currency}"`,
    b.totalAmount.toFixed(2),
    `"${b.dueDate}"`,
    `"${b.status}"`,
    `"${b.paymentMethod || 'Volopay Multi-Currency Payout'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="volopay_batch_payout.csv"');
  res.send(csvContent);
});

// Simulate Claude MCP Action (for immediate 1-click in-browser demo)
app.post('/api/simulate-claude', (req, res) => {
  const samples = [
    {
      vendorName: "Snowflake Computing",
      invoiceNumber: `SNOW-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "Data Warehouse",
      department: "Engineering",
      costCenter: "ENG-DATA-02",
      currency: "USD",
      dueDate: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      paymentTerms: "Net 30",
      notes: "Parsed from email sent to finance@company.com: Q4 data warehouse compute credits consumption.",
      approverName: "Rajesh Raikwar",
      taxRate: 0.0,
      discount: 250.00,
      lineItems: [
        { description: "Standard Enterprise Compute Warehouse Credits (500 credits)", quantity: 500, unitPrice: 3.00 },
        { description: "Serverless Snowpipe Streaming Ingestion", quantity: 1, unitPrice: 450.00 }
      ]
    },
    {
      vendorName: "HubSpot Marketing Hub",
      invoiceNumber: `HS-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "Marketing Automation",
      department: "Marketing",
      costCenter: "MKTG-GROWTH",
      currency: "USD",
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      paymentTerms: "Net 15",
      notes: "Extracted from marketing team vendor quote: Annual contact tier expansion for 25,000 marketing leads.",
      approverName: "Sandeep Juttuga",
      taxRate: 0.0,
      discount: 0.0,
      lineItems: [
        { description: "Marketing Hub Professional (Annual Subscription)", quantity: 1, unitPrice: 890.00 },
        { description: "Dedicated Transactional Email IP Address", quantity: 1, unitPrice: 300.00 }
      ]
    },
    {
      vendorName: "CrowdStrike Falcon",
      invoiceNumber: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
      category: "Cybersecurity & Compliance",
      department: "Engineering",
      costCenter: "ENG-SEC",
      currency: "USD",
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      paymentTerms: "Net 15",
      notes: "Extracted via Claude MCP from SOC2 compliance vendor audit request.",
      approverName: "Rajesh Raikwar",
      taxRate: 0.0,
      discount: 150.00,
      lineItems: [
        { description: "Falcon Endpoint Protection Complete (40 Endpoints)", quantity: 40, unitPrice: 45.00 },
        { description: "Identity Threat Protection Addon", quantity: 1, unitPrice: 500.00 }
      ]
    }
  ];

  const chosen = samples[Math.floor(Math.random() * samples.length)];
  const bill = createBill(chosen, "Claude MCP");
  res.json({ success: true, bill, message: `Simulated Claude MCP request successfully created bill for '${bill.vendorName}'!` });
});

// Serve frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SpendFlow Web & MCP Server running at http://localhost:${PORT}`);
  console.log(`- Web App: http://localhost:${PORT}`);
  console.log(`- MCP SSE Endpoint: http://localhost:${PORT}/sse`);
});
