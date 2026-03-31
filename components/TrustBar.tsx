import { ShieldCheck, Truck, RotateCcw, Brain } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "Medical-Grade Silicone" },
  { icon: Truck, text: "Discreet Shipping" },
  { icon: RotateCcw, text: "30-Day Return" },
  { icon: Brain, text: "AI Personality Engine" },
];

export default function TrustBar() {
  const row = [...items, ...items];
  return (
    <section className="border-y border-black/10 py-4">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 px-4">
          {row.map((item, idx) => (
            <div key={`${item.text}-${idx}`} className="group flex items-center gap-2 text-sm text-charcoal/80">
              <item.icon className="h-4 w-4 text-charcoal/45 transition group-hover:text-burnishedGold" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
