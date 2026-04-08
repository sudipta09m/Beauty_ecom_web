import bcrypt from "bcryptjs";

const productCatalog = [
  {
    id: 1,
    name: "Rose Velvet Serum",
    category: "Skincare",
    price: 38,
    image_path: "rose-velvet-serum.svg",
    image_path_2: "rose-velvet-serum.svg",
    image_path_3: "rose-velvet-serum.svg",
    stock: 24,
    rating: 4.8,
    description: "A glow-boosting serum with rose extract, niacinamide, and hyaluronic acid."
  },
  {
    id: 2,
    name: "Soft Matte Lip Cloud",
    category: "Makeup",
    price: 22,
    image_path: "soft-matte-lip-cloud.svg",
    image_path_2: "soft-matte-lip-cloud.svg",
    image_path_3: "soft-matte-lip-cloud.svg",
    stock: 43,
    rating: 4.7,
    description: "Air-whipped lip color with a blurred matte finish and comfortable wear."
  },
  {
    id: 3,
    name: "Silk Repair Hair Mask",
    category: "Hair Care",
    price: 28,
    image_path: "silk-repair-hair-mask.svg",
    image_path_2: "silk-repair-hair-mask.svg",
    image_path_3: "silk-repair-hair-mask.svg",
    stock: 31,
    rating: 4.6,
    description: "A rich mask that smooths dry ends and restores shine in one treatment."
  },
  {
    id: 4,
    name: "Coconut Milk Body Wash",
    category: "Bath & Body",
    price: 18,
    image_path: "coconut-milk-body-wash.svg",
    image_path_2: "coconut-milk-body-wash.svg",
    image_path_3: "coconut-milk-body-wash.svg",
    stock: 51,
    rating: 4.5,
    description: "Gentle, creamy cleanser with coconut milk and shea for daily softness."
  },
  {
    id: 5,
    name: "Amber Bloom Eau de Parfum",
    category: "Fragrance",
    price: 56,
    image_path: "amber-bloom-eau-de-parfum.svg",
    image_path_2: "amber-bloom-eau-de-parfum.svg",
    image_path_3: "amber-bloom-eau-de-parfum.svg",
    stock: 17,
    rating: 4.9,
    description: "A warm floral fragrance with amber, peony, and skin-soft musk."
  },
  {
    id: 6,
    name: "Cloud Finish Compact",
    category: "Makeup",
    price: 26,
    image_path: "cloud-finish-compact.svg",
    image_path_2: "cloud-finish-compact.svg",
    image_path_3: "cloud-finish-compact.svg",
    stock: 35,
    rating: 4.4,
    description: "Weightless setting powder that smooths pores and controls midday shine."
  }
];

const defaultPasswordHash = bcrypt.hashSync("password123", 8);

export const memoryStore = {
  users: [
    {
      id: "u1",
      name: "Demo Shopper",
      email: "demo@lumeluxe.com",
      phone: "+1 555 014 221",
      address: "14 Rose Lane",
      city: "Brooklyn",
      passwordHash: defaultPasswordHash
    }
  ],
  orders: [
    {
      id: "o1",
      userId: "u1",
      customer: {
        name: "Demo Shopper",
        email: "demo@lumeluxe.com",
        phone: "+1 555 014 221",
        address: "14 Rose Lane",
        city: "Brooklyn"
      },
      items: [{ productId: 1, quantity: 1 }],
      total: 38,
      status: "Delivered",
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: "r1",
      productId: 1,
      userName: "Ava",
      rating: 5,
      comment: "Silky, light, and my skin looks brighter in a week.",
      createdAt: new Date().toISOString()
    },
    {
      id: "r2",
      productId: 2,
      userName: "Mia",
      rating: 4,
      comment: "Beautiful blur effect and surprisingly moisturizing.",
      createdAt: new Date().toISOString()
    }
  ],
  feedback: [],
  wholesaleLeads: [],
  products: productCatalog
};
