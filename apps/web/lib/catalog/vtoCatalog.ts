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

export interface StylistAnalysisResult {
  look_name: string;
  total_score: number;
  items: Array<{ category: string; item_name: string }>;
  reasoning: {
    summary: string;
    recommended_protocol: string;
    avoid_protocol: string;
  };
}

export function generateGeminiStylistReasoning(
  occasion: string,
  targetVibe: string = 'Authoritative',
  clothing?: VTOAsset,
  footwear?: VTOAsset,
  accessory?: VTOAsset,
  hairstyle?: VTOAsset
): StylistAnalysisResult {
  const occLower = occasion.toLowerCase();
  const topClothing = clothing || getRecommendedAssets(occasion, 'clothing')[0] || VTO_CATALOG[0];
  const topFootwear = footwear || getRecommendedAssets(occasion, 'footwear')[0] || VTO_CATALOG[13];
  const topAccessory = accessory || getRecommendedAssets(occasion, 'accessories')[0] || VTO_CATALOG[20];
  const topHairstyle = hairstyle || getRecommendedAssets(occasion, 'style_references')[0] || VTO_CATALOG[23];

  let score = 94;
  let lookTitle = `Executive ${targetVibe} Ensemble`;
  let summaryText = '';
  let recommendedText = '';
  let avoidText = '';

  if (occLower.includes('interview')) {
    score = 97;
    lookTitle = `Job Interview Power Profile`;
    summaryText = `Pairing the ${topClothing.name} with ${topFootwear.name} projects crisp structure and trustworthiness. The ${topAccessory.name} anchors high executive authority while your ${topHairstyle.name} maintains clean framing around your T-zone.`;
    recommendedText = `Polished leather Oxford shoes, minimal silver/steel watch, and crisp white or light blue collar framing.`;
    avoidText = `Casual sneakers, unbuttoned collar without jacket structure, or flash/loud pattern ties.`;
  } else if (occLower.includes('wedding')) {
    score = 96;
    lookTitle = `Regal Wedding Celebration Profile`;
    summaryText = `The ${topClothing.name} delivers vibrant sophistication appropriate for a wedding guest or VIP. Accentuated by ${topFootwear.name} and ${topAccessory.name}, this look strikes an ideal balance between festive elegance and distinguished presence.`;
    recommendedText = `Rich textured footwear, statement luxury chronograph or traditional cap/fila, and structured posture.`;
    avoidText = `Overly drab corporate attire, unpolished footwear, or work-office lanyards.`;
  } else if (occLower.includes('church') || occLower.includes('religious')) {
    score = 95;
    lookTitle = `Reverent Ceremonial Ensemble`;
    summaryText = `Selected ${topClothing.name} paired with ${topFootwear.name} provides respectful, elevated formality for religious gatherings. The ${topAccessory.name} adds refined detail without drawing excessive attention away from the service.`;
    recommendedText = `Modest high-collar cut, clean leather loafers or Oxfords, and subtle wristwatch.`;
    avoidText = `Short cuts, excessively tight leisurewear, or prominent athletics logos.`;
  } else if (occLower.includes('funeral') || occLower.includes('burial')) {
    score = 93;
    lookTitle = `Solemn Executive Tribute Profile`;
    summaryText = `Deep, subdued tone of ${topClothing.name} combined with ${topFootwear.name} creates a dignified aesthetic suited for memorial honor. Modest styling of ${topHairstyle.name} reflects quiet respect.`;
    recommendedText = `Subdued dark color palette (Black/Charcoal), minimal dark accessories, and clean-shaven or neat edge grooming.`;
    avoidText = `Vibrant colors, bold metallic watches, glossy party wear, or casual footwear.`;
  } else if (occLower.includes('traditional')) {
    score = 98;
    lookTitle = `Heritage Cultural Elegance Ensemble`;
    summaryText = `Featuring the ${topClothing.name} with tailored ${topFootwear.name} and ${topAccessory.name}. This traditional profile highlights rich African craftsmanship while maintaining executive sophistication for high-status cultural events.`;
    recommendedText = `Matching traditional cap (Fila), luxury leather slippers or loafers, and gold/bronze watch accents.`;
    avoidText = `Western denim jackets over kaftans, athletic sneakers, or ill-fitting trousers.`;
  } else if (occLower.includes('travel')) {
    score = 92;
    lookTitle = `Transit & Airport Lounge Executive`;
    summaryText = `Designed for long-haul comfort: ${topClothing.name} paired with ${topFootwear.name} offers breathable mobility while ensuring you step off the aircraft looking composed for immediate client meetings.`;
    recommendedText = `Slip-on leather loafers, crease-resistant knit layers, and functional travel messenger.`;
    avoidText = `Stiff high-collar suits during flights, unsupportive dress shoes, or heavy metallic accessories.`;
  } else if (occLower.includes('date')) {
    score = 95;
    lookTitle = `Elevated Evening Romance Look`;
    summaryText = `Combines the modern silhouette of ${topClothing.name} with ${topFootwear.name} and ${topAccessory.name}. Strikes a warm, approachable vibe while projecting tasteful confidence and keen attention to detail.`;
    recommendedText = `Smart tailored blazer or knit layer, polished leather Chelsea boots or loafers, and subtle fragrance note baseline.`;
    avoidText = `Overly rigid boardroom ties, bulky work computer bags, or worn athletic footwear.`;
  } else {
    score = 94;
    lookTitle = `Executive ${targetVibe} Presence Profile`;
    summaryText = `Selected ${topClothing.name} matched with ${topFootwear.name} establishes strong visual authority for ${occasion.toUpperCase()}. Accentuated by ${topAccessory.name} and framed by ${topHairstyle.name}.`;
    recommendedText = `Structured shoulder alignment, polished leather footwear, and minimalist timepieces.`;
    avoidText = `Uncoordinated shoe and belt colors, informal denim, or unkempt neckline grooming.`;
  }

  return {
    look_name: lookTitle,
    total_score: score,
    items: [
      { category: 'Clothing', item_name: topClothing.name },
      { category: 'Footwear', item_name: topFootwear.name },
      { category: 'Accessory', item_name: topAccessory.name },
      { category: 'Hairstyle', item_name: topHairstyle.name },
    ],
    reasoning: {
      summary: summaryText,
      recommended_protocol: recommendedText,
      avoid_protocol: avoidText,
    },
  };
}

