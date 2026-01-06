export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-3">
              <p><strong>Email:</strong> support@myshop.com</p>
              <p><strong>Phone:</strong> +91-9876543210</p>
              <p><strong>Address:</strong> 123 Business Street, Mumbai, Maharashtra 400001</p>
              <p><strong>Business Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
            <p className="text-gray-700">
              For order inquiries, product questions, or technical support, 
              please reach out to us using the contact information provided. 
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}