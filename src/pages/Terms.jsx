// src/pages/Terms.jsx
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms and Conditions"
        description="Read the terms of use for Maniesta Suite. Free academic tools for students – no signup, no hidden fees."
        keywords="terms and conditions, terms of use, legal, disclaimer, academic tools terms"
        canonicalUrl="https://maniestasuite.netlify.app/terms"
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="font-hero text-3xl md:text-4xl font-bold text-gradient mb-2">Terms and Conditions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: June 10, 2026</p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Acceptance of Terms</h2>
              <p>By using Maniesta Suite (<a href="https://maniestasuite.netlify.app" className="text-brand-500 hover:underline">maniestasuite.netlify.app</a>), you agree to these Terms and Conditions. If you do not agree, please do not use our website.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Use License</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Maniesta Suite is free for personal, non‑commercial use.</li>
                <li>You may not copy, modify, or redistribute our code or content without permission.</li>
                <li>You may not use our tools for any illegal purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Disclaimer of Warranties</h2>
              <p>The tools and calculators are provided “as is”. We do not guarantee that the results are error‑free or suitable for official academic purposes. Always verify with your institution.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Maniesta Suite and its owners are not liable for any direct, indirect, or consequential damages arising from your use of the website.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Accuracy of Calculations</h2>
              <p>Our GPA, CGPA, interest, and conversion algorithms are based on common academic scales (4.0, 5.0, 10.0). However, grading policies vary by institution. You are responsible for confirming results with your school.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">External Links</h2>
              <p>We may link to third‑party websites. We are not responsible for their content or privacy practices.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Governing Law</h2>
              <p>These terms are governed by the laws of Pakistan.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use of the site constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold mb-3 text-gray-900 dark:text-white">Contact</h2>
              <p>For questions, email: <a href="mailto:legal@maniestasuite.netlify.app" className="text-brand-500 hover:underline">legal@maniestasuite.netlify.app</a></p>
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