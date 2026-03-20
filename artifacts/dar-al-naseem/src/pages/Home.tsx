import { useEffect, useRef, useState, useCallback } from "react";

// ─── Typewriter Hook ────────────────────────────────────────────────
function useTypewriter(text: string, speed = 40, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ─── Counter Hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Fade-In Section ────────────────────────────────────────────────
function FadeSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`fade-in-section ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────
function SuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`modal-overlay ${open ? "active" : ""}`} onClick={onClose}>
      <div className="glass gold-border rounded-2xl p-10 max-w-md w-full mx-4 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #8a6d1e, #c9a84c, #e8c97a)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#060d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-2xl font-light gold-text mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>Message Received</h3>
        <p className="text-white/70 text-sm leading-relaxed mb-6">
          Message sent successfully. Our team will get back to you within 24 hours with an assured solution.
        </p>
        <button onClick={onClose} className="btn-gold px-8 py-3 rounded-full text-xs">
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#founder", label: "Founder" },
    { href: "#projects", label: "Projects" },
    { href: "#company", label: "Company" },
    { href: "#office", label: "Office" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass" : ""}`} style={{ padding: "1.25rem 2rem" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <div className="shimmer-gold text-lg font-light tracking-widest" style={{ fontFamily: "var(--app-font-serif)", letterSpacing: "0.3em" }}>DAN</div>
          <div className="text-white/30 text-xs tracking-widest" style={{ fontSize: "0.55rem", letterSpacing: "0.25em" }}>DAR AL NASEEM</div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>
        <a href="#contact" className="btn-gold px-5 py-2 rounded-full text-xs hidden md:block">
          Request Access
        </a>
      </div>
    </nav>
  );
}

// ─── Hero / Founder ─────────────────────────────────────────────────
function HeroSection() {
  const storyText = "A visionary architect who transformed skylines across the UAE, Mr. Khaleel Mohd has spent decades shaping not just buildings, but legacies. As one of the UAE's top-tier architectural minds, his expertise spans across architectural design, large-scale infrastructure development, strategic investment consulting, and opinion-based project analysis — guiding high-net-worth investors and governments toward decisions that endure.";
  const { displayed, done } = useTypewriter(storyText, 20, 1200);

  return (
    <section id="founder" className="min-h-screen hero-bg relative flex items-center justify-center overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(10,30,80,0.3) 0%, transparent 70%)" }} />

      {/* Vertical line left */}
      <div className="absolute left-8 top-1/4 bottom-1/4 w-px pointer-events-none" style={{ background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.4), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="text-xs tracking-widest text-white/40 mb-4 uppercase" style={{ letterSpacing: "0.4em" }}>Founder & Principal</div>
            <div className="divider-gold mb-8 w-16" />

            <h1 className="text-5xl md:text-7xl font-extralight leading-none mb-3" style={{ fontFamily: "var(--app-font-serif)", letterSpacing: "-0.01em" }}>
              <span className="gold-text gold-glow-text">MR.</span>
            </h1>
            <h1 className="text-5xl md:text-7xl font-extralight leading-none mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
              Khaleel
            </h1>
            <h1 className="text-5xl md:text-7xl font-extralight leading-none mb-8" style={{ fontFamily: "var(--app-font-serif)", letterSpacing: "-0.01em" }}>
              <span className="text-white/60">Mohd</span>
            </h1>

            <div className="gold-border rounded-sm px-4 py-2 inline-block mb-10">
              <p className="text-xs tracking-widest text-white/80" style={{ letterSpacing: "0.2em" }}>
                Visionary Architect & Investment Consultant
              </p>
            </div>

            <div className="text-white/65 text-base leading-relaxed" style={{ fontFamily: "var(--app-font-serif)", minHeight: "8rem" }}>
              {displayed}
              {!done && <span className="typewriter-cursor" />}
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex flex-col gap-6">
            {[
              { label: "Years of Experience", value: "20+", sub: "UAE Real Estate & Architecture" },
              { label: "Specializations", value: "4", sub: "ARC · Infrastructure · Investment · Analysis" },
              { label: "Projects Consulted", value: "150+", sub: "Across UAE & GCC" },
            ].map((stat, i) => (
              <FadeSection key={stat.label} delay={i * 150}>
                <div className="glass-light gold-border rounded-xl p-6 luxury-card">
                  <div className="text-4xl font-extralight gold-text mb-1" style={{ fontFamily: "var(--app-font-serif)" }}>{stat.value}</div>
                  <div className="text-white/90 text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-white/40 text-xs tracking-wide">{stat.sub}</div>
                </div>
              </FadeSection>
            ))}

            {/* Specializations */}
            <FadeSection delay={450}>
              <div className="glass-light rounded-xl p-6">
                <div className="text-white/40 text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: "0.25em" }}>Core Expertise</div>
                <div className="grid grid-cols-2 gap-3">
                  {["Architecture (ARC)", "Infrastructure Dev.", "Investment Consulting", "Project Analysis"].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
                      <span className="text-white/70 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs tracking-widest uppercase" style={{ letterSpacing: "0.3em", fontSize: "0.6rem" }}>Scroll</span>
        <div className="w-px h-12" style={{ background: "linear-gradient(180deg, rgba(201,168,76,0.6), transparent)" }} />
      </div>
    </section>
  );
}

