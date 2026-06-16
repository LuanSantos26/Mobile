# 📱 QuickStock - Mobile App

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

O **QuickStock Mobile** é a interface front-end móvel do ecossistema QuickStock. Desenvolvido com **React Native** e **Expo**, o aplicativo foi projetado para gerenciar estoques descentralizados, vendas em eventos, controle de barraquinhas e fluxo de pagamentos de forma ágil e intuitiva. 

Este aplicativo consome a [API REST do QuickStock Backend](https://github.com/luansantos26/quickstock-backend).

---

## 🚀 Funcionalidades

O aplicativo atende tanto à gestão operacional quanto ao usuário final, possuindo fluxos completos de:

* **🔒 Autenticação e Perfis:** Login seguro, cadastro de usuários e registro de empresas.
* **🎪 Gestão de Eventos e Barracas:** Acompanhamento de estoques fracionados distribuídos por pontos de venda físicos.
* **🛍️ Vitrine e Carrinho (Sacola):** Navegação fluida por produtos, adição à sacola e revisão de itens.
* **💳 Checkout e Pagamentos:** Suporte a múltiplas formas de pagamento, integração com Pix, cadastro de cartões para compras futuras e revisão de faturamento.
* **📦 Acompanhamento de Pedidos:** Histórico e status das compras em tempo real.
* **⚙️ Gestão de Conta:** Configurações de usuário, gerenciamento de endereços de entrega e notificações.

---

## 🛠️ Tecnologias Utilizadas

* **Framework Principal:** React Native
* **Ecossistema/Build:** Expo
* **Linguagem:** TypeScript
* **Gerenciamento de Estado:** React Context API (Auth, Cart, Products, Barraquinhas)
* **Navegação:** React Navigation (Padrão de navegação por Tabs e Stacks)
* **Comunicação com API:** Axios / Fetch API (`src/config/api.ts`)

---

## 📁 Estrutura do Projeto

O código-fonte segue uma arquitetura baseada em features e separação de responsabilidades:

```text
📦 mobile
 ┣ 📂 assets/              # Ícones, splash screens e imagens estáticas
 ┣ 📂 docs/                # Documentação técnica e diagramas do sistema
 ┣ 📂 src/
 ┃ ┣ 📂 components/        # Componentes UI reutilizáveis (Botões, Modais, Cards, Gráficos)
 ┃ ┣ 📂 config/            # Configurações globais (ex: baseURL da API)
 ┃ ┣ 📂 context/           # Contextos globais (AuthContext, PurchaseCartContext, etc.)
 ┃ ┣ 📂 hooks/             # Custom hooks do React
 ┃ ┣ 📂 screens/           # Telas completas da aplicação (Login, HomeScreen, Checkout, etc.)
 ┃ ┣ 📂 services/          # Integrações com o Backend (APIs, Storage Local)
 ┃ ┣ 📂 theme/             # Variáveis de estilo, paleta de cores e tipografia
 ┃ ┗ 📂 utils/             # Funções auxiliares (Máscaras, formatação de datas, utilitários Pix)
 ┣ 📜 App.tsx              # Componente raiz da aplicação
 ┣ 📜 app.json             # Configuração do Expo (nome, ícones, splash)
 ┗ 📜 package.json         # Dependências do projeto e scripts
⚙️ Pré-requisitos
Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

Node.js (Versão LTS recomendada)

Git

Expo CLI (npm install -g expo-cli)

Um emulador Android/iOS configurado ou o aplicativo Expo Go instalado no seu smartphone físico.

Aviso: Certifique-se de que o QuickStock Backend esteja rodando localmente ou hospedado para que o aplicativo consiga realizar o login e carregar os dados.

🚀 Como Executar o Projeto
1. Clone o repositório

Bash
git clone [https://github.com/luansantos26/quickstock-mobile.git](https://github.com/luansantos26/quickstock-mobile.git)
cd quickstock-mobile
2. Instale as dependências

Bash
npm install
3. Configure as Variáveis de Ambiente / API
Navegue até o arquivo de configuração da API (src/config/api.ts ou similar) e certifique-se de que o IP base aponte para o seu servidor backend local.
Dica: Se estiver rodando em um dispositivo físico, use o IP da sua máquina na rede Wi-Fi (ex: http://192.168.0.xxx:8080) e não localhost.

4. Inicie o servidor do Expo

Bash
npx expo start
Pressione a para abrir no emulador Android.

Pressione i para abrir no simulador iOS.

Ou escaneie o QR Code gerado no terminal usando o aplicativo Expo Go no seu celular.

📑 Scripts Disponíveis
No diretório do projeto, você pode rodar:

npm start: Inicia o empacotador Metro via Expo.

npm run android: Tenta iniciar o aplicativo diretamente em um emulador Android conectado.

npm run ios: Tenta iniciar o aplicativo diretamente no simulador iOS (requer macOS).

💡 Notas de Desenvolvimento
Padrão de Cores: O tema principal está centralizado em src/theme/theme.ts. Alterações de UI devem sempre herdar deste arquivo para manter a consistência visual.

Gerenciamento de Imagens: O app possui o utilitário imageFallback.ts e RemoteImage.tsx para lidar graciosamente com falhas no carregamento de imagens de produtos via API.

Diagramas: Na pasta docs/diagramas/ estão disponíveis mapas mentais e modelos de entidade-relacionamento lógicos e conceituais do ecossistema.

Feito com ☕ e muito código.
