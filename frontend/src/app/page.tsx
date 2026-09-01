"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Truck, Shield, RotateCcw, ChevronRight, Tag, Star } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $200" },
  { icon: Shield, title: "Secure Payment", desc: "100% encrypted checkout" },
  { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  { icon: Star, title: "VIP Access", desc: "Early drop notifications" },
];

const dropDate = new Date();
dropDate.setDate(dropDate.getDate() + 7);

function getTimeLeft() {
  const diff = dropDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- required to fix hydration mismatch (server 54 vs client 59)
    setMounted(true);
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="font-display text-xl font-bold tracking-tight" aria-label="Leony Jaya Home">
              LEONY JAYA
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Shop
              </Link>
              <Link href="/drops" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Drops
              </Link>
              <Link href="/lookbook" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Lookbook
              </Link>
              <Link href="/size-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Size Guide
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/account" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Account
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  0
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden denim-texture" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background/90" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 mb-6">
                <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                NEXT DROP IN
              </span>
              <h1
                id="hero-heading"
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              >
                PREMIUM DENIM
                <br />
                <span className="text-primary">CRAFTED FOR LIFE</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Limited drops. Raw selvedge. Distressed artistry. 
                <br />Each piece tells a story of craftsmanship and time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/drops"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  VIEW UPCOMING DROPS
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground rounded-md font-medium hover:bg-secondary transition-colors"
                >
                  SHOP COLLECTION
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20"
            >
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center gap-1">
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tabular-nums"
                        suppressHydrationWarning
                      >
                        {mounted ? String(value).padStart(2, "0") : "00"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            aria-hidden="true"
          >
            <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>

        <section className="py-20 bg-secondary/30 border-y border-border" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 id="features-heading" className="sr-only">Our Guarantees</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border mb-4">
                    <feature.icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" aria-labelledby="collection-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2
                  id="collection-heading"
                  className="font-display text-3xl sm:text-4xl font-bold tracking-tight"
                >
                  CURRENT COLLECTION
                </h2>
                <p className="text-muted-foreground mt-1">Hand-selected pieces available now</p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                VIEW ALL
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "14oz Raw Selvedge", type: "Slim Fit Jeans", price: 289, image: "/products/selvedge-slim.jpg", badge: "RAW" },
                { name: "12oz Stretch Denim", type: "Relaxed Fit Jeans", price: 249, image: "/products/stretch-relaxed.jpg", badge: "STRETCH" },
                { name: "16oz Heavyweight", type: "Denim Jacket Type III", price: 349, image: "/products/heavyweight-jacket.jpg", badge: "HEAVY" },
                { name: "Acid Wash Series", type: "Oversized Jeans", price: 299, image: "/products/acid-wash.jpg", badge: "LIMITED" },
              ].map((product, index) => (
                <motion.article
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link href={`/shop/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary text-primary-foreground">
                          {product.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-background transition-colors" aria-label={`Quick view ${product.name}`}>
                          <ShoppingBag className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.type}</p>
                      <p className="font-medium mt-1">${product.price}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary/30 border-y border-border" aria-labelledby="about-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">OUR CRAFT</span>
                <h2 id="about-heading" className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2 mb-6">
                  Denim That Ages With You
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Every Leony Jaya piece begins with premium Japanese selvedge denim, 
                    woven on vintage shuttle looms. We source from heritage mills in Okayama 
                    and Kojima, where generations of craftsmen perfect the art of indigo.
                  </p>
                  <p>
                    Our distressing and wash processes are done by hand — no two pairs are 
                    identical. From raw indigo that develops your personal fade story, to 
                    expertly distressed pieces with character built-in.
                  </p>
                </div>
                <Link
                  href="/our-story"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  READ OUR STORY
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary">
                <div className="absolute inset-0 denim-texture" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24" aria-labelledby="newsletter-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="newsletter-heading" className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              JOIN THE INNER CIRCLE
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Get early access to limited drops, exclusive colorways, and behind-the-scenes content.
            </p>
            <form className="max-w-md mx-auto flex gap-2" action="/api/newsletter" method="POST">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/30 border-t border-border" role="contentinfo">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-display text-xl font-bold mb-4">LEONY JAYA</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Premium denim crafted for those who appreciate the journey. 
                Limited drops. Timeless quality.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="YouTube">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">SHOP</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/shop/all" className="hover:text-foreground transition-colors">All Products</a></li>
                <li><a href="/shop/jeans" className="hover:text-foreground transition-colors">Jeans</a></li>
                <li><a href="/shop/jackets" className="hover:text-foreground transition-colors">Jackets</a></li>
                <li><a href="/shop/accessories" className="hover:text-foreground transition-colors">Accessories</a></li>
                <li><a href="/drops/upcoming" className="hover:text-foreground transition-colors">Upcoming Drops</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">SUPPORT</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/size-guide" className="hover:text-foreground transition-colors">Size Guide</a></li>
                <li><a href="/support/shipping" className="hover:text-foreground transition-colors">Shipping Info</a></li>
                <li><a href="/support/returns" className="hover:text-foreground transition-colors">Returns & Exchanges</a></li>
                <li><a href="/support/faq" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">COMPANY</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-foreground transition-colors">Our Story</a></li>
                <li><a href="/company/sustainability" className="hover:text-foreground transition-colors">Sustainability</a></li>
                <li><a href="/company/careers" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="/company/press" className="hover:text-foreground transition-colors">Press</a></li>
                <li><a href="/company/wholesale" className="hover:text-foreground transition-colors">Wholesale</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Leony Jaya. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}