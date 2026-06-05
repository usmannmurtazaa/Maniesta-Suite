import { motion } from "framer-motion";

const values = [
  { title: "Founder", desc: "Usman Murtaza", icon: "👤" },
  {
    title: "Mission",
    desc: "Provide intuitive, fast, and reliable calculators for students worldwide.",
    icon: "🎯",
  },
  {
    title: "Vision",
    desc: "Become the go-to academic toolkit for every student.",
    icon: "🔭",
  },
  {
    title: "Purpose",
    desc: "Simplify complex calculations so you can focus on learning.",
    icon: "💡",
  },
];

export default function AboutSection() {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card p-10 md:p-16 text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-gradient mb-6">
          Maniesta Suite
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Empowering students worldwide with a beautiful, all‑in‑one academic
          toolkit.
        </p>
      </motion.div>

      {/* Story & Founder */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gradient">Our Story</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Maniesta Suite was born from the frustration of cluttered academic
            tools. Our founder, Usman Murtaza, envisioned a single, elegant
            platform where students could calculate, convert, and track their
            academic progress without ever leaving the page. Today, we serve
            thousands of students globally, continuously refining our
            calculators and design.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 flex items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-2xl font-bold text-white">
            UM
          </div>
          <div>
            <h3 className="text-xl font-semibold">Usman Murtaza</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Founder & Developer
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
              "I believe every student deserves powerful tools that are
              beautiful and intuitive."
            </p>
          </div>
        </motion.div>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 gap-8">
        {values.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex gap-5 group hover:shadow-2xl hover:shadow-brand-500/10 transition-shadow"
          >
            <span className="text-3xl shrink-0 transform group-hover:scale-125 transition-transform duration-300">
              {item.icon}
            </span>
            <div>
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
