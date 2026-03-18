export default function ProjectDetailsLoading() {
  return (
    <div className="flex w-full animate-pulse flex-col pt-16 pb-32 md:pt-24">
      {/* Header Area */}
      <div className="relative w-full">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12">
          {/* Top bar (Botão voltar + Status) */}
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="bg-muted/40 h-4 w-24 rounded-md" />
            <div className="bg-muted/30 h-8 w-64 rounded-md" />
          </div>

          {/* Título e Descrição */}
          <div className="mb-10 space-y-5">
            <div className="bg-muted/40 h-14 w-3/4 rounded-lg md:w-1/2" />
            <div className="bg-muted/20 h-5 w-full rounded-md md:w-3/4" />
            <div className="bg-muted/20 h-5 w-2/3 rounded-md md:w-1/2" />
          </div>

          {/* Tags e Botões de Ação */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted/30 h-7 w-20 rounded-md" />
              ))}
            </div>

            <div className="border-border/40 flex flex-col justify-between gap-6 border-t pt-6 md:flex-row md:items-center">
              <div className="flex gap-4">
                <div className="bg-muted/30 h-4 w-32 rounded-md" />
                <div className="bg-muted/30 h-4 w-32 rounded-md" />
              </div>
              <div className="flex gap-3">
                <div className="bg-muted/40 h-10 w-36 rounded-md" />
                <div className="bg-muted/40 h-10 w-36 rounded-md" />
              </div>
            </div>
          </div>

          {/* Skeleton da Imagem de Capa (Janela Mockup) */}
          <div className="border-border/60 bg-muted/10 mt-12 aspect-4/3 w-full rounded-xl border md:aspect-video" />
        </div>
      </div>

      {/* Área do Diagrama e do Markdown */}
      <div className="container mx-auto mt-16 px-6 md:mt-24 lg:px-12">
        {/* Skeleton do Diagrama de Arquitetura */}
        <div className="border-border/60 bg-muted/10 mb-16 h-48 w-full rounded-xl border md:h-64" />

        {/* Skeleton do Texto (Markdown) */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-6">
          <div className="w-full space-y-3">
            <div className="bg-muted/40 mb-6 h-8 w-1/3 rounded-md" />
            <div className="bg-muted/20 h-4 w-full rounded-md" />
            <div className="bg-muted/20 h-4 w-full rounded-md" />
            <div className="bg-muted/20 h-4 w-5/6 rounded-md" />
          </div>

          <div className="bg-muted/10 border-border/40 mt-8 h-40 w-full rounded-xl border" />
        </div>
      </div>
    </div>
  );
}
