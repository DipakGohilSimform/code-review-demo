/**
 * ProvidersTable — example usage of the generic Table component
 *
 * This file demonstrates how to wire up the <Table /> component with:
 *  - Type-safe column definitions
 *  - Custom cell renderers (avatar, badge)
 *  - Sorting (uncontrolled client-side)
 *  - Row selection
 *  - Pagination UI (display-only — connect your own page state)
 *  - Variants: default | striped | compact | bordered
 *
 * Based on Figma node 152:18126 — Provider directory table.
 */

import { useState } from "react";
import { Table, TableBadge, type ColumnDef } from "@/components/ui";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Provider {
  id: string;
  name: string;
  avatar?: string;
  type: string;
  specialization: string;
  location: string;
  acceptsLop: boolean;
  lastContacted: string;
}

// ─── Sample dataset ──────────────────────────────────────────────────────────

const SAMPLE_PROVIDERS: Provider[] = [
  {
    id: "1",
    name: "Dr. Maria Lawson",
    type: "Orthopaedic Specialist",
    specialization: "Whiplash, MRI",
    location: "Austin, TX",
    acceptsLop: true,
    lastContacted: "April 12, 2025",
  },
  {
    id: "2",
    name: "Dr. James Carter",
    type: "Neurologist",
    specialization: "Traumatic Brain Injury",
    location: "Dallas, TX",
    acceptsLop: false,
    lastContacted: "March 30, 2025",
  },
  {
    id: "3",
    name: "Dr. Priya Nair",
    type: "Physical Therapist",
    specialization: "Spine, Rehabilitation",
    location: "Houston, TX",
    acceptsLop: true,
    lastContacted: "April 5, 2025",
  },
  {
    id: "4",
    name: "Dr. Steven Wright",
    type: "Pain Management",
    specialization: "Chronic Pain, Injections",
    location: "San Antonio, TX",
    acceptsLop: true,
    lastContacted: "April 1, 2025",
  },
  {
    id: "5",
    name: "Dr. Emily Reyes",
    type: "Chiropractor",
    specialization: "Neck & Back",
    location: "Austin, TX",
    acceptsLop: false,
    lastContacted: "February 14, 2025",
  },
  {
    id: "6",
    name: "Dr. Leon Harris",
    type: "Orthopaedic Specialist",
    specialization: "Knee, Shoulder",
    location: "Fort Worth, TX",
    acceptsLop: true,
    lastContacted: "April 10, 2025",
  },
  {
    id: "7",
    name: "Dr. Sofia Mendez",
    type: "Radiologist",
    specialization: "MRI, CT Scan",
    location: "Plano, TX",
    acceptsLop: true,
    lastContacted: "March 22, 2025",
  },
];

// ─── Avatar cell ─────────────────────────────────────────────────────────────

function ProviderCell({ name, avatar }: { name: string; avatar?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className="inline-flex items-center gap-2 min-w-0">
      {avatar ? (
        <img src={avatar} alt={name} className="h-8 w-8 rounded-full object-cover shrink-0" />
      ) : (
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pagination-bg text-pagination-text text-xs font-semibold"
        >
          {initials}
        </span>
      )}
      <span className="truncate font-medium text-table-text">{name}</span>
    </span>
  );
}

// ─── Action cell ─────────────────────────────────────────────────────────────

