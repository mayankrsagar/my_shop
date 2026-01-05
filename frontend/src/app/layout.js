import "./globals.css";

import Navbar from "../components/Navbar"; // We will create this next
import Providers from "./Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          <main className="min-h-screen container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
