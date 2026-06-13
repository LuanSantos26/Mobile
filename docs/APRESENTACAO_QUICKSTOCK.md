# QuickStock — Guia Completo para Apresentação

Documento de estudo detalhado sobre o que foi implementado no projeto **QuickStock**, cobrindo o aplicativo mobile (React Native / Expo) e a API backend (Spring Boot). Use este material para preparar slides, demonstração ao vivo e respostas a perguntas da banca.

---

## Índice

1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Repositórios e tecnologias](#2-repositórios-e-tecnologias)
3. [Arquitetura do sistema](#3-arquitetura-do-sistema)
4. [Backend — API REST](#4-backend--api-rest)
5. [Mobile — Aplicativo](#5-mobile--aplicativo)
6. [Fluxos principais (passo a passo)](#6-fluxos-principais-passo-a-passo)
7. [Integrações externas](#7-integrações-externas)
8. [O que é real vs. demonstração (mock)](#8-o-que-é-real-vs-demonstração-mock)
9. [Decisões técnicas importantes](#9-decisões-técnicas-importantes)
10. [Roteiro sugerido para apresentação](#10-roteiro-sugerido-para-apresentação)
11. [Perguntas que a banca pode fazer](#11-perguntas-que-a-banca-pode-fazer)
12. [Como rodar o projeto](#12-como-rodar-o-projeto)
13. [Histórico de evolução (o que foi feito)](#13-histórico-de-evolução-o-que-foi-feito)

---

## 1. Visão geral do projeto

### O que é o QuickStock?

O **QuickStock** é uma solução mobile + backend para **gestão de estoque e compras B2B** no setor de bebidas/atacado. O app atende empresas que:

- **Gerenciam** seu próprio catálogo de produtos e estoque em barraquinhas (pontos de venda / filiais).
- **Compram** de distribuidoras parceiras via um marketplace integrado (fluxo estilo app de delivery).

### Problema que o projeto resolve

| Dor do usuário | Solução no QuickStock |
|----------------|----------------------|
| Controlar produtos e quantidades em vários pontos de venda | CRUD de produtos + barraquinhas com estoque por filial |
| Repor estoque comprando de distribuidoras | Marketplace com vitrine, sacola e checkout |
| Acompanhar pedidos de compra | Timeline de status com atualização automática |
| Cadastrar endereço e forma de pagamento | Endereços de entrega + formas de pagamento salvas |
| Saber resumo financeiro | Tela de estatísticas com dados da API (parcialmente reais) |

### Público-alvo (persona)

**Empresa compradora** (tipo `COMPRADOR`): bar, restaurante, revenda ou empreendedor que opera barraquinhas e precisa comprar bebidas de distribuidoras cadastradas na plataforma.

---

## 2. Repositórios e tecnologias

### Repositórios GitHub

| Repositório | URL | Descrição |
|-------------|-----|-----------|
| **Mobile** | https://github.com/LuanSantos26/Mobile | App React Native / Expo |
| **BackEnd** | https://github.com/LuanSantos26/QuickStock-BackEnd | API Spring Boot |

### Stack Mobile

| Camada | Tecnologia | Versão (aprox.) |
|--------|------------|-----------------|
| Framework | Expo | 54.0.6 |
| UI | React Native | 0.83.2 |
| Linguagem | TypeScript | — |
| Navegação | React Navigation (Native Stack) | v7 |
| Estado global | React Context API | 4 contexts |
| Persistência local | AsyncStorage | 2.2.0 |
| Ícones | @expo/vector-icons (Feather) | — |
| Imagens | expo-image-picker | — |
| Gradientes | expo-linear-gradient | — |

### Stack Backend

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Spring Boot | 3.4.0 |
| Linguagem | Java | 17 |
| Banco | PostgreSQL | — |
| ORM | Spring Data JPA / Hibernate | — |
| Auth | JWT (jjwt) + BCrypt | 0.12.6 |
| Documentação API | Springdoc OpenAPI | 2.6.0 |
| Build | Maven | — |

### Comunicação

```
[App Mobile]  ──HTTP/JSON──►  [API :8080]  ──JDBC──►  [PostgreSQL :5432]
     │                              │
     └── AsyncStorage               └── uploads/produtos/ (imagens)
         (sessão, prefs)
```

---

## 3. Arquitetura do sistema

### Diagrama de alto nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP MOBILE (Expo)                        │
├─────────────────────────────────────────────────────────────────┤
│  Telas (Screens)                                                │
│    Welcome, Login, Register, Home, Cart, Sacola, Pedido...      │
├─────────────────────────────────────────────────────────────────┤
│  Componentes reutilizáveis                                      │
│    ScreenHeader, BottomTabBar, HamburgerButton, Modais...       │
├─────────────────────────────────────────────────────────────────┤
│  Contextos (estado global)                                      │
│    AuthContext │ ProductsContext │ BarraquinhasContext │ Cart   │
├─────────────────────────────────────────────────────────────────┤
│  Services (camada HTTP)                                         │
│    authService, marketplaceService, productService, etc.        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST JSON
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Spring Boot)                         │
├─────────────────────────────────────────────────────────────────┤
│  Controllers  →  Services  →  Repositories  →  Entities       │
│  (17 REST)       (11 svcs)     (17 repos)        (15 tabelas)    │
├─────────────────────────────────────────────────────────────────┤
│  Config: CORS, Seeds (data.sql + ApplicationRunners)          │
│  JWT: login + /api/usuarios/me                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  PostgreSQL   │
                    │  quickstock   │
                    └───────────────┘
```

### Dois domínios de negócio no mesmo app

O QuickStock une **duas frentes** que convivem na mesma aplicação:

1. **Gestão interna** — produtos, barraquinhas, estoque local.
2. **Marketplace B2B** — descobrir fornecedores, montar sacola, finalizar compra, rastrear pedido.

Isso é um diferencial na apresentação: não é só um e-commerce; é gestão + compra integradas.

---

## 4. Backend — API REST

### Estrutura de pacotes

```
com.quickstock.backend/
├── BackendApplication.java      ← ponto de entrada
├── config/                        ← CORS, seeds, correção de dados
├── controller/                    ← 17 controllers REST
├── dto/                           ← objetos de request/response
├── entity/                        ← 15 entidades JPA
├── exception/                     ← tratamento global de erros
├── repository/                    ← acesso ao banco
└── service/                       ← regras de negócio
```

### Entidades principais e relacionamentos

```
Perfil ──► Usuario ──► Empresa
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       Produto      EnderecoEntrega   FormaPagamentoSalva
          │
          ▼
    EstoqueBarraca ◄── Barraca ◄── Evento
                          │
                          ▼
                       Pedido ──► ItemPedido, Pagamento

Empresa (compradora) ──► SolicitacaoCompra ◄── Empresa (fornecedora)
                              │
                              └── ItemSolicitacaoCompra ──► Produto
```

### Tipos de empresa

| Tipo | Papel |
|------|-------|
| `COMPRADOR` | Empresa que compra no marketplace |
| `DISTRIBUIDOR` | Fornecedor de produtos |
| `PLATAFORMA` | QuickStock / hub central |

### Endpoints usados pelo app mobile (principais)

#### Autenticação e cadastro

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | `/api/cadastro` | Cadastro unificado (empresa + usuário admin) |
| POST | `/api/usuarios/login` | Login → retorna JWT |
| GET | `/api/usuarios/me` | Valida token e retorna usuário logado |
| PUT | `/api/usuarios/{id}` | Atualizar dados do usuário |
| PUT | `/api/empresas/{id}` | Atualizar dados da empresa |

#### Produtos

| Método | Endpoint | Função |
|--------|----------|--------|
| GET | `/api/produtos?empresaId={id}` | Listar catálogo da empresa |
| POST | `/api/produtos` | Criar produto |
| PUT | `/api/produtos/{id}` | Editar produto |
| DELETE | `/api/produtos/{id}` | Desativar produto (soft delete) |
| POST | `/api/produtos/upload` | Upload de imagem (multipart) |

#### Barraquinhas

| Método | Endpoint | Função |
|--------|----------|--------|
| GET | `/api/barracas?empresaId={id}` | Listar barraquinhas |
| POST | `/api/barracas` | Criar barraquinha |
| PUT | `/api/barracas/{id}` | Editar barraquinha |
| PUT | `/api/barracas/{id}/estoque` | Atualizar quantidades por produto |
| DELETE | `/api/barracas/{id}?empresaId={id}` | Remover barraquinha |

#### Marketplace e pedidos B2B

| Método | Endpoint | Função |
|--------|----------|--------|
| GET | `/api/marketplace/fornecedores?empresaCompradoraId={id}` | Listar distribuidoras |
| GET | `/api/marketplace/fornecedores/{id}/produtos` | Catálogo do fornecedor |
| POST | `/api/solicitacoes-compra` | Criar pedido de compra |
| GET | `/api/solicitacoes-compra?empresaCompradoraId={id}` | Histórico de pedidos |
| GET | `/api/solicitacoes-compra/{id}?empresaCompradoraId={id}` | Detalhe + timeline |

#### Endereços, pagamento, notificações, financeiro

| Método | Endpoint | Função |
|--------|----------|--------|
| GET/POST | `/api/enderecos?empresaId={id}` | Endereços de entrega |
| GET/POST/DELETE | `/api/formas-pagamento?empresaId={id}` | Formas de pagamento salvas |
| GET | `/api/notificacoes?empresaCompradoraId={id}` | Notificações (geradas em tempo real) |
| GET | `/api/financeiro/resumo?empresaCompradoraId={id}` | Resumo financeiro mensal |

### Regras de negócio importantes (backend)

#### Solicitação de compra (`SolicitacaoCompraService`)

1. Valida que o fornecedor é `DISTRIBUIDOR` ou `PLATAFORMA`.
2. Impede compra da própria empresa.
3. Valida que o usuário pertence à empresa compradora.
4. Valida método de pagamento: `pix`, `credito`, `debito`, `dinheiro`.
5. Valida endereço de entrega da empresa.
6. Status inicial: **`aguardando_liberacao`**.
7. Calcula total = soma dos itens + **taxa de entrega**.

#### Timer de demonstração (status automático)

Para fins de apresentação/demo, após **20 segundos** da criação do pedido:

```
aguardando_liberacao  ──(20s)──►  em_rota
```

Essa transição é persistida no banco e disparada quando o app consulta listagem ou detalhe do pedido.

#### Status possíveis de pedido B2B

| Status | Significado na UI |
|--------|-------------------|
| `aguardando_liberacao` | Pedido feito, aguardando liberação do fornecedor |
| `em_rota` | Pedido saiu para entrega |
| `entregue` | Entrega concluída |
| `cancelada` | Pedido cancelado |

#### Timeline (etapas visuais retornadas pela API)

1. Pedido efetuado
2. Aguardando liberação
3. Em rota

### Segurança (JWT)

- Login retorna token JWT (validade: 24 horas).
- Senhas hasheadas com **BCrypt**.
- Endpoint protegido por token: **`GET /api/usuarios/me`**.
- **Importante para a banca:** não há Spring Security global — a maioria dos endpoints é pública; a autorização é feita validando `empresaId` nos services. Isso é uma limitação conhecida do MVP.

### Seeds e dados iniciais

O backend sobe com dados prontos para demo:

| Fonte | O que cria |
|-------|------------|
| `data.sql` | Perfis, 10+ distribuidoras fictícias, catálogo de bebidas (Skol, Brahma, Coca-Cola...) |
| `EnderecoSeedRunner` | 2 endereços demo por empresa compradora |
| `FormaPagamentoSeedRunner` | PIX, crédito, débito, dinheiro |
| `FinanceiroSeedRunner` | ~12 solicitações demo nos últimos 6 meses |
| `MarketplaceDataFixRunner` | Corrige nomes UTF-8, logos e capas de fornecedores |

### Configuração (`application.properties`)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/quickstock
server.port=8080
jwt.secret=QuickStockDevSecretKey2026Minimo32Chars!!
jwt.expiration-ms=86400000
upload.dir=uploads/produtos
spring.servlet.multipart.max-file-size=5MB
```

---

## 5. Mobile — Aplicativo

### Estrutura de pastas

```
Mobile/
├── App.tsx                 ← navegação + providers
├── index.ts                ← entry point Expo
├── src/
│   ├── config/
│   │   └── api.ts          ← URL base da API + helper de imagem
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ProductsContext.tsx
│   │   ├── BarraquinhasContext.tsx
│   │   └── PurchaseCartContext.tsx
│   ├── services/           ← chamadas HTTP (9 services)
│   ├── screens/            ← telas do app
│   ├── components/         ← componentes reutilizáveis
│   ├── theme/
│   │   └── theme.ts        ← cores, fontes, espaçamentos
│   └── utils/              ← CEP, datas, notificações locais
```

### Providers e ordem de aninhamento

```
SafeAreaProvider
└── AuthProvider
    └── NavigationContainer
        └── AppNavigator
            ├── GuestNavigator (não logado)
            └── AuthenticatedNavigator
                └── ProductsProvider
                    └── BarraquinhasProvider
                        └── PurchaseCartProvider
                            └── Stack (telas)
```

### Rotas de navegação

#### Fluxo guest (antes do login)

| Rota | Tela | Descrição |
|------|------|-----------|
| `Welcome` | WelcomeScreen | Landing com botões Entrar / Criar conta |
| `Register` | RegisterScreen | Cadastro unificado |
| `Login` | LoginScreen | Login e-mail/senha |

#### Fluxo autenticado

| Rota | Tela | Descrição |
|------|------|-----------|
| `Home` | HomeScreen | Dashboard com catálogo próprio |
| `Cart` | CartScreen | Marketplace — lista de fornecedores |
| `StoreVitrine` | StoreVitrineScreen | Vitrine de um fornecedor |
| `ProductDetail` | ProductDetailScreen | Detalhe do produto + adicionar à sacola |
| `Sacola` | SacolaScreen | Checkout (endereço, pagamento, total) |
| `PedidoAcompanhamento` | PedidoAcompanhamentoScreen | Timeline do pedido |
| `AddItem` | ManageProductsScreen | CRUD de produtos (via botão +) |
| `Barraquinhas` | BarraquinhasScreen | CRUD de barraquinhas + estoque |
| `FormasPagamento` | FormasPagamentoScreen | CRUD formas de pagamento |
| `Configuracoes` | ConfiguracoesScreen | Editar perfil e empresa |
| `Cards` | CardsScreen | Carteira (mock) + Estatísticas (API) |
| `Checkout` | CheckoutScreen | Redireciona para Sacola (legado) |

### Contextos — o que cada um guarda

| Context | Responsabilidade |
|---------|------------------|
| **AuthContext** | Sessão JWT, login/logout, restore ao abrir app, `updateUser` |
| **ProductsContext** | Lista de produtos da empresa logada |
| **BarraquinhasContext** | Barraquinhas/filiais da empresa |
| **PurchaseCartContext** | Sacola B2B: itens, fornecedor atual, quantidades |

**Regra da sacola:** só pode haver produtos de **um fornecedor por vez**. Trocar de fornecedor exige confirmar que a sacola será limpa.

### Componentes-chave criados/unificados

#### `ScreenHeader` — cabeçalho padrão

Layout unificado em todas as telas autenticadas:

```
┌──────────────────────────────────────────────┐
│ [☰]                    [📅] [🔔] [🛒 badge]  │  ← linha 1: menu + ações
│ Olá, {nome}!          {data de hoje}         │  ← linha 2: só na Home (showGreeting)
└──────────────────────────────────────────────┘
```

- Usa `useSafeAreaInsets()` para respeitar notch/status bar.
- Saudação e calendário aparecem **apenas na Home** (`showGreeting={true}`).

#### `BottomTabBar` — barra inferior customizada

7 ações + botão central flutuante (+):

| Ícone | Destino | Função |
|-------|---------|--------|
| Home | `Home` | Dashboard |
| Barraca | `Barraquinhas` | Gestão de filiais |
| **+ (FAB)** | `AddItem` | Cadastrar produtos |
| Carrinho | `Cart` | Marketplace |
| Sacola | `Sacola` | Checkout (com badge de quantidade) |
| Carteira | `FormasPagamento` | Formas de pagamento |
| Card | `Cards` | Estatísticas |

#### `HamburgerButton` — menu lateral (Modal)

Itens do menu:
- Barraquinhas
- Formas de pagamento
- Configurações
- Sair (logout)

Implementado como **Modal** (70% da largura), não usa `@react-navigation/drawer`.

#### Outros componentes importantes

| Componente | Função |
|------------|--------|
| `HeaderActions` | Calendário, sino de notificações, ícone da sacola |
| `NotificationsModal` | Lista notificações; tap navega para Cart ou StoreVitrine |
| `EnderecoFormModal` | Cadastro de endereço com busca ViaCEP |
| `ProductFormModal` | Criar/editar produto + upload de foto |
| `BarracaFormModal` | Criar/editar barraquinha + alocar estoque |
| `RemoteImage` | Imagem remota com fallback (iniciais coloridas) |
| `CustomInput` / `CustomButton` | Inputs e botões padronizados |

### Services (camada HTTP)

| Arquivo | Domínio |
|---------|---------|
| `authService.ts` | Login, cadastro, perfil |
| `productService.ts` | CRUD produtos + upload |
| `barracaService.ts` | CRUD barraquinhas + estoque |
| `marketplaceService.ts` | Fornecedores, vitrine, pedidos |
| `formaPagamentoService.ts` | Formas de pagamento salvas |
| `enderecoService.ts` | Endereços de entrega |
| `financeiroService.ts` | Resumo financeiro |
| `notificacaoService.ts` | Notificações |
| `sessionStorage.ts` | Persistência do token (AsyncStorage) |

### Configuração da API (`src/config/api.ts`)

```typescript
// Host detectado automaticamente:
// - Android emulador: 10.0.2.2
// - iOS / web: localhost
// - Dispositivo físico: IP do debugger Expo

API_BASE_URL = `http://${host}:8080`
```

### Identidade visual

- Cor principal autenticada: **`#F8B125`** (dourado)
- Gradiente no topo das telas: dourado → branco
- Telas de login/cadastro: gradiente azul/amarelo (`Background`)
- Cards brancos com sombra suave
- Ícones: Feather (@expo/vector-icons)

---

## 6. Fluxos principais (passo a passo)

### 6.1 Cadastro e login

```
Welcome
  ├── "Criar conta" → RegisterScreen
  │     └── POST /api/cadastro (empresa + usuário)
  │           └── volta para Welcome com mensagem de sucesso
  │
  └── "Entrar" → LoginScreen
        └── POST /api/usuarios/login
              └── salva JWT no AsyncStorage (@quickstock_session)
                    └── AuthContext → telas autenticadas
```

**Ao reabrir o app:** `loadSession()` → `GET /api/usuarios/me` → restaura sessão ou desloga.

### 6.2 Marketplace → compra → acompanhamento

```
CartScreen (lista fornecedores + últimos pedidos)
  │
  ▼ tap em fornecedor
StoreVitrineScreen (grid de produtos)
  │
  ▼ tap em produto
ProductDetailScreen (escolhe quantidade → "Adicionar à sacola")
  │
  ▼ PurchaseCartContext.addItem()
SacolaScreen
  ├── revisar itens
  ├── selecionar endereço (API + AsyncStorage)
  ├── selecionar forma de pagamento (API)
  ├── ver total = subtotal + R$ 7,00 (taxa entrega)
  └── "Finalizar pedido" → POST /api/solicitacoes-compra
        │
        ▼
PedidoAcompanhamentoScreen
  ├── timeline visual (3 etapas)
  └── polling a cada 5 segundos (GET /api/solicitacoes-compra/{id})
        └── após ~20s status muda para "em_rota"
```

### 6.3 Gestão de produtos

```
BottomTabBar → botão central (+)
  └── ManageProductsScreen (AddItem)
        ├── listar produtos da empresa
        ├── criar/editar via ProductFormModal
        ├── upload de imagem (expo-image-picker → POST /api/produtos/upload)
        └── excluir produto
```

### 6.4 Gestão de barraquinhas

```
Menu ☰ → Barraquinhas
  └── BarraquinhasScreen
        ├── listar barraquinhas (cards expansíveis)
        ├── criar/editar via BarracaFormModal
        ├── alocar quantidade de cada produto do catálogo
        └── remover com confirmação
```

### 6.5 Configurações e formas de pagamento

```
Menu ☰ → Configurações
  └── editar nome, e-mail, senha, telefone
        └── PUT /api/usuarios/{id} + PUT /api/empresas/{id}

Menu ☰ → Formas de pagamento  (ou ícone carteira na tab bar)
  └── CRUD: PIX, crédito, débito, dinheiro + apelido
        └── usado na SacolaScreen na hora do checkout
```

### 6.6 Notificações

```
Header → ícone sino
  └── NotificationsModal
        ├── GET /api/notificacoes?empresaCompradoraId={id}
        ├── tipos: compra, promocao, oferta
        ├── "lidas" controladas localmente (AsyncStorage)
        └── tap:
              ├── tipo compra → CartScreen
              └── com fornecedorId → StoreVitrineScreen
```

---

## 7. Integrações externas

| Serviço | URL | Uso no app |
|---------|-----|------------|
| **ViaCEP** | `https://viacep.com.br/ws/{cep}/json/` | Auto-preencher endereço no cadastro |
| **ui-avatars.com** | fallback de avatar | Quando imagem de produto/fornecedor falha |
| **picsum.photos** | capas de fornecedores | Seed do backend (MarketplaceDataFixRunner) |

---

## 8. O que é real vs. demonstração (mock)

Seja transparente na apresentação sobre o que está 100% integrado e o que é placeholder.

### Totalmente integrado com API

- Login, cadastro, sessão JWT
- CRUD produtos, barraquinhas, estoque
- Marketplace, vitrine, sacola, checkout
- Acompanhamento de pedido (polling + timer 20s)
- Endereços, formas de pagamento
- Notificações (conteúdo gerado pelo backend)
- Estatísticas na aba "Estatísticas" do CardsScreen

### Parcialmente mock / placeholder

| Tela/Elemento | Situação |
|---------------|----------|
| Home — cards financeiros (R$ 600 / R$ 900) | Valores fixos na UI |
| Home — gráfico donut | Estático, não vem da API |
| Cards — aba "Carteira" | Dados fictícios |
| Financeiro backend | Mix: compras reais + lucros/gastos sintéticos |
| Notificações "lidas" | Só no dispositivo (AsyncStorage), backend não marca |
| VitrineScreen.tsx | Protótipo legado, não está no navigator |

---

## 9. Decisões técnicas importantes

### Por que React Context em vez de Redux?

O estado do app é moderado (auth, produtos, barraquinhas, sacola). Context API é suficiente para o MVP e reduz complexidade.

### Por que tab bar custom em vez de `@react-navigation/bottom-tabs`?

Permite o **FAB central (+)** e layout com 7 ícones + badge na sacola, sem limitações do componente nativo de tabs.

### Por que Modal para menu em vez de Drawer Navigator?

Implementação mais simples, controle total do layout (70% largura, animação), sem dependência extra de gesture handler para drawer.

### Por que polling de 5s no pedido?

Simula tracking em tempo real sem WebSocket. Adequado para demo acadêmica; em produção usaria push notification ou SSE.

### Por que timer de 20s no backend?

Permite demonstrar a transição de status **ao vivo** na apresentação, sem precisar de um operador liberando o pedido manualmente.

### Por que cadastro unificado?

Antes havia fluxo separado (AccountType → RegisterCompany → RegisterUser). Foi simplificado para **uma tela** (`RegisterScreen`) → melhor UX.

### Limitações conhecidas (cite na banca se perguntarem)

1. JWT não protege todos os endpoints globalmente.
2. Parte do financeiro é sintética.
3. `HomeScreen` → `ProductDetail` sem fornecedorId não adiciona à sacola corretamente.
4. Imagens em `/uploads/` podem precisar de config extra para servir estaticamente.

---

## 10. Roteiro sugerido para apresentação

### Estrutura (~15–20 min)

| Tempo | Bloco | O que mostrar |
|-------|-------|---------------|
| 2 min | **Introdução** | Problema, persona, visão geral do QuickStock |
| 3 min | **Arquitetura** | Diagrama mobile ↔ API ↔ PostgreSQL; dois domínios (gestão + marketplace) |
| 2 min | **Backend** | Entidades, endpoints principais, JWT, seeds |
| 8 min | **Demo ao vivo** | Fluxo completo (ver roteiro abaixo) |
| 3 min | **Destaques técnicos** | ScreenHeader unificado, sacola 1 fornecedor, polling, timer demo |
| 2 min | **Conclusão** | O que funciona, limitações, próximos passos |

### Roteiro da demo ao vivo (ordem recomendada)

1. **Login** com usuário demo
2. **Home** — mostrar catálogo próprio e header com saudação
3. **Cart** — listar distribuidoras
4. **StoreVitrine** — abrir vitrine de um fornecedor
5. **ProductDetail** — adicionar 2–3 itens à sacola
6. **Sacola** — endereço, forma de pagamento, total com taxa R$ 7
7. **Finalizar pedido** → **PedidoAcompanhamento**
8. **Aguardar ~20s** — mostrar status mudando para "Em rota"
9. **Menu ☰** — Formas de pagamento ou Configurações (rápido)
10. **Botão +** — cadastrar/editar um produto
11. **Barraquinhas** — mostrar estoque por filial
12. **Cards → Estatísticas** — gráficos da API

### Frases-chave para a apresentação

> "O QuickStock integra gestão de estoque local com compras B2B de distribuidoras, tudo em um único app mobile."

> "A arquitetura segue camadas: telas → contexts → services → API REST → banco PostgreSQL."

> "O fluxo de compra replica a experiência de apps de delivery: marketplace, sacola, checkout e rastreamento em tempo quasi-real."

> "Para a demo acadêmica, implementamos um timer que simula a liberação do pedido em 20 segundos."

---

## 11. Perguntas que a banca pode fazer

### Sobre arquitetura

**P: Por que separar Mobile e BackEnd em repositórios diferentes?**  
R: Permite times independentes, deploy separado, e o backend pode servir outros clientes (web, outro app) no futuro.

**P: Como o app sabe onde está o backend?**  
R: `src/config/api.ts` detecta o host (emulador Android usa `10.0.2.2`, iOS usa `localhost`, dispositivo físico usa IP do Expo).

**P: Onde fica o token de autenticação?**  
R: AsyncStorage, chave `@quickstock_session`. Enviado como `Authorization: Bearer {token}` nas requisições autenticadas.

### Sobre negócio

**P: Por que só um fornecedor por sacola?**  
R: Simplifica logística e checkout — cada pedido B2B é com um único fornecedor, como em apps de delivery por loja.

**P: O que acontece após finalizar o pedido?**  
R: API cria `SolicitacaoCompra` com status `aguardando_liberacao`. Após 20s (demo), muda para `em_rota`. App faz polling a cada 5s.

### Sobre segurança

**P: Todos os endpoints exigem login?**  
R: Não — é um MVP. Apenas `/api/usuarios/me` valida JWT. Os services validam `empresaId` nos parâmetros. Em produção, adicionar Spring Security com filter global.

**P: Como as senhas são armazenadas?**  
R: BCrypt hash no banco, nunca em texto plano.

### Sobre dados

**P: Os dados de fornecedores são reais?**  
R: São seeds fictícios (distribuidoras de bebidas em Caruaru) para demonstração. Inseridos via `data.sql` e runners Java.

**P: O financeiro é real?**  
R: Parcialmente — compras mensais vêm de pedidos reais; lucros e alguns gráficos usam dados sintéticos para encher a UI.

---

## 12. Como rodar o projeto

### Pré-requisitos

- Node.js + npm
- Java 17 + Maven
- PostgreSQL rodando com banco `quickstock`
- Expo Go ou emulador Android/iOS

### Backend

```bash
cd QuickStock-BackEnd
# Configurar application.properties se necessário (usuário/senha PG)
mvn spring-boot:run
# API disponível em http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui/index.html
```

### Mobile

```bash
cd Mobile
npm install
npx expo start
# Escanear QR code (Expo Go) ou pressionar 'a' (Android) / 'i' (iOS)
```

### Checklist antes da apresentação

- [ ] PostgreSQL rodando
- [ ] Backend iniciado (porta 8080)
- [ ] App conectando (verificar host no emulador/dispositivo)
- [ ] Usuário de teste com senha conhecida
- [ ] Formas de pagamento cadastradas (ou usar seed)
- [ ] Endereço cadastrado (ou usar seed)
- [ ] Desativar "Commit Attribution" no Cursor se for commitar ao vivo

---

## 13. Histórico de evolução (o que foi feito)

Resumo cronológico das principais entregas implementadas:

### Fase 1 — Autenticação e base

- Telas Welcome, Login, Register
- Cadastro unificado (`POST /api/cadastro`)
- JWT + sessão persistida (AsyncStorage)
- AuthContext com restore automático
- Tema visual (gradientes, cores QuickStock)

### Fase 2 — Gestão interna

- CRUD de produtos com upload de imagem
- CRUD de barraquinhas com estoque por produto
- ProductsContext e BarraquinhasContext
- HomeScreen com catálogo da empresa

### Fase 3 — Marketplace B2B

- Listagem de fornecedores (`CartScreen`)
- Vitrine por fornecedor (`StoreVitrineScreen`)
- Detalhe de produto + sacola (`PurchaseCartContext`)
- Checkout completo (`SacolaScreen`): endereço, pagamento, taxa entrega
- API: marketplace, solicitações de compra, endereços

### Fase 4 — Pós-compra e notificações

- Timeline de pedido (`PedidoAcompanhamentoScreen`)
- Polling a cada 5 segundos
- Timer demo no backend (20s → em_rota)
- Notificações com modal e deep link

### Fase 5 — Perfil e pagamentos

- Configurações (editar usuário e empresa)
- Formas de pagamento salvas (CRUD)
- Integração sacola ↔ formas cadastradas
- API: `FormaPagamentoSalva`, seeds

### Fase 6 — Navegação e UX unificada

- `ScreenHeader` padronizado em todas as telas
- Saudação + calendário só na Home
- `BottomTabBar` com 7 ações + FAB central (+)
- Menu hambúrguer: Barraquinhas, Formas pagamento, Configurações, Sair
- Ícone carteira → Formas de pagamento (não mais AddItem)
- Botão (+) central → cadastro de produtos

### Fase 7 — Financeiro e estatísticas

- API financeiro com resumo mensal
- CardsScreen com aba Estatísticas (gráficos reais da API)
- Seeds financeiros para demo

---

## Glossário rápido

| Termo | Significado |
|-------|-------------|
| **Barraquinha** | Ponto de venda / filial da empresa |
| **Sacola** | Carrinho de compra B2B (checkout) |
| **Cart** | Tela de marketplace (lista fornecedores) |
| **Fornecedor** | Empresa DISTRIBUIDOR ou PLATAFORMA |
| **Solicitação de compra** | Pedido B2B formalizado na API |
| **Seed** | Dado inicial inserido automaticamente no banco |
| **JWT** | Token JSON Web Token para autenticação |
| **Polling** | Consulta repetida à API em intervalo fixo |
| **FAB** | Floating Action Button (botão + central) |

---

## Links úteis

- Repositório Mobile: https://github.com/LuanSantos26/Mobile
- Repositório BackEnd: https://github.com/LuanSantos26/QuickStock-BackEnd
- ViaCEP: https://viacep.com.br/
- Expo docs: https://docs.expo.dev/
- Spring Boot docs: https://spring.io/projects/spring-boot

---

*Documento gerado para estudo e apresentação acadêmica do projeto QuickStock. Última atualização: junho/2026.*
