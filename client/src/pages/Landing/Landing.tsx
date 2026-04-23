import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

/* ─── rotating subtitle texts ─── */
const subtitles = [
  "Manage rooms, services, and student life effortlessly",
  "A modern hostel experience powered by technology",
  "Smart living starts with HostelHub",
];

/* ─── portal card data ─── */
const portals = [
  {
    role: "admin",
    title: "Admin Portal",
    desc: "Full control over hostel operations, reports & analytics",
    route: "/login/admin",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
  },
  {
    role: "student",
    title: "Student Portal",
    desc: "Room bookings, complaints, fee payments & more",
    route: "/login/student",
    image:
      "https://i.pinimg.com/1200x/d8/a9/7d/d8a97dcdf2b252f18b51c844aed7b413.jpg",
  },
  {
    role: "staff",
    title: "Staff Portal",
    desc: "Task management, cleaning schedules & room assignments",
    route: "/login/staff",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
  },
];

/* ─── feature highlights (SVG icons) ─── */
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#567C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Smart Room Allocation",
    desc: "Automated room assignments with real-time occupancy tracking.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#567C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Complaint Management",
    desc: "Track, resolve, and manage student complaints seamlessly.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#567C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    title: "Fee & Payment System",
    desc: "Multiple payment methods with instant status updates.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#567C8D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: "Reports & Analytics",
    desc: "Generate occupancy, fee, and complaint reports on-demand.",
  },
];

/* ────────────────────────────────────────────── hook: fade-in on scroll ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ═══════════════════════════════════════════════════ LANDING COMPONENT ═══ */
const Landing = () => {
  const navigate = useNavigate();

  /* rotating subtitle */
  const [textIdx, setTextIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTextIdx((p) => (p + 1) % subtitles.length);
        setFade(true);
      }, 400);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  /* scroll-down handler */
  const scrollToPortals = useCallback(() => {
    document
      .getElementById("portals")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* section observers */
  const portalView = useInView(0.12);
  const aboutView = useInView(0.15);
  const featureView = useInView(0.1);

  return (
    <div className="landing-page">
      {/* ─────────────── HERO ─────────────── */}
      <section className="hero-section" id="hero">
        <div className="hero-content">
          <h1 className="hero-title">HostelHub</h1>
          <p className={`hero-subtitle ${fade ? "fade-in" : "fade-out"}`}>
            {subtitles[textIdx]}
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={scrollToPortals}>
              Get Started
            </button>
            <button
              className="btn-outline"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </button>
          </div>
        </div>

        <button
          className="scroll-indicator"
          onClick={scrollToPortals}
          aria-label="Scroll down"
        >
          <span className="scroll-arrow" />
        </button>
      </section>

      {/* ─────────────── PORTALS ─────────────── */}
      <section
        className={`portals-section ${portalView.visible ? "in-view" : ""}`}
        id="portals"
        ref={portalView.ref}
      >
        <div className="section-header">
          <span className="section-label">Choose Your Role</span>
          <h2 className="section-title">Access Your Portal</h2>
          <p className="section-desc">
            Select your role to access the features designed specifically for
            you.
          </p>
        </div>

        <div className="portal-grid">
          {portals.map((p, i) => (
            <div
              key={p.role}
              className="portal-card"
              style={{ animationDelay: `${i * 0.15}s` }}
              onClick={() => navigate(p.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(p.route)}
            >
              <img
                src={p.image}
                alt={p.title}
                className="portal-card-bg"
                loading="lazy"
              />
              <div className="portal-card-overlay" />
              <div className="portal-card-content">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="portal-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── ABOUT ─────────────── */}
      <section
        className={`about-section ${aboutView.visible ? "in-view" : ""}`}
        id="about"
        ref={aboutView.ref}
      >
        <div className="about-grid">
          <div className="about-text">
            <span className="section-label">About HostelHub</span>
            <h2 className="section-title">
              Modernizing Hostel Administration
            </h2>
            <p className="about-desc">
              HostelHub is a comprehensive, web-based hostel management
              platform that digitizes every aspect of hostel operations — from
              room allocation and complaint tracking to fee management and
              cleaning schedules.
            </p>
            <p className="about-desc">
              Built with a scalable, modular architecture, it empowers admins
              with real-time dashboards, gives students a seamless portal for
              their needs, and equips staff with efficient task management
              tools.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Role Portals</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Core Modules</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Accessibility</span>
              </div>
            </div>
          </div>

          <div className="about-image">
            <img
              src="https://i.pinimg.com/1200x/43/89/d9/4389d9cafb94ec23e64940aa252240fd.jpg"
              alt="HostelHub platform illustration"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section
        className={`features-section ${featureView.visible ? "in-view" : ""}`}
        id="features"
        ref={featureView.ref}
      >
        <div className="section-header">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-desc">
            Everything you need to run a modern hostel — in one platform.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────── FOOTER ─────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>HostelHub</h3>
            <p>Smart Hostel Management System</p>
          </div>

          <div className="footer-links">
            <button onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}>
              Home
            </button>
            <button onClick={() => document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })}>
              Portals
            </button>
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>
              About
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              Features
            </button>
          </div>

          <div className="footer-contact">
            <p>📧 support@hostelhub.com</p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
