
# Cevaroli — Plataforma de Gestão de Ofertas (Prompt 1)

Entrega da base do app + 3 telas em alta fidelidade, adaptado ao stack real do template (TanStack Start + TanStack Router + TanStack Query). Sem backend real: dados via mocks tipados em memória, com delay artificial. Sem MSW e sem axios — chamadas isoladas em uma camada de "services" com a mesma interface dos endpoints definidos, pronta para troca por HTTP real depois.

## 1. Design system global

`src/styles.css` reescrito:
- Importa Google Fonts: DM Serif Display, Geist, JetBrains Mono.
- Define todos os tokens do spec (`--bg-canvas`, `--bg-surface`, `--bg-raised`, `--bg-overlay`, borders, texts, accents, status, gradients, radii, shadows, fontes, escala tipográfica, espaçamentos).
- Mapeia os tokens dentro de `@theme inline` para gerar utilitários Tailwind v4 (`bg-canvas`, `bg-surface`, `text-primary`, `border-default`, `text-status-ok`, `font-display`, `font-mono`, `font-body`, etc.).
- Define tema dark fixo (sem toggle). `body { background: var(--bg-canvas); color: var(--text-primary); font-family: var(--font-body); }`.
- Helpers utilitários: `.section-label` (JetBrains Mono 11px uppercase tracking), `.data-chip`, `.status-pill`, animações `fade-slide-in`.

Tailwind config: o template já usa Tailwind v4 com `@theme inline`; basta adicionar tokens; nada em JS.

Favicon: copiar `user-uploads://br-dd14e21915bbf7ab.png` para `public/favicon.png` e atualizar `<link rel="icon">` no `__root.tsx`.

## 2. Estrutura de pastas (adaptada ao TanStack Router)

```text
src/
  routes/
    __root.tsx              (já existe — adiciona providers + auth context)
    index.tsx               (redirect → /campaigns se logado, senão /login)
    login.tsx
    _authenticated.tsx      (layout protegido: AppShell + Outlet)
    _authenticated/
      campaigns/
        index.tsx           (Lista de Campanhas)
      buyer-desk.tsx        (Mesa do Comprador)
  features/
    auth/{LoginPage.tsx, useAuth.ts}
    campaigns/{CampaignsListPage.tsx, StatusBadge.tsx, CampaignTypeBadge.tsx}
    buyer-desk/{BuyerDeskPage.tsx, SeqprodutoSearch.tsx, ProductDataPanel.tsx,
                BuyerFillForm.tsx, NovoPMZCard.tsx, LivePreviewPanel.tsx,
                MarketIntelPanel.tsx}
  components/
    layout/{AppShell.tsx, Sidebar.tsx, Topbar.tsx}
    ui/{Badge.tsx, StatusDot.tsx, PageHeader.tsx, SectionLabel.tsx,
        MetricCard.tsx, EmptyState.tsx, DataTable.tsx, ProgressBar.tsx,
        Chip.tsx}
  lib/
    api/client.ts           (fetch wrapper com delay simulado e envelope)
    services/{auth.service.ts, campaign.service.ts, product.service.ts,
              promotional-items.service.ts, users.service.ts,
              editorial.service.ts}
    permissions.ts
    auth-store.ts           (Zustand: user, token, login, logout)
    mocks/{campaigns.ts, products.ts, users.ts, stores.ts, items.ts}
  hooks/{usePermission.ts, useDebounce.ts}
  types/{campaign.types.ts, product.types.ts, user.types.ts, api.types.ts}
.env.example
```

Notas:
- Sem `react-router-dom`, sem `src/app/router.tsx`. Rotas seguem convenção do template em `src/routes/`.
- `tanstack-router-plugin` regenera `routeTree.gen.ts` automaticamente.

## 3. Camada de dados

`src/lib/api/client.ts`: função `request<T>(path, opts)` que, em vez de fetch real, despacha para os handlers de mock do domínio com `await sleep(300)` e retorna `{ data, meta, error }`.

