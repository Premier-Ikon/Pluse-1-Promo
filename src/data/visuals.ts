export const homeVisuals = {
  hero: {
    src: "/images/home/hero-team.jpg",
    alt: "A team reviewing custom apparel, drinkware, and gifts together in a bright studio",
  },
  bento: [
    {
      title: "Custom apparel",
      description: "Tees, polos, hoodies, and uniforms your team will actually wear.",
      src: "/images/home/work-embroidered-hoodie.jpg",
      alt: "Custom embroidered hoodie",
      href: "/shop",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      title: "Drinkware",
      description: "Tumblers and bottles built for daily use.",
      src: "/images/home/merchandise-drinkware-set.jpg",
      alt: "Custom branded tumblers and drinkware",
      href: "/products#custom-goods",
      span: "",
    },
    {
      title: "Print & mail",
      description: "Business cards, postcards, and campaigns.",
      src: "/images/home/print-mailers.jpg",
      alt: "Printed marketing materials on a desk",
      href: "/products#print-marketing",
      span: "",
    },
    {
      title: "Gifting kits",
      description: "Onboarding and client appreciation, packaged with care.",
      src: "/images/home/work-welcome-kit.jpg",
      alt: "Curated branded welcome kit",
      href: "/services/gifting",
      span: "lg:col-span-2",
    },
  ],
  portfolio: [
    {
      title: "New Hire Welcome Kits",
      client: "Growing Tech Company",
      src: "/images/home/work-welcome-kit.jpg",
      alt: "Custom welcome kit packaging",
    },
    {
      title: "Trade Show & Event Swag",
      client: "Growing software company",
      src: "/images/home/work-event-kit.jpg",
      alt: "Event tote, lanyard, and drinkware kit",
    },
    {
      title: "EDDM & Direct Mail Campaign",
      client: "Local service business",
      src: "/images/home/print-mailers.jpg",
      alt: "Direct mail print pieces",
    },
    {
      title: "Custom Apparel Program",
      client: "Creative agency",
      src: "/images/home/work-team-apparel.jpg",
      alt: "Custom apparel program",
    },
  ],
  atmosphere: {
    src: "/images/home/about-marquee-screenprint.jpg",
    alt: "Screen printing production in progress",
  },
} as const;
