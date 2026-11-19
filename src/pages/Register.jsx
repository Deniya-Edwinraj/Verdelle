import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DemoNotice, Field } from '../components/ui';
import { AuthShell } from './Login';
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

export default function Register() {
  usePageMeta('Create Account');
  const { user, register: createUser } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  if (user) return <Navigate to="/account" replace />;

  const onSubmit = async (d) => {
    await new Promise((r) => setTimeout(r, 500));
    createUser({ firstName: d.firstName, lastName: d.lastName, email: d.email }); // password intentionally discarded
    notify('Your demo profile is ready');
    navigate('/account');
  };

  return (
    <AuthShell title="Create an account" subtitle="Save addresses, track orders and keep a wishlist." art="bird-of-paradise">
      <DemoNotice className="mt-6">
        Demo registration: your profile is saved only in this browser and your password is not stored. Connect an authentication provider before launch.
      </DemoNotice>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        <Field label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
        <Field className="sm:col-span-2" label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="new-password" hint="8+ characters, a letter and a number" error={errors.password?.message} {...register('password')} />
        <Field label="Confirm password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" {...register('terms')} className="mt-1 " />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="text-forest underline">Terms</Link> and{' '}
              <Link to="/privacy-policy" className="text-forest underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms && <p className="mt-1 text-xs text-red-800" role="alert">{errors.terms.message}</p>}
        </div>
        <button className="btn-primary h-12 sm:col-span-2" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-forest underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
