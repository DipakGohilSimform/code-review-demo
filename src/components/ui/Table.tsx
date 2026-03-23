/**
 * Table — reusable data table component
 *
 * Extracted from Figma design: node 152:18126
 * Design tokens consumed: --table-header, --table-text, --table-stripe,
 *   --table-border-color, --table-hover, --tag-success-*, --pagination-*
 *
 * Usage:
 *   import { Table } from "@/components/ui";
 */

import React, { useState, useCallback, useMemo, useId } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface ColumnDef<TRow> {
  /** Unique key for this column, used for sorting and cell lookup */
  key: string;
  /** Rendered column header label */
  header: React.ReactNode;
  /** Enable sort controls for this column */
  sortable?: boolean;
  /** Horizontal text alignment inside cells for this column */
  align?: "left" | "center" | "right";
  /** Fixed column width (e.g. "w-48") — leave blank to allow flex growth */
  widthClass?: string;
  /** Custom cell renderer; receives the raw row value and the full row object */
  render?: (value: unknown, row: TRow, index: number) => React.ReactNode;
}

export type TableVariant = "default" | "compact" | "striped" | "bordered";

export interface TableProps<TRow extends object> {
  /** Column definitions */
  columns: ColumnDef<TRow>[];
  /** Row dataset */
  data: TRow[];
  /**
   * Stable identifier for each row. Provide either a key of TRow that returns
   * a primitive, or a function `(row) => string | number`.
   */
  rowKey: keyof TRow | ((row: TRow) => string | number);
  /** Visual variant */
  variant?: TableVariant;
  /**
   * Enable zebra / alternating row stripes.
   * `variant="striped"` implicitly sets this to true.
   */
  striped?: boolean;
  /** Draw vertical column dividers */
  bordered?: boolean;
  /** Highlight row on mouse hover (default: true) */
  hoverable?: boolean;
  /** Render a leading checkbox column for row selection */
  selectable?: boolean;
  /** Controlled — currently selected row-keys */
  selectedKeys?: Set<string | number>;
  /** Fires when selected rows change */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Controlled sort state */
  sortState?: SortState;
  /** Fires when a sortable column header is clicked */
  onSortChange?: (sort: SortState) => void;
  /** Message shown when `data` is empty */
  emptyMessage?: string;
  /** Custom JSX rendered above the empty message */
  emptyIcon?: React.ReactNode;
  /** Accessible caption for the table element */
  caption?: string;
  /** Extra classes on the wrapper div */
  className?: string;
  /** Stick the header row while body scrolls */
  stickyHeader?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const alignClass: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function getRowKey<TRow extends object>(
  row: TRow,
  rowKey: TableProps<TRow>["rowKey"]
): string | number {
  if (typeof rowKey === "function") return rowKey(row);
  return row[rowKey] as string | number;
}

function nextSortDirection(current: SortDirection): SortDirection {
  if (current === null) return "asc";
  if (current === "asc") return "desc";
  return null;
}

// ─── SortIcon ────────────────────────────────────────────────────────────────

interface SortIconProps {
  direction: SortDirection;
}

function SortIcon({ direction }: SortIconProps) {
  return (
    <span
      className="inline-flex flex-col shrink-0 gap-px ml-1"
      aria-hidden="true"
    >
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
        <path
          d="M4 0L7.46410 4.5H0.535898L4 0Z"
          fill={direction === "asc" ? "currentColor" : "currentColor"}
          fillOpacity={direction === "asc" ? "1" : "0.35"}
        />
      </svg>
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
        <path
          d="M4 5L0.535898 0.5L7.46410 0.5L4 5Z"
          fill={direction === "desc" ? "currentColor" : "currentColor"}
          fillOpacity={direction === "desc" ? "1" : "0.35"}
        />
      </svg>
    </span>
  );
}

// ─── TableBadge ─────────────────────────────────────────────────────────────

interface TableBadgeProps {
  /** Semantic variant */
  intent?: "success" | "warning" | "error" | "neutral";
  children: React.ReactNode;
  className?: string;
}

/**
 * Inline badge/tag used inside table cells.
 * Matches the YES/NO pill shown in the Figma design.
 */
export function TableBadge({
  intent = "success",
  children,
  className,
}: TableBadgeProps) {
  const intentStyles: Record<string, string> = {
    success:
      "bg-tag-success-bg border-tag-success-border text-tag-success-text",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    error: "bg-red-50 border-red-200 text-red-700",
    neutral: "bg-muted border-border text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border rounded px-2 py-0.5",
        "text-sm font-semibold uppercase leading-5 whitespace-nowrap",
        intentStyles[intent],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── TableCheckbox ────────────────────────────────────────────────────────────

interface TableCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function TableCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: TableCheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-border",
        "accent-primary cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      )}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={label}
    />
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  colSpan: number;
  message: string;
  icon?: React.ReactNode;
}

function EmptyState({ colSpan, message, icon }: EmptyStateProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-12 text-center text-muted-foreground text-sm"
      >
        {icon && <div className="mb-3 flex justify-center">{icon}</div>}
        <p>{message}</p>
      </td>
    </tr>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

/**
 * Generic, accessible, fully-typed data table.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={columns}
 *   data={rows}
 *   rowKey="id"
 *   variant="striped"
 *   selectable
 * />
 * ```
 */
export function Table<TRow extends object>({
  columns,
  data,
  rowKey,
  variant = "default",
  striped: stripedProp,
  bordered: borderedProp,
  hoverable = true,
  selectable = false,
  selectedKeys: controlledKeys,
  onSelectionChange,
  sortState: controlledSort,
  onSortChange,
  emptyMessage = "No data available.",
  emptyIcon,
  caption,
  className,
  stickyHeader = false,
}: TableProps<TRow>) {
  const tableId = useId();

  // ── variant shortcuts ──
  const isCompact = variant === "compact";
  const isStriped = stripedProp ?? variant === "striped";
  const isBordered = borderedProp ?? variant === "bordered";

  // ── uncontrolled sort ──
  const [internalSort, setInternalSort] = useState<SortState>({
    key: "",
    direction: null,
  });
  const activeSort = controlledSort ?? internalSort;

  const handleSortClick = useCallback(
    (key: string) => {
      const newDirection =
        activeSort.key === key
          ? nextSortDirection(activeSort.direction)
          : "asc";
      const next: SortState = { key, direction: newDirection };
      if (onSortChange) {
        onSortChange(next);
      } else {
        setInternalSort(next);
      }
    },
    [activeSort, onSortChange]
  );

  // ── uncontrolled selection ──
  const [internalKeys, setInternalKeys] = useState<Set<string | number>>(
    new Set()
  );
  const activeKeys = controlledKeys ?? internalKeys;

  const allRowKeys = useMemo(
    () => data.map((row) => getRowKey(row, rowKey)),
    [data, rowKey]
  );
  const allSelected =
    allRowKeys.length > 0 && allRowKeys.every((k) => activeKeys.has(k));
  const someSelected =
    !allSelected && allRowKeys.some((k) => activeKeys.has(k));

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const next = checked ? new Set(allRowKeys) : new Set<string | number>();
      if (onSelectionChange) {
        onSelectionChange(next);
      } else {
        setInternalKeys(next);
      }
    },
    [allRowKeys, onSelectionChange]
  );

  const handleSelectRow = useCallback(
    (key: string | number, checked: boolean) => {
      const next = new Set(activeKeys);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      if (onSelectionChange) {
        onSelectionChange(next);
      } else {
        setInternalKeys(next);
      }
    },
    [activeKeys, onSelectionChange]
  );

  // ── client-side sort (only when uncontrolled) ──
  const sortedData = useMemo(() => {
    const { key, direction } = activeSort;
    if (!key || !direction || controlledSort !== undefined) return data;

    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[key];
      const bVal = (b as Record<string, unknown>)[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp =
        typeof aVal === "string" && typeof bVal === "string"
          ? aVal.localeCompare(bVal)
          : (aVal as number) < (bVal as number)
            ? -1
            : (aVal as number) > (bVal as number)
              ? 1
              : 0;
      return direction === "asc" ? cmp : -cmp;
    });
  }, [data, activeSort, controlledSort]);

