# Server Actions - Arquitetura Organizada por Domínio

Esta pasta contém todas as Server Actions organizadas por domínio de negócio.

## Estrutura

```
app/actions/
├── index.ts                      # Exportações centrais
├── practitioner/                 # Domínio: Profissionais
│   ├── create-practitioner.ts
│   ├── update-practitioner.ts
│   └── update-phone.ts
└── tracks/                       # Domínio: Trilhas
    ├── create-track.ts
    ├── create-template.ts
    └── upload-image.ts
```

## Como Usar

### Importação Direta
```typescript
import { updatePractitionerAction } from '@/app/actions/practitioner/update-practitioner'
```

### Importação Central
```typescript
import { updatePractitionerAction, createTrackAction } from '@/app/actions'
```

## Convenções

1. **Nomenclatura:** `[verbo][Dominio]Action` (ex: `updatePractitionerAction`)
2. **Server Directive:** Sempre começar com `"use server"`
3. **Error Handling:** Sempre retornar `{ success: boolean, error?: string, data?: any }`
4. **Tipos:** Definir interfaces/types específicos quando necessário
5. **Logs:** Incluir console.error para debug

## Domínios Atuais

### Practitioner
- **create-practitioner:** Criação de novos profissionais
- **update-practitioner:** Atualização de dados gerais (nome, bio, email, prefix)
- **update-phone:** Atualização específica de telefone

### Tracks
- **create-track:** Criação de trilhas completas
- **upload-image:** Upload de imagens padrão para trilhas
- **create-template:** Criação de templates "Como Funciona"

## Padrão de Retorno

Todas as Server Actions seguem o mesmo padrão:

```typescript
// Sucesso
{ success: true, data?: any }

// Erro
{ success: false, error: string }
``` 