import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";
import { EmptySectionPage } from "@/components/empty-section-page";
export const Route = createFileRoute("/_authenticated/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — Trilha do Sabor" },
      { name: "description", content: "Área de produtos da lanchonete." },
      { property: "og:title", content: "Produtos — Trilha do Sabor" },
      { property: "og:description", content: "Área de produtos da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <EmptySectionPage
      title="Produtos"
      description="O cardápio, preços, disponibilidade e imagens serão administrados nesta área."
      icon={PackageOpen}
      phase="Fase 4"
    />
  ),
});
