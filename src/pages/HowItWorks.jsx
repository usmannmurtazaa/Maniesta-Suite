import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Inline SVG icons – replace emojis
const ChartIcon = () => (
  <svg className="w-6 h-6 mx-auto text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-8 4 4 4-6" />
  </svg>
);
const CalcIcon = () => (
  <svg className="w-6 h-6 mx-auto text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="12" y2="14" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
);
const RulerIcon = () => (
  <svg className="w-6 h-6 mx-auto text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3-3 3 3M9 3v14M21 18l-3 3-3-3M15 21V7" />
  </svg>
);
const MoneyIcon = () => (
  <svg className="w-6 h-6 mx-auto text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12m-3-2.818l.879.659a3 3 0 004.242 0L18 13.182" />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-6 h-6 mx-auto text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const MobileIcon = () => (
  <svg className="w-6 h-6 mx-auto text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

export default function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How It Works – GPA & CGPA Calculator Guide | Maniesta Suite</title>
        <meta
          name="description"
          content="Learn how to calculate your GPA, generate PDF reports, and export CSV files in 3 simple steps. Free, no signup."
        />
        <meta
          name="keywords"
          content="how it works, GPA calculator guide, export guide, academic tools, Maniesta Suite"
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/how-it-works" />
      </Helmet>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="font-hero text-3xl md:text-4xl font-bold text-gradient mb-2 text-center">How Maniesta Suite Works</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Three simple steps to calculate and export your academic performance.</p>

          <div className="grid gap-10 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-brand text-white text-xl font-bold flex items-center justify-center shadow-brand">1</div>
              <div>
                <h2 className="font-heading text-xl font-semibold mb-2 text-gray-900 dark:text-white">Enter Your Courses & Grades</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to the <Link to="/gpa" className="text-brand-500 hover:underline">GPA Calculator</Link> or{" "}
                  <Link to="/cgpa" className="text-brand-500 hover:underline">CGPA Calculator</Link>. Add your courses – each card includes fields for course code, credit hours, and grade. Start with 2 courses; you can add up to 8. Default credit hours are set to 3.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-brand text-white text-xl font-bold flex items-center justify-center shadow-brand">2</div>
              <div>
                <h2 className="font-heading text-xl font-semibold mb-2 text-gray-900 dark:text-white">Calculate Instantly</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the “Calculate Semester GPA” button. Your GPA appears immediately with an animated number. The result card also shows total credits, quality points, and your academic standing (e.g., “Good Standing”). For high GPAs (≥3.5), a celebratory animation plays.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-brand text-white text-xl font-bold flex items-center justify-center shadow-brand">3</div>
              <div>
                <h2 className="font-heading text-xl font-semibold mb-2 text-gray-900 dark:text-white">Export Professional Reports</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Click “Export Academic Record”. Fill in your details (name, student ID, university, degree, semester). Then click “Generate Export Files”. You’ll get two files:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600 dark:text-gray-400">
                  <li><strong>PDF:</strong> A beautifully formatted academic report with your course table, GPA, and a certificate‑style layout.</li>
                  <li><strong>CSV:</strong> A spreadsheet‑friendly file ready for Excel or Google Sheets.</li>
                </ul>
                <p className="mt-2 text-gray-600 dark:text-gray-400">All exports are saved to our secure database (anonymously) to help us improve.</p>
              </div>
            </div>
          </div>

          {/* Features at a glance */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="font-heading text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Features at a Glance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="glass p-4 rounded-xl text-center space-y-2">
                <ChartIcon />
                <p>GPA & CGPA calculators</p>
              </div>
              <div className="glass p-4 rounded-xl text-center space-y-2">
                <CalcIcon />
                <p>Scientific & normal calculators</p>
              </div>
              <div className="glass p-4 rounded-xl text-center space-y-2">
                <RulerIcon />
                <p>Unit converter (7 categories)</p>
              </div>
              <div className="glass p-4 rounded-xl text-center space-y-2">
                <MoneyIcon />
                <p>Interest calculator (simple, compound, EMI)</p>
              </div>
              <div className="glass p-4 rounded-xl text-center space-y-2">
                <MoonIcon />
                <p>Dark mode (light/dark/system)</p>
              </div>
              <div className="glass p-4 rounded-xl text-center space-y-2">
                <MobileIcon />
                <p>Fully responsive (mobile, tablet, desktop)</p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center gap-2">
              Get Started for Free →
            </Link>
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