"use client";
import Link from 'next/link';
import {
  FaCode,
  FaDatabase,
  FaDev,
  FaDownload,
  FaGithub,
  FaHeart,
  FaLinkedin,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaTwitter,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function DeveloperPage() {
  const techStack = [
    { name: "Next.js 14", category: "Frontend" },
    { name: "React 18", category: "Frontend" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Node.js", category: "Backend" },
    { name: "Express.js", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "Mongoose", category: "ODM" },
    { name: "JWT", category: "Authentication" },
    { name: "Razorpay", category: "Payment" },
    { name: "Cloudinary", category: "File Upload" },
  ];

  const features = [
    {
      icon: FaShoppingCart,
      title: "E-commerce Platform",
      desc: "Full-featured online shopping with cart, checkout, and order management",
    },
    {
      icon: FaHeart,
      title: "Favorites System",
      desc: "Users can save favorite products with persistent storage",
    },
    {
      icon: FaStar,
      title: "Rating & Reviews",
      desc: "Product rating system with user reviews and feedback",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Authentication",
      desc: "JWT-based auth with role-based access control",
    },
    {
      icon: FaDatabase,
      title: "Anonymous Donations",
      desc: "Donation system supporting both registered and guest users",
    },
    {
      icon: FaCode,
      title: "Modern UI/UX",
      desc: "Responsive design with glass morphism and smooth animations",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <HiSparkles className="text-4xl text-yellow-400 float" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Mayank Sagar
            </h1>
            <HiSparkles
              className="text-4xl text-yellow-400 float"
              style={{ animationDelay: "1s" }}
            />
          </div>
          <p className="text-xl text-white/90 mb-6">
            Full Stack Developer | MERN Stack Specialist
          </p>
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://github.com/mayankrsagar"
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaGithub className="text-2xl text-white" />
            </a>
            <a
              href="https://www.linkedin.com/in/mayank-sagar-mern/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaLinkedin className="text-2xl text-blue-400" />
            </a>
            <a
              href="https://dev.to/mayankrsagar"
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaDev className="text-2xl text-white" />
            </a>
            <a
              href="https://x.com/mayankrsagar"
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaTwitter className="text-2xl text-blue-400" />
            </a>
          </div>

          {/* Resume Download */}
          <a
            href="https://docs.google.com/document/d/1nQHDhdhh4ZFTyWJietoAg5ZZdV8p170_/edit?usp=drive_link&ouid=113535936798106572507&rtpof=true&sd=true"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <FaDownload />
            <span>View Resume</span>
          </a>
        </div>

        {/* Project Overview */}
        <div className="glass rounded-2xl p-8 mb-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🚀 ShopVibe E-commerce Platform
          </h2>
          <p className="text-white/80 text-lg leading-relaxed text-center mb-8">
            A modern, full-stack e-commerce platform built with the MERN stack,
            featuring advanced functionality like anonymous donations, favorites
            system, product reviews, and secure payment integration.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/10"
              >
                <feature.icon className="text-3xl text-purple-400 mb-4" />
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-6">
              Technology Stack
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 
                               border border-purple-400/30 rounded-full text-white text-sm font-medium"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Backend Features */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              🔧 Backend Architecture
            </h3>
            <ul className="space-y-3 text-white/80">
              <li>• RESTful API with Express.js and Node.js</li>
              <li>• MongoDB with Mongoose ODM for data modeling</li>
              <li>• JWT authentication with role-based access</li>
              <li>• File upload with Cloudinary integration</li>
              <li>• Payment processing with Razorpay</li>
              <li>• Input validation and security measures</li>
              <li>• Anonymous donation system</li>
            </ul>
          </div>

          {/* Frontend Features */}
          <div className="glass rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              🎨 Frontend Excellence
            </h3>
            <ul className="space-y-3 text-white/80">
              <li>• Next.js 14 with App Router</li>
              <li>• Responsive design with Tailwind CSS</li>
              <li>• Custom modal system replacing alerts</li>
              <li>• Glass morphism UI with smooth animations</li>
              <li>• Context API for state management</li>
              <li>• Dynamic data fetching and real-time updates</li>
              <li>• Optimized performance with React 18</li>
            </ul>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="glass rounded-2xl p-8 mb-12 border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            🏆 Key Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="text-white font-semibold">
                    Complete E-commerce Solution
                  </h4>
                  <p className="text-white/70 text-sm">
                    Built from scratch with modern technologies
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <h4 className="text-white font-semibold">
                    Security Implementation
                  </h4>
                  <p className="text-white/70 text-sm">
                    Input validation, XSS protection, secure authentication
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💳</span>
                <div>
                  <h4 className="text-white font-semibold">
                    Payment Integration
                  </h4>
                  <p className="text-white/70 text-sm">
                    Razorpay integration with donation system
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-white font-semibold">
                    Responsive Design
                  </h4>
                  <p className="text-white/70 text-sm">
                    Mobile-first approach with modern UI/UX
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="text-white font-semibold">
                    Performance Optimized
                  </h4>
                  <p className="text-white/70 text-sm">
                    Fast loading, efficient state management
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="text-white font-semibold">
                    User Experience Focus
                  </h4>
                  <p className="text-white/70 text-sm">
                    Intuitive interface with smooth interactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center glass rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">Let's Connect!</h3>
          <p className="text-white/80 mb-6">
            Interested in discussing opportunities or learning more about this
            project?
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="mailto:mayankrsagar@gmail.com"
              className="btn-primary inline-flex items-center justify-center"
            >
              📧 Email Me
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              🏠 Explore the Platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
