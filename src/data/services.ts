import type { IconName } from "@/lib/icons";

export type ServiceWorkSample = {
  src: string;
  alt: string;
  caption: string;
  imageClassName?: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  pageIntro: string;
  icon: IconName;
  href: string;
  features: string[];
  idealFor: string[];
  heroImage: { src: string; alt: string };
  work: ServiceWorkSample[];
};

export const services: Service[] = [
  {
    id: "merchandise",
    title: "Custom Merchandise",
    description:
      "Apparel, drinkware, bags, and everyday goods your team will actually use.",
    longDescription:
      "We source quality merchandise, apply your logo, and deliver finished goods — from a small team run to a larger program.",
    pageIntro:
      "From tees and hoodies to drinkware and totes, we help you pick pieces people keep using — then decorate and deliver with a clear quote before production starts.",
    icon: "shirt",
    href: "/services/merchandise",
    features: [
      "Custom apparel, headwear, and uniforms",
      "Drinkware, tumblers, and bottles",
      "Bags, totes, and backpacks",
      "Tech accessories and office essentials",
      "Quality checks before it ships",
    ],
    idealFor: [
      "Team and company apparel programs",
      "Client and employee giveaways",
      "Retail or event merch drops",
      "Ongoing merch refreshes",
    ],
    heroImage: {
      src: "/images/home/work-team-apparel.jpg",
      alt: "Team wearing custom branded tees and caps",
    },
    work: [
      {
        src: "/images/home/work-team-apparel.jpg",
        alt: "Custom branded team apparel",
        caption: "Team apparel",
      },
      {
        src: "/images/home/merchandise-drinkware-set.jpg",
        alt: "Custom branded tumblers and growler",
        caption: "Everyday drinkware",
      },
      {
        src: "/images/home/merchandise-totes.jpg",
        alt: "Custom printed tote bags on a display rack",
        caption: "Bags & totes",
      },
      {
        src: "/images/home/merchandise-hoodie.jpg",
        alt: "Custom hoodie worn on site",
        caption: "Seasonal outerwear",
      },
    ],
  },
  {
    id: "embroidery",
    title: "Embroidered Goods",
    description:
      "Polos, caps, jackets, and workwear finished with clean, lasting embroidery.",
    longDescription:
      "Embroidery is a staple for uniforms and polished team moments. We help you choose the right garments, place the logo well, and deliver a finished look that holds up.",
    pageIntro:
      "Clean stitch work for uniforms, caps, and polished team moments. We match thread, place logos with care, and send proofs before anything hits the machine.",
    icon: "needle",
    href: "/services/embroidery",
    features: [
      "Polos, jackets, and workwear",
      "Caps and structured headwear",
      "Left-chest, sleeve, and multi-location options",
      "Thread color matching to your logo",
      "Small runs through larger team programs",
    ],
    idealFor: [
      "Uniforms and field teams",
      "Executive and client gifts",
      "Caps and headwear programs",
      "Jackets and outerwear decoration",
    ],
    heroImage: {
      src: "/images/home/embroidery-caps.jpg",
      alt: "Custom caps being embroidered on a Tajima machine",
    },
    work: [
      {
        src: "/images/home/embroidery-caps.jpg",
        alt: "Custom caps on the embroidery machine",
        caption: "Caps & headwear",
      },
      {
        src: "/images/home/work-embroidered-polo.jpg",
        alt: "Polo with embroidered chest mark",
        caption: "Polos & workwear",
      },
      {
        src: "/images/home/work-embroidered-hoodie.jpg",
        alt: "Hoodie with embroidered back emblem",
        caption: "Jackets & hoodies",
      },
      {
        src: "/images/home/work-embroidery-detail.jpg",
        alt: "Embroidery needle stitching a gold emblem",
        caption: "Production detail",
      },
    ],
  },
  {
    id: "print",
    title: "Print & Direct Mail",
    description:
      "Business cards, postcards, mailers, EDDM, and yard signs — printed and ready.",
    longDescription:
      "From business cards to mailbox campaigns and outdoor signs, we manage print so your materials look sharp and arrive on time.",
    pageIntro:
      "Business cards, postcards, EDDM, mailers, and yard signs — managed so your print looks sharp and lands on time, with a clear quote before we go to press.",
    icon: "printer",
    href: "/services/print",
    features: [
      "Business cards and stationery",
      "Postcards and direct mail",
      "Mailers and marketing inserts",
      "EDDM campaigns",
      "Yard signs, banners, and outdoor signage",
    ],
    idealFor: [
      "Local marketing campaigns",
      "Sales and realtor kits",
      "Grand openings and events",
      "Ongoing print replenishment",
    ],
    heroImage: {
      src: "/images/home/print-mailers.jpg",
      alt: "Direct mail postcards stacked and ready to send",
    },
    work: [
      {
        src: "/images/home/print-mailers.jpg",
        alt: "Direct mail postcards",
        caption: "Cards & collateral",
      },
      {
        src: "/images/home/work-print-press.jpg",
        alt: "Print production and large-format press",
        caption: "Press & production",
      },
      {
        src: "/images/home/work-print-collateral.jpg",
        alt: "Printed business cards and campaign materials",
        caption: "Campaign kits",
      },
      {
        src: "/images/home/work-team-apparel.jpg",
        alt: "Reviewing branded materials with the team",
        caption: "Proof & review",
      },
    ],
  },
  {
    id: "gifting",
    title: "Corporate Gifting",
    description:
      "Welcome kits, client gifts, and seasonal boxes that feel personal — not generic.",
    longDescription:
      "We build gift programs for onboarding, appreciation, and holidays — logo-decorated, packed, and ready to send.",
    pageIntro:
      "Onboarding kits, client appreciation, and seasonal boxes that feel considered — logo-decorated, packed, and ready to send after you approve the quote.",
    icon: "gift",
    href: "/services/gifting",
    features: [
      "New hire and onboarding kits",
      "Client appreciation gifts",
      "Holiday and seasonal campaigns",
      "Executive and VIP gifting",
      "Custom packaging options",
    ],
    idealFor: [
      "New hire experiences",
      "Client and partner thank-yous",
      "Holiday and milestone gifts",
      "Executive and VIP moments",
    ],
    heroImage: {
      src: "/images/home/work-welcome-kit.jpg",
      alt: "Custom welcome kit with branded apparel and gifts",
    },
    work: [
      {
        src: "/images/home/work-welcome-kit.jpg",
        alt: "Branded welcome kit in a gift box",
        caption: "Welcome kits",
      },
      {
        src: "/images/home/work-branded-drinkware.jpg",
        alt: "Branded tumblers and drinkware",
        caption: "Kit essentials",
      },
      {
        src: "/images/home/work-totes.jpg",
        alt: "Custom printed tote bags",
        caption: "Packaged totes",
      },
      {
        src: "/images/home/work-embroidered-polo.jpg",
        alt: "Soft goods for gifting",
        caption: "Soft goods gifts",
      },
    ],
  },
  {
    id: "events",
    title: "Events & Trade Shows",
    description:
      "Booth swag, giveaways, and kits that help you show up prepared.",
    longDescription:
      "We source and decorate event gear, then get it where it needs to be — before, during, and after the show.",
    pageIntro:
      "Booth swag, attendee kits, and custom signage timed to your show calendar — sourced, decorated, and shipped where it needs to be.",
    icon: "presentation",
    href: "/services/events",
    features: [
      "Trade show giveaways and booth materials",
      "Conference and attendee kits",
      "Custom signage and displays",
      "Pre-event and on-site fulfillment",
      "Bulk shipping to venues",
    ],
    idealFor: [
      "Trade shows and expos",
      "Conferences and summits",
      "Pop-ups and event activations",
      "Sponsor and booth packages",
    ],
    heroImage: {
      src: "/images/home/events-trade-show.jpg",
      alt: "Trade show floor with branded booths and attendees",
    },
    work: [
      {
        src: "/images/home/events-trade-show.jpg",
        alt: "Trade show booths and attendees",
        caption: "Trade shows",
      },
      {
        src: "/images/home/work-event-kit.jpg",
        alt: "Attendee kits",
        caption: "Attendee kits",
      },
      {
        src: "/images/home/work-branded-drinkware.jpg",
        alt: "Event drinkware",
        caption: "High-use swag",
      },
      {
        src: "/images/home/work-team-apparel.jpg",
        alt: "Team ready for an event",
        caption: "Show readiness",
      },
    ],
  },
  {
    id: "stores",
    title: "Company Stores & Programs",
    description:
      "A simple place for your team or partners to order custom gear with your logo.",
    longDescription:
      "We help set up and manage custom ordering programs — catalog, fulfillment, and ongoing support included.",
    pageIntro:
      "A simple, custom storefront for employees or partners to order — we help set the catalog, manage fulfillment, and keep the program running smoothly.",
    icon: "store",
    href: "/services/stores",
    features: [
      "Custom online storefronts",
      "Employee and client ordering",
      "Inventory and fulfillment support",
      "Bulk and individual shipping",
      "Simple reporting",
    ],
    idealFor: [
      "Employee merch programs",
      "Dealer and partner stores",
      "Alumni and fan shops",
      "Ongoing inventory replenishment",
    ],
    heroImage: {
      src: "/images/home/company-store.jpg",
      alt: "Custom company store catalog with branded apparel",
    },
    work: [
      {
        src: "/images/home/company-store.jpg",
        alt: "Company storefront catalog",
        caption: "Catalog apparel",
      },
      {
        src: "/images/home/work-embroidered-hoodie.jpg",
        alt: "Program outerwear",
        caption: "Seasonal drops",
      },
      {
        src: "/images/home/work-embroidered-caps.jpg",
        alt: "Store headwear",
        caption: "Headwear options",
      },
      {
        src: "/images/home/work-team-apparel.jpg",
        alt: "Team collaborating on a program",
        caption: "Program support",
      },
    ],
  },
];

export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}

export function getRelatedServices(id: string, limit = 3) {
  return services.filter((service) => service.id !== id).slice(0, limit);
}
