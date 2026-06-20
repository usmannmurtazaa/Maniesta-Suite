import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function GPAImprovementTips() {
  return (
    <>
      <Helmet>
        <title>GPA Improvement Tips – Raise Your Grades | Maniesta Suite</title>
        <meta
          name="description"
          content="Proven strategies to improve your GPA: study techniques, credit management, and using our target GPA calculator."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/gpa-improvement-tips" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="font-hero text-3xl md:text-4xl font-bold text-gradient mb-4">GPA Improvement Tips</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Practical strategies to boost your grades and raise your GPA.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">1. Prioritise High‑Credit Courses</h2>
              <p>A 3‑credit course affects your GPA more than a 1‑credit course. Invest extra study time in classes with higher credit hours.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">2. Use the Target GPA Calculator</h2>
              <p>Our <Link to="/gpa" className="text-brand-500 hover:underline">GPA calculator</Link> includes a “Target GPA” tool. Enter your current GPA, total credits, and remaining credits – it tells you exactly what GPA you need in future courses to reach your goal.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">3. Retake Courses (If Your School Allows)</h2>
              <p>Many universities allow grade replacement for failed or low‑grade courses. Check your school’s policy – retaking a D or F can dramatically lift your CGPA.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">4. Improve Study Habits</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Active recall</strong> – test yourself instead of re‑reading notes.</li>
                <li><strong>Spaced repetition</strong> – review material over increasing intervals.</li>
                <li><strong>Study groups</strong> – explain concepts to others to solidify understanding.</li>
                <li><strong>Office hours</strong> – ask professors for clarification before exams.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">5. Manage Your Time Wisely</h2>
              <p>Use a digital calendar or planner. Allocate dedicated blocks for difficult subjects early in the day when your focus is sharpest.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">6. Monitor Your Progress</h2>
              <p>After every exam, calculate your potential GPA. Identify weak areas and adjust your strategy immediately – don’t wait until the end of the semester.</p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading text-lg font-medium">Can I improve my GPA in one semester?</h3>
                  <p>Yes – a strong semester (e.g., 3.8+) can significantly raise your CGPA, especially if you have fewer total credits so far.</p>
                </div>
                <div>
                  <h3 className="font-heading text-lg font-medium">Does withdrawing from a course affect GPA?</h3>
                  <p>Usually not – a “W” does not affect your GPA, but it may show on your transcript. Talk to an advisor before withdrawing.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Related Resources</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><Link to="/how-to-calculate-gpa" className="text-brand-500 hover:underline">How to Calculate GPA</Link></li>
                <li><Link to="/grading-scale-guide" className="text-brand-500 hover:underline">GPA Grading Scale Guide</Link></li>
                <li><Link to="/gpa-to-percentage" className="text-brand-500 hover:underline">GPA to Percentage Guide</Link></li>
              </ul>
            </section>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center gap-2">Calculate Your Target GPA →</Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}