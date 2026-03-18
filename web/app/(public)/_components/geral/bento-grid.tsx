"use client";

import { motion } from "framer-motion";
import { staggerContainer, slideUp } from "@/lib/animations/fade";
import { BentoFrontend } from "./bento-frontend";
import { BentoBackend } from "./bento-backend";
import { BentoInfra } from "./bento-infra";
import { BentoDataCore } from "./bento-data-core";

export function TechBentoGrid() {
  return (
    <section className="bg-background relative w-full py-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Cabeçalho da Seção */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={slideUp}
          className="mb-12 flex flex-col items-start"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A fundação dos meus{" "}
            <span className="text-muted-foreground">sistemas.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base">
            O ecossistema que utilizo para garantir aplicações escaláveis. Do
            frontend refinado à análise de dados e arquitetura de baixo nível.
          </p>
        </motion.div>

        {/* O Grid Bento */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid auto-rows-[minmax(300px,auto)] grid-cols-1 gap-4 md:grid-cols-5 md:gap-6"
        >
          {/* Linha 1 */}
          <div className="md:col-span-2">
            <BentoFrontend />
          </div>
          <div className="md:col-span-3">
            <BentoBackend />
          </div>

          {/* Linha 2 */}
          <div className="md:col-span-3">
            <BentoDataCore />
          </div>
          <div className="md:col-span-2">
            <BentoInfra />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
