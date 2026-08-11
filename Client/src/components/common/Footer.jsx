// import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin } from 'react-icons/fa6';
export default function Footer() {
  const quickLinks = ["Home", "Products", "About", "Contact"];
  const supportLinks = ["Privacy", "Terms", "Returns", "Help Center"];
  const socialIcons = [
    { icon: FaFacebook, label: "Facebook" },
    { icon: FaInstagram, label: "Instagram" },
    { icon: FaXTwitter, label: "Twitter" },
    { icon: FaLinkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              Website Name
            </h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed">
              Your one-stop destination for quality products, unbeatable
              prices, and a shopping experience you'll love.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Social */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              {socialIcons.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-[#2563eb] transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} Website Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
