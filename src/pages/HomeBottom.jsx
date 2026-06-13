// src/pages/HomeBottom.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { StarIcon, ArrowRightIcon, RocketIcon } from "../components/icons";

export default function HomeBottom({
  favoriteTools,
  recentToolPath,
  memoizedTools,
  prefersReducedMotion,
}) {
  const featuresHeadingMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
      };
  const finalCTAMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
      };

  return (
    <>
      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 sm:px-6">
        <motion.div
          {...featuresHeadingMotion}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Everything a student needs
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Eight powerful tools + a smart dashboard in one unified experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {memoizedTools.map((tool, i) => {
            const isFavorited = favoriteTools.includes(
              tool.path.replace("/", ""),
            );
            const isRecent = recentToolPath === tool.path;

            const cardMotion = prefersReducedMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 40 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-50px" },
                  transition: { delay: i * 0.05 },
                };

            return (
              <motion.div key={tool.name} {...cardMotion}>
                <Link
                  to={tool.path}
                  className="glass-card group relative overflow-hidden p-4 sm:p-6 h-full block"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                  />
                  <div className="relative z-10">
                    {isRecent && (
                      <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg z-20 inline-flex items-center gap-1">
                        Continue <ArrowRightIcon className="w-3 h-3" />
                      </span>
                    )}
                    {isFavorited && (
                      <span className="absolute top-0 left-0 text-yellow-400 z-20">
                        <StarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    )}
                    <div
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} p-2 sm:p-3 text-white mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <tool.Icon className="w-full h-full" />
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {tool.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl pb-16 sm:pb-20">
        <motion.div
          {...finalCTAMotion}
          className="glass-card p-6 sm:p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="relative z-10">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Ready to simplify your studies?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto">
              Join thousands of students who trust Maniesta Suite for accurate,
              fast academic calculations and a personalised dashboard.
            </p>
            <Link
              to="/dashboard"
              className="btn-primary text-base sm:text-lg px-6 py-3 sm:px-10 sm:py-4 inline-flex items-center gap-2"
            >
              Launch Dashboard <RocketIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}