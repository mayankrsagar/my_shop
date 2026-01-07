import { generateMetadata as genMeta, generateProductStructuredData } from '../../../lib/seo';

export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${params.id}`);
    const data = await response.json();
    
    if (data.success && data.product) {
      const product = data.product;
      return genMeta({
        title: `${product.name} - Premium Quality at Best Price`,
        description: `${product.description.substring(0, 150)}... Buy ${product.name} at ₹${product.price}. Fast shipping, secure checkout, and 24/7 customer support.`,
        keywords: [product.name, product.category, "buy online", "best price", "fast shipping", "premium quality"],
        image: product.image,
        url: `/product/${product._id}`,
        type: "product"
      });
    }
  } catch (error) {
    console.error('Error generating product metadata:', error);
  }
  
  return genMeta({
    title: "Product Details",
    description: "View product details, specifications, and customer reviews. Shop with confidence at MyShop.",
    url: `/product/${params.id}`
  });
}

export { default } from './page';