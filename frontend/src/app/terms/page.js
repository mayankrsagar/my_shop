export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="space-y-4 text-gray-700">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on My Shop's website for personal, non-commercial transitory viewing only.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Disclaimer</h2>
        <p>The materials on My Shop's website are provided on an 'as is' basis. My Shop makes no warranties, expressed or implied.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Limitations</h2>
        <p>In no event shall My Shop or its suppliers be liable for any damages arising out of the use or inability to use the materials on My Shop's website.</p>
        
        <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
        <p>If you have any questions about these Terms of Service, please contact us at terms@myshop.com</p>
      </div>
    </div>
  );
}