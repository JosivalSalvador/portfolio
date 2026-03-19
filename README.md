# Portfolio & Admin System - Monorepo

Sistema full-stack escalavel, resiliente e de alta performance, estruturado sob a arquitetura de Monorepo. Este projeto consolida uma plataforma publica otimizada para motores de busca (SEO) e um painel de administracao interno governado por controle de acesso baseado em papeis (RBAC).

## Arquitetura de Monorepo (Turborepo & NPM Workspaces)

O repositorio utiliza NPM Workspaces (npm v11) em conjunto com o Turborepo para gerenciar multiplos pacotes de forma centralizada.

* Gestao de Dependencias (Hoisting): O arquivo `package-lock.json` e o diretorio `node_modules` principal ficam na raiz do projeto. Isso compartilha dependencias em comum, reduzindo o espaco em disco e acelerando a instalacao.
* Orquestracao e Paralelismo: O Turborepo (via `turbo.json`) compreende o grafo de dependencias do projeto. Comandos como `build`, `lint` e `test` sao executados simultaneamente nos pacotes, maximizando o uso da CPU.
* Sistema de Cache: O Turborepo armazena o resultado de compilacoes e execucoes na pasta `.turbo`. Se nao houver alteracao no codigo de um workspace, o processo de build ou teste e ignorado e o resultado do cache e retornado instantaneamente.

A base de codigo esta segmentada em dois pacotes principais:
* /web: Aplicacao Frontend Server-Side Rendered (Next.js 16, React 19, Tailwind CSS v4, Framer Motion, React Query).
* /server: API Backend RESTful (Fastify v5, Prisma ORM, Zod, PostgreSQL, Autenticacao JWT).

## Infraestrutura e Docker

O projeto garante paridade de ambientes e isolamento de servicos utilizando Docker e Docker Compose. A raiz do repositorio dispoe de dois fluxos de orquestracao:

### Ambiente de Desenvolvimento (docker-compose.dev.yml)
Criado exclusivamente para o ciclo de desenvolvimento local.
* Inicializa apenas o servico do banco de dados PostgreSQL.
* Mapeia volumes locais para garantir a persistencia dos dados do banco entre as execucoes.
* Permite que os servidores Node.js (`web` e `server`) rodem nativamente no terminal do desenvolvedor, facilitando o hot-reload e a depuracao.

### Ambiente de Producao (docker-compose.yml)
Configuracao baseada no padrao de Infraestrutura Imutavel para o deploy final. Orquestra a subida de tres servicos interconectados em uma rede fechada:
1. Database: Instancia do PostgreSQL.
2. Server: Constroi a imagem a partir de `server/Dockerfile`, empacotando o codigo Node.js da API.
3. Web: Constroi a imagem a partir de `web/Dockerfile`, empacotando a aplicacao Next.js com as variaveis de ambiente injetadas em tempo de build.

## Documentacao da API (/docs)

O workspace do backend possui integracao nativa com os padroes OpenAPI. Utilizando os modulos `@fastify/swagger` e `@scalar/fastify-api-reference`, a API gera automaticamente uma documentacao visual e interativa.
Ao rodar a aplicacao localmente, a rota `/docs` fica acessivel no servidor do Fastify, permitindo que os desenvolvedores consultem os contratos de dados (Schemas do Zod), testem endpoints REST e validem fluxos de autenticacao JWT diretamente pelo navegador.

## Continuous Integration & Continuous Deployment (CI/CD)

O projeto possui um pipeline completo e robusto configurado via GitHub Actions (.github/workflows), dividido em duas esteiras principais que garantem a qualidade do codigo e a entrega continua das imagens Docker.

### 1. CI (Quality & Tests) - Executado em PRs e Pushes para a branch `dev`
Esta esteira atua como um portao de seguranca para integracao de novo codigo. Ela e composta por cinco jobs paralelos e sequenciais:

* server-check: Sobe um banco PostgreSQL temporario em memoria (tmpfs) para maxima velocidade. Instala as dependencias a partir da raiz, gera o Prisma Client e roda as analises de Lint, Type Check e a suite de testes unitarios/integracao (Vitest).
* web-check: Realiza a validacao estatica (Lint e Type Check) e os testes isolados do frontend, contornando bloqueios de variaveis de producao.
* e2e-tests: Depende do sucesso dos checks anteriores. Configura o ambiente, instala as dependencias de sistema e navegadores do Playwright (Chromium, Firefox, Webkit), forja dinamicamente os arquivos `.env.prod`, levanta a infraestrutura completa e executa os testes de interface End-to-End. Em caso de falha, faz upload de um relatorio visual como artefato (HTML/Traces) para inspecao.
* docker-build-check: Verifica precocemente se os Dockerfiles de producao compilam sem erros, evitando surpresas na esteira de deploy.
* auto-pr: Um job inteligente que utiliza o GitHub CLI para abrir automaticamente um Pull Request da branch `dev` para a `main` assim que todas as metricas de qualidade, testes e builds passarem com sucesso.

### 2. CD (Build & Publish) - Executado em Pushes para a branch `main`
Engatilhada automaticamente apos o merge do codigo estavel na branch principal. Responsavel pela geracao multiplataforma e publicacao das imagens.

