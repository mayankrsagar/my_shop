import './globals.css';

import { Inter } from 'next/font/google';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import {
  generateMetadata as genMeta,
  generateOrganizationStructuredData,
} from '../lib/seo';
import Providers from './Providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata = genMeta({
  title: "Premium Online Shopping - Best Deals & Fast Shipping | BuyBloom",
  description:
    "Shop premium products at BuyBloom. Electronics, fashion, home goods with secure checkout, fast shipping, and 24/7 customer support.",
  keywords: [
    "online shopping",
    "ecommerce",
    "electronics",
    "fashion",
    "home goods",
    "premium products",
  ],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationStructuredData()),
          }}
        />
      </head>
      <body className={`min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-violet-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-50 ${inter.className}`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-6 py-8 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
