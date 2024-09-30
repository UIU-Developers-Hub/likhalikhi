import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-cusLightBG dark:bg-cusDarkBG text-cusPrimaryColor dark:text-cusSecondaryColor py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* About Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-sm">
              My Blog is a platform to share your thoughts, ideas, and stories.
              Connect with others and explore the world of blogging!
            </p>
          </div>

          {/* Contact Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm">Email: contact@myblog.com</p>
            <p className="text-sm">Phone: +123 456 7890</p>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=100080222101791"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF
                  size={20}
                  className="hover:text-cusSecondaryLightColor"
                />
              </a>

              <a
                href="https://www.instagram.com/asadullah__imran/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram
                  size={20}
                  className="hover:text-cusSecondaryLightColor"
                />
              </a>
              <a
                href="https://www.linkedin.com/in/asadullah-imran/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn
                  size={20}
                  className="hover:text-cusSecondaryLightColor"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-cusSecondaryColor">
          &copy; {new Date().getFullYear()} My Blog. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
