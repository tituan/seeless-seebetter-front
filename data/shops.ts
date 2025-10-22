export type Shop = {
  id: string;
  name: string;
  style: string;
  district: string;
  address: string;
  mapUrl: string;
  website?: string;
  phone?: string;
  description?: string;
};

export const shops: Shop[] = [
  {
    id: "starcow",
    name: "Starcow",
    style: "Streetwear & sneakers",
    district: "1er arrondissement",
    address: "41 Rue Berger, 75001 Paris",
    phone: "+33 1 42 36 72 21",
    website: "https://www.starcowparis.com",
    description:
      "Sélection pointue de sneakers et pièces streetwear au cœur des Halles.",
    mapUrl: "https://www.google.com/maps?q=Starcow+Paris&output=embed",
  },
  {
    id: "opium",
    name: "Opium Paris",
    style: "Sneakers & editions limitees",
    district: "1er arrondissement",
    address: "19 Rue Pierre Lescot, 75001 Paris",
    phone: "+33 9 81 79 51 61",
    website: "https://www.opiumparis.com",
    description:
      "Exclusivités, séries limitées et modèles pointus dans une boutique à l’ambiance futuriste.",
    mapUrl: "https://www.google.com/maps?q=Opium+Paris&output=embed",
  },
  {
    id: "centre-commercial",
    name: "Centre Commercial",
    style: "Mode responsable",
    district: "10e arrondissement",
    address: "2 Rue de Marseille, 75010 Paris",
    website: "https://centrecommercial.cc",
    description: "Marques européennes engagées, mix de prêt-à-porter et design.",
    mapUrl: "https://www.google.com/maps?q=Centre+Commercial+Paris&output=embed",
  },
  {
    id: "merci",
    name: "Merci",
    style: "Concept-store design",
    district: "3e arrondissement",
    address: "111 Boulevard Beaumarchais, 75003 Paris",
    website: "https://mercishop.com",
    description: "Iconique concept-store mêlant mobilier, mode et librairie.",
    mapUrl: "https://www.google.com/maps?q=Merci+Concept+Store+Paris&output=embed",
  },
  {
    id: "thebrokenarm",
    name: "The Broken Arm",
    style: "Mode & lifestyle",
    district: "3e arrondissement",
    address: "12 Rue Perrée, 75003 Paris",
    website: "https://the-broken-arm.com",
    description: "Sélection sharp de designers, café attenant très prisé.",
    mapUrl:
      "https://www.google.com/maps?q=The+Broken+Arm+Paris&output=embed",
  },
];
