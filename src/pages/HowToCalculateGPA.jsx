// src/pages/HowToCalculateGPA.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function HowToCalculateGPA() {
  return (
    <>
      <Helmet>
        <title>How to Calculate GPA – Step by Step Guide | Maniesta Suite</title>
        <meta
          name="description"
          content="Learn how to calculate your GPA step by step with examples. Understand grade points, credit hours, and use our free GPA calculator."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/how-to-calculate-gpa" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">How to Calculate GPA</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">A simple, step‑by‑step guide to calculating your Grade Point Average (GPA).</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">What You Need</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your course grades (A, B+, C, etc.)</li>
                <li>Credit hours for each course (usually 1–6)</li>
                <li>Your school’s grade point scale (e.g., A = 4.0)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Step‑by‑Step Calculation</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">1. Convert each grade to points</h3>
                  <p>Use your school’s scale. For a typical 4.0 scale: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0. (See <Link to="/grading-scale-guide" className="text-brand-500 hover:underline">full grading scale guide</Link>).</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">2. Multiply by credit hours</h3>
                  <p>For each course: <strong>Grade points × Credit hours = Quality points</strong>.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">3. Add up quality points and credit hours</h3>
                  <p>Sum all quality points from every course. Sum all credit hours.</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200">4. Divide</h3>
                  <p><strong>GPA = Total quality points ÷ Total credit hours</strong></p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Example Calculation</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3 font-semibold">Course</th>
                      <th className="text-left p-3 font-semibold">Credits</th>
                      <th className="text-left p-3 font-semibold">Grade</th>
                      <th className="text-left p-3 font-semibold">Grade Points</th>
                      <th className="text-left p-3 font-semibold">Quality Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3">Math</td><td className="p-3">3</td><td className="p-3">A</td><td className="p-3">4.0</td><td className="p-3">12.0</td></tr>
                    <tr><td className="p-3">English</td><td className="p-3">3</td><td className="p-3">B+</td><td className="p-3">3.3</td><td className="p-3">9.9</td></tr>
                    <tr><td className="p-3">Science</td><td className="p-3">4</td><td className="p-3">A-</td><td className="p-3">3.7</td><td className="p-3">14.8</td></tr>
                    <tr><td className="p-3">History</td><td className="p-3">2</td><td className="p-3">C</td><td className="p-3">2.0</td><td className="p-3">4.0</td></tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700 font-semibold"><td className="p-3">Total</td><td className="p-3">12</td><td className="p-3"></td><td className="p-3"></td><td className="p-3">40.7</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3"><strong>GPA = 40.7 ÷ 12 = 3.39</strong></p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">What’s the difference between weighted and unweighted GPA?</h3>
                  <p>Unweighted uses the standard 0‑4.0 scale; weighted adds extra points for AP/IB courses (e.g., A = 5.0). Our calculator uses unweighted by default.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Can I use the same method for a 5.0 or 10.0 scale?</h3>
                  <p>Yes – only the grade point values change. Check your school’s conversion table.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Related Resources</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><Link to="/gpa-guide" className="text-brand-500 hover:underline">GPA Guide (full overview)</Link></li>
                <li><Link to="/grading-scale-guide" className="text-brand-500 hover:underline">GPA Grading Scale Guide</Link></li>
                <li><Link to="/gpa-improvement-tips" className="text-brand-500 hover:underline">GPA Improvement Tips</Link></li>
              </ul>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center gap-2">Calculate Your GPA Now →</Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}