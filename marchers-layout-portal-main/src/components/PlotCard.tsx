import { Plot, PlotStatus } from "@/data/plots";
import { Check, X, Pause } from "lucide-react";

interface PlotCardProps {
  plot: Plot;
  onToggle?: (id: number) => void;
}

const statusConfig: Record<PlotStatus, { bg: string; border: string; badge: string; text: string; icon: typeof Check; label: string }> = {
  available: {
    bg: "border-available/50 bg-available/8 hover:border-available/70 hover:shadow-md",
    border: "",
    badge: "bg-available text-available-foreground",
    text: "Open",
    icon: Check,
    label: "Available",
  },
  sold: {
    bg: "border-sold/50 bg-sold/8 hover:border-sold/70 hover:shadow-md",
    border: "",
    badge: "bg-sold text-sold-foreground",
    text: "Sold",
    icon: X,
    label: "Sold Out",
  },
  hold: {
    bg: "border-hold/50 bg-hold/8 hover:border-hold/70 hover:shadow-md",
    border: "",
    badge: "bg-hold text-hold-foreground",
    text: "Hold",
    icon: Pause,
    label: "On Hold",
  },
  "not-for-sale": {
    bg: "border-muted/50 bg-muted/8 hover:border-muted/70 hover:shadow-md",
    border: "",
    badge: "bg-muted text-muted-foreground",
    text: "N/A",
    icon: X,
    label: "Not For Sale",
  },
};

const PlotCard = ({ plot, onToggle }: PlotCardProps) => {
  const isInteractive = !!onToggle;
  const config = statusConfig[plot.status];
  const Icon = config.icon;

  return (
    <button
      onClick={isInteractive ? () => onToggle(plot.id) : undefined}
      title={`Plot ${plot.id} — ${config.label}`}
      className={`group relative flex flex-col items-center justify-center rounded-lg border-2 p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ${isInteractive ? "cursor-pointer" : "cursor-default"
        } ${config.bg}`}
    >
      {/* Plot number */}
      <span className="font-display text-sm font-bold text-foreground/90">
        {plot.id}
      </span>

      {/* Status icon + label */}
      <div className={`mt-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 ${config.badge}`}>
        <Icon className="h-2.5 w-2.5" strokeWidth={3} />
        <span className="text-[9px] font-bold uppercase tracking-wider">
          {config.text}
        </span>
      </div>
    </button>
  );
};

export default PlotCard;
