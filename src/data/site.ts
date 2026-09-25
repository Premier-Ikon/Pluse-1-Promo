import type { IconName } from "@/lib/icons";

export { services, getServiceById, getRelatedServices } from "@/data/services";
export type { Service, ServiceWorkSample } from "@/data/services";

export const siteConfig = {
  name: "Plus One Promo",
  tagline: "Custom apparel & goods done right.",
  mission:
    "Help every business and person get access to high-quality goods made to last — at an affordable price.",
  description:
    "Plus One Promo sources, decorates, and delivers custom merchandise and print — apparel, gifts, business cards, mailers, and more — with clear quotes before production.",
  email: "info@plus1promo.com",
  phone: "(951) 696-0008",
  url: "https://plus1promo.com",
};

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Apparel", href: "/apparel" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const productGroups: {
  id: string;
  title: string;
  description: string;
  items: {
    name: string;
    description: string;
    count: string;
    icon: IconName;
  }[];
}[] = [
  {
    id: "custom-goods",
    title: "Custom Merchandise",
    description:
      "Premium promotional products your team and customers will reach for again and again.",
    items: [
      {
        name: "Apparel & Headwear",
        description:
          "T-shirts, polos, jackets, caps, and uniforms — customized with your logo and colors.",
        count: "3,400+ styles",
        icon: "shirt",
      },
      {
        name: "Drinkware",
        description:
          "Tumblers, water bottles, mugs, and barware built for daily use and lasting everyday visibility.",
        count: "2,100+ styles",
        icon: "coffee",
      },
      {
        name: "Bags & Totes",
        description:
          "Backpacks, tote bags, duffels, and carry-all solutions for events, commutes, and everyday carry.",
        count: "1,800+ styles",
        icon: "bag",
      },
      {
        name: "Tech & Gadgets",
        description:
          "Power banks, speakers, USB drives, and tech accessories that keep your organization visible.",
        count: "1,600+ styles",
        icon: "smartphone",
      },
      {
        name: "Office & Writing",
        description:
          "Notebooks, pens, desk accessories, and writing instruments for professional everyday touchpoints.",
        count: "2,000+ styles",
        icon: "pen",
      },
      {
        name: "Gift Kits",
        description:
          "Curated, custom gift combinations for onboarding, appreciation, and special occasions.",
        count: "500+ combinations",
        icon: "gift",
      },
    ],
  },
  {
    id: "print-marketing",
    title: "Print & Marketing Materials",
    description:
      "Professional print and direct mail products that put your message directly in your audience's hands.",
    items: [
      {
        name: "Business Cards",
        description:
          "Premium business cards and stationery that make a polished first impression — every time.",
        count: "Multiple stocks & finishes",
        icon: "card",
      },
      {
        name: "Postcards",
        description:
          "Direct mail postcards for promotions, announcements, and customer outreach campaigns.",
        count: "Standard & oversized formats",
        icon: "mail",
      },
      {
        name: "Mailers",
        description:
          "Custom mailers, flyers, and marketing inserts designed for campaigns that need to stand out in the mailbox.",
        count: "Custom sizes available",
        icon: "package",
      },
      {
        name: "EDDM",
        description:
          "Every Door Direct Mail campaigns to reach neighborhoods and local markets with targeted local messaging.",
        count: "Route-based targeting",
        icon: "map",
      },
      {
        name: "Yard Signs",
        description:
          "Corrugated yard signs, real estate signs, and outdoor signage for events, campaigns, and promotions.",
        count: "Single & double-sided",
        icon: "sign",
      },
      {
        name: "Banners & Signage",
        description:
          "Retractable banners, vinyl signs, and display graphics for events, storefronts, and trade shows.",
        count: "Indoor & outdoor options",
        icon: "flag",
      },
    ],
  },
];

export const categories = productGroups.flatMap((group) => group.items);

export const heroFeatures: {
  name: string;
  category: string;
  icon: IconName;
}[] = [
  { name: "Custom Apparel", category: "Merchandise", icon: "shirt" },
  { name: "Business Cards", category: "Print", icon: "card" },
  { name: "Custom Drinkware", category: "Merchandise", icon: "coffee" },
  { name: "Direct Mail", category: "Print", icon: "mail" },
  { name: "Yard Signs", category: "Signage", icon: "sign" },
  { name: "Gift Kits", category: "Gifting", icon: "gift" },
];

