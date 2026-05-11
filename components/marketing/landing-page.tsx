'use client';

import { motion } from 'framer-motion';
import { BrandMark } from '@/components/ui/brand';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface/40 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full transition-colors">
        <div className="flex items-center gap-xs">
          <BrandMark tone="dark" className="h-8 w-auto" />
          <span className="text-headline-md font-headline-md font-bold tracking-tight text-on-surface hidden sm:inline-block ml-2">
            HexaTrack
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-gutter">
          <a className="text-on-surface-variant font-body-lg text-body-lg hover:text-primary transition-colors" href="#features">Features</a>
          <a className="text-on-surface-variant font-body-lg text-body-lg hover:text-primary transition-colors" href="#insights">Insights</a>
          <a className="text-on-surface-variant font-body-lg text-body-lg hover:text-primary transition-colors" href="#pricing">Pricing</a>
        </nav>
        <div className="flex items-center gap-sm">
          <button 
            onClick={onLogin} 
            className="hidden sm:block text-body-lg font-medium text-on-surface-variant hover:text-on-surface px-4 py-2 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onLogin} 
            className="bg-[#4F8CFF] text-white px-6 py-2.5 rounded-full font-medium text-sm active:scale-95 transition-all hover:opacity-90 shadow-[0_0_20px_-5px_rgba(79,140,255,0.3)]"
          >
            Access Console
          </button>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="hero-gradient pt-24 pb-32 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/20 border border-secondary/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="text-label-mono font-label-mono text-secondary uppercase tracking-widest text-[10px]">Next-Gen Wealth Management</span>
              </div>
              <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface mb-6 leading-[1.1]">
                Intelligent Wealth <span className="text-primary font-bold">Architecture</span>
              </h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-xl">
                Optimize your portfolio with institutional-grade AI. HexaTrack provides the precision engineering tools required for modern asset management and hyper-growth strategies.
              </p>
              <div className="flex flex-wrap gap-sm">
                <button 
                  onClick={onLogin} 
                  className="bg-[#4F8CFF] text-white px-8 py-4 rounded-full font-headline-md text-headline-md font-bold active:scale-95 transition-all hover:brightness-110 shadow-lg"
                >
                  Secure Login
                </button>
                <button className="glass-card text-on-surface px-8 py-4 rounded-full font-headline-md text-headline-md active:scale-95 transition-all hover:bg-white/5">
                  View Demo
                </button>
              </div>
            </motion.div>

            <div className="lg:col-span-6 relative mt-16 lg:mt-0">
              {/* Dashboard Mockup */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="glass-card rounded-xl p-6 accent-glow relative z-10 border border-white/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error/40"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
                  </div>
                  <span className="text-label-mono font-label-mono text-on-surface-variant text-xs">HEXATRACK_CORE_v2.4</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface-container-lowest/50 rounded-lg p-4 border border-white/5">
                    <p className="text-label-mono font-label-mono text-on-surface-variant mb-1 uppercase text-[10px]">Net Worth</p>
                    <p className="text-2xl font-bold text-secondary">$1,248,302.45</p>
                  </div>
                  <div className="bg-surface-container-lowest/50 rounded-lg p-4 border border-white/5">
                    <p className="text-label-mono font-label-mono text-on-surface-variant mb-1 uppercase text-[10px]">24h Change</p>
                    <p className="text-2xl font-bold text-primary">+12.4%</p>
                  </div>
                </div>
                <div className="h-48 w-full bg-surface-container-lowest/30 rounded-lg overflow-hidden flex items-end pb-2">
                  <div className="flex items-end justify-between w-full h-full px-4 pt-8 gap-2">
                    <motion.div initial={{ height: 0 }} animate={{ height: '40%' }} transition={{ duration: 1, delay: 0.5 }} className="w-full bg-primary/20 rounded-t"></motion.div>
                    <motion.div initial={{ height: 0 }} animate={{ height: '60%' }} transition={{ duration: 1, delay: 0.6 }} className="w-full bg-primary/30 rounded-t"></motion.div>
                    <motion.div initial={{ height: 0 }} animate={{ height: '50%' }} transition={{ duration: 1, delay: 0.7 }} className="w-full bg-primary/40 rounded-t"></motion.div>
                    <motion.div initial={{ height: 0 }} animate={{ height: '80%' }} transition={{ duration: 1, delay: 0.8 }} className="w-full bg-primary/60 rounded-t"></motion.div>
                    <motion.div initial={{ height: 0 }} animate={{ height: '100%' }} transition={{ duration: 1, delay: 0.9 }} className="w-full bg-secondary rounded-t shadow-[0_0_20px_rgba(173,198,255,0.4)]"></motion.div>
                    <motion.div initial={{ height: 0 }} animate={{ height: '70%' }} transition={{ duration: 1, delay: 1.0 }} className="w-full bg-primary/50 rounded-t"></motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Glass Cards */}
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -top-12 -right-8 w-48 h-32 glass-card rounded-xl p-4 z-20 border border-white/20 hidden md:block rotate-6 hover:rotate-0 transition-transform duration-500"
              >
                <span className="material-symbols-outlined text-secondary mb-2">insights</span>
                <p className="text-label-mono font-label-mono text-on-surface-variant uppercase text-[10px]">AI Signal</p>
                <p className="text-body-sm font-body-sm text-on-surface font-semibold mt-1">Buy ETH @ $2,420</p>
              </motion.div>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -bottom-8 -left-12 w-56 h-36 glass-card rounded-xl p-6 z-20 border border-white/20 hidden md:block -rotate-3 hover:rotate-0 transition-transform duration-500"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-on-tertiary-container/20 rounded-lg">
                    <span className="material-symbols-outlined text-tertiary">account_balance_wallet</span>
                  </div>
                  <p className="text-body-sm font-body-sm font-bold">Smart Savings</p>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: '75%' }} 
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }} 
                    className="bg-tertiary h-full rounded-full"
                  ></motion.div>
                </div>
                <p className="text-label-mono font-label-mono mt-2 text-right text-tertiary text-xs">75% Target</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y border-white/5 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black tracking-tighter font-headline-md">STRIPE</span>
            <span className="text-2xl font-black tracking-tighter font-headline-md">GOLDMAN SACHS</span>
            <span className="text-2xl font-black tracking-tighter font-headline-md">BINANCE</span>
            <span className="text-2xl font-black tracking-tighter font-headline-md">BLACKROCK</span>
            <span className="text-2xl font-black tracking-tighter font-headline-md">VANGUARD</span>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-32 px-margin-mobile md:px-margin-desktop bg-background">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-display-lg-mobile md:text-headline-md font-headline-md text-primary mb-4 font-bold"
              >
                Engineered for Results
              </motion.h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Superior data visibility and automated financial intelligence for professional users and long-term asset management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Feature 1: AI Analytics */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-8 glass-card rounded-xl p-8 lg:p-10 flex flex-col justify-between min-h-[400px] overflow-hidden"
              >
                <div>
                  <div className="w-12 h-12 bg-secondary-container/20 rounded-xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-secondary text-3xl">analytics</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-headline-md">AI-Driven Risk Analytics</h3>
                  <p className="text-body-lg font-body-lg text-on-surface-variant max-w-md">
                    Our neural engine analyzes millions of telemetry points daily to identify market patterns and portfolio efficiency paths before they impact your wallet.
                  </p>
                </div>
                <div className="mt-8 overflow-hidden rounded-xl bg-surface-container-low border border-white/5 p-4 bg-gradient-to-b from-surface-container-high to-background">
                  <div className="w-full h-40 flex items-end justify-around gap-2 p-2">
                     {[60, 40, 75, 50, 90, 65, 85, 100].map((val, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${val}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.8 }}
                          className="flex-1 bg-gradient-to-t from-secondary/10 to-secondary/60 rounded-t-md"
                        />
                     ))}
                  </div>
                </div>
              </motion.div>

              {/* Feature 2: Security */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="md:col-span-4 glass-card rounded-xl p-8 lg:p-10 border-t-2 border-t-primary/20 flex flex-col"
              >
                <div className="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">security</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline-md">Vault Security</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant mb-8 flex-1">
                  Multi-layered encryption with biometric workspace lockdowns for unmatched capital protection.
                </p>
                <ul className="space-y-4">
                  {['AES-256 ENCRYPTION', '2FA BIO-AUTH', 'WORKSPACE ISOLATION'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                      <span className="text-label-mono font-label-mono text-on-surface text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Feature 3: Smart Savings */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="md:col-span-4 glass-card rounded-xl p-8 lg:p-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-on-tertiary-container/10 rounded-full flex items-center justify-center mb-8 border border-tertiary/20 accent-glow">
                  <span className="material-symbols-outlined text-tertiary text-4xl">account_balance_wallet</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 font-headline-md">Smart Savings</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Automate distribution and optimize financial targets across unlimited accounts and assets instantly.
                </p>
              </motion.div>

              {/* Feature 4: Global Access */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="md:col-span-8 glass-card rounded-xl p-8 lg:p-10 flex items-center gap-10 overflow-hidden"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 font-headline-md">Unified Connectivity</h3>
                  <p className="text-body-lg font-body-lg text-on-surface-variant">
                    Aggregate your distributed bank accounts, currencies, and business nodes into a single unified command center.
                  </p>
                </div>
                <div className="hidden lg:flex flex-col gap-4 w-1/3">
                  <div className="bg-surface-container rounded-full p-3 border border-white/5 flex items-center gap-3 ml-12 transform translate-x-4 hover:translate-x-0 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-[#4F8CFF] flex items-center justify-center text-white"><span className="material-symbols-outlined text-xs">account_balance</span></div>
                    <span className="text-label-mono font-label-mono text-xs">CHASE</span>
                  </div>
                  <div className="bg-surface-container rounded-full p-3 border border-white/5 flex items-center gap-3 border-l-primary/30 border-l-2">
                    <div className="w-8 h-8 rounded-full bg-[#3d4fb0] flex items-center justify-center text-white"><span className="material-symbols-outlined text-xs">currency_exchange</span></div>
                    <span className="text-label-mono font-label-mono text-xs">WISE</span>
                  </div>
                  <div className="bg-surface-container rounded-full p-3 border border-white/5 flex items-center gap-3 ml-12 transform translate-x-4 hover:translate-x-0 transition-transform">
                    <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white"><span className="material-symbols-outlined text-xs">credit_card</span></div>
                    <span className="text-label-mono font-label-mono text-xs">REVOLUT</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-margin-mobile md:px-margin-desktop relative bg-background">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-[1000px] mx-auto bg-primary-container rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-primary/20 shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full -ml-32 -mb-32"></div>
            
            <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-primary-container mb-8 relative z-10 font-bold leading-tight">
              Construct your financial <span className="text-primary italic">legacy</span>.
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-12 max-w-xl mx-auto relative z-10">
              Join users who trust HexaTrack for their wealth control framework and operational flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button 
                onClick={onLogin}
                className="bg-[#4F8CFF] text-white px-12 py-5 rounded-full font-bold text-lg active:scale-95 transition-all hover:brightness-110 shadow-xl"
              >
                Access Portal
              </button>
              <button className="bg-transparent border border-white/20 text-on-surface px-12 py-5 rounded-full font-bold text-lg active:scale-95 transition-all hover:bg-white/5">
                View Documentation
              </button>
            </div>
            <p className="mt-8 text-label-mono font-label-mono text-on-surface-variant/60 uppercase tracking-widest text-xs relative z-10">
              Encrypted by default. Production ready infrastructure.
            </p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest pt-24 pb-12 px-margin-mobile md:px-margin-desktop border-t border-white/5 mt-auto">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
          <div className="md:col-span-2 lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <BrandMark tone="dark" className="w-8 h-8" />
              <span className="text-xl font-bold font-headline-md">HexaTrack</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant max-w-xs mb-8 text-sm">
              The professional layer for financial workspace management and asset intelligence.
            </p>
            <div className="flex gap-4 mt-auto">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-lg">terminal</span>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-lg">public</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0">
            <h4 className="text-label-mono font-label-mono text-primary uppercase mb-6 text-xs font-bold tracking-wider">Product</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><a className="hover:text-on-surface transition-colors" href="#">Platform</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Updates</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Pricing</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Security</a></li>
            </ul>
          </div>
          
          <div className="mt-8 md:mt-0">
            <h4 className="text-label-mono font-label-mono text-primary uppercase mb-6 text-xs font-bold tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><a className="hover:text-on-surface transition-colors" href="#">About</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">System Status</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Contact</a></li>
              <li><a className="hover:text-on-surface transition-colors" href="#">Legal</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2 mt-8 lg:mt-0">
            <h4 className="text-label-mono font-label-mono text-primary uppercase mb-6 text-xs font-bold tracking-wider">Stay informed</h4>
            <div className="flex gap-2">
              <input 
                className="bg-surface-container border border-white/10 rounded-xl px-4 py-3 flex-1 text-on-surface text-sm focus:outline-none focus:border-primary/50 transition-colors" 
                placeholder="Enter work email" 
                type="email"
              />
              <button className="bg-surface-container-highest border border-white/10 px-6 py-3 rounded-xl text-on-surface font-medium text-sm hover:bg-white/5 transition-colors">
                Join
              </button>
            </div>
            <p className="mt-4 text-[11px] text-on-surface-variant/40 leading-relaxed uppercase tracking-tight">
              HexaTrack is built for analytical wealth observation. 2026 Development Build.
            </p>
          </div>
        </div>
        
        <div className="max-w-[1440px] mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-on-surface-variant/40 uppercase font-label-mono tracking-widest">
          <span>© 2026 HEXATRACK SYSTEMS</span>
          <div className="flex gap-6">
            <span>PRIVACY</span>
            <span>TERMS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
