export type SareeCategory = {
  label: string;
  href: string;
  blurb: string;
};

/** Main saree categories surfaced in the header dropdown & menu overlay.
 *  Kept as plain hrefs so crawlers can follow them. */
export const SAREE_CATEGORIES: SareeCategory[] = [
  { label: "Banarasi", href: "/sarees/banarasi", blurb: "Silk & zari brocade" },
  { label: "Kantha Stitch", href: "/sarees/kantha-stitch", blurb: "Bengal hand embroidery" },
  { label: "Pure Silk", href: "/sarees/silk", blurb: "Bishnupuri & Katan" },
  { label: "Chanderi", href: "/sarees/chanderi", blurb: "Feather-light sheen" },
  { label: "Tussar", href: "/sarees/tussar", blurb: "Wild silk texture" },
  { label: "Jamdani", href: "/sarees/jamdani", blurb: "Dhakai fine weave" },
  { label: "Batik", href: "/sarees/batik", blurb: "Wax-resist artistry" },
];
