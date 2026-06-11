// src/pages/GPA_Guide.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function GPA_Guide() {
  return (
    <>
      <Helmet>
        <title>GPA Guide – How to Calculate Grade Point Average | Maniesta Suite</title>
        <meta
          name="description"
          content="Learn what GPA is, how to calculate it step by step, and use our free GPA calculator. Includes examples for 4.0, 5.0, and 10.0 scales."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/gpa-guide" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">GPA Guide – What Is GPA and How to Calculate It</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Your complete reference for Grade Point Average.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">What Does GPA Stand For?</h2>
              <p>GPA stands for <strong>Grade Point Average</strong>. It is a number that represents your average academic performance over a semester or course.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Is GPA Important?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Determines eligibility for scholarships and honours programmes.</li>
                <li>Used by employers (especially for internships and graduate roles).</li>
                <li>Required for graduate school admissions.</li>
                <li>Helps you track your academic progress.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How to Calculate Your GPA (Step by Step)</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>Know your grade scale</strong> – Most universities use 4.0, 5.0, or 10.0. Our calculator supports all three.</li>
                <li><strong>Convert each grade to points</strong> – Example 4.0 scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0. (See full table below).</li>
                <li><strong>Multiply by credit hours</strong> – Grade points × credit hours = quality points.</li>
                <li><strong>Add everything up</strong> – Sum all quality points and sum all credit hours.</li>
                <li><strong>Divide</strong> – GPA = Total quality points ÷ Total credit hours.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Example Calculation (4.0 Scale)</h2>
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
              <p className="mt-3">GPA = 40.7 ÷ 12 = <strong>3.39</strong></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Weighted vs Unweighted GPA</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Unweighted</strong> – uses 0‑4.0 scale, regardless of course difficulty.</li>
                <li><strong>Weighted</strong> – adds extra points for AP/IB/honours courses (e.g., A = 5.0). Our calculator uses unweighted by default – check with your school.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Different Grading Scales (4.0, 5.0, 10.0)</h2>
              <p>Maniesta Suite supports all three. The calculation method remains the same – only the grade point values change. For a 5.0 scale, an A = 5.0; for a 10.0 scale, a perfect score = 10.0.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Tips to Improve Your GPA</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Focus on high‑credit courses – they impact your GPA more.</li>
                <li>Retake courses if your school allows grade replacement.</li>
                <li>Attend office hours and form study groups.</li>
                <li>Use the <strong>Target GPA Calculator</strong> inside our tool to see what grades you need in future courses.</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center gap-2">Calculate Your GPA Now →</Link>
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