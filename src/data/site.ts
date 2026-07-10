import type { IconName } from "@/lib/icons";

export const siteConfig = {
  name: "Plus One Promo",
  tagline: "Premium branded goods for every business.",
  mission:
    "Plus One Promo exists to make sure every business — big or small — has access to the best-quality branded goods for their team, customers, and community.",
  description:
    "Plus One Promo is a full-service promotional partner helping businesses source, design, and deliver premium branded merchandise, print materials, and marketing collateral — from custom apparel and corporate gifts to business cards, mailers, postcards, EDDM, and yard signs.",
  email: "contact@plus1promo.com",
  phone: "(951) 696-0008",
  url: "https://plus1promo.com",
};

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const services: {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: IconName;
  href: string;
  features: string[];
}[] = [
  {
    id: "merchandise",
    title: "Branded Merchandise",
    description:
      "Custom apparel, drinkware, bags, tech accessories, and everyday essentials — curated for quality and designed to represent your brand with pride.",
    longDescription:
      "Your team and customers deserve products they'll actually use. Plus One Promo sources premium branded merchandise from trusted suppliers, handles logo application and color matching, and delivers finished goods ready to impress — whether you need 50 pieces or 50,000.",
    icon: "shirt",
    href: "/services#merchandise",
    features: [
      "Custom apparel, headwear, and uniforms",
      "Drinkware, tumblers, and bottles",
      "Bags, totes, and backpacks",
      "Tech accessories and office essentials",
      "Quality control and brand consistency",
    ],
  },
  {
    id: "print",
    title: "Print & Direct Mail",
    description:
      "Business cards, postcards, mailers, EDDM campaigns, yard signs, and more — professionally printed and ready to put your brand in front of the right audience.",
    longDescription:
      "From the conference room to the mailbox to the front lawn, Plus One Promo produces high-quality print and direct mail materials that keep your brand visible. We manage design, production, and delivery so your marketing collateral looks sharp and arrives on time.",
    icon: "printer",
    href: "/services#print",
    features: [
      "Business cards and stationery",
      "Postcards and direct mail pieces",
      "Mailers and marketing inserts",
      "EDDM (Every Door Direct Mail) campaigns",
      "Yard signs, banners, and outdoor signage",
    ],
  },
  {
    id: "gifting",
    title: "Corporate Gifting",
    description:
      "Thoughtfully curated gift kits for client appreciation, employee milestones, holidays, and onboarding — beautifully branded and ready to send.",
    longDescription:
      "A well-timed gift builds loyalty. Plus One Promo designs and assembles corporate gift programs that feel personal and premium — from new hire welcome kits to client thank-you boxes and seasonal campaigns tailored to your brand.",
    icon: "gift",
    href: "/services#gifting",
    features: [
      "New hire and onboarding kits",
      "Client appreciation gifts",
      "Holiday and seasonal campaigns",
      "Executive and VIP gifting",
      "Custom packaging and unboxing experiences",
    ],
  },
  {
    id: "events",
    title: "Events & Trade Shows",
    description:
      "Premium booth swag, branded giveaways, and event kits that help you stand out — with fulfillment handled before, during, and after the show.",
    longDescription:
      "Trade shows and events are high-stakes brand moments. Plus One Promo helps you show up prepared with premium promotional products, printed materials, and coordinated kits — sourced, branded, and delivered on your timeline.",
    icon: "presentation",
    href: "/services#events",
    features: [
      "Trade show giveaways and booth materials",
      "Conference and attendee kits",
      "Branded signage and display items",
      "Pre-event and on-site fulfillment",
      "Bulk shipping to venues nationwide",
    ],
  },
  {
    id: "stores",
    title: "Company Stores & Programs",
    description:
      "Branded online stores and managed programs that give your team, clients, and partners one place to order your products — on brand, every time.",
    longDescription:
      "Scale your brand experience with a company store built and managed by Plus One Promo. We handle storefront design, product catalog management, inventory, fulfillment, and reporting — so your branded goods program runs smoothly at any size.",
    icon: "store",
    href: "/services#stores",
    features: [
      "Custom-branded online storefronts",
      "Employee and client ordering portals",
      "Inventory and fulfillment management",
      "Bulk and individual shipping",
      "Reporting and program analytics",
    ],
  },
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
    id: "branded-goods",
    title: "Branded Merchandise",
    description:
      "Premium promotional products your team and customers will reach for again and again.",
    items: [
      {
        name: "Apparel & Headwear",
        description:
          "T-shirts, polos, jackets, caps, and uniforms — customized with your logo and brand colors.",
        count: "3,400+ styles",
        icon: "shirt",
      },
      {
        name: "Drinkware",
        description:
          "Tumblers, water bottles, mugs, and barware built for daily use and lasting brand visibility.",
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
          "Power banks, speakers, USB drives, and tech accessories that keep your brand connected.",
        count: "1,600+ styles",
        icon: "smartphone",
      },
      {
        name: "Office & Writing",
        description:
          "Notebooks, pens, desk accessories, and writing instruments for professional brand touchpoints.",
        count: "2,000+ styles",
        icon: "pen",
      },
      {
        name: "Gift Kits",
        description:
          "Curated, branded gift combinations for onboarding, appreciation, and special occasions.",
        count: "500+ combinations",
        icon: "gift",
      },
    ],
  },
  {
    id: "print-marketing",
    title: "Print & Marketing Materials",
    description:
      "Professional print and direct mail products that put your brand directly in your audience's hands.",
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
          "Branded mailers, flyers, and marketing inserts designed for campaigns that need to stand out in the mailbox.",
        count: "Custom sizes available",
        icon: "package",
      },
      {
        name: "EDDM",
        description:
          "Every Door Direct Mail campaigns to reach neighborhoods and local markets with targeted brand messaging.",
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
  { name: "Branded Apparel", category: "Merchandise", icon: "shirt" },
  { name: "Business Cards", category: "Print", icon: "card" },
  { name: "Custom Drinkware", category: "Merchandise", icon: "coffee" },
  { name: "Direct Mail", category: "Print", icon: "mail" },
  { name: "Yard Signs", category: "Signage", icon: "sign" },
  { name: "Gift Kits", category: "Gifting", icon: "gift" },
];

