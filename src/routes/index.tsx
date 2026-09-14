import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Trilha do Sabor — Acesso" },
      { name: "description", content: "Acesso seguro ao sistema Trilha do Sabor." },
      { property: "og:title", content: "Trilha do Sabor — Acesso" },
      { property: "og:description", content: "Acesso seguro ao sistema Trilha do Sabor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
