import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginRequest } from '../../api/auth.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function Login() {
  // One state object holding both fields.
  const [form, setForm] = useState({ email: '', password: '' });

  // Tracks the request in progress and any error message.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // Updates whichever field changed, keyed by the input's name.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Sends the login request and handles the outcome.
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's default full-page reload
    setError('');
    setLoading(true);

    try {
      const res = await loginRequest(form.email, form.password);
      const { token, user } = res.data;

      // Save token + user in context and localStorage.
      login(user, token);

      // Route to the correct dashboard by role.
      if (user.role === 'student') navigate('/student/browse');
      else if (user.role === 'employer') navigate('/employer/dashboard');
      else if (user.role === 'coordinator') navigate('/coordinator/overview');
    } catch (err) {
      // Show the backend's message if present, else a generic one.
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      // Runs whether success or failure: stop the loading state.
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen grid place-items-center bg-[var(--color-paper)] px-4'>
      <div className='w-full max-w-md bg-white border border-[var(--color-line)] rounded-2xl p-7'>
        <div className='w-8 h-8 rounded-lg bg-[var(--color-green-700)] grid place-items-center text-white font-bold font-serif mb-3'>
          S
        </div>
        <h1 className='font-serif text-2xl text-[var(--color-green-900)] mb-1'>Welcome back</h1>
        <p className='text-sm text-[var(--color-ink-soft)] mb-5'>
          Log in as a student, employer or coordinator. Your dashboard is chosen by your role.
        </p>

        {/* Show an error if one exists. */}
        {error && (
          <div className='mb-4 rounded-lg bg-[var(--color-red-100)] text-[var(--color-red-600)] text-sm px-3 py-2'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <label className='text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1'>
            Email address
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder='you@example.com'
              className='font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm'
            />
          </label>

          <label className='text-sm font-semibold text-[var(--color-ink)] flex flex-col gap-1'>
            Password
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder='********'
              className='font-normal border border-[var(--color-line)] rounded-lg px-3 py-2.5 text-sm'
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='mt-1 rounded-lg bg-[var(--color-green-700)] text-white text-sm font-semibold py-3 disabled:opacity-60'
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className='text-center text-sm text-[var(--color-ink-soft)] mt-4'>
          New here?{' '}
          <Link to='/register' className='text-[var(--color-green-700)] font-semibold'>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
