export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) {
  // Render nothing when closed.
  if (!open) return null;

  return (
    // Full-screen dark overlay. Clicking it cancels.
    <div className='fixed inset-0 z-50 bg-black/40 grid place-items-center px-4' onClick={onCancel}>
      {/* The dialog box. stopPropagation keeps clicks inside from
          reaching the overlay and closing it. */}
      <div
        className='w-full max-w-sm bg-white rounded-2xl p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='font-serif text-lg text-[var(--color-green-900)] mb-1'>{title}</h2>
        <p className='text-sm text-[var(--color-ink-soft)] mb-5'>{message}</p>

        <div className='flex gap-2 justify-end'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-60'
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className='rounded-lg bg-[var(--color-green-700)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60'
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
