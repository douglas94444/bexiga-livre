import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const CHECKOUT_URL = "/checkout";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  children,
  className,
  tone = "white",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "muted" | "tint";
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-20 sm:px-8 sm:py-28",
        tone === "muted" && "bg-muted",
        tone === "tint" && "bg-brand-tint",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionTitle({
  children,
  align = "center",
}: {
  children: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <h2
      className={cn(
        "text-balance text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.75rem]",
        align === "center" && "text-center",
      )}
    >
      {children}
    </h2>
  );
}

export function SectionLead({
  children,
  align = "center",
}: {
  children: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <p
      className={cn(
        "mt-5 text-lg leading-relaxed text-muted-foreground sm:text-[1.375rem]",
        align === "center" && "mx-auto max-w-2xl text-center",
      )}
    >
      {children}
    </p>
  );
}

const ctaClassName =
  "inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-brand px-8 text-base font-semibold tracking-tight text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.49_0.089_181/0.55)] transition-colors duration-200 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto sm:text-lg";

export function CtaButton({
  children,
  className,
  href = CHECKOUT_URL,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = cn(ctaClassName, className);
  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}