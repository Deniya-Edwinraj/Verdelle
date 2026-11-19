import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DemoNotice, Field, LeafMark } from '../components/ui';
import { FramedPlant } from '../components/art/scenes';
import { usePageMeta } from '../hooks/usePageMeta';

const schema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function AuthShell({ title, subtitle, children, art = 'monstera' }) {
  return (
    <section className="container grid items-stretch gap-10 py-10 md:py-16 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden rounded-2xl bg-mist lg:block">
        <FramedPlant species={art} pot="basket" seed={`auth-${art}`} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="mx-auto w-full max-w-md py-4">
        <LeafMark className="h-14 w-14" />
        <h1 className="mt-4 text-4xl">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

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
      <DemoNotice className="mt-6">
        Demo sign-in: there’s no authentication server yet, so any email and a 6+ character password will open a local demo profile in this browser. Passwords are
        never stored.
      </DemoNotice>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <div className="flex justify-end">
          <button type="button" onClick={() => notify('Password reset requires an auth backend — coming soon.', { type: 'info' })} className="text-sm text-forest underline">
            Forgot password?
          </button>
        </div>
        <button className="btn-primary h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New to Verdelle?{' '}
        <Link to="/register" className="font-medium text-forest underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
