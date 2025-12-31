# Scrum Rituals App

Aplicação web para equipes realizarem seus ritos do Scrum, incluindo ferramentas de priorização (RICE, Matriz de Eisenhower, GUT) e Scrum Poker com sessões compartilhadas em tempo real.

## Tecnologias

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Componentes**: Radix UI
- **Estado**: Zustand (com persist no localStorage)
- **Roteamento**: React Router DOM
- **Backend**: Firebase (Firestore + Realtime Database)
- **Estilo**: Tailwind CSS com design system customizado

## Características

- Sistema de identificação com nickname e avatar customizável
- Sessões compartilhadas em tempo real
- Expiração automática de sessões (24 horas)
- Persistência apenas no localStorage (sem cadastro complexo)
- Design responsivo com tema claro/escuro
- **Internacionalização**: Suporte para Português, Inglês e Espanhol

## Instalação

1. Clone o repositório

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Adicione suas credenciais do Firebase no arquivo `.env`:
```
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_DATABASE_URL=https://seu_projeto.firebaseio.com
```

## Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o **Firestore Database** (modo de produção)
3. Ative o **Realtime Database** (modo de teste)
4. Copie as credenciais do projeto para o arquivo `.env`

## Executar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Build para produção

```bash
npm run build
```

## Internacionalização

A aplicação suporta 3 idiomas:
- **Português (PT-BR)** - Idioma padrão
- **Inglês (EN-US)**
- **Espanhol (ES)**

O seletor de idioma está disponível no canto superior direito do header. O idioma selecionado é automaticamente salvo no navegador.

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/           # Componentes base (Button, Dialog, Input)
│   ├── layout/       # Layout (Header, Sidebar, Layout)
│   ├── LanguageSelector.tsx  # Seletor de idiomas
│   ├── AvatarCustomizer.tsx
│   └── WelcomeModal.tsx
├── pages/
│   ├── Rice.tsx           # Metodologia RICE
│   ├── Eisenhower.tsx     # Matriz 4x4
│   ├── Gut.tsx            # Matriz GUT
│   └── ScrumPoker.tsx     # Scrum Poker
├── services/
│   ├── firebase.ts        # Configuração Firebase
│   └── roomService.ts     # Serviços de sala
├── store/
│   ├── useUserStore.ts    # Estado do usuário
│   └── useRoomStore.ts    # Estado das salas
├── locales/
│   ├── pt/translation.json  # Traduções em português
│   ├── en/translation.json  # Traduções em inglês
│   └── es/translation.json  # Traduções em espanhol
├── types/
│   └── index.ts          # Tipos TypeScript
├── utils/
│   └── cn.ts             # Utilitários
└── i18n.ts               # Configuração i18next
```

## Funcionalidades

### Priorização

- **RICE**: Reach (Alcance), Impact (Impacto), Confidence (Confiança), Effort (Esforço)
- **Eisenhower**: Matriz 4x4 de urgência vs importância
- **GUT**: Gravidade, Urgência e Tendência

### Scrum Poker

- Criação de salas compartilhadas
- Link compartilhável para convidar participantes
- Votação em tempo real
- Revelação de votos
- Cálculo automático da média
- Sessões com expiração de 24h
