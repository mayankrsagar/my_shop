import { generateMetadata as genMeta } from '../../lib/seo';

export const metadata = genMeta({
  title: "Shopping Cart - Review Your Items",
  description: "Review items in your shopping cart. Secure checkout, multiple payment options, and fast shipping available. Complete your purchase at BuyBloom.",
  keywords: ["shopping cart", "checkout", "secure payment", "review items", "complete purchase"],
  url: "/cart"
});

export { default } from './page';