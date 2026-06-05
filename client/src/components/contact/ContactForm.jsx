import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactEmail } from '../../services/emailjs';
import { validateEmail } from '../../utils/validators';
import Spinner from '../common/Spinner';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!validateEmail(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Required';
    if (!form.message.trim()) errs.message = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await sendContactEmail(form);
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', message: 'Failed to send. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8">Get in touch</h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="relative">
            <input name="name" value={form.name} onChange={handleChange} className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-brand-500'}`} placeholder=" " required />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">Full name *</label>
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          <div className="relative">
            <input type="email" name="email" value={form.email} onChange={handleChange} className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-brand-500'}`} placeholder=" " required />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">Email address *</label>
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>
          <div className="relative">
            <input name="subject" value={form.subject} onChange={handleChange} className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors ${errors.subject ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-brand-500'}`} placeholder=" " required />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">Subject *</label>
            {errors.subject && <span className="text-red-500 text-xs">{errors.subject}</span>}
          </div>
          <div className="relative">
            <textarea name="message" rows="4" value={form.message} onChange={handleChange} className={`peer w-full bg-transparent border-b-2 pb-2 pt-4 text-lg outline-none transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-brand-500'}`} placeholder=" " required />
            <label className="absolute left-0 top-1 text-sm text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-brand-500">Message *</label>
            {errors.message && <span className="text-red-500 text-xs">{errors.message}</span>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg">
            {loading ? <Spinner /> : 'Send message'}
          </button>
          {status.message && <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{status.message}</p>}
        </form>
      </motion.div>
    </div>
  );
}