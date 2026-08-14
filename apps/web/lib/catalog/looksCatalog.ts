export interface LookConstituentItem {
  name: string;
  category: 'top' | 'shirt' | 'bottom' | 'shoes' | 'accessory' | 'traditional';
  image: string;
}

export interface VTOLookDefinition {
  id: string;
  code: string; // e.g. 'M01', 'F01'
  gender: 'male' | 'female';
  occasionKey: string;
  occasionTitle: string;
  title: string;
  description: string;
  score: number;
  imageUrl: string;
  colorPalette: string[];
  vibeMatch: string;
  items: LookConstituentItem[];
  stylingNotes: string;
}

export const VTO_30_LOOKS_CATALOG: VTOLookDefinition[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // MALE COLLECTION — 15 LOOKS (M01–M15)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'M01',
    code: 'M01',
    gender: 'male',
    occasionKey: 'job_interview',
    occasionTitle: 'Professional Job Interview',
    title: 'Executive Navy Interview Suit',
    description: 'Conservative, highly polished business-formal outfit communicating competence, reliability, and executive maturity.',
    score: 95,
    imageUrl: '/vto/looks/male/M01_job_interview.png',
    colorPalette: ['Navy', 'White', 'Black', 'Silver'],
    vibeMatch: 'Confident & Trustworthy',
    items: [
      { name: 'Deep Navy Tailored Suit Blazer', category: 'top', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Crisp White Dress Shirt', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Navy Tailored Trousers', category: 'bottom', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Black Leather Oxfords', category: 'shoes', image: '/vto/footwear/formal/oxford_black.jpg' },
    ],
    stylingNotes: 'Jacket properly fitted at shoulders, trousers naturally break just above Oxfords. Silver watch detail.',
  },
  {
    id: 'M02',
    code: 'M02',
    gender: 'male',
    occasionKey: 'business_meeting',
    occasionTitle: 'Executive Business Meeting',
    title: 'Charcoal Authority Suit',
    description: 'Sophisticated business-formal attire with dark charcoal tailoring and dark burgundy silk tie accents.',
    score: 93,
    imageUrl: '/vto/looks/male/M02_business_meeting.png',
    colorPalette: ['Charcoal', 'White', 'Burgundy', 'Black'],
    vibeMatch: 'Authoritative & Composed',
    items: [
      { name: 'Charcoal Grey Tailored Blazer', category: 'top', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Premium White Dress Shirt', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Dark Charcoal Trousers', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Black Leather Derby Shoes', category: 'shoes', image: '/vto/footwear/formal/oxford_black.jpg' },
    ],
    stylingNotes: 'Sharp tailoring designed for high-stakes presentations and risk communication.',
  },
  {
    id: 'M03',
    code: 'M03',
    gender: 'male',
    occasionKey: 'executive_conference',
    occasionTitle: 'Leadership Summit',
    title: 'Executive Leadership Three-Piece',
    description: 'Deep charcoal three-piece suit with subtle texture, light blue dress shirt, and navy silk tie.',
    score: 96,
    imageUrl: '/vto/looks/male/M03_executive_conference.png',
    colorPalette: ['Charcoal', 'Light Blue', 'Navy', 'Black'],
    vibeMatch: 'Senior Executive Leadership',
    items: [
      { name: 'Charcoal Textured 3-Piece Blazer', category: 'top', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Light Blue Dress Shirt', category: 'shirt', image: '/vto/clothing/professional/06_light_blue_dress_shirt.jpg' },
      { name: 'Tailored Charcoal Trousers', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Polished Black Oxfords', category: 'shoes', image: '/vto/footwear/formal/oxford_black.jpg' },
    ],
    stylingNotes: 'Structured shoulders and precise chest lines tailored for keynote stage projection.',
  },
  {
    id: 'M04',
    code: 'M04',
    gender: 'male',
    occasionKey: 'wedding_guest',
    occasionTitle: 'Elegant Wedding Guest',
    title: 'Midnight Blue Celebration Ensemble',
    description: 'Deep midnight-blue tailored suit with champagne pocket square and dark brown leather loafers.',
    score: 91,
    imageUrl: '/vto/looks/male/M04_wedding_guest.png',
    colorPalette: ['Midnight Blue', 'White', 'Champagne', 'Dark Brown'],
    vibeMatch: 'Refined & Celebratory',
    items: [
      { name: 'Midnight Blue Textured Blazer', category: 'top', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'White Open-Collar Dress Shirt', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Matching Midnight Trousers', category: 'bottom', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Dark Brown Leather Loafers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Festive elegance without competing with the groom. Brown leather accents add warmth.',
  },
  {
    id: 'M05',
    code: 'M05',
    gender: 'male',
    occasionKey: 'church_religious',
    occasionTitle: 'Sunday Service / Worship',
    title: 'Respectful Navy & Grey Tailored Ensemble',
    description: 'Dark navy tailored blazer paired with light grey trousers and dark brown Derby shoes.',
    score: 89,
    imageUrl: '/vto/looks/male/M05_church_religious.png',
    colorPalette: ['Navy', 'White', 'Light Grey', 'Brown'],
    vibeMatch: 'Composed & Respectful',
    items: [
      { name: 'Dark Navy Blazer', category: 'top', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'White Long-Sleeve Shirt', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Light Grey Tailored Trousers', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Dark Brown Derby Shoes', category: 'shoes', image: '/vto/footwear/formal/oxford_brown.jpg' },
    ],
    stylingNotes: 'Conservative and dignified posture support for church services and formal ceremonies.',
  },
  {
    id: 'M06',
    code: 'M06',
    gender: 'male',
    occasionKey: 'funeral',
    occasionTitle: 'Funeral / Memorial Service',
    title: 'Solemn Black Memorial Suit',
    description: 'Deeply respectful black two-piece suit with black shirt, black understated tie, and black Oxfords.',
    score: 94,
    imageUrl: '/vto/looks/male/M06_funeral.png',
    colorPalette: ['Black', 'Dark Charcoal', 'Silver'],
    vibeMatch: 'Solemn & Respectful',
    items: [
      { name: 'Black Tailored Suit Jacket', category: 'top', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Black Formal Shirt', category: 'shirt', image: '/vto/clothing/funeral/funeral_outfit.jpg' },
      { name: 'Black Tailored Trousers', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Black Leather Oxford Shoes', category: 'shoes', image: '/vto/footwear/formal/oxford_black.jpg' },
    ],
    stylingNotes: 'Extremely restrained. Zero decorative elements to preserve solemn dignity.',
  },
  {
    id: 'M07',
    code: 'M07',
    gender: 'male',
    occasionKey: 'date_night',
    occasionTitle: 'Sophisticated Date Night',
    title: 'Modern Charcoal Unstructured Evening Look',
    description: 'Black unstructured blazer over a dark fitted knit polo and charcoal tailored trousers with loafers.',
    score: 90,
    imageUrl: '/vto/looks/male/M07_date_night.png',
    colorPalette: ['Black', 'Charcoal', 'Dark Brown'],
    vibeMatch: 'Charismatic & Refined',
    items: [
      { name: 'Black Unstructured Blazer', category: 'top', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Fitted Dark Knit Polo', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Tailored Charcoal Trousers', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Dark Brown Leather Loafers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Clean modern silhouette. Slightly relaxed tailoring without tie for effortless evening charm.',
  },
  {
    id: 'M08',
    code: 'M08',
    gender: 'male',
    occasionKey: 'gala_party',
    occasionTitle: 'Black-Tie Gala / Evening Event',
    title: 'Classic Black Satin Peak Lapel Tuxedo',
    description: 'Impeccable black tuxedo with satin peak lapels, white formal shirt, black bow tie, and patent leather shoes.',
    score: 97,
    imageUrl: '/vto/looks/male/M08_gala_party.png',
    colorPalette: ['Black', 'White', 'Silver'],
    vibeMatch: 'Prestigious & Timeless',
    items: [
      { name: 'Satin Peak Lapel Tuxedo Jacket', category: 'top', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'White Pleated Tuxedo Shirt', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Tuxedo Trousers with Satin Stripe', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Patent Leather Evening Oxfords', category: 'shoes', image: '/vto/footwear/formal/oxford_black.jpg' },
    ],
    stylingNotes: 'Traditional black-tie proportions. Provides maximum visual presence for formal galas.',
  },
  {
    id: 'M09',
    code: 'M09',
    gender: 'male',
    occasionKey: 'traditional_ceremony',
    occasionTitle: 'Nigerian Traditional Ceremony',
    title: 'Royal Emerald Agbada Heritage Ensemble',
    description: 'Deep emerald-green agbada formal ensemble with gold embroidery, long tunic, trousers, and cap.',
    score: 96,
    imageUrl: '/vto/looks/male/M09_traditional_ceremony.png',
    colorPalette: ['Emerald Green', 'Gold', 'Neutral'],
    vibeMatch: 'Cultural Prestige & Authority',
    items: [
      { name: 'Embroidered Emerald Agbada Robe', category: 'top', image: '/vto/clothing/ceremonial/traditional_men.jpg' },
      { name: 'Matching Long Tunic Shirt', category: 'shirt', image: '/vto/clothing/ceremonial/traditional_men.jpg' },
      { name: 'Matching Tailored Trousers', category: 'bottom', image: '/vto/clothing/ceremonial/traditional_men.jpg' },
      { name: 'Traditional Embroidered Slippers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Modern African elegance featuring dignified traditional embroidery and coordinated Fila cap.',
  },
  {
    id: 'M10',
    code: 'M10',
    gender: 'male',
    occasionKey: 'travel',
    occasionTitle: 'Premium Business Travel',
    title: 'First-Class Transit Layered Look',
    description: 'Dark olive overshirt over a white crew-neck tee, tailored chinos, and minimalist leather sneakers.',
    score: 88,
    imageUrl: '/vto/looks/male/M10_travel.png',
    colorPalette: ['Navy', 'Olive', 'White', 'Grey'],
    vibeMatch: 'Smart & Travel-Ready',
    items: [
      { name: 'Olive Lightweight Overshirt', category: 'top', image: '/vto/clothing/casual/03_beige_hoodie.jpg' },
      { name: 'White Crew-Neck T-Shirt', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Tailored Travel Chinos', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Minimalist White Leather Sneakers', category: 'shoes', image: '/vto/footwear/casual/sneakers_white.jpg' },
    ],
    stylingNotes: 'Combines full travel comfort with executive airport terminal presentation.',
  },
  {
    id: 'M11',
    code: 'M11',
    gender: 'male',
    occasionKey: 'casual_weekend',
    occasionTitle: 'Premium Casual Weekend',
    title: 'Effortless Beige & Denim Weekend Ensemble',
    description: 'Light beige overshirt over a neutral heavyweight crew tee, dark denim, and minimalist sneakers.',
    score: 87,
    imageUrl: '/vto/looks/male/M11_casual_weekend.png',
    colorPalette: ['Cream', 'Olive', 'Dark Denim', 'White'],
    vibeMatch: 'Effortless & Approachable',
    items: [
      { name: 'Light Beige Casual Overshirt', category: 'top', image: '/vto/clothing/casual/03_beige_hoodie.jpg' },
      { name: 'Neutral Heavyweight Crew Tee', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Straight-Leg Dark Denim', category: 'bottom', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Clean White Leather Sneakers', category: 'shoes', image: '/vto/footwear/casual/sneakers_white.jpg' },
    ],
    stylingNotes: 'High-quality relaxed silhouette for upscale cafés and weekend leisure.',
  },
  {
    id: 'M12',
    code: 'M12',
    gender: 'male',
    occasionKey: 'fine_dining',
    occasionTitle: 'Fine Dining Evening',
    title: 'Midnight Fine Dining Tailored Look',
    description: 'Deep navy tailored blazer over a dark dress shirt, dark trousers, and dark brown leather loafers.',
    score: 92,
    imageUrl: '/vto/looks/male/M12_fine_dining.png',
    colorPalette: ['Black', 'Navy', 'Charcoal', 'Dark Brown'],
    vibeMatch: 'Refined & Polished',
    items: [
      { name: 'Deep Navy Tailored Blazer', category: 'top', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Dark Charcoal Silk Shirt', category: 'shirt', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Dark Tailored Trousers', category: 'bottom', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Dark Brown Leather Loafers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Sophisticated evening dinner styling with subtle warm contrast.',
  },
  {
    id: 'M13',
    code: 'M13',
    gender: 'male',
    occasionKey: 'creative_tech',
    occasionTitle: 'Creative / Tech Event',
    title: 'Silicon Valley Founder Smart Casual',
    description: 'Structured charcoal overshirt over an off-white tee, tapered dark trousers, and minimal black sneakers.',
    score: 90,
    imageUrl: '/vto/looks/male/M13_creative_tech.png',
    colorPalette: ['Charcoal', 'Black', 'Off-White', 'Metallic'],
    vibeMatch: 'Innovative & Intelligent',
    items: [
      { name: 'Structured Charcoal Overshirt', category: 'top', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Off-White Crew-Neck Top', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Tapered Dark Chino Trousers', category: 'bottom', image: '/vto/clothing/professional/02_black_suit.jpg' },
      { name: 'Minimalist Black Leather Sneakers', category: 'shoes', image: '/vto/footwear/casual/sneakers_white.jpg' },
    ],
    stylingNotes: 'Contemporary tech conference look balancing creative relaxedness with intelligent structure.',
  },
  {
    id: 'M14',
    code: 'M14',
    gender: 'male',
    occasionKey: 'graduation',
    occasionTitle: 'University Graduation',
    title: 'Academic Commencement Navy Suit',
    description: 'Navy tailored suit, crisp white dress shirt, dark burgundy tie, and black Oxford shoes.',
    score: 93,
    imageUrl: '/vto/looks/male/M14_graduation.png',
    colorPalette: ['Navy', 'White', 'Burgundy', 'Black'],
    vibeMatch: 'Accomplished & Optimistic',
    items: [
      { name: 'Navy Tailored Graduation Suit', category: 'top', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Crisp White Shirt', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Matching Navy Trousers', category: 'bottom', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Black Oxford Shoes', category: 'shoes', image: '/vto/footwear/formal/oxford_black.jpg' },
    ],
    stylingNotes: 'Young professional sophistication designed to complement commencement regalia.',
  },
  {
    id: 'M15',
    code: 'M15',
    gender: 'male',
    occasionKey: 'networking',
    occasionTitle: 'Professional Networking',
    title: 'Approachable Executive Mixer Outfit',
    description: 'Navy blazer over a light blue open-collar dress shirt, beige trousers, and dark brown loafers.',
    score: 91,
    imageUrl: '/vto/looks/male/M15_networking.png',
    colorPalette: ['Navy', 'Light Blue', 'Beige', 'Brown'],
    vibeMatch: 'Socially Confident & Open',
    items: [
      { name: 'Muted Navy Blazer', category: 'top', image: '/vto/clothing/professional/01_navy_suit.jpg' },
      { name: 'Light Blue Open-Collar Shirt', category: 'shirt', image: '/vto/clothing/professional/06_light_blue_dress_shirt.jpg' },
      { name: 'Tailored Beige Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Dark Brown Leather Loafers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Open-collar design facilitates warm networking interaction while retaining executive polish.',
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FEMALE COLLECTION — 15 LOOKS (F01–F15)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 'F01',
    code: 'F01',
    gender: 'female',
    occasionKey: 'job_interview',
    occasionTitle: 'Professional Job Interview',
    title: 'Executive Navy Tailored Trouser Suit',
    description: 'Deep navy structured blazer with crisp white blouse, coordinated trousers, and black pointed pumps.',
    score: 95,
    imageUrl: '/vto/looks/female/F01_job_interview.png',
    colorPalette: ['Navy', 'White', 'Black', 'Silver'],
    vibeMatch: 'Competent & Executive',
    items: [
      { name: 'Deep Navy Structured Blazer', category: 'top', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Crisp White Silk Blouse', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Coordinated Navy Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Black Leather Pointed Pumps', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Conservative sophisticated proportions. Small silver stud earrings and structured handbag.',
  },
  {
    id: 'F02',
    code: 'F02',
    gender: 'female',
    occasionKey: 'business_meeting',
    occasionTitle: 'Executive Business Meeting',
    title: 'Charcoal Corporate Power Suit',
    description: 'Charcoal tailored blazer with light blue blouse, matching trousers, and black leather pumps.',
    score: 93,
    imageUrl: '/vto/looks/female/F02_business_meeting.png',
    colorPalette: ['Charcoal', 'Light Blue', 'Black', 'Silver'],
    vibeMatch: 'Authoritative & Intelligent',
    items: [
      { name: 'Charcoal Tailored Suit Blazer', category: 'top', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Light Blue Premium Blouse', category: 'shirt', image: '/vto/clothing/professional/06_light_blue_dress_shirt.jpg' },
      { name: 'Charcoal Tailored Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Black Leather Heels', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Precise corporate tailoring with subtle feminine sophistication.',
  },
  {
    id: 'F03',
    code: 'F03',
    gender: 'female',
    occasionKey: 'executive_conference',
    occasionTitle: 'Leadership Summit',
    title: 'Keynote Leadership Suit & Pearl Accents',
    description: 'Deep charcoal tailored suit with silky ivory blouse, black pointed pumps, and pearl earrings.',
    score: 96,
    imageUrl: '/vto/looks/female/F03_executive_conference.png',
    colorPalette: ['Charcoal', 'Ivory', 'Black', 'Pearl'],
    vibeMatch: 'Senior Leadership Presence',
    items: [
      { name: 'Textured Charcoal Conference Suit', category: 'top', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Silky Ivory Top', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Matching Charcoal Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Black Pointed-Toe Pumps', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Elevated executive presence tailored for main-stage keynotes and leadership panels.',
  },
  {
    id: 'F04',
    code: 'F04',
    gender: 'female',
    occasionKey: 'wedding_guest',
    occasionTitle: 'Elegant Wedding Guest',
    title: 'Emerald Wine Tailored Midi Dress',
    description: 'Rich emerald-green or deep wine midi dress with elegant neckline, heels, and structured clutch.',
    score: 92,
    imageUrl: '/vto/looks/female/F04_wedding_guest.png',
    colorPalette: ['Emerald Green', 'Wine', 'Gold'],
    vibeMatch: 'Graceful & Celebratory',
    items: [
      { name: 'Tailored Emerald Midi Dress', category: 'top', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Gold Delicate Chain Necklace', category: 'accessory', image: '/vto/accessories/watches/classic_silver.jpg' },
      { name: 'Matching Fitted Waistband', category: 'bottom', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Elegant Strappy Heels', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Celebratory elegance designed for weddings without competing with the bridal party.',
  },
  {
    id: 'F05',
    code: 'F05',
    gender: 'female',
    occasionKey: 'church_religious',
    occasionTitle: 'Sunday Service / Worship',
    title: 'Modest Navy Midi Dress & Cardigan',
    description: 'Modest knee-length navy dress with tailored cardigan jacket, low closed heels, and structured bag.',
    score: 90,
    imageUrl: '/vto/looks/female/F05_church_religious.png',
    colorPalette: ['Navy', 'Cream', 'Beige'],
    vibeMatch: 'Graceful & Modest',
    items: [
      { name: 'Structured Navy Modest Midi Dress', category: 'top', image: '/vto/clothing/religious/church_attire.jpg' },
      { name: 'Light Cream Cardigan Layer', category: 'shirt', image: '/vto/clothing/religious/church_attire.jpg' },
      { name: 'Flowing Midi Skirt Line', category: 'bottom', image: '/vto/clothing/religious/church_attire.jpg' },
      { name: 'Closed-Toe Neutral Pumps', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Respectful neckline and hemline proportions for formal Sunday worship services.',
  },
  {
    id: 'F06',
    code: 'F06',
    gender: 'female',
    occasionKey: 'funeral',
    occasionTitle: 'Funeral / Memorial Service',
    title: 'Solemn Black Tailored Memorial Dress',
    description: 'Black modest midi dress with clean blazer overlay, black closed-toe pumps, and pearl studs.',
    score: 94,
    imageUrl: '/vto/looks/female/F06_funeral.png',
    colorPalette: ['Black', 'Silver', 'Pearl'],
    vibeMatch: 'Dignified & Solemn',
    items: [
      { name: 'Black Modest Blazer Overlay', category: 'top', image: '/vto/clothing/funeral/funeral_outfit.jpg' },
      { name: 'Black Tailored Silk Blouse', category: 'shirt', image: '/vto/clothing/funeral/funeral_outfit.jpg' },
      { name: 'Black Midi Skirt Line', category: 'bottom', image: '/vto/clothing/funeral/funeral_outfit.jpg' },
      { name: 'Black Closed-Toe Pumps', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Conservative, minimal makeup, zero decorative accents to maintain deep solemnity.',
  },
  {
    id: 'F07',
    code: 'F07',
    gender: 'female',
    occasionKey: 'date_night',
    occasionTitle: 'Sophisticated Date Night',
    title: 'Burgundy Fitted Evening Midi Look',
    description: 'Deep burgundy fitted midi dress with sophisticated silhouette, heeled sandals, and small clutch.',
    score: 91,
    imageUrl: '/vto/looks/female/F07_date_night.png',
    colorPalette: ['Burgundy', 'Black', 'Metallic Gold'],
    vibeMatch: 'Sophisticated & Charismatic',
    items: [
      { name: 'Burgundy Fitted Evening Midi Dress', category: 'top', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Delicate Gold Pendant', category: 'accessory', image: '/vto/accessories/watches/classic_silver.jpg' },
      { name: 'Structured Midi Silhouette', category: 'bottom', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Black Heeled Sandals', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Refined evening cut that feels elegant and alluring without excessive formality.',
  },
  {
    id: 'F08',
    code: 'F08',
    gender: 'female',
    occasionKey: 'gala_party',
    occasionTitle: 'Black-Tie Gala Evening',
    title: 'Midnight Floor-Length Evening Gown',
    description: 'Floor-length black/jewel gown with refined fabric texture, classic heels, and formal clutch.',
    score: 97,
    imageUrl: '/vto/looks/female/F08_gala_party.png',
    colorPalette: ['Black', 'Deep Jewel', 'Gold'],
    vibeMatch: 'Luxurious & Timeless',
    items: [
      { name: 'Floor-Length Jewel Tone Evening Gown', category: 'top', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Refined Silk Neckline Accent', category: 'accessory', image: '/vto/accessories/watches/classic_silver.jpg' },
      { name: 'Flowing Gown Train', category: 'bottom', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Classic High-Quality Heels', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Timeless gala sophistication with subtle metallic evening accents.',
  },
  {
    id: 'F09',
    code: 'F09',
    gender: 'female',
    occasionKey: 'traditional_ceremony',
    occasionTitle: 'Nigerian Traditional Ceremony',
    title: 'Modern Emerald Aso-Ebi & Gele Ensemble',
    description: 'Rich emerald-green Nigerian traditional gown with refined embroidery and coordinated Gele headwrap.',
    score: 96,
    imageUrl: '/vto/looks/female/F09_traditional_ceremony.png',
    colorPalette: ['Emerald Green', 'Gold', 'Royal Blue'],
    vibeMatch: 'Cultural Elegance & Prestige',
    items: [
      { name: 'Embroidered Emerald Aso-Ebi Dress', category: 'top', image: '/vto/clothing/ceremonial/traditional_women.jpg' },
      { name: 'Coordinated Silk Gele Headwrap', category: 'accessory', image: '/vto/clothing/ceremonial/traditional_women.jpg' },
      { name: 'Fitted Floor-Length Traditional Skirt', category: 'bottom', image: '/vto/clothing/ceremonial/traditional_women.jpg' },
      { name: 'Gold Traditional Heels', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Authentic modern African elegance with refined embroidery and structured Gele.',
  },
  {
    id: 'F10',
    code: 'F10',
    gender: 'female',
    occasionKey: 'travel',
    occasionTitle: 'Premium Business Travel',
    title: 'First-Class Neutral Travel Ensemble',
    description: 'Neutral tailored travel trousers with cream top, lightweight overshirt, and minimalist white sneakers.',
    score: 89,
    imageUrl: '/vto/looks/female/F10_travel.png',
    colorPalette: ['Cream', 'Beige', 'Olive', 'White'],
    vibeMatch: 'Practical & Polished',
    items: [
      { name: 'Lightweight Beige Overshirt', category: 'top', image: '/vto/clothing/casual/03_beige_hoodie.jpg' },
      { name: 'Cream Fitted Crew Top', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Neutral Tailored Travel Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Minimalist White Leather Sneakers', category: 'shoes', image: '/vto/footwear/casual/sneakers_white.jpg' },
    ],
    stylingNotes: 'Layered intelligently for airport temperature variations while maintaining executive style.',
  },
  {
    id: 'F11',
    code: 'F11',
    gender: 'female',
    occasionKey: 'casual_weekend',
    occasionTitle: 'Premium Casual Weekend',
    title: 'Effortless Beige & Denim Weekend Look',
    description: 'Neutral fitted top with beige overshirt, straight dark denim, and minimalist white sneakers.',
    score: 88,
    imageUrl: '/vto/looks/female/F11_casual_weekend.png',
    colorPalette: ['Cream', 'Beige', 'Olive', 'Dark Denim'],
    vibeMatch: 'Effortless & Stylish',
    items: [
      { name: 'Beige Casual Overshirt', category: 'top', image: '/vto/clothing/casual/03_beige_hoodie.jpg' },
      { name: 'Neutral Crew Top', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Dark Straight-Leg Denim', category: 'bottom', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'White Leather Sneakers', category: 'shoes', image: '/vto/footwear/casual/sneakers_white.jpg' },
    ],
    stylingNotes: 'Relaxed modern silhouette for urban weekend cafés and gallery visits.',
  },
  {
    id: 'F12',
    code: 'F12',
    gender: 'female',
    occasionKey: 'fine_dining',
    occasionTitle: 'Fine Dining Evening',
    title: 'Midnight Emerald Fine Dining Dress',
    description: 'Deep navy or dark emerald midi dress with refined heels, clutch, and delicate jewelry.',
    score: 93,
    imageUrl: '/vto/looks/female/F12_fine_dining.png',
    colorPalette: ['Black', 'Navy', 'Emerald', 'Gold'],
    vibeMatch: 'Sophisticated & Graceful',
    items: [
      { name: 'Tailored Dark Emerald Midi Dress', category: 'top', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Delicate Gold Bracelet', category: 'accessory', image: '/vto/accessories/watches/classic_silver.jpg' },
      { name: 'Fitted Midi Skirt Cut', category: 'bottom', image: '/vto/clothing/formal/cocktail_dress.jpg' },
      { name: 'Refined Pointed Heels', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Feminine dinner elegance suited for upscale fine-dining settings.',
  },
  {
    id: 'F13',
    code: 'F13',
    gender: 'female',
    occasionKey: 'creative_tech',
    occasionTitle: 'Creative / Tech Event',
    title: 'Charcoal Oversized Blazer & Wide-Leg Pants',
    description: 'Charcoal softly structured blazer with black top, wide-leg trousers, and sleek loafers.',
    score: 91,
    imageUrl: '/vto/looks/female/F13_creative_tech.png',
    colorPalette: ['Charcoal', 'Black', 'Off-White'],
    vibeMatch: 'Innovative & Creative',
    items: [
      { name: 'Charcoal Softly Structured Blazer', category: 'top', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Black Fitted Crew Top', category: 'shirt', image: '/vto/clothing/casual/01_black_tshirt.jpg' },
      { name: 'Wide-Leg Tailored Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Sleek Leather Loafers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Modern fashion-forward tech silhouette balancing creative flair with professionalism.',
  },
  {
    id: 'F14',
    code: 'F14',
    gender: 'female',
    occasionKey: 'graduation',
    occasionTitle: 'University Graduation',
    title: 'Academic Commencement Navy Trouser Suit',
    description: 'Navy tailored suit or midi dress with ivory blouse, closed-toe pumps, and simple watch.',
    score: 94,
    imageUrl: '/vto/looks/female/F14_graduation.png',
    colorPalette: ['Navy', 'Ivory', 'White', 'Silver'],
    vibeMatch: 'Accomplished & Professional',
    items: [
      { name: 'Navy Graduation Suit Blazer', category: 'top', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Crisp Ivory Silk Blouse', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Matching Navy Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Closed-Toe Leather Pumps', category: 'shoes', image: '/vto/footwear/womens/heels_black.jpg' },
    ],
    stylingNotes: 'Clean, youthful tailoring created to look distinguished alongside academic gowns.',
  },
  {
    id: 'F15',
    code: 'F15',
    gender: 'female',
    occasionKey: 'networking',
    occasionTitle: 'Professional Networking',
    title: 'Muted Navy Blazer & Beige Trousers',
    description: 'Muted navy blazer with silky ivory blouse, beige trousers, and elegant loafers.',
    score: 92,
    imageUrl: '/vto/looks/female/F15_networking.png',
    colorPalette: ['Navy', 'Light Blue', 'Ivory', 'Beige'],
    vibeMatch: 'Socially Confident & Open',
    items: [
      { name: 'Muted Navy Networking Blazer', category: 'top', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Silky Ivory V-Neck Blouse', category: 'shirt', image: '/vto/clothing/professional/05_white_dress_shirt.jpg' },
      { name: 'Tailored Beige Trousers', category: 'bottom', image: '/vto/clothing/professional/04_beige_power_suit.jpg' },
      { name: 'Elegant Leather Loafers', category: 'shoes', image: '/vto/footwear/business/loafers_black.jpg' },
    ],
    stylingNotes: 'Sophisticated relaxed tailoring encouraging open executive dialogue and networking.',
  },
];

/**
 * Normalizes user occasion inputs to the 15 standard occasion keys
 */
export function normalizeOccasionKey(rawOccasion: string): string {
  const lower = (rawOccasion || '').toLowerCase();
  if (lower.includes('interview')) return 'job_interview';
  if (lower.includes('meeting') || lower.includes('pitch') || lower.includes('corporate')) return 'business_meeting';
  if (lower.includes('conference') || lower.includes('keynote') || lower.includes('summit')) return 'executive_conference';
  if (lower.includes('wedding')) return 'wedding_guest';
  if (lower.includes('church') || lower.includes('worship') || lower.includes('religious')) return 'church_religious';
  if (lower.includes('funeral') || lower.includes('memorial')) return 'funeral';
  if (lower.includes('date')) return 'date_night';
  if (lower.includes('gala') || lower.includes('party') || lower.includes('black-tie')) return 'gala_party';
  if (lower.includes('traditional') || lower.includes('agbada') || lower.includes('aso-ebi') || lower.includes('cultural')) return 'traditional_ceremony';
  if (lower.includes('travel') || lower.includes('airport')) return 'travel';
  if (lower.includes('weekend') || lower.includes('casual')) return 'casual_weekend';
  if (lower.includes('dining') || lower.includes('restaurant')) return 'fine_dining';
  if (lower.includes('tech') || lower.includes('creative') || lower.includes('startup')) return 'creative_tech';
  if (lower.includes('graduation') || lower.includes('commencement')) return 'graduation';
  if (lower.includes('network') || lower.includes('mixer')) return 'networking';
  
  return 'job_interview'; // Default fallback
}

/**
 * Returns 3 curated looks (1 Primary exact match + 2 contextual options)
 */
export function getRecommendedLooksForSession(params: {
  gender?: 'male' | 'female';
  occasion?: string;
  targetVibe?: string;
}): { primary: VTOLookDefinition; alternatives: VTOLookDefinition[] } {
  const gender = params.gender === 'female' ? 'female' : 'male';
  const occasionKey = normalizeOccasionKey(params.occasion || '');

  const genderCollection = VTO_30_LOOKS_CATALOG.filter((l) => l.gender === gender);

  // Find exact primary match
  let primary = genderCollection.find((l) => l.occasionKey === occasionKey);
  if (!primary) {
    primary = genderCollection[0]; // M01 or F01 fallback
  }

  // Pick 2 contextually relevant alternatives from adjacent occasion keys
  const alternatives = genderCollection.filter((l) => l.id !== primary!.id).slice(0, 2);

  return { primary, alternatives };
}
