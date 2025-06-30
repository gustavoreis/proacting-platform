# Setup do Projeto - Tracks Bio OMS V0

## 🚀 Migração Completa Vite/Remix → Next.js

Este projeto foi migrado com sucesso do Vite/Remix para Next.js 15, mantendo todas as funcionalidades originais e removendo completamente os dados mock.

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Acesso ao Supabase (banco de dados)
- Acesso ao Sanity CMS
- Serviço de autenticação configurado

## ⚙️ Configuração das Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_supabase

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id_sanity
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2021-08-31
SANITY_TOKEN=seu_token_sanity

# Authentication URLs
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (Opcional)
NEXT_PUBLIC_GA_TRACKING_ID=seu_google_analytics_id
```

## 🏗️ Instalação e Execução

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar build de produção
npm start
```

## 📁 Estrutura de Arquivos Migrados

### **Clientes de API:**
- `lib/supabase.ts` - Cliente Supabase
- `lib/sanity.ts` - Cliente Sanity CMS
- `lib/orders.ts` - Serviço de orders/pedidos
- `lib/auth.ts` - Sistema de autenticação
- `lib/converter.ts` - Utilitários de conversão
- `lib/analytics.ts` - Google Analytics

### **Hooks e Estado:**
- `hooks/use-orders.ts` - Hook principal de orders (sem mock)
- `hooks/use-protocols.ts` - Hook principal de protocolos (sem mock)
- `hooks/use-real-orders.ts` - Hook com dados reais do Supabase
- `hooks/use-real-protocols.ts` - Hook com dados reais do Sanity
- `contexts/AuthContext.tsx` - Context de autenticação global

### **Componentes e UI:**
- `components/auth-guard.tsx` - Proteção de rotas
- `lib/adapters.ts` - Adaptadores de dados para UI
- Todas as páginas protegidas com AuthGuard

### **Tipos TypeScript:**
- `types/order.ts` - Tipos reais + compatibilidade
- `types/protocol.ts` - Tipos do Sanity + compatibilidade

## 🔄 Funcionalidades Migradas

### ✅ **Sistema de Autenticação**
- Login/logout funcionais
- Proteção automática de rotas
- Refresh token automático
- Context reativo global

### ✅ **Orders/Atendimentos**
- Busca real no Supabase
- Filtros funcionais
- Detalhes de pedidos
- Timeline de status

### ✅ **Protocolos/Tracks**
- Dados do Sanity CMS
- Criação e edição
- Upload de imagens
- Biomarkers e FAQ

### ✅ **UI/UX**
- Design system mantido
- Componentes modernos
- Responsive design
- Loading states

## 🧪 Testes

Para testar a migração:

1. **Configure as variáveis de ambiente**
2. **Rode o projeto:** `npm run dev`
3. **Acesse:** `http://localhost:3000`
4. **Teste login/logout**
5. **Verifique dados nas páginas de Orders e Protocolos**

## 🚨 Troubleshooting

### Erro de Autenticação:
- Verifique se o serviço de auth está rodando
- Confirme as URLs de AUTH_URL e APP_URL

### Erro no Supabase:
- Confirme as credenciais do Supabase
- Verifique se as tabelas existem (orders, line_items, buyers)

### Erro no Sanity:
- Confirme PROJECT_ID e DATASET
- Verifique se o token tem permissões adequadas

## 📈 Performance

- **Code splitting** automático do Next.js
- **Server Components** onde aplicável
- **Client Components** para interatividade
- **Lazy loading** implementado

## 🔒 Segurança

- **Middleware de autenticação** do Next.js
- **Variáveis server-side** protegidas
- **Tokens** gerenciados de forma segura
- **CORS** configurado adequadamente

---

**Status:** ✅ **MIGRAÇÃO COMPLETA - READY FOR PRODUCTION** 