import { Heart, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MentalHealthBanner() {
  return (
    <Card className="border-accent/30 bg-accent/5 p-4">
      <div className="flex items-start gap-3">
        <Heart className="h-5 w-5 text-accent mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">Need support right now?</p>
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <a href="tel:131114" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-3 w-3" />
              <span>Lifeline: <strong className="text-foreground">13 11 14</strong></span>
            </a>
            <a href="tel:1300789978" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-3 w-3" />
              <span>MensLine Australia: <strong className="text-foreground">1300 78 99 78</strong></span>
            </a>
            <a href="tel:1800737732" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-3 w-3" />
              <span>1800Respect: <strong className="text-foreground">1800 737 732</strong></span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