export const processSteps: {
  step: string;
  id: string;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    step: "01",
    id: "connect",
    title: "Connect",
    icon: "message",
    description:
      "Tell us what you need, your timeline, and your budget. We’ll ask the right questions so we start in the right place.",
  },
  {
    step: "02",
    id: "design-quote",
    title: "Design & Quote",
    icon: "palette",
    description:
      "You get product options, proofs, and a clear quote. Nothing moves forward until you approve the details.",
  },
  {
    step: "03",
    id: "produce",
    title: "Produce",
    icon: "package",
    description:
      "We source, decorate, and quality-check your order — and keep you posted along the way.",
  },
  {
    step: "04",
    id: "deliver",
    title: "Deliver",
    icon: "truck",
    description:
      "Finished goods ship where they need to go — one address or many — on the timeline we confirmed.",
  },
];

export const processDetails = [
  {
    title: "Works for any company size",
    description:
      "Small team runs and larger programs get the same care, clear quotes, and quality checks.",
    icon: "layers" as IconName,
  },
  {
    title: "One partner for more categories",
    description:
      "Merchandise, embroidery, print, and gifts without juggling a stack of vendors.",
    icon: "sparkles" as IconName,
  },
  {
    title: "Clear from start to finish",
    description:
      "Honest timelines, proactive updates, and a real person to talk to when you have questions.",
    icon: "shield" as IconName,
  },
];

export const testimonials = [
  {
    quote:
      "We sent one request for team apparel and onboarding kits. Plus One came back with options, a clear quote, and gear that actually feels like you — not the generic promo stuff.",
    author: "Sarah Chen",
    role: "VP of People, Meridian Health",
  },
  {
    quote:
      "Business cards, postcards, and yard signs on a tight deadline. One partner handled the print stack and delivered exactly what we needed.",
    author: "Marcus Rivera",
    role: "Marketing Director, Apex Digital",
  },
  {
    quote:
      "They treat our organization like it matters. Proofs look right, timelines stay honest, and we always know where the order stands.",
    author: "Emily Hartwell",
    role: "Operations Lead, Northwind Collective",
  },
];

export const stats = [
  { value: "500+", label: "Businesses served" },
  { value: "10K+", label: "Products & print items sourced" },
  { value: "98%", label: "On-time delivery rate" },
  { value: "50+", label: "Product categories" },
];

export const trustedIndustries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Hospitality",
  "Non-Profit",
  "Real Estate",
  "Retail",
  "Startups",
  "Professional Services",
];

export const portfolioItems: {
  title: string;
  client: string;
  icon: IconName;
}[] = [
  {
    title: "New Hire Welcome Kits",
    client: "Growing Tech Company",
    icon: "gift",
  },
  {
    title: "Trade Show & Event Swag",
    client: "National software company",
    icon: "presentation",
  },
  {
    title: "EDDM & Direct Mail Campaign",
    client: "Local Service Business",
    icon: "mail",
  },
  {
    title: "Custom Apparel Program",
    client: "Creative Agency",
    icon: "shirt",
  },
];

export const values: {
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    title: "Quality made to last",
    icon: "shield",
    description:
      "We source and finish goods we'd put our own name on — durable products and clean decoration that hold up beyond a one-time promo moment.",
  },
  {
    title: "Access for every business",
    icon: "users",
    description:
      "Big or small, every client gets the same care and clear quotes. High-quality custom goods shouldn't be reserved for the biggest budgets.",
  },
  {
    title: "Design that represents you",
    icon: "palette",
    description:
      "Your logo, colors, and standards matter. We treat every imprint and print run as a reflection of your business — not an afterthought.",
  },
  {
    title: "A partner, not a vendor",
    icon: "sparkles",
    description:
      "Real people, honest guidance, and responsive support — we stay with you from the first request through delivery.",
  },
];

export const aboutHighlights = [
  { value: "Women-owned", label: "Locally rooted business" },
  { value: "15+ years", label: "Hands-on industry experience" },
  { value: "One goal", label: "Quality goods for every budget" },
  { value: "Clear quotes", label: "Before production starts" },
];

export const whyPlusOne: {
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    title: "Full-service under one roof",
    icon: "layers",
    description:
      "Custom merchandise, print, direct mail, and signage — managed by one team that knows your organization.",
  },
  {
    title: "Premium quality at every quantity",
    icon: "shield",
    description:
      "From a short run of business cards to a nationwide apparel order, quality stays consistent.",
  },
  {
    title: "Real people, real support",
    icon: "users",
    description:
      "You'll work with a dedicated team — not a faceless order form. Questions get answered, fast.",
  },
  {
    title: "Nationwide fulfillment",
    icon: "truck",
    description:
      "Ship to one address or hundreds. Plus One Promo handles logistics so you can focus on your business.",
  },
];
