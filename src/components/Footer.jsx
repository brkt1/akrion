import React from 'react'

const Footer = () => {
  const socialLinks = [
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'TikTok', url: 'https://tiktok.com' },
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Facebook', url: 'https://facebook.com' },
  ]

  return (
    <footer className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-[rgba(255,255,255,0.1)]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <p className="text-sm sm:text-base text-text-gray text-center md:text-left">
            © 2025 Akrion Digitals. Crafted with creativity, precision, and passion.
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center md:justify-end">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-text-gray hover:text-accent-orange transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

