import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://personaiq.com';
  const currentDate = new Date().toISOString();

  const publicRoutes = [
    '',
    '/features',
    '/how-it-works',
    '/about',
    '/pricing',
    '/faq',
    '/demo',
    '/contact',
    '/login',
    '/signup',
    '/forgot-password',
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' || route === '/about' ? 1.0 : 0.8,
  }));
}
