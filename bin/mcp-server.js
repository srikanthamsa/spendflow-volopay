#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  approveTier,
  markAsPaid,
  getStats
} from "../data/store.js";

const server = new Server(
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

// Define tool schemas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_vendor_bill",
        description: "Creates a new vendor bill or invoice in SpendFlow with line items, department, and multi-tier approval routing. Human team members can review and edit in the SpendFlow web app.",
        inputSchema: {
          type: "object",
          properties: {
            vendorName: {
              type: "string",
              description: "Name of the vendor (e.g. 'Amazon Web Services', 'Datadog', 'Figma', 'Consultant Jane')"
            },
            invoiceNumber: {
              type: "string",
              description: "Optional vendor invoice or quote number (e.g. 'INV-2026-991')"
            },
            category: {
              type: "string",
              description: "Expense category (e.g. 'Cloud Infrastructure', 'Design Software', 'Consulting', 'Security')"
            },
            department: {
              type: "string",
              description: "Department responsible (e.g. 'Engineering', 'Product', 'Marketing', 'Finance', 'Operations')"
            },
            costCenter: {
              type: "string",
              description: "Optional cost center code (e.g. 'ENG-INFRA-01', 'PROD-UX')"
            },
            currency: {
              type: "string",
              description: "Currency code (default 'INR')."
            },
            dueDate: {
              type: "string",
              description: "Payment due date in YYYY-MM-DD format"
            },
            paymentTerms: {
              type: "string",
              description: "Payment terms (e.g. 'Net 15', 'Net 30', 'Due on Receipt')"
            },
            notes: {
              type: "string",
              description: "Notes or context extracted from user request, email, or invoice"
            },
            approverName: {
              type: "string",
              description: "Name of assigned approver (e.g. 'Rajesh Raikwar' or 'Sandeep Juttuga')"
            },
            taxRate: {
              type: "number",
              description: "Tax rate percentage (e.g. 18 for 18% GST/VAT)"
            },
            discount: {
              type: "number",
              description: "Discount amount in currency"
            },
            lineItems: {
              type: "array",
              description: "List of itemized services or products",
              items: {
                type: "object",
                properties: {
                  description: { type: "string", description: "Item description" },
                  quantity: { type: "number", description: "Quantity" },
                  unitPrice: { type: "number", description: "Unit price in currency" }
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
        description: "Lists all vendor bills in SpendFlow, with optional status and department filtering.",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by status: 'Pending Approval', 'Approved', or 'Paid'"
            },
            department: {
              type: "string",
              description: "Filter by department: 'Engineering', 'Product', 'Marketing', 'Finance', 'Operations'"
            }
          }
        }
      },
      {
        name: "get_bill",
        description: "Retrieves complete details of a specific vendor bill by ID or invoice number, including line items and approval status.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique bill ID or invoice number"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "approve_bill",
        description: "Approves a vendor bill in SpendFlow for payment routing.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique bill ID"
            },
            tierNumber: {
              type: "number",
              description: "Approval tier (1 for Department Lead, 2 for Executive/Founder). Default 1."
            },
            approverName: {
              type: "string",
              description: "Name of the person approving"
            },
            notes: {
              type: "string",
              description: "Approval justification or notes"
            }
          },
          required: ["id"]
        }
      },
      {
        name: "get_spend_summary",
        description: "Returns an aggregate summary of company spend, total bills, pending amounts, and approved amounts.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
              message: `Vendor bill for '${bill.vendorName}' successfully created in SpendFlow!`,
              billId: bill.id,
              invoiceNumber: bill.invoiceNumber,
              totalAmount: `${bill.currency} ${bill.totalAmount.toLocaleString()}`,
              dueDate: bill.dueDate,
              status: bill.status,
              lineItemsCount: bill.lineItems.length,
              webEditorUrl: `https://spendflow.trycloudflare.com/#/bill/${bill.id}`,
              actionRequired: "Human approver can now review, edit line items, and authorize payment on the SpendFlow dashboard."
            }, null, 2)
          }
        ]
      };
    }

    if (name === "list_bills") {
      let bills = getAllBills();
      if (args?.status) {
        bills = bills.filter(b => b.status.toLowerCase() === args.status.toLowerCase());
      }
      if (args?.department) {
        bills = bills.filter(b => b.department.toLowerCase() === args.department.toLowerCase());
      }
      
      const summary = bills.map(b => ({
        id: b.id,
        invoiceNumber: b.invoiceNumber,
        vendorName: b.vendorName,
        category: b.category,
        department: b.department,
        totalAmount: `${b.currency} ${b.totalAmount}`,
        dueDate: b.dueDate,
        status: b.status,
        source: b.source
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ count: summary.length, bills: summary }, null, 2)
          }
        ]
      };
    }

    if (name === "get_bill") {
      const bill = getBillById(args.id);
      if (!bill) {
        return {
          isError: true,
          content: [{ type: "text", text: `Bill with ID '${args.id}' not found.` }]
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(bill, null, 2)
          }
        ]
      };
    }

    if (name === "approve_bill") {
      const tierNumber = Number(args.tierNumber) || 1;
      const approverName = args.approverName || "Reviewer";
      const bill = approveTier(args.id, tierNumber, approverName, args.notes || "Approved via Claude MCP");
      if (!bill) {
        return {
          isError: true,
          content: [{ type: "text", text: `Bill with ID '${args.id}' not found.` }]
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: `Tier ${tierNumber} approved by ${approverName} for '${bill.vendorName}'!`,
              currentStatus: bill.status,
              totalAmount: `${bill.currency} ${bill.totalAmount}`
            }, null, 2)
          }
        ]
      };
    }

    if (name === "get_spend_summary") {
      const stats = getStats();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2)
          }
        ]
      };
    }

    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool name: ${name}` }]
    };
  } catch (error) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error executing tool '${name}': ${error.message}` }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SpendFlow MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in SpendFlow MCP Server:", error);
  process.exit(1);
});
