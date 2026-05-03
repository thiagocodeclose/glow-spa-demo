// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { siteData } from '@/lib/site-data';

const css = `
  :root {
    --gl-bg: #0A0A12;
    --gl-surface: #12121F;
    --gl-card: #181825;
    --gl-primary: #7B5EA7;
    --gl-primary-light: #9B82C3;
    --gl-accent: #B09FD4;
    --gl-gold: #C9A96E;
    --gl-text: #F0EEF8;
    --gl-muted: rgba(240,238,248,0.55);
    --gl-border: rgba(176,159,212,0.12);
    --font-display: var(--font-cormorant), 'Cormorant Garamond', serif;
    --font-body: var(--font-inter), 'Inter', sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--gl-bg); color: var(--gl-text); overflow-x: hidden; }

  /* ─── NAV ─── */
  .gl-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem; height: 70px;
    transition: background 0.5s, box-shadow 0.5s;
  }
  .gl-nav.scrolled {
    background: rgba(10,10,18,0.95);
    box-shadow: 0 1px 28px rgba(123,94,167,0.15);
    backdrop-filter: blur(16px);
  }
  .gl-nav-logo {
    font-family: var(--font-display);
    font-size: 1.6rem; font-weight: 300;
    color: var(--gl-text); text-decoration: none;
    letter-spacing: 0.05em;
  }
  .gl-nav-logo span { color: var(--gl-accent); font-style: italic; }
  .gl-nav-links { display: flex; gap: 2rem; align-items: center; }
  .gl-nav-links a {
    font-size: 0.8rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    color: rgba(240,238,248,0.7); text-decoration: none; transition: color 0.2s;
  }
  .gl-nav-links a:hover { color: var(--gl-accent); }
  .gl-btn-nav {
    border: 1px solid var(--gl-accent);
    color: var(--gl-accent);
    padding: 0.5rem 1.4rem; border-radius: 2px;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; transition: background 0.2s, color 0.2s;
  }
  .gl-btn-nav:hover { background: var(--gl-accent); color: var(--gl-bg); }

  /* ─── CINEMATIC VIDEO HERO ─── */
  .gl-video-hero {
    position: relative;
    height: 68vh;
    min-height: 520px;
    overflow: hidden;
  }
  .gl-video-hero video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .gl-video-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10,10,18,0.1) 0%,
      rgba(10,10,18,0.25) 50%,
      rgba(10,10,18,0.92) 100%
    );
  }
  .gl-video-center {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    text-align: center;
  }
  .gl-video-wordmark {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 9vw, 8rem);
    font-weight: 300; font-style: italic;
    color: rgba(240,238,248,0.92);
    letter-spacing: 0.06em;
    text-shadow: 0 2px 40px rgba(123,94,167,0.35);
    pointer-events: none;
    user-select: none;
  }

  /* ─── HERO CONTENT (below video, on dark bg) ─── */
  .gl-hero-content {
    background: var(--gl-bg);
    padding: 4rem 2rem 5rem;
    text-align: center;
    position: relative;
  }
  .gl-hero-content::before {
    content: '';
    position: absolute; top: -80px; left: 0; right: 0; height: 80px;
    background: linear-gradient(to bottom, transparent, var(--gl-bg));
    pointer-events: none;
  }
  .gl-hero-content-inner { max-width: 720px; margin: 0 auto; }
  .gl-hero-tag {
    display: inline-block;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gl-gold);
    margin-bottom: 1.5rem;
  }
  .gl-hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 4.5vw, 4.2rem);
    font-weight: 300; line-height: 1.15;
    color: var(--gl-text); margin-bottom: 1.25rem;
    letter-spacing: 0.01em;
  }
  .gl-hero-title em { font-style: italic; color: var(--gl-accent); }
  .gl-hero-sub { font-size: 1.05rem; line-height: 1.8; color: var(--gl-muted); margin-bottom: 2.75rem; }
  .gl-hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .gl-btn-primary {
    background: var(--gl-primary); color: #fff;
    padding: 0.9rem 2.25rem; border-radius: 2px;
    font-weight: 600; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; transition: background 0.2s, transform 0.2s;
  }
  .gl-btn-primary:hover { background: var(--gl-primary-light); transform: translateY(-2px); }
  .gl-btn-outline {
    border: 1px solid rgba(176,159,212,0.4); color: var(--gl-accent);
    padding: 0.9rem 2.25rem; border-radius: 2px;
    font-weight: 600; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; transition: border-color 0.2s, background 0.2s;
  }
  .gl-btn-outline:hover { border-color: var(--gl-accent); background: rgba(176,159,212,0.08); }

  /* ─── STATS STRIP ─── */
  .gl-stats-strip { background: var(--gl-surface); padding: 2.5rem 2rem; }
  .gl-stats-inner {
    max-width: 800px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;
  }
  .gl-stat-value {
    font-family: var(--font-display);
    font-size: 2.4rem; font-weight: 300;
    color: var(--gl-accent); margin-bottom: 0.3rem;
  }
  .gl-stat-label { font-size: 0.72rem; color: var(--gl-muted); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }

  /* ─── SECTIONS ─── */
  section { padding: 6rem 2rem; }
  .gl-section-tag {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--gl-gold); margin-bottom: 0.75rem; display: inline-block;
  }
  .gl-section-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 3.5vw, 3.2rem);
    font-weight: 300; line-height: 1.15;
    color: var(--gl-text); margin-bottom: 1rem; letter-spacing: 0.01em;
  }
  .gl-section-title em { font-style: italic; color: var(--gl-accent); }
  .gl-section-sub { font-size: 1rem; line-height: 1.8; color: var(--gl-muted); max-width: 540px; }

  /* ─── SERVICES ─── */
  .gl-services-section { background: var(--gl-bg); }
  .gl-services-inner { max-width: 1200px; margin: 0 auto; }
  .gl-services-header { margin-bottom: 3.5rem; }
  .gl-services-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px;
    background: var(--gl-border);
    border: 1px solid var(--gl-border);
    border-radius: 12px; overflow: hidden;
  }
  .gl-service-cell {
    background: var(--gl-card);
    padding: 2.5rem 2rem;
    transition: background 0.25s;
  }
  .gl-service-cell:hover { background: var(--gl-surface); }
  .gl-service-icon { font-size: 1.6rem; margin-bottom: 0.75rem; }
  .gl-service-cat {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gl-accent); margin-bottom: 0.5rem;
  }
  .gl-service-name {
    font-family: var(--font-display);
    font-size: 1.25rem; font-weight: 400;
    color: var(--gl-text); margin-bottom: 0.35rem;
  }
  .gl-service-dur { font-size: 0.8rem; color: var(--gl-muted); margin-bottom: 0.85rem; }
  .gl-service-desc { font-size: 0.9rem; line-height: 1.7; color: var(--gl-muted); }

  /* ─── RITUALS ─── */
  .gl-rituals-section { background: var(--gl-surface); }
  .gl-rituals-inner { max-width: 1100px; margin: 0 auto; }
  .gl-rituals-header { text-align: center; margin-bottom: 3.5rem; }
  .gl-rituals-header .gl-section-sub { margin: 0 auto; }
  .gl-rituals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .gl-ritual-card {
    background: var(--gl-card);
    border: 1px solid var(--gl-border);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    position: relative;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .gl-ritual-card:hover { box-shadow: 0 16px 48px rgba(123,94,167,0.15); transform: translateY(-4px); }
  .gl-ritual-name {
    font-family: var(--font-display);
    font-size: 1.45rem; font-weight: 400; font-style: italic;
    color: var(--gl-text); margin-bottom: 0.4rem;
  }
  .gl-ritual-includes {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--gl-accent); margin-bottom: 0.5rem;
  }
  .gl-ritual-dur { font-size: 0.85rem; color: var(--gl-muted); margin-bottom: 1rem; }
  .gl-ritual-desc { font-size: 0.92rem; line-height: 1.72; color: var(--gl-muted); margin-bottom: 1.75rem; }
  .gl-ritual-price {
    font-family: var(--font-display);
    font-size: 2rem; color: var(--gl-gold); display: block; margin-bottom: 1.25rem;
  }
  .gl-ritual-cta {
    display: block; text-align: center;
    border: 1px solid rgba(176,159,212,0.25); color: var(--gl-accent);
    padding: 0.75rem; border-radius: 2px;
    font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; transition: background 0.2s, border-color 0.2s;
  }
  .gl-ritual-cta:hover { background: rgba(176,159,212,0.1); border-color: var(--gl-accent); }

  /* ─── PRICING ─── */
  .gl-pricing-section { background: var(--gl-bg); }
  .gl-pricing-inner { max-width: 1100px; margin: 0 auto; }
  .gl-pricing-header { text-align: center; margin-bottom: 3.5rem; }
  .gl-pricing-header .gl-section-sub { margin: 0 auto; }
  .gl-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
  .gl-price-card {
    background: var(--gl-card);
    border: 1px solid var(--gl-border);
    border-radius: 12px;
    padding: 2.5rem 2rem;
    position: relative;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .gl-price-card.highlight { border-color: var(--gl-primary); }
  .gl-price-card:hover { box-shadow: 0 16px 48px rgba(123,94,167,0.14); transform: translateY(-4px); }
  .gl-popular-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--gl-primary); color: #fff;
    font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.25rem 1rem; border-radius: 20px;
  }
  .gl-price-name {
    font-family: var(--font-display);
    font-size: 1.2rem; font-weight: 400; color: var(--gl-text); margin-bottom: 1rem;
  }
  .gl-price-amount {
    font-family: var(--font-display);
    font-size: 2.6rem; color: var(--gl-accent); line-height: 1; margin-bottom: 0.25rem;
  }
  .gl-price-period { font-size: 0.85rem; color: var(--gl-muted); margin-bottom: 1.75rem; }
  .gl-price-features { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
  .gl-price-features li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.9rem; color: var(--gl-muted); line-height: 1.5; }
  .gl-check { color: var(--gl-primary-light); font-weight: 700; flex-shrink: 0; }
  .gl-price-cta {
    display: block; text-align: center;
    padding: 0.85rem; border-radius: 2px;
    font-weight: 600; font-size: 0.82rem; letter-spacing: 0.08em; text-transform: uppercase;
    text-decoration: none; transition: all 0.2s;
  }
  .gl-price-card.highlight .gl-price-cta { background: var(--gl-primary); color: #fff; }
  .gl-price-card.highlight .gl-price-cta:hover { background: var(--gl-primary-light); }
  .gl-price-card:not(.highlight) .gl-price-cta { border: 1px solid rgba(176,159,212,0.25); color: var(--gl-accent); }
  .gl-price-card:not(.highlight) .gl-price-cta:hover { background: rgba(176,159,212,0.08); border-color: var(--gl-accent); }

  /* ─── CTA ─── */
  .gl-cta-section {
    background: var(--gl-surface);
    padding: 6rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .gl-cta-section::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(123,94,167,0.12) 0%, transparent 100%);
    pointer-events: none;
  }
  .gl-cta-inner { max-width: 560px; margin: 0 auto; position: relative; }
  .gl-cta-eyebrow {
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gl-gold); margin-bottom: 1.25rem;
  }
  .gl-cta-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 4vw, 3.6rem);
    font-weight: 300; color: var(--gl-text);
    line-height: 1.15; margin-bottom: 1rem;
  }
  .gl-cta-title em { font-style: italic; color: var(--gl-accent); }
  .gl-cta-sub { font-size: 1rem; color: var(--gl-muted); margin-bottom: 2.5rem; line-height: 1.75; }
  .gl-btn-cta {
    background: var(--gl-primary); color: #fff;
    padding: 1rem 2.75rem; border-radius: 2px;
    font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;
    text-decoration: none; display: inline-block;
    transition: background 0.2s, transform 0.2s;
  }
  .gl-btn-cta:hover { background: var(--gl-primary-light); transform: translateY(-2px); }

  /* ─── FOOTER ─── */
  .gl-footer { background: #060610; padding: 4rem 2rem 2rem; }
  .gl-footer-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem;
  }
  .gl-footer-logo { font-family: var(--font-display); font-size: 1.5rem; font-weight: 300; color: var(--gl-accent); margin-bottom: 0.75rem; font-style: italic; }
  .gl-footer-desc { font-size: 0.9rem; line-height: 1.6; color: var(--gl-muted); max-width: 280px; }
  .gl-footer-h { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(240,238,248,0.3); margin-bottom: 1rem; }
  .gl-footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.65rem; }
  .gl-footer-links a { color: var(--gl-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
  .gl-footer-links a:hover { color: var(--gl-accent); }
  .gl-footer-bottom {
    max-width: 1200px; margin: 2.5rem auto 0;
    padding-top: 2rem; border-top: 1px solid rgba(176,159,212,0.08);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.78rem; color: var(--gl-muted); flex-wrap: wrap; gap: 0.5rem;
  }
  .gl-footer-brand { color: var(--gl-accent); text-decoration: none; font-weight: 600; }

  /* ─── REVEAL ─── */
  .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  @media (max-width: 900px) {
    .gl-services-grid { grid-template-columns: 1fr; }
    .gl-rituals-grid { grid-template-columns: 1fr; }
    .gl-pricing-grid { grid-template-columns: 1fr; }
    .gl-stats-inner { grid-template-columns: repeat(2, 1fr); }
    .gl-footer-inner { grid-template-columns: 1fr; }
    .gl-nav-links { display: none; }
  }
`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { threshold: 0.10 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function GlowPage() {
  const [scrolled, setScrolled] = useState(false);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <nav className={`gl-nav${scrolled ? ' scrolled' : ''}`}>
        <a href="#" className="gl-nav-logo">Glow <span>Wellness</span></a>
        <div className="gl-nav-links">
          <a href="#services">Services</a>
          <a href="#rituals">Rituals</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#book" className="gl-btn-nav">Book Now</a>
        </div>
      </nav>

      {/* CINEMATIC VIDEO HERO — full-bleed video, no text on top */}
      <div className="gl-video-hero">
        <video autoPlay muted loop playsInline
          poster="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1800&q=80"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-woman-meditating-in-a-studio-with-candles-around-her-22756-large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="gl-video-overlay" />
        <div className="gl-video-center">
          <div className="gl-video-wordmark">Glow</div>
        </div>
      </div>

      {/* HERO CONTENT — below video on dark bg */}
      <div className="gl-hero-content">
        <div className="gl-hero-content-inner">
          <div className="gl-hero-tag reveal">Recovery · Float · Holistic Spa · Portland, OR</div>
          <h1 data-cg-el="hero_headline_1" className="gl-hero-title reveal">
            Come in <em>stressed.</em><br />Leave <em>restored.</em>
          </h1>
          <p data-cg-el="hero_subtitle" className="gl-hero-sub reveal">
            Portland&apos;s most intentional recovery studio. We offer float therapy, infrared sauna, cryotherapy, massage, and curated multi-modality rituals — all under one roof.
          </p>
          <div className="gl-hero-actions reveal">
            <a data-cg-el="hero_cta_primary" href="#book" className="gl-btn-primary">Book a Session</a>
            <a data-cg-el="hero_cta_secondary" href="#rituals" className="gl-btn-outline">Explore Rituals</a>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="gl-stats-strip">
        <div className="gl-stats-inner">
          {siteData.stats.map((s, i) => (
            <div key={s.label} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="gl-stat-value">{s.value}</div>
              <div className="gl-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="gl-services-section">
        <div className="gl-services-inner">
          <div className="gl-services-header reveal">
            <span className="gl-section-tag">Recovery Modalities</span>
            <h2 className="gl-section-title">What we <em>offer</em></h2>
            <p className="gl-section-sub">
              Each modality is powerful on its own. Combined intentionally, they create a cumulative effect that clients describe as transformative.
            </p>
          </div>
          <div className="gl-services-grid">
            {siteData.services.map((s, i) => (
              <div key={s.title} className="gl-service-cell reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="gl-service-icon">{s.icon}</div>
                <div className="gl-service-cat">{s.category}</div>
                <div className="gl-service-name">{s.title}</div>
                <div className="gl-service-dur">{s.duration}</div>
                <p className="gl-service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RITUALS */}
      <section id="rituals" className="gl-rituals-section">
        <div className="gl-rituals-inner">
          <div className="gl-rituals-header reveal">
            <span className="gl-section-tag">Curated Experiences</span>
            <h2 className="gl-section-title">Glow <em>Rituals</em></h2>
            <p className="gl-section-sub">
              Pre-designed multi-modality sequences, sequenced for maximum effect. Reserve a private suite for 2–4 hours of guided restoration.
            </p>
          </div>
          <div className="gl-rituals-grid">
            {siteData.rituals.map((r, i) => (
              <div key={r.name} className="gl-ritual-card reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="gl-ritual-name">{r.name}</div>
                <div className="gl-ritual-includes">{r.includes}</div>
                <div className="gl-ritual-dur">{r.duration}</div>
                <p className="gl-ritual-desc">{r.desc}</p>
                <span className="gl-ritual-price">{r.price}</span>
                <a href="#book" className="gl-ritual-cta">Reserve This Ritual</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="gl-pricing-section">
        <div className="gl-pricing-inner">
          <div className="gl-pricing-header reveal">
            <span className="gl-section-tag">Membership & Booking</span>
            <h2 className="gl-section-title">Choose your <em>path</em></h2>
            <p className="gl-section-sub">
              Book a single service, become a monthly member, or commit to a ritual experience. There&apos;s an entry point for wherever you are.
            </p>
          </div>
          <div className="gl-pricing-grid">
            {siteData.pricing.map((p, i) => (
              <div key={p.name} className={`gl-price-card reveal${p.highlight ? ' highlight' : ''}`} style={{ transitionDelay: `${i * 100}ms` }}>
                {p.highlight && <span className="gl-popular-badge">Best Value</span>}
                <div className="gl-price-name">{p.name}</div>
                <div className="gl-price-amount">{p.price}</div>
                <div className="gl-price-period">{p.period}</div>
                <ul className="gl-price-features">
                  {p.features.map((f) => (
                    <li key={f}><span className="gl-check">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="#book" className="gl-price-cta">Get Started</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" className="gl-cta-section">
        <div className="gl-cta-inner">
          <div className="gl-cta-eyebrow reveal">Begin Your Recovery Practice</div>
          <h2 className="gl-cta-title reveal">Your first float is <em>on us.</em></h2>
          <p className="gl-cta-sub reveal">
            Book any service at full price and receive a complimentary 60-minute float on your second visit. No catch — just our way of saying welcome.
          </p>
          <a href="#pricing" className="gl-btn-cta reveal">Book Your First Session</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="gl-footer">
        <div className="gl-footer-inner">
          <div>
            <div className="gl-footer-logo">Glow Wellness</div>
            <p className="gl-footer-desc">
              {siteData.gym.address}<br />
              {siteData.gym.phone}<br />
              {siteData.gym.email}
            </p>
          </div>
          <div>
            <div className="gl-footer-h">Studio</div>
            <ul className="gl-footer-links">
              <li><a href="#services">Services</a></li>
              <li><a href="#rituals">Rituals</a></li>
              <li><a href="#pricing">Membership</a></li>
              <li><a href="#">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <div className="gl-footer-h">Help</div>
            <ul className="gl-footer-links">
              <li><a href="#">New Visitors</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contraindications</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="gl-footer-bottom">
          <span>© {new Date().getFullYear()} Glow Wellness. All rights reserved.</span>
          <span>Powered by <a href="https://koriva.com" className="gl-footer-brand">Koriva</a></span>
        </div>
      </footer>
    </>
  );
}
