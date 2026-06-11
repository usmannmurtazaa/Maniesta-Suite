import { Helmet } from 'react-helmet-async';

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Maniesta Suite",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "description": "Free academic tools platform: GPA calculator, CGPA calculator, unit converter, currency converter, interest calculator and personal dashboard.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": "GPA Calculator, CGPA Calculator, Scientific Calculator, Unit Converter, Currency Converter, Interest Calculator, PDF/CSV Export, Academic Dashboard",
    "softwareVersion": "2.0",
    "url": "https://maniestasuite.netlify.app",
    // ⚠️ Placeholder social profiles – replace with actual URLs when available
    "sameAs": [
      "https://github.com/your-repo",
      "https://twitter.com/maniestasuite"
    ]
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}