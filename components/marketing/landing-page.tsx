'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { HeroSection } from './sections/hero';
import { TrustedSection, BranchSection, MobileShowcaseSection, AnalyticsShowcaseSection } from './sections/showcase';
import { FeaturesSection } from './sections/features';
import { WorkspaceModesSection } from './sections/workspace-modes';
import { PricingSection, TestimonialsSection, FAQSection, CTASection, FooterSection } from './sections/pricing-footer';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Enterprise', href: '#enterprise' },
];

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-[#E1E2EC] selection:bg-[#10B981]/30 overflow-x-hidden" style={{ fontFamily: "'Inter', 'Manrope', system-ui, sans-serif" }}>
      {/* Sticky Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050816]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 md:px-8 h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#0E152B] border border-white/[0.08] shadow-[0_0_16px_-4px_rgba(16,185,129,0.3)]">
              <Image src="/icons/icon-192x192.png" alt="HexaTrack" width={36} height={36} className="w-full h-full object-cover" priority />
            </div>
            <span className="text-[16px] font-bold tracking-tight text-[#E1E2EC]">HexaTrack</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-[14px] text-[#C2C6D6] hover:text-[#E1E2EC] transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={onLogin} className="text-[14px] text-[#C2C6D6] hover:text-[#E1E2EC] transition-colors font-medium px-4 py-2">
              Login
            </button>
            <button
              onClick={onGetStarted}
              className="text-[14px] font-semibold text-white bg-[#10B981] hover:brightness-105 px-5 py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-[0_4px_16px_-4px_rgba(16,185,129,0.4)]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#C2C6D6]">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-[#0B1023] border-t border-white/[0.06] px-5 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenu(false)} className="block py-3 text-[15px] text-[#C2C6D6] hover:text-[#E1E2EC] font-medium">
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2 border-t border-white/[0.06] mt-2">
              <button onClick={() => { setMobileMenu(false); onLogin(); }} className="py-3 text-[15px] text-[#C2C6D6] hover:text-[#E1E2EC] font-medium text-left">
                Login
              </button>
              <button
                onClick={() => { setMobileMenu(false); onGetStarted(); }}
                className="py-3 px-5 rounded-xl bg-[#10B981] text-white text-[15px] font-semibold text-center"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Sections */}
      <main>
        <HeroSection onGetStarted={onGetStarted} onLogin={onLogin} />
        <TrustedSection />
        <FeaturesSection />
        <div id="solutions">
          <WorkspaceModesSection />
        </div>
        <BranchSection />
        <MobileShowcaseSection />
        <AnalyticsShowcaseSection />
        <div id="enterprise">
          <PricingSection />
        </div>
        <TestimonialsSection />
        <FAQSection />
        <CTASection onGetStarted={onGetStarted} />
      </main>

      <FooterSection />
    </div>
  );
}
