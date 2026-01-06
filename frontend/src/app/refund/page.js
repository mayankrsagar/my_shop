export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <div className="space-y-4 text-gray-700">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Refund Eligibility</h2>
        <p>We offer refunds within 30 days of purchase for items that are unused, in original packaging, and in the same condition as received.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Refund Process</h2>
        <p>To initiate a refund, please contact our customer service team with your order number and reason for return.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Processing Time</h2>
        <p>Refunds will be processed within 5-7 business days after we receive and inspect the returned item.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Non-Refundable Items</h2>
        <p>Certain items such as personalized products, perishable goods, and digital downloads are not eligible for refunds.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
        <p>For refund requests or questions, please contact us at refunds@myshop.com or call +91-9876543210</p>
      </div>
    </div>
  );
}