// src/pages/MediaKit.jsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function MediaKit() {
  return (
    <>
      <Helmet>
        <title>Media Kit – Maniesta Suite</title>
        <meta
          name="description"
          content="Media kit for Maniesta Suite – an academic and productivity tools platform. Audience, traffic, and partnership details."
        />
        <link rel="canonical" href="https://maniestasuite.netlify.app/mediakit" />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="glass-card p-6 md:p-8 rounded-2xl space-y-10 text-gray-800 dark:text-gray-200">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient">
              Maniesta Suite – Media Kit
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Academic & productivity tools platform for students, developers,
              and professionals worldwide.
            </p>
          </div>

          {/* Company Overview */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Company Overview
            </h2>
            <p className="leading-relaxed">
              Maniesta Suite is a web‑based productivity and education platform
              designed to simplify complex academic calculations and everyday
              utility tasks. From GPA and CGPA calculators to live currency
              converters and interest tools, Maniesta Suite brings together
              essential resources in a clean, fast, and ad‑supported environment.
              The platform is built with a focus on performance, accessibility,
              and a premium user experience, serving a growing global audience.
            </p>
          </section>

          {/* Platform Features */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Platform Features
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>GPA Calculator – instant semester GPA with 4.0 / 5.0 / 10.0 scales</li>
              <li>CGPA Calculator – cumulative GPA across semesters</li>
              <li>Currency Converter – 150+ currencies with live exchange rates</li>
              <li>Interest Calculator – simple, compound, and loan EMI</li>
              <li>Scientific & Normal Calculators – trigonometry, logarithms, memory functions</li>
              <li>Unit Converter – length, weight, temperature, area, speed, time, currency</li>
              <li>Academic Dashboard – track recent activity, favorites, and export history</li>
              <li>AI Chat Assistant – instant help with tools and calculations</li>
              <li>PDF & CSV Export – professional reports for academic and job purposes</li>
              <li>Dark mode, fully responsive design, and accessibility support</li>
            </ul>
          </section>

          {/* Target Audience */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Target Audience
            </h2>
            <p className="mb-2">
              The platform serves a diverse user base across multiple regions:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Students (high school, college, university)</li>
              <li>Developers & freelancers</li>
              <li>Professionals needing quick utility tools</li>
            </ul>
            <p className="mt-3">
              <strong>Primary regions:</strong> Pakistan, India, United States,
              United Kingdom, and the Middle East.
            </p>
          </section>

          {/* Traffic Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Traffic Information
            </h2>
            <p>
              Maniesta Suite is currently in its early growth phase, actively
              scaling organic traffic through search engine optimization and
              word‑of‑mouth. Monthly visitors are in the range of{" "}
              <strong>0 – 1,000</strong> as the platform gains traction. Traffic
              is primarily organic, with a strong focus on long‑tail educational
              and utility keywords.
            </p>
          </section>

          {/* Monetization Model */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Monetization Model
            </h2>
            <p>
              Revenue is generated through non‑intrusive display advertising
              (reserved ad slots across the platform) and affiliate partnerships
              with SaaS tools, productivity software, and educational services.
              All monetization is implemented after core user tasks are
              completed, ensuring a clean and uninterrupted experience.
            </p>
          </section>

          {/* Partnership Opportunities */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Partnership Opportunities
            </h2>
            <p className="mb-2">
              We welcome collaborations with:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>SaaS companies (productivity, analytics, design tools)</li>
              <li>Educational platforms (online courses, tutoring services)</li>
              <li>Developer tool providers (hosting, APIs, code editors)</li>
              <li>Productivity software and student resource platforms</li>
            </ul>
            <p className="mt-3">
              Partnerships may include affiliate promotions, sponsored tool
              placements, or co‑branded content. Reach out to discuss how we can
              work together.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Contact
            </h2>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:partner@maniestasuite.netlify.app"
                className="text-brand-500 hover:underline"
              >
                partner@maniestasuite.netlify.app
              </a>
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href="https://maniestasuite.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:underline"
              >
                maniestasuite.netlify.app
              </a>
            </p>
          </section>

          {/* Back to Home */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <Link to="/" className="btn-secondary inline-flex items-center gap-2">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
