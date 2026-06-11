/**
 * ⚠️ DEPRECATED – Not currently used in the application.
 *
 * The SEO metadata for each page is handled directly by the `<SEO>` component
 * (see `src/components/SEO.jsx`) with per‑page props. This configuration object
 * is kept for reference only and may be removed in a future cleanup.
 */
export const SEO = {
  defaultTitle: "Maniesta Suite",
  defaultDescription: "Academic tools dashboard for GPA, CGPA, currency conversion and exports.",
  siteUrl: import.meta.env.VITE_APP_URL || "https://maniestasuite.netlify.app/",

  pages: {
    home: {
      title: "Maniesta Suite | Academic Dashboard",
      description: "All-in-one academic tools for students with dashboard tracking and exports."
    },
    gpa: {
      title: "GPA Calculator | Maniesta Suite",
      description: "Calculate semester GPA instantly with grading system."
    },
    cgpa: {
      title: "CGPA Calculator | Maniesta Suite",
      description: "Track cumulative academic performance across semesters."
    },
    currency: {
      title: "Currency Converter | Maniesta Suite",
      description: "Live currency conversion with 150+ currencies and history tracking."
    },
    dashboard: {
      title: "Dashboard | Maniesta Suite",
      description: "Personal academic dashboard with insights and history."
    }
  }
};

export function getSEO(page = "home") {
  return SEO.pages[page] || SEO.pages.home;
}