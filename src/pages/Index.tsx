import { useState } from "react";
import { Search, LayoutGrid, Phone, Mail, MapPin, Lock } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import PlotCard from "@/components/PlotCard";
import { usePlots } from "@/hooks/use-plots";
import approvedLayoutLogo from "@/assets/image.png";

const Index = () => {
  const { plots } = usePlots();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "available" | "sold" | "hold" | "not-for-sale">("all");
  const [searchId, setSearchId] = useState("");

  const sold = plots.filter((p) => p.status === "sold").length;
  const hold = plots.filter((p) => p.status === "hold").length;
  const available = plots.filter((p) => p.status === "available").length;
  const notForSale = plots.filter((p) => p.status === "not-for-sale").length;

  const filtered = plots
    .filter((p) => {
      if (filter === "sold") return p.status === "sold";
      if (filter === "available") return p.status === "available";
      if (filter === "hold") return p.status === "hold";
      if (filter === "not-for-sale") return p.status === "not-for-sale";
      return true;
    })
    .filter((p) => {
      if (!searchId.trim()) return true;
      return p.id.toString().includes(searchId.trim());
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo Section */}
            <div className="flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
              <div className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full p-1 shadow-gold sm:h-20 sm:w-20 ${!logoLoaded ? 'bg-amber-400' : ''}`}>
                <img
                  src={approvedLayoutLogo}
                  alt="Approved Layout Logo"
                  className="h-16 w-16 rounded-full object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    setLogoLoaded(false);
                  }}
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            </div>
            <div>
              <span className="font-display text-base font-bold leading-tight text-foreground block">
                Macherla Layouts
              </span>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                LP No. 1022/0001/LP/MACHRL/2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-muted"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </a>
            <a
              href="tel:+919866606806"
              className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Enquire Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero with stats */}
      <HeroSection total={plots.length} sold={sold} available={available} hold={hold} />

      {/* Plot Grid Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              <LayoutGrid className="mr-2 inline-block h-6 w-6 text-amber-500" />
              Plot Availability Map
            </h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Showing {filtered.length} plots in the township
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Plot #"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="h-10 w-28 rounded-xl border border-input bg-background pl-9 pr-3 font-body text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>

            {/* Status Filter Buttons */}
            {(["all", "available", "sold", "hold"] as const).map((f) => {
              const count = f === "all" ? plots.length : f === "sold" ? sold : f === "hold" ? hold : available;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
                    filter === f
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {f === "available" && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  {f === "sold" && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                  {f === "hold" && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                  {f} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Legend */}
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/50 p-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status Legend</span>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">Available</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-lg border border-rose-100">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-rose-700">Sold Out</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-lg border border-amber-100">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-bold text-amber-700">On Hold</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="rounded-2xl border border-border bg-card/30 p-6 shadow-sm">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-body text-sm text-muted-foreground">No plots found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12">
              {filtered.map((plot) => (
                <PlotCard key={plot.id} plot={plot} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 pb-20 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-center text-primary-foreground shadow-2xl">
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-bold">Secure Your Future Today</h2>
            <p className="mt-3 font-body opacity-90">
              Visit our site office or call our representatives to book your preferred plot in Marcherla's biggest approved layout.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="tel:+917675063336"
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-primary transition-transform hover:scale-105"
              >
                <Phone className="h-5 w-5" />
                +91 98666 06806
              </a>
              <a
                href="mailto:manojpammi9515@gmail.com"
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 font-bold backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Mail className="h-5 w-5" />
                Email Sales
              </a>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl font-bold text-amber-500">Karthika Township</h3>
              <div className="mt-2 flex items-center justify-center gap-2 text-slate-400 md:justify-start">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Marcherla, Andhra Pradesh</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 md:items-end">
              <p className="text-xs font-medium text-slate-500">
                © 2026 Marcherla Layouts. All rights reserved.
              </p>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <span>DTCP Approved</span>
                <span>•</span>
                <span>Municipality Layout</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
