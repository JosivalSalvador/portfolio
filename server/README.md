# Server (Backend API)

API RESTful de alta performance, projetada sob os pilares de escalabilidade extrema, baixa latencia e seguranca rigida. Construida para ser o motor de dados do ecossistema, esta API gerencia o portifolio de projetos, processamento de mensagens publicas, sessoes criptograficas e controle hierarquico de permissoes (RBAC).

## Stack Tecnologica e Fundamentos

A arquitetura do backend foi escolhida a dedo para garantir o menor overhead possivel de execucao, validacao ponta a ponta e seguranca por padrao.

* Core Framework: Fastify v5 (focado em altissima taxa de requests por segundo).
* Seguranca de Borda e Headers: 
  * `@fastify/helmet`: Padronizacao e protecao avancada de headers HTTP.
  * `@fastify/cors`: Controle estrito de origens permitidas (Cross-Origin).
  * `@fastify/rate-limit`: Prevencao ativa contra ataques de forca bruta e DDoS.
* Banco de Dados e ORM: PostgreSQL gerenciado de ponta a ponta pelo Prisma v7, acoplado ao adaptador nativo de performance `@prisma/adapter-pg`.
* Validacao e Tipagem de Dados (I/O): Zod v4 integrado nativamente a esteira de rotas utilizando o `fastify-type-provider-zod`. Nenhum dado entra ou sai da API sem passar por contratos estritos de validacao.
* Autenticacao e Sessao: Sistema de JWT assimetrico (Refresh Tokens de longa duracao e Access Tokens de vida curta) gerenciado por `@fastify/jwt` e extraido de forma segura atraves de `@fastify/cookie`. Senhas protegidas com `bcryptjs`.
* Documentacao Viva: Integracao do `@fastify/swagger` para especificacao OpenAPI e `@scalar/fastify-api-reference` para renderizacao de uma interface visual moderna.
* Qualidade e QA: Suite de testes densa criada com Vitest, operando em conjunto com Supertest para validar fluxos HTTP E2E nativos da API.

## Arquitetura Orientada a Dominios (Domain-Driven Design)

O sistema foge de padroes monoliticos desorganizados e adota uma arquitetura baseada em Resources (Dominios), garantindo alta coesao e isolamento total de responsabilidades. A arvore em `/src` obedece a seguinte divisao:

### 1. Inicializacao e Configuracao (Core)
* `server.ts`: Ponto de entrada exclusivo da aplicacao (entrypoint). Inicia o listener na porta definida pelas variaveis de ambiente.
* `app.ts`: Fabrica e configura a instancia do Fastify. Registra os plugins globais (CORS, JWT, Swagger, Rate Limit) e embute o Error Handler customizado.
* `lib/prisma.ts`: Exporta um Singleton estrito da conexao do Prisma, garantindo o reaproveitamento do pool de conexoes em todo o ciclo de vida do servidor.
* `lib/error-handler.ts` e `errors/app-error.ts`: Padronizacao global de excecoes. Captura erros desconhecidos ou validacoes falhas do Zod/Prisma e os converte em respostas HTTP JSON estruturadas, seguras e inofensivas.

### 2. Middlewares de Seguranca
Localizados na pasta `/middlewares`, atuam como interceptadores isolados e agnosticos:
* `verify-jwt.ts`: Extrai, decodifica e valida a assinatura criptografica do Access Token. Em caso de adulteracao ou expiracao, bloqueia a requisicao antes de tocar nos controllers.
* `verify-user-role.ts`: Trava de autorizacao RBAC. Recebe o cargo esperado e checa contra o payload do token do usuario. Retorna HTTP 403 (Forbidden) imediatamente caso contas comuns tentem acessar rotas administrativas.

### 3. Dominios de Negocio (/resources)
O coracao da regra de negocio. Cada subdiretorio representa uma entidade de dominio fechada:
* `auth`: Gestao do processo de login, verificacao de credenciais e emissao inicial dos cookies de sessao.
* `users`: Cadastro de administradores/suporte, listagem, edicao de perfil e alteracao de hierarquia (RBAC) de contas.
* `projects`: O nucleo do CMS do portifolio. Gerencia a persistencia de projetos, geracao de slugs, conteudos tecnicos em markdown e controle de visualizacoes.
* `messages`: Caixa de entrada imutavel para os formularios de contato enviados pelo frontend publico.
* `tokens`: Logica restrita para emissao de novos Access Tokens validando o Refresh Token persistido.

