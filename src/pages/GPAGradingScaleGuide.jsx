// src/pages/GPAGradingScaleGuide.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function GPAGradingScaleGuide() {
  return (
    <>
      <Helmet>
        <title>GPA Grading Scale Guide – 4.0, 5.0, 10.0 Scales | Maniesta Suite</title>
        <meta
          name="description"
          content="Understand different GPA scales (4.0, 5.0, 10.0). Grade point conversion tables and how to interpret your academic standing."
        />
        <meta
          name="keywords"
          content="GPA grading scale, 4.0 scale, 5.0 scale, 10.0 scale, academic standing, grade points, Maniesta Suite"
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/grading-scale-guide" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="font-hero text-3xl md:text-4xl font-bold text-gradient mb-4">GPA Grading Scale Guide</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Common grading scales and how to convert letter grades to points.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">4.0 Scale (Most Common)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead><tr><th className="p-3">Letter Grade</th><th className="p-3">Grade Points</th><th className="p-3">Percentage Equivalent (Typical)</th></tr></thead>
                  <tbody>
                    <tr><td className="p-3">A+ / A</td><td className="p-3">4.0</td><td className="p-3">88–100%</td></tr>
                    <tr><td className="p-3">A-</td><td className="p-3">3.7</td><td className="p-3">84–87%</td></tr>
                    <tr><td className="p-3">B+</td><td className="p-3">3.3</td><td className="p-3">80–83%</td></tr>
                    <tr><td className="p-3">B</td><td className="p-3">3.0</td><td className="p-3">76–79%</td></tr>
                    <tr><td className="p-3">B-</td><td className="p-3">2.7</td><td className="p-3">72–75%</td></tr>
                    <tr><td className="p-3">C+</td><td className="p-3">2.5</td><td className="p-3">68–71%</td></tr>
                    <tr><td className="p-3">C</td><td className="p-3">2.25</td><td className="p-3">64–67%</td></tr>
                    <tr><td className="p-3">C-</td><td className="p-3">2.0</td><td className="p-3">60–63%</td></tr>
                    <tr><td className="p-3">D+</td><td className="p-3">1.8</td><td className="p-3">55–59%</td></tr>
                    <tr><td className="p-3">D</td><td className="p-3">1.5</td><td className="p-3">50–54%</td></tr>
                    <tr><td className="p-3">F</td><td className="p-3">0.0</td><td className="p-3">Below 50%</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">5.0 Scale (Weighted / Some Universities)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead><tr><th className="p-3">Letter Grade</th><th className="p-3">Grade Points</th></tr></thead>
                  <tbody>
                    <tr><td className="p-3">A</td><td className="p-3">5.0</td></tr>
                    <tr><td className="p-3">B</td><td className="p-3">4.0</td></tr>
                    <tr><td className="p-3">C</td><td className="p-3">3.0</td></tr>
                    <tr><td className="p-3">D</td><td className="p-3">2.0</td></tr>
                    <tr><td className="p-3">E</td><td className="p-3">1.0</td></tr>
                    <tr><td className="p-3">F</td><td className="p-3">0.0</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2">Used in some countries (e.g., India, parts of Europe). Our <Link to="/gpa" className="text-brand-500 hover:underline">GPA calculator</Link> supports 5.0 scale.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">10.0 Scale (Common in India)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead><tr><th className="p-3">Grade</th><th className="p-3">Grade Points</th></tr></thead>
                  <tbody>
                    <tr><td className="p-3">10</td><td className="p-3">10.0</td></tr>
                    <tr><td className="p-3">9</td><td className="p-3">9.0</td></tr>
                    <tr><td className="p-3">8</td><td className="p-3">8.0</td></tr>
                    <tr><td className="p-3">7</td><td className="p-3">7.0</td></tr>
                    <tr><td className="p-3">6</td><td className="p-3">6.0</td></tr>
                    <tr><td className="p-3">5</td><td className="p-3">5.0</td></tr>
                    <tr><td className="p-3">4</td><td className="p-3">4.0</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Academic Standing (as calculated by Maniesta Suite)</h2>
              <p className="mb-2">Our GPA calculator determines academic standing based on the percentage of the maximum scale value. For the 4.0 scale, the thresholds are:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>3.70 – 4.00</strong> (92.5%+): Outstanding / Dean’s List</li>
                <li><strong>3.20 – 3.69</strong> (80–92.4%): Very Good Standing</li>
                <li><strong>2.60 – 3.19</strong> (65–79.9%): Good Standing</li>
                <li><strong>2.00 – 2.59</strong> (50–64.9%): Satisfactory</li>
                <li><strong>1.40 – 1.99</strong> (35–49.9%): Below Average</li>
                <li><strong>Below 1.40</strong> (&lt;35%): Academic Probation</li>
              </ul>
              <p className="mt-2">For other scales, the same percentage thresholds apply. Please note that each institution may vary – always check your university’s official policy.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Related Resources</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><Link to="/how-to-calculate-gpa" className="text-brand-500 hover:underline">How to Calculate GPA</Link></li>
                <li><Link to="/gpa-to-percentage" className="text-brand-500 hover:underline">GPA to Percentage Guide</Link></li>
                <li><Link to="/gpa-improvement-tips" className="text-brand-500 hover:underline">GPA Improvement Tips</Link></li>
              </ul>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center gap-2">Try Our GPA Calculator →</Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}