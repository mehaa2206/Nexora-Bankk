export const seed = {
  profile: { id: "CUS-20481", name: "Aarav Mehta", email: "aarav.mehta@example.com", phone: "+91 98765 43210", address: "Adyar, Chennai, Tamil Nadu", pan: "ABCDE1234F", aadhaar: "XXXX XXXX 4821", customerSince: "12 Mar 2024" },
  accounts: [
    { id: "NX-SB-001284", accountNumber: "XXXX XXXX 1284", type: "Savings Account", balanceMinor: 2847500, availableMinor: 2797500, status: "ACTIVE" },
    { id: "NX-CU-008921", accountNumber: "XXXX XXXX 8921", type: "Current Account", balanceMinor: 12500000, availableMinor: 12500000, status: "ACTIVE" }
  ],
  activity: [
    { id: "TXN-80241", date: "23 Nov 2026", description: "Salary Credit · Acme Technologies", category: "Income", amountMinor: 8500000, type: "CREDIT", status: "COMPLETED" },
    { id: "TXN-80240", date: "22 Nov 2026", description: "UPI · Grocery Store", category: "Shopping", amountMinor: 245000, type: "DEBIT", status: "COMPLETED" },
    { id: "TXN-80239", date: "21 Nov 2026", description: "Electricity Bill", category: "Utilities", amountMinor: 184500, type: "DEBIT", status: "COMPLETED" },
    { id: "TXN-80238", date: "20 Nov 2026", description: "Transfer · Priya Sharma", category: "Transfer", amountMinor: 125000, type: "DEBIT", status: "COMPLETED" },
    { id: "TXN-80237", date: "18 Nov 2026", description: "FD Interest Credit", category: "Deposit", amountMinor: 32000, type: "CREDIT", status: "COMPLETED" }
  ],
  beneficiaries: [
    { id: "BEN-01", name: "Priya Sharma", bank: "HDFC Bank", account: "XXXXXX4521", ifsc: "HDFC0001234", status: "ACTIVE" },
    { id: "BEN-02", name: "Rahul Verma", bank: "ICICI Bank", account: "XXXXXX7812", ifsc: "ICIC0000456", status: "ACTIVE" }
  ],
  scheduled: [{ id: "SCH-01", beneficiary: "Priya Sharma", amountMinor: 250000, frequency: "Monthly", nextDate: "01 Dec 2026", status: "ACTIVE" }],
  fds: [{ id: "FD-1024", principalMinor: 5000000, rate: 7.1, tenure: "24 months", maturity: "14 Jun 2027", status: "ACTIVE" }],
  rds: [{ id: "RD-2088", installmentMinor: 500000, rate: 6.8, tenure: "12 months", status: "ACTIVE" }],
  loans: [{ id: "LN-1007", type: "Personal Loan", principalMinor: 50000000, outstandingMinor: 38250000, rate: 10.5, tenure: "36 months", status: "ACTIVE" }],
  cards: [{ id: "CARD-4821", type: "Visa Platinum Debit", number: "XXXX XXXX XXXX 4821", status: "ACTIVE", dailyLimitMinor: 5000000 }],
  notifications: [{ id: "NTF-01", title: "Your statement is ready", detail: "October 2026 account statement is available.", date: "22 Nov 2026", read: false }, { id: "NTF-02", title: "Fixed deposit renewed", detail: "Your FD instruction was saved successfully.", date: "18 Nov 2026", read: true }],
  tickets: [{ id: "TKT-204", subject: "Update registered mobile number", category: "Profile", status: "IN_PROGRESS", date: "20 Nov 2026" }],
  serviceRequests: [{ id: "SR-1001", type: "Cheque book", status: "PROCESSING", date: "19 Nov 2026" }]
};
export const adminSeed = {
  metrics: { customers: 1284, pending: 24, activeAccounts: 1198, transferVolumeMinor: 8456200000, loansPending: 8, flagged: 3 },
  applications: [
    { id: "APP-3108", name: "Ananya Iyer", email: "ananya.iyer@example.com", submitted: "23 Nov 2026", status: "PENDING", accountType: "Savings" },
    { id: "APP-3107", name: "Karthik Raman", email: "karthik.r@example.com", submitted: "22 Nov 2026", status: "PENDING", accountType: "Savings" },
    { id: "APP-3106", name: "Divya Nair", email: "divya.nair@example.com", submitted: "21 Nov 2026", status: "HOLD", accountType: "Current" }
  ],
  customers: [
    { id: "CUS-20481", name: "Aarav Mehta", email: "aarav.mehta@example.com", account: "XXXX 1284", status: "ACTIVE", balanceMinor: 2847500 },
    { id: "CUS-20480", name: "Riya Kapoor", email: "riya.k@example.com", account: "XXXX 9082", status: "ACTIVE", balanceMinor: 1845000 },
    { id: "CUS-20479", name: "Dev Patel", email: "dev.p@example.com", account: "XXXX 1138", status: "FROZEN", balanceMinor: 720000 }
  ],
  transactions: [
    { id: "TR-8812", customer: "Aarav Mehta", amountMinor: 12500000, route: "Interbank", status: "MANUAL_REVIEW", date: "23 Nov 2026" },
    { id: "TR-8811", customer: "Riya Kapoor", amountMinor: 450000, route: "Internal", status: "COMPLETED", date: "23 Nov 2026" }
  ],
  audit: [{ id: "AUD-501", actor: "admin@nexora.bank", action: "Updated default transfer limit", date: "23 Nov 2026 10:42" }, { id: "AUD-500", actor: "admin@nexora.bank", action: "Reviewed application APP-3106", date: "22 Nov 2026 16:10" }]
};
