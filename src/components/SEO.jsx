import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = "https://maniestasuite.netlify.app/og-image.png",
  ogType = "website",
}) {
  const siteTitle = title
    ? `${title} | Maniesta Suite`
    : "Maniesta Suite – Academic Tools Platform";
  const metaDescription =
    description ||
    "Free GPA calculator, CGPA calculator, unit converter, currency converter and academic dashboard for students. No signup required.";
  const metaKeywords = keywords.length
    ? keywords.join(", ")
    : "GPA calculator, CGPA calculator, student tools, grade calculator, academic dashboard, currency converter";

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link
        rel="canonical"
        href={
          canonicalUrl || `https://maniestasuite.netlify.app${window.location.pathname}`
        }
      />

      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl || window.location.href} />
      <meta property="og:site_name" content="Maniesta Suite" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
    </Helmet>
  );
}