export const processSteps: {
  step: string;
  title: string;
  description: string;
  icon: IconName;
}[] = [
  {
    step: "01",
    title: "Connect",
    icon: "message",
    description:
      "Share your goals, audience, timeline, and budget. Whether you need branded hoodies or an EDDM campaign, we start by understanding what success looks like for your business.",
  },
  {
    step: "02",
    title: "Design & Quote",
    icon: "palette",
    description:
      "Our team prepares product recommendations, design proofs, and a clear quote. You'll review every detail — logo placement, materials, quantities, and delivery — before anything goes into production.",
  },
  {
    step: "03",
    title: "Produce",
    icon: "package",
    description:
      "Once approved, Plus One Promo manages sourcing, printing, quality control, and production timelines. We keep you updated so there are never surprises.",
  },
  {
    step: "04",
    title: "Deliver",
    icon: "truck",
    description:
      "Finished goods ship to one location or thousands. From warehouse bulk orders to individual gift shipments, we handle fulfillment so your branded products arrive on time and on brand.",
  },
];

export const processDetails = [
  {
    title: "Built for businesses of every size",
    description:
      "Whether you're a local shop ordering 100 yard signs or a national company launching a full employee gifting program, Plus One Promo scales to meet your needs without compromising on quality.",
    icon: "layers" as IconName,
  },
  {
    title: "One partner, every product category",
    description:
      "Stop juggling multiple vendors for merchandise, print, and mail. Plus One Promo brings branded goods, business cards, mailers, postcards, EDDM, and signage under one roof.",
    icon: "sparkles" as IconName,
  },
  {
    title: "Transparent from start to finish",
    description:
      "Clear quotes, proactive communication, and honest timelines. You'll always know where your order stands and who to contact if you have questions.",
    icon: "shield" as IconName,
  },
];

export const testimonials = [
  {
    quote:
      "Plus One Promo made it easy for us to outfit our entire team with quality branded gear — and the onboarding kits they put together have been a hit with every new hire.",
    author: "Sarah Chen",
    role: "VP of People, Meridian Health",
  },
  {
    quote:
      "We needed business cards, postcards, and yard signs for a local campaign on a tight deadline. Plus One Promo handled everything in one place and delivered exactly what we needed.",
    author: "Marcus Rivera",
    role: "Marketing Director, Apex Digital",
  },
  {
    quote:
      "They understand that our brand matters. Every product and print piece feels premium — not like the generic promo stuff you get everywhere else.",
    author: "Emily Hartwell",
    role: "Brand Manager, Northwind Collective",
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
    client: "National SaaS Brand",
    icon: "presentation",
  },
  {
    title: "EDDM & Direct Mail Campaign",
    client: "Local Service Business",
    icon: "mail",
  },
  {
    title: "Branded Apparel Program",
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
    title: "Quality Without Compromise",
    icon: "shield",
    description:
      "Every business deserves access to the best. We source products and print materials we'd be proud to put our own name on — because your brand deserves nothing less.",
  },
  {
    title: "Accessible to All",
    icon: "users",
    description:
      "Big or small, every client gets the same level of care, attention, and access to premium goods. No minimum ego — just great products at every scale.",
  },
  {
    title: "Design That Represents You",
    icon: "palette",
    description:
      "Your logo, colors, and brand standards matter. We treat every imprint, print run, and packaging detail as a reflection of your business — not an afterthought.",
  },
  {
    title: "A Partner, Not a Vendor",
    icon: "sparkles",
    description:
      "Plus One Promo works alongside your team with responsive communication, honest guidance, and a genuine investment in your results.",
  },
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
      "Branded merchandise, print, direct mail, and signage — managed by one team that knows your brand.",
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
