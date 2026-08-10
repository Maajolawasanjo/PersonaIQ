export interface VTOAsset {
  id: string;
  name: string;
  category: 'clothing' | 'footwear' | 'accessories' | 'style_references';
  subcategory: string;
  gender: 'male' | 'female' | 'unisex';
  asset_type: 'product' | 'reference';
  image_url: string;
  color?: string;
  occasions: string[];
  is_active: boolean;
}

export interface VTOModel {
  id: string;
  name: string;
  gender: 'male' | 'female';
  ethnicity: 'black' | 'white';
  image_url: string;
}

export const VTO_MODELS: VTOModel[] = [
  { id: 'male_black', name: 'Male Black Model', gender: 'male', ethnicity: 'black', image_url: '/vto/models/male/black/male_black_base.jpg' },
  { id: 'female_black', name: 'Female Black Model', gender: 'female', ethnicity: 'black', image_url: '/vto/models/female/black/female_black_base.jpg' },
  { id: 'male_white', name: 'Male White Model', gender: 'male', ethnicity: 'white', image_url: '/vto/models/male/white/male_white_base.jpg' },
  { id: 'female_white', name: 'Female White Model', gender: 'female', ethnicity: 'white', image_url: '/vto/models/female/white/female_white_base.jpg' },
];

export const VTO_CATALOG: VTOAsset[] = [
  // --- CLOTHING: Professional ---
  {
    id: 'cloth-navy-suit-001',
    name: 'Executive Navy Tailored Suit',
    category: 'clothing',
    subcategory: 'professional',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/clothing/professional/01_navy_suit.jpg',
    color: 'navy',
    occasions: ['interview', 'meeting', 'conference', 'work'],
    is_active: true,
  },
  {
    id: 'cloth-black-suit-002',
    name: 'Executive Charcoal Double-Breasted Suit',
    category: 'clothing',
    subcategory: 'professional',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/clothing/professional/02_black_suit.jpg',
    color: 'charcoal',
    occasions: ['interview', 'meeting', 'conference', 'formal'],
    is_active: true,
  },
  {
    id: 'cloth-beige-power-suit-003',
    name: 'Beige Power Executive Suit',
    category: 'clothing',
    subcategory: 'professional',
    gender: 'female',
    asset_type: 'product',
    image_url: '/vto/clothing/professional/04_beige_power_suit.jpg',
    color: 'beige',
    occasions: ['interview', 'meeting', 'conference'],
    is_active: true,
  },
  {
    id: 'cloth-white-shirt-004',
    name: 'Crisp White Oxford Spread Collar',
    category: 'clothing',
    subcategory: 'professional',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/clothing/professional/05_white_dress_shirt.jpg',
    color: 'white',
    occasions: ['interview', 'meeting', 'conference', 'church'],
    is_active: true,
  },
  {
    id: 'cloth-blue-shirt-005',
    name: 'Light Blue Dress Shirt',
    category: 'clothing',
    subcategory: 'professional',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/clothing/professional/06_light_blue_dress_shirt.jpg',
    color: 'blue',
    occasions: ['interview', 'meeting', 'work'],
    is_active: true,
  },

  // --- CLOTHING: Casual ---
  {
    id: 'cloth-tan-ascot-010',
    name: 'Smart Casual Tan Ascot Knit',
    category: 'clothing',
    subcategory: 'casual',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/clothing/casual/03_beige_hoodie.jpg',
    color: 'tan',
    occasions: ['travel', 'date', 'party', 'casual'],
    is_active: true,
  },
  {
    id: 'cloth-black-tshirt-011',
    name: 'Premium Black Heavyweight Tee',
    category: 'clothing',
    subcategory: 'casual',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/clothing/casual/01_black_tshirt.jpg',
    color: 'black',
    occasions: ['travel', 'casual', 'date'],
    is_active: true,
  },
  {
    id: 'cloth-winter-casual-012',
    name: 'Premium Winter Outerwear Knit',
    category: 'clothing',
    subcategory: 'casual',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/clothing/casual/08_green_sweatshirt.jpg',
    color: 'brown',
    occasions: ['travel', 'casual'],
    is_active: true,
  },

  // --- CLOTHING: Ceremonial & Traditional ---
  {
    id: 'cloth-senator-020',
    name: 'Formal Senator Suit & Agbada',
    category: 'clothing',
    subcategory: 'ceremonial',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/clothing/ceremonial/traditional_men.jpg',
    color: 'white',
    occasions: ['traditional', 'wedding', 'church', 'party'],
    is_active: true,
  },
  {
    id: 'cloth-kaftan-021',
    name: '3-Piece Traditional Luxury Kaftan',
    category: 'clothing',
    subcategory: 'ceremonial',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/clothing/ceremonial/traditional_women.jpg',
    color: 'blue',
    occasions: ['traditional', 'wedding', 'church', 'party'],
    is_active: true,
  },
  {
    id: 'cloth-livity-022',
    name: 'Livity Executive Traditional Ensemble',
    category: 'clothing',
    subcategory: 'formal',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/clothing/formal/cocktail_dress.jpg',
    color: 'emerald',
    occasions: ['traditional', 'wedding', 'party'],
    is_active: true,
  },
  {
    id: 'cloth-tunic-023',
    name: 'Mandarin Collar Tunic Suit',
    category: 'clothing',
    subcategory: 'religious',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/clothing/religious/church_attire.jpg',
    color: 'burgundy',
    occasions: ['traditional', 'wedding', 'formal', 'church'],
    is_active: true,
  },
  {
    id: 'cloth-funeral-024',
    name: 'Executive Dark Funeral Outfit',
    category: 'clothing',
    subcategory: 'funeral',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/clothing/funeral/funeral_outfit.jpg',
    color: 'black',
    occasions: ['funeral'],
    is_active: true,
  },

  // --- FOOTWEAR ---
  {
    id: 'shoe-oxford-black-101',
    name: 'Classic Black Cap-Toe Oxford',
    category: 'footwear',
    subcategory: 'formal',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/footwear/formal/oxford_black.jpg',
    color: 'black',
    occasions: ['interview', 'meeting', 'conference', 'formal', 'funeral'],
    is_active: true,
  },
  {
    id: 'shoe-oxford-brown-102',
    name: 'Hand-Burnished Cognac Oxford',
    category: 'footwear',
    subcategory: 'formal',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/footwear/formal/oxford_brown.jpg',
    color: 'brown',
    occasions: ['interview', 'meeting', 'conference', 'wedding'],
    is_active: true,
  },
  {
    id: 'shoe-loafers-black-103',
    name: 'Executive Penny Loafers',
    category: 'footwear',
    subcategory: 'business',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/footwear/business/loafers_black.jpg',
    color: 'black',
    occasions: ['interview', 'meeting', 'travel', 'casual'],
    is_active: true,
  },
  {
    id: 'shoe-chelsea-black-104',
    name: 'Italian Leather Chelsea Boots',
    category: 'footwear',
    subcategory: 'boots',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/footwear/boots/chelsea_black.jpg',
    color: 'black',
    occasions: ['date', 'travel', 'casual', 'party'],
    is_active: true,
  },
  {
    id: 'shoe-heels-black-105',
    name: 'Pointed-Toe Black Leather Heels',
    category: 'footwear',
    subcategory: 'womens',
    gender: 'female',
    asset_type: 'product',
    image_url: '/vto/footwear/womens/heels_black.jpg',
    color: 'black',
    occasions: ['interview', 'meeting', 'formal', 'party'],
    is_active: true,
  },
  {
    id: 'shoe-sneakers-white-106',
    name: 'Minimalist White Calfskin Sneakers',
    category: 'footwear',
    subcategory: 'casual',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/footwear/casual/sneakers_white.jpg',
    color: 'white',
    occasions: ['travel', 'casual', 'party'],
    is_active: true,
  },

  // --- ACCESSORIES ---
  {
    id: 'acc-watch-silver-201',
    name: 'Chronograph Stainless Steel Watch',
    category: 'accessories',
    subcategory: 'watches',
    gender: 'unisex',
    asset_type: 'product',
    image_url: '/vto/accessories/watches/classic_silver.jpg',
    color: 'silver',
    occasions: ['interview', 'meeting', 'conference', 'formal'],
    is_active: true,
  },
  {
    id: 'acc-tie-black-202',
    name: 'Silk Black Slim Necktie',
    category: 'accessories',
    subcategory: 'ties',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/accessories/ties/black.jpg',
    color: 'black',
    occasions: ['interview', 'meeting', 'formal', 'funeral'],
    is_active: true,
  },
  {
    id: 'acc-hat-trad-203',
    name: 'Embroidered Traditional Cap (Fila)',
    category: 'accessories',
    subcategory: 'hats',
    gender: 'male',
    asset_type: 'product',
    image_url: '/vto/accessories/hats/traditional_cap.jpg',
    color: 'maroon',
    occasions: ['traditional', 'wedding', 'church'],
    is_active: true,
  },

  // --- STYLE REFERENCES: Hairstyles & Grooming ---
  {
    id: 'style-crop-fade-301',
    name: 'Low Drop Fade with Precision Edge',
    category: 'style_references',
    subcategory: 'hairstyles',
    gender: 'male',
    asset_type: 'reference',
    image_url: '/vto/style_references/hairstyles/black_african/men/short_crop_fade.jpg',
    occasions: ['interview', 'meeting', 'conference', 'formal', 'traditional'],
    is_active: true,
  },
  {
    id: 'style-knotless-braids-302',
    name: 'Executive Knotless Braids Updo',
    category: 'style_references',
    subcategory: 'hairstyles',
    gender: 'female',
    asset_type: 'reference',
    image_url: '/vto/style_references/hairstyles/black_african/women/knotless_braids.jpg',
    occasions: ['interview', 'meeting', 'conference', 'formal', 'traditional'],
    is_active: true,
  },
  {
    id: 'style-side-part-303',
    name: 'Classic Executive Side Part',
    category: 'style_references',
    subcategory: 'hairstyles',
    gender: 'male',
    asset_type: 'reference',
    image_url: '/vto/style_references/hairstyles/white_european/men/classic_side_part.jpg',
    occasions: ['interview', 'meeting', 'conference'],
    is_active: true,
  },
  {
    id: 'style-loose-waves-304',
    name: 'Elegant Shoulder-Length Loose Waves',
    category: 'style_references',
    subcategory: 'hairstyles',
    gender: 'female',
    asset_type: 'reference',
    image_url: '/vto/style_references/hairstyles/white_european/women/long_loose_waves.jpg',
    occasions: ['interview', 'meeting', 'date', 'party'],
    is_active: true,
  },
];

export function getRecommendedAssets(occasion: string, category?: string): VTOAsset[] {
  const occ = occasion.toLowerCase();
  let list = VTO_CATALOG.filter((item) =>
    item.occasions.some((o) => o.toLowerCase() === occ || occ.includes(o.toLowerCase()))
  );
  if (list.length === 0) {
    list = VTO_CATALOG; // fallback
  }
  if (category) {
    return list.filter((item) => item.category === category);
  }
  return list;
}
