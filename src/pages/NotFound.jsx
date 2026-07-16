import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='min-h-screen grid place-items-center text-center'>
      <div>
        <h1 className='text-2xl font-bold text-[var(--color-green-900)]'>Page not found</h1>
        <p className='mt-2 text-[var(--color-ink-soft)]'>
          The page you are looking for does not exist.
        </p>
        <Link to='/' className='mt-4 inline-block text-[var(--color-green-700)] font-semibold'>
          Go back home
        </Link>
      </div>
    </div>
  );
}
