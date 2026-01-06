export default function CancellationPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>
      <div className="space-y-4 text-gray-700">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Order Cancellation</h2>
        <p>Orders can be cancelled within 24 hours of placement if they haven't been shipped. No cancellation charges apply.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Refund Eligibility</h2>
        <ul className="list-disc ml-6">
          <li>Items must be unused and in original packaging</li>
          <li>Return request within 30 days of delivery</li>
          <li>Defective or damaged items are eligible for immediate refund</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-gray-900">Refund Process</h2>
        <p>Refunds are processed within 5-7 business days to the original payment method after item inspection.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Non-Refundable Items</h2>
        <p>Personalized items, intimate wear, and perishable goods cannot be returned for hygiene reasons.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
        <p>For cancellations and refunds, email us at refunds@myshop.com or call +91-9876543210</p>
      </div>
    </div>
  );
}