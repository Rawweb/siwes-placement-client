// A temporary stand-in for pages not built yet.
// Each real page will replace its own placeholder later.
export default function Placeholder({ name }) {
  return (
    <div className='min-h-screen grid place-items-center'>
      <h1 className='text-xl font-semibold text-[var(--color-green-900)]'>{name} (coming soon)</h1>
    </div>
  );
}
