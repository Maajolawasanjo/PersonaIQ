import localFont from 'next/font/local';
import { GeistMono } from 'geist/font/mono';
import { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';

const geistSans = localFont({
  src: [
    {
      path: './fonts/Geist-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: './fonts/Geist-Italic-VariableFont_wght.ttf',
      style: 'italic',
    }
  ],
  variable: '--font-geist-sans',
});

const SEO_KEYWORDS = [
  // Founder & Personal Brand
  "MAAJO", "MA'AJO", "maajo", "ma'ajo", "ma'ajo lawasanjo", "ma'ajolawasanjo", "maajo lawasanjo", "maajolawasanjo", 
  "lawasanjo", "LAWASANJO", "Piper", "ma'ajo piper", "ma'ajo francis", "ma'ajo nathan", "nathan", "francis", 
  "francis nathan", "natan francis ma'ajo", "ma'ajo francis nathan", "m'jo lawasanjo nathan", "ma'ajo f. nathan", 
  "Ma'ajo Nathan", "Nathan Ma'ajo", "Ma'ajo Lawasanjo Nathan", "Maajo Digital", "Ma'ajo AI developer", 
  "Nathan AI engineer", "Nigerian AI developer", "Nigerian AI builder", "NUTM AI student", "PersonaIQ founder", 
  "Founder of PersonaIQ", "AI fashion startup Nigeria", "Nigerian startup founder", "AI product builder Nigeria",
  
  // Brand Keywords
  "PersonaIQ", "PersonaIQ AI", "PersonaIQ app", "PersonaIQ wardrobe", "PersonaIQ stylist", "PersonaIQ fashion", 
  "PersonaIQ appearance", "PersonaIQ presence", "PersonaIQ executive presence", "PersonaIQ style assistant", 
  "PersonaIQ AI stylist", "PersonaIQ outfit planner",

  // Personal Style & AI Stylist
  "AI outfit planner", "AI outfit generator", "Outfit planner", "Outfit recommendation app", "Outfit recommendation AI", 
  "Outfit matcher", "Outfit matcher AI", "Outfit selector", "Outfit advisor", "Outfit assistant", "Outfit analyzer", 
  "Outfit checker", "Outfit suggestions", "Daily outfit planner", "Wardrobe planner", "Smart wardrobe", "Capsule wardrobe app", 
  "Virtual stylist", "AI stylist", "Digital stylist", "Fashion AI", "AI fashion assistant", "Clothing recommender", 
  "Clothing matcher", "Smart fashion app", "Personal stylist AI", "Style assistant", "Wardrobe assistant", 
  "Closet organizer", "Outfit organizer", "Fashion planner",

  // Event Dressing & Intent Queries
  "What should I wear", "What should I wear today", "What should I wear tomorrow", "What should I wear to work", 
  "What should I wear to church", "What should I wear to a wedding", "What should I wear to an interview", 
  "What should I wear on a date", "What should I wear for graduation", "What should I wear to a party", 
  "What should I wear to a funeral", "What should I wear to an office meeting", "What should I wear to a conference", 
  "Best outfit for interview", "Best outfit for first date", "Best outfit for wedding guest", "Business casual outfit", 
  "Smart casual outfit", "AI that tells me what to wear", "AI that rates my outfit", "AI that improves my appearance", 
  "AI that helps me dress better", "App that tells me what clothes match", "App that analyzes outfits", 
  "App that helps me dress professionally", "App that creates outfits from my wardrobe", "App that helps me prepare for interviews", 
  "AI wardrobe manager", "AI image consultant", "AI style coach", "AI fashion coach", "AI personal appearance coach",

  // Appearance & Executive Presence
  "Improve appearance", "Improve first impression", "Look more attractive", "Look more professional", 
  "Look more confident", "Improve executive presence", "Executive presence", "Professional appearance", 
  "Personal image consultant", "Personal branding", "Image consulting AI", "Improve personal style", 
  "Better fashion choices", "Better clothing decisions",

  // Grooming & Skin Intelligence
  "Skin analysis AI", "AI skin analyzer", "Face analysis AI", "Grooming assistant", "Grooming recommendations", 
  "Men's grooming", "Women's grooming", "Skin care recommendation", "Facial analysis", "AI face scanner", 
  "Beauty AI", "Personal grooming app",

  // Virtual Try-On
  "Virtual try on", "AI virtual try on", "Clothing virtual try on", "Dress virtually", "Try clothes online", 
  "Outfit preview", "AI outfit preview", "Digital fitting room", "Fashion try on",

  // Career & Student
  "Dress for interview", "Interview outfit", "Professional wardrobe", "Executive style", "Office outfit", 
  "Corporate fashion", "Business attire", "CEO style", "Leadership presence", "Professional image", 
  "Career wardrobe", "Workplace fashion", "University outfit", "College fashion", "Student wardrobe", 
  "Campus fashion", "School outfit ideas", "Presentation outfit", "Internship outfit", "NYSC outfit ideas", 
  "Convocation outfit", "Graduation outfit planner",

  // Color Matching & Gender Specific
  "Color matching app", "Outfit color matcher", "Clothes color matching", "What colors go together", 
  "Best color combinations", "Outfit color palette", "Color harmony clothing", "Fashion color generator", 
  "Clothing color analyzer", "Men's outfit ideas", "Men's style AI", "Men's wardrobe", "Men's fashion assistant", 
  "Formal outfit men", "Casual outfit men", "Smart casual men", "Women's outfit ideas", "Women's style AI", 
  "Women's wardrobe", "Women's fashion planner", "Women's stylist",

  // Nigerian & African Fashion SEO
  "Nigerian fashion", "Nigerian outfit ideas", "Ankara outfit", "Senator wear", "Agbada styles", "Native wear", 
  "Asoebi ideas", "Lace outfit", "Corporate Nigeria fashion", "Nigerian office fashion", "Lagos fashion", 
  "Abuja fashion", "African fashion AI", "African style assistant", "African clothing planner",

  // Competitor Alternatives
  "Best fashion app", "Best outfit app", "Best wardrobe app", "Best AI stylist", "Stylebook alternative", 
  "Whering alternative", "Acloset alternative", "Combyne alternative", "Smart Closet alternative"
];

export const metadata: Metadata = {
  title: {
    default: "PersonaIQ — Executive Presence Engine & AI Outfit Stylist",
    template: "%s | PersonaIQ — AI Wardrobe & Executive Presence"
  },
  description: "PersonaIQ is an AI-powered executive presence engine, virtual stylist, and smart wardrobe planner. Founded by Ma'ajo Lawasanjo Nathan, PersonaIQ provides AI skin analysis, outfit recommendations, virtual try-on, and image diagnostics to help you dress for interviews, keynotes, and high-stakes events.",
  keywords: SEO_KEYWORDS,
  authors: [
    { name: "Ma'ajo Nathan", url: "https://personaiq.com" },
    { name: "Nathan Francis Ma'ajo" },
    { name: "Ma'ajo Lawasanjo Nathan" },
    { name: "Francis Nathan" }
  ],
  creator: "Ma'ajo Lawasanjo Nathan (Maajo Digital)",
  publisher: "PersonaIQ Technologies",
  category: "Fashion, Executive Presence & AI Technology",
  metadataBase: new URL("https://personaiq.com"),
  alternates: {
    canonical: "https://personaiq.com",
  },
  openGraph: {
    title: "PersonaIQ — Executive Presence Engine & AI Outfit Stylist",
    description: "AI-powered outfit planning, virtual try-on, skin analysis, and executive presence diagnostics for high-stakes career and event confidence.",
    url: "https://personaiq.com",
    siteName: "PersonaIQ",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 800,
        alt: "PersonaIQ Logo — AI Executive Presence Engine",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PersonaIQ — AI Executive Presence & Outfit Stylist",
    description: "AI-driven outfit recommendation engine, virtual try-on, skin diagnostics, and wardrobe advisor by Ma'ajo Lawasanjo Nathan.",
    images: ["/icon.png"],
    creator: "@personaiq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://personaiq.com/#webapp",
        "name": "PersonaIQ",
        "url": "https://personaiq.com",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "description": "AI-powered executive presence engine, virtual stylist, outfit matcher, skin analysis, and digital wardrobe advisor.",
        "creator": {
          "@type": "Person",
          "name": "Ma'ajo Lawasanjo Nathan",
          "alternateName": ["Ma'ajo Nathan", "Francis Nathan", "Nathan Ma'ajo", "Ma'ajo Piper"],
          "jobTitle": "Founder & AI Developer",
          "sameAs": [
            "https://twitter.com/personaiq",
            "https://github.com/Maajo"
          ]
        }
      },
      {
        "@type": "Organization",
        "@id": "https://personaiq.com/#organization",
        "name": "PersonaIQ Technologies",
        "url": "https://personaiq.com",
        "logo": "https://personaiq.com/icon.png",
        "founder": {
          "@type": "Person",
          "name": "Ma'ajo Lawasanjo Nathan"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "maajolawasanjo@gmail.com",
          "contactType": "customer support"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${GeistMono.variable} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