Cada `*.service.ts` expõe funções com a mesma assinatura dos endpoints do spec (ex.: `campaignService.list({ page, search, type, status })`, `productService.searchBySeq(seq)`, `promotionalItemsService.calculatePmz(payload)`). Internamente chamam o mock — trocar por `fetch` real depois é uma alteração local.

Tipos em `src/types/*` exatamente como descritos no spec (Campaign, CampaignStatus, PromotionalItem, Product, ProductCommercialData, User, UserRole, etc.).

State client: Zustand (`useAuthStore`) persistido em `localStorage` para `user`+`token` simulados. `useAuth` hook empacota login/logout.

Permissões: `ROLE_PERMISSIONS` conforme spec + `usePermission()` retornando `{ can(action) }`. Sidebar e ações usam isso para esconder/mostrar.

## 4. Shell, providers e proteção

`__root.tsx`:
- Mantém estrutura SSR (HeadContent/Scripts).
- Envolve `<Outlet/>` em `QueryClientProvider` (já existe) + injeta `<Toaster/>` (sonner).
- Atualiza meta tags para "Cevaroli — Gestão de Ofertas".
- Cole link de fontes (preconnect Google Fonts) e favicon.

`_authenticated.tsx`:
- `beforeLoad` consulta `useAuthStore.getState()`; se não autenticado, `throw redirect({ to: "/login", search: { redirect: location.href } })`.
- Componente renderiza `<AppShell><Outlet/></AppShell>`.

`AppShell`: grid `240px 1fr`, `Sidebar` fixa + `Topbar` sticky + área de conteúdo com padding.

`Sidebar`: branding "CEVAROLI / Inteligência Promocional" no topo; grupos OPERACIONAL / CONTEÚDO / APROVAÇÕES / GESTÃO com ícones Lucide (LayoutGrid, Users, Layers, ShoppingBag, Image, Eye, CheckSquare, Send, BarChart2, Settings). Itens filtrados via `can()`. Apenas `/campaigns` e `/buyer-desk` são clicáveis nesta fase; os demais ficam visíveis com cursor `not-allowed` e tooltip "Em breve" (sem placeholder de página). Bottom: user info + LogOut.

`Topbar`: breadcrumb à esquerda derivado da rota atual (`useRouterState`), notificação (Bell) e avatar com iniciais à direita.

## 5. Telas

### 5.1 Login (`/login`)
Split 55/45, painel esquerdo decorativo com grid CSS sutil, logo Cevaroli (arquivo `unnamed.jpg` copiado para `src/assets/cevaroli-logo.jpg`) acima do título "Gestão de Ofertas" (DM Serif 52px), kicker "GRUPO CEVAROLI", versão `v1.0` no canto. Painel direito: formulário RHF+Zod (email/senha + show/hide), botão "Entrar" full width, alerta de erro inline, link "Esqueci minha senha". Submit chama `authService.login` (mock aceita qualquer email; senha `cevaroli` retorna admin, `comprador` retorna buyer, etc. — útil para testar RBAC). Após sucesso, `navigate({ to: search.redirect ?? "/campaigns" })`.

### 5.2 Lista de Campanhas (`/_authenticated/campaigns/`)
- Loader: `context.queryClient.ensureQueryData(campaignsQueryOptions(searchFilters))`. Componente lê com `useSuspenseQuery`.
- Filtros (`search`, `type`, `status`, `dateRange`) sincronizados na URL via `validateSearch` (zod) + `useNavigate`.
- PageHeader com título DM Serif "Campanhas", subtítulo, botão `+ Nova Campanha` (desabilitado nesta fase, tooltip "Disponível no próximo passo").
- 4 MetricCards (Ativas / Em Preenchimento / Aguardando Aprovação / Exportadas no mês) calculados a partir do mock.
- Filter bar (Input com Search, dois Selects, dois date inputs).
- DataTable: colunas CAMPANHA, TIPO, PERÍODO, PROGRESSO (barra + "x/y slots"), STATUS (pill), PRAZOS (Clock/AlertCircle + data), AÇÕES (Eye, Edit2, Copy, MoreHorizontal). Hover row, click navega para detail (rota futura — por ora exibe toast "Em breve").
- EmptyState quando lista vazia (Inbox icon).
- Paginação inferior baseada em meta do mock.

