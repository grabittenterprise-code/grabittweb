"use client";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#121212] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <h3 className="text-xl text-white/95">{title}</h3>
        <p className="mt-2 text-sm text-white/65">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full border border-red-300/30 bg-red-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-red-200 hover:bg-red-400/15"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
