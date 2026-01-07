import { siteConfig } from '../lib/seo';

export default function sitemap() {
  const baseUrl = siteConfig.url;
  
  // Static pages
  const staticPages = [
    '',
    '/login',
    '/signup',
    '/cart',
    '/contact',
    '/privacy',
    '/terms',
    '/shipping',
    '/refund',
    '/cancellation',
    '/favorites',
    '/profile',
    '/seller',
    '/admin',
    '/donate'
  ];

  const staticUrls = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }));

  return staticUrls;
}

// For dynamic product pages, you would typically fetch from your API
// This is a simplified version - in production, you'd want to fetch actual product IDs
export async function generateProductSitemap() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=1000`);
    const data = await response.json();
    
    if (data.products) {
      return data.products.map(product => ({
        url: `${siteConfig.url}/product/${product._id}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error('Error generating product sitemap:', error);
  }
  
  return [];
}