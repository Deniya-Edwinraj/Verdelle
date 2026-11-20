import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { AuthShell, IconField } from './Login';
import { usePageMeta } from '../hooks/usePageMeta';

const schema = z
  .object({
    firstName: z.string().trim().min(1, 'Required'),
    lastName: z.string().trim().min(1, 'Required'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/\d/, 'Include at least one number'),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms to continue' }) }),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'Passwords don’t match' });

const STRENGTH = [
  { label: '', bar: 'bg-card' },
  { label: 'Weak', bar: 'bg-red-700/70' },
  { label: 'Fair', bar: 'bg-clay' },
  { label: 'Good', bar: 'bg-sage' },
  { label: 'Strong', bar: 'bg-botanical' },
];

export default function Register() {
  usePageMeta('Create Account');
  const { user, register: createUser } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });
  const pw = watch('password') || '';
  const strength = Math.min(4, (pw.length >= 8) + /[A-Za-z]/.test(pw) + /\d/.test(pw) + (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12));

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = async (d) => {
    await new Promise((r) => setTimeout(r, 500));
    createUser({ firstName: d.firstName, lastName: d.lastName, email: d.email }); // password intentionally discarded
    notify('Welcome to Verdelle — your account is ready');
    navigate('/account');
  };

  return (
    <AuthShell title="Create an account" subtitle="Save addresses, track orders and keep a wishlist." art="bird-of-paradise">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
        <IconField label="First name" icon={User} autoComplete="given-name" placeholder="Alex" error={errors.firstName?.message} {...register('firstName')} />
        <IconField label="Last name" icon={User} autoComplete="family-name" placeholder="Morgan" error={errors.lastName?.message} {...register('lastName')} />
        <div className="sm:col-span-2">
          <IconField label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
        </div>
        <div className="sm:col-span-2">
          <IconField label="Password" icon={Lock} type="password" autoComplete="new-password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
          <div className="mt-2 flex items-center gap-3" aria-hidden="true">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={`h-1 flex-1 rounded-full transition-colors ${strength >= n ? STRENGTH[strength].bar : 'bg-card'}`} />
              ))}
            </div>
            <span className="w-16 text-right text-[11px] font-medium text-muted">{pw ? STRENGTH[strength].label : ''}</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">8+ characters, with a letter and a number.</p>
        </div>
        <div className="sm:col-span-2">
          <IconField label="Confirm password" icon={ShieldCheck} type="password" autoComplete="new-password" placeholder="••••••••" error={errors.confirm?.message} {...register('confirm')} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-card/60 p-3.5 text-sm ring-1 ring-line/70">
            <input type="checkbox" {...register('terms')} className="mt-0.5" />
            <span className="text-ink/80">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-forest underline-offset-2 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy-policy" className="font-medium text-forest underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-xs text-red-800" role="alert">
              {errors.terms.message}
            </p>
          )}
        </div>
        <button
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-botanical hover:shadow-lift disabled:translate-y-0 disabled:opacity-60 sm:col-span-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Creating your account…
            </>
          ) : (
            <>
              Create account <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        <span className="h-px flex-1 bg-line" />
        Already a member?
        <span className="h-px flex-1 bg-line" />
      </div>
      <Link
        to="/login"
        className="inline-flex h-12 w-full items-center justify-center rounded-full border border-line text-sm font-semibold text-forest transition hover:border-forest hover:bg-forest hover:text-white"
      >
        Sign in
      </Link>
    </AuthShell>
  );
}
