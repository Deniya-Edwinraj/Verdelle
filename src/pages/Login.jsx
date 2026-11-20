import { forwardRef, useId, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Eye, EyeOff, Heart, Lock, Mail, MapPin, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LeafMark } from '../components/ui';
import { FramedPlant } from '../components/art/scenes';
import { usePageMeta } from '../hooks/usePageMeta';

const schema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/** Splits a title so its final word can be set in an italic accent. */
function splitTitle(title) {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title, null];
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

const PERKS = [
  [Package, 'Track your orders', 'See every delivery in one place.'],
  [Heart, 'Keep a wishlist', 'Save the plants you love for later.'],
  [MapPin, 'Faster checkout', 'Saved addresses, fewer steps.'],
];

export function AuthShell({ title, subtitle, children, art = 'monstera' }) {
  const [lead, accent] = splitTitle(title);
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 h-[460px] w-[460px] rounded-full bg-mist/60 blur-3xl" />
      <div className="container relative grid items-stretch gap-6 py-8 md:py-10 lg:grid-cols-2 lg:gap-8">
        {/* Visual panel */}
        <div className="relative isolate hidden flex-col justify-between gap-8 overflow-hidden rounded-[32px] p-8 text-white shadow-lift lg:flex">
          <FramedPlant species={art} pot="basket" seed={`auth-${art}`} className="absolute inset-0 -z-10 h-full w-full" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900/95 via-forest-900/45 to-forest-900/20" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-botanical/40 blur-3xl" />

          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-md">
              <LeafMark className="h-7 w-7" light />
            </span>
            <span className="font-serif text-2xl text-white">Verdelle</span>
          </div>

          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-sage-soft">
              <span aria-hidden="true" className="h-px w-10 bg-sage-soft/60" />
              Your plant account
            </p>
            <p className="mt-3 max-w-md font-serif text-[32px] font-medium leading-[1.1] tracking-tight text-white">
              Grow a home that feels <em className="font-normal italic text-sage-soft">alive.</em>
            </p>
            <ul className="mt-6 space-y-2">
              {PERKS.map(([Icon, t, b]) => (
                <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/[0.08] px-4 py-3 ring-1 ring-white/15 backdrop-blur-md">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-sage-soft">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{t}</span>
                    <span className="block text-xs text-white/70">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-lift ring-1 ring-line/70 sm:p-8">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist">
              <LeafMark className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-[30px] font-medium leading-[1.1] tracking-tight md:text-[34px]">
              {lead}
              {accent && (
                <>
                  {' '}
                  <em className="font-normal italic text-botanical">{accent}</em>
                </>
              )}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pill input with a leading icon and optional show/hide toggle for passwords. */
export const IconField = forwardRef(function IconField({ label, icon: Icon, error, type = 'text', ...props }, ref) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
        {label}
      </label>
      <div
        className={`group flex h-12 items-center gap-3 rounded-2xl bg-card/70 px-4 ring-1 transition focus-within:bg-white focus-within:shadow-soft focus-within:ring-2 ${
          error ? 'ring-red-700/60 focus-within:ring-red-700/40' : 'ring-line/70 focus-within:ring-botanical/40'
        }`}
      >
        {Icon && <Icon size={17} className="shrink-0 text-muted transition group-focus-within:text-botanical" aria-hidden="true" />}
        <input
          id={id}
          ref={ref}
          type={isPassword && show ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-mist hover:text-forest"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-red-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default function Login() {
  usePageMeta('Sign In');
  const { user, login } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  if (user) return <Navigate to={state?.from || '/account'} replace />;

  const onSubmit = async ({ email }) => {
    await new Promise((r) => setTimeout(r, 500));
    login({ email }); // password is validated for format only and never stored
    notify('Welcome back!');
    navigate(state?.from || '/account');
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to view orders, addresses and your wishlist.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <IconField label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        <div>
          <IconField label="Password" icon={Lock} type="password" autoComplete="current-password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={() => notify('Password reset requires an auth backend — coming soon.', { type: 'info' })}
              className="text-xs font-medium text-botanical transition hover:text-forest hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>
        <button
          className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical hover:shadow-lift disabled:translate-y-0 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        <span className="h-px flex-1 bg-line" />
        New to Verdelle?
        <span className="h-px flex-1 bg-line" />
      </div>

      <Link
        to="/register"
        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-line text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white"
      >
        Create an account
      </Link>
    </AuthShell>
  );
}
