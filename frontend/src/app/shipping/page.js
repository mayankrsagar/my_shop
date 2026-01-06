export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      <div className="space-y-4 text-gray-700">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Shipping Methods</h2>
        <p>We offer standard shipping (5-7 business days) and express shipping (2-3 business days) across India.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Shipping Charges</h2>
        <ul className="list-disc ml-6">
          <li>Free shipping on orders above ₹999</li>
          <li>Standard shipping: ₹99</li>
          <li>Express shipping: ₹199</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-gray-900">Processing Time</h2>
        <p>Orders are processed within 1-2 business days. You will receive a tracking number once your order ships.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Delivery Areas</h2>
        <p>We currently deliver across India. International shipping is not available at this time.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p>For shipping inquiries, contact us at shipping@myshop.com</p>
      </div>
    </div>
  );
}