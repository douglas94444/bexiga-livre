import { createFileRoute, redirect } from "@tanstack/react-router";

/** Mantém /v2 como alias da home */
export const Route = createFileRoute("/v2")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