  // ── total column count (including optional checkbox col) ──
  const totalCols = columns.length + (selectable ? 1 : 0);

  // ── cell padding ──
  const cellPy = isCompact ? "py-1.5" : "py-3.5";
  const cellPx = "px-3";

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg",
        "border border-table-border",
        "bg-background",
        className
      )}
    >
      <table
        id={tableId}
        className="w-full min-w-full border-collapse text-sm"
        aria-label={caption}
      >
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}

        {/* ── thead ── */}
        <thead
          className={cn(
            stickyHeader && "sticky top-0 z-10"
          )}
        >
          <tr className="bg-table-header">
            {/* selection header */}
            {selectable && (
              <th
                scope="col"
                className={cn(
                  "w-10",
                  cellPx,
                  cellPy,
                  "text-center align-middle",
                  isBordered && "border-r border-table-border"
                )}
                aria-label="Select all rows"
              >
                <TableCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                  label="Select all rows"
                />
              </th>
            )}

            {columns.map((col) => {
              const isSortActive = activeSort.key === col.key;

              return (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    cellPx,
                    cellPy,
                    "align-middle font-bold text-table-text leading-5 whitespace-nowrap",
                    col.widthClass,
                    alignClass[col.align ?? "left"],
                    col.sortable &&
                      "cursor-pointer select-none hover:bg-black/5 transition-colors",
                    isBordered &&
                      "border-r border-table-border last:border-r-0"
                  )}
                  aria-sort={
                    col.sortable && isSortActive
                      ? activeSort.direction === "asc"
                        ? "ascending"
                        : activeSort.direction === "desc"
                          ? "descending"
                          : "none"
                      : col.sortable
                        ? "none"
                        : undefined
                  }
                  onClick={
                    col.sortable ? () => handleSortClick(col.key) : undefined
                  }
                  onKeyDown={
                    col.sortable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSortClick(col.key);
                          }
                        }
                      : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <SortIcon
                        direction={isSortActive ? activeSort.direction : null}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* ── tbody ── */}
        <tbody>
          {sortedData.length === 0 ? (
            <EmptyState
              colSpan={totalCols}
              message={emptyMessage}
              icon={emptyIcon}
            />
          ) : (
            sortedData.map((row, rowIndex) => {
              const key = getRowKey(row, rowKey);
              const isSelected = activeKeys.has(key);
              const isZebra = isStriped && rowIndex % 2 !== 0;

              return (
                <tr
                  key={key}
                  data-selected={isSelected || undefined}
                  className={cn(
                    "border-t border-table-border transition-colors",
                    isZebra ? "bg-table-stripe" : "bg-background",
                    hoverable &&
                      "hover:bg-table-hover",
                    isSelected && "bg-primary/5"
                  )}
                  aria-selected={selectable ? isSelected : undefined}
                >
                  {/* selection cell */}
                  {selectable && (
                    <td
                      className={cn(
                        "w-10",
                        cellPx,
                        cellPy,
                        "text-center align-middle",
                        isBordered && "border-r border-table-border"
                      )}
                    >
                      <TableCheckbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectRow(key, checked)}
                        label={`Select row ${rowIndex + 1}`}
                      />
                    </td>
                  )}

                  {columns.map((col) => {
                    const rawValue = (row as Record<string, unknown>)[col.key];
                    const cell = col.render
                      ? col.render(rawValue, row, rowIndex)
                      : (rawValue as React.ReactNode);

                    return (
                      <td
                        key={col.key}
                        className={cn(
                          cellPx,
                          cellPy,
                          "align-middle text-table-text leading-5",
                          alignClass[col.align ?? "left"],
                          col.widthClass,
                          isBordered &&
                            "border-r border-table-border last:border-r-0"
                        )}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Compound sub-components (for manual / slot composition) ────────────────

/**
 * Wrapper that applies the outer border + overflow container to a raw
 * `<table>` element. Use when you need full layout control.
 */
export function TableRoot({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-table-border bg-background",
        className
      )}
    >
      <table className="w-full min-w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  className,
  children,
  sticky = false,
}: React.HTMLAttributes<HTMLTableSectionElement> & { sticky?: boolean }) {
  return (
    <thead
      className={cn(sticky && "sticky top-0 z-10", className)}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  className,
  children,
  isSelected,
  isStriped: striped,
  hoverable = true,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & {
  isSelected?: boolean;
  isStriped?: boolean;
  hoverable?: boolean;
}) {
  return (
    <tr
      className={cn(
        "border-t border-table-border transition-colors",
        striped ? "bg-table-stripe" : "bg-background",
        hoverable && "hover:bg-table-hover",
        isSelected && "bg-primary/5",
        className
      )}
      aria-selected={isSelected}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHeader({
  className,
  children,
  sortable,
  sortDirection,
  onSort,
  align = "left",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-3.5 bg-table-header",
        "font-bold text-table-text leading-5 whitespace-nowrap",
        alignClass[align],
        sortable &&
          "cursor-pointer select-none hover:bg-black/5 transition-colors",
        className
      )}
      aria-sort={
        sortable
          ? sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : "none"
          : undefined
      }
      tabIndex={sortable ? 0 : undefined}
      onClick={sortable ? onSort : undefined}
      onKeyDown={
        sortable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSort?.();
              }
            }
          : undefined
      }
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && <SortIcon direction={sortDirection ?? null} />}
      </span>
    </th>
  );
}

export function TableCell({
  className,
  children,
  align = "left",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "center" | "right";
}) {
  return (
    <td
      className={cn(
        "px-3 py-3.5 align-middle text-table-text leading-5",
        alignClass[align],
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableCaption({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("mb-2 text-sm text-muted-foreground text-left", className)}
      {...props}
    >
      {children}
    </caption>
  );
}
