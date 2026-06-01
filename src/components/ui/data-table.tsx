import { useState } from "react";
import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";

export interface DataTableColumn<T> {
  header: string;
  accessor?: keyof T;
  cell?: (row: T) => ReactNode;
  width?: string;
  className?: string;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  pagination?: DataTablePagination;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  loading,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Ajuste os filtros ou tente novamente.",
  emptyIcon,
  pagination,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [visibleCells, setVisibleCells] = useState<Record<string, boolean>>({});
  const hasData = data.length > 0;

  const maskEmail = (value: string) => {
    const [local, domain] = value.split("@");
    if (!domain) return value;
    return `${local.slice(0, 3)}***@${domain}`;
  };

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.length > 2 ? `${digits.slice(0, 2)}******` : value;
  };

  const renderDefaultCell = (row: T, accessor: keyof T, rowIndex: number) => {
    const rawValue = row[accessor];
    if (typeof rawValue !== "string") return rawValue as ReactNode;

    const isEmail = accessor === "email";
    const isPhone = accessor === "phone";
    const cellKey = `${rowIndex}-${String(accessor)}`;
    const visible = visibleCells[cellKey];

    if (isEmail) {
      return (
        <div className="flex items-center gap-2">
          <span>{visible ? rawValue : maskEmail(rawValue)}</span>
          <button
            type="button"
            onClick={() => setVisibleCells((prev) => ({ ...prev, [cellKey]: !prev[cellKey] }))}
            className="text-[11px] text-[var(--accent-primary)] hover:underline"
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      );
    }

    if (isPhone) {
      return (
        <div className="flex items-center gap-2">
          <span>{visible ? rawValue : maskPhone(rawValue)}</span>
          <button
            type="button"
            onClick={() => setVisibleCells((prev) => ({ ...prev, [cellKey]: !prev[cellKey] }))}
            className="text-[11px] text-[var(--accent-primary)] hover:underline"
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      );
    }

    return rawValue as ReactNode;
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border-subtle bg-(--bg-surface)",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-border-subtle bg-(--bg-canvas) text-[11px] uppercase tracking-[0.18em] text-text-tertiary">
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={cn("px-4 py-3 font-medium", column.className)}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border-subtle last:border-b-0">
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex} className={cn("px-4 py-4", column.className)}>
                      <div className="h-4 w-full animate-pulse rounded-md bg-(--border-default)" />
                    </td>
                  ))}
                </tr>
              ))
            ) : hasData ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b border-border-subtle transition-colors last:border-b-0",
                    onRowClick ? "cursor-pointer hover:bg-(--bg-overlay)" : "",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex} className={cn("px-4 py-4 align-top", column.className)}>
                      {column.cell
                        ? column.cell(row)
                        : column.accessor
                          ? renderDefaultCell(row, column.accessor, rowIndex)
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  <EmptyState
                    icon={emptyIcon ?? FileText}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && !loading && hasData && (
        <div className="flex flex-col gap-2 border-t border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[13px] text-(--text-secondary)">
            Mostrando {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.total, pagination.page * pagination.pageSize)} de{" "}
            {pagination.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="rounded-md border border-(--border-default) px-3 py-1.5 text-[12px] text-(--text-secondary) transition-colors hover:border-border-strong hover:text-(--text-primary) disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="rounded-md border border-(--border-default) px-3 py-1.5 text-[12px] text-(--text-secondary) transition-colors hover:border-border-strong hover:text-(--text-primary) disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
