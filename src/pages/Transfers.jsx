import React, { useState } from "react";
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { RefreshCw, Send } from "lucide-react";
import { toPaise } from "../amount";
import { PageHeader, SectionCard, DataTable, Status, LoadingState, ErrorState, money } from "../components/Shared";
import { activityRows, rejectionNames } from "../api/central";

// Live transfers through the central bank (SharedBank switch). Uses the portal's shared session.
export default function Transfers({ bank, central }) {
  const { data, directory, loaded, error, send, refresh } = central;
  const [type, setType] = useState("interbank");
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const sources = data.accounts.filter(a => a.status === "ACTIVE");
  const fromId = sources.some(a => a.accountId === from) ? from : (sources[0]?.accountId || "");
  const routes = directory.filter(b => b.bankId !== bank.id && b.status === "ACTIVE");
  const route = routes.some(r => r.ifsc === destination) ? destination : (routes[0]?.ifsc || "");
  const target = type === "internal" ? bank.ifsc : route;
  const rows = activityRows(data.transfers, directory);

  async function submit(event) {
    event.preventDefault();
    setFormError(""); setResult(null);
    const amountMinor = toPaise(amount);
    if (!fromId || !target || !number.trim() || amountMinor === null) {
      setFormError("Choose a source, destination and a positive amount with at most two decimal places.");
      return;
    }
    setBusy(true);
    try {
      const row = await send({
        fromAccountId: fromId, destinationIfsc: target,
        destinationAccountNumber: number.trim(), amountMinor, currency: "INR",
      });
      setResult(row);
      if (row.status !== "REJECTED") { setNumber(""); setAmount(""); }
    } catch (failure) { setFormError(failure.message); }
    finally { setBusy(false); }
  }

  const resultSeverity = result?.status === "COMPLETED" ? "success" : result?.status === "REJECTED" ? "error" : "info";
  const resultText = !result ? "" :
    (result.status === "COMPLETED" ? "Transfer completed" : result.status === "REJECTED" ? "Transfer rejected" :
      result.status === "MANUAL_REVIEW" ? "Transfer sent for manual review" : "Transfer accepted") +
    " · " + result.transferId +
    (result.code ? " · " + (rejectionNames[result.code] || result.code.toLowerCase().replaceAll("_", " ")) : "");

  return <>
    <PageHeader title="Transfers" subtitle="Send money within Nexora or to another bank on the SharedBank network."
      action={<Button variant="outlined" startIcon={<RefreshCw size={16} />} onClick={refresh}>Refresh</Button>} />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {!loaded ? <LoadingState /> : !data.accounts.length ?
      <Alert severity="info">No account is linked to your login at Nexora Bank yet. Ask the bank operator to attach an account to your Firebase user.</Alert> :
      <Stack spacing={3}>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, maxWidth: 700, borderColor: "#e8ecf4" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box><Typography fontWeight={730}>Send a transfer</Typography>
              <Typography variant="caption" color="text.secondary">Balances are synthetic and held by the central bank (Firestore test network).</Typography></Box>
            <Send size={19} />
          </Stack>
          <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
            <Stack direction="row" spacing={1}>
              {[["interbank", "Interbank"], ["internal", "Same bank"]].map(([value, label]) =>
                <Button key={value} type="button" aria-pressed={type === value} disabled={busy}
                  variant={type === value ? "contained" : "outlined"} onClick={() => setType(value)}>{label}</Button>)}
            </Stack>
            <TextField select label="From account" required value={fromId} onChange={e => setFrom(e.target.value)} disabled={busy || !sources.length}>
              {sources.map(a => <MenuItem key={a.accountId} value={a.accountId}>{a.accountNumber} · {money(a.availableMinor)} available</MenuItem>)}
            </TextField>
            {type === "interbank" && <TextField select label="Destination bank" required value={route}
              onChange={e => setDestination(e.target.value)} disabled={busy || !routes.length}
              helperText={!routes.length ? "No other active bank found in the directory." : undefined}>
              {routes.map(b => <MenuItem key={b.ifsc} value={b.ifsc}>{b.bankName} · {b.ifsc}</MenuItem>)}
            </TextField>}
            <TextField label="Destination account number" required value={number} onChange={e => setNumber(e.target.value)} disabled={busy} />
            <TextField label="Amount (INR)" required value={amount} onChange={e => setAmount(e.target.value)} disabled={busy}
              slotProps={{ htmlInput: { inputMode: "decimal" } }} />
            {formError && <Alert severity="error">{formError}</Alert>}
            {result && <Alert severity={resultSeverity} onClose={() => setResult(null)}>{resultText}</Alert>}
            <Box><Button type="submit" variant="contained" disabled={busy || !fromId || !target} startIcon={<Send size={16} />}>
              {busy ? "Submitting…" : "Submit transfer"}</Button></Box>
          </Box>
        </Paper>
        <SectionCard title="Transfer activity" subtitle="Your latest 50 transfers from the central bank">
          <DataTable empty="No transfers yet. They appear here once the central bank accepts them." rows={rows} columns={[
            { key: "id", label: "Transfer", render: (v, r) => <><Typography fontWeight={650} fontSize={13}>{v}</Typography><Typography variant="caption" color="text.secondary">{r.date}</Typography></> },
            { key: "route", label: "Route", render: (v, r) => <><Typography fontSize={13}>{v}</Typography><Typography variant="caption" color="text.secondary">{r.category === "Same bank" ? "Same bank" : r.type === "CREDIT" ? "Incoming" : "Outgoing"}</Typography></> },
            { key: "amountMinor", label: "Amount", render: (v, r) => <Typography fontWeight={700} color={r.type === "CREDIT" ? "success.main" : "text.primary"}>{r.type === "CREDIT" ? "+" : "−"}{money(v)}</Typography> },
            { key: "status", label: "Status", render: (v, r) => <><Status value={v} />{r.code && <Typography variant="caption" color="text.secondary" display="block">{rejectionNames[r.code] || r.code.toLowerCase().replaceAll("_", " ")}</Typography>}</> },
          ]} />
        </SectionCard>
      </Stack>}
  </>;
}