function ActionCell({ onMessage, onDelete }: { onMessage: () => void; onDelete: () => void }) {
  return (
    <span className="inline-flex items-center gap-2">
      {/* Message icon */}
      <button
        type="button"
        aria-label="Send message"
        onClick={onMessage}
        className={cn(
          "p-1 rounded text-pagination-text",
          "hover:bg-pagination-bg transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring outline-none"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Delete icon */}
      <button
        type="button"
        aria-label="Delete provider"
        onClick={onDelete}
        className={cn(
          "p-1 rounded text-destructive",
          "hover:bg-red-50 transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring outline-none"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </span>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

function buildColumns(
  onMessage: (id: string) => void,
  onDelete: (id: string) => void
): ColumnDef<Provider>[] {
  return [
    {
      key: "name",
      header: "Provider Name",
      sortable: true,
      widthClass: "min-w-50",
      render: (_value, row) => <ProviderCell name={row.name} avatar={row.avatar} />,
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      widthClass: "min-w-40",
    },
    {
      key: "specialization",
      header: "Specialization",
      sortable: true,
      widthClass: "min-w-35",
    },
    {
      key: "location",
      header: "Location",
      sortable: true,
      widthClass: "min-w-30",
    },
    {
      key: "acceptsLop",
      header: "Accepts LOP",
      align: "center",
      widthClass: "min-w-28",
      render: (_value, row) =>
        row.acceptsLop ? (
          <TableBadge intent="success">Yes</TableBadge>
        ) : (
          <TableBadge intent="neutral">No</TableBadge>
        ),
    },
    {
      key: "lastContacted",
      header: "Last Contacted Date",
      sortable: true,
      widthClass: "min-w-40",
    },
    {
      key: "id",
      header: "Action",
      align: "center",
      widthClass: "w-22",
      render: (_value, row) => (
        <ActionCell onMessage={() => onMessage(row.id)} onDelete={() => onDelete(row.id)} />
      ),
    },
  ];
}

// ─── Pagination ──────────────────────────────────────────────────────────────

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

interface PaginationProps {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (n: number) => void;
}

function Pagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const pages = buildPageNumbers(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        "border-t border-table-border bg-background px-3 py-3"
      )}
    >
      {/* Left — rows per page */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">No. of Rows</span>
        <select
          value={rowsPerPage}
          onChange={e => onRowsPerPageChange(Number(e.target.value))}
          className={cn(
            "h-9 w-20 rounded-md border border-border bg-background",
            "px-2.5 text-sm text-foreground",
            "focus:ring-2 focus:ring-ring outline-none"
          )}
          aria-label="Rows per page"
        >
          {ROWS_PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Right — page numbers */}
      <nav aria-label="Table pagination">
        <ul className="flex items-center gap-1">
          {/* Previous */}
          <li>
            <PaginationButton
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              <ChevronIcon direction="left" />
            </PaginationButton>
          </li>

          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <li key={`ellipsis-${i}`}>
                <span
                  className="flex h-8.5 w-8.5 items-center justify-center text-sm text-pagination-text"
                  aria-hidden="true"
                >
                  •••
                </span>
              </li>
            ) : (
              <li key={p}>
                <PaginationButton
                  isActive={p === page}
                  onClick={() => onPageChange(p as number)}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </PaginationButton>
              </li>
            )
          )}

          {/* Next */}
          <li>
            <PaginationButton
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              <ChevronIcon direction="right" />
            </PaginationButton>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function PaginationButton({
  isActive = false,
  disabled = false,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "flex h-8.5 w-8.5 items-center justify-center rounded-full text-sm font-medium",
        "transition-colors focus-visible:ring-2 focus-visible:ring-ring outline-none",
        isActive
          ? "bg-pagination-active text-table-text"
          : "bg-pagination-bg text-pagination-text hover:opacity-80",
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <polyline points="10 4 6 8 10 12" />
      ) : (
        <polyline points="6 4 10 8 6 12" />
      )}
    </svg>
  );
}

function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

// ─── ProvidersTable ───────────────────────────────────────────────────────────

/**
 * Full example showing the Table component wired with real data,
 * selection, sorting, actions, and pagination.
 */
export function ProvidersTable() {
  const [data, setData] = useState<Provider[]>(SAMPLE_PROVIDERS);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const pageData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleMessage = () => {};

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(p => p.id !== id));
    setSelectedKeys(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const columns = buildColumns(handleMessage, handleDelete);

  return (
    <div className="rounded-lg border border-table-border overflow-hidden">
      <Table
        columns={columns}
        data={pageData}
        rowKey="id"
        variant="striped"
        selectable
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        caption="Healthcare providers directory"
        emptyMessage="No providers match your search."
        emptyIcon={
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-muted-foreground"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        }
        // Remove the outer border since the wrapper already has one
        className="border-0 rounded-none"
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={n => {
          setRowsPerPage(n);
          setPage(1);
        }}
      />
    </div>
  );
}

export default ProvidersTable;
