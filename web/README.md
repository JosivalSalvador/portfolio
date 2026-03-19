# Web (Frontend Platform)

Plataforma frontend de alta performance, desenvolvida para entregar uma experiencia de usuario fluida, imersiva e segura. O projeto opera de forma hibrida, combinando Server-Side Rendering (SSR) e Static Site Generation (SSG) para a vitrine publica do portifolio, juntamente com Client-Side Navigation altamente reativa para o Dashboard Administrativo (CMS).

## Stack Tecnologica e Paradigmas

A aplicacao foi construida utilizando o que ha de mais moderno no ecossistema JavaScript, focando rigorosamente em performance, acessibilidade e seguranca em arquitetura.

- Core Framework: Next.js 16 operando sob o padrao App Router e reagindo nativamente com React 19.
- Estilizacao "OLED Stealth": Construida com o motor do Tailwind CSS v4 via PostCSS. A interface utiliza uma paleta de cores estritas de alto contraste (fundo negro absoluto em #050505), paineis em glassmorphism, sombras internas e efeitos de iluminacao direcionada (glow).
- Coreografia Visual: Animacoes de montagem e transicoes de pagina sao inteiramente gerenciadas pelo Framer Motion, centralizadas parametricamente no diretorio `/lib/animations/fade.ts`.
- Componentizacao e Acessibilidade: Primitivos de UI baseados nos fundamentos do Radix UI, encapsulados e estilizados com Tailwind e `clsx`. Iconografia fornecida pelo Lucide React e renderizacao de graficos interativos via Recharts.
- Gerenciamento de Estado Assincrono: A biblioteca `@tanstack/react-query` v5 assume o controle do cache de chamadas HTTP, promovendo a invalidacao inteligente de dados de tela e mutacoes otimistas na interface.
- Validacao e Formularios: Construidos com `react-hook-form` e acoplados nativamente aos Schemas do Zod importados do ecossistema compartilhado da API, garantindo blindagem total e mensagens de erro padronizadas.

## Arquitetura de Rotas e Isolamento (Route Groups)

A arvore de diretorios em `/app` utiliza o conceito de Route Groups para segmentar o contexto e os layouts da aplicacao sem poluir ou afetar a semantica das URLs:

- `/(public)`: Rota de livre acesso e otimizada cirurgicamente para SEO. Contem a pagina inicial, os componentes "Bento Grid", a listagem dinamica de projetos em destaque e o rastreador de visualizacoes de arquiteturas individuais (`/[slug]`).
- `/(admin)`: Rota estruturalmente restrita. Contem o layout mestre do dashboard com a barra de navegacao lateral fixa, analise de graficos, gestao transacional de projetos, controle de acesso de usuarios (RBAC) e o modal interativo de leitura de mensagens.
- `/(auth)`: Fluxo encapsulado de autenticacao, abrigando as interfaces de formulacao de credenciais, login e registro.
- `/(sandbox)`: Ambiente de desenvolvimento completamente isolado, empregado estritamente para teste de renderizacao de componentes fora do escopo de producao.

## Seguranca de Borda (Edge Proxy Middleware)

A aplicacao confia o seu controle de acesso inicial ao arquivo `proxy.ts`, localizado na raiz do frontend. Trata-se de um Edge Middleware poderoso que intercepta de forma assincrona as requisicoes antes que as paginas sequer iniciem a renderizacao:

1. Inspecao de Sessao: Analisa ativamente a validade estrutural dos cookies criptograficos (`auth_session`).
2. Bloqueio Administrativo em Borda: Visitantes sem cookies validos ou com tokens adulterados sao impedidos de prosseguir para as rotas em `/dashboard` e instantaneamente defletidos para `/login`.
3. Controle de Acesso Baseado em Papeis (RBAC): O middleware decodifica localmente a matriz de permissoes do usuario. Caso um membro autenticado com a role de Suporte Tecnico tente manipular enderecos criticos (como a delegacao de cargos em `/dashboard/users`), ele sofrera um redirecionamento imperativo, atuando como uma barreira extra a ocultacao de botoes na interface.

## Padrao de Comunicacao (BFF e Server Actions)

Para a integracao com a API Fastify, o frontend evita a exposicao direta e o uso de chamadas fetch despadronizadas, adotando a orquestracao via Server Actions.

- Client HTTP Padronizado: O utilitario localizado em `/lib/api/http-client.ts` encapsula a logica de rede. Ele extrai e injeta os cookies de autenticacao de forma inteligente, valendo-se do `next/headers` em Server Components, ou lendo nativamente no ambiente do navegador. Ele analisa os status codes do backend e mapeia as respostas faltosas para a tipagem estruturada `HttpError`.
- Orquestracao via Server Actions (`/actions`): Atuam como o Backend-For-Frontend (BFF). As chamadas iniciam de forma reativa a partir do React Query nos Hooks do cliente, acionam as Server Actions em servidor Node e confiam na classe http-client para consolidar as transacoes contra o Fastify, retendo credenciais em ambiente seguro.

## Integracao Continua e Deploy (CI/CD)

O subprojeto Web possui validacoes especificas de pipeline acopladas a esteira do GitHub Actions, prevenindo deploys com falhas de interface ou erros de dependencia de modulo.

### 1. Validacao Pre-Merge (CI Quality & Tests)

Configurada para disparar em PRs contra as branches `dev` e `main`:

- Web Check: Configura a engine do Node 22, realiza o cache da pasta `node_modules` via Lockfile e prossegue com a validacao estatica. O comando `npm run lint` e disparado juntamente ao `npm run type-check`. Em seguida, a suite de componentes no Vitest e chamada, injetando temporariamente a variavel ambiental `SKIP_ENV_VALIDATION=true` para transpor a validacao obrigatoria de variaveis do pacote T3 Env.
- Testes End-to-End Isolados: Sob condicao de sucesso do job anterior, os binarios nativos de Chromium, Webkit e Firefox sao instalados no Runner. O Playwright assume a orquestracao forjando variaveis locais (`.env.prod`) e disparando a infraestrutura global via Docker. As assercoes de navegacao iniciam, e se a UI se comportar de maneira adversa as expectativas, o log HTML da trilha de erros e comprimido e inserido na nuvem como Artifact.

### 2. Entrega Continua de Imagens (CD Build & Publish)

Ao aprovar a fusao de codigo consolidado na branch `main`:

- O Docker Buildx, suplementado com emuladores QEMU, compila a imagem a partir de `web/Dockerfile` assegurando compatibilidade dual-arquitetura (`linux/amd64` e `linux/arm64`).
- Para garantir a conexao com a nuvem correta, o parametro `build-args` intercepta segredos do repositorio (`NEXT_PUBLIC_API_URL` e `API_INTERNAL_URL`), vitais para as requisicoes Server e Client-side no ambiente do Next.js.
- O Docker Hub recebe o push referenciado com o SHA exato do commit e assinalado com a tag estrutural `latest`.

## Testes de Qualidade de Software (QA)

A consistencia da interface e operada por ferramentas divididas entre simulacao comportamental e unidade de codigo:

- Testes de Componentes (Vitest): Focados na logica modular da pasta `/hooks` e metodos da pasta `/lib`. Executam em paralelo com o DOM emulado (`jsdom` e Testing Library). As chamadas web sao contidas e interceptadas na camada de rede pelo `msw` (Mock Service Worker), garantindo determinismo sem depender do backend operante.
- Testes End-to-End (Playwright): Localizados integralmente na pasta `/e2e`. Abrangem macros fluxos essenciais de producao, operando como usuarios interativos clicando em tabelas e preenchendo formularios protegidos, aferindo diretamente os dialogs e modais do CMS.

## Dicionario de Scripts (package.json)

O ambiente do workspace isolado da Web e gerenciado por scripts diretos. Estes comandos podem ser disparados navegando a pasta `/web` via terminal, ou da raiz operados pela flag global.

### Execucao, Build e Compilacao

| Comando              | Descricao e Funcionalidade                                                                                                                                      |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`        | Inicializa o servidor de desenvolvimento do Next.js com o mapeamento e substituicao (Fast Refresh) interativo de modulos ativado.                               |
| `npm run build`      | Processo final. Compila a arvore do Next.js, estabelecendo pre-renderizacao dos arquivos estaticos (SSG) e estruturando o cache para operacoes dinamicas (SSR). |
| `npm run start`      | Submete a execucao em servidor estavel de producao partindo diretamente dos binarios gerados na pasta compilada `.next`.                                        |
| `npm run lint`       | Percorre integralmente o diretorio reestruturando e advertindo as falhas baseadas nas regras do plugin ESLint especifico para React e Hooks.                    |
| `npm run type-check` | Executa o motor diagnostico do compilador TypeScript descartando a transpilacao na maquina, garantindo apenas analise.                                          |

### Testes e Inspecao (Vitest & Playwright)

| Comando                    | Descricao e Funcionalidade                                                                                                                                                |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run test`             | O runner principal. Dispara as definicoes contidas no Vitest mapeando operacoes logicas de funcoes puras.                                                                 |
| `npm run test:watch`       | Mantem um processo zumbi nativo atrelado as rotinas de arquivos. A cada evento de gravacao, reinicia iterativamente os testes.                                            |
| `npm run test:ui`          | Instancia uma interface proprietaria do Vitest no navegador para verificacao estruturada do DOM renderizado nas suites.                                                   |
| `npm run test:e2e`         | Acorda a biblioteca completa do Playwright, emulando os navegadores parametrizados em background (modo Headless) percorrendo todos os caminhos especificos em `.spec.ts`. |
| `npm run test:e2e:ui`      | Ativa as janelas reais do navegador instanciando as acoes frame a frame permitindo controle reverso temporal de cada evento ocorrido.                                     |
| `npm run test:e2e:report`  | Estrutura um console em painel HTML, lendo a ultima estatistica consolidada dos eventos falhos, provendo logs, screenshots isolados e analise visual do trace.            |
| `npm run test:e2e:codegen` | Transfere os eventos clicados num navegador simulado transformando ativamente tais rotinas na tipagem oficial de comandos para um script `.spec.ts`.                      |
