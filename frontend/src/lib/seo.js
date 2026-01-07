// SEO configuration and utilities
export const siteConfig = {
  name: "MyShop - Premium Online Shopping",
  description: "Discover premium products at unbeatable prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout.",
  url: "https://myshop.com",
  ogImage: "/og-image.jpg",
  keywords: "online shopping, ecommerce, electronics, fashion, home goods, premium products, fast shipping",
  author: "MyShop Team"
};

export const generateMetadata = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website"
}) => {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const allKeywords = [...keywords, ...siteConfig.keywords.split(", ")].join(", ");

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@myshop',
    },
    alternates: {
      canonical: metaUrl,
    },
  };
};

export const generateProductStructuredData = (product) => ({
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name,
  "image": product.images,
  "description": product.description,
  "sku": product._id,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "MyShop"
  },
  "offers": {
    "@type": "Offer",
    "url": `${siteConfig.url}/product/${product._id}`,
    "priceCurrency": "USD",
    "price": product.price,
    "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "MyShop"
    }
  },
  "aggregateRating": product.rating ? {
    "@type": "AggregateRating",
    "ratingValue": product.rating,
    "reviewCount": product.numReviews || 1
  } : undefined
});

export const generateOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "url": siteConfig.url,
  "logo": `${siteConfig.url}/logo.png`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://facebook.com/myshop",
    "https://twitter.com/myshop",
    "https://instagram.com/myshop"
  ]
});