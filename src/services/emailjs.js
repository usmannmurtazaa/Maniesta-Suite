import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

let initialized = false;
function init() {
  if (initialized || !PUBLIC_KEY) return;
  emailjs.init(PUBLIC_KEY);
  initialized = true;
}
init();

export async function sendContactEmail(formData) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) throw new Error('EmailJS not configured');
  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    subject: formData.subject,
    message: formData.message,
    to_name: 'Maniesta Support',
  };
  return await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
}