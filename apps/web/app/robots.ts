import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/journey/', '/api/'],
      },
    ],
    sitemap: 'https://personaiq.com/sitemap.xml',
  };
}
