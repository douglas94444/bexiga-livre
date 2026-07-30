import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bexiga-livre-offer-ends";
const DURATION_MS = 15 * 60 * 1000;

function getOfferEndsAt() {
  if (typeof window === "undefined") return Date.now() + DURATION_MS;

  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    const parsed = Number(existing);
    if (!Number.isNaN(parsed) && parsed > Date.now()) return parsed;
  }

  const ends = Date.now() + DURATION_MS;
  sessionStorage.setItem(STORAGE_KEY, String(ends));
  return ends;
}

function formatParts(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function CountdownTimer({
  className,
  digitClassName,
}: {
  className?: string;
  digitClassName?: string;
}) {
  const [remaining, setRemaining] = useState(DURATION_MS);

  useEffect(() => {
    let endsAt = getOfferEndsAt();

    const tick = () => {
      const left = endsAt - Date.now();
      if (left <= 0) {
        endsAt = Date.now() + DURATION_MS;
        sessionStorage.setItem(STORAGE_KEY, String(endsAt));
        setRemaining(DURATION_MS);
        return;
      }
      setRemaining(left);
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  const { minutes, seconds } = formatParts(remaining);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold tabular-nums tracking-tight",
        className,
      )}
      aria-live="polite"
      aria-label={`${minutes} minutos e ${seconds} segundos restantes`}
    >
      <span className={cn("rounded-md bg-foreground/10 px-1.5 py-0.5", digitClassName)}>
        {minutes}
      </span>
      <span aria-hidden="true">:</span>
      <span className={cn("rounded-md bg-foreground/10 px-1.5 py-0.5", digitClassName)}>
        {seconds}
      </span>
    </span>
  );
}

export function UrgencyBar({ label = "Esta condição especial encerra em" }: { label?: string }) {
  return (
    <div className="bg-foreground px-4 py-2.5 text-center text-sm text-background sm:text-base">
      <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span>{label}</span>
        <CountdownTimer digitClassName="bg-background/15 text-background" />
      </p>
    </div>
  );
}