* Utiliza Docker Buildx e QEMU para compilar as imagens garantindo compatibilidade com arquiteturas `linux/amd64` e `linux/arm64`.
* Aproveita o cache nativo do GitHub Actions (`type=gha`) para otimizar o tempo de build em execucoes subsequentes.
* Faz autenticacao segura no Docker Hub e realiza o push das imagens `portifolio-api` e `portifolio-web`.
* Adiciona tags duplas nas imagens: a tag `latest` para a versao mais recente e uma tag imutavel utilizando o SHA do commit do Git, garantindo rastreabilidade exata do codigo em producao.

## Git Hooks (Pre-commit)

Alem do CI em nuvem, o projeto aplica seguranca localmente via `.husky/`.
O arquivo `pre-commit` aciona a biblioteca `lint-staged`, que aplica uma esteira de validacoes nos arquivos em stage:
1. O ESLint verifica e corrige automaticamente falhas sintaticas e anti-padroes.
2. O Prettier formata a indentacao e estrutura dos arquivos.
3. O compilador do TypeScript roda a verificacao de tipagem estrita (`tsc --noEmit`).
Se qualquer etapa falhar, o commit e cancelado imediatamente.

## Guia de Inicializacao Local

Siga as instrucoes abaixo para clonar, configurar e rodar o monorepo no seu ambiente de desenvolvimento.

### 1. Pre-requisitos
* Node.js (v20 ou superior)
* Docker e Docker Compose
* Git

### 2. Instalacao de Dependencias
A partir da raiz, instale os pacotes. O NPM resolvera todas as dependencias de forma unificada.

```bash
git clone https://github.com/JosivalSalvador/portfolio.git
cd portifolio
npm install
```

### 3. Variaveis de Ambiente (.env)
* Workspace Backend (`/server`): Crie um arquivo `.env` para dev e um `.env.test` para os testes locais. Configure a `DATABASE_URL` e o `JWT_SECRET`.
* Workspace Frontend (`/web`): Crie um arquivo `.env.local` contendo a rota da API (ex: `NEXT_PUBLIC_API_URL=http://localhost:3333`).

### 4. Inicializacao da Infraestrutura Local
Suba o banco de dados PostgreSQL utilizando o docker-compose de desenvolvimento:

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 5. Setup do Banco de Dados e ORM
Ainda na raiz do projeto, aplique as migracoes no banco e o seed inicial (cria o administrador root):

```bash
npm run db:migrate
npm run db:seed
```

### 6. Execucao dos Servidores
Inicie os processos de desenvolvimento simultaneamente atraves do Turborepo:

```bash
npm run dev
```

* Aplicacao Frontend: `http://localhost:3000`
* Servidor da API: `http://localhost:3333`
* Documentacao da API: `http://localhost:3333/docs`

## Dicionario de Scripts Globais (package.json)

O arquivo `package.json` raiz centraliza a operacao do sistema. Abaixo esta a listagem de todos os comandos configurados.

### Execucao, Build e Validacao
| Comando | Descricao |
| :--- | :--- |
| `npm run dev` | Inicia o modo de desenvolvimento assistido (hot-reload) para os pacotes `web` e `server` em paralelo. |
| `npm run dev:web` | Inicia exclusivamente o processo de desenvolvimento do pacote `web`. |
| `npm run dev:server` | Inicia exclusivamente o processo de desenvolvimento do pacote `server`. |
| `npm run build` | Executa o build otimizado para producao de todos os workspaces utilizando cache. |
| `npm run lint` | Aplica as regras estaticas do ESLint em toda a arvore do monorepo. |
| `npm run type-check` | Executa a varredura do TypeScript garantindo a sanidade de tipos da aplicacao. |

### Operacoes de Banco de Dados (Prisma)
Comandos com prefixo `db:` direcionam suas rotinas automaticamente para o workspace `server`.
| Comando | Descricao |
| :--- | :--- |
| `npm run db:gen` | Gera a tipagem nativa do Prisma Client apos atualizacoes no `schema.prisma`. |
| `npm run db:migrate` | Roda as migracoes de estrutura SQL pendentes contra o banco de desenvolvimento. |
| `npm run db:studio` | Levanta o painel grafico Prisma Studio na porta 5555 para manipulacao manual de dados. |
| `npm run db:seed` | Roda a rotina de populacao de dados iniciais. |
| `npm run db:deploy` | Comando para pipelines de producao, aplica migracoes de forma segura no servidor. |
| `npm run db:reset` | Recria o banco de dados completamente (Drop) e reaplica migracoes, descartando o seed. |
| `npm run db:format` | Auto-formata a sintaxe interna do arquivo `schema.prisma`. |

### Operacoes de Teste (QA)
| Comando | Descricao |
| :--- | :--- |
| `npm run test` | Roda toda a suite unitaria e de integracao do Vitest simultaneamente no backend e frontend. |
| `npm run test:e2e` | Aciona o framework Playwright para simular as operacoes E2E em modo silencioso. |
| `npm run test:e2e:ui` | Abre a aplicacao de auditoria visual do Playwright para depuracao interativa. |
| `npm run test:e2e:report` | Inicializa um servidor web local apresentando metricas de cobertura e logs do ultimo teste E2E. |
| `npm run test:e2e:codegen`| Inicializa o inspecionador do Playwright para geracao de codigo automatica baseada em interacoes no browser. |