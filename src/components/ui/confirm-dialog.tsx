import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[rgba(8,9,13,0.55)]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-lg)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-[17px] font-semibold text-[var(--text-primary)]">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-[13px] text-[var(--text-secondary)]">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)]"
                aria-label="Fechar"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-canvas)] px-4 text-[13px] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-overlay)]"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={onConfirm}
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-md px-4 text-[13px] font-medium transition-colors",
                confirmVariant === "danger"
                  ? "bg-[var(--status-critical)] text-white hover:bg-[var(--status-critical)]/90"
                  : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)]",
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
