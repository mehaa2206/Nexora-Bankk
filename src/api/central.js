// Connection to the central banking system (the SharedBank switch, a Cloudflare Worker).
// It builds on the untouched ../live-api.js helper and exposes ONE shared session to the whole portal,
// so a customer signs in once and every page reads the same live accounts and transfers.
import { useCallback, useEffect, useRef, useState } from "react";
import { configuredEndpoint, liveApi, readStorage, saveStorage } from "../live-api";

const SESSION_KEY = "nexora-central-session";
const EMPTY = { accounts: [], transfers: [] };
const POLL_MS = 12_000;

export const centralEndpoint = configuredEndpoint;

export const time = value => value ? new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata",
}).format(new Date(value)) : "—";

export const rejectionNames = {
  INSUFFICIENT_FUNDS: "Insufficient available balance",
  LIMIT_EXCEEDED: "Transfer limit exceeded",
  DESTINATION_ACCOUNT_UNAVAILABLE: "The destination is unavailable",
};

export const bankName = (directory, id) => directory.find(b => b.bankId === id)?.bankName || id;

// Turns central-bank transfers into the row shape used by the UI's ActivityTable.
export function activityRows(transfers, directory) {
  return transfers.map(t => {
    const credit = t.direction === "CREDIT";
    const other = bankName(directory, credit ? t.sourceBankId : t.destinationBankId);
    return {
      id: t.transferId,
      date: time(t.createdAt),
      description: (credit ? "Received from " : "Transfer to ") + other + (t.type === "INTERNAL" ? " (same bank)" : ""),
      category: t.type === "INTERNAL" ? "Same bank" : "Interbank",
      amountMinor: t.amountMinor,
      type: credit ? "CREDIT" : "DEBIT",
      status: t.status,
      code: t.code,
      route: bankName(directory, t.sourceBankId) + " → " + bankName(directory, t.destinationBankId),
    };
  });
}

// crypto.subtle / randomUUID only exist on secure origins (https or localhost); fall back so the
// portal still works when the dev server is opened over a LAN IP.
async function sha256Hex(text) {
  if (globalThis.crypto?.subtle) {
    const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
    return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return "weak" + (h >>> 0).toString(16);
}
function uuid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
}

export function useCentralBank(bank) {
  const base = centralEndpoint;
  const prefix = "/banks/" + bank.id;
  const [session, setSession] = useState(() => readStorage(sessionStorage, SESSION_KEY, null));
  const [data, setData] = useState(EMPTY);
  const [directory, setDirectory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const tokenRef = useRef(null);
  tokenRef.current = session?.token;
  const pending = useRef(new Map());

  const clear = useCallback(() => {
    saveStorage(sessionStorage, SESSION_KEY, null);
    setSession(null); setData(EMPTY); setLoaded(false);
  }, []);

  const refresh = useCallback(async signal => {
    if (!session) return;
    try {
      const value = await liveApi(base, prefix + "/dashboard", { token: session.token, signal });
      if (signal?.aborted || tokenRef.current !== session.token) return;
      setData({ accounts: value.accounts || [], transfers: value.transfers || [] });
      setLoaded(true);
      setError("");
    } catch (failure) {
      if (signal?.aborted || tokenRef.current !== session.token) return;
      if (failure.status === 401) { clear(); setError("Your session expired. Please sign in again."); return; }
      setError(failure.message);
    }
  }, [base, prefix, session, clear]);

  // Load the dashboard now and every 12 s while the tab is visible.
  useEffect(() => {
    if (!session) return undefined;
    const controller = new AbortController();
    const tick = () => { if (document.visibilityState === "visible") refresh(controller.signal); };
    refresh(controller.signal);
    const timer = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(timer); controller.abort(); document.removeEventListener("visibilitychange", tick); };
  }, [session, refresh]);

  // Bank directory (names and IFSC codes of every bank on the switch).
  useEffect(() => {
    if (!session) return undefined;
    const controller = new AbortController();
    liveApi(base, "/directory/banks", { signal: controller.signal })
      .then(value => setDirectory(value.banks || []))
      .catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [base, session]);

  const signIn = useCallback(async (email, password) => {
    setError("");
    const value = await liveApi(base, prefix + "/sign-in", { data: { email: email.trim(), password } });
    saveStorage(sessionStorage, SESSION_KEY, value); // tab-scoped: cleared when the tab closes
    setSession(value);
  }, [base, prefix]);

  const signOut = useCallback(() => { clear(); setDirectory([]); setError(""); }, [clear]);

  // One idempotency key per distinct transfer, so a retry after a timeout never double-sends.
  const send = useCallback(async transfer => {
    const hash = await sha256Hex(JSON.stringify([bank.id, base, session.uid, transfer]));
    const keyName = "x42-pending-" + hash;
    const key = pending.current.get(keyName) || readStorage(sessionStorage, keyName, null) || uuid();
    pending.current.set(keyName, key);
    saveStorage(sessionStorage, keyName, key);
    let row;
    try {
      row = await liveApi(base, prefix + "/transfers", { token: session.token, data: transfer, key });
    } catch (failure) {
      if (failure.status === 401) { clear(); setError("Your session expired. Please sign in again."); }
      throw failure;
    }
    pending.current.delete(keyName);
    saveStorage(sessionStorage, keyName, null);
    await refresh();
    return row;
  }, [bank.id, base, prefix, session, refresh, clear]);

  return { session, data, directory, loaded, error, signIn, signOut, refresh: () => refresh(), send };
}
