import { seed, adminSeed } from "./mock-data";

const API_BASE = import.meta.env.VITE_BANK_API_URL || "";
const MOCK = import.meta.env.VITE_USE_MOCK_API !== "false";
let token = localStorage.getItem("nexora-demo-token") || "";
const clone = value => JSON.parse(JSON.stringify(value));
let customerState = clone(seed);
let adminState = clone(adminSeed);

export function setToken(value) {
  token = value || "";
  if (token) localStorage.setItem("nexora-demo-token", token);
  else localStorage.removeItem("nexora-demo-token");
}
export function getToken() { return token; }

async function request(path, { method = "GET", body, formData = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body && !formData) headers["Content-Type"] = "application/json";
    const response = await fetch(`${API_BASE}${path}`, {
      method, headers, body: body ? (formData ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
    return payload;
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") throw new Error("The request timed out. Please try again.");
    throw error;
  } finally { clearTimeout(timer); }
}
export async function api(path, options = {}) {
  if (!MOCK && API_BASE) return request(path, options);
  await new Promise(resolve => setTimeout(resolve, 180));
  const { method = "GET", body } = options;
  const parts = path.split("?")[0].split("/").filter(Boolean);
  const key = parts[1];
  if (path === "/api/me") return { role: token.includes("admin") ? "ADMIN" : "CUSTOMER", profile: customerState.profile, applicationStatus: "APPROVED" };
  if (path === "/api/accounts") return { accounts: clone(customerState.accounts) };
  if (path.startsWith("/api/accounts/") && path.includes("/statement")) return { rows: clone(customerState.activity) };
  if (key === "beneficiaries") {
    if (method === "POST") customerState.beneficiaries.push({ id: `BEN-${Date.now()}`, ...body, status: "ACTIVE" });
    if (method === "DELETE") customerState.beneficiaries = customerState.beneficiaries.filter(x => x.id !== parts[2]);
    return { beneficiaries: clone(customerState.beneficiaries) };
  }
  if (key === "scheduled-transfers") return { items: clone(customerState.scheduled) };
  if (key === "fds") return { items: clone(customerState.fds) };
  if (key === "rds") return { items: clone(customerState.rds) };
  if (key === "loans") return { items: clone(customerState.loans) };
  if (key === "cards") return { items: clone(customerState.cards) };
  if (key === "notifications") return { items: clone(customerState.notifications) };
  if (key === "service-requests") return { items: clone(customerState.serviceRequests) };
  if (key === "tickets") return { items: clone(customerState.tickets) };
  if (path === "/api/portfolio") return { netWorthMinor: 40947500, depositsMinor: 5500000, loansMinor: 38250000, allocation: [{ label: "Savings", value: 38 }, { label: "Fixed deposits", value: 42 }, { label: "Other", value: 20 }] };
  if (path === "/api/admin/dashboard") return clone(adminState.metrics);
  if (path.startsWith("/api/admin/applications/") && method === "GET") return clone(adminState.applications.find(x => x.id === parts[3]) || adminState.applications[0]);
  if (key === "applications" && method === "GET") return { applications: clone(adminState.applications) };
  if (key === "applications" && method === "POST") {
    const app = adminState.applications.find(x => x.id === parts[2]);
    if (app) app.status = body.decision;
    return { success: true };
  }
  if (key === "customers") return { customers: clone(adminState.customers) };
  if (key === "transactions") return { transactions: clone(adminState.transactions) };
  if (key === "audit-log") return { entries: clone(adminState.audit) };
  if (key === "limits" || key === "bank" || key === "loans" || key === "requests" || key === "reports") return { items: [] };
  if (method === "POST") return { success: true, id: `DEMO-${Date.now()}` };
  return { items: [] };
}
export const isMockMode = MOCK || !API_BASE;
