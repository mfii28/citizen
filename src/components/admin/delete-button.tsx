"use client";

export function ConfirmSubmitButton({
  label = "Delete",
  confirmText = "Are you sure? This can't be undone.",
}: {
  label?: string;
  confirmText?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
      className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
    >
      {label}
    </button>
  );
}
