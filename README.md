# SpendFlow — Autonomous Spend Hub via Claude MCP
> **Built for Volopay Product & Tech Assignment**  
> Candidate: **Srikant Hamsa** (srikanthamsa@gmail.com / linkedin.com/in/srikanthamsa)  
> Submission to: **Sandeep Juttuga** (`sandeep.juttuga@volopay.co`) & **Rajesh Raikwar** (`rosh@volopay.co`)

---

## 🚀 Live Links & Deliverables

1. **Live Web App**: [https://herein-table-firmware-concord.trycloudflare.com](https://herein-table-firmware-concord.trycloudflare.com)  
   *(No login required — test credentials pre-authenticated)*
2. **GitHub Repository**: [https://github.com/srikanthamsa/spendflow-volopay](https://github.com/srikanthamsa/spendflow-volopay)
3. **MCP Remote SSE Link**: `https://herein-table-firmware-concord.trycloudflare.com/sse`
4. **Local MCP Binary**: `node bin/mcp-server.js`

---

## 💡 The Core Thesis: "Zero AI Inside Your App"

Most modern AI apps pay an LLM provider every single time a customer uses them. That destroys gross margins.

**SpendFlow does the exact opposite**:
- **Claude does the AI thinking:** The customer already pays Anthropic for Claude Pro/Team. Claude reads messy contracts, vendor quotes, and invoice emails, and extracts structured line items, payment terms, and GL accounts.
- **SpendFlow does everything else:** SpendFlow contains **zero AI inside**. No OpenAI or Anthropic API keys. It runs the state machine, maintains persistent multi-tier approval governance, enables line-item revisions by humans in the browser, and formats batches for **Volopay corporate card and multi-currency payouts**.
- **The Economics:** Our compute/hosting cost is **~$0.05 per customer/month**. We charge **$49 to $149/month** for a pure software platform with **>95% gross margins**.

---

## ⚡ 1-Minute Claude MCP Connection Guide

### Step 1: Add SpendFlow to Claude Desktop

Open your Claude Desktop configuration file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the SpendFlow MCP server configuration:

```json
{
  "mcpServers": {
    "spendflow": {
      "command": "node",
      "args": [
        "/Users/srikanthamsa/OpenBot/Agents/agent-c131999f-1e87-4206-9ebe-db75ae65235b/spendflow/bin/mcp-server.js"
      ]
    }
  }
}
```

*(Alternatively, connect Claude to the remote live SSE endpoint: `https://claims-sec-coins-petition.trycloudflare.com/sse`)*

Restart Claude Desktop. The hammer / tool icon will show `spendflow-mcp` tools available!

---

### Step 2: Try These Prompts in Claude

#### Test Prompt 1: Ingesting an AWS Cloud Bill
> *"I just got an invoice from AWS for $3,850.50 due on Dec 15th for our cloud production cluster. Create a bill for Engineering under cost center ENG-INFRA, with 2 line items: 'EC2 Compute Instances - $2,900' and 'RDS Aurora PostgreSQL - $950.50'. Assign Rosh as the final approver."*

#### Test Prompt 2: Design Contractor Scope-of-Work
> *"Create a vendor bill in SpendFlow for UI Designer Sarah Chen for $5,000 under Product. Add line item 'Design System Redesign Sprint' for $5,000 with Net 15 terms. Assign Sandeep Juttuga as approver."*

#### Test Prompt 3: Inquiring Company Spend
> *"What is our company's current pending spend in SpendFlow? List all bills awaiting approval."*

---

## 🎬 5-Minute Video Pitch Script (For Srikant Hamsa)

Below is the scripted pitch covering all 5 required sections within the 5-minute limit:

### 1. Who You Are (0:00 - 0:45 | 45 seconds)
> *"Hi Sandeep, Rosh, and the Volopay team. I'm Srikant Hamsa. I'm a Product Analyst with over two years of experience taking 0-to-1 fintech products from initial PRD to production.*  
> *I graduated from VIT with an Integrated MTech in Computer Science, and my focus has always been bridging product strategy with hands-on execution. I love solving the messy operational problems that finance and ops teams deal with every single day."*

### 2. Your Best Work (0:45 - 1:15 | 30 seconds)
> *"At WeRize, I owned the 0-to-1 launch of Customer Finder — an eligibility screening engine where 4,000+ DSA partners screened over 500,000 contacts, directly driving 120+ credit disbursals. I also built internal mini-CRMs and workflow portals adopted daily by 500+ operations and credit staff, replacing manual spreadsheets. I know what it takes to build tools people actually rely on to move money."*

### 3. Why This Business Will Win (1:15 - 2:15 | 60 seconds)
> *"Every growing business uses tools like Volopay for corporate cards and payouts. But before a payment happens, there's a huge operational bottleneck: vendor quotes, invoices, and contracts land in messy emails and PDFs. Finance managers waste hours manually re-keying line items and chasing department leads for approval.*  
> *Existing bill-pay software charges expensive per-seat fees and bloated AI addon costs.*  
> *SpendFlow solves this with a radical architecture: we put zero AI inside our app. The customer already pays $20/month for Claude. They connect Claude via MCP; Claude does 100% of the extraction and structuring. SpendFlow provides the persistent, multi-tenant state machine, real-time line item editor, approval routing, and 1-click Volopay payout dispatch.*  
> *Claude can't stay live on the web or manage multi-tier approvals after a chat ends. SpendFlow turns Claude's thoughts into an enterprise-grade financial workflow."*

### 4. Live Demo Walkthrough (2:15 - 4:15 | 120 seconds)
> 1. *Show Claude Desktop: Paste in a prompt or sample quote from Datadog/AWS.*
> 2. *Show Claude invoking `create_vendor_bill` via MCP.*
> 3. *Switch to SpendFlow web dashboard: Point out the newly created bill appearing with 'Claude MCP' badge.*
> 4. *Open the Bill Editor modal:*
>    - *Show editable line items: increase a quantity, add a line item, watch subtotal and total auto-calculate.*
>    - *Show the Approval Matrix: click 'Approve Tier 1' as Srikant (Manager), then 'Approve Tier 2' as Rosh (CTO).*
>    - *Show the Volopay Corporate Card settlement button and Audit Log trail.*
>    - *Download the Volopay batch payout CSV.*

### 5. The Money & Unit Economics (4:15 - 5:00 | 45 seconds)
> *"Our unit economics are unbeatable. Because we offload all LLM token costs to the customer's Claude subscription, our hosting cost is under $0.05 per customer per month.*  
> *We charge $49/month for startups and $149/month for growth teams needing multi-tier approvals. That's over 95% gross margins.*  
> *To get our first 100 customers ($10k MRR), we target YC startups and tech SMBs who already use Claude and need structured AP governance without enterprise bloat.*  
> *By Year 3, with 1,500 customers and deep integration into fintech platforms like Volopay, SpendFlow reaches $2.5M ARR with almost zero marginal COGS.*  
> *Thank you, and I look forward to discussing this with the Volopay team!"*

---

## 🛠 Tech Stack (Zero AI Inside)

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Backend:** Node.js (v26), Express 5, Model Context Protocol (MCP) SDK v1.32
- **Transport Protocols:**
  - `stdio` JSON-RPC 2.0 (for native Claude Desktop)
  - `HTTP Server-Sent Events (SSE)` (for remote web clients)
- **Data Persistence:** Atomic JSON store with full immutable audit logging
- **Hosting / Tunnel:** Cloudflare Quick Tunnel (`claims-sec-coins-petition.trycloudflare.com`)
