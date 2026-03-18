import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex w-full flex-col">
      {/* Skeleton do Hero Section */}
      <section className="border-border/10 relative w-full border-b py-24 md:py-32 lg:py-40">
        <div className="container mx-auto flex flex-col items-center gap-6 px-6 text-center lg:px-12">
          <Skeleton className="bg-muted/20 h-8 w-48 rounded-full" />
          <Skeleton className="bg-muted/20 h-16 w-full max-w-3xl rounded-xl" />
          <Skeleton className="bg-muted/20 mt-4 h-6 w-full max-w-xl rounded-md" />

          <div className="mt-8 flex gap-4">
            <Skeleton className="bg-muted/20 h-12 w-40 rounded-lg" />
            <Skeleton className="bg-muted/20 h-12 w-40 rounded-lg" />
          </div>

          {/* Skeleton do Terminal simulado no Hero */}
          <Skeleton className="bg-muted/10 border-border/30 mt-16 h-64 w-full max-w-4xl rounded-xl border" />
        </div>
      </section>

      {/* Skeleton do Marquee */}
      <section className="border-border/40 flex h-16 w-full items-center gap-8 overflow-hidden border-b bg-[#050505] px-12">
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            className="bg-muted/20 h-6 w-32 shrink-0 rounded-md"
          />
        ))}
      </section>

      {/* Skeleton do Bento Grid */}
      <section className="container mx-auto px-6 py-24 lg:px-12">
        <div className="mb-12 flex flex-col gap-4">
          <Skeleton className="bg-muted/20 h-10 w-64 rounded-lg" />
          <Skeleton className="bg-muted/20 h-6 w-96 rounded-md" />
        </div>
        <div className="grid auto-rows-[minmax(300px,auto)] grid-cols-1 gap-4 md:grid-cols-5 md:gap-6">
          <Skeleton className="bg-muted/10 border-border/30 rounded-2xl border md:col-span-2" />
          <Skeleton className="bg-muted/10 border-border/30 rounded-2xl border md:col-span-3" />
          <Skeleton className="bg-muted/10 border-border/30 h-48 rounded-2xl border md:col-span-5" />
        </div>
      </section>

      {/* Skeleton dos Projetos */}
      <section className="border-border/10 container mx-auto border-t px-6 py-24 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div className="flex flex-col gap-4">
            <Skeleton className="bg-muted/20 h-10 w-72 rounded-lg" />
            <Skeleton className="bg-muted/20 h-6 w-96 rounded-md" />
          </div>
          <Skeleton className="bg-muted/20 hidden h-6 w-32 rounded-md md:block" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="bg-muted/10 border-border/30 h-87.5 rounded-2xl border" />
          <Skeleton className="bg-muted/10 border-border/30 h-87.5 rounded-2xl border" />
        </div>
      </section>
    </div>
  );
}
