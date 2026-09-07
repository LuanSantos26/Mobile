# QuickStock — Documentação Oficial

> Versão versionável em Markdown. O documento Word para entrega acadêmica está em **DOCUMENTACAO_OFICIAL_QUICKSTOCK.docx**.
>
> Para regenerar o `.docx`: `cd docs/scripts && npm install && node gerar_documentacao.mjs`

---

## Elementos pré-textuais

- **Capa** e **folha de rosto** com campos `[PREENCHER: ...]` no Word (instituição, autor, orientador, cidade, ano).
- **Sumário** automático — após abrir no Word, clique com botão direito no sumário → **Atualizar campo**.

---

## 1 Introdução

O comércio de bebidas e atacado enfrenta desafios na gestão de estoque em múltiplos pontos de venda e na reposição junto a distribuidoras. O **QuickStock** integra aplicativo mobile (Expo / React Native) e API REST (Spring Boot) com PostgreSQL.

### 1.1 Objetivo geral

Desenvolver e documentar um sistema mobile integrado a backend para gestão de estoque e compras B2B no setor de bebidas.

### 1.2 Objetivos específicos

- Cadastro unificado com JWT
- CRUD de produtos, barraquinhas e estoque
- Marketplace B2B com checkout e rastreamento
- Modelagem conceitual, lógica e física do banco
- Documentação conforme ABNT NBR 14724

### 1.3 Justificativa

Unificar gestão interna e compras externas em um único app, aproximando a experiência de apps de delivery.

### 1.4 Escopo

Arquitetura, frontend, backend e modelagem de dados. Fora do escopo: deploy produção e testes automatizados formais.

---

## 2 Metodologia e arquitetura

- **Mobile:** Expo 54, React Native 0.83, TypeScript
- **Backend:** Spring Boot 3.4, Java 17
- **Banco:** PostgreSQL 18
- **Comunicação:** HTTP/JSON, porta 8080

Diagramas em `diagramas/arquitetura-sistema.png` e `diagramas/fluxo-navegacao.png`.

Repositórios:
- https://github.com/LuanSantos26/Mobile
- https://github.com/LuanSantos26/QuickStock-BackEnd

---

## 3 Desenvolvimento

### 3.1 Frontend mobile

- **Navegação:** React Navigation Native Stack; gate auth em `App.tsx`
- **Contexts:** AuthContext, ProductsContext, BarraquinhasContext, PurchaseCartContext
- **Services:** auth, product, barraca, marketplace, endereco, formaPagamento, financeiro, notificacao
- **Telas:** Welcome, Login, Register, Home, Cart, StoreVitrine, ProductDetail, Sacola, PedidoAcompanhamento, AddItem, Barraquinhas, FormasPagamento, Configuracoes, Cards
- **Componentes:** ScreenHeader, BottomTabBar, HamburgerButton, modais de formulário

### 3.2 Backend API

- **Camadas:** Controller → Service → Repository → Entity
- **17 controllers** REST sob `/api/*`
- **JWT** no login; BCrypt para senhas
- **Regras:** pedido B2B com status `aguardando_liberacao` → `em_rota` após 20s (demo)

### 3.3 Banco de dados

#### 3.3.1 Modelo conceitual

Entidades de negócio: Perfil, Empresa, Usuário, Produto, Evento, Barraquinha, Estoque, Pedido PDV, Pagamento, Solicitação de Compra, Endereço, Forma de Pagamento.

Diagrama: `diagramas/er-conceitual.png`

#### 3.3.2 Modelo lógico

14 tabelas relacionais com PK surrogate e FKs. Empresa referenciada duas vezes em `solicitacoes_compra`. UNIQUE `(barraca_id, produto_id)` em `estoque_barraca`.

Diagrama: `diagramas/er-logico.png`

#### 3.3.3 Modelo físico

Implementação PostgreSQL via Hibernate (`ddl-auto=update`). Seed em `data.sql`. Dicionário completo de tabelas no arquivo Word gerado.

Tabelas: `perfis`, `empresas`, `usuarios`, `produtos`, `eventos`, `barracas`, `estoque_barraca`, `pedido`, `itens_pedido`, `pagamentos`, `enderecos_entrega`, `formas_pagamento_salvas`, `solicitacoes_compra`, `itens_solicitacao_compra`.

---

## 4 Conclusão

O QuickStock entrega gestão de estoque e marketplace B2B funcional. Limitações: JWT parcial, dados mock na Home/Carteira, notificações sem tabela, financeiro parcialmente sintético.

---

## Referências (ABNT NBR 6023)

- ABNT NBR 14724:2011 — Apresentação de trabalhos acadêmicos
- ABNT NBR 6023:2018 — Referências
- Expo Documentation — https://docs.expo.dev/
- React Native — https://reactnative.dev/
- Spring Boot — https://spring.io/projects/spring-boot
- PostgreSQL — https://www.postgresql.org/docs/
- ViaCEP — https://viacep.com.br/
