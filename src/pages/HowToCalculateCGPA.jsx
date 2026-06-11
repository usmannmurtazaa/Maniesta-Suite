// src/pages/HowToCalculateCGPA.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function HowToCalculateCGPA() {
  return (
    <>
      <Helmet>
        <title>How to Calculate CGPA – Cumulative GPA Guide | Maniesta Suite</title>
        <meta
          name="description"
          content="Learn how to calculate your CGPA (Cumulative Grade Point Average) across multiple semesters. Examples and free CGPA calculator."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/how-to-calculate-cgpa" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">How to Calculate CGPA</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">CGPA (Cumulative Grade Point Average) tracks your overall academic performance.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">What Is CGPA?</h2>
              <p>CGPA is the average of your GPA across all completed semesters. Unlike semester GPA, CGPA does not reset – it accumulates and is used for graduation, scholarships, and job applications.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Step‑by‑Step Calculation</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>List your semester GPAs</strong> – e.g., Semester 1: 3.2, Semester 2: 3.6, Semester 3: 3.4.</li>
                <li><strong>Add them all together</strong> – 3.2 + 3.6 + 3.4 = 10.2.</li>
                <li><strong>Divide by the number of semesters</strong> – 10.2 ÷ 3 = <strong>3.4 CGPA</strong>.</li>
              </ol>
              <p className="mt-2">If your semesters have different credit loads (e.g., some part‑time), use <strong>weighted average</strong> – multiply each GPA by its credits, sum, then divide by total credits.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Example (Weighted by Credits)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr><th className="p-3">Semester</th><th className="p-3">GPA</th><th className="p-3">Credits</th><th className="p-3">GPA × Credits</th></tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3">1</td><td className="p-3">3.0</td><td className="p-3">15</td><td className="p-3">45.0</td></tr>
                    <tr><td className="p-3">2</td><td className="p-3">3.5</td><td className="p-3">18</td><td className="p-3">63.0</td></tr>
                    <tr><td className="p-3">3</td><td className="p-3">3.2</td><td className="p-3">15</td><td className="p-3">48.0</td></tr>
                    <tr className="border-t font-semibold"><td className="p-3">Total</td><td className="p-3"></td><td className="p-3">48</td><td className="p-3">156.0</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2"><strong>CGPA = 156.0 ÷ 48 = 3.25</strong></p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Can CGPA decrease even if I get a good GPA?</h3>
                  <p>Yes. If your current CGPA is high, a new semester GPA lower than your CGPA will pull it down. Use our <Link to="/gpa" className="text-brand-500 hover:underline">Target GPA Calculator</Link> to plan.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Is CGPA the same as overall percentage?</h3>
                  <p>No – CGPA is an average of grade points, not a percentage. See <Link to="/gpa-to-percentage" className="text-brand-500 hover:underline">GPA to Percentage Guide</Link>.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Related Resources</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><Link to="/cgpa-vs-gpa" className="text-brand-500 hover:underline">CGPA vs GPA – Key Differences</Link></li>
                <li><Link to="/how-to-calculate-gpa" className="text-brand-500 hover:underline">How to Calculate GPA</Link></li>
                <li><Link to="/gpa-improvement-tips" className="text-brand-500 hover:underline">GPA Improvement Tips</Link></li>
              </ul>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/cgpa" className="btn-primary inline-flex items-center gap-2">Calculate Your CGPA Now →</Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}