### Padrao Interno dos Resources
Alem do isolamento por pastas, cada recurso e fragmentado em cinco camadas restritas de fluxo unidirecional:
1. `*.schema.ts` / `*.types.ts`: Define os contratos estruturais em Zod e exporta as tipagens TypeScript puras.
2. `*.router.ts`: Define as URLs HTTP, aplica middlewares protetores e injeta os Schemas Zod diretamente na definicao da rota do Fastify para inferencia automatica de tipos.
3. `*.controller.ts`: Camada de apresentacao. Lida apenas com a desestruturacao do Fastify `request` e formatacao do `reply`, repassando a carga util para os servicos.
4. `*.service.ts`: Camada intelectual. Concentra toda a logica de negocio, validacoes contextuais e executa as queries do banco de dados utilizando a instancia singleton do Prisma.
5. `tests/*.spec.ts`: Suite de testes de unidade e integracao focada exclusivamente em validar cenarios de sucesso e falha daquele dominio especifico.

## Documentacao Automatica Interativa (/docs)

O ambiente expoe uma documentacao viva gerada em tempo real com base nos Schemas do Zod amarrados as rotas `*.router.ts`. 
Ao iniciar o servidor local, acesse a rota `/docs`. O motor do Scalar renderizara a especificacao OpenAPI 3.0 completa da API.
Nesta interface, e possivel ler instrucoes detalhadas, simular payloads complexos, compreender a estrutura de respostas HTTP padronizadas e testar chamadas protegidas autorizando a sessao.

## Integracao e Entrega Continua (CI/CD)

A API possui sua qualidade de codigo e deploy automatizados atraves das esteiras do GitHub Actions.

### CI (Quality & Tests) - Validacao Pre-Merge
A cada PR ou push para a branch `dev`, o job `server-check` garante a sanidade da API:
1. Instancia um banco PostgreSQL de alta velocidade alocado em memoria RAM (tmpfs) na versao 17/18 Alpine.
2. Gera o `.env.test` e o Prisma Client dinamicamente no runner do GitHub.
3. Valida formataçao, sintaxe e tipagem atraves dos comandos `npm run lint` e `npm run type-check`.
4. Roda as suites do Vitest contra o banco em memoria, abortando o pipeline em caso de regressao logica.
5. Um job posterior (`docker-build-check`) valida precocemente se o `Dockerfile` da API constroi a imagem corretamente.

### CD (Build & Publish) - Publicacao de Imagens
Ao integrar o codigo validado na branch `main`, a API e empacotada para producao:
1. Utiliza Docker Buildx em conjunto com QEMU para gerar imagens compativeis com arquiteturas multiplataforma (`linux/amd64`, `linux/arm64`).
2. Faz login autonomo no Docker Hub e publica a imagem `portifolio-api`.
3. Garante rastreabilidade total atrelando multiplas tags a imagem (a tag `latest` e o SHA exato do commit gerador).
4. Otimiza builds subsequentes aproveitando o sistema nativo de cache (`type=gha`) do GitHub Actions.

## Gerenciamento do Banco de Dados (Prisma CLI)

O arquivo `package.json` da pasta `/server` centraliza os atalhos para operacoes do Prisma utilizando a biblioteca `dotenv-cli` para apontar corretamente para o arquivo `.env`.
Se estiver rodando a partir do monorepo, adicione `-w server` as chamadas.

| Comando Interno | Descricao e Funcionalidade |
| :--- | :--- |
| `npm run db:gen` | Regera a biblioteca client nativa do Prisma baseada no arquivo `prisma/schema.prisma`. |
| `npm run db:migrate` | Cria e aplica instrucoes SQL incrementais baseadas em diferencas do schema no banco de dev. |
| `npm run db:seed` | Executa o script `prisma/seed.ts`, efetuando bootstrapping de dados essenciais no sistema. |
| `npm run db:studio` | Inicializa o servidor web local (Prisma Studio) para interacao e operacoes CRUD visuais. |
| `npm run db:deploy` | Comando obrigatorio para ambientes de producao: aplica as migracoes em cascata de forma nao-interativa. |
| `npm run db:reset` | Forca o comando `prisma migrate reset`, destruindo o banco, recriando as tabelas e pulando o seed. |
| `npm run db:format` | Formata automaticamente blocos de definicao do arquivo `schema.prisma`. |

## Execucao de Testes e TDD Local

A suite de testes utiliza o Vitest e simula requisicoes ponta a ponta na API utilizando o Supertest. A arquitetura foi desenhada para limpar a base de dados a cada execucao para evitar colisoes de estado.
Os comandos obrigatoriamente leem o arquivo `.env.test` e executam o script de setup (`npm run test:setup`), que invoca um db:reset seguro antes da execucao das assercoes.

| Comando | Descricao |
| :--- | :--- |
| `npm run test` | Roda o reset do banco de testes seguido da execucao integral do Vitest. Usado por desenvolvedores antes do commit e pelo CI. |
| `npm run test:watch` | Roda o setup inicial e mantem o Vitest assistindo por modificacoes no codigo. Ferramenta oficial para implementacao da metodologia Test-Driven Development (TDD). |