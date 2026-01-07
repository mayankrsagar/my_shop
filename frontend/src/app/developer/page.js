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
    "Next.js 14",
    "React 18",
    "Tailwind CSS",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "JWT Auth",
    "Razorpay",
    "Cloudinary",
    "ACID Transactions",
  ];

  const features = [
    {
      icon: FaShoppingCart,
      title: "E-commerce Platform",
      desc: "Cart, checkout, orders, sellers, admin dashboard",
    },
    {
      icon: FaHeart,
      title: "Favorites System",
      desc: "Persistent wishlist with user accounts",
    },
    {
      icon: FaStar,
      title: "Ratings & Reviews",
      desc: "Verified ratings with aggregation",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Auth",
      desc: "JWT, role-based access, protected routes",
    },
    {
      icon: FaDatabase,
      title: "SEO Optimized",
      desc: "Metadata, sitemap, structured data",
    },
    {
      icon: FaCode,
      title: "Modern UI/UX",
      desc: "Glass morphism, dark/light themes",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        {/* HEADER */}
        <section className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <HiSparkles className="text-yellow-400 text-3xl float" />
            <h1 className="text-4xl lg:text-5xl font-extrabold gradient-text">
              Mayank Sagar
            </h1>
            <HiSparkles className="text-yellow-400 text-3xl float" />
          </div>

          <p className="text-lg md:text-xl text-[var(--text-secondary)]">
            Full-Stack Developer • MERN Specialist • System Builder
          </p>

          {/* Socials */}
          <div className="flex justify-center gap-5">
            {[
              { href: "https://github.com/mayankrsagar", icon: FaGithub },
              {
                href: "https://www.linkedin.com/in/mayank-sagar-mern/",
                icon: FaLinkedin,
              },
              { href: "https://dev.to/mayankrsagar", icon: FaDev },
              { href: "https://x.com/mayankrsagar", icon: FaTwitter },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-3 rounded-full hover:scale-110 transition"
              >
                <s.icon className="text-xl text-[var(--text-primary)]" />
              </a>
            ))}
          </div>

          <a
            href="https://docs.google.com/document/d/1nQHDhdhh4ZFTyWJietoAg5ZZdV8p170_/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FaDownload /> View Resume
          </a>
        </section>

        {/* PROJECT OVERVIEW */}
        <section className="glass rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            BuyBloom — E-commerce Platform
          </h2>
          <p className="text-center max-w-3xl mx-auto text-[var(--text-secondary)] leading-relaxed">
            BuyBloom is a production-ready MERN e-commerce platform featuring
            secure payments, ACID-safe transactions, role-based access, SEO
            optimization, and a polished B2C UI experience.
          </p>
        </section>

        {/* FEATURES */}
        <section>
          <h3 className="text-2xl font-bold text-center mb-10">
            Core Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="glass rounded-xl p-6 hover:-translate-y-1 transition"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <f.icon className="text-white text-xl" />
                </div>
                <h4 className="font-semibold mb-2">{f.title}</h4>
                <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section className="text-center">
          <h3 className="text-2xl font-bold mb-6">Technology Stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full text-sm font-medium
                bg-[var(--glass-bg)] border border-[var(--border-color)]
                text-[var(--text-primary)] hover:scale-105 transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Backend Architecture",
              items: [
                "RESTful APIs with Express",
                "MongoDB + Mongoose transactions",
                "JWT & role-based access",
                "Razorpay payment gateway",
                "Cloudinary file uploads",
              ],
            },
            {
              title: "Frontend Excellence",
              items: [
                "Next.js App Router",
                "SEO metadata & sitemap",
                "Dark / Light theme system",
                "Glass morphism UI",
                "Optimistic updates",
              ],
            },
          ].map((box, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <h4 className="text-xl font-bold mb-4">{box.title}</h4>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {box.items.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="glass rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Let’s Connect</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Open to full-time roles, freelance projects, and technical
            discussions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="mailto:mayankrsagar@gmail.com" className="btn-primary">
              Email Me
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg border border-[var(--border-color)]
              hover:bg-[var(--glass-bg)] transition"
            >
              Explore Platform
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
