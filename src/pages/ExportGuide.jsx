// src/pages/ExportGuide.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function ExportGuide() {
  return (
    <>
      <Helmet>
        <title>Export Guide – PDF & CSV GPA Reports | Maniesta Suite</title>
        <meta
          name="description"
          content="Learn how to export your GPA and CGPA as professional PDF reports or CSV files. Free, no signup."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/export-guide" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="font-hero text-3xl md:text-4xl font-bold text-gradient mb-2">Export Guide – PDF & CSV Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Generate professional academic reports with one click.</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Why Export Your Academic Data?</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Applying to scholarships</strong> – provide official‑looking documentation.</li>
                <li><strong>Job applications</strong> – attach a summary of your academic performance.</li>
                <li><strong>Personal records</strong> – track your progress over multiple semesters.</li>
                <li><strong>Sharing with advisors</strong> – PDFs are easy to email.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">What’s Included in the Report?</h2>
              <div className="mb-4">
                <h3 className="font-heading text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">PDF Report Contents</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Maniesta Suite branded header</li>
                  <li>Your name, student ID, university, degree program, semester</li>
                  <li>Course table: code, credits, grade, quality points</li>
                  <li>GPA / CGPA with academic standing (e.g., “Good Standing”)</li>
                  <li>Generation date and page numbers</li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">CSV File Contents</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Student information (same as PDF)</li>
                  <li>Course‑by‑course rows</li>
                  <li>GPA summary at the bottom</li>
                  <li>UTF‑8 encoding for special characters (works in Excel)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Step‑by‑Step Walkthrough</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li><strong>Calculate your GPA/CGPA</strong> – Use the <Link to="/gpa" className="text-brand-500 hover:underline">GPA Calculator</Link> or <Link to="/cgpa" className="text-brand-500 hover:underline">CGPA Calculator</Link>.</li>
                <li><strong>Open the Export Modal</strong> – Below the result card, click “Export Academic Record”.</li>
                <li><strong>Fill your details</strong> – Full name (required), student ID, university, degree, semester. The form remembers your details using local storage.</li>
                <li><strong>Generate & Download</strong> – Click “Generate Export Files”. After a few seconds, click “Download PDF” and/or “Download CSV”.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Using the CSV in Excel or Google Sheets</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Excel (Windows):</strong> Open the CSV directly – it will auto‑detect UTF‑8.</li>
                <li><strong>Excel (Mac):</strong> Use “Data → From Text/CSV” to ensure correct encoding.</li>
                <li><strong>Google Sheets:</strong> File → Import → Upload the CSV.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Troubleshooting</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Modal doesn’t open?</strong> Make sure you have calculated a result first. Refresh the page and try again.</li>
                <li><strong>PDF download fails?</strong> Check your internet connection. Try a different browser (Chrome, Firefox).</li>
                <li><strong>Details not saved?</strong> Local storage may be disabled. Enable it or re‑enter each time.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Privacy & Data Storage</h2>
              <p>When you export, your anonymised data is saved to our Firebase database to help us improve. You can request deletion by emailing <a href="mailto:privacy@maniestasuite.netlify.app" className="text-brand-500 hover:underline">privacy@maniestasuite.netlify.app</a>. We never sell your data.</p>
            </section>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gpa" className="btn-primary inline-flex items-center justify-center gap-2">Go to GPA Calculator →</Link>
            <Link to="/cgpa" className="btn-secondary inline-flex items-center justify-center gap-2">Go to CGPA Calculator →</Link>
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