### 5.3 Mesa do Comprador (`/_authenticated/buyer-desk`)
Layout grid 58/42 ≥1280px, empilha abaixo.
- **Context bar** topo: nome da campanha mock atual + slot + progresso + deadline.
- **SEQPRODUTO search**: input grande, JetBrains Mono 18px, on Enter chama `productService.searchBySeq`. Estados loading/erro inline.
- **ProductDataPanel**: aparece com animação `fade-slide-in`. Duas linhas de chips (Departamento, Família, Fornecedor, Filial / PMZ, Preço Venda, Estoque, Média 30d, Curva ABC). Cartão de competitividade com preço, data, badge colorido e ícone TrendingDown/Up/Minus.
- **BuyerFillForm** (RHF + Zod): Descrição ERP read-only, Descrição Jornal (textarea com contador, warn 50/error 70, chip "Sugestão"), Tipo de Oferta (segmented chips), Preço Oferta (JetBrains Mono 20px), Tipo de Exposição (chips), Sell Out (Switch + valor + N acordo), Encarte/Box (valor + N acordo).
- **NovoPMZCard** inline ao lado do preço: chama `promotionalItemsService.calculatePmz` no blur do preço; cor do valor reage à margem; banner de alerta condicional (warn/critical).
- Botões: Salvar Item, Salvar e Próximo, Limpar.
- **LivePreviewPanel** (sticky): frame branco com placeholder de imagem (ImagePlus), nome do produto, preço grande, badge de tipo de oferta; aviso "Texto estourado" quando descrição passa do limite. Chips de alerta abaixo.
- **MarketIntelPanel** colapsável: ABC bar, mini barras de estoque por loja, histórico (3 campanhas), risco de ruptura/baixa expressividade, sugestões alternativas.

## 6. Padrões globais

- Loading: componentes `Skeleton` próprios (animate-pulse) — sem spinner full page.
- Toasts: `sonner` (já no template), posição top-right, auto-dismiss 5s.
- Transições: classes utilitárias (`transition-colors duration-150`, `animate-[fade-slide-in_250ms_ease-out]`).
- Sem cores hardcoded — apenas `var(--*)` via classes utilitárias geradas pelo `@theme inline`.
- Sem emojis; apenas `lucide-react`.

## 7. Dados mock

`src/lib/mocks/`:
- 3 lojas (BH, Caeté, Nazaré) em 2 clusters.
- 5 buyers (Bazar, Mercearia, FLV, Higiene, Bebidas) com role `buyer` + 1 admin + 1 marketing + 1 commercial.
- 8 campanhas cobrindo todos os status.
- 30 produtos com SEQPRODUTO (8 dígitos), descrição ERP/Jornal, família, fornecedor, dados comerciais, preço de concorrente.
- `delay(ms)` helper.

## 8. Variáveis de ambiente

`.env.example`:
```
VITE_API_URL=http://localhost:3333
VITE_WS_URL=ws://localhost:3333
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```
Cliente HTTP lê `VITE_API_URL`, mas nesta fase ignora (usa mocks).

## 9. Fora de escopo nesta iteração

Wizard de campanha, Estrutura Editorial, Aprovações, Dashboard Operacional, banco de imagens, exportação, administração de usuários e auditoria. Itens do menu existem mas levam a "Em breve". Esses serão prompts seguintes.

## 10. Riscos / decisões

- **MSW descartado** a pedido — services chamam mocks diretamente. Custo: ao plugar API real, ajustar `client.ts` (uma camada) e cada `*.service.ts` (trocar mock por `request()`).
- **React Router v6 descartado** — TanStack Router é a convenção do template. RBAC e proteção feitas via `_authenticated` + `beforeLoad`, hook `usePermission` para granularidade.
- **shadcn-ui** já presente; usaremos `Input`, `Button`, `Select`, `Switch`, `Toaster`, etc., com classes customizadas para alinhar ao tema dark editorial.
- Sem testes automatizados nesta entrega.

