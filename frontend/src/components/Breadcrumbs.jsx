"use client";
import Link from 'next/link';
import { FaChevronRight, FaHome } from 'react-icons/fa';

export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.href ? `https://myshop.com${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData)
        }}
      />
      <nav className="flex items-center space-x-2 text-sm text-white/70 mb-6">
        <Link href="/" className="flex items-center hover:text-white transition-colors">
          <FaHome className="mr-1" />
          Home
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <FaChevronRight className="text-xs" />
            {item.href ? (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-white">{item.name}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}