import { Facebook, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 w-full">
<div className="max-w-7xl mx-auto flex flex-col items-center px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="text-2xl titleFont font-bold">
              <a href="/" className="text-white">
              TUTOR<span className="text-teal-400">ME</span>
              </a>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
            </p>
            <div className="flex space-x-3">
              <Link
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Our Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  For Instructors
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Our Shop
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Helpful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Faqs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Terms & Condition
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300 text-sm">01-12548632, 01-2245455</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300 text-sm">email@tutorme.com.np</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span className="text-gray-300 text-sm">Siphal, Kathmandu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-center text-gray-400 text-sm">© 2025 TutorMe. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
