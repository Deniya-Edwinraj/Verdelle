import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const schema = z.object({ email: z.string().trim().min(1, 'Please enter your email').email('Please enter a valid email address') });

/**
 * Demo subscription: the address is saved only in this browser.
 * Connect `onSubscribe` to your email provider (Klaviyo, Mailchimp, etc.) to go live.
 */
export default function NewsletterForm({ variant = 'bar' }) {
  const [subs, setSubs] = useLocalStorage('gn_newsletter', []);
  const [done, setDone] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    await new Promise((r) => setTimeout(r, 400));
    const exists = subs.includes(email.toLowerCase());
    if (!exists) setSubs([...subs, email.toLowerCase()]);
    setDone(exists ? 'already' : 'new');
    reset();
  };

  if (variant === 'pill') {
    return (
      <div className="w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Newsletter sign-up"
          className={`flex w-full items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-lift ring-1 transition focus-within:ring-2 ${errors.email ? 'ring-[#FFD9CC] focus-within:ring-[#FFD9CC]' : 'ring-white/40 focus-within:ring-sage'}`}
        >
          <label htmlFor="nl-pill" className="sr-only">
            Email address
          </label>
          <Mail size={17} className="shrink-0 text-sage" aria-hidden="true" />
          <input
            id="nl-pill"
            type="email"
            placeholder="Your email address"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby="nl-pill-msg"
            className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted/70 focus:outline-none"
            {...register('email', { onChange: () => setDone(null) })}
          />
          <button className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-forest px-5 text-sm font-semibold text-white transition hover:bg-botanical disabled:opacity-70" disabled={isSubmitting}>
            {isSubmitting ? 'Joining…' : 'Subscribe'}
            <ArrowRight size={15} className="hidden transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
          </button>
        </form>
        <div id="nl-pill-msg" aria-live="polite" className="mt-2.5 min-h-[18px] pl-5 text-xs">
          {errors.email && <span className="text-[#FFD9CC]">{errors.email.message}</span>}
          {done && (
            <span className="inline-flex items-center gap-1 text-white">
              <CheckCircle2 size={13} />
              {done === 'already' ? 'You’re already on the list.' : 'You’re in! Welcome to the Verdelle community.'}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={variant === 'bar' ? 'w-full md:max-w-md' : ''}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full gap-2" aria-label="Newsletter sign-up">
        <label htmlFor={`nl-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${variant}`}
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={`nl-${variant}-msg`}
          className={`field h-11 flex-1 ${errors.email ? 'field-error' : ''}`}
          {...register('email', { onChange: () => setDone(null) })}
        />
        <button className="btn-primary h-11 px-6 ring-1 ring-white/20" disabled={isSubmitting}>
          {isSubmitting ? 'Joining…' : 'Subscribe'}
        </button>
      </form>
      <div id={`nl-${variant}-msg`} aria-live="polite" className="mt-1.5 min-h-[18px] text-xs">
        {errors.email && <span className="text-[#FFD9CC]">{errors.email.message}</span>}
        {done && (
          <span className="inline-flex items-center gap-1 text-white">
            <CheckCircle2 size={13} />
            {done === 'already' ? 'You’re already on the list.' : 'You’re in! Welcome to the Verdelle community.'}
          </span>
        )}
      </div>
    </div>
  );
}
