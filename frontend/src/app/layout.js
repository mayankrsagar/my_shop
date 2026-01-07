import './globals.css';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Providers from './Providers';
import { generateMetadata as genMeta, generateOrganizationStructuredData } from '../lib/seo';

export const metadata = genMeta({
  title: "Premium Online Shopping - Best Deals & Fast Shipping",
  description: "Shop premium products at MyShop. Electronics, fashion, home goods with secure checkout, fast shipping, and 24/7 customer support.",
  keywords: ["online shopping", "ecommerce", "electronics", "fashion", "home goods", "premium products"]
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationStructuredData())
          }}
        />
      </head>
      <body className="min-h-screen">
        <Providers>
          <Navbar />
          <main className="container mx-auto px-6 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
