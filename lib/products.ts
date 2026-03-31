export type Product = {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  image: string;
  gallery: {
    label: string;
    image: string;
  }[];
  description: string;
  specs: {
    height: string;
    weight: string;
    bust: string;
    waist: string;
    hip: string;
    orifices: string;
    joints: string;
  };
};

export const products: Product[] = [
  {
    id: "aria",
    name: "Aria",
    tagline: "The Scholar",
    basePrice: 2499,
    image: "https://via.placeholder.com/900x1200.png?text=Aria",
    description:
      "Anatomically accurate premium companion platform engineered for realism, balance, and expressive interaction.",
    gallery: [
      { label: "Overall", image: "https://via.placeholder.com/1200x1600.png?text=Aria+Overall" },
      { label: "Face", image: "https://via.placeholder.com/1200x1600.png?text=Aria+Face" },
      { label: "Body", image: "https://via.placeholder.com/1200x1600.png?text=Aria+Body" },
      { label: "Detail", image: "https://via.placeholder.com/1200x1600.png?text=Aria+Detail" },
      { label: "Joints", image: "https://via.placeholder.com/1200x1600.png?text=Aria+Joints" },
    ],
    specs: {
      height: "165 cm",
      weight: "32 kg",
      bust: "92 cm",
      waist: "63 cm",
      hip: "95 cm",
      orifices: "3 anatomically integrated channels",
      joints: "34 articulated joints",
    },
  },
  {
    id: "lyra",
    name: "Lyra",
    tagline: "The Muse",
    basePrice: 2699,
    image: "https://via.placeholder.com/900x1200.png?text=Lyra",
    description:
      "A soft-touch medical-grade silicone companion with adaptive AI responses and natural postural movement.",
    gallery: [
      { label: "Overall", image: "https://via.placeholder.com/1200x1600.png?text=Lyra+Overall" },
      { label: "Face", image: "https://via.placeholder.com/1200x1600.png?text=Lyra+Face" },
      { label: "Body", image: "https://via.placeholder.com/1200x1600.png?text=Lyra+Body" },
      { label: "Detail", image: "https://via.placeholder.com/1200x1600.png?text=Lyra+Detail" },
      { label: "Joints", image: "https://via.placeholder.com/1200x1600.png?text=Lyra+Joints" },
    ],
    specs: {
      height: "168 cm",
      weight: "34 kg",
      bust: "95 cm",
      waist: "64 cm",
      hip: "97 cm",
      orifices: "3 anatomically integrated channels",
      joints: "36 articulated joints",
    },
  },
  {
    id: "nora",
    name: "Nora",
    tagline: "The Listener",
    basePrice: 2899,
    image: "https://via.placeholder.com/900x1200.png?text=Nora",
    description:
      "Precision-engineered architecture integrating emotional memory, voice interaction, and high-fidelity detailing.",
    gallery: [
      { label: "Overall", image: "https://via.placeholder.com/1200x1600.png?text=Nora+Overall" },
      { label: "Face", image: "https://via.placeholder.com/1200x1600.png?text=Nora+Face" },
      { label: "Body", image: "https://via.placeholder.com/1200x1600.png?text=Nora+Body" },
      { label: "Detail", image: "https://via.placeholder.com/1200x1600.png?text=Nora+Detail" },
      { label: "Joints", image: "https://via.placeholder.com/1200x1600.png?text=Nora+Joints" },
    ],
    specs: {
      height: "172 cm",
      weight: "36 kg",
      bust: "96 cm",
      waist: "66 cm",
      hip: "99 cm",
      orifices: "3 anatomically integrated channels",
      joints: "38 articulated joints",
    },
  },
];

export const getProductById = (id: string) => products.find((item) => item.id === id);
