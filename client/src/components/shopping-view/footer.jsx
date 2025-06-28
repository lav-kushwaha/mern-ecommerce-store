import React from 'react';
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';

const ShoppingFooter = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-left">

          {/* Brand Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Lav Store</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover stylish and premium products curated for your lifestyle.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>India</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>lavkushwahaa@gmail.com</span>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="space-y-4 text-sm text-gray-500 md:text-right">
            <div className="flex justify-center md:justify-end gap-4">
              <a
                href="https://www.linkedin.com/in/lavkushwaha/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/lav-kushwaha"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p>
              &copy; {new Date().getFullYear()} <span className="font-medium text-gray-700">Lav Store</span>. <br className="md:hidden" />
              All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default ShoppingFooter;
