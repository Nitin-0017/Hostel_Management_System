import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useFees } from "../../hooks/useFees";
import type { IFeeRecord } from "../../services/feeService";
import Icon from "../../components/dashboard/Icon";
import Skeleton from "../../components/ui/Skeleton";
import "./Fees.css";

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const PAYMENT_LABELS: Record<string, string> = {
  ONLINE: "Online", CASH: "Cash", BANK_TRANSFER: "Bank Transfer", UPI: "UPI",
};

type FilterStatus = "ALL" | IFeeRecord["status"];

// ── Summary card ─────────────────────────────────────────────────────────────

const SummaryCard: React.FC<{
  label: string; value: string; sub?: string;
  variant: "total" | "paid" | "pending" | "overdue";
  icon: React.ReactNode; loading: boolean;
}> = ({ label, value, sub, variant, icon, loading }) => (
  <div className="fee-summary-card">
    <div className={`fee-summary-icon ${variant}`}>
      {icon}
    </div>
    <div className="fee-summary-info">
      <label>{label}</label>
      {loading
        ? <Skeleton width="80px" height="28px" />
        : <p className="fee-amount">{value}</p>}
      {sub && !loading && <p className="fee-sub">{sub}</p>}
    </div>
  </div>
);

// ── Fee row ───────────────────────────────────────────────────────────────────

const FeeRow: React.FC<{ fee: IFeeRecord; expanded: boolean; onToggle: () => void }> = ({
  fee, expanded, onToggle,
}) => {
  const statusClass = `status-${fee.status.toLowerCase()}`;

  return (
    <>
      <tr
        onClick={onToggle}
        className={`${expanded ? "row-expanded" : ""} ${fee.status === "OVERDUE" ? "row-overdue" : ""}`}
      >
        <td className="fee-period">
          {fee.monthName} {fee.year}
        </td>
        <td className="fee-amount-cell">{fmt(fee.amount)}</td>
        <td>
          <span className={`fee-status-badge ${statusClass}`}>
            <span className="fee-status-dot" />
            {fee.status}
          </span>
        </td>
        <td className="fee-date-cell">{fmtDate(fee.dueDate)}</td>
        <td className="fee-date-cell">{fmtDate(fee.paidAt)}</td>
        <td className="fee-method-cell">
          {fee.paymentMethod ? PAYMENT_LABELS[fee.paymentMethod] ?? fee.paymentMethod : "—"}
        </td>
        <td style={{ textAlign: "right" }}>
          <span className={`fee-expand-icon ${expanded ? "open" : ""}`}>▾</span>
        </td>
      </tr>

      {expanded && (
        <tr className="fee-detail-row">
          <td colSpan={7}>
            <div className="fee-detail-inner">
              <div className="fee-detail-item">
                <label>Transaction ID</label>
                <span className="mono">{fee.transactionId || "—"}</span>
              </div>
              <div className="fee-detail-item">
                <label>Remarks</label>
                <span>{fee.remarks || "—"}</span>
              </div>
              <div className="fee-detail-item">
                <label>Record Created</label>
                <span>{fmtDate(fee.createdAt)}</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const Fees: React.FC = () => {
  const { fees, summary, loading, error, refresh } = useFees();
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<string>("ALL");

  const years = Array.from(new Set(fees.map(f => String(f.year)))).sort((a, b) => Number(b) - Number(a));

  const filtered = fees.filter(f => {
    const statusOk = filter === "ALL" || f.status === filter;
    const yearOk   = yearFilter === "ALL" || String(f.year) === yearFilter;
    return statusOk && yearOk;
  });

  const FILTERS: { label: string; value: FilterStatus; statusClass: string }[] = [
    { label: "All",     value: "ALL",     statusClass: "" },
    { label: "Pending", value: "PENDING", statusClass: "status-pending" },
    { label: "Paid",    value: "PAID",    statusClass: "status-paid" },
    { label: "Overdue", value: "OVERDUE", statusClass: "status-overdue" },
    { label: "Waived",  value: "WAIVED",  statusClass: "status-waived" },
  ];

  return (
    <DashboardLayout>
      <div className="fees-page">

        {/* Header */}
        <div className="fees-header">
          <div className="fees-header-left">
            <h1>
              <Icon name="fees" size="lg" color="#2F4156" /> Fee Records
            </h1>
            <p>View and track your hostel fee payments</p>
          </div>
          <button onClick={refresh} className="fees-refresh-btn">
            <Icon name="activity" size="sm" /> Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="fees-error">
            <span>⚠</span> {error}
            <button onClick={refresh}>Retry</button>
          </div>
        )}

        {/* Summary cards */}
        <div className="fees-summary-grid">
          <SummaryCard
            label="Total Billed"
            value={summary ? fmt(summary.total) : "—"}
            sub={summary ? `${summary.count} record${summary.count !== 1 ? "s" : ""}` : undefined}
            variant="total"
            icon={<Icon name="fees" size="md" />}
            loading={loading}
          />
          <SummaryCard
            label="Total Paid"
            value={summary ? fmt(summary.paid) : "—"}
            variant="paid"
            icon={<Icon name="check-circle" size="md" />}
            loading={loading}
          />
          <SummaryCard
            label="Pending"
            value={summary ? fmt(summary.pending) : "—"}
            variant="pending"
            icon={<Icon name="bell" size="md" />}
            loading={loading}
          />
          <SummaryCard
            label="Overdue"
            value={summary ? fmt(summary.overdue) : "—"}
            variant="overdue"
            icon={<Icon name="complaints" size="md" />}
            loading={loading}
          />
        </div>

        {/* Filters */}
        <div className="fees-filter-bar">
          <div className="fees-filter-pills">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`fee-filter-btn ${filter === f.value ? `active ${f.statusClass}` : ""}`}
              >
                {f.label}
                {f.value !== "ALL" && summary && (
                  <span style={{ marginLeft: "4px", opacity: 0.75 }}>
                    ({f.value === "PENDING" ? fees.filter(x => x.status === "PENDING").length
                      : f.value === "PAID"    ? fees.filter(x => x.status === "PAID").length
                      : f.value === "OVERDUE" ? fees.filter(x => x.status === "OVERDUE").length
                      : fees.filter(x => x.status === "WAIVED").length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {years.length > 0 && (
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              className="fee-year-select"
            >
              <option value="ALL">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          )}
        </div>

        {/* Table */}
        <div className="fees-table-card">
          {loading ? (
            <div className="fees-skeleton-list">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} height="48px" borderRadius="10px" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="fees-empty-state">
              <div className="fees-empty-icon">
                <Icon name="fees" size="lg" color="#9ca3af" />
              </div>
              <h3>
                {fees.length === 0 ? "No fee records found" : "No records match your filter"}
              </h3>
              <p>
                {fees.length === 0
                  ? "Your fee records will appear here once they are created by the admin."
                  : "Try changing the status or year filter."}
              </p>
            </div>
          ) : (
            <div className="fees-table-wrap">
              <table className="fees-table">
                <thead>
                  <tr>
                    {["Period", "Amount", "Status", "Due Date", "Paid On", "Method", ""].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(fee => (
                    <FeeRow
                      key={fee.id}
                      fee={fee}
                      expanded={expandedId === fee.id}
                      onToggle={() => setExpandedId(expandedId === fee.id ? null : fee.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="fees-table-footer">
              Showing {filtered.length} of {fees.length} record{fees.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {/* Payment info notice */}
        <div className="fees-info-notice">
          <span>ℹ</span>
          <p>
            To pay your fees or dispute a record, please contact the hostel administration office.
            Payments are recorded by the admin after verification.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Fees;
