import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { getMe } from '../api/auth.js';

const navItems = [
  { to: '/employer/dashboard', label: 'Dashboard', short: 'Home', icon: '▦' },
  { to: '/employer/post', label: 'Post Opening', short: 'Post', icon: '＋' },
  { to: '/employer/applications', label: 'Applications', short: 'Applications', icon: '▤' },
];

export default function EmployerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // The employer's verification status, loaded once on mount.
  const [isVerified, setIsVerified] = useState(null); // null = still loading

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMe();
        setIsVerified(res.data.user.employerProfile?.isVerified || false);
      } catch {
        setIsVerified(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className='min-h-screen md:grid md:grid-cols-[230px_1fr] bg-[var(--color-paper)]'>
      {/* Sidebar */}
      <aside className='hidden md:flex flex-col gap-1 bg-[var(--color-green-900)] text-[#E9F1EC] p-4'>
        <div className='flex items-center gap-2 px-2 pb-4'>
          <div className='w-8 h-8 rounded-lg bg-[var(--color-green-700)] grid place-items-center text-white font-bold font-serif'>
            S
          </div>
          <span className='text-sm font-bold leading-tight'>SIWES Placement System</span>
        </div>

        <span className='mx-2 mb-3 text-[10px] tracking-widest uppercase text-[#9FC3AE] border border-[#2C5A42] rounded px-2 py-1 w-fit'>
          Employer
        </span>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-sm ${
                isActive ? 'bg-[var(--color-green-700)] text-white font-semibold' : 'text-[#C9DCD1]'
              }`
            }
          >
            <span className='w-4 text-center'>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className='mt-auto flex items-center gap-2.5 px-2.5 py-2.5 text-sm text-[#9FB4A8] text-left'
        >
          <span className='w-4 text-center'>⏻</span>
          Log out
        </button>
      </aside>

      {/* Main column */}
      <div className='flex flex-col min-w-0'>
        {/* Topbar with verification mark */}
        <header className='flex items-center gap-3 bg-white border-b border-[var(--color-line)] px-4 md:px-6 py-3'>
          <div className='md:hidden w-8 h-8 rounded-lg bg-[var(--color-green-700)] grid place-items-center text-white font-bold font-serif'>
            S
          </div>
          <div className='ml-auto flex items-center gap-3'>
            {isVerified === true && (
              <span className='text-[9.5px] font-extrabold tracking-widest uppercase text-[var(--color-green-700)] border border-dashed border-[var(--color-green-700)] rounded px-2 py-0.5'>
                Verified
              </span>
            )}
            <span className='hidden sm:block text-sm text-[var(--color-ink-soft)]'>
              {user?.fullName}
            </span>
            <div className='w-8 h-8 rounded-full bg-[var(--color-green-100)] text-[var(--color-green-700)] grid place-items-center text-xs font-bold'>
              {initials}
            </div>
          </div>
        </header>

        <main className='flex-1 p-4 md:p-6 pb-24 md:pb-6'>
          {/* Verification banner: shown only when not yet verified. */}
          {isVerified === false && (
            <div className='mb-4 bg-[var(--color-amber-100)] border border-[#EAD5AE] text-[#6B4E17] rounded-lg px-4 py-3 text-sm flex gap-2 items-start'>
              <b className='text-[var(--color-amber-600)]'>ℹ</b>
              <div>
                Your organisation is <b>awaiting verification</b>. You can post openings now, but
                they become visible to students only after a SIWES coordinator verifies your
                organisation.
              </div>
            </div>
          )}

          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className='md:hidden fixed bottom-0 left-0 right-0 flex justify-around bg-[var(--color-green-900)] border-t border-[#123324] py-2.5 px-1'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] ${
                  isActive ? 'text-white font-bold' : 'text-[#9FC3AE]'
                }`
              }
            >
              <span className='text-lg'>{item.icon}</span>
              {item.short}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
