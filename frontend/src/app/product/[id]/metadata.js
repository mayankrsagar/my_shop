import { generateMetadata as genMeta, generateProductStructuredData } from '../../../lib/seo';

export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${params.id}`);
    const data = await response.json();
    
    if (data.success && data.product) {
      const product = data.product;
      const productKeywords = [
        product.name,
        product.category,
        product.brand,
        ...(product.tags || []),
        "buy online",
        "best price",
        "fast shipping"
      ].filter(Boolean);
      
      return genMeta({
        title: `${product.name} - ${product.brand || 'Premium'} ${product.category}`,
        description: `${product.description.substring(0, 120)}... Buy ${product.name} at ₹${product.price}. ${product.tags ? product.tags.slice(0,3).join(', ') : 'Premium quality'}. Fast shipping & secure checkout.`,
        keywords: productKeywords,
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