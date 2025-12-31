# Avatares - Imagens PNG

Esta pasta contém as imagens PNG para customização de avatares.

## Estrutura de Pastas

```
public/avatars/
├── head/          # Acessórios para cabeça
└── body/          # Roupas/corpo
```

## Especificações das Imagens

### Formato
- **Tipo**: PNG com transparência
- **Tamanho recomendado**: 512x512 pixels
- **Fundo**: Transparente

### Nomenclatura dos Arquivos

#### Cabeça (`head/`)
- `cap.png` - Boné
- `crown.png` - Coroa
- `hat.png` - Chapéu
- `headphones.png` - Fone de ouvido

#### Corpo (`body/`)
- `default.png` - Padrão
- `suit.png` - Terno
- `shirt.png` - Camisa
- `jacket.png` - Jaqueta
- `hoodie.png` - Moletom

## Como Adicionar Novas Imagens

1. Crie a imagem PNG com fundo transparente (512x512px)
2. Salve na pasta correspondente (`head/` ou `body/`)
3. Adicione a configuração em `src/config/avatars.ts`:

```typescript
// Exemplo para adicionar um novo item de cabeça
head: [
  // ... outros itens
  { id: 'glasses', label: 'Óculos', path: '/avatars/head/glasses.png' },
]
```

## Dicas de Design

- Mantenha um estilo visual consistente entre todas as imagens
- Use cores que combinem com o design system da aplicação
- Certifique-se de que as imagens ficam boas quando sobrepostas
- Teste a visualização em diferentes tamanhos (sm, md, lg)

## Ferramentas Recomendadas

- **Figma** - Design de vetores
- **Photoshop** - Edição de imagens
- **GIMP** - Alternativa gratuita
- **Remove.bg** - Remover fundo de imagens
