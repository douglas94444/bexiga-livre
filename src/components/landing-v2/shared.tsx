import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export function V2Section({
  id,
  children,
  className,
  tone = "white",
  reveal = true,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "muted" | "tint" | "dark";
  reveal?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-12 sm:px-8 sm:py-16",
        tone === "muted" && "bg-muted",
        tone === "tint" && "bg-brand-tint",
        tone === "dark" && "bg-brand text-primary-foreground",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-5xl">
        {reveal ? <V2Reveal>{children}</V2Reveal> : children}
      </div>
    </section>
  );
}

function V2Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

export function V2Title({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-balance text-center text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.02em] text-brand sm:text-[2.4rem]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function V2Accent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("text-star", className)}>{children}</span>;
}

export function V2Lead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mx-auto mt-4 max-w-xl text-center text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function V2Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-border/70 bg-card shadow-[0_16px_40px_-28px_oklch(0.32_0.06_155/0.35)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function V2Cta({
  children,
  onClick,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 text-base font-semibold tracking-[-0.01em] text-primary-foreground shadow-[0_14px_32px_-16px_oklch(0.32_0.06_155/0.55)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_18px_36px_-16px_oklch(0.32_0.06_155/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 sm:w-auto sm:text-lg",
        className,
      )}
    >
      {children}
    </button>
  );
}
