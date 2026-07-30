import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function StickyPricingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const pricing = document.getElementById("precos");

    const onScroll = () => {
      const scrolled =
        window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      let pricingVisible = false;
      if (pricing) {
        const rect = pricing.getBoundingClientRect();
        pricingVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 80;
      }
      setShow(scrolled >= 0.25 && !pricingVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-20px_oklch(0.32_0.06_155/0.35)] backdrop-blur-md transition-transform duration-300 md:hidden",
        show ? "translate-y-0" : "translate-y-full pointer-events-none",
      )}
      aria-hidden={!show}
    >
      <a
        href="#precos"
        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 text-base font-semibold text-primary-foreground"
      >
        Ver protocolos e preços
      </a>
    </div>
  );
}
