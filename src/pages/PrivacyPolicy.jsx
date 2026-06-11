// src/pages/PrivacyPolicy.jsx
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how Maniesta Suite collects, uses, and protects your data. No accounts, no personal data sold. Free academic tools for students."
        keywords={["privacy policy", "data protection", "student privacy", "GDPR", "academic tools privacy"]}
        canonicalUrl="https://maniestasuite.netlify.app/privacy"
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: June 10, 2026</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Information We Collect</h2>
              <p className="mb-2">Maniesta Suite does <strong>not</strong> require you to create an account. When you use our tools:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Export data:</strong> If you generate a PDF or CSV report, the information you enter (name, student ID, university, degree, semester) is temporarily stored in your browser and saved to our secure Firebase database. This helps us understand how students use our tools and improve the platform.</li>
                <li><strong>Usage data:</strong> We collect anonymous usage statistics (e.g., which calculator you use, how long you stay) via Google Analytics. This data does <strong>not</strong> identify you personally.</li>
                <li><strong>Cookies:</strong> We use minimal cookies to remember your theme preference (light/dark) and for Google Analytics.</li>
              </ul>
              <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal data with third‑parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and improve our calculators and export features.</li>
                <li>To analyze usage patterns and fix bugs.</li>
                <li>To ensure compliance with AdSense policies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Cookies & Tracking</h2>
              <p>You can disable cookies in your browser settings. However, some features (like theme preference) may not work as expected.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Third‑Party Services</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Firebase (Google):</strong> Stores export records securely. Data is encrypted in transit and at rest.</li>
                <li><strong>Google Analytics:</strong> Collects anonymous traffic data.</li>
                <li><strong>EmailJS:</strong> Processes contact form messages – we do not store your email address unless you contact us.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Data Security</h2>
              <p>We use industry‑standard security measures. However, no online service is 100% secure. By using Maniesta Suite, you acknowledge this risk.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Your Rights & Choices</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>You can request deletion of your export records by emailing us.</li>
                <li>You can opt out of Google Analytics using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">Google Analytics Opt‑out Browser Add‑on</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Changes to This Policy</h2>
              <p>We will update this page if our practices change. The “Last updated” date will reflect changes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact Us</h2>
              <p>For privacy questions, email: <a href="mailto:privacy@maniestasuite.netlify.app" className="text-brand-500 hover:underline">privacy@maniestasuite.netlify.app</a></p>
            </section>
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