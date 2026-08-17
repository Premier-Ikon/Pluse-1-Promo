export const homeVisuals = {
  hero: {
    src: "/images/home/hero-team.jpg",
    alt: "A team reviewing branded apparel, drinkware, and gifts together in a bright studio",
  },
  bento: [
    {
      title: "Custom apparel",
      description: "Tees, polos, hoodies, and uniforms your team will actually wear.",
      src: "/images/home/hoodie.jpg",
      alt: "Branded hoodie flat lay",
      href: "/shop",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      title: "Drinkware",
      description: "Tumblers and bottles built for daily use.",
      src: "/images/home/drinkware.jpg",
      alt: "Insulated bottle on a clean surface",
      href: "/products#branded-goods",
      span: "",
    },
    {
      title: "Print & mail",
      description: "Business cards, postcards, and campaigns.",
      src: "/images/home/print.jpg",
      alt: "Printed marketing materials on a desk",
      href: "/products#print-marketing",
      span: "",
    },
    {
      title: "Gifting kits",
      description: "Onboarding and client appreciation, packaged with care.",
      src: "/images/home/gifts.jpg",
      alt: "Curated gift packaging",
      href: "/services#gifting",
      span: "lg:col-span-2",
    },
  ],
  portfolio: [
    {
      title: "New Hire Welcome Kits",
      client: "Growing Tech Company",
      src: "/images/home/gifts.jpg",
      alt: "Branded welcome kit packaging",
    },
    {
      title: "Trade Show & Event Swag",
      client: "Growing software company",
      src: "/images/home/tote.jpg",
      alt: "Event tote bag ready for branding",
    },
    {
      title: "EDDM & Direct Mail Campaign",
      client: "Local service business",
      src: "/images/home/print.jpg",
      alt: "Direct mail print pieces",
    },
    {
      title: "Branded Apparel Program",
      client: "Creative agency",
      src: "/images/home/apparel.jpg",
      alt: "Custom apparel program",
    },
  ],
  atmosphere: {
    src: "/images/home/team.jpg",
    alt: "Team collaborating on a brand program",
  },
} as const;
