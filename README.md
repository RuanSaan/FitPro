# 💪 FitPro

> Comece sua jornada fitness com controle total na palma da sua mão.

FitPro é um aplicativo mobile de acompanhamento fitness desenvolvido com **React Native + Expo**, com autenticação e banco de dados em tempo real via **Supabase**.

---

## 📱 Telas

| Tela | Descrição |
|------|-----------|
| Login / Cadastro | Autenticação segura via Supabase Auth |
| Dashboard | Visão geral do progresso do usuário |
| Treinos | Registro e acompanhamento de treinos |
| Nutrição | Controle de refeições e alimentação |
| Metas | Definição e acompanhamento de objetivos |
| Perfil | Dados pessoais do usuário |
| Calculadora de Calorias | Cálculo de gasto calórico |
| Calculadora de IMC | Índice de Massa Corporal |

---

## 🚀 Tecnologias

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) — autenticação e banco de dados
- [Expo Router](https://expo.github.io/router/) — navegação baseada em arquivos
- [Zustand](https://zustand-demo.pmnd.rs/) — gerenciamento de estado
- [TanStack Query](https://tanstack.com/query) — data fetching e cache

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Expo CLI
- Conta no [Supabase](https://supabase.com/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/RuanSaan/FitPro.git
cd FitPro

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
```

### Rodando o projeto

```bash
npx expo start
```

Escaneie o QR Code com o app **Expo Go** no celular (Android) ou a câmera (iOS).

---

## 📁 Estrutura do projeto

```
FitPro/
├── assets/              # Ícones e imagens
├── src/
│   ├── lib/
│   │   └── supabase.ts  # Configuração do cliente Supabase
│   └── screens/
│       ├── auth/        # Login e Cadastro
│       ├── calculators/ # IMC e Calorias
│       ├── dashboard/   # Tela principal
│       ├── MetasScreen.tsx
│       ├── NutricaoScreen.tsx
│       ├── PerfilScreen.tsx
│       └── TreinosScreen.tsx
├── App.tsx
├── app.json
└── package.json
```

---

## 🔐 Segurança

- Autenticação gerenciada pelo Supabase Auth
- Variáveis de ambiente não versionadas (`.env` no `.gitignore`)
- Row Level Security (RLS) habilitado nas tabelas do Supabase

---

## 👨‍💻 Autor

Desenvolvido por **Ruan** — [github.com/RuanSaan](https://github.com/RuanSaan)
