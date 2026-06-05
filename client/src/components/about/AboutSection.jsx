import { motion } from 'framer-motion';

const values = [
  { title: 'Founder', desc: 'Usman Murtaza', icon: '👤' },
  { title: 'Mission', desc: 'Provide intuitive, fast, and reliable calculators for students worldwide.', icon: '🎯' },
  { title: 'Vision', desc: 'Become the go-to academic toolkit for every student.', icon: '🔭' },
  { title: 'Purpose', desc: 'Simplify complex calculations so you can focus on learning.', icon: '💡' },
];

export default function AboutSection() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-10 md:p-16 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gradient mb-6">Maniesta Suite</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Empowering students worldwide with a beautiful, all‑in‑one academic toolkit.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-8">
        {values.map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: i * 0.1 }} className="glass-card p-6 flex gap-5">
            <span className="text-3xl shrink-0">{item.icon}</span>
            <div>
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}