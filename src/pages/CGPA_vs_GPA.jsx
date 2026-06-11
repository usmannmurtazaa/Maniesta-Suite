// src/pages/CGPA_vs_GPA.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function CGPA_vs_GPA() {
  return (
    <>
      <Helmet>
        <title>CGPA vs GPA – Key Differences & How to Calculate | Maniesta Suite</title>
        <meta
          name="description"
          content="Understand the difference between CGPA and GPA, when to use each, and how to calculate both. Free online calculators for students."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/cgpa-vs-gpa" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">CGPA vs GPA – What’s the Difference?</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Two important metrics every student should understand.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Definitions</h2>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">What is GPA?</h3>
                <p>GPA (Grade Point Average) measures your performance in a <strong>single semester</strong>. It is calculated using the courses you took during that term only.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">What is CGPA?</h3>
                <p>CGPA (Cumulative Grade Point Average) measures your performance across <strong>all completed semesters</strong>. It is the average of all your semester GPAs.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Key Differences at a Glance</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white/50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-3 font-semibold">Aspect</th>
                      <th className="text-left p-3 font-semibold">GPA</th>
                      <th className="text-left p-3 font-semibold">CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="p-3">Time period</td><td className="p-3">One semester</td><td className="p-3">Entire academic programme</td></tr>
                    <tr><td className="p-3">Calculation</td><td className="p-3">Average of course grades in a term</td><td className="p-3">Average of semester GPAs</td></tr>
                    <tr><td className="p-3">Resets?</td><td className="p-3">Yes, each semester</td><td className="p-3">No, builds over time</td></tr>
                    <tr><td className="p-3">Used for</td><td className="p-3">Term‑specific awards, probation</td><td className="p-3">Graduation, scholarships, job applications</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">When to Use GPA vs CGPA</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2 text-brand-500">Use GPA for…</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Checking your academic standing after a single semester.</li>
                    <li>Applying for semester‑based scholarships.</li>
                    <li>Identifying which semesters need improvement.</li>
                  </ul>
                </div>
                <div className="glass p-4 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2 text-brand-500">Use CGPA for…</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Graduation requirements (most schools require a minimum CGPA).</li>
                    <li>Long‑term job applications and graduate school admissions.</li>
                    <li>Tracking overall academic progress.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How to Convert GPA to CGPA (and Vice Versa)</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>GPA to CGPA:</strong> Average your semester GPAs. Example: Semester 1 GPA = 3.2, Semester 2 GPA = 3.6 → CGPA = (3.2 + 3.6) ÷ 2 = 3.4.</li>
                <li><strong>CGPA to GPA:</strong> Not directly convertible because CGPA is an average. However, you can estimate that your future semester GPA needs to be above your current CGPA to raise it.</li>
              </ul>
              <p className="mt-2">Use our <strong>Target GPA Calculator</strong> (inside the GPA tool) to see what GPA you need in upcoming semesters to achieve a desired CGPA.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Example Scenarios</h2>
              <div className="space-y-3">
                <p><strong>First year student:</strong> After two semesters: GPA1 = 3.0, GPA2 = 3.4 → CGPA = 3.2. The student’s performance is improving, but the CGPA is dragged down by the first semester.</p>
                <p><strong>Final year student:</strong> CGPA = 3.6. To graduate with honours (≥3.7), the student needs an average GPA of 4.0 in the last two semesters. The Target GPA calculator helps plan this.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Both Matter for Students</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Employers</strong> often ask for CGPA, but may also request transcripts showing semester GPAs.</li>
                <li><strong>Scholarships</strong> may require a minimum CGPA, but some term‑specific awards look at individual semester GPAs.</li>
                <li><strong>Self‑improvement</strong> – tracking both helps you identify strong and weak terms.</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center justify-center gap-2">Calculate Semester GPA →</Link>
            <Link to="/cgpa" className="btn-secondary inline-flex items-center justify-center gap-2">Calculate Cumulative CGPA →</Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}