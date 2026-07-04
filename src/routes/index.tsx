import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useSpring, useInView } from "framer-motion";
import {
  Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube,
  ChevronDown, ArrowUp, Menu, X, Sun, Moon, Star, Check,
  Sparkles, Crown, Users, Car, Snowflake, Utensils, Music, Camera,
  Zap, Clock, Wand2, HeartHandshake, PartyPopper, Baby, Cake, Briefcase,
  Presentation, Gem, Play, Navigation as NavIcon, ExternalLink, Quote,
} from "lucide-react";
import { useForm } from "react-hook-form";

import hero from "@/assets/hero-banquet.jpg";
import about from "@/assets/about-banquet.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, fetchPriority: "high" } as any,
      { rel: "canonical", href: "/" },
    ],
    meta: [{ property: "og:url", content: "/" }],
  }),
});

/* ----------------------------- Data ----------------------------- */

const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Packages", href: "#packages" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

const FEATURES = [
  { icon: Crown, title: "Luxury Interior" },
  { icon: Snowflake, title: "Fully AC Hall" },
  { icon: Car, title: "Spacious Parking" },
  { icon: HeartHandshake, title: "Bridal Room" },
  { icon: Utensils, title: "Premium Catering" },
  { icon: Music, title: "DJ & Sound" },
  { icon: Wand2, title: "Event Decoration" },
  { icon: Camera, title: "Photography Support" },
  { icon: Zap, title: "Power Backup" },
  { icon: Clock, title: "24×7 Support" },
];

const GALLERY: { src: string; cat: string; span?: string }[] = [
  { src: g1, cat: "Wedding", span: "row-span-2" },
  { src: g2, cat: "Decoration" },
  { src: g3, cat: "Birthday", span: "row-span-2" },
  { src: g4, cat: "Corporate" },
  { src: g5, cat: "Reception", span: "row-span-2" },
  { src: g6, cat: "Decoration" },
];
const GALLERY_CATS = ["All", "Wedding", "Reception", "Birthday", "Corporate", "Decoration"];

const PACKAGES = [
  {
    name: "Silver",
    price: "₹1,49,000",
    tag: "Intimate",
    icon: Sparkles,
    features: ["Elegant floral decoration", "3-course catering menu", "Round table seating", "Basic photography (4h)", "Ambient stage lighting"],
    popular: false,
  },
  {
    name: "Gold",
    price: "₹2,49,000",
    tag: "Most Popular",
    icon: Crown,
    features: ["Premium themed decor", "5-course catering menu", "Chiavari seating + linens", "Cinematic photography (8h)", "Full stage & DJ lighting"],
    popular: true,
  },
  {
    name: "Platinum",
    price: "₹3,99,000",
    tag: "Signature",
    icon: Gem,
    features: ["Bespoke luxury décor", "8-course gourmet catering", "VIP lounge + upgraded seating", "Cinematic film + drone", "Chandelier & LED wall setup"],
    popular: false,
  },
];

const EVENTS = [
  { icon: HeartHandshake, title: "Wedding" },
  { icon: PartyPopper, title: "Reception" },
  { icon: Cake, title: "Birthday Party" },
  { icon: Briefcase, title: "Corporate Events" },
  { icon: Baby, title: "Baby Shower" },
  { icon: Sparkles, title: "Anniversary" },
  { icon: Gem, title: "Engagement" },
  { icon: Presentation, title: "Conference" },
];

const TESTIMONIALS = [
  {
    name: "Priya & Arjun Mehta",
    role: "Wedding, March 2025",
    photo: "https://i.pravatar.cc/120?img=47",
    text: "Royal Grand made our dream wedding a reality. The décor, the lighting, the food — every detail was flawless.",
  },
  {
    name: "Rahul Sharma",
    role: "Corporate Gala",
    photo: "https://i.pravatar.cc/120?img=12",
    text: "Hosted our annual gala for 800 guests. Immaculate service and truly world-class hospitality.",
  },
  {
    name: "Neha Kapoor",
    role: "Reception",
    photo: "https://i.pravatar.cc/120?img=32",
    text: "Guests still talk about the reception. The hall is stunning and the team is genuinely wonderful.",
  },
  {
    name: "The Iyer Family",
    role: "Anniversary Celebration",
    photo: "https://i.pravatar.cc/120?img=68",
    text: "From planning to execution, everything was seamless. Truly a five-star experience.",
  },
];

const STATS = [
  { value: 500, suffix: "+", label: "Events Hosted" },
  { value: 10000, suffix: "+", label: "Guests Served" },
  { value: 10, suffix: "+", label: "Years Experience" },
  { value: 4.9, suffix: "", label: "Google Rating", decimals: 1 },
];

const FAQS = [
  { q: "Can we bring outside decorators?", a: "Yes, we welcome outside decorators subject to a coordination fee. Our in-house team can also design fully bespoke experiences." },
  { q: "Is parking available?", a: "We offer secure valet parking with capacity for 250+ vehicles, plus a covered guest drop-off." },
  { q: "Is catering included?", a: "Catering is included in every package. Custom multi-cuisine menus and live counters are available." },
  { q: "What is the maximum capacity?", a: "Our grand hall seats up to 800 guests and accommodates up to 1,500 in standing/reception format." },
  { q: "How far in advance should we book?", a: "We recommend booking 3–6 months in advance for weekends and peak wedding season." },
];

/* ------------------------- Utilities ------------------------- */

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as "light" | "dark" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };
  return { theme, toggle };
}

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
} as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-dark dark:text-gold">
      <Sparkles className="h-3 w-3" />
      {children}
    </div>
  );
}

function SectionTitle({ label, title, sub }: { label: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Reveal><SectionLabel>{label}</SectionLabel></Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h2>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mx-auto mt-4 h-px w-24 divider-gold" />
      </Reveal>
      {sub && (
        <Reveal delay={0.15}>
          <p className="mt-4 text-base text-muted-foreground">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* --------------------------- Page --------------------------- */

function Landing() {
  const { theme, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left gold-gradient"
      />

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-onyx"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mx-auto mb-4 h-14 w-14 rounded-full border-2 border-gold/20 border-t-gold"
              />
              <div className="font-display text-lg gold-text">Royal Grand Banquet</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar scrolled={scrolled} menuOpen={menuOpen} setMenuOpen={setMenuOpen} theme={theme} toggle={toggle} />

      <main>
        <Hero />
        <About />
        <WhyUs />
        <Gallery />
        <VirtualTour />
        <Packages />
        <Events />
        <Testimonials />
        <Stats />
        <BookingAndMap />
        <FAQ />
        <Contact />
      </main>

      <Footer />

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/919900000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/30" />
      </motion.a>

      {/* Scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full gold-gradient text-onyx shadow-luxe transition-transform hover:scale-110"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------- Navbar --------------------------- */

function Navbar({ scrolled, menuOpen, setMenuOpen, theme, toggle }: {
  scrolled: boolean; menuOpen: boolean; setMenuOpen: (v: boolean) => void; theme: string; toggle: () => void;
}) {
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 ${scrolled ? "glass rounded-full mx-3 sm:mx-6 shadow-luxe" : ""} transition-all duration-500 py-3`}>
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full gold-gradient text-onyx">
            <Crown className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide">
            Royal <span className="gold-text">Grand</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="group relative text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 gold-gradient transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label="Toggle theme" className="hidden h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary md:inline-flex">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a href="#booking" className="hidden rounded-full gold-gradient px-5 py-2 text-sm font-semibold text-onyx shadow-luxe transition-transform hover:scale-105 md:inline-flex">
            Book Now
          </a>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-full border border-border md:hidden">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mx-3 mt-2 rounded-2xl glass p-4 md:hidden"
          >
            <div className="flex flex-col">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="py-2 text-sm font-medium">
                  {n.label}
                </a>
              ))}
              <div className="mt-3 flex items-center justify-between">
                <button onClick={toggle} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs">
                  {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />} {theme === "dark" ? "Light" : "Dark"} mode
                </button>
                <a href="#booking" onClick={() => setMenuOpen(false)} className="rounded-full gold-gradient px-4 py-2 text-xs font-semibold text-onyx">
                  Book Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* --------------------------- Hero --------------------------- */

function Hero() {
  return (
    <section id="home" className="relative min-h-dvh w-full overflow-hidden">
      <img src={hero} alt="Grand banquet hall interior with crystal chandeliers" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-onyx/70 via-onyx/50 to-onyx/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklab,var(--gold)_18%,transparent),transparent_60%)]" />

      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-4 pt-24 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
          <SectionLabel>Est. 2014 · Since a decade of celebrations</SectionLabel>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Celebrate Your <span className="italic gold-text">Special Moments</span><br /> in Luxury
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.9 }}
          className="mt-6 max-w-2xl text-base text-white/80 sm:text-lg"
        >
          The perfect venue for Weddings, Engagements, Birthdays, Corporate Events & Receptions —
          designed to make every occasion unforgettable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a href="#booking" className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full gold-gradient px-8 py-3.5 text-sm font-semibold text-onyx shadow-luxe transition-transform hover:scale-105">
            <span className="relative z-10">Book Now</span>
            <Sparkles className="relative z-10 h-4 w-4" />
            <span className="pointer-events-none absolute inset-0 animate-shimmer" />
          </a>
          <a href="#booking" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
            Schedule a Visit
          </a>
        </motion.div>

        {/* Trust bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.9 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-white/60">
          <span>★ 4.9 Google</span>
          <span className="h-3 w-px bg-white/20" />
          <span>1500 Guest Capacity</span>
          <span className="h-3 w-px bg-white/20" />
          <span>500+ Events</span>
          <span className="h-3 w-px bg-white/20" />
          <span>In-House Catering</span>
        </motion.div>

        <a href="#about" aria-label="Scroll down" className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <div className="h-10 w-6 rounded-full border border-white/40 p-1">
              <div className="mx-auto h-2 w-1 animate-scroll-hint rounded-full bg-white" />
            </div>
            <ChevronDown className="h-4 w-4 animate-scroll-hint" />
          </div>
        </a>
      </div>
    </section>
  );
}

/* --------------------------- About --------------------------- */

function About() {
  const items = [
    { icon: Users, k: "1,500", v: "Guest Capacity" },
    { icon: Car, k: "250+", v: "Valet Parking" },
    { icon: Snowflake, k: "100%", v: "Air Conditioned" },
    { icon: Utensils, k: "Multi", v: "Cuisine Catering" },
  ];
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gold-gradient opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl shadow-luxe">
              <img src={about} alt="Royal Grand Banquet illuminated entrance" width={1280} height={1280} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl glass p-5 shadow-luxe sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl gold-gradient text-onyx">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">10+ Years</div>
                  <div className="text-xs text-muted-foreground">Of luxury hospitality</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal><SectionLabel>About Royal Grand</SectionLabel></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              A decade of <span className="italic gold-text">timeless</span> celebrations.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-muted-foreground">
              Since 2014, Royal Grand Banquet has been the venue of choice for discerning
              families and brands. Every arch, every chandelier, every plate is
              orchestrated by an in-house team of designers, chefs, and event curators —
              so you can be a guest at your own celebration.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {items.map((it, i) => (
              <Reveal key={it.v} delay={0.05 * i}>
                <div className="group flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold-dark transition-colors dark:text-gold group-hover:bg-gold/20">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-xl font-bold">{it.k}</div>
                    <div className="text-xs text-muted-foreground">{it.v}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#packages" className="rounded-full gold-gradient px-6 py-3 text-sm font-semibold text-onyx shadow-luxe transition-transform hover:scale-105">
                Explore Packages
              </a>
              <a href="#gallery" className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary">
                View Gallery
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Why Us --------------------------- */

function WhyUs() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--gold)_12%,transparent),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          label="Why Choose Us"
          title={<>The difference is in the <span className="italic gold-text">details</span>.</>}
          sub="Everything you need for a flawless event — thoughtfully arranged under one roof."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={0.03 * i}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group h-full rounded-2xl border border-border bg-card/70 p-5 text-center backdrop-blur transition-all hover:border-gold/40 hover:shadow-luxe"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 text-gold-dark ring-1 ring-gold/20 transition-transform group-hover:scale-110 dark:text-gold">
                  <f.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-sm font-semibold">{f.title}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Gallery --------------------------- */

function Gallery() {
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const filtered = useMemo(
    () => (cat === "All" ? GALLERY : GALLERY.filter((g) => g.cat === cat)),
    [cat]
  );

  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle label="Gallery" title={<>Moments from our <span className="italic gold-text">hall</span>.</>} />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {GALLERY_CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${
                cat === c
                  ? "border-transparent gold-gradient text-onyx shadow-luxe"
                  : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          <AnimatePresence>
            {filtered.map((g, i) => (
              <motion.button
                key={g.src + cat}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setLightbox(g.src)}
                className={`group relative overflow-hidden rounded-2xl ${g.span ?? ""}`}
              >
                <img src={g.src} alt={g.cat} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 via-onyx/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1 text-xs text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {g.cat}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-onyx/90 p-4 backdrop-blur"
          >
            <motion.img
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              src={lightbox} alt="" className="max-h-[85vh] max-w-[95vw] rounded-2xl shadow-luxe"
            />
            <button aria-label="Close" onClick={() => setLightbox(null)} className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full glass-dark text-white">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------- Virtual Tour --------------------------- */

function VirtualTour() {
  const [play, setPlay] = useState(false);
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          label="Virtual Tour"
          title={<>Step inside, <span className="italic gold-text">virtually</span>.</>}
          sub="Take a cinematic walkthrough of our hall from the comfort of your home."
        />
        <Reveal>
          <div className="mt-12 relative aspect-video overflow-hidden rounded-3xl border border-gold/20 shadow-luxe">
            {play ? (
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1"
                title="Virtual tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
              />
            ) : (
              <>
                <img src={g1} alt="Virtual tour preview" width={1920} height={1080} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-onyx/50" />
                <button onClick={() => setPlay(true)} aria-label="Play virtual tour" className="absolute inset-0 grid place-items-center">
                  <span className="relative grid h-20 w-20 place-items-center rounded-full gold-gradient text-onyx shadow-luxe transition-transform hover:scale-110">
                    <Play className="h-8 w-8 pl-1" fill="currentColor" />
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/40" />
                  </span>
                </button>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------- Packages --------------------------- */

function Packages() {
  return (
    <section id="packages" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          label="Packages"
          title={<>Curated for every <span className="italic gold-text">occasion</span>.</>}
          sub="All packages are fully customisable. Prices are indicative; contact us for a bespoke quote."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                className={`relative flex h-full flex-col rounded-3xl p-8 transition-all ${
                  p.popular
                    ? "border-2 border-transparent shadow-luxe [background:linear-gradient(var(--card),var(--card))_padding-box,linear-gradient(135deg,var(--gold-light),var(--gold-dark))_border-box]"
                    : "border border-border bg-card/70 hover:border-gold/40 hover:shadow-luxe"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gold-gradient px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-onyx shadow-luxe">
                    {p.tag}
                  </div>
                )}
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold-dark dark:text-gold">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold">{p.name}</div>
                    {!p.popular && <div className="text-xs uppercase tracking-widest text-muted-foreground">{p.tag}</div>}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="font-display text-4xl font-bold gold-text">{p.price}</div>
                  <div className="text-xs text-muted-foreground">starting · per event</div>
                </div>
                <ul className="mb-8 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-dark dark:text-gold">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-foreground/85">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    p.popular
                      ? "gold-gradient text-onyx shadow-luxe hover:scale-[1.03]"
                      : "border border-border hover:border-gold/40 hover:bg-secondary"
                  }`}
                >
                  Choose {p.name}
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Events --------------------------- */

function Events() {
  return (
    <section id="events" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle label="Events We Host" title={<>Every kind of <span className="italic gold-text">celebration</span>.</>} />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {EVENTS.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.04}>
              <motion.div
                whileHover={{ y: -6, rotate: -0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-6 text-center transition-all hover:border-gold/40 hover:shadow-luxe"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition-opacity group-hover:opacity-60" />
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gold-gradient text-onyx shadow-luxe">
                  <e.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 font-display text-lg font-semibold">{e.title}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Testimonials --------------------------- */

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <SectionTitle label="Testimonials" title={<>Loved by our <span className="italic gold-text">guests</span>.</>} />

        <div className="relative mt-14">
          <Quote className="absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 text-gold/20" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-gold/20 bg-card/70 p-8 backdrop-blur shadow-luxe sm:p-12"
            >
              <div className="mb-5 flex items-center justify-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="font-display text-xl italic leading-relaxed text-foreground/90 sm:text-2xl">
                “{t.text}”
              </p>
              <div className="mt-8 flex items-center justify-center gap-3">
                <img src={t.photo} alt={t.name} width={56} height={56} loading="lazy" className="h-14 w-14 rounded-full border-2 border-gold/40 object-cover" />
                <div className="text-left">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Show testimonial ${k + 1}`}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 gold-gradient" : "w-2 bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Stats --------------------------- */

function Stats() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-onyx to-onyx/90 p-10 shadow-luxe sm:p-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl" />
          <div className="relative grid grid-cols-2 gap-8 text-center text-white sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div>
                  <div className="font-display text-4xl font-bold gold-text sm:text-5xl">
                    <Counter to={s.value} decimals={s.decimals ?? 0} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/70">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Booking + Map --------------------------- */

type Form = {
  name: string; phone: string; email: string; eventType: string;
  eventDate: string; guests: string; message: string;
};

function BookingAndMap() {
  const {
    register, handleSubmit, reset, formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    await new Promise((r) => setTimeout(r, 900));
    console.log("Booking submission", data);
    reset();
  };

  return (
    <section id="booking" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle label="Book Your Date" title={<>Reserve your <span className="italic gold-text">celebration</span>.</>} />

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-border bg-card/70 p-6 shadow-luxe backdrop-blur sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input {...register("name", { required: true, maxLength: 80 })} className="input" placeholder="Your full name" />
                  {errors.name && <ErrorText>Name is required</ErrorText>}
                </Field>
                <Field label="Phone">
                  <input {...register("phone", { required: true, pattern: /^[0-9+\-\s()]{7,}$/ })} className="input" placeholder="+91 99000 00000" />
                  {errors.phone && <ErrorText>Valid phone required</ErrorText>}
                </Field>
                <Field label="Email" full>
                  <input type="email" {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })} className="input" placeholder="you@example.com" />
                  {errors.email && <ErrorText>Valid email required</ErrorText>}
                </Field>
                <Field label="Event Type">
                  <select {...register("eventType", { required: true })} className="input">
                    <option value="">Select event</option>
                    {EVENTS.map((e) => <option key={e.title} value={e.title}>{e.title}</option>)}
                  </select>
                  {errors.eventType && <ErrorText>Select an event</ErrorText>}
                </Field>
                <Field label="Event Date">
                  <input type="date" {...register("eventDate", { required: true })} className="input" />
                  {errors.eventDate && <ErrorText>Date is required</ErrorText>}
                </Field>
                <Field label="Guests" full>
                  <input type="number" min={10} max={1500} {...register("guests", { required: true, min: 10, max: 1500 })} className="input" placeholder="Estimated guest count" />
                  {errors.guests && <ErrorText>10–1500 guests</ErrorText>}
                </Field>
                <Field label="Message" full>
                  <textarea rows={4} {...register("message", { maxLength: 1000 })} className="input resize-none" placeholder="Tell us about your dream event…" />
                </Field>
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gold-gradient px-6 py-3.5 text-sm font-semibold text-onyx shadow-luxe transition-transform hover:scale-[1.02] disabled:opacity-70"
              >
                {isSubmitting ? "Sending…" : "Request Booking"} <Sparkles className="h-4 w-4" />
              </button>
              {isSubmitSuccessful && (
                <p className="mt-3 text-center text-sm text-gold-dark dark:text-gold">
                  Thank you! Our team will reach out within 24 hours.
                </p>
              )}
            </form>
          </Reveal>

          {/* Map + Contact card */}
          <Reveal delay={0.1}>
            <div className="grid gap-6">
              <div className="overflow-hidden rounded-3xl border border-border shadow-luxe">
                <iframe
                  title="Royal Grand Banquet location"
                  src="https://www.google.com/maps?q=Gateway%20of%20India%20Mumbai&output=embed"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex flex-wrap gap-2 border-t border-border bg-card p-3">
                  <a href="https://maps.google.com/?daddr=Gateway+of+India+Mumbai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium hover:bg-secondary/70">
                    <NavIcon className="h-3.5 w-3.5" /> Directions
                  </a>
                  <a href="https://maps.google.com/?q=Gateway+of+India+Mumbai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-medium hover:bg-secondary/70">
                    <ExternalLink className="h-3.5 w-3.5" /> Open in Maps
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-gold/20 bg-card/70 p-6 backdrop-blur shadow-luxe">
                <div className="font-display text-2xl font-bold">Visit Us</div>
                <div className="mt-1 h-px w-16 divider-gold" />
                <ul className="mt-4 space-y-3 text-sm">
                  <ContactLine icon={MapPin}>123 Royal Avenue, Downtown, Mumbai 400001</ContactLine>
                  <ContactLine icon={Phone} href="tel:+919900000000">+91 99000 00000</ContactLine>
                  <ContactLine icon={Mail} href="mailto:hello@royalgrand.com">hello@royalgrand.com</ContactLine>
                  <ContactLine icon={Clock}>Mon – Sun · 9:00 AM – 10:00 PM</ContactLine>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Local input styles */}
      <style>{`
        .input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid var(--border);
          background-color: color-mix(in oklab, var(--background) 70%, transparent);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--gold) 25%, transparent);
        }
      `}</style>
    </section>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function ErrorText({ children }: { children: React.ReactNode }) {
  return <span className="mt-1 block text-xs text-destructive">{children}</span>;
}
function ContactLine({ icon: Icon, href, children }: { icon: any; href?: string; children: React.ReactNode }) {
  const inner = (
    <span className="flex items-start gap-3">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold-dark dark:text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 text-foreground/90">{children}</span>
    </span>
  );
  return <li>{href ? <a href={href} className="hover:text-gold-dark dark:hover:text-gold">{inner}</a> : inner}</li>;
}

/* --------------------------- FAQ --------------------------- */

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionTitle label="FAQ" title={<>Frequently <span className="italic gold-text">asked</span>.</>} />
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-gold/40" : "border-border"} bg-card/60 backdrop-blur`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg font-semibold">{f.q}</span>
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all ${isOpen ? "gold-gradient text-onyx" : "bg-secondary text-foreground"}`}>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Contact section --------------------------- */

function Contact() {
  const items = [
    { icon: Phone, label: "Call", value: "+91 99000 00000", href: "tel:+919900000000" },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/919900000000" },
    { icon: Mail, label: "Email", value: "hello@royalgrand.com", href: "mailto:hello@royalgrand.com" },
    { icon: Instagram, label: "Instagram", value: "@royalgrand", href: "https://instagram.com" },
    { icon: Facebook, label: "Facebook", value: "Royal Grand Banquet", href: "https://facebook.com" },
    { icon: Youtube, label: "YouTube", value: "Watch tours", href: "https://youtube.com" },
  ];
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle label="Get in Touch" title={<>We'd love to <span className="italic gold-text">host you</span>.</>} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.04}>
              <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl border border-border bg-card/70 p-5 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gold-gradient text-onyx transition-transform group-hover:scale-110">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{it.label}</div>
                  <div className="truncate font-semibold">{it.value}</div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Footer --------------------------- */

function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-onyx text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full gold-gradient text-onyx">
              <Crown className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">Royal <span className="gold-text">Grand</span></span>
          </div>
          <p className="mt-4 text-sm text-white/60">
            A luxury banquet venue crafting extraordinary celebrations since 2014.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition-colors hover:border-gold hover:text-gold">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links" links={[["Home", "#home"], ["About", "#about"], ["Gallery", "#gallery"], ["Contact", "#contact"]]} />
        <FooterCol title="Services" links={[["Weddings", "#events"], ["Corporate", "#events"], ["Birthdays", "#events"], ["Reception", "#events"]]} />

        <div>
          <div className="font-display text-lg font-semibold text-white">Newsletter</div>
          <div className="mt-3 h-px w-12 divider-gold" />
          <p className="mt-4 text-sm text-white/60">Get seasonal offers & event inspiration.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex overflow-hidden rounded-full border border-white/15 bg-white/5">
            <input type="email" placeholder="you@example.com" className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-white/40" />
            <button className="shrink-0 gold-gradient px-4 text-xs font-semibold uppercase tracking-widest text-onyx">Join</button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:px-6">
          <div>© {new Date().getFullYear()} Royal Grand Banquet. All rights reserved.</div>
          <div>Crafted with care for unforgettable celebrations.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="font-display text-lg font-semibold text-white">{title}</div>
      <div className="mt-3 h-px w-12 divider-gold" />
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(([l, h]) => (
          <li key={l}><a href={h} className="text-white/60 transition-colors hover:text-gold">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
