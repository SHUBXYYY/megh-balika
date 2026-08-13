import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://www.meghbalika.store";
export const SITE_NAME = "Megh Balika";

type SeoProps = {
  title: string;
  description: string;
  /** Route path beginning with "/" — used for canonical & og:url */
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  /** One or more JSON-LD objects injected as <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

const abs = (url?: string) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const Seo = ({ title, description, path, image, type = "website", jsonLd, noindex }: SeoProps) => {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const img = abs(image);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === "product" ? "website" : type} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_US" />
      {img && <meta property="og:image" content={img} />}

      <meta name="twitter:card" content={img ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {img && <meta name="twitter:image" content={img} />}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export const breadcrumbLd = (crumbs: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path}`,
  })),
});

export default Seo;
