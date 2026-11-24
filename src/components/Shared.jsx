import React from "react";
import { Box, Typography, Chip, Paper, Button, Stack, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Skeleton, Alert } from "@mui/material";
import { ArrowUpRight, ArrowDownLeft, Wallet, ArrowRight } from "lucide-react";

export const money = minor => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format((Number(minor) || 0) / 100);
export function PageHeader({ title, subtitle, action }) {
  return <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} sx={{ mb: 3 }}>
    <Box><Typography variant="h4" sx={{ fontSize: { xs: 27, md: 34 } }}>{title}</Typography><Typography color="text.secondary" sx={{ mt: .5 }}>{subtitle}</Typography></Box>{action}
  </Stack>;
}
export function Status({ value }) {
  const v = String(value || "PENDING").toUpperCase();
  const color = ["ACTIVE","APPROVED","COMPLETED","CREDIT"].includes(v) ? "success" : ["PENDING","PROCESSING","HOLD","IN_PROGRESS","MANUAL_REVIEW"].includes(v) ? "warning" : ["REJECTED","FROZEN","BLOCKED"].includes(v) ? "error" : "default";
  return <Chip size="small" label={v.replaceAll("_"," ")} color={color} variant="outlined" sx={{ fontWeight: 700, fontSize: 10 }} />;
}
export function Metric({ label, value, hint, icon: Icon, accent = "#204abe" }) {
  return <Paper variant="outlined" sx={{ p: 2.3, height: "100%", borderColor: "#e8ecf4" }}><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h5" sx={{ mt: 1, fontSize: 25 }}>{value}</Typography><Typography color="text.secondary" variant="caption">{hint}</Typography></Box><Box sx={{ bgcolor: `${accent}14`, color: accent, p: 1.2, borderRadius: 2 }}><Icon size={20}/></Box></Stack></Paper>;
}
export function DataTable({ columns, rows, empty = "No records found." }) {
  return <TableContainer component={Paper} variant="outlined" sx={{ borderColor: "#e8ecf4" }}><Table size="medium"><TableHead><TableRow>{columns.map(c => <TableCell key={c.key}>{c.label}</TableCell>)}</TableRow></TableHead><TableBody>{rows.length ? rows.map((r,i)=><TableRow hover key={r.id || i}>{columns.map(c=><TableCell key={c.key}>{c.render ? c.render(r[c.key],r) : (r[c.key] ?? "—")}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length}><Box sx={{ py: 5, textAlign: "center" }}><Wallet size={26} color="#9aa6bc"/><Typography color="text.secondary" sx={{ mt: 1 }}>{empty}</Typography></Box></TableCell></TableRow>}</TableBody></Table></TableContainer>;
}
export function ActivityTable({ rows }) {
  return <DataTable rows={rows} columns={[
    { key:"description", label:"Transaction", render:(v,r)=><Stack direction="row" spacing={1.2} alignItems="center"><Box sx={{ p:1, bgcolor:r.type==="CREDIT"?"#e8f7ef":"#eef2ff", color:r.type==="CREDIT"?"#16845b":"#204abe", borderRadius:2 }}>{r.type==="CREDIT"?<ArrowDownLeft size={17}/>:<ArrowUpRight size={17}/>}</Box><Box><Typography fontWeight={650} fontSize={13}>{v}</Typography><Typography variant="caption" color="text.secondary">{r.date} · {r.category}</Typography></Box></Stack> },
    { key:"amountMinor", label:"Amount", render:(v,r)=><Typography fontWeight={700} color={r.type==="CREDIT"?"success.main":"text.primary"}>{r.type==="CREDIT"?"+":"−"}{money(v)}</Typography> },
    { key:"status", label:"Status", render:v=><Status value={v}/> }
  ]}/>
}
export function LoadingState(){return <Stack spacing={1}><Skeleton height={70}/><Skeleton height={70}/><Skeleton height={70}/></Stack>}
export function ErrorState({ message, retry }){return <Alert severity="error" action={retry && <Button color="inherit" onClick={retry}>Retry</Button>}>{message || "Something went wrong. Please try again."}</Alert>}
export function SectionCard({ title, subtitle, action, children }) { return <Paper variant="outlined" sx={{ borderColor:"#e8ecf4", overflow:"hidden" }}><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p:2.2 }}><Box><Typography fontWeight={730}>{title}</Typography>{subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}</Box>{action}</Stack>{children}</Paper>; }
