import { Helmet } from "react-helmet-async";
import { useMemo } from "react";

export type SEOProps = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
};

export const SEO = ({ title, description, keywords = [], image, canonical, jsonLd, noIndex = false }: SEOProps) => {
  const computedCanonical = useMemo(() => {
    if (canonical) return canonical;
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        return url.origin + url.pathname;
      } catch {}
    }
    return undefined;
  }, [canonical]);

  const ogImage = image || "/lovable-uploads/428af5aa-0449-4089-ae11-9a6496c23f77.png";
  const keywordsContent = keywords.join(", ");

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={computedCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {computedCanonical && <meta property="og:url" content={computedCanonical} />}
      <meta property="og:site_name" content="TSM Crafts" />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};