// ─── Projects (Restricted) ──────────────────────────────────────────
function ProjectsSection() {
  const projects = [
    { title: "Project Vertex", location: "Downtown Dubai", type: "Mixed-Use Tower", sqft: "2.4M sqft" },
    { title: "Project Serenity", location: "Palm Jumeirah", type: "Ultra-Luxury Residences", sqft: "850K sqft" },
    { title: "Project Atlas", location: "Abu Dhabi Corniche", type: "Commercial Complex", sqft: "1.8M sqft" },
    { title: "Project Eclipse", location: "Jumeirah Bay Island", type: "Island Development", sqft: "3.2M sqft" },
    { title: "Project Mirage", location: "Dubai Marina", type: "Hospitality & Retail", sqft: "1.1M sqft" },
    { title: "Project Zenith", location: "DIFC", type: "Financial District Hub", sqft: "720K sqft" },
  ];

  return (
    <section id="projects" className="py-32 relative" style={{ background: "linear-gradient(180deg, #060d1a 0%, #0a0f1e 100%)" }}>
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeSection>
          <div className="text-center mb-16">
            <div className="text-xs tracking-widest text-white/30 mb-4 uppercase" style={{ letterSpacing: "0.4em" }}>Portfolio</div>
            <h2 className="text-5xl font-extralight mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
              <span className="gold-text">Exclusive</span> Projects
            </h2>
            <div className="divider-gold max-w-xs mx-auto" />
          </div>
        </FadeSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {projects.map((p, i) => (
            <FadeSection key={p.title} delay={i * 100}>
              <div className="relative rounded-2xl overflow-hidden glass-light gold-border luxury-card" style={{ minHeight: "280px" }}>
                {/* Blurred content */}
                <div className="restricted-blur p-6 h-full">
                  <div className="w-full h-32 rounded-lg mb-4" style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(10,30,80,0.3) 100%)` }} />
                  <div className="text-white font-medium mb-1">{p.title}</div>
                  <div className="text-white/60 text-sm mb-1">{p.location}</div>
                  <div className="text-white/40 text-xs">{p.type}</div>
                  <div className="text-white/30 text-xs mt-2">{p.sqft}</div>
                </div>

                {/* Restricted overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "rgba(6,13,26,0.5)", backdropFilter: "blur(2px)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 gold-border" style={{ background: "rgba(6,13,26,0.8)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="text-white/90 text-sm font-medium tracking-wider mb-1">Restricted Access</div>
                  <div className="text-white/40 text-xs tracking-wide">Request access to view details</div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>

        {/* Access Form */}
        <AccessForm />
      </div>
    </section>
  );
}

// ─── Access Form ────────────────────────────────────────────────────
function AccessForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", comment: "" });
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const buildMessage = () =>
    `Hello Dar Al Naseem (DAN),%0A%0AName: ${encodeURIComponent(form.name)}%0APhone: ${encodeURIComponent(form.phone)}%0AEmail: ${encodeURIComponent(form.email)}%0A%0AMessage: ${encodeURIComponent(form.comment)}%0A%0ARequesting access to restricted project portfolio.`;

  const handleWhatsApp = () => {
    if (!form.name || !form.email) return;
    window.open(`https://wa.me/971500000000?text=${buildMessage()}`, "_blank");
    setModalOpen(true);
  };

  const handleEmail = () => {
    if (!form.name || !form.email) return;
    const subject = encodeURIComponent("Access Request - Dar Al Naseem Portfolio");
    const body = `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.comment}\n\nRequesting access to restricted project portfolio.`;
    window.open(`mailto:info@daralnaseem.com?subject=${subject}&body=${encodeURIComponent(body)}`);
    setModalOpen(true);
  };

  return (
    <>
      <FadeSection>
        <div className="glass gold-border rounded-3xl p-10 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs tracking-widest text-white/30 mb-3 uppercase" style={{ letterSpacing: "0.4em" }}>Unlock Portfolio</div>
            <h3 className="text-3xl font-extralight gold-text" style={{ fontFamily: "var(--app-font-serif)" }}>Request Exclusive Access</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white/40 text-xs tracking-wider block mb-2 uppercase">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="luxury-input w-full px-4 py-3 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-white/40 text-xs tracking-wider block mb-2 uppercase">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+971 XX XXX XXXX" className="luxury-input w-full px-4 py-3 rounded-lg text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white/40 text-xs tracking-wider block mb-2 uppercase">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="luxury-input w-full px-4 py-3 rounded-lg text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="text-white/40 text-xs tracking-wider block mb-2 uppercase">What Are You Looking For?</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} rows={4} placeholder="Describe your investment interest, property goals, or specific project requirements..." className="luxury-input w-full px-4 py-3 rounded-lg text-sm resize-none" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button onClick={handleWhatsApp} className="btn-gold flex-1 py-4 rounded-full flex items-center justify-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Connect on WhatsApp
            </button>
            <button onClick={handleEmail} className="btn-outline-gold flex-1 py-4 rounded-full flex items-center justify-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Send via Email
            </button>
          </div>
        </div>
      </FadeSection>
      <SuccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

// ─── Company Section ─────────────────────────────────────────────────
function CompanySection() {
  const storyText = "Dar Al Naseem stands as one of the oldest and most reliable real estate firms in the region — a name synonymous with trust, precision, and generational wealth creation. As certified architectural consultants with a commanding presence across the UAE real estate sector, we have built our legacy on delivering results that transcend transactions.";
  const { displayed, done } = useTypewriter(storyText, 18, 200);

  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsVisible(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const portfolioValue = useCountUp(100, 2500, statsVisible);
  const yearsOld = useCountUp(25, 2000, statsVisible);
  const properties = useCountUp(500, 2200, statsVisible);
  const clients = useCountUp(1200, 2300, statsVisible);

  return (
    <section id="company" className="py-32 relative" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #060d1a 100%)" }}>
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <FadeSection>
              <div className="text-xs tracking-widest text-white/30 mb-4 uppercase" style={{ letterSpacing: "0.4em" }}>About Us</div>
              <h2 className="text-5xl font-extralight mb-6 leading-tight" style={{ fontFamily: "var(--app-font-serif)" }}>
                Dar Al <span className="gold-text">Naseem</span>
              </h2>
              <div className="divider-gold mb-8 w-16" />
              <p className="text-white/65 text-lg leading-relaxed mb-8" style={{ fontFamily: "var(--app-font-serif)", minHeight: "6rem" }}>
                {displayed}
                {!done && <span className="typewriter-cursor" />}
              </p>
            </FadeSection>

            {/* Services */}
            <FadeSection delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🏠", title: "Buying & Selling", desc: "Premium transactions with complete discretion" },
                  { icon: "🌍", title: "Land & Plot Experts", desc: "Strategic land acquisition across UAE" },
                  { icon: "🏗️", title: "Development", desc: "End-to-end property development solutions" },
                  { icon: "📋", title: "Property Management", desc: "Professional portfolio management services" },
                ].map((s) => (
                  <div key={s.title} className="glass-light rounded-xl p-5 luxury-card">
                    <div className="text-2xl mb-3">{s.icon}</div>
                    <div className="text-white/90 text-sm font-medium mb-1">{s.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{s.desc}</div>
                  </div>
                ))}
              </div>
            </FadeSection>
          </div>

          {/* Stats */}
          <div ref={statsRef}>
            <FadeSection>
              <div className="glass gold-border rounded-3xl p-10">
                <div className="text-center mb-8">
                  <div className="text-xs tracking-widest text-white/30 mb-2 uppercase" style={{ letterSpacing: "0.3em" }}>By The Numbers</div>
                  <div className="divider-gold" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: portfolioValue, suffix: "M+", label: "Portfolio Value", unit: "AED" },
                    { value: yearsOld, suffix: "+", label: "Years of Excellence", unit: "" },
                    { value: properties, suffix: "+", label: "Properties Handled", unit: "" },
                    { value: clients, suffix: "+", label: "Satisfied Clients", unit: "" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="gold-text font-extralight" style={{ fontFamily: "var(--app-font-serif)", fontSize: "3rem", lineHeight: 1 }}>
                        {s.value}{s.suffix}
                      </div>
                      <div className="text-white/40 text-xs mt-1 uppercase tracking-wider">{s.unit}</div>
                      <div className="text-white/60 text-xs mt-2 tracking-wide">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                  <div className="text-center">
                    <div className="text-white/40 text-xs tracking-wider uppercase mb-2" style={{ letterSpacing: "0.25em" }}>Investment Portfolios Managed</div>
                    <div className="gold-text text-2xl font-light" style={{ fontFamily: "var(--app-font-serif)" }}>AED 100M+</div>
                    <div className="text-white/30 text-xs mt-1">Per senior manager, per portfolio</div>
                  </div>
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Collaborators Marquee ───────────────────────────────────────────
function CollaboratorsSection() {
  const companies = ["EMAAR", "NAKHEEL", "SOBHA", "DAMAC", "DANUBE", "MEERAS", "SAMANA", "AZIZI", "EMAAR", "NAKHEEL", "SOBHA", "DAMAC", "DANUBE", "MEERAS", "SAMANA", "AZIZI"];

  return (
    <section className="py-20 overflow-hidden relative" style={{ background: "#060d1a", borderTop: "1px solid rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <FadeSection>
          <div className="text-center">
            <div className="text-xs tracking-widest text-white/30 mb-2 uppercase" style={{ letterSpacing: "0.4em" }}>Our Partners</div>
            <h3 className="text-3xl font-extralight" style={{ fontFamily: "var(--app-font-serif)" }}>
              Trusted <span className="gold-text">Collaborators</span>
            </h3>
          </div>
        </FadeSection>
      </div>

      <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
        <div className="marquee-track">
          {companies.map((c, i) => (
            <div key={`${c}-${i}`} className="flex items-center mx-12 group cursor-pointer" style={{ minWidth: "180px" }}>
              <div className="glass-light rounded-xl px-8 py-5 w-full text-center transition-all duration-300 group-hover:border-yellow-500/40 group-hover:shadow-lg" style={{ transition: "all 0.3s ease" }}>
                <span className="text-white/25 text-sm font-light tracking-widest uppercase transition-all duration-300 group-hover:text-yellow-500" style={{ letterSpacing: "0.25em", filter: "grayscale(1)", transition: "filter 0.3s ease, color 0.3s ease" }}>
                  {c}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blueprint Office Section ────────────────────────────────────────
function OfficeSection() {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setAnimKey(k => k + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="office" className="py-32 relative" style={{ background: "linear-gradient(180deg, #060d1a 0%, #04080f 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection>
          <div className="text-center mb-16">
            <div className="text-xs tracking-widest text-white/30 mb-4 uppercase" style={{ letterSpacing: "0.4em" }}>Expansion</div>
            <h2 className="text-5xl font-extralight mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
              Our <span className="gold-text">Upcoming Office</span>
            </h2>
            <div className="divider-gold max-w-xs mx-auto" />
          </div>
        </FadeSection>

        <FadeSection>
          <div className="relative rounded-3xl overflow-hidden glass gold-border" style={{ minHeight: "500px" }}>
            {/* Blueprint SVG */}
            <svg key={animKey} className="absolute inset-0 w-full h-full" viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.7 }}>
              <rect width="900" height="500" fill="#020812" />
              {/* Grid */}
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="500" stroke="rgba(30,80,180,0.15)" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 42} x2="900" y2={i * 42} stroke="rgba(30,80,180,0.15)" strokeWidth="0.5" />
              ))}

              {/* Main floor plan */}
              <rect className="blueprint-line" x="80" y="60" width="740" height="380" rx="4" fill="none" stroke="rgba(50,100,220,0.5)" strokeWidth="2" />

              {/* Interior rooms */}
              <line className="blueprint-line blueprint-line-delay-1" x1="80" y1="200" x2="420" y2="200" stroke="rgba(50,100,220,0.4)" strokeWidth="1.5" />
              <line className="blueprint-line blueprint-line-delay-1" x1="420" y1="60" x2="420" y2="440" stroke="rgba(50,100,220,0.4)" strokeWidth="1.5" />
              <line className="blueprint-line blueprint-line-delay-2" x1="420" y1="300" x2="820" y2="300" stroke="rgba(50,100,220,0.4)" strokeWidth="1.5" />
              <line className="blueprint-line blueprint-line-delay-2" x1="640" y1="60" x2="640" y2="300" stroke="rgba(50,100,220,0.4)" strokeWidth="1.5" />
              <line className="blueprint-line blueprint-line-delay-3" x1="80" y1="310" x2="420" y2="310" stroke="rgba(50,100,220,0.35)" strokeWidth="1" />

              {/* Diagonal accent */}
              <line className="blueprint-line blueprint-line-delay-4" x1="80" y1="60" x2="420" y2="200" stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeDasharray="4 4" />
              <line className="blueprint-line blueprint-line-delay-4" x1="420" y1="60" x2="640" y2="300" stroke="rgba(201,168,76,0.3)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Dimension lines */}
              <line className="blueprint-line blueprint-line-delay-5" x1="80" y1="490" x2="820" y2="490" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
              <line x1="80" y1="485" x2="80" y2="495" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
              <line x1="820" y1="485" x2="820" y2="495" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />

              {/* Labels */}
              <text x="220" y="140" fill="rgba(201,168,76,0.7)" fontSize="11" fontFamily="monospace" textAnchor="middle">EXECUTIVE SUITE</text>
              <text x="220" y="260" fill="rgba(201,168,76,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">BOARDROOM</text>
              <text x="220" y="370" fill="rgba(201,168,76,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">CLIENT LOUNGE</text>
              <text x="530" y="175" fill="rgba(201,168,76,0.7)" fontSize="11" fontFamily="monospace" textAnchor="middle">MAIN TRADING FLOOR</text>
              <text x="730" y="380" fill="rgba(201,168,76,0.6)" fontSize="9" fontFamily="monospace" textAnchor="middle">OPERATIONS</text>
              <text x="450" y="505" fill="rgba(201,168,76,0.6)" fontSize="10" fontFamily="monospace" textAnchor="middle">10,000 SQFT</text>

              {/* Corner marks */}
              {[[80,60],[820,60],[80,440],[820,440]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="none" stroke="rgba(201,168,76,0.8)" strokeWidth="1" />
                  <circle cx={x} cy={y} r="8" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="0.5" />
                </g>
              ))}
            </svg>

            {/* Overlay info */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full" style={{ minHeight: "500px" }}>
              <div className="glass rounded-2xl px-10 py-8 text-center" style={{ background: "rgba(6,13,26,0.7)", backdropFilter: "blur(20px)" }}>
                <div className="gold-text text-xs tracking-widest uppercase mb-4" style={{ letterSpacing: "0.4em" }}>DAN Headquarters</div>
                <div className="text-4xl font-extralight text-white mb-2 float-anim" style={{ fontFamily: "var(--app-font-serif)" }}>10,000 sq.ft</div>
                <div className="text-white/50 text-sm mb-6">Upcoming Office — Under Development</div>
                <div className="divider-gold mb-6" />
                <div className="space-y-2 text-xs text-white/60 tracking-wider" style={{ letterSpacing: "0.15em" }}>
                  <div><span className="gold-text font-medium">Dar Al Naseem (DAN) IT</span> — UAE | IND</div>
                  <div><span className="gold-text font-medium">DAN Group</span> — UAE | SAUDI | USA | IND | UK</div>
                </div>
              </div>
            </div>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── Team Section ────────────────────────────────────────────────────
function TeamSection() {
  const agents = [
    { name: "Agent 01", title: "Senior Property Consultant", region: "Dubai & Northern Emirates", years: "12+" },
    { name: "Agent 02", title: "Investment Portfolio Manager", region: "Abu Dhabi & Al Ain", years: "8+" },
    { name: "Agent 03", title: "Architectural Liaison", region: "UAE & GCC", years: "15+" },
    { name: "Agent 04", title: "Land Acquisition Specialist", region: "Dubai & Sharjah", years: "10+" },
  ];

  return (
    <section id="team" className="py-32 relative" style={{ background: "linear-gradient(180deg, #04080f 0%, #0a0f1e 100%)" }}>
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeSection>
          <div className="text-center mb-16">
            <div className="text-xs tracking-widest text-white/30 mb-4 uppercase" style={{ letterSpacing: "0.4em" }}>Our People</div>
            <h2 className="text-5xl font-extralight mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
              The <span className="gold-text">Expert Team</span>
            </h2>
            <div className="divider-gold max-w-xs mx-auto" />
          </div>
        </FadeSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, i) => (
            <FadeSection key={agent.name} delay={i * 120}>
              <div className="relative rounded-2xl overflow-hidden glass-light gold-border luxury-card" style={{ minHeight: "340px" }}>
                {/* Blurred photo placeholder */}
                <div className="restricted-blur">
                  <div className="w-full h-48 relative overflow-hidden">
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(135deg, rgba(${30 + i * 20}, ${50 + i * 10}, ${120 + i * 15}, 0.4) 0%, rgba(201,168,76,0.1) 100%)`
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full" style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.2), rgba(30,60,120,0.3))` }} />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="h-2 bg-white/10 rounded mb-1" />
                      <div className="h-2 bg-white/5 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="h-3 bg-white/10 rounded mb-2" />
                    <div className="h-2 bg-white/5 rounded mb-1 w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>

                {/* Restricted overlay */}
                <div className="absolute inset-0 flex flex-col items-end justify-start p-5">
                  <div className="glass rounded-full px-3 py-1 flex items-center gap-2">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span className="text-white/70 text-xs">Private Access</span>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.95) 0%, transparent 100%)" }}>
                  <div className="text-white/80 text-sm font-medium mb-1">{agent.name}</div>
                  <div className="gold-text text-xs mb-1">{agent.title}</div>
                  <div className="text-white/40 text-xs">{agent.region} · {agent.years} yrs</div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>

        {/* Working snapshots */}
        <FadeSection delay={200}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden" style={{ height: "120px" }}>
                <div className="restricted-blur w-full h-full" style={{
                  background: `linear-gradient(135deg, rgba(${20+i*15},${40+i*10},${80+i*20},0.4) 0%, rgba(201,168,76,0.05) 100%)`
                }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full grid grid-cols-3 gap-1 p-3 opacity-30">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <div key={j} className="rounded" style={{ background: "rgba(255,255,255,0.15)" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(6,13,26,0.4)" }}>
                  <div className="glass rounded-full px-3 py-1">
                    <span className="text-white/50 text-xs">Working Snapshot</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── Footer / Contact ────────────────────────────────────────────────
function FooterSection() {
  return (
    <footer id="contact" className="py-20 relative" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #030609 100%)" }}>
      <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeSection>
          <div className="text-center mb-16">
            <div className="shimmer-gold text-5xl font-extralight tracking-widest mb-2" style={{ fontFamily: "var(--app-font-serif)", letterSpacing: "0.4em" }}>DAN</div>
            <div className="text-white/30 text-xs tracking-widest mb-8 uppercase" style={{ letterSpacing: "0.4em" }}>Dar Al Naseem</div>
            <div className="divider-gold max-w-xs mx-auto mb-8" />
            <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
              Where architecture meets investment intelligence. Serving the UAE and beyond with distinction since inception.
            </p>
          </div>
        </FadeSection>

        <FadeSection delay={100}>
          <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
            <div>
              <div className="gold-text text-xs tracking-widest uppercase mb-3" style={{ letterSpacing: "0.3em" }}>Presence</div>
              <div className="space-y-1 text-white/50 text-xs">
                <div>UAE · SAUDI ARABIA</div>
                <div>USA · INDIA · UK</div>
              </div>
            </div>
            <div>
              <div className="gold-text text-xs tracking-widest uppercase mb-3" style={{ letterSpacing: "0.3em" }}>Services</div>
              <div className="space-y-1 text-white/50 text-xs">
                <div>Architecture & Design</div>
                <div>Investment Consulting</div>
                <div>Property Management</div>
              </div>
            </div>
            <div>
              <div className="gold-text text-xs tracking-widest uppercase mb-3" style={{ letterSpacing: "0.3em" }}>Connect</div>
              <div className="space-y-1 text-white/50 text-xs">
                <div>info@daralnaseem.com</div>
                <div>+971 50 000 0000</div>
                <div>Dubai, UAE</div>
              </div>
            </div>
          </div>
        </FadeSection>

        <div className="divider-gold mb-8" />
        <div className="text-center text-white/20 text-xs tracking-wider">
          © 2025 Dar Al Naseem (DAN). All rights reserved. Luxury Real Estate · UAE
        </div>
      </div>
    </footer>
  );
}

// ─── Cursor ──────────────────────────────────────────────────────────
function LuxuryCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0, y = 0, fx = 0, fy = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = x + "px";
        cursorRef.current.style.top = y + "px";
      }
    };
    const animate = () => {
      fx += (x - fx) * 0.12;
      fy += (y - fy) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = fx + "px";
        followerRef.current.style.top = fy + "px";
      }
      requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    animate();
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────
export default function Home() {
  return (
    <div style={{ background: "#060d1a" }}>
      <LuxuryCursor />
      <Navbar />
      <HeroSection />
      <CollaboratorsSection />
      <ProjectsSection />
      <CompanySection />
      <OfficeSection />
      <TeamSection />
      <FooterSection />
    </div>
  );
}
