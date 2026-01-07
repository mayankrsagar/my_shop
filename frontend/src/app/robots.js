import { siteConfig } from '../lib/seo';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/reset-password/',
        '/forgot-password/',
        '/_next/',
        '/private/'
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}