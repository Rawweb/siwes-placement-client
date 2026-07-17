export default function ApplicantModal({ open, applicant, position, onClose }) {
  if (!open || !applicant) return null;

  const p = applicant.studentProfile || {};

  const initials = applicant.fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className='fixed inset-0 z-50 bg-black/40 grid place-items-center px-4' onClick={onClose}>
      <div
        className='w-full max-w-md bg-white rounded-2xl p-6'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: avatar + name */}
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-12 h-12 rounded-full bg-[var(--color-green-100)] text-[var(--color-green-700)] grid place-items-center text-sm font-bold'>
            {initials}
          </div>
          <div>
            <h2 className='font-serif text-lg text-[var(--color-green-900)]'>
              {applicant.fullName}
            </h2>
            <p className='text-xs text-[var(--color-ink-soft)]'>Applied for {position}</p>
          </div>
        </div>

        {/* Detail rows */}
        <div className='flex flex-col gap-2.5 text-sm'>
          <Detail label='Course of study' value={p.courseOfStudy} />
          <Detail label='Academic level' value={p.academicLevel} />
          <Detail label='Location' value={[p.city, p.state].filter(Boolean).join(', ')} />
          <Detail label='Skills' value={p.skills} />
        </div>

        <div className='flex justify-end mt-5'>
          <button
            onClick={onClose}
            className='rounded-lg border border-[var(--color-line)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// A small label + value row. Shows a dash when the value is empty.
function Detail({ label, value }) {
  return (
    <div className='flex flex-col'>
      <span className='text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)]'>
        {label}
      </span>
      <span className='text-[var(--color-ink)]'>{value || '—'}</span>
    </div>
  );
}
