"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Loader2, BarChart3, TrendingUp } from "lucide-react";
import { blurFadeIn } from "@/lib/animations/fade";
import { useProjectsList } from "@/hooks/use-projects";

export function OverviewChart() {
  const { data, isLoading } = useProjectsList();

  // Pegamos os projetos e mapeamos para o formato que o Recharts entende
  // Pegamos apenas os 6 projetos mais visualizados para o gráfico não ficar esmagado
  const chartData = (data?.projects || [])
    .map((project) => ({
      name: project.title,
      Visualizações: project.views || 0,
    }))
    .sort((a, b) => b.Visualizações - a.Visualizações)
    .slice(0, 6);

  return (
    <motion.div
      variants={blurFadeIn}
      initial="hidden"
      animate="visible"
      className="glass-panel glow-border border-border/50 bg-card flex h-full flex-col rounded-2xl border p-7 shadow-xl"
    >
      <div className="border-border/30 mb-8 flex items-center justify-between border-b pb-5">
        <h3 className="text-foreground text-xl font-bold tracking-tight">
          Tráfego de Módulos
        </h3>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
            Views
          </span>
        </div>
      </div>

      <div className="min-h-75 w-full flex-1">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center opacity-60">
            <Loader2 className="text-muted-foreground mb-4 h-8 w-8 animate-spin" />
            <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
              Renderizando Gráfico...
            </span>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              {/* Malha de fundo pontilhada bem sutil */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />

              <XAxis
                dataKey="name"
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value.length > 12 ? `${value.substring(0, 12)}...` : value
                }
              />
              <YAxis
                stroke="#525252"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />

              {/* Tooltip customizado para combinar com o tema escuro */}
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  borderColor: "rgba(38,38,38,0.5)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
                itemStyle={{
                  color: "#10b981",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
                labelStyle={{
                  color: "#a3a3a3",
                  marginBottom: "4px",
                  fontSize: "12px",
                }}
              />

              {/* A Barra do Gráfico com a cor esmeralda do sistema */}
              <Bar
                dataKey="Visualizações"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center opacity-50">
            <BarChart3 className="text-muted-foreground mb-3 h-8 w-8 opacity-50" />
            <span className="text-muted-foreground font-mono text-sm">
              Sem dados para plotar.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
