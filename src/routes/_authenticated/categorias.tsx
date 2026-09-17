import { createFileRoute } from "@tanstack/react-router";
import { Boxes } from "lucide-react";
import { EmptySectionPage } from "@/components/empty-section-page";
export const Route = createFileRoute("/_authenticated/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — Trilha do Sabor" },
      { name: "description", content: "Organização das categorias do cardápio." },
      { property: "og:title", content: "Categorias — Trilha do Sabor" },
      { property: "og:description", content: "Organização das categorias do cardápio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <EmptySectionPage
      title="Categorias"
      description="A organização do cardápio por categorias será configurada nesta área."
      icon={Boxes}
      phase="Fase 4"
    />
  ),
});
