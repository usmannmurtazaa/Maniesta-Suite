import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const tools = [
  { name: 'GPA Calculator', path: '/gpa', icon: '📊', desc: 'Compute semester GPA instantly.' },
  { name: 'CGPA Calculator', path: '/cgpa', icon: '🎓', desc: 'Cumulative performance tracking.' },
  { name: 'Calculator', path: '/calculator', icon: '🧮', desc: 'Normal & scientific modes.' },
  { name: 'Unit Converter', path: '/converter', icon: '⚖️', desc: 'Length, currency, temperature…' },
  { name: 'Interest', path: '/interest', icon: '💰', desc: 'Simple, compound, loan EMI.' },
  { name: 'Contact', path: '/contact', icon: '✉️', desc: 'Get in touch with our team.' },
];

const stats = [
  { label: 'Calculators', value: 7 },
  { label: 'Countries', value: 120 },
  { label: 'Students', value: '50k+' },
];

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="pt-8">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="glass-card max-w-4xl mx-auto p-10 md:p-16 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gradient mb-6">Academic Tools,<br />Redesigned.</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">Maniesta Suite provides elegant, intuitive calculators for students. GPA, CGPA, conversions, and more – all in one place.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/gpa" className="btn-primary">Start calculating →</Link>
            <a href="#features" className="btn-secondary">Explore tools</a>
          </div>
        </motion.div>
      </section>
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: i * 0.1 }} className="glass p-6 rounded-2xl">
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="features" className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Everything a student needs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, i) => (
            <motion.div key={tool.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.05 }}>
              <Link to={tool.path} className="glass-card p-6 h-full block group">
                <span className="text-4xl mb-4 block">{tool.icon}</span>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-500 transition-colors">{tool.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 max-w-3xl pb-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to simplify your studies?</h2>
          <Link to="/gpa" className="btn-primary">Get started for free</Link>
        </motion.div>
      </section>
    </div>
  );
}