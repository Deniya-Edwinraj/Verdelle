import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Sprout, Truck, RotateCcw, Leaf } from 'lucide-react';
import { Accordion, Field, PageHero } from '../components/ui';
import SocialLinks from '../components/layout/SocialLinks';
import { SITE } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please choose a topic'),
  message: z.string().trim().min(10, 'Please write at least 10 characters').max(2000, 'Please keep it under 2000 characters'),
});

const TOPICS = [
  [Sprout, 'Plant advice', 'Not sure which plant suits your space?'],
  [Truck, 'Orders & delivery', 'Questions about an order on its way.'],
  [RotateCcw, 'Returns', 'Something not right? We’ll help.'],
  [Leaf, 'Wholesale & events', 'Greening an office or event?'],
];

export default function Contact() {
  usePageMeta('Contact Us', 'Get in touch with the Verdelle team for plant advice, orders and returns.');
  const [sent, setSent] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { subject: '' } });

  const onSubmit = async (d) => {
    await new Promise((r) => setTimeout(r, 600)); // DEMO — connect to your helpdesk or email API
    setSent(d.name.split(' ')[0]);
    reset();
  };

  return (
    <>
      <PageHero eyebrow="We’d love to hear from you" title="Get in Touch" subtitle="Plant questions, order help or just want to share a photo of your new monstera? We’re here." crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} plants={['peace-lily', 'zz']} />
      <section className="container py-12 md:py-16">
        <ul className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {TOPICS.map(([Icon, t, b]) => (
            <li key={t}>
              <button
                type="button"
                onClick={() => {
                  setValue('subject', t, { shouldValidate: true });
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex h-full w-full flex-col items-start rounded-card bg-card p-4 text-left transition hover:bg-mist"
              >
                <Icon size={20} className="text-botanical" />
                <span className="mt-2 font-semibold text-forest">{t}</span>
                <span className="mt-0.5 text-xs text-muted">{b}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <div id="contact-form" className="scroll-mt-24">
            {sent ? (
              <div className="rounded-2xl border border-line bg-white p-10 text-center" role="status">
                <CheckCircle2 size={40} strokeWidth={1.5} className="mx-auto text-botanical" />
                <h2 className="mt-4 text-3xl font-semibold">Thank you, {sent}!</h2>
                <p className="mt-2 text-muted">We’ve received your message and will get back to you within 1–2 business days.</p>
                <button className="btn-outline mt-6" onClick={() => setSent(null)}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-2xl bg-white p-6 shadow-soft ring-1 ring-line/70 sm:grid-cols-2 md:p-8">
                <Field label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
                <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
                <Field as="select" className="sm:col-span-2" label="Subject" error={errors.subject?.message} {...register('subject')}>
                  <option value="">Choose a topic…</option>
                  {TOPICS.map(([, t]) => (
                    <option key={t}>{t}</option>
                  ))}
                  <option>Something else</option>
                </Field>
                <Field as="textarea" className="sm:col-span-2" label="Message" error={errors.message?.message} {...register('message')} />
                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <button className="btn-primary h-11 px-8" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send Message'}</button>
                </div>
              </form>
            )}
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl bg-mist/50 p-6 md:p-8">
              <h2 className="text-2xl font-semibold">Contact details</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3"><Mail size={18} className="mt-0.5 text-forest" /> {SITE.email}</li>
                <li className="flex gap-3"><Phone size={18} className="mt-0.5 text-forest" /> {SITE.phone}</li>
                <li className="flex gap-3"><MapPin size={18} className="mt-0.5 text-forest" /> {SITE.address}</li>
                <li className="flex gap-3"><Clock size={18} className="mt-0.5 text-forest" /> {SITE.hours}</li>
              </ul>
              <p className="mb-2 mt-6 text-sm font-semibold">Follow along</p>
              <SocialLinks />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Quick answers</h2>
              <Accordion
                defaultOpen={-1}
                items={[
                  { title: 'How are plants packed?', content: <p>Soil is secured, leaves are supported and boxes are marked “live plant”.</p> },
                  { title: 'What if my plant arrives damaged?', content: <p>Every plant is covered by our {SITE.guaranteeDays}-day guarantee — send us a photo and we’ll arrange a replacement or refund.</p> },
                  { title: 'Are your plants pet-safe?', content: <p>Each plant shows its pet-safety status. Many popular plants are toxic to pets — check before buying.</p> },
                ]}
              />
              <Link to="/faq" className="mt-4 inline-block text-sm font-medium text-forest underline">See all FAQs</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
