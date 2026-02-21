import { useState, useEffect } from "react";
import { Search, LayoutGrid, LogOut, Lock, Eye } from "lucide-react";
import PlotCard from "@/components/PlotCard";
import { usePlots } from "@/hooks/use-plots";
import { getApiBase } from "@/lib/api";
import approvedLayoutLogo from "@/assets/image.png";

const Admin = () => {
    const { plots, togglePlot } = usePlots();
    const [logoLoaded, setLogoLoaded] = useState(false);
    const [filter, setFilter] = useState<"all" | "available" | "sold" | "hold" | "not-for-sale">("all");
    const [searchId, setSearchId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const apiBase = getApiBase();

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (token) setIsLoggedIn(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setIsLoading(true);

        try {
            const res = await fetch(`${apiBase}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (!res.ok) {
                const data = await res.json();
                setLoginError(data.error || "Login failed.");
                return;
            }

            const { token } = await res.json();
            localStorage.setItem("admin-token", token);
            setIsLoggedIn(true);
            setPassword("");
        } catch {
            setLoginError("Server unreachable. Please check Vercel API + KV configuration.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem("admin-token");
        if (token && apiBase) {
            try {
                await fetch(`${apiBase}/admin/logout`, {
                    method: "POST",
                    headers: { "x-admin-token": token },
                });
            } catch {
                // ignore
            }
        }
        localStorage.removeItem("admin-token");
        setIsLoggedIn(false);
    };

    // Login form
    if (!isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                <Lock className="h-8 w-8 text-primary" />
                            </div>
                            <h1 className="font-display text-2xl font-bold text-foreground">
                                Admin Login
                            </h1>
                            <p className="mt-2 font-body text-sm text-muted-foreground">
                                Enter your password to manage plot availability
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label
                                    htmlFor="admin-password"
                                    className="mb-1.5 block font-body text-sm font-medium text-foreground"
                                >
                                    Password
                                </label>
                                <input
                                    id="admin-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="h-11 w-full rounded-lg border border-input bg-background px-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    autoFocus
                                />
                            </div>

                            {loginError && (
                                <div className="rounded-lg border border-sold/30 bg-sold/10 px-4 py-3 font-body text-sm text-sold">
                                    {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !password}
                                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-body text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4" />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a
                                href="/"
                                className="inline-flex items-center gap-1.5 font-body text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                View public site
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Admin dashboard
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
            {/* Admin Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-12 w-12 items-center justify-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full p-1 shadow-gold ${!logoLoaded ? 'bg-amber-400' : ''}`}>
                                <img
                                    src={approvedLayoutLogo}
                                    alt="Approved Layout"
                                    className="h-8 w-8 rounded-full object-cover"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                        setLogoLoaded(false);
                                    }}
                                    onLoad={() => setLogoLoaded(true)}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-display text-base font-bold leading-tight text-foreground">
                                Admin Panel
                            </span>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                Plot Management
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 font-body text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">View Site</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 rounded-lg bg-sold/10 px-3 py-2 font-body text-xs font-semibold text-sold transition-colors hover:bg-sold/20"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="border-b border-border bg-card/50">
                <div className="container mx-auto flex flex-wrap items-center gap-6 px-4 py-4">
                    <div className="text-center">
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
                        <p className="font-display text-2xl font-extrabold text-foreground">{plots.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-available">Available</p>
                        <p className="font-display text-2xl font-extrabold text-available">{available}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-sold">Sold</p>
                        <p className="font-display text-2xl font-extrabold text-sold">{sold}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-hold">Hold</p>
                        <p className="font-display text-2xl font-extrabold text-hold">{hold}</p>
                    </div>
                    <div className="ml-auto rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
                        <p className="font-body text-xs text-primary">
                            🔄 Live sync — click to cycle: Available → Sold → Hold
                        </p>
                    </div>
                </div>
            </div>

            {/* Plot Grid */}
            <section className="container mx-auto px-4 py-8">
                {/* Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-display text-2xl font-bold text-foreground">
                            <LayoutGrid className="mr-2 inline-block h-6 w-6 text-gold" />
                            Manage Plots
                        </h2>
                        <p className="mt-1 font-body text-sm text-muted-foreground">
                            Click any plot to cycle status • {filtered.length} plots shown
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search plot #"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="h-9 w-32 rounded-lg border border-input bg-background pl-8 pr-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Filters */}
                        {(["all", "available", "sold", "hold", "not-for-sale"] as const).map((f) => {
                            const count = f === "all"
                                ? plots.length
                                : f === "sold"
                                ? sold
                                : f === "hold"
                                ? hold
                                : f === "not-for-sale"
                                ? notForSale
                                : available;
                            return (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 font-body text-xs font-semibold capitalize transition-all ${filter === f
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "border border-border bg-card text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {f === "available" && <span className="h-2 w-2 rounded-full bg-available" />}
                                    {f === "sold" && <span className="h-2 w-2 rounded-full bg-sold" />}
                                    {f === "hold" && <span className="h-2 w-2 rounded-full bg-hold" />}
                                    {f === "not-for-sale" && <span className="h-2 w-2 rounded-full bg-muted" />}
                                    {f} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Grid */}
                <div className="rounded-xl border border-border bg-card/50 p-4">
                    {filtered.length === 0 ? (
                        <p className="py-12 text-center font-body text-sm text-muted-foreground">
                            No plots found matching your criteria.
                        </p>
                    ) : (
                        <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 md:grid-cols-10 lg:grid-cols-13 xl:grid-cols-15">
                            {filtered.map((plot) => (
                                <PlotCard key={plot.id} plot={plot} onToggle={togglePlot} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Admin;
