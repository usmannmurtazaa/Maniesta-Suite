// src/pages/FAQ.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. Maniesta Suite is completely account‑free. You can use all calculators and export reports without signing up.",
  },
  {
    q: "Is Maniesta Suite really free?",
    a: "Yes. Forever. We do not charge for any features. The site may display ads to cover hosting costs, but all tools remain free.",
  },
  {
    q: "How accurate are the calculations?",
    a: "Our algorithms follow standard academic grading scales (4.0, 5.0, 10.0). However, always double‑check with your institution – some schools use unique weighting.",
  },
  {
    q: "How do I change the GPA scale?",
    a: "On the GPA and CGPA pages, click the scale buttons (4.0, 5.0, 10.0) above the calculator. The grade points adjust automatically.",
  },
  {
    q: "Can I add more than 8 courses?",
    a: "Currently, the GPA calculator supports up to 8 courses per semester. This keeps the interface clean and fast. For more courses, calculate in batches.",
  },
  {
    q: "How does the CGPA calculator work?",
    a: "Enter your GPA for each semester. The calculator sums the GPAs and divides by the number of semesters to give your cumulative CGPA.",
  },
  {
    q: "What information is included in the PDF report?",
    a: "The PDF includes your name, student ID, university, degree program, semester, course table (with grades and credits), GPA/CGPA, and academic standing.",
  },
  {
    q: "How do I download CSV?",
    a: "After calculating your GPA or CGPA, click “Export Academic Record”, fill the form, and click “Generate Export Files”. On the success screen, click “Download CSV”.",
  },
  {
    q: "Are my exports saved?",
    a: "Yes. Your export records are stored anonymously in our Firebase database to help us improve the platform. You can request deletion by email.",
  },
  {
    q: "Which browsers are supported?",
    a: "We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated.",
  },
  {
    q: "Is there a mobile app?",
    a: "Not yet. However, the website is fully responsive and works great on phones and tablets. You can also install it as a Progressive Web App (PWA).",
  },
  {
    q: "How do I contact support?",
    a: "Use our Contact page or email support@maniestasuite.netlify.app. We typically reply within 48 hours.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 last:border-0">
      <button
        onClick={onClick}
        className="w-full text-left py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question}</h3>
        <span className="text-2xl text-brand-500 transition-transform duration-200" style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}>
          +
        </span>
      </button>
      {isOpen && <div className="pb-4 text-gray-600 dark:text-gray-400">{answer}</div>}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <Helmet>
        <title>FAQ – Maniesta Suite Student Academic Tools</title>
        <meta
          name="description"
          content="Get answers to common questions about GPA calculation, CGPA, PDF export, and using our free academic tools."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/faq" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Everything you need to know about using Maniesta Suite.</p>

          <div className="space-y-1">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === idx}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              />
            ))}
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