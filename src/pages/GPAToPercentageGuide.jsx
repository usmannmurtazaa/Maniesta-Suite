// src/pages/GPAToPercentageGuide.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Inline SVG icon – replaces ⚠️
const WarningIcon = () => (
  <svg
    className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.56 20h18.88a1 1 0 00.87-1.28l-8.6-14.86a1 1 0 00-1.72 0z"
    />
  </svg>
);

export default function GPAToPercentageGuide() {
  return (
    <>
      <Helmet>
        <title>GPA to Percentage Guide – Conversion Methods | Maniesta Suite</title>
        <meta
          name="description"
          content="Convert GPA to percentage using standard formulas. Learn how different scales (4.0, 5.0, 10.0) convert to percentages."
        />
        <meta
          name="keywords"
          content="GPA to percentage, convert GPA, percentage formula, 4.0 scale, 5.0 scale, 10.0 scale, academic tools, Maniesta Suite"
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/gpa-to-percentage" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-4">GPA to Percentage Guide</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">How to convert your Grade Point Average to a percentage for applications or personal record.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Why Convert GPA to Percentage?</h2>
              <p>Some scholarship applications, job portals, or graduate schools ask for percentage scores. Knowing your approximate percentage helps you compare with other grading systems.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Conversion Formulas (Common Methods)</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium">4.0 Scale → Percentage</h3>
                  <p><strong>Percentage = (GPA ÷ 4.0) × 100</strong></p>
                  <p className="text-sm text-gray-500">Example: 3.2 GPA → (3.2 ÷ 4) × 100 = 80%</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">5.0 Scale → Percentage</h3>
                  <p><strong>Percentage = (GPA ÷ 5.0) × 100</strong></p>
                  <p className="text-sm text-gray-500">Example: 4.0 GPA → (4 ÷ 5) × 100 = 80%</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">10.0 Scale → Percentage</h3>
                  <p><strong>Percentage = GPA × 10</strong> (for some Indian universities)</p>
                  <p className="text-sm text-gray-500">Example: 8.5 CGPA → 85%</p>
                  <p className="text-sm text-gray-500">Alternative formula: (GPA ÷ 10) × 100 = same result.</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <WarningIcon />
                <span>Always check your institution’s official conversion method – they may use a different multiplier.</span>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Quick Reference Table (4.0 Scale)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead><tr><th className="p-3">GPA</th><th className="p-3">Percentage</th><th className="p-3">Letter Grade</th></tr></thead>
                  <tbody>
                    <tr><td className="p-3">4.0</td><td className="p-3">100%</td><td className="p-3">A+</td></tr>
                    <tr><td className="p-3">3.7</td><td className="p-3">92.5%</td><td className="p-3">A-</td></tr>
                    <tr><td className="p-3">3.3</td><td className="p-3">82.5%</td><td className="p-3">B+</td></tr>
                    <tr><td className="p-3">3.0</td><td className="p-3">75%</td><td className="p-3">B</td></tr>
                    <tr><td className="p-3">2.7</td><td className="p-3">67.5%</td><td className="p-3">B-</td></tr>
                    <tr><td className="p-3">2.0</td><td className="p-3">50%</td><td className="p-3">C</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Is there a universal conversion formula?</h3>
                  <p>No – different schools and countries use different scales. Always verify with the organisation requesting the percentage.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Can I convert CGPA to percentage using the same method?</h3>
                  <p>Yes – apply the same formula to your CGPA (e.g., CGPA 3.5 on a 4.0 scale = 87.5%).</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">What’s a good GPA in percentage terms?</h3>
                  <p>Above 80% (3.2+ on 4.0 scale) is generally considered good. For competitive programmes, aim for 85%+ (3.4+).</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Related Resources</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><Link to="/grading-scale-guide" className="text-brand-500 hover:underline">GPA Grading Scale Guide</Link></li>
                <li><Link to="/how-to-calculate-gpa" className="text-brand-500 hover:underline">How to Calculate GPA</Link></li>
                <li><Link to="/cgpa-vs-gpa" className="text-brand-500 hover:underline">CGPA vs GPA</Link></li>
              </ul>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center gap-2">Calculate Your GPA First →</Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}