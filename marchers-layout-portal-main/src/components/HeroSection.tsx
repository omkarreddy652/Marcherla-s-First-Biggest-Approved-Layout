import { MapPin, Shield, Award, Phone } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  total: number;
  sold: number;
  available: number;
  hold: number;
}

const HeroSection = ({ total, sold, available, hold }: HeroSectionProps) => {
  const soldPercent = Math.round((sold / total) * 100);
  const availPercent = Math.round((available / total) * 100);
  const holdPercent = Math.round((hold / total) * 100);

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Aerial view of layout" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/90 via-emerald-deep/80 to-emerald-deep/95" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 lg:py-28">
        {/* Badge */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="h-px w-10 bg-gold/60" />
          <Shield className="h-4 w-4 text-gold" />
          <span className="font-body text-xs font-bold uppercase tracking-[0.25em] text-gold">
            DTCP Approved Layout
          </span>
          <Shield className="h-4 w-4 text-gold" />
          <div className="h-px w-10 bg-gold/60" />
        </div>

        {/* Title */}
        <h1 className="text-center font-display text-4xl font-extrabold leading-[1.1] text-primary-foreground md:text-5xl lg:text-6xl">
          Marcherla's First
          <br />
          <span className="text-gradient-gold">Biggest Approved</span>
          <br />
          Layout
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-center font-body text-base text-primary-foreground/60">
          Premium residential plots with modern amenities and excellent connectivity in the heart of Marcherla.
        </p>

        {/* Live Stats Cards */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 px-6 py-5 text-center backdrop-blur-md">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">Total Plots</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-primary-foreground">{total}</p>
          </div>
          <div className="rounded-xl border border-available/30 bg-available/10 px-6 py-5 text-center backdrop-blur-md">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-available">Available</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-available">{available}</p>
            <div className="mx-auto mt-2 h-1 w-16 overflow-hidden rounded-full bg-primary-foreground/10">
              <div className="h-full rounded-full bg-available transition-all duration-700" style={{ width: `${availPercent}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-sold/30 bg-sold/10 px-6 py-5 text-center backdrop-blur-md">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-sold">Sold Out</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-sold">{sold}</p>
            <div className="mx-auto mt-2 h-1 w-16 overflow-hidden rounded-full bg-primary-foreground/10">
              <div className="h-full rounded-full bg-sold transition-all duration-700" style={{ width: `${soldPercent}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-hold/30 bg-hold/10 px-6 py-5 text-center backdrop-blur-md">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-hold">On Hold</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-hold">{hold}</p>
            <div className="mx-auto mt-2 h-1 w-16 overflow-hidden rounded-full bg-primary-foreground/10">
              <div className="h-full rounded-full bg-hold transition-all duration-700" style={{ width: `${holdPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Info pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.google.com/maps?q=16.4788110,79.4185560&z=16"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-4 py-2 hover:shadow-md transition-shadow"
          >
            <MapPin className="h-3.5 w-3.5 text-gold" />
            <span className="font-body text-xs font-medium text-primary-foreground/80">Marcherla, AP</span>
          </a>
          <div className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-4 py-2">
            <Award className="h-3.5 w-3.5 text-gold" />
            <span className="font-body text-xs font-medium text-primary-foreground/80">183 Premium Plots</span>
          </div>
          <a href="tel:+917675063336" className="flex items-center gap-1.5 rounded-full gradient-gold px-4 py-2 shadow-gold transition-transform hover:scale-105">
            <Phone className="h-3.5 w-3.5 text-accent-foreground" />
            <span className="font-body text-xs font-bold text-accent-foreground">Contact Us</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
