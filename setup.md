vamos construir uma aplicação web que servirá para equipes realizarem seus ritos do scrum.

Fronted:
Vite, site estático, leve e perfoarmático.
Essa aplicação não terá tela de cadastro ou login, cada usuário que acessar vai colocar seu nickname e ter uma sessão iniciada em seu localStorage (otimize o projeto para este tipo de arquitetura).
A aplicação terá header e sidebar (com possibilidade de expansão ou retração).
O estilo deve ser inspirado nos arquivos de estilo que estão na pasta frontend, use como base, depois crie o projeto dentro desta pasta frontend.
Inicialmente teremos dois topicos na sidebar: Priorização (sub-itens "Metodologia RICE", "Matriz 4x4 (Eisenhower)" e "Matriz GUT") e Scrum Poker.
Usaremos a função Realtime Database para sessões compartilhadas.
Vamos implementar no momento da chegada do usuário um modal para ele se identificar, será o Nickname e a opção de customizar seu avatar, que será um boneco onde ele pode mudar os enfeites da cabeça, do corpo e das pernas.

A aplicação será serverless, ou seja, usando toda a parte de "persistencia" do firebase:

O banco será criado em firebase usando Firestore Database para dados estáticos e Realtime Database para sessões compartilhadas e taticas de dados temporários.
Gerenciar sessões compartilhadas, exemplo: SCRUM Poker, onde uma pessoa cria a sala, recebe uma URL com um código (id da sala), as pessoas acessam via navegador, colocam um nickname e começam a interagir em tempo real na mesma sessão, precisaremos de uma boa organização de onde é salvo cada tipo de dado.
Não teremos nenhum cadastro base complexo, o máximo de dados que precisamos é o nick e a customização do avatar, para exibir para os outros participantes das sessões compartilhadas.

Usaremos metodologia de expiração, cada sessão aberta dura no máximo 24horas, a unica persistencia de dados vai ser no localstorage do usuario.

Use a seguinte sequencia de componentes para se inspirar.
"dependencies": {
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-progress": "^1.1.8",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.8",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-tooltip": "^1.0.7",
    "axios": "^1.6.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "i18next": "^23.7.11",
    "i18next-browser-languagedetector": "^8.2.0",
    "i18next-http-backend": "^3.0.2",
    "lucide-react": "^0.303.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^14.0.0",
    "react-router-dom": "^6.21.1",
    "recharts": "^2.10.3",
    "sonner": "^2.0.7",
    "tailwind-merge": "^2.2.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.16.0",
    "@typescript-eslint/parser": "^6.16.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.3.3",
    "vite": "^5.0.10"
  }
