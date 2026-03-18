"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Terminal, Send } from "lucide-react";
import { staggerContainer, bentoItem, blurFadeIn } from "@/lib/animations/fade";
import { createMessageSchema } from "@/schemas/messages.schema";
import { CreateMessageInput } from "@/types/index";
import { useMessagesMutations } from "@/hooks/use-messages";

// Importando os SEUS componentes do Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ContactSection() {
  const { sendMessage } = useMessagesMutations();

  // Instanciando o form completo para o Shadcn consumir
  const form = useForm<CreateMessageInput>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      content: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: CreateMessageInput) => {
    try {
      await sendMessage.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      id="contato"
      className="bg-background relative z-10 w-full overflow-hidden pt-15 pb-12"
    >
      {/* Grid de fundo conectando com o Footer */}
      <div className="bg-grid-white pointer-events-none absolute inset-0 z-0 mask-[linear-gradient(to_bottom,black,transparent)] opacity-10" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24"
        >
          {/* Lado Esquerdo: Identidade do Sistema */}
          <div className="flex max-w-xl flex-col items-start">
            <motion.div
              variants={blurFadeIn}
              className="mb-8 flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-green-400 uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              [ STATUS: ONLINE_AND_READY ]
            </motion.div>

            <motion.div variants={blurFadeIn}>
              <h2 className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Estabeleça{" "}
                <span className="text-muted-foreground">conexão.</span>
              </h2>
            </motion.div>

            <motion.div variants={blurFadeIn}>
              <p className="text-muted-foreground font-mono text-base leading-relaxed opacity-80">
                &gt; Execute o protocolo de contato preenchendo os parâmetros ao
                lado.
                <br />
                &gt; Validação estrita via Zod (Front) + Fastify (Back).
                <br />
                &gt; Resposta direta na sua thread principal (e-mail) em &lt;
                24h.
              </p>
            </motion.div>
          </div>

          {/* Lado Direito: O Formulário "Terminal Window" */}
          <motion.div
            variants={bentoItem}
            className="group/window relative w-full"
          >
            <div
              className="from-border/40 absolute -inset-1 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] to-transparent opacity-50 blur-2xl transition-opacity duration-700 group-hover/window:opacity-100"
              aria-hidden="true"
            />

            <div className="glass-panel glow-border relative flex flex-col overflow-hidden rounded-2xl bg-[#050505] shadow-2xl">
              {/* Header da Janela */}
              <div className="border-border/50 flex items-center justify-between border-b bg-[#0a0a0a] px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase">
                  <Terminal className="h-3 w-3" />
                  ~/contact/send.sh
                </div>
                <div className="w-12" />
              </div>

              {/* Corpo do Formulário usando o Shadcn <Form> */}
              <div className="p-6 sm:p-8">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Campo Nome */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1.5">
                            <FormLabel className="text-muted-foreground font-mono text-[10px] uppercase">
                              const <span className="text-blue-400">name</span>:{" "}
                              <span className="text-yellow-400">string</span>{" "}
                              <span className="text-red-500/70">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isSubmitting}
                                placeholder="'Seu Nome'"
                                className="border-border/50 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30 h-11 rounded-lg bg-[#0a0a0a] font-mono text-sm focus-visible:ring-1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px] text-red-400" />
                          </FormItem>
                        )}
                      />

                      {/* Campo Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-1.5">
                            <FormLabel className="text-muted-foreground font-mono text-[10px] uppercase">
                              const <span className="text-blue-400">email</span>
                              : <span className="text-yellow-400">string</span>{" "}
                              <span className="text-red-500/70">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                disabled={isSubmitting}
                                placeholder="'seu@email.com'"
                                className="border-border/50 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30 h-11 rounded-lg bg-[#0a0a0a] font-mono text-sm focus-visible:ring-1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-mono text-[10px] text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Campo Assunto */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1.5">
                          <FormLabel className="text-muted-foreground font-mono text-[10px] uppercase">
                            const <span className="text-blue-400">subject</span>
                            ?: <span className="text-yellow-400">string</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isSubmitting}
                              placeholder="'Assunto da mensagem...'"
                              className="border-border/50 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30 h-11 rounded-lg bg-[#0a0a0a] font-mono text-sm focus-visible:ring-1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px] text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Campo Mensagem */}
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-1.5">
                          <FormLabel className="text-muted-foreground font-mono text-[10px] uppercase">
                            const <span className="text-blue-400">message</span>
                            : <span className="text-yellow-400">string</span>{" "}
                            <span className="text-red-500/70">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              disabled={isSubmitting}
                              placeholder="'Descreva a oportunidade ou projeto...'"
                              className="border-border/50 focus-visible:ring-primary/50 placeholder:text-muted-foreground/30 resize-none rounded-lg bg-[#0a0a0a] p-4 font-mono text-sm focus-visible:ring-1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="font-mono text-[10px] text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Botão Executar (Agora o Hover funciona e brilha!) */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="group bg-foreground text-background hover:border-border/50 hover:bg-foreground relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-transparent px-4 font-mono text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(250,250,250,0.15)] active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                    >
                      {/* Brilho interno que passa correndo (Estilo Vercel/Linear) */}
                      <div className="absolute inset-0 flex h-full w-full transform-[skew(-12deg)_translateX(-100%)] justify-center group-hover:transform-[skew(-12deg)_translateX(100%)] group-hover:duration-1000">
                        <div className="relative h-full w-8 bg-white/20" />
                      </div>

                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="relative z-10">EXECUTANDO...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">$ SEND_PAYLOAD</span>
                          <Send className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
