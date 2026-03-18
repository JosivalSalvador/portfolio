"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Se quiser usar a transição do seu arquivo fade.ts, basta importar:
// import { baseTransition } from "@/lib/animations/fade";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Visão Geral", href: "/" },
    { name: "Projetos", href: "/projetos" },
  ];

  return (
    <header className="pointer-events-none fixed top-0 z-50 w-full px-6 py-4 md:px-12 md:py-6">
      <div className="pointer-events-auto relative mx-auto flex max-w-7xl flex-col">
        {/* Barra Principal */}
        <div className="glass-panel relative z-20 flex h-14 w-full items-center justify-between rounded-lg px-6">
          {/* Logo / Nome */}
          <Link href="/" className="group flex items-center gap-3">
            <Terminal className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
            <span className="text-foreground flex items-center font-mono text-xs font-bold tracking-widest uppercase">
              Josival
              {/* O blink animado nativamente pelo Framer Motion (zero lag no React) */}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="text-muted-foreground ml-px"
              >
                _
              </motion.span>
            </span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  // Adicionado hover:bg-white/5 para criar um bloco de destaque tátil ao passar o mouse
                  className={`hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:bg-white/5 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="bg-border h-4 w-px" />

            {/* Botão de Login com borda real e contraste no hover para o glow-border funcionar */}
            <Link
              href="/login"
              className="glow-border border-border/50 bg-secondary/50 text-secondary-foreground flex items-center justify-center rounded-md border px-4 py-1.5 font-mono text-xs tracking-widest transition-all hover:bg-white/10 hover:shadow-md"
            >
              SYS.LOGIN
            </Link>
          </nav>

          {/* Botão Hambúrguer Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Alternar menu mobile"
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel absolute top-full left-0 z-10 mt-2 w-full overflow-hidden rounded-lg shadow-xl md:hidden"
            >
              <nav className="flex flex-col gap-2 px-4 py-4">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      // Mantido o fundo com opacidade para os itens do menu mobile não sumirem
                      className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-foreground bg-white/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-foreground text-background mt-2 flex items-center justify-center rounded-md px-4 py-3 font-mono text-xs font-bold uppercase shadow-sm transition-transform active:scale-95"
                >
                  System Login
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
