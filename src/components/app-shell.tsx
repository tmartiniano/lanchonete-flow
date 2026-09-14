import { Link } from "@tanstack/react-router";
import { LogIn, Menu, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link
      to="/"
      className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
      >
        P
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold">Ponto de Apoio</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
          Painel de gestão
        </span>
      </span>
    </Link>
  );
}

function Navigation({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav aria-label="Áreas do sistema">
      <ul className="flex flex-col gap-0.5">
        {navigationItems.map(({ label, to, number, icon: Icon }) => {
          const link = (
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "text-foreground/75 hover:bg-foreground/5 data-[status=active]:bg-primary/15 data-[status=active]:font-medium data-[status=active]:text-primary-ink",
              )}
            >
              <span aria-hidden="true" className="font-mono text-[10px] text-muted-foreground">
                {number}
              </span>
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          );
          return <li key={to}>{mobile ? <SheetClose asChild>{link}</SheetClose> : link}</li>;
        })}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="min-h-11 min-w-11 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-surface p-4">
              <SheetHeader className="text-left">
                <SheetTitle>Ponto de Apoio</SheetTitle>
                <SheetDescription>Navegação principal</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <Navigation mobile />
              </div>
            </SheetContent>
          </Sheet>
          <Brand />
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Input
                aria-label="Buscar"
                placeholder="Buscar no sistema…"
                className="w-56 bg-background pr-9 lg:w-72"
                disabled
              />
              <Search
                aria-hidden="true"
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
            <Button asChild variant="outline" size="sm" className="min-h-11 min-w-11">
              <Link to="/login" aria-label="Entrar">
                <LogIn aria-hidden="true" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[236px_1fr]">
        <aside
          aria-label="Navegação principal"
          className="sticky top-14 hidden h-[calc(100vh-3.5rem)] flex-col border-r border-border bg-surface/50 p-3 lg:flex"
        >
          <Navigation />
          <div className="mt-auto rounded-md border border-border bg-background/50 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Fase 1 · Fundação
            </p>
            <p className="mt-1 text-xs text-foreground/70">
              Estrutura pronta. Os dados entram nas próximas fases.
            </p>
          </div>
        </aside>